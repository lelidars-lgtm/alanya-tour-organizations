ATO V7.10.6 — STICKY SEAMLESS ADAPTIVE PROMO

1. COMPLETE MARQUEE
The old ribbon duplicated only the first promo phrase, so a -50% animation
reset before the entire line had completed. It now contains two identical
FULL groups and loops exactly at -50%, making the cycle seamless.

2. STICKY UNDER HEADER
The ribbon now follows the user down the page. JS measures the real header
height and keeps the promo directly beneath it. ResizeObserver keeps this
correct on desktop/mobile and if header height changes.

3. ADAPTIVE WHILE SCROLLING
The tone engine now remains visible in action because the ribbon stays sticky.
It reads the section immediately beneath it and updates across Hero scenes,
Categories, VIP, About, live Türkiye, Contact, Google Map and Footer.

Deploy over V7.10.5:
Replace:
- index.html
- assets/css/ato-living-hero.css

No Assistant/API changes.
