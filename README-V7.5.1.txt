ATO V7.5.1 — FOOTER REAL FIX

ROOT CAUSE FOUND:
An old CSS rule still contained:
body > .footer-strip { display:none!important; }

The previous footer override was malformed because literal \n characters
were written into the CSS, so the browser ignored it.

FIXED:
- footer hiding rule removed
- malformed override removed
- valid footer CSS added
- footer is visible
- footer sits directly after Google map
- no blank section between map and footer
- page ends after footer
- V7.5 Champagne VIP styling preserved
- live Türkiye geolocation preserved

IF V7.5 IS ALREADY DEPLOYED:
Replace ONLY:
assets/css/ato-living-hero.css

index.html does not need replacement for this correction because
the footer markup is already present there.
