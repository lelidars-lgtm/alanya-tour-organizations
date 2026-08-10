ALANYA TOUR ORGANIZATIONS — ЗАЯВКА = БИЛЕТ + ПОГОДА
====================================================

Что уже реализовано
-------------------
1. trip-planner.html
   - последняя версия Planner с YOUR-анимацией, guided flow и исправленными календарями;
   - заявка собирает выбранные туры, даты и данные клиента один раз;
   - заявка сохраняется в Supabase через create_trip_request;
   - одновременно открывается WhatsApp менеджеру с номером заявки.

2. booking-manager/index.html
   - вход менеджера через Supabase Auth;
   - список заявок;
   - редактирование подтвержденной даты, pickup, времени и цены для КАЖДОЙ экскурсии;
   - CONFIRM BOOKING создает номер билета;
   - после подтверждения появляются e-ticket ссылки по каждому туру;
   - кнопка сразу открывает WhatsApp клиенту с билетами.

3. e-ticket.html
   - построен на текущем утвержденном шаблоне билета;
   - получает данные только из подтвержденной заявки;
   - добавлен QR на актуальный билет;
   - добавлен блок Weather & What to Bring;
   - What to Bring пытается читать текущую оригинальную страницу тура и использует сохраненную заявку как fallback;
   - погода привязана к подтвержденной дате тура.

4. assets/js/weather-service.js
   - не выдумывает прогноз;
   - до окна прогноза показывает, что live weather появится ближе к поездке;
   - после подключения коммерческого API получает температуру, вероятность осадков, ветер/порывы;
   - для sea/water туров умеет отдельно подключать marine endpoint для волн.

5. supabase/booking-schema.sql
   - таблица заявок;
   - manager allow-list;
   - RLS;
   - безопасная RPC для клиентской заявки;
   - публичный билет доступен только по уникальному token и только после status=confirmed.

ОДИН РАЗ В SUPABASE
--------------------
A. Открой SQL Editor и выполни:
   supabase/booking-schema.sql

B. Supabase -> Authentication -> Users
   создай email/password пользователя для менеджера.

C. В самом низу booking-schema.sql есть команда:
   insert into public.trip_managers ... where email='YOUR-MANAGER-EMAIL@example.com'
   замени email на свой и выполни эту команду.

D. Supabase -> Project Settings / API
   возьми Project URL и Publishable/anon key.
   Вставь их в:
   assets/js/ato-config.js

ПОГОДА
-------
Сайт коммерческий. Поэтому weather-service оставлен выключенным до подключения коммерческого weather API.
В assets/js/ato-config.js заполняются:
- enabled: true
- apiBase
- marineApiBase (если нужен marine forecast)
- apiKey

После этого e-ticket автоматически начнет показывать live weather в доступном forecast window.

КАК ЗАЛИТЬ
----------
Скопировать содержимое ЭТОЙ папки в корень alanya-tour-organizations С ЗАМЕНОЙ.
Не удалять существующие изображения, категории, tours, interactive-map и другие файлы.

Заменятся/добавятся:
- trip-planner.html
- e-ticket.html
- assets/css/trip-planner.css
- assets/js/trip-planner.js
- assets/js/ato-config.js
- assets/js/booking-system.js
- assets/js/weather-service.js
- booking-manager/index.html
- supabase/booking-schema.sql

После копирования:
Commit to main -> Push origin

Ссылки после Vercel deploy:
TRIP PLANNER:
https://alanya-tour-organizations.vercel.app/trip-planner.html

MANAGER:
https://alanya-tour-organizations.vercel.app/booking-manager/

E-TICKET создается менеджером автоматически и имеет вид:
https://alanya-tour-organizations.vercel.app/e-ticket.html?token=...&tour=0
