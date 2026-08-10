(() => {
  'use strict';
  const cfg = window.ATO_CONFIG || {};
  let client = null;

  function configured(){
    return Boolean(cfg.supabaseUrl && cfg.supabasePublishableKey && window.supabase?.createClient);
  }
  function getClient(){
    if(!configured()) return null;
    if(!client) client = window.supabase.createClient(cfg.supabaseUrl, cfg.supabasePublishableKey, {
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    return client;
  }
  function cleanPhone(v){ return String(v||'').replace(/\D/g,''); }
  function ticketUrl(token,index=0){
    const base=(cfg.siteBaseUrl||location.origin).replace(/\/$/,'');
    return `${base}/e-ticket.html?token=${encodeURIComponent(token)}&tour=${Number(index)||0}`;
  }
  async function createTripRequest(payload){
    const db=getClient();
    if(!db) return {configured:false,local:true,data:null,error:null};
    const {data,error}=await db.rpc('create_trip_request',{p_payload:payload});
    if(error) throw error;
    return {configured:true,local:false,data,error:null};
  }
  async function getPublicBooking(token){
    const db=getClient();
    if(!db) return {configured:false,data:null,error:null};
    const {data,error}=await db.rpc('get_public_booking',{p_token:token});
    if(error) throw error;
    return {configured:true,data,error:null};
  }
  async function signIn(email,password){
    const db=getClient(); if(!db) throw new Error('Supabase is not configured.');
    const {data,error}=await db.auth.signInWithPassword({email,password});
    if(error) throw error; return data;
  }
  async function signOut(){ const db=getClient(); if(db) await db.auth.signOut(); }
  async function session(){ const db=getClient(); if(!db)return null; const {data}=await db.auth.getSession(); return data?.session||null; }
  async function listBookings(){
    const db=getClient(); if(!db) throw new Error('Supabase is not configured.');
    const {data,error}=await db.from('trip_bookings').select('*').order('created_at',{ascending:false}).limit(100);
    if(error) throw error; return data||[];
  }
  async function updateBooking(id,patch){
    const db=getClient(); if(!db) throw new Error('Supabase is not configured.');
    const {data,error}=await db.from('trip_bookings').update(patch).eq('id',id).select().single();
    if(error) throw error; return data;
  }
  window.ATOBooking={configured,getClient,createTripRequest,getPublicBooking,signIn,signOut,session,listBookings,updateBooking,ticketUrl,cleanPhone};
})();
