-- ALANYA TOUR ORGANIZATIONS — Trip Planner booking source
-- Run once in Supabase SQL Editor.
-- Flow: request -> manager confirmation -> e-ticket -> weather / What to Bring

create extension if not exists pgcrypto;

create table if not exists public.trip_bookings (
  id uuid primary key default gen_random_uuid(),
  request_no text unique not null default ('ATO-' || upper(substr(replace(gen_random_uuid()::text,'-',''),1,8))),
  public_token uuid unique not null default gen_random_uuid(),
  status text not null default 'new' check (status in ('new','reviewing','confirmed','cancelled')),
  source text not null default 'trip-planner',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  confirmed_at timestamptz,
  ticket_no text,

  travel_start date,
  travel_end date,
  guest_name text not null,
  phone text not null,
  hotel text,
  room text,
  adults integer not null default 1 check (adults between 1 and 50),
  children text,
  pregnancy boolean not null default false,
  elderly boolean not null default false,
  mobility text,
  language text not null default 'English',
  notes text,
  manager_notes text,
  prefs jsonb not null default '{}'::jsonb,
  tours jsonb not null default '[]'::jsonb,
  constraint max_four_tours check (jsonb_typeof(tours)='array' and jsonb_array_length(tours) between 1 and 4)
);

create table if not exists public.trip_managers (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.trip_bookings enable row level security;
alter table public.trip_managers enable row level security;

revoke all on public.trip_bookings from anon, authenticated;
revoke all on public.trip_managers from anon, authenticated;
grant select, update on public.trip_bookings to authenticated;


create or replace function public.is_trip_manager()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.trip_managers m where m.user_id = auth.uid());
$$;

revoke all on function public.is_trip_manager() from public;
grant execute on function public.is_trip_manager() to authenticated;

drop policy if exists "trip managers read bookings" on public.trip_bookings;
create policy "trip managers read bookings"
on public.trip_bookings for select
to authenticated
using (public.is_trip_manager());

drop policy if exists "trip managers update bookings" on public.trip_bookings;
create policy "trip managers update bookings"
on public.trip_bookings for update
to authenticated
using (public.is_trip_manager())
with check (public.is_trip_manager());

create or replace function public.create_trip_request(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tours jsonb := coalesce(p_payload->'tours','[]'::jsonb);
  v_id uuid;
  v_request_no text;
  v_public_token uuid;
begin
  if nullif(trim(p_payload->>'guest_name'),'') is null then raise exception 'Guest name is required'; end if;
  if nullif(trim(p_payload->>'phone'),'') is null then raise exception 'Phone is required'; end if;
  if jsonb_typeof(v_tours) <> 'array' or jsonb_array_length(v_tours) < 1 or jsonb_array_length(v_tours) > 4 then
    raise exception 'Choose between 1 and 4 tours';
  end if;

  insert into public.trip_bookings(
    source,travel_start,travel_end,guest_name,phone,hotel,room,adults,children,
    pregnancy,elderly,mobility,language,notes,prefs,tours
  ) values (
    coalesce(nullif(trim(p_payload->>'source'),''),'trip-planner'),
    nullif(p_payload->>'travel_start','')::date,
    nullif(p_payload->>'travel_end','')::date,
    left(trim(p_payload->>'guest_name'),180),
    left(trim(p_payload->>'phone'),80),
    left(coalesce(p_payload->>'hotel',''),180),
    left(coalesce(p_payload->>'room',''),80),
    greatest(1,least(50,coalesce((p_payload->>'adults')::integer,1))),
    left(coalesce(p_payload->>'children',''),300),
    coalesce((p_payload->>'pregnancy')::boolean,false),
    coalesce((p_payload->>'elderly')::boolean,false),
    left(coalesce(p_payload->>'mobility','No'),120),
    left(coalesce(p_payload->>'language','English'),40),
    left(coalesce(p_payload->>'notes',''),1200),
    coalesce(p_payload->'prefs','{}'::jsonb),
    v_tours
  ) returning id,request_no,public_token into v_id,v_request_no,v_public_token;

  return jsonb_build_object('id',v_id,'request_no',v_request_no,'public_token',v_public_token,'status','new');
end;
$$;

revoke all on function public.create_trip_request(jsonb) from public;
grant execute on function public.create_trip_request(jsonb) to anon, authenticated;

create or replace function public.get_public_booking(p_token uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  b public.trip_bookings%rowtype;
begin
  select * into b from public.trip_bookings where public_token=p_token and status='confirmed' limit 1;
  if b.id is null then return null; end if;
  return jsonb_build_object(
    'request_no',b.request_no,
    'ticket_no',b.ticket_no,
    'status',b.status,
    'confirmed_at',b.confirmed_at,
    'guest_name',b.guest_name,
    'hotel',b.hotel,
    'room',b.room,
    'adults',b.adults,
    'children',b.children,
    'language',b.language,
    'tours',b.tours,
    'public_token',b.public_token
  );
end;
$$;

revoke all on function public.get_public_booking(uuid) from public;
grant execute on function public.get_public_booking(uuid) to anon, authenticated;

-- IMPORTANT: after creating your manager user in Supabase Authentication,
-- add that user to the allow-list. Replace the email below and run once:
-- insert into public.trip_managers(user_id)
-- select id from auth.users where email='YOUR-MANAGER-EMAIL@example.com'
-- on conflict do nothing;
