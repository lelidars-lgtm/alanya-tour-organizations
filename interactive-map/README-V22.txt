V22 SINGLE-SOURCE MAP

INSTALLATION
1. Copy the interactive-map folder into the repository root and replace files.
2. Copy assets/js/shared-filters.js into the repository root assets/js folder.
3. Do NOT copy or replace any original root tour HTML pages.

ARCHITECTURE
- Original root tour pages (for example /scuba-diving.html) are the only source of customer-facing tour content.
- The map stores only coordinates, category and page filename.
- Card title, description, price, duration, transfer and hero image are read from the original page using same-origin fetch.
- Updating an original tour page automatically updates the map card after deployment/refresh.
- No duplicated tour pages, galleries or hero images are included in this package.

LAYOUT FIXES
- Original map header is visible.
- The promotion line sits directly below the header and above the map.
- The duplicated TRAVEL WITH LOVE line is removed from the promotion bar.
- Page opens at CSS scale 100%.
