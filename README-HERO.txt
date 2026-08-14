ALANYA TOUR ORGANIZATIONS — LIVING EDITORIAL HERO V1

BASE
- Built on the latest index V4.4 CONTACT HOTLINE version already supplied in this conversation.
- The newly reattached V4.2 file was NOT used as the base because it is older than V4.4.
- styles.css is an exact byte-for-byte copy of the supplied styles(10).css and was not modified.

WHAT WAS ADDED
- assets/css/ato-living-hero.css — isolated hero styles only.
- assets/js/ato-living-hero.js — hero controller, preload, language sync and transitions.
- assets/img/hero/desktop/ — six clean desktop hero scenes.
- assets/img/hero/mobile/ — six dedicated portrait crops.

HERO CHAPTERS
01 SEA EXPERIENCE — PRIVATE YACHT
   transition language: ROCK PORTAL
02 AIR EXPERIENCE — PARAGLIDING
   transition language: HORIZON
03 NATURE & ADVENTURE — RAFTING
   transition language: WATER SPLASH
04 HISTORY & CULTURE — CAPPADOCIA
   transition language: EDITORIAL PANELS
05 FAMILY EXPERIENCE — LAND OF LEGENDS
   transition language: REFLECTION
06 VIP SERVICES — HELICOPTER CHARTER
   transition language: ROTOR CIRCLE → returns to PORTAL

IMPORTANT
- The old hero title/text/button remain invisibly in the DOM only because the existing five-language controller expects .main-btn and the old multilingual nodes. They are not visible in the hero.
- The only visible copy inside the hero is the small current-scene caption, progress, scroll cue and pause control.
- Hero captions follow the existing EN/RU/TR/DE/PL language switch through the existing ato-language-changed event.
- Each hero scene and its micro-caption are linked to the corresponding tour page.
- Existing header, promo bar, Tour Finder, Smart Search, Trip Planner hooks, categories, About, Contacts and footer are left intact.
- prefers-reduced-motion users receive a static first scene rather than forced motion.

UPLOAD
Upload the CONTENTS of this folder to the existing site root, preserving the assets/ structure.
Do not rename assets/css/ato-living-hero.css or assets/js/ato-living-hero.js unless the paths in index.html are changed too.
