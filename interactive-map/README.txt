V17 — REAL SHARED FILTER INTEGRATION

This package uses the actual filter markup from the uploaded ato.zip main page.

FILES:
1) interactive-map/index.html
2) interactive-map/interactive-map.html
3) interactive-map/assets/js/shared-filters.js
4) site-root/index.html — main site page with the official sidebar filter connected
5) site-root/assets/js/shared-filters.js

INSTALLATION:
- Replace the two HTML files inside /interactive-map/.
- Add/replace /interactive-map/assets/js/shared-filters.js.
- Compare and then replace the root site index.html with site-root/index.html.
- Add /assets/js/shared-filters.js at the site root.

Both pages use the same localStorage key: alanyaTourFilters. Search and selected filter tags persist during navigation between the site and map. Map-native controls (category, price, duration, transfer, family, private) are stored in the same object.

Important: Couples and Friends are preserved in shared state, but the current tour data has no couples/friends metadata, so the map does not exclude tours by those two tags until that metadata is added.
