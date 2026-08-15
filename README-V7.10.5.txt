ATO V7.10.5 — SIDEBAR TYPOGRAPHY + GAZIPASA + VIEW ALL

1. FIND YOUR PERFECT TOUR
- Finder now uses the same Didot/Bodoni editorial typography as Popular Tours.
- Unified:
  heading
  search text / placeholder
  quick selector labels
  counts
  matching tours / reset
  result card names
  metadata
  prices
  open full finder action
- Removed the visible generic bold UI-font mismatch in the left column.

2. GAZIPASA BAYS IMAGE
- Primary mini-card source changed to:
  images/sea-experiences/hidden-bays-islands.jpg
  (the source already used by the existing Gazipaşa category mini-card)
- Sequential fallbacks:
  images/gazipasa-bays/gazipasa-hero.jpg
  images/gazipasa-bays/gazipasa-gallery-1.jpg
  images/gazipasa-bays/gazipasa-gallery-1.jpeg
- Broken-image icon is hidden if every source is unavailable.

3. POPULAR TOURS
- POPULAR TOURS now matches VIEW ALL TOURS:
  same 14px size
  same ivory/white color
  same Didot/Bodoni weight.

4. VIEW ALL TOURS
- Existing link/navigation is preserved.
- Removed duplicate second arrow.
- Added Assistant-like restrained champagne press/glow interaction on click.
- No giant pill/button was reintroduced.

DEPLOY OVER V7.10.4:
Replace:
1. index.html
2. assets/css/ato-living-hero.css

No changes required to:
- assets/js/ato-assistant.js
- api/ato-assistant.js
