ALANYA TOUR ORGANIZATIONS — GLOBAL COMPARE V3

APPROVED POSITION
Every category card: [meta]   [＋ Compare] [gold arrow]
Compare is physically placed inside .tour-bottom immediately before .circle-arrow.
It is forbidden to appear on the image/top of a card.

UPLOAD / REPLACE
1. assets/js/trip-planner-shared.js
2. assets/css/trip-planner-shared.css
3. popular-tours.html
4. combo-deals.html

WHAT CHANGED
- Global JS now moves/removes every legacy Compare control and keeps exactly one beside the gold arrow.
- If a card has no .tour-bottom + .circle-arrow, Compare is not shown elsewhere.
- Critical layout CSS is also injected by JS, so old category CSS cannot push Compare back to the image/top.
- Popular Tours now uses only the global atoTripPlannerPool system; obsolete atoCompareTours handler removed.
- Combo Deals is now connected to trip-planner-shared.css/js and has static Compare + arrow pairs on all 6 cards.
- Capture-phase handling prevents old per-page Compare click handlers from creating a second selection pool.
