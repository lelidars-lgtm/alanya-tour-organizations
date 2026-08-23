import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

export const ROOT = process.cwd();
export const BASELINE_FILE = path.join(ROOT, "ATO-MEDIA-BASELINE.json");
export const IMAGE_EXTS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);
export const SKIP_DIRS = new Set([
  ".git", ".vercel", "node_modules", ".ato-dist", ".ato-protection-backup",
  "_ato-private", "_ato-download", ".cache"
]);

export function slash(p) { return p.split(path.sep).join("/"); }
export function rel(p) { return slash(path.relative(ROOT, p)); }
export function hashFile(file) {
  const h = crypto.createHash("sha256");
  h.update(fs.readFileSync(file));
  return h.digest("hex");
}
export function walk(dir, out=[]) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, {withFileTypes:true})) {
    if (SKIP_DIRS.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, out); else out.push(full);
  }
  return out;
}
export function isImage(file) { return IMAGE_EXTS.has(path.extname(file).toLowerCase()); }
export async function metadata(file) {
  try { return await sharp(file, {animated:true, limitInputPixels:false}).metadata(); }
  catch { return {}; }
}
export function isLikelyPhoto(meta, file) {
  const w = meta.width || 0, h = meta.height || 0;
  const ext = path.extname(file).toLowerCase();
  if (ext === ".gif") return false; // animated/UI GIFs are copied; no destructive conversion.
  return w >= 320 && h >= 180;
}
export function assetId(relativePath, hash) {
  return crypto.createHash("sha256").update(relativePath + ":" + hash).digest("hex").slice(0, 20).toUpperCase();
}
export function escapeXml(s) {
  return String(s).replace(/[&<>\"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&apos;'}[c]));
}
export function forensicSvg(width, height, id) {
  // 0.35% alpha: designed to be visually imperceptible in normal viewing.
  const tileW = Math.max(280, Math.min(520, Math.round(width/3)));
  const tileH = Math.max(180, Math.min(360, Math.round(height/3)));
  const text = `ATO ${id}`;
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="p" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse" patternTransform="rotate(-23)">
      <text x="8" y="${Math.round(tileH/2)}" font-family="Arial,sans-serif" font-size="11" letter-spacing="2.2" fill="white" fill-opacity="0.0035">${escapeXml(text)}</text>
    </pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>
  </svg>`);
}
export function visibleDownloadSvg(width, height) {
  const tileW = Math.max(340, Math.min(650, Math.round(width/2.4)));
  const tileH = Math.max(220, Math.min(440, Math.round(height/2.4)));
  return Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
    <defs><pattern id="p" width="${tileW}" height="${tileH}" patternUnits="userSpaceOnUse" patternTransform="rotate(-24)">
      <text x="8" y="${Math.round(tileH*0.46)}" font-family="Arial,sans-serif" font-size="${Math.max(15, Math.round(tileW/24))}" font-weight="600" letter-spacing="2" fill="white" fill-opacity="0.19">ALANYA TOUR ORGANIZATIONS</text>
      <text x="35" y="${Math.round(tileH*0.58)}" font-family="Arial,sans-serif" font-size="${Math.max(9, Math.round(tileW/40))}" letter-spacing="2" fill="white" fill-opacity="0.16">TRAVEL WITH LOVE • TRAVEL WITH US</text>
    </pattern></defs><rect width="100%" height="100%" fill="url(#p)"/>
  </svg>`);
}
export function xmpPacket(id, relativePath) {
  const desc = escapeXml(`ALANYA TOUR ORGANIZATIONS | Asset ${id} | ${relativePath}`);
  return `<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?><x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description rdf:about="" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"><dc:rights><rdf:Alt><rdf:li xml:lang="x-default">© ALANYA TOUR ORGANIZATIONS</rdf:li></rdf:Alt></dc:rights><dc:description><rdf:Alt><rdf:li xml:lang="x-default">${desc}</rdf:li></rdf:Alt></dc:description><xmpRights:Marked>True</xmpRights:Marked></rdf:Description></rdf:RDF></x:xmpmeta><?xpacket end="w"?>`;
}
export async function writeSameFormat(pipeline, out, ext, qualityMode=true) {
  fs.mkdirSync(path.dirname(out), {recursive:true});
  ext = ext.toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return pipeline.jpeg({quality: 94, chromaSubsampling:"4:4:4", mozjpeg:true}).toFile(out);
  if (ext === ".png") return pipeline.png({compressionLevel: 9, adaptiveFiltering:true}).toFile(out);
  if (ext === ".webp") return pipeline.webp({quality: 94, smartSubsample:true}).toFile(out);
  if (ext === ".avif") return pipeline.avif({quality: 72, effort: 6}).toFile(out);
  return pipeline.toFile(out);
}
