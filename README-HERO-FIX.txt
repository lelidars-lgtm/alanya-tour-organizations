ATO HERO — FINAL IMAGE PATH FIX

WHY THE HERO WAS BLACK
The current index preloads assets/img/hero/desktop/01-rafting.webp and mobile/01-rafting.webp,
while the old Hero JS referenced legacy files such as 05-tazy-canyon.webp,
04-istanbul/composite.webp, 02-cappadocia/composite.webp, etc.
Those legacy names no longer match the newly approved image set.

WHAT TO COPY TO YOUR SITE ROOT
1) index.html
2) assets/css/ato-living-hero.css
3) assets/js/ato-living-hero.js
4) assets/img/hero/desktop/  (replace old Hero images)
5) assets/img/hero/mobile/   (replace old Hero images)

FINAL ORDER — BOTH DESKTOP + MOBILE
01 Rafting
02 Tazy Canyon
03 Istanbul
04 Pamukkale
05 Cappadocia
06 Evening Alanya
07 Helicopter FlyMe Air

The JS now refuses to reveal a missing next image, so a failed asset cannot turn a working scene into a black screen.
