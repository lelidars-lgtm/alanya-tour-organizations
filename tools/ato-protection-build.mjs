import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  ROOT, BASELINE_FILE, walk, isImage, rel, hashFile, metadata, isLikelyPhoto,
  assetId, forensicSvg, visibleDownloadSvg, xmpPacket, writeSameFormat, SKIP_DIRS
} from "./ato-media-common.mjs";

const DIST = path.join(ROOT, ".ato-dist");
const CHECK_ONLY = process.argv.includes("--check-only");
const LOADER = '<script defer src="/assets/protection/ato-web-protection.js?v=20260824v8fixed"></script>';
const MARKER = "ato-web-protection.js";
const EARLY_COPY_LOCK = String.raw`
<style id="ato-copy-lock-early">
html,body,body *,body *::before,body *::after{
  -webkit-user-select:none!important;-moz-user-select:none!important;
  -ms-user-select:none!important;user-select:none!important;
  -webkit-touch-callout:none!important
}
input,textarea,select,option,[contenteditable="true"],.ato-allow-select,.ato-allow-select *{
  -webkit-user-select:text!important;-moz-user-select:text!important;
  -ms-user-select:text!important;user-select:text!important;
  -webkit-touch-callout:default!important
}
img,picture,video,canvas,svg,source{-webkit-user-drag:none!important;user-drag:none!important}
::selection{background:transparent!important}::-moz-selection{background:transparent!important}
</style>
<script id="ato-copy-lock-early-script">
(function(){"use strict";
var editable=function(n){var e=n&&n.nodeType===1?n:n&&n.parentElement;return !!(e&&e.closest&&e.closest('input,textarea,select,option,[contenteditable="true"],.ato-allow-select'));};
var stop=function(e){if(editable(e.target))return;try{e.preventDefault()}catch(_){}try{e.stopImmediatePropagation()}catch(_){}try{e.stopPropagation()}catch(_){}if(e.clipboardData){try{e.clipboardData.setData("text/plain","")}catch(_){}try{e.clipboardData.setData("text/html","")}catch(_){}}return false;};
["copy","cut","contextmenu","selectstart","dragstart","beforecopy"].forEach(function(t){document.addEventListener(t,stop,true);window.addEventListener(t,stop,true);});
document.addEventListener("selectionchange",function(){if(editable(document.activeElement))return;var s=window.getSelection&&window.getSelection();if(s&&!s.isCollapsed){try{s.removeAllRanges()}catch(_){}}},true);
document.addEventListener("keydown",function(e){if(editable(e.target))return;var m=e.ctrlKey||e.metaKey,k=String(e.key||"").toLowerCase();if((m&&["a","c","x","s","p","u"].indexOf(k)!==-1)||k==="f12"||(m&&e.shiftKey&&["i","j","c"].indexOf(k)!==-1))stop(e);},true);
})();</script>`;

const INTERNAL_SKIP_FILES = new Set([
  "ATO-MEDIA-BASELINE.json","ATO-ACTIVE-FILES-LINK-MAP.json","ATO-ACTIVE-FILES-LINK-MAP.txt",
  "ATO-AUTO-PROTECTION-SPEC.json","ATO-PROTECTION-CHECK.py","ATO-PROTECTION-LINKER.py",
  "ATO-VERCEL-SECURITY.fragment.json","ATO-VERCEL-WAF-RULES.txt","README-FIRST.txt",
  "README-AUTO-FUTURE-FIRST.txt","README-AUTO-MEDIA-FIRST.txt","README-V8-INSTALL-AND-TEST.txt",
  "ATO-V8-COMPLETE-SPEC.json","ATO-V8-FILE-MANIFEST.json","ATO-V8-FILE-MANIFEST.txt",
  "ATO-V8-INTEGRITY-CHECK.json","ATO-V8-MANIFEST-NOTE.txt","ATO-V8-REVIEW-MAP.txt",
  "ATO-V8-STATUS-READ-FIRST.txt","package.json","package-lock.json","vercel.json"
]);

function isLimitedHtml(relPath){
  const p=("/"+relPath.toLowerCase()).replace(/\/+/g,"/");
  return p.includes("/booking-manager/")||p.endsWith("/e-ticket.html")||p==="/e-ticket.html"||p.includes("/admin/");
}
function injectProtection(html,relPath){
  const parts=[];
  if(!isLimitedHtml(relPath)&&!html.includes("ato-copy-lock-early"))parts.push(EARLY_COPY_LOCK);
  if(!html.includes(MARKER))parts.push(LOADER);
  if(!parts.length)return html;
  const payload=parts.join("\n")+"\n",lower=html.toLowerCase(),headEnd=lower.lastIndexOf("</head>");
  if(headEnd>=0)return html.slice(0,headEnd)+payload+html.slice(headEnd);
  const body=lower.indexOf("<body");
  return body>=0?html.slice(0,body)+payload+html.slice(body):payload+html;
}
function shouldSkipSource(relPath){
  const first=relPath.split("/")[0];
  if(SKIP_DIRS.has(first)||first==="tools"||INTERNAL_SKIP_FILES.has(relPath))return true;
  if(!relPath.includes("/")&&(relPath.startsWith("ATO-")||relPath.startsWith("README")))return true;
  return relPath.startsWith("_ato-private/");
}
function copyRaw(src,dst){fs.mkdirSync(path.dirname(dst),{recursive:true});fs.copyFileSync(src,dst);}

