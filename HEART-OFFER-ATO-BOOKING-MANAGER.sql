-- ============================================================================
-- ALANYA TOUR ORGANIZATIONS — HEART OFFER -> EXISTING ATO BOOKING MANAGER
-- Run ONCE in the SAME Supabase project already used by Map / Trip Planner.
-- No second manager, no second database, no Vercel API is created here.
--
-- Flow:
-- Special Offers -> heart_offer_claim() -> public.bookings (PENDING)
-- Existing ATO Booking Manager -> CONFIRM BOOKING -> bookings.status='confirmed'
-- Trigger below -> Heart Offer becomes REDEEMED for that normalized WhatsApp.
-- ============================================================================

begin;

-- --------------------------------------------------------------------------
-- 1) Server-owned discount matrix.
--    The browser never decides the real discount or base price.
-- --------------------------------------------------------------------------
create table if not exists public.heart_offer_tours (
  id text primary key,
  title text not null,
  category text not null,
  regular_price numeric(12,2) not null check (regular_price >= 0),
  price_unit text not null default 'listed base price',
  url text not null,
  discount integer not null check (discount between 1 and 100),
  active boolean not null default true,
  updated_at timestamptz not null default now()
);

insert into public.heart_offer_tours
  (id,title,category,regular_price,price_unit,url,discount,active,updated_at)
values
  ('relax-boat-tour','Relax Boat Tour in Alanya','Sea Experiences',25,'listed base price','relax-boat-tour.html',15,true,now()),
  ('green-canyon','Green Canyon in Alanya','Nature & Adventure',35,'listed base price','green-canyon.html',20,true,now()),
  ('rafting-koprulu-canyon','Rafting in Köprülü Canyon','Extreme & Adventure',25,'listed base price','rafting-koprulu-canyon.html',10,true,now()),
  ('land-of-legends','The Land of Legends — Day Tour','Family Experiences',75,'adult listed base price','land-of-legends.html',15,true,now()),
  ('manavgat-aspendos-side','Aspendos, Side & Manavgat Waterfall','History & Culture',75,'listed base price','manavgat-aspendos-side.html',20,true,now()),
  ('scuba-diving','Scuba Diving in Alanya','Water Sports',35,'listed base price','scuba-diving.html',13,true,now()),
  ('paragliding','Alanya Paragliding','Air Experiences',75,'per person listed price','paragliding.html',17,true,now()),
  ('turkish-hammam','Turkish Hammam in Alanya','Wellness & Relax',35,'listed base price','turkish-hammam.html',15,true,now()),
  ('private-photographer','Private Photographer in Alanya','VIP Services',100,'1 hour listed base price','private-photographer.html',20,true,now())
on conflict (id) do update set
  title=excluded.title,
  category=excluded.category,
  regular_price=excluded.regular_price,
  price_unit=excluded.price_unit,
  url=excluded.url,
  discount=excluded.discount,
  active=excluded.active,
  updated_at=now();

-- --------------------------------------------------------------------------
-- 2) One commercial Heart Offer record per normalized WhatsApp number.
--    PENDING can change tour. REDEEMED can never issue another offer.
-- --------------------------------------------------------------------------
create table if not exists public.heart_offers (
  code text primary key,
  phone text not null unique,
  booking_request_no text not null unique,
  tour_id text not null references public.heart_offer_tours(id),
  tour_title text not null,
  category text not null,
  regular_price numeric(12,2) not null,
  discount integer not null,
  offer_price numeric(12,2) not null,
  status text not null default 'PENDING' check (status in ('PENDING','REDEEMED')),
  client_name text not null default '',
  adults integer not null default 1 check (adults >= 1),
  children text not null default '',
  desired_date date,
  hotel text not null default '',
  comment text not null default '',
  planner jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  redeemed_at timestamptz
);

create index if not exists heart_offers_status_idx on public.heart_offers(status);
create index if not exists heart_offers_booking_request_idx on public.heart_offers(booking_request_no);

