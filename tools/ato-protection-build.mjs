import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {
  ROOT, BASELINE_FILE, walk, isImage, rel, hashFile, metadata, isLikelyPhoto,
  assetId, forensicSvg, visibleDownloadSvg, xmpPacket, writeSameFormat, SKIP_DIRS
} from "./ato-media-common.mjs";

const DIST = path.join(ROOT, ".ato-dist");
const CHECK_ONLY = process.argv.includes("--check-only");
const LOADER = '<script defer src="/assets/protection/ato-web-protection.js?v=20260823"></script>';
const MARKER = "ato-web-protection.js";
const EARLY_COPY_LOCK = String.raw`
<style id="ato-copy-lock-early">
html,body,body *{
  -webkit-user-select:none!important;
  -moz-user-select:none!important;
  user-select:none!important;
  -webkit-touch-callout:none!important
}
input,textarea,select,[contenteditable="true"],.ato-allow-select,.ato-allow-select *{
  -webkit-user-select:text!important;
  -moz-user-select:text!important;
  user-select:text!important;
  -webkit-touch-callout:default!important
}
img,picture,video,canvas,svg{
  -webkit-user-drag:none!important;
  user-drag:none!important
}
::selection{background:transparent!important}
::-moz-selection{background:transparent!important}
</style>
<script id="ato-copy-lock-early-script">
(function(){
  "use strict";
  var editable=function(n){
    return !!(n&&n.closest&&n.closest('input,textarea,select,[contenteditable="true"],.ato-allow-select'));
  };
  var stop=function(e){
    if(editable(e.target))return;
    try{e.preventDefault();}catch(_){}
    try{e.stopImmediatePropagation();}catch(_){}
    if(e.clipboardData){
      try{e.clipboardData.setData("text/plain","");}catch(_){}
      try{e.clipboardData.setData("text/html","");}catch(_){}
    }
    return false;
  };
  ["copy","cut","contextmenu","selectstart","dragstart","beforecopy"].forEach(function(type){
    document.addEventListener(type,stop,true);
  });
  document.addEventListener("selectionchange",function(){
    if(editable(document.activeElement))return;
    var s=window.getSelection&&window.getSelection();
    if(s&&!s.isCollapsed){try{s.removeAllRanges();}catch(_){}}
  },true);
  document.addEventListener("keydown",function(e){
    if(editable(e.target))return;
    var mod=e.ctrlKey||e.metaKey;
    var k=String(e.key||"").toLowerCase();
    if(mod&&["a","c","x","s","p"].indexOf(k)!==-1)stop(e);
  },true);
})();
</script>`;

const INTERNAL_SKIP_FILES = new Set([
  "ATO-MEDIA-BASELINE.json", "ATO-ACTIVE-FILES-LINK-MAP.json", "ATO-ACTIVE-FILES-LINK-MAP.txt",
  "ATO-AUTO-PROTECTION-SPEC.json", "ATO-PROTECTION-CHECK.py", "ATO-PROTECTION-LINKER.py",
  "ATO-VERCEL-SECURITY.fragment.json", "ATO-VERCEL-WAF-RULES.txt", "README-FIRST.txt",
  "README-AUTO-FUTURE-FIRST.txt", "README-AUTO-MEDIA-FIRST.txt", "package.json", "package-lock.json",
  "vercel.json"
]);


function isLimitedHtml(relPath) {
  const p = ("/" + relPath.toLowerCase()).replace(/\/+/g, "/");
  return p.includes("/booking-manager/") ||
         p.endsWith("/e-ticket.html") ||
         p === "/e-ticket.html" ||
         p.includes("/admin/");
}

