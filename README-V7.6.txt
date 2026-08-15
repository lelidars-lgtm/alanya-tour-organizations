ATO V7.6 — ADAPTIVE EDITORIAL PROMO RIBBON

The promo / auction ribbon now adapts to the visual section underneath it.

SYSTEM
- Section-aware styling using the actual page scroll position.
- Hero-aware styling using the current data-scene 0–7.
- Smooth 0.7–0.82 second transitions.
- Smoky glass instead of a fixed black strip.
- Thin champagne editorial horizon.
- No rainbow behavior.

HERO TONES
01 Paragliding — Mediterranean blue-black
02 Pamukkale — warm stone / dawn
03 Cappadocia — muted rose-charcoal
04 Jeep Safari — earthy graphite
05 Rafting — mineral teal
06 Istanbul — evening blue
07 Tazy Canyon — dark forest/stone
08 Helicopter — luxury graphite

PAGE TONES
- Main Categories — deep navy / champagne
- VIP — graphite / champagne / ivory
- About — integrated navy
- Live Türkiye — dark burgundy undertone, still restrained
- Contact — clean navy
- Google Map — soft graphite bridge
- Footer — near-black merge

Implementation:
- Intersection-style probe follows the sticky promo ribbon position.
- MutationObserver follows Hero scene changes.
- No pixel-color sampling, so the result is stable and curated.

DEPLOY OVER V7.5.1
Replace:
1. index.html
2. assets/css/ato-living-hero.css
