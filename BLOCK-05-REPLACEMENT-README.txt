SPECIAL OFFERS — BLOCK 05 + FINAL STABILITY AUDIT
Date: 2026-08-13

Completed:
- Block 05 (Gift) remains the approved full replacement from the agreed source.
- Gift HTML, CSS and JavaScript dependencies are preserved.
- Freedom Gift and Signature Gift builder, live preview, calendar logic and WhatsApp handoff are included.
- Gift certificate template, electronic certificate page and Booking Manager integration files are included.
- Other approved Special Offers sections and Journey/globe visuals were preserved.

Header / promo architecture:
- The page now has ONE header/promo controller: index-header-loader.js.
- The duplicate bootstrap/header loader was removed.
- An exact current-index fallback header + promo is present in the first HTML frame, so the page does not start blank and then jump when index.html arrives.
- The loader revalidates /index.html and updates header/promo only when their markup actually changed.
- Index styles relevant to header/promo are prepared before a changed header is swapped in.
- If /index.html cannot be fetched, the immediate fallback remains fully functional.
- Same-page index anchors are rebased to /index.html#... from Special Offers.
- Original sticky header + promo behavior is preserved on desktop and mobile.

Stability / error fixes:
- Fixed a real CSS syntax corruption where literal \\n escape characters had been written into the stylesheet as code.
- Removed the 138px temporary header host that caused a mobile layout jump (mobile chrome is 84px + 34px promo = 118px).
- Removed duplicate index fetches and duplicate header DOM replacement.
- special-offers.js now loads directly instead of waiting for a second index/bootstrap request.
- Removed obsolete header controller code that could not operate correctly with the previous Shadow DOM header.
- Removed dead Heart eligibility-modal code that referenced elements no longer present in the HTML; claim-time eligibility enforcement remains intact.
- Fixed mobile language-menu event bubbling that could reopen the menu after a language selection.
- Removed stale local image URL references that could generate unnecessary 404 requests.
- Existing V25 ambient-page pulse suppression remains in place; Journey/globe/heart/confetti animations are untouched.

Validation passed:
- JavaScript syntax: index-header-loader.js, special-offers.js, booking-manager-gifts-addon.js.
- CSS full parse: special-offers.css.
- HTML parse: special-offers.html and gift-certificate.html.
- Duplicate HTML IDs: none.
- Required local globe/gift assets: present.
- Internal Special Offers #anchors: present.
- target=_blank links: protected with rel=noopener where applicable.
- CSS animation names: no missing @keyframes references detected.

Production dependencies that are intentionally external to this archive:
- /index.html and its live stylesheet(s) for automatic header/promo synchronization.
- Existing ATO Booking Manager / Supabase configuration (/booking-config.js or an accepted alternative).
- Existing Heart Offer RPC functions (heart_offer_check and heart_offer_claim).
- The 9 RANDOM_TOURS photo paths are shared main-site assets (not bundled in this Special Offers patch ZIP); their live existence must be verified on the deployed full site.
- Gift Certificate SQL in GIFT-CERTIFICATE-ATO-BOOKING-MANAGER.sql must be installed in the same backend if not already installed.
