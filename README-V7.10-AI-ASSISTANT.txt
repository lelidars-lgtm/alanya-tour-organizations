ATO V7.10 — AI ASSISTANT / BUSINESS CHAT

WHAT THIS VERSION DOES
- Replaces the generic ATO Concierge / WhatsApp popup with ATO ASSISTANT.
- Free-text client questions: tours, prices, children, transfer, schedules, booking, recommendations, etc.
- Uses the current page as additional context, so the assistant understands which tour/category the client is viewing.
- 5 UI languages: EN / RU / TR / DE / PL.
- Keeps replies short and sales-oriented without sounding like a call-center script.
- Does NOT invent prices, availability, child rules, pickup times or safety suitability.
- Exact availability / pickup / booking is handed to the human ATO Manager.
- Persistent TALK TO MANAGER button sends the recent assistant conversation into WhatsApp, including the page URL and language.
- Conversation is stored only in browser sessionStorage in this first version; no customer database has been added.

AI MODEL
Default: gpt-5.6-luna
Override optional Vercel environment variable:
ATO_ASSISTANT_MODEL=gpt-5.6-luna

REQUIRED TO TURN REAL AI ON
1. Create an OpenAI API key in your OpenAI Platform project.
2. In Vercel: Project → Settings → Environment Variables.
3. Add:
   OPENAI_API_KEY = your key
4. Redeploy the project.

IMPORTANT
- Never put OPENAI_API_KEY into index.html or browser JavaScript.
- The key is used only by /api/ato-assistant.js on the server.
- Without a key, the assistant UI still opens and offers the manager, but AI answers return a setup/unavailable message.

FILES TO DEPLOY OVER V7.9.3
1. index.html
2. assets/css/ato-living-hero.css
3. assets/js/ato-assistant.js   [NEW]
4. api/ato-assistant.js         [NEW]

GLOBAL SITE USE
The frontend file is universal. To use ATO ASSISTANT on another site page that already loads the shared ATO CSS, add:
<script src="/assets/js/ato-assistant.js" defer></script>
The same /api/ato-assistant backend is reused by every page.

DATA BASIS
- 51-tour catalogue seeded from the site's tour JSON available in the ATO project library.
- Critical current ATO commercial/tariff overrides are embedded in the server prompt.
- Current page text is passed as additional context.
- Before final production launch, the assistant knowledge should be connected to the site's final canonical tour-data source so one price update changes Tour Finder, Trip Planner and Assistant together.
