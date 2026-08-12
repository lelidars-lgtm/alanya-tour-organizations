ALANYA TOUR ORGANIZATIONS — 3D GLOBE FIX

WHAT WAS CHANGED
- Removed the external Three.js CDN dependency from the globe renderer.
- Removed external threejs.org texture URLs.
- Added local Earth day, night-lights and normal-map textures.
- Rebuilt the globe as a real native WebGL sphere generated from 3D vertices.
- The globe starts as 3D immediately; texture loading only upgrades the surface.
- Added local procedural 3D material fallback if a texture is missing.
- Added CSS fallback only for devices where WebGL itself is unavailable.
- Kept the existing Journey / Türkiye / Alanya / Heart DOM and animation classes intact.

UPLOAD
Upload the ENTIRE contents of this ZIP together. Do not upload only the HTML file.
The folder assets/globe/ must remain next to special-offers.html exactly as packaged.

IMPORTANT
If you upload only special-offers.html and omit assets/globe/, the sphere will still render in 3D, but without the photographic Earth skin.
