ATO HERO V5.1 — AUDITED FINAL

Replace these items in the project:
1. /index.html
2. /assets/css/ato-living-hero.css
3. /assets/img/hero/desktop/  (replace the 7 Hero images)
4. /assets/img/hero/mobile/   (replace the 7 Hero images)

Do NOT reconnect assets/js/ato-living-hero.js.
The Hero logic is intentionally embedded in index.html.

Important fixes in V5.1:
- all 14 Hero image paths verified against included files;
- desktop PNG filenames now contain real PNG data (no JPEG/PNG MIME mismatch);
- all inline JavaScript passes node --check;
- caption visibility restored and animated correctly;
- first Rafting frame remains HTML-backed, so Hero does not depend on JS to show an image;
- old Hero JS cannot override this version because it is not loaded;
- HERO-ASSET-CHECK.html remains included for deployment diagnostics.
