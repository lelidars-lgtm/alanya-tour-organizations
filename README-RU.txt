ATO — FIX: заявка из TRIP PLANNER не появляется в личном кабинете

Что исправлено:
1. Booking Manager читает новые заявки через отдельный owner-only RPC и больше не зависит от несовпадения старых/новых RLS-политик.
2. Booking Manager автоматически обновляет список каждые 8 секунд.
3. TRIP PLANNER больше НЕ открывает WhatsApp, если заявка реально не сохранилась в Supabase.
   Вместо ложного успеха он показывает точную ошибку на экране.
4. WhatsApp открывается только после получения Request No от Supabase.

Установка:
A. Скопировать с заменой:
   interactive-map/booking-manager/index.html
   assets/js/trip-planner.js
B. Supabase → SQL Editor → открыть supabase/manager-trip-bookings-rpc.sql → Run один раз.
C. Commit to main → Push origin.

Проверка:
- отправить тестовую заявку из TRIP PLANNER;
- на экране должен появиться Request No;
- в WhatsApp тоже будет строка Request No;
- кабинет обновится автоматически максимум примерно через 8 секунд.
