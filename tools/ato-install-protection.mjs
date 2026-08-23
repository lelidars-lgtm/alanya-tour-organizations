import {spawnSync} from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const APPLY = process.argv.includes("--apply");
console.log("ATO COMPLETE PROTECTION V3 INSTALLER");
console.log("This installer does not modify any existing HTML/CSS/JS/image file.");
if (!APPLY) {
  console.log("DRY RUN. To create the baseline of already-approved images, run:");
  console.log("  node tools/ato-install-protection.mjs --apply");
  process.exit(0);
}
const r=spawnSync(process.execPath,[path.join("tools","ato-media-baseline.mjs"),"--apply"],{stdio:"inherit"});
if(r.status!==0) process.exit(r.status||1);
console.log("Baseline created. Commit/upload the NEW protection files + ATO-MEDIA-BASELINE.json.");
console.log("Approved current pages and images remain untouched; Vercel will protect only its deployment copy.");
