ALANYA TOUR ORGANIZATIONS — TO-SITE LANGUAGE PACKAGE
====================================================

UPLOAD ONLY THIS FOLDER TO THE SITE ROOT:
  /ato-language-layer/

SAFETY:
- This is a NEW folder. It replaces no approved HTML/CSS/JS/media file.
- It contains no copies of the approved site pages.
- It contains no images/video/media.
- Existing 75 approved pages stay byte-for-byte untouched.

CONTENTS:
- manifest.json — approved page registry
- dictionaries/en.json, ru.json, tr.json, de.json, pl.json
- pages/... — per-page translation documents
- runtime/ato-language-layer.js — safe translation engine
- runtime/ato-language-live.js — live loader prepared for activation

IMPORTANT:
Simply uploading this folder stores the language system on the site but DOES NOT
make a browser execute it. A web page cannot execute a new JS file unless an
existing integration point references it.

Because the approved site files are not to be changed, activation is intentionally
NOT forced in this package. The future single integration reference is:
  /ato-language-layer/runtime/ato-language-live.js

Do not replace any existing site file with anything from this folder.
