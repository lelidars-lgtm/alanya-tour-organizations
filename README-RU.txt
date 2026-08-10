ALANYA TOUR ORGANIZATIONS — FREE WEATHER / MET NORWAY

Что делает пакет:
- подключает бесплатный MET Norway Locationforecast 2.0;
- не требует регистрации, API key или платного тарифа;
- показывает реальную погоду по выбранной дате прямо в Plan Your Dates;
- учитывает направление тура: Alanya, Belek, Köprülü Canyon, Cappadocia, Pamukkale, Demre/Kekova, Istanbul и др.;
- показывает температуру, дождь, ветер и доступные порывы;
- дает отдельную рекомендацию для air / sea / outdoor / family туров;
- если дата дальше окна прогноза, пишет что live weather появится ближе к дате;
- добавляет тот же live weather + What to Bring в подтвержденный e-ticket;
- сохраняет текущую Supabase-конфигурацию;
- сохраняет последние исправления Planner: календарь, Quick Start, original footer, YOUR intro.

Файлы для копирования в корень существующего репозитория alanya-tour-organizations:
trip-planner.html
assets/css/trip-planner.css
assets/js/trip-planner.js
assets/js/ato-config.js
assets/js/booking-system.js
assets/js/weather-service.js
e-ticket.html
api/weather.js

ВАЖНО:
- папку api нужно скопировать целиком в корень репозитория;
- новый SQL запускать НЕ нужно;
- новый weather API key НЕ нужен;
- после копирования: Commit to main -> Push origin;
- Vercel автоматически создаст /api/weather как serverless function.

Рекомендуемый commit:
Add free MET Norway weather guidance
