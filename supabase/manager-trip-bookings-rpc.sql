-- ALANYA TOUR ORGANIZATIONS
-- Owner-only read bridge for the existing magic-link Booking Manager.
-- Run ONCE in the same Supabase project after trip_bookings exists.

create or replace function public.ato_manager_list_trip_bookings()
returns setof public.trip_bookings
language sql
stable
security definer
set search_path = public
as $$
  select b.*
  from public.trip_bookings b
  where lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru'
  order by b.created_at desc
  limit 200;
$$;

revoke all on function public.ato_manager_list_trip_bookings() from public;
grant execute on function public.ato_manager_list_trip_bookings() to authenticated;