-- Direct browser table access is intentionally disabled. Public access is only
-- through the SECURITY DEFINER RPC functions below.
alter table public.heart_offer_tours enable row level security;
alter table public.heart_offers enable row level security;
revoke all on public.heart_offer_tours from anon;
revoke all on public.heart_offers from anon;

-- --------------------------------------------------------------------------
-- 3) Helpers.
-- --------------------------------------------------------------------------
create or replace function public.heart_normalize_phone(p_phone text)
returns text
language plpgsql
immutable
as $$
declare
  v text := regexp_replace(coalesce(p_phone,''), '[^0-9]', '', 'g');
begin
  if left(v,2)='00' then v := substr(v,3); end if;
  -- Türkiye local mobile: 05XXXXXXXXX -> 905XXXXXXXXX
  if length(v)=11 and left(v,1)='0' then v := '90' || substr(v,2); end if;
  -- Türkiye mobile without country code: 5XXXXXXXXX -> 905XXXXXXXXX
  if length(v)=10 and left(v,1)='5' then v := '90' || v; end if;
  return v;
end;
$$;

create or replace function public.heart_money(p_value numeric)
returns text
language sql
immutable
as $$
  select case
    when p_value is null then '—'
    when p_value = trunc(p_value) then '€' || trunc(p_value)::text
    else '€' || to_char(p_value, 'FM999999990.00')
  end
$$;

create or replace function public.heart_new_code()
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v_code text;
  i integer := 0;
begin
  loop
    i := i + 1;
    v_code := 'HEART-' || to_char(current_date,'YY') || '-' ||
      upper(substr(md5(random()::text || clock_timestamp()::text || i::text),1,4));
    exit when not exists (select 1 from public.heart_offers where code=v_code);
    if i > 100 then raise exception 'Could not generate Heart Offer code'; end if;
  end loop;
  return v_code;
end;
$$;

-- If a booking was already confirmed before a trigger fired (or the migration
-- was installed afterward), synchronize the Heart record defensively.
create or replace function public.heart_sync_one(p_phone text)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_phone text := public.heart_normalize_phone(p_phone);
  v_request text;
begin
  select booking_request_no into v_request
  from public.heart_offers
  where phone=v_phone and status='PENDING';

  if v_request is not null and exists (
    select 1 from public.bookings b
    where b.request_no=v_request and lower(coalesce(b.status,''))='confirmed'
  ) then
    update public.heart_offers
       set status='REDEEMED', redeemed_at=coalesce(redeemed_at,now()), updated_at=now()
     where phone=v_phone and status='PENDING';
  end if;
end;
$$;

