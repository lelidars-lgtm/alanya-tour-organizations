import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import {

const ATO_V8_EARLY_STYLE = "<style id=\"ato-v8-early-lock\">\nhtml,body,body *,body *::before,body *::after{\n-webkit-user-select:none!important;\n-moz-user-select:none!important;\n-ms-user-select:none!important;\nuser-select:none!important;\n-webkit-touch-callout:none!important\n}\ninput,textarea,select,option,[contenteditable=\"true\"],.ato-allow-select,.ato-allow-select *{\n-webkit-user-select:text!important;\n-moz-user-select:text!important;\n-ms-user-select:text!important;\nuser-select:text!important;\n-webkit-touch-callout:default!important\n}\nimg,picture,video,canvas,svg,source{\n-webkit-user-drag:none!important;\nuser-drag:none!important\n}\n</style>";
const ATO_V8_EARLY_SCRIPT = "<script id=\"ato-v8-early-guard\">\n(function(){\n\"use strict\";\nvar isEditable=function(t){\nvar e=t&&t.nodeType===1?t:t&&t.parentElement;\nreturn !!(e&&e.closest&&e.closest('input,textarea,select,option,[contenteditable=\"true\"],.ato-allow-select'));\n};\nvar stop=function(e){if(isEditable(e.target))return;e.preventDefault();try{e.stopImmediatePropagation()}catch(_){}};\n[\"copy\",\"cut\",\"contextmenu\",\"selectstart\",\"dragstart\",\"beforecopy\"].forEach(function(t){\ndocument.addEventListener(t,stop,true);\nwindow.addEventListener(t,stop,true);\n});\ndocument.addEventListener(\"keydown\",function(e){\nif(isEditable(e.target))return;\nvar k=String(e.key||\"\").toLowerCase(),m=e.ctrlKey||e.metaKey;\nif((m&&[\"a\",\"c\",\"x\",\"s\",\"p\",\"u\"].indexOf(k)!==-1)||k===\"f12\"||(m&&e.shiftKey&&[\"i\",\"j\",\"c\"].indexOf(k)!==-1)){\ne.preventDefault();try{e.stopImmediatePropagation()}catch(_){}\n}\n},true);\ndocument.addEventListener(\"selectionchange\",function(){\nif(isEditable(document.activeElement))return;\nvar s=window.getSelection&&window.getSelection();\nif(s&&!s.isCollapsed){try{s.removeAllRanges()}catch(_){}}\n},true);\n})();\n</script>";


function atoApplyV8EarlyLock(html, relPath = "") {
  const p = String(relPath || "").toLowerCase();
  const limited =
    p.includes("/booking-manager/") ||
    p.endsWith("/e-ticket.html") ||
    p === "e-ticket.html" ||
    p.includes("/admin/");

  if (limited) return html;

  if (!html.includes('id="ato-v8-early-lock"')) {
    const lower = html.toLowerCase();
    const idx = lower.lastIndexOf("</head>");
    if (idx >= 0) {
      html = html.slice(0, idx) + ATO_V8_EARLY_STYLE + "\n" + ATO_V8_EARLY_SCRIPT + "\n" + html.slice(idx);
    } else {
      html = ATO_V8_EARLY_STYLE + "\n" + ATO_V8_EARLY_SCRIPT + "\n" + html;
    }
  }
  return html;
}

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


// V8 FINAL HTML PASS — guarantee every PUBLIC deployed HTML has early copy lock.
{
  const htmlFilesV8 = [];
  const walkV8 = (dir) => {
    for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, ent.name);
      if (ent.isDirectory()) walkV8(full);
      else if (ent.isFile() && ent.name.toLowerCase().endsWith(".html")) htmlFilesV8.push(full);
    }
  };
  walkV8(OUTPUT_DIR);

  let missingV8 = 0;
  let publicV8 = 0;
  for (const file of htmlFilesV8) {
    const rel = path.relative(OUTPUT_DIR, file).split(path.sep).join("/");
    const p = rel.toLowerCase();
    const limited =
      p.includes("booking-manager/") ||
      p.endsWith("e-ticket.html") ||
      p.includes("admin/");

    if (limited) continue;
    publicV8++;

    let html = fs.readFileSync(file, "utf8");
    html = atoApplyV8EarlyLock(html, rel);
    fs.writeFileSync(file, html, "utf8");

    const check = fs.readFileSync(file, "utf8");
    if (!check.includes('id="ato-v8-early-lock"') ||
        !check.includes('id="ato-v8-early-guard"')) {
      missingV8++;
      console.error("V8 COPY LOCK MISSING:", rel);
    }
  }

  console.log("V8 public HTML early-locked:", publicV8);
  console.log("V8 public HTML missing early lock:", missingV8);

  if (missingV8 > 0) {
    throw new Error(`V8 fail-closed: ${missingV8} public HTML files missing TOTAL COPY LOCK`);
  }
}

console.log("ATO COMPLETE PROTECTION V8 — TOTAL PUBLIC LOCK");
console.log(`HTML protected in deployment copy: ${htmlProtected}`);
console.log(`Approved current photos copied unchanged: ${currentCopied}`);
console.log(`New/changed photos forensic-protected: ${futureProtected}`);
console.log(`Protected visible-download copies: ${downloads}`);
console.log(`UI/GIF files copied without photo processing: ${uiCopied}`);
console.log(`Unprotected deployed HTML: ${unprotected.length}`);
console.log(`Public HTML missing early copy lock: ${missingEarlyLock.length}`);
