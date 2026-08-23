/**
 * ALANYA TOUR ORGANIZATIONS — VERCEL-ONLY LANGUAGE INJECTOR
 *
 * Source-safety contract:
 * 1) Refuses to run on a normal local machine.
 * 2) Preflight-verifies every existing registered HTML against the approved SHA-256 manifest.
 * 3) Only after the entire preflight passes, inserts ONE loader tag into Vercel's temporary checkout.
 * 4) Git/source HTML is never committed or rewritten by this script.
 * 5) Runtime hash verification strips only this exact approved build marker before comparing hashes.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import crypto from 'node:crypto';

const ROOT=process.cwd();
const MANIFEST=path.join(ROOT,'ato-language-layer','manifest.json');
const LIVE=path.join(ROOT,'ato-language-layer','runtime','ato-language-live.js');
const CORE=path.join(ROOT,'ato-language-layer','runtime','ato-language-layer.js');
const INJECT=Buffer.from('<!-- ATO-LANGUAGE-BUILD-INJECT --><script src="/ato-language-layer/runtime/ato-language-live.js" data-ato-language-build="1"></script>\n','utf8');
const MARKER=Buffer.from('data-ato-language-build="1"','utf8');

function sha256(buf){ return crypto.createHash('sha256').update(buf).digest('hex'); }
async function exists(p){ try{await fs.access(p);return true}catch{return false} }
function asciiLower(buf){
  const out=Buffer.from(buf);
  for(let i=0;i<out.length;i++){ const b=out[i]; if(b>=65&&b<=90) out[i]=b+32; }
  return out;
}
function insertionIndex(buf){
  const low=asciiLower(buf);
  let i=low.lastIndexOf(Buffer.from('</body>'));
  if(i>=0) return i;
  i=low.lastIndexOf(Buffer.from('</html>'));
  return i;
}
function injectBytes(buf,page){
  if(buf.includes(MARKER)) return {buf,status:'already-injected'};
  const i=insertionIndex(buf);
  if(i<0) throw new Error(`ATO Language: no </body> or </html> in ${page}`);
  return {buf:Buffer.concat([buf.subarray(0,i),INJECT,buf.subarray(i)]),status:'injected'};
}

async function main(){
  if(!process.env.VERCEL && process.env.ATO_ALLOW_LOCAL_BUILD!=='1'){
    throw new Error('ATO Language safety: this script is Vercel-build-only. Local source HTML was NOT touched.');
  }
  for(const required of [MANIFEST,LIVE,CORE]){
    if(!(await exists(required))) throw new Error(`ATO Language safety: required file missing: ${path.relative(ROOT,required)}`);
  }
  const manifest=JSON.parse(await fs.readFile(MANIFEST,'utf8'));
  const pages=Array.isArray(manifest.pages)?manifest.pages:[];
  if(!pages.length) throw new Error('ATO Language safety: manifest contains no registered pages.');

  // Phase 1 — atomic preflight. Do not write anything until ALL existing pages are approved.
  const plan=[];
  const missing=[];
  const mismatches=[];
  for(const meta of pages){
    const rel=String(meta?.path||'').replace(/^\/+/, '');
    if(!rel.toLowerCase().endsWith('.html')) continue;
    const file=path.join(ROOT,...rel.split('/'));
    if(!(await exists(file))){ missing.push(rel); continue; }
    const original=await fs.readFile(file);
    const actual=sha256(original);
    if(actual!==meta.approved_sha256){
      mismatches.push({page:rel,expected:meta.approved_sha256,actual});
      continue;
    }
    const next=injectBytes(original,rel);
    plan.push({file,rel,next});
  }
  if(mismatches.length){
    console.error('[ATO Language] SAFETY STOP. Approved HTML mismatch:');
    for(const x of mismatches) console.error(` - ${x.page}\n   expected ${x.expected}\n   actual   ${x.actual}`);
    throw new Error(`ATO Language safety: ${mismatches.length} approved HTML file(s) differ from manifest. No HTML was changed.`);
  }

  // Phase 2 — Vercel temporary checkout only.
  let injected=0,already=0;
  for(const item of plan){
    await fs.writeFile(item.file,item.next.buf);
    if(item.next.status==='injected') injected++; else already++;
  }

  console.log(`[ATO Language] SAFE BUILD OK: registered=${pages.length}; injected=${injected}; already=${already}; missing=${missing.length}`);
  if(missing.length) console.warn('[ATO Language] Registered page(s) absent from this checkout:',missing.join(', '));
  console.log('[ATO Language] These changes exist only in Vercel temporary build checkout. Git/source HTML remains unchanged.');
}

main().catch(err=>{ console.error(err?.stack||err); process.exit(1); });
