ATO V7.10.4 — ASSISTANT ADAPTIVE GOLD GLOW

Launch wording:
EN: ASK SOMETHING / ASSISTANT
RU: СПРОСИТЬ / АССИСТЕНТ
TR: BİR ŞEY SORUN / ASİSTAN
DE: ETWAS FRAGEN / ASSISTENT
PL: ZAPYTAJ / ASYSTENT

Visual behavior:
- Removed ATO from the launch title.
- Added a very soft champagne-gold breathing aura.
- The glow peaks briefly approximately once every 8.6 seconds.
- Tiny gold signal point pulses with the same rhythm.
- No neon and no aggressive flashing.
- Hover only strengthens the gold hairline slightly.

Adaptive scrolling:
- The floating launch button detects the section physically behind it.
- Supported tones:
  Hero
  Main Categories / Tour Finder
  VIP Service
  About
  Contact
  Footer
- Only the navy/graphite depth changes.
- Champagne gold remains consistent across all sections.

Accessibility:
- Glow animation is disabled for prefers-reduced-motion.

Deploy over V7.10.3:
Replace:
1. assets/css/ato-living-hero.css
2. assets/js/ato-assistant.js

No API/backend changes.