if(!fs.existsSync(BASELINE_FILE))throw new Error("ATO-MEDIA-BASELINE.json is missing. Run npm run ato:baseline once.");
const baseline=JSON.parse(fs.readFileSync(BASELINE_FILE,"utf8")),baseAssets=baseline.assets||{};
const all=walk(ROOT).sort();
const htmls=all.filter(f=>f.toLowerCase().endsWith(".html")&&!shouldSkipSource(rel(f)));
const imageFiles=all.filter(f=>isImage(f)&&!shouldSkipSource(rel(f)));
if(CHECK_ONLY){console.log(JSON.stringify({htmlDetected:htmls.length,imagesDetected:imageFiles.length,baselineImages:Object.keys(baseAssets).length},null,2));process.exit(0);}

fs.rmSync(DIST,{recursive:true,force:true});fs.mkdirSync(DIST,{recursive:true});
let htmlProtected=0,currentCopied=0,futureProtected=0,uiCopied=0,downloads=0;
const manifest=[];
for(const src of all){
  const r=rel(src);if(shouldSkipSource(r)||isImage(src))continue;
  const dst=path.join(DIST,r);
  if(r.toLowerCase().endsWith(".html")){fs.mkdirSync(path.dirname(dst),{recursive:true});fs.writeFileSync(dst,injectProtection(fs.readFileSync(src,"utf8"),r),"utf8");htmlProtected++;}
  else copyRaw(src,dst);
}
for(const src of imageFiles){
  const r=rel(src),dst=path.join(DIST,r),dl=path.join(DIST,"_ato-download",r),ext=path.extname(src).toLowerCase();
  const hash=hashFile(src),base=baseAssets[r],approved=!!base&&base.sha256===hash,m=await metadata(src),photo=isLikelyPhoto(m,src),id=assetId(r,hash);
  if(!photo||ext===".gif"){copyRaw(src,dst);uiCopied++;manifest.push({path:r,mode:"ui-or-gif-pass-through",protectedDownload:false});continue;}
  if(approved){copyRaw(src,dst);currentCopied++;}else{const preview=sharp(src,{limitInputPixels:false}).composite([{input:forensicSvg(m.width,m.height,id),blend:"over"}]).withMetadata({xmp:xmpPacket(id,r)});await writeSameFormat(preview,dst,ext);futureProtected++;}
  const protectedDownload=sharp(src,{limitInputPixels:false}).composite([{input:visibleDownloadSvg(m.width,m.height),blend:"over"}]).withMetadata({xmp:xmpPacket(id,r)});
  await writeSameFormat(protectedDownload,dl,ext);downloads++;manifest.push({path:r,mode:approved?"approved-preview-unchanged":"future-forensic-preview",protectedDownload:"/_ato-download/"+r,assetId:id});
}
const deployedHtml=walk(DIST).filter(f=>f.toLowerCase().endsWith(".html")),unprotected=[],missingEarlyLock=[];
for(const file of deployedHtml){const r=path.relative(DIST,file).split(path.sep).join("/"),html=fs.readFileSync(file,"utf8");if(!html.includes(MARKER))unprotected.push(r);if(!isLimitedHtml(r)&&!html.includes("ato-copy-lock-early"))missingEarlyLock.push(r);}
if(unprotected.length||missingEarlyLock.length)throw new Error("FAIL-CLOSED: "+JSON.stringify({unprotected,missingEarlyLock}));
const mapPath=path.join(DIST,"assets","protection","ato-media-map.json");fs.mkdirSync(path.dirname(mapPath),{recursive:true});fs.writeFileSync(mapPath,JSON.stringify({generatedAt:new Date().toISOString(),assets:manifest},null,2)+"\n","utf8");
console.log("ATO COMPLETE PROTECTION V8 — TOTAL PUBLIC LOCK");
console.log(`HTML protected in deployment copy: ${htmlProtected}`);
console.log(`Approved current photos copied unchanged: ${currentCopied}`);
console.log(`New/changed photos forensic-protected: ${futureProtected}`);
console.log(`Protected visible-download copies: ${downloads}`);
console.log(`UI/GIF files copied without photo processing: ${uiCopied}`);
console.log(`Unprotected deployed HTML: ${unprotected.length}`);
console.log(`Public HTML missing early copy lock: ${missingEarlyLock.length}`);
