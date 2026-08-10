-- ALANYA TOUR ORGANIZATIONS
-- Keep the existing Booking Manager magic-link login and allow the owner
-- to read/update the NEW Trip Planner requests in public.trip_bookings.
-- Run once in Supabase SQL Editor after booking-schema.sql.

-- The schema already grants SELECT/UPDATE to authenticated users,
-- but these grants are repeated safely for an existing project.
grant select, update on public.trip_bookings to authenticated;

-- Preserve the existing owner-only access model used by the old Booking Manager.
drop policy if exists "ATO owner magic-link reads trip bookings" on public.trip_bookings;
create policy "ATO owner magic-link reads trip bookings"
on public.trip_bookings for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru');

drop policy if exists "ATO owner magic-link updates trip bookings" on public.trip_bookings;
create policy "ATO owner magic-link updates trip bookings"
on public.trip_bookings for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru')
with check (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru');

-- Also add the same existing Auth user to the trip_managers allow-list when present.
insert into public.trip_managers(user_id)
select id from auth.users where lower(email)= 'leli_dars@mail.ru'
on conflict do nothing;
