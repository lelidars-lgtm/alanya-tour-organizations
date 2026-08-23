import fs from "node:fs";
import path from "node:path";
import {ROOT, BASELINE_FILE, walk, isImage, rel, hashFile, metadata, isLikelyPhoto} from "./ato-media-common.mjs";

const APPLY = process.argv.includes("--apply");
const files = walk(ROOT).filter(isImage).sort();
const assets = {};
for (const file of files) {
  const r = rel(file);
  const m = await metadata(file);
  assets[r] = {
    sha256: hashFile(file),
    width: m.width || null,
    height: m.height || null,
    format: m.format || null,
    photo: isLikelyPhoto(m, file)
  };
}
const data = {
  schema: 1,
  createdAt: new Date().toISOString(),
  purpose: "Baseline of already-approved ATO images. Matching files are copied byte-for-byte so current visuals are never changed.",
  count: Object.keys(assets).length,
  assets
};
console.log(`ATO MEDIA BASELINE: ${data.count} existing images detected.`);
if (!APPLY) {
  console.log("DRY RUN — baseline not written. Use --apply once during installation.");
} else {
  fs.writeFileSync(BASELINE_FILE, JSON.stringify(data, null, 2)+"\n", "utf8");
  console.log(`Written: ${path.relative(ROOT, BASELINE_FILE)}`);
  console.log("No HTML, CSS, JS or image was modified.");
}
