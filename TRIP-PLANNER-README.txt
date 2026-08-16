ALANYA TOUR ORGANIZATIONS — TRIP PLANNER BUILD

Implemented:
- trip-planner.html
- up to 8 tours in shared localStorage pool
- + Compare controls on 9 category pages / 52 tour cards
- same pool is used by interactive map
- current image/title/price/description are parsed from the original category cards
- current rules/details are parsed from the original tour pages
- user manually chooses 2–4 tours for detailed comparison
- preferences + deterministic recommendations
- date scheduling with optional free days
- final request form -> WhatsApp manager
- original tour/card images are not copied into a separate Planner image library
- homepage PLAN MY TRIP now links to trip-planner.html
- fixed water-sports Ringo link: ringo.html -> ringo-ride.html

Weather:
- architecture/UI is ready for date-specific weather guidance
- no commercial weather provider is connected yet; the build does not invent forecast values

Important deployment note:
Upload the whole folder preserving relative paths. The dynamic parsing uses same-origin fetch() and is intended to run on the deployed website (e.g. Vercel), not directly as file://.

Final request selection (2026-08-16):
- final request modal now shows a checked checkbox next to every planned tour and its date
- all planned tours are checked by default
- client may uncheck any tour before sending (for example keep 2 of 4)
- unchecked tours remain in Trip Planner and keep their planned dates
- only checked tours are sent to ATO Booking Manager and WhatsApp
- at least 1 tour must remain checked before the request can be sent
