ATO BOOKING MANAGER — MAGIC LINK + TRIP PLANNER

Что исправлено:
1. Существующий личный кабинет остаётся по адресу:
   /interactive-map/booking-manager/
2. Пароль НЕ добавляется.
   Вход остаётся как раньше: кнопка «ПОЛУЧИТЬ ССЫЛКУ ДЛЯ ВХОДА» отправляет новую одноразовую ссылку на email владельца.
3. Кабинет показывает:
   - новые заявки из TRIP PLANNER (trip_bookings),
   - старые заявки из прежней таблицы bookings, если они есть.
4. Новую заявку можно открыть, исправить дату / pickup / время / цену по каждой экскурсии.
5. «ПОДТВЕРДИТЬ И СОЗДАТЬ БИЛЕТ» подтверждает заявку и сразу показывает в кабинете настоящий e-ticket из /e-ticket.html.
6. Для каждого тура — отдельный e-ticket. Есть кнопка отправки ссылок клиенту в WhatsApp.
7. Старый ошибочный адрес /booking-manager/ автоматически перенаправляет в правильный кабинет.

УСТАНОВКА
A. Скопировать содержимое ZIP в корень alanya-tour-organizations с заменой.
B. В Supabase → SQL Editor открыть файл:
   supabase/manager-magic-link-access.sql
   и выполнить один раз.
C. Commit → Push origin.
D. Открыть:
   https://alanya-tour-organizations.vercel.app/interactive-map/booking-manager/

ВАЖНО
- booking-config.js не заменяется этим пакетом: ваш существующий вход не ломаем.
- e-ticket.html и новый Trip Planner должны быть уже установлены из последнего пакета интеграции.
- пароль нигде не нужен и не создаётся.
