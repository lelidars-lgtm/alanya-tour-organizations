-- ============================================================================
-- ALANYA TOUR ORGANIZATIONS — ELECTRONIC GIFT CERTIFICATE -> EXISTING MANAGER
-- Run ONCE in the SAME Supabase project already used by ATO Booking Manager.
-- No second manager and no second database are created.
--
-- Flow:
-- Special Offers -> gift_certificate_request() -> public.bookings (PENDING)
-- Existing ATO Booking Manager -> CONFIRM BOOKING -> bookings.status='confirmed'
-- Trigger below -> gift certificate becomes ACTIVE and receives ATO-GIFT code
-- Public electronic certificate -> gift-certificate.html?token=<unguessable UUID>
-- ============================================================================

begin;

create table if not exists public.gift_certificates (
  id uuid primary key default gen_random_uuid(),
  request_no text not null unique,
  public_token uuid not null unique default gen_random_uuid(),
  certificate_code text unique,
  mode text not null check (mode in ('freedom','signature')),
  status text not null default 'REQUESTED' check (status in ('REQUESTED','ACTIVE','REDEEMED','CANCELLED','EXPIRED')),
  buyer_name text not null,
  buyer_phone text not null,
  recipient_name text not null,
  amount_eur numeric(12,2),
  experience text,
  preferred_date date,
  delivery_date date,
  personal_message text not null default '',
  issued_at timestamptz,
  valid_until date,
  redeemed_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gift_freedom_value check (mode <> 'freedom' or (amount_eur is not null and amount_eur > 0)),
  constraint gift_signature_experience check (mode <> 'signature' or length(trim(coalesce(experience,''))) > 0)
);

create index if not exists gift_certificates_status_idx on public.gift_certificates(status);
create index if not exists gift_certificates_phone_idx on public.gift_certificates(buyer_phone);
create index if not exists gift_certificates_created_idx on public.gift_certificates(created_at desc);

alter table public.gift_certificates enable row level security;
revoke all on public.gift_certificates from anon;
grant select, update on public.gift_certificates to authenticated;

-- Keep access inside the SAME owner login already used by ATO Booking Manager.
drop policy if exists "ATO owner reads gift certificates" on public.gift_certificates;
create policy "ATO owner reads gift certificates"
on public.gift_certificates for select
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru');

drop policy if exists "ATO owner updates gift certificates" on public.gift_certificates;
create policy "ATO owner updates gift certificates"
on public.gift_certificates for update
to authenticated
using (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru')
with check (lower(coalesce(auth.jwt() ->> 'email','')) = 'leli_dars@mail.ru');

create or replace function public.gift_normalize_phone(p_phone text)
returns text
language plpgsql
immutable
as $$
declare
  v text := regexp_replace(coalesce(p_phone,''), '[^0-9]', '', 'g');
begin
  if left(v,2)='00' then v := substr(v,3); end if;
  if length(v)=11 and left(v,1)='0' then v := '90' || substr(v,2); end if;
  if length(v)=10 and left(v,1)='5' then v := '90' || v; end if;
  return v;
end;
$$;

create or replace function public.gift_new_request_no()
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v text;
  i integer := 0;
begin
  loop
    i := i + 1;
    v := 'GIFT-' || to_char(current_date,'YY') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text || i::text),1,5));
    exit when not exists (select 1 from public.gift_certificates where request_no=v)
          and not exists (select 1 from public.bookings where request_no=v);
    if i > 100 then raise exception 'Could not generate Gift request number'; end if;
  end loop;
  return v;
end;
$$;

create or replace function public.gift_new_certificate_code()
returns text
language plpgsql
volatile
security definer
set search_path = public, pg_temp
as $$
declare
  v text;
  i integer := 0;
begin
  loop
    i := i + 1;
    v := 'ATO-GIFT-' || to_char(current_date,'YY') || '-' || upper(substr(md5(random()::text || clock_timestamp()::text || i::text),1,6));
    exit when not exists (select 1 from public.gift_certificates where certificate_code=v);
    if i > 100 then raise exception 'Could not generate Gift certificate code'; end if;
  end loop;
  return v;
end;
$$;

