ATO 3D GLOBE V4

Fix: static CSS fallback removed as the primary fallback.
If WebGL is unavailable, the site now runs a CPU Canvas2D spherical renderer:
- photographic Earth texture is projected onto a rotating sphere;
- visible blue triangular geodesic shell is projected in 3D and rotates independently;
- no external CDN is required.

WebGL remains the preferred renderer when available.
