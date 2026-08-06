V18 COMPLETE MAP — INSTALLATION

This package includes V16/V17 functionality plus the final visual map changes.

COPY / REPLACE:
1. interactive-map/index.html
2. interactive-map/interactive-map.html
3. interactive-map/assets/js/shared-filters.js
4. site-root/index.html -> copy this file to the ROOT of the repository as index.html
5. site-root/assets/js/shared-filters.js -> copy to ROOT assets/js/shared-filters.js

DO NOT DELETE:
interactive-map/assets/images, interactive-map/categories, interactive-map/tours, interactive-map/data, interactive-map/logo.

INCLUDED:
- official main-site filter synchronized with map through alanyaTourFilters
- categories only on top; gold SVG icons; first semantic word metallic gold and remainder white
- left panel contains title, explanation, search, price/duration/transfer/family/private filters, clear button, nearby hint
- hover and one-click tour cards
- major Turkish destinations around routes with zoom-dependent labels
- hybrid/street/satellite modes
- white zoom controls, gold compass, working geolocation control
- duplicate map footer slogan removed; official promo line remains immediately below the company header

PUBLISH:
Commit -> Push origin -> Pull Request map-test to main -> Merge -> wait for Vercel -> Ctrl+F5.
