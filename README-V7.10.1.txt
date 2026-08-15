ATO V7.10.1 — PROMO + FOOTER STRUCTURE FIX

FIXED:
1. Promo / auction ribbon
   - Reset stale top/inset/transform values from root styles.css.
   - Ribbon now remains in normal flow directly after the main header.
   - Removed the empty black spacer effect before the Hero.

2. Footer corruption
   - V7.10 index.html was rebuilt from the last structurally clean V7.9.1 index.
   - The raw Tour Finder JavaScript that was appearing below the footer is gone.
   - Tour Finder script remains inside its proper <script> element.
   - Footer is again the last visible content section.

3. AI Assistant preserved
   - assets/js/ato-assistant.js restored.
   - api/ato-assistant.js restored.
   - Assistant script included safely in <head defer>.
   - Legacy WhatsApp popup is hidden to prevent flash and removed by Assistant JS.

4. Later design work preserved via current CSS:
   - warm pearl header
   - Hero typography
   - premium metrics rail
   - adaptive promo tones
   - VIP diamond
   - live Türkiye
   - ATO Assistant styling

DEPLOY:
Replace:
- index.html
- assets/css/ato-living-hero.css
- assets/js/ato-assistant.js
- api/ato-assistant.js
