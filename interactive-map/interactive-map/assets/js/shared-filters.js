(function(){
  'use strict';
  const KEY='alanyaTourFilters';
  const defaults={
    category:'all',
    maxPrice:'all',
    duration:'all',
    hotelTransfer:false,
    familyFriendly:false,
    privateTour:false,
    search:'',
    selectedTags:[]
  };
  const normalize=value=>({
    ...defaults,
    ...(value&&typeof value==='object'?value:{}),
    selectedTags:Array.isArray(value?.selectedTags)?[...new Set(value.selectedTags.map(String))]:[]
  });
  function read(){
    try{return normalize(JSON.parse(localStorage.getItem(KEY)||'{}'));}
    catch{return normalize({});}
  }
  function emit(value){
    window.dispatchEvent(new CustomEvent('alanyaFiltersChanged',{detail:value}));
  }
  function write(next){
    const value=normalize({...read(),...(next||{})});
    localStorage.setItem(KEY,JSON.stringify(value));
    emit(value);
    return value;
  }
  function reset(){
    const value=normalize({});
    localStorage.setItem(KEY,JSON.stringify(value));
    emit(value);
    return value;
  }
  function subscribe(fn){
    if(typeof fn!=='function')return()=>{};
    const local=e=>fn(normalize(e.detail));
    const storage=e=>{if(e.key===KEY)fn(read());};
    window.addEventListener('alanyaFiltersChanged',local);
    window.addEventListener('storage',storage);
    fn(read());
    return()=>{
      window.removeEventListener('alanyaFiltersChanged',local);
      window.removeEventListener('storage',storage);
    };
  }
  window.AlanyaFilters={key:KEY,defaults:{...defaults},get:read,set:write,reset,subscribe};
})();
