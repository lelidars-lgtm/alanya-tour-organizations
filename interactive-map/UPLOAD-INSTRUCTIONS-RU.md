# Interactive Map → ATO Booking Manager → E-ticket

Загрузите файлы строго по этим путям:

| Файл из комплекта | Путь на сайте |
|---|---|
| `index.html` | `/interactive-map/index.html` |
| `interactive-map.html` | `/interactive-map/interactive-map.html` |
| `booking-config.js` | `/interactive-map/booking-config.js` |
| `map-booking-bridge.js` | `/interactive-map/map-booking-bridge.js` |
| `booking-manager-index.html` | `/interactive-map/booking-manager/index.html` |
| `booking-system.js` | `/booking-system.js` |
| `e-ticket.html` | `/e-ticket.html` |

## Supabase

Если SQL для Trip Planner ещё не запускался, выполнить в Supabase SQL Editor:

1. `booking-schema.sql`
2. `manager-magic-link-access.sql`
3. `manager-trip-bookings-rpc.sql`

Если таблица `trip_bookings` и доступ менеджера уже работают, повторно запускать `booking-schema.sql` не нужно.

## Важно

- `booking-client.js` больше не подключать к Interactive Map. Он сохраняет заявки в старую таблицу `bookings` и перезаписывает `window.ATOBooking`.
- Новые заявки карты сохраняются в `trip_bookings` с источником `interactive-map`.
- После подтверждения менеджером создаётся отдельная ссылка на электронный билет для каждого тура.
- Старый белый билет в ATO Booking Manager заменяется утверждённым `e-ticket.html` даже для уже существующих legacy-заявок.

## Проверка после загрузки

1. В карте выбрать 1–2 тура и заполнить форму, включая WhatsApp клиента.
2. Убедиться, что WhatsApp открылся только после сохранения и в сообщении есть номер заявки `ATO-…`.
3. Открыть ATO Booking Manager: заявка должна иметь метку `INTERACTIVE MAP`.
4. Заполнить дату, pickup, время и цену каждого тура.
5. Нажать «ПОДТВЕРДИТЬ И СОЗДАТЬ БИЛЕТ».
6. Убедиться, что для каждого тура отображается утверждённый билет ATO, а не старый белый блок.
