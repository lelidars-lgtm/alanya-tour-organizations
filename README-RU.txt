ALANYA TOUR ORGANIZATIONS — TRIP PLANNER + BOOKING MANAGER + E-TICKET + WEATHER

Что подключено:
1. TRIP PLANNER сохраняет заявку в Supabase перед открытием WhatsApp.
2. После отправки/открытия WhatsApp заявка уже доступна менеджеру в /booking-manager/.
3. Менеджер входит по email/password Supabase Auth, открывает заявку, проверяет/исправляет дату, pickup, время и цену.
4. Кнопка CONFIRM BOOKING & CREATE TICKETS переводит заявку в confirmed и создаёт ссылки на e-ticket.
5. E-ticket берёт данные из той же заявки по public_token и показывает What to Bring + live weather guidance.
6. Погода — бесплатный MET Norway через /api/weather.

Публичный Planner:
https://alanya-tour-organizations.vercel.app/trip-planner.html

Личный кабинет менеджера:
https://alanya-tour-organizations.vercel.app/booking-manager/

ВАЖНО:
- В Supabase Auth должен существовать пользователь-менеджер с email/password.
- Не добавляйте secret/service_role key в браузерные файлы.
- Для работы manager panel должны быть уже установлены таблица/RLS из booking-schema.sql, который запускался ранее.