-- --------------------------------------------------------------------------
-- 4) Public eligibility RPC used before Journey starts.
-- --------------------------------------------------------------------------
create or replace function public.heart_offer_check(p_phone text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_phone text := public.heart_normalize_phone(p_phone);
  v_offer public.heart_offers%rowtype;
begin
  if length(v_phone) < 10 or length(v_phone) > 15 then
    raise exception 'Please enter a valid WhatsApp number with country code.' using errcode='22023';
  end if;

  perform public.heart_sync_one(v_phone);

  select * into v_offer from public.heart_offers where phone=v_phone;

  if not found then
    return jsonb_build_object(
      'phone',v_phone,
      'eligible',true,
      'pending',false,
      'redeemed',false
    );
  end if;

  return jsonb_build_object(
    'phone',v_phone,
    'eligible',(v_offer.status <> 'REDEEMED'),
    'pending',(v_offer.status = 'PENDING'),
    'redeemed',(v_offer.status = 'REDEEMED'),
    'code',v_offer.code,
    'status',v_offer.status
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 5) Claim/update RPC.
--    Creates/updates a NORMAL PENDING row in public.bookings — the very same
--    queue read by the existing ATO Booking Manager.
-- --------------------------------------------------------------------------
create or replace function public.heart_offer_claim(
  p_phone text,
  p_client_name text,
  p_adults integer,
  p_children text,
  p_desired_date date,
  p_hotel text,
  p_comment text,
  p_tour_id text,
  p_planner jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_phone text := public.heart_normalize_phone(p_phone);
  v_tour public.heart_offer_tours%rowtype;
  v_offer public.heart_offers%rowtype;
  v_code text;
  v_offer_price numeric(12,2);
  v_regular_text text;
  v_offer_text text;
  v_notes text;
  v_tours jsonb;
  v_name text := left(trim(coalesce(p_client_name,'')),180);
  v_hotel text := left(trim(coalesce(p_hotel,'')),220);
  v_children text := left(trim(coalesce(p_children,'')),300);
  v_comment text := left(trim(coalesce(p_comment,'')),1500);
  v_adults integer := greatest(coalesce(p_adults,1),1);
  v_planner jsonb := coalesce(p_planner,'{}'::jsonb);
begin
  if length(v_phone) < 10 or length(v_phone) > 15 then
    raise exception 'Please enter a valid WhatsApp number with country code.' using errcode='22023';
  end if;
  if v_name='' then
    raise exception 'Please enter the client name.' using errcode='22023';
  end if;

  select * into v_tour
  from public.heart_offer_tours
  where id=p_tour_id and active=true;
  if not found then
    raise exception 'This Heart Offer tour is not available.' using errcode='22023';
  end if;

  perform public.heart_sync_one(v_phone);

  -- Lock the existing commercial entitlement, if any.
  select * into v_offer
  from public.heart_offers
  where phone=v_phone
  for update;

  if found and v_offer.status='REDEEMED' then
    return jsonb_build_object(
      'phone',v_phone,
      'redeemed',true,
      'eligible',false,
      'code',v_offer.code,
      'status','REDEEMED'
    );
  end if;

  v_offer_price := round(v_tour.regular_price * (1 - v_tour.discount::numeric/100), 2);
  v_regular_text := public.heart_money(v_tour.regular_price);
  v_offer_text := public.heart_money(v_offer_price);

  if found then
    v_code := v_offer.code; -- CHOOSE ANOTHER keeps one neutral code.
    update public.heart_offers set
      tour_id=v_tour.id,
      tour_title=v_tour.title,
      category=v_tour.category,
      regular_price=v_tour.regular_price,
      discount=v_tour.discount,
      offer_price=v_offer_price,
      client_name=v_name,
      adults=v_adults,
      children=v_children,
      desired_date=p_desired_date,
      hotel=v_hotel,
      comment=v_comment,
      planner=v_planner,
      updated_at=now()
    where phone=v_phone;
  else
    v_code := public.heart_new_code();
    insert into public.heart_offers(
      code,phone,booking_request_no,tour_id,tour_title,category,
      regular_price,discount,offer_price,status,client_name,adults,children,
      desired_date,hotel,comment,planner
    ) values (
      v_code,v_phone,v_code,v_tour.id,v_tour.title,v_tour.category,
      v_tour.regular_price,v_tour.discount,v_offer_price,'PENDING',v_name,v_adults,v_children,
      p_desired_date,v_hotel,v_comment,v_planner
    );
  end if;

  v_notes := concat_ws(E'\n',
    '❤️ HEART OFFER',
    'Offer code: ' || v_code,
    'Category: ' || v_tour.category,
    'Regular listed price: ' || v_regular_text || ' · ' || v_tour.price_unit,
    'Heart discount: ' || v_tour.discount || '% OFF',
    'Heart listed price: ' || v_offer_text,
    'Client WhatsApp: +' || v_phone,
    'Client comment: ' || case when v_comment='' then '—' else v_comment end,
    'Journey choices: ' || case when v_planner='{}'::jsonb then '—' else v_planner::text end,
    'IMPORTANT: Heart Offer is consumed ONLY when this booking is confirmed in ATO Booking Manager.'
  );

  v_tours := jsonb_build_array(jsonb_build_object(
    'id',v_tour.id,
    'title',v_tour.title,
    'url',v_tour.url,
    'requested_date',coalesce(p_desired_date::text,''),
    'pickup',case when v_hotel='' then 'Hotel lobby' else v_hotel end,
    'time','',
    'price_display',v_offer_text || ' HEART · ' || v_tour.discount || '% OFF (regular ' || v_regular_text || ')',
    'heart_offer',true,
    'heart_code',v_code,
    'heart_category',v_tour.category,
    'heart_discount',v_tour.discount,
    'regular_price',v_tour.regular_price,
    'offer_price',v_offer_price,
    'price_unit',v_tour.price_unit
  ));

  -- Update the existing PENDING booking when the client uses CHOOSE ANOTHER.
  if exists (select 1 from public.bookings where request_no=v_code) then
    update public.bookings set
      guest_name=v_name,
      phone=v_phone,
      hotel=v_hotel,
      room='',
      adults=v_adults,
      children=v_children,
      pregnancy=false,
      elderly=false,
      mobility='No',
      language='English',
      tours=v_tours,
      manager_notes=v_notes,
      status='PENDING',
      updated_at=now()
    where request_no=v_code and lower(coalesce(status,'')) <> 'confirmed';
  else
    insert into public.bookings(
      request_no,guest_name,phone,hotel,room,adults,children,
      pregnancy,elderly,mobility,language,tours,manager_notes,status
    ) values (
      v_code,v_name,v_phone,v_hotel,'',v_adults,v_children,
      false,false,'No','English',v_tours,v_notes,'PENDING'
    );
  end if;

  return jsonb_build_object(
    'phone',v_phone,
    'redeemed',false,
    'eligible',true,
    'code',v_code,
    'status','PENDING',
    'tour',jsonb_build_object(
      'id',v_tour.id,
      'title',v_tour.title,
      'category',v_tour.category,
      'url',v_tour.url
    ),
    'pricing',jsonb_build_object(
      'regularPrice',v_tour.regular_price,
      'regularPriceText',v_regular_text,
      'discount',v_tour.discount,
      'offerPrice',v_offer_price,
      'offerPriceText',v_offer_text
    ),
    'client',jsonb_build_object(
      'clientName',v_name,
      'adults',v_adults,
      'children',v_children,
      'desiredDate',coalesce(p_desired_date::text,''),
      'hotel',v_hotel,
      'comment',v_comment,
      'planner',v_planner
    )
  );
end;
$$;

-- --------------------------------------------------------------------------
-- 6) Existing manager confirmation = commercial redemption.
--    No second manager button/page is needed.
-- --------------------------------------------------------------------------
create or replace function public.heart_redeem_from_booking_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  if lower(coalesce(new.status,''))='confirmed'
     and lower(coalesce(old.status,'')) <> 'confirmed' then
    update public.heart_offers
       set status='REDEEMED',
           redeemed_at=coalesce(redeemed_at,now()),
           updated_at=now()
     where booking_request_no=new.request_no
       and status='PENDING';
  end if;
  return new;
end;
$$;

drop trigger if exists heart_offer_redeem_on_booking_confirm on public.bookings;
create trigger heart_offer_redeem_on_booking_confirm
after update of status on public.bookings
for each row
execute function public.heart_redeem_from_booking_confirmation();

-- --------------------------------------------------------------------------
-- 7) RPC permissions for the public Special Offers page.
-- --------------------------------------------------------------------------
revoke all on function public.heart_offer_check(text) from public;
revoke all on function public.heart_offer_claim(text,text,integer,text,date,text,text,text,jsonb) from public;

grant execute on function public.heart_offer_check(text) to anon, authenticated;
grant execute on function public.heart_offer_claim(text,text,integer,text,date,text,text,text,jsonb) to anon, authenticated;

commit;

-- QUICK TEST AFTER RUNNING THIS MIGRATION:
-- select public.heart_offer_check('+90 555 111 22 33');
-- Do NOT run heart_offer_claim with a real client's phone merely for testing,
-- because it creates a real PENDING request in ATO Booking Manager.
