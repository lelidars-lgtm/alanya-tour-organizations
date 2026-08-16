ATO — ЕДИНЫЙ E-TICKET ДЛЯ TRIP PLANNER + INTERACTIVE MAP
Версия: 16.08.2026 · билет с 2 страницами

ВАЖНО: предыдущий комплект без второй страницы НЕ использовать.

ЗАМЕНИТЬ / ДОБАВИТЬ:
1. /e-ticket.html
   Утвержденная первая страница + новая PAGE 02: Weather & What to Bring.

2. /interactive-map/interactive-map.html
   Карта сохраняет заявку в общий Booking Manager, а теперь также сохраняет What to Bring, координаты погоды и weather profile для каждого тура.

3. /interactive-map/booking-manager/index.html
   Общий Booking Manager для Trip Planner и Interactive Map.

4. /assets/js/weather-service.js
   Общий клиентский weather layer. Его уже ожидает текущий Trip Planner. Он же используется e-ticket.

5. /api/ato-weather.js
   Vercel Function: безопасный server-side запрос к MET Norway. Нужен, потому что production-запрос к MET Norway напрямую из браузера ненадежен из-за CORS/User-Agent правил.

КАК РАБОТАЕТ БИЛЕТ:
- PAGE 01: утвержденный визуальный e-ticket без изменения дизайна.
- PAGE 02: подтвержденный тур / дата / время / pickup.
- WEATHER: прогноз именно на confirmed_date. Для дат дальше горизонта прогноза показывает: “Live weather recommendations will become available closer to your travel date.” Никаких выдуманных погодных значений.
- WHAT TO BRING: сначала используется список, сохраненный в заявке из конкретной страницы тура. Если он отсутствует (например старая заявка), e-ticket повторно читает текущую страницу тура и ищет блок What to Bring / Bring with you / What you need.
- Каждый тур в заявке имеет свой отдельный билет по &tour=0, &tour=1 и т.д., поэтому погода и What to Bring различаются по экскурсиям.

TRIP PLANNER:
Текущий trip-planner.js уже сохраняет what_to_bring и weather_profile. Его не заменять. Нужно только добавить новый /assets/js/weather-service.js.

ТЕСТ ПОСЛЕ ЗАГРУЗКИ:
A) Trip Planner -> 1 тур -> заявка -> Booking Manager -> подтвердить дату/time/pickup -> открыть e-ticket.
B) Interactive Map -> 1 тур -> заявка -> Booking Manager -> подтвердить -> открыть e-ticket.
В обоих случаях PAGE 02 должна показывать список What to Bring конкретного тура. Если дата в ближайшие 9 дней — должен появиться live forecast; если позже — корректное сообщение ожидания.