-- Public request endpoint. The browser never creates an ACTIVE certificate itself.
create or replace function public.gift_certificate_request(
  p_mode text,
  p_buyer_name text,
  p_buyer_phone text,
  p_recipient_name text,
  p_amount_eur numeric,
  p_experience text,
  p_preferred_date date,
  p_delivery_date date,
  p_personal_message text
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_mode text := lower(trim(coalesce(p_mode,'')));
  v_buyer text := left(trim(coalesce(p_buyer_name,'')),180);
  v_phone text := public.gift_normalize_phone(p_buyer_phone);
  v_recipient text := left(trim(coalesce(p_recipient_name,'')),180);
  v_experience text := left(trim(coalesce(p_experience,'')),260);
  v_message text := left(trim(coalesce(p_personal_message,'')),280);
  v_request text;
  v_token uuid := gen_random_uuid();
  v_value_text text;
  v_notes text;
begin
  if v_mode not in ('freedom','signature') then
    raise exception 'Choose Freedom Gift or Signature Gift.' using errcode='22023';
  end if;
  if length(v_buyer) < 2 then raise exception 'Enter your name.' using errcode='22023'; end if;
  if length(v_recipient) < 2 then raise exception 'Enter the recipient name.' using errcode='22023'; end if;
  if length(v_phone) < 10 or length(v_phone) > 15 then
    raise exception 'Enter a valid WhatsApp number including the country code.' using errcode='22023';
  end if;
  if p_delivery_date is not null and p_delivery_date < current_date then
    raise exception 'Certificate delivery date cannot be in the past.' using errcode='22023';
  end if;
  if v_mode='freedom' and coalesce(p_amount_eur,0) <= 0 then
    raise exception 'Enter the gift value.' using errcode='22023';
  end if;
  if v_mode='signature' and v_experience='' then
    raise exception 'Enter or choose the experience.' using errcode='22023';
  end if;
  if v_mode='signature' and p_preferred_date is not null and p_preferred_date < coalesce(p_delivery_date,current_date) then
    raise exception 'Experience date cannot be earlier than the certificate date.' using errcode='22023';
  end if;

  v_request := public.gift_new_request_no();
  v_value_text := case
    when v_mode='freedom' then case when p_amount_eur=trunc(p_amount_eur) then '€' || trunc(p_amount_eur)::text else '€' || to_char(p_amount_eur,'FM999999990.00') end
    else v_experience
  end;

  insert into public.gift_certificates(
    request_no,public_token,mode,status,buyer_name,buyer_phone,recipient_name,
    amount_eur,experience,preferred_date,delivery_date,personal_message
  ) values (
    v_request,v_token,v_mode,'REQUESTED',v_buyer,v_phone,v_recipient,
    case when v_mode='freedom' then p_amount_eur else null end,
    case when v_mode='signature' then v_experience else null end,
    p_preferred_date,p_delivery_date,v_message
  );

  v_notes := concat_ws(E'\n',
    '🎁 GIFT CERTIFICATE REQUEST',
    'Request: ' || v_request,
    'Status: REQUESTED — NOT VALID UNTIL MANAGER CONFIRMS',
    'Type: ' || case when v_mode='freedom' then 'Freedom Gift · chosen amount' else 'Signature Gift · specific experience' end,
    'Gift: ' || v_value_text,
    'Recipient: ' || v_recipient,
    'From: ' || v_buyer,
    'Buyer WhatsApp: +' || v_phone,
    'Give on: ' || coalesce(p_delivery_date::text,'Flexible / to confirm'),
    case when v_mode='signature' then 'Preferred experience date: ' || coalesce(p_preferred_date::text,'Flexible') else null end,
    'Personal message: ' || case when v_message='' then '—' else v_message end,
    'Electronic certificate path: /gift-certificate.html?token=' || v_token::text,
    'IMPORTANT: CONFIRM BOOKING in ATO Booking Manager only after payment/issue approval. Confirmation activates the electronic certificate and creates its unique ATO-GIFT code.'
  );

  -- Put it in the EXISTING ATO Booking Manager queue.
  -- tours is intentionally empty: a Gift Certificate is not a normal excursion ticket.
  insert into public.bookings(
    request_no,guest_name,phone,hotel,room,adults,children,
    pregnancy,elderly,mobility,language,tours,manager_notes,status
  ) values (
    v_request,
    v_buyer || ' → ' || v_recipient,
    v_phone,
    'GIFT CERTIFICATE · ' || upper(v_mode),
    '',1,'',false,false,'No','English','[]'::jsonb,v_notes,'PENDING'
  );

  return jsonb_build_object(
    'requestNo',v_request,
    'status','REQUESTED',
    'publicToken',v_token::text,
    'mode',v_mode,
    'recipientName',v_recipient,
    'buyerName',v_buyer,
    'buyerPhone',v_phone,
    'gift',v_value_text,
    'message','Gift request saved in ATO Booking Manager. The certificate becomes valid only after manager confirmation.'
  );
end;
$$;

-- Existing manager confirmation is the single issuing authority.
create or replace function public.gift_activate_from_booking_confirmation()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_code text;
begin
  if lower(coalesce(new.status,''))='confirmed'
     and lower(coalesce(old.status,'')) <> 'confirmed'
     and exists (select 1 from public.gift_certificates g where g.request_no=new.request_no and g.status='REQUESTED') then
    v_code := public.gift_new_certificate_code();
    update public.gift_certificates
       set status='ACTIVE',
           certificate_code=coalesce(certificate_code,v_code),
           issued_at=coalesce(issued_at,now()),
           valid_until=coalesce(valid_until,(current_date + interval '12 months')::date),
           updated_at=now()
     where request_no=new.request_no and status='REQUESTED';
  end if;
  return new;
end;
$$;

drop trigger if exists gift_certificate_activate_on_booking_confirm on public.bookings;
create trigger gift_certificate_activate_on_booking_confirm
after update of status on public.bookings
for each row execute function public.gift_activate_from_booking_confirmation();

-- Safe public read: only data intended to appear on the electronic certificate.
create or replace function public.gift_certificate_public(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  g public.gift_certificates%rowtype;
begin
  select * into g
  from public.gift_certificates
  where public_token::text=trim(coalesce(p_token,''));

  if not found then
    return jsonb_build_object('found',false);
  end if;

  if g.status='ACTIVE' and g.valid_until is not null and g.valid_until < current_date then
    update public.gift_certificates set status='EXPIRED',updated_at=now() where id=g.id and status='ACTIVE';
    g.status := 'EXPIRED';
  end if;

  return jsonb_build_object(
    'found',true,
    'requestNo',g.request_no,
    'certificateCode',coalesce(g.certificate_code,''),
    'status',g.status,
    'mode',g.mode,
    'recipientName',g.recipient_name,
    'fromName',g.buyer_name,
    'amountEur',g.amount_eur,
    'experience',coalesce(g.experience,''),
    'preferredDate',coalesce(g.preferred_date::text,''),
    'deliveryDate',coalesce(g.delivery_date::text,''),
    'personalMessage',g.personal_message,
    'issuedAt',coalesce(g.issued_at::text,''),
    'validUntil',coalesce(g.valid_until::text,'')
  );
end;
$$;

-- Manager-only redemption; useful from the optional Gifts panel in the same cabinet.
create or replace function public.gift_certificate_redeem(p_code text)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  g public.gift_certificates%rowtype;
begin
  if lower(coalesce(auth.jwt() ->> 'email','')) <> 'leli_dars@mail.ru' then
    raise exception 'Manager access required.' using errcode='42501';
  end if;

  select * into g from public.gift_certificates where certificate_code=upper(trim(coalesce(p_code,''))) for update;
  if not found then raise exception 'Gift certificate not found.' using errcode='22023'; end if;
  if g.status <> 'ACTIVE' then
    return jsonb_build_object('ok',false,'status',g.status,'code',g.certificate_code);
  end if;
  if g.valid_until is not null and g.valid_until < current_date then
    update public.gift_certificates set status='EXPIRED',updated_at=now() where id=g.id;
    return jsonb_build_object('ok',false,'status','EXPIRED','code',g.certificate_code);
  end if;

  update public.gift_certificates
     set status='REDEEMED',redeemed_at=now(),updated_at=now()
   where id=g.id;
  return jsonb_build_object('ok',true,'status','REDEEMED','code',g.certificate_code);
end;
$$;

revoke all on function public.gift_certificate_request(text,text,text,text,numeric,text,date,date,text) from public;
revoke all on function public.gift_certificate_public(text) from public;
revoke all on function public.gift_certificate_redeem(text) from public;

grant execute on function public.gift_certificate_request(text,text,text,text,numeric,text,date,date,text) to anon, authenticated;
grant execute on function public.gift_certificate_public(text) to anon, authenticated;
grant execute on function public.gift_certificate_redeem(text) to authenticated;

commit;

-- TEST SAFELY AFTER INSTALLATION:
-- 1) Submit a test Gift request from Special Offers using a non-client phone.
-- 2) Confirm the GIFT-... request in the EXISTING ATO Booking Manager.
-- 3) Open /gift-certificate.html?token=<token from the test request>.
--    Status must change from REQUESTED to ACTIVE and show a unique ATO-GIFT-... code.