function injectLoader(text, relPath) {
  const limited = isLimitedHtml(relPath);
  const pieces = [];
  if (!limited && !text.includes("ato-copy-lock-early")) pieces.push(EARLY_COPY_LOCK);
  if (!text.includes(MARKER)) pieces.push(LOADER);
  if (!pieces.length) return text;

  const payload = pieces.join("
") + "
";
  const lower = text.toLowerCase();
  const idx = lower.lastIndexOf("</head>");
  if (idx >= 0) return text.slice(0, idx) + payload + text.slice(idx);

  const body = lower.indexOf("<body");
  if (body >= 0) return text.slice(0, body) + payload + text.slice(body);
  return payload + text;
}
function shouldSkipSource(relPath) {
  const first = relPath.split("/")[0];
  if (SKIP_DIRS.has(first) || first === "tools") return true;
  if (INTERNAL_SKIP_FILES.has(relPath)) return true;
  if (!relPath.includes("/") && (relPath.startsWith("ATO-") || relPath.startsWith("README"))) return true;
  if (relPath.startsWith("_ato-private/")) return true;
  return false;
}
function copyRaw(src, dst) { fs.mkdirSync(path.dirname(dst), {recursive:true}); fs.copyFileSync(src,dst); }
function loadBaseline() {
  if (!fs.existsSync(BASELINE_FILE)) throw new Error("ATO-MEDIA-BASELINE.json is missing. Run: npm run ato:baseline ONCE before first deployment.");
  return JSON.parse(fs.readFileSync(BASELINE_FILE,"utf8"));
}

const baseline = loadBaseline();
const baseAssets = baseline.assets || {};
const all = walk(ROOT).sort();
const htmls = all.filter(f => f.toLowerCase().endsWith(".html") && !shouldSkipSource(rel(f)));
const imageFiles = all.filter(f => isImage(f) && !shouldSkipSource(rel(f)));

if (CHECK_ONLY) {
  console.log(JSON.stringify({htmlDetected:htmls.length, imagesDetected:imageFiles.length, baselineImages:Object.keys(baseAssets).length}, null, 2));
  process.exit(0);
}

fs.rmSync(DIST, {recursive:true, force:true});
fs.mkdirSync(DIST, {recursive:true});

let htmlProtected=0, currentCopied=0, futureProtected=0, uiCopied=0, downloads=0, gifCopied=0;
const manifest=[];

// Copy non-image files; HTML is protected only in this temporary deployment copy.
for (const src of all) {
  const r = rel(src);
  if (shouldSkipSource(r) || isImage(src)) continue;
  const dst = path.join(DIST, r);
  if (r.toLowerCase().endsWith(".html")) {
    const original = fs.readFileSync(src,"utf8");
    fs.mkdirSync(path.dirname(dst), {recursive:true});
    fs.writeFileSync(dst, injectLoader(original, r), "utf8");
    htmlProtected++;
  } else copyRaw(src,dst);
}

for (const src of imageFiles) {
  const r = rel(src);
  const dst = path.join(DIST, r);
  const dl = path.join(DIST, "_ato-download", r);
  const ext = path.extname(src).toLowerCase();
  const hash = hashFile(src);
  const base = baseAssets[r];
  const isApprovedCurrent = !!base && base.sha256 === hash;
  const m = await metadata(src);
  const photo = isLikelyPhoto(m, src);
  const id = assetId(r,hash);

  if (!photo || ext === ".gif") {
    copyRaw(src,dst);
    uiCopied++;
    if (ext === ".gif") gifCopied++;
    manifest.push({path:r, mode:"ui-or-gif-pass-through", protectedDownload:false});
    continue;
  }

  if (isApprovedCurrent) {
    // ABSOLUTELY NO visual/byte change to already-approved site photos.
    copyRaw(src,dst);
    currentCopied++;
  } else {
    // Future or changed photo: clean-looking preview with near-invisible forensic micro-mark + XMP ownership.
    const p = sharp(src, {limitInputPixels:false});
    const preview = p.composite([{input: forensicSvg(m.width,m.height,id), blend:"over"}]).withMetadata({xmp:xmpPacket(id,r)});
    await writeSameFormat(preview,dst,ext);
    futureProtected++;
  }

  // Separate visible-watermark version for normal/direct download flows.
  const dlp = sharp(src, {limitInputPixels:false})
    .composite([{input: visibleDownloadSvg(m.width,m.height), blend:"over"}])
    .withMetadata({xmp:xmpPacket(id,r)});
  await writeSameFormat(dlp,dl,ext);
  downloads++;
  manifest.push({path:r, mode:isApprovedCurrent?"approved-preview-unchanged":"future-forensic-preview", protectedDownload:"/_ato-download/"+r, assetId:id});
}

// Verify every deployed HTML is protected; fail closed.
const deployedHtml = walk(DIST).filter(f => f.toLowerCase().endsWith(".html"));
const unprotected=[];
const missingEarlyLock=[];
for (const f of deployedHtml) {
  const deployedRel = path.relative(DIST,f).split(path.sep).join("/");
  const t=fs.readFileSync(f,"utf8");
  if(!t.includes(MARKER)) unprotected.push(deployedRel);
  if(!isLimitedHtml(deployedRel) && !t.includes("ato-copy-lock-early")) missingEarlyLock.push(deployedRel);
}
if (unprotected.length || missingEarlyLock.length) {
  throw new Error("FAIL-CLOSED: protection incomplete: " +
    JSON.stringify({unprotected, missingEarlyLock}));
}

// Private build manifest is useful for diagnostics; no source originals are included in DIST beyond previews.
fs.writeFileSync(path.join(DIST,"assets","protection","ato-media-map.json"), JSON.stringify({generatedAt:new Date().toISOString(), assets:manifest},null,2)+"\n","utf8");

console.log("ATO COMPLETE PROTECTION V7 — TOTAL PUBLIC COPY LOCK");
console.log(`HTML protected in deployment copy: ${htmlProtected}`);
console.log(`Approved current photos copied unchanged: ${currentCopied}`);
console.log(`New/changed photos forensic-protected: ${futureProtected}`);
console.log(`Protected visible-download copies: ${downloads}`);
console.log(`UI/GIF files copied without photo processing: ${uiCopied}`);
console.log(`Unprotected deployed HTML: ${unprotected.length}`);
console.log(`Public HTML missing early copy lock: ${missingEarlyLock.length}`);
