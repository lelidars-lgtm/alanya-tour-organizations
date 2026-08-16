-- ALANYA TOUR ORGANIZATIONS — Gift delivery upgrade
-- Run AFTER:
--   1) HEART-OFFER-ATO-BOOKING-MANAGER.sql
--   2) GIFT-CERTIFICATE-ATO-BOOKING-MANAGER.sql

begin;

alter table public.gift_certificates
  add column if not exists recipient_delivery_contact text;

create or replace function public.gift_certificate_request_v2(
  p_mode text,
  p_buyer_name text,
  p_buyer_phone text,
  p_recipient_name text,
  p_recipient_contact text,
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
  v_contact text := left(trim(coalesce(p_recipient_contact,'')),220);
  v_experience text := left(trim(coalesce(p_experience,'')),260);
  v_message text := left(trim(coalesce(p_personal_message,'')),280);
  v_request text;
  v_token uuid := gen_random_uuid();
  v_value_text text;
  v_notes text;
begin
  if v_mode not in ('freedom','signature') then raise exception 'Choose Freedom Gift or Signature Gift.' using errcode='22023'; end if;
  if length(v_buyer)<2 then raise exception 'Enter your name.' using errcode='22023'; end if;
  if length(v_recipient)<2 then raise exception 'Enter the recipient name.' using errcode='22023'; end if;
  if length(v_phone)<10 or length(v_phone)>15 then raise exception 'Enter a valid buyer WhatsApp number with country code.' using errcode='22023'; end if;
  if length(v_contact)<5 then raise exception 'Enter the recipient WhatsApp number or email.' using errcode='22023'; end if;
  if p_delivery_date is not null and p_delivery_date<current_date then raise exception 'Certificate delivery date cannot be in the past.' using errcode='22023'; end if;
  if v_mode='freedom' and coalesce(p_amount_eur,0)<=0 then raise exception 'Enter the gift value.' using errcode='22023'; end if;
  if v_mode='signature' and v_experience='' then raise exception 'Enter or choose the experience.' using errcode='22023'; end if;
  if v_mode='signature' and p_preferred_date is not null and p_preferred_date<coalesce(p_delivery_date,current_date) then raise exception 'Experience date cannot be earlier than the certificate delivery date.' using errcode='22023'; end if;

  v_request:=public.gift_new_request_no();
  v_value_text:=case when v_mode='freedom' then
    case when p_amount_eur=trunc(p_amount_eur) then '€'||trunc(p_amount_eur)::text else '€'||to_char(p_amount_eur,'FM999999990.00') end
    else v_experience end;

  insert into public.gift_certificates(
    request_no,public_token,mode,status,buyer_name,buyer_phone,recipient_name,
    recipient_delivery_contact,amount_eur,experience,preferred_date,delivery_date,personal_message
  ) values (
    v_request,v_token,v_mode,'REQUESTED',v_buyer,v_phone,v_recipient,v_contact,
    case when v_mode='freedom' then p_amount_eur else null end,
    case when v_mode='signature' then v_experience else null end,
    p_preferred_date,p_delivery_date,v_message
  );

  v_notes:=concat_ws(E'\n',
    '🎁 GIFT CERTIFICATE REQUEST',
    'Request: '||v_request,
    'Status: REQUESTED — NOT VALID UNTIL MANAGER CONFIRMS',
    'Type: '||case when v_mode='freedom' then 'Freedom Gift · chosen amount' else 'Signature Gift · specific experience' end,
    'Gift: '||v_value_text,
    'Recipient: '||v_recipient,
    'SEND FINAL CERTIFICATE TO RECIPIENT: '||v_contact,
    'Buyer: '||v_buyer,
    'Buyer WhatsApp: +'||v_phone,
    'Send on: '||coalesce(p_delivery_date::text,'After manager confirmation'),
    case when v_mode='signature' then 'Preferred experience date: '||coalesce(p_preferred_date::text,'Flexible') else null end,
    'Personal message: '||case when v_message='' then '—' else v_message end,
    'Electronic certificate: /gift-certificate.html?token='||v_token::text,
    'CONFIRM BOOKING only after payment/issue approval. Confirmation activates the certificate and creates its ATO-GIFT code.'
  );

  insert into public.bookings(
    request_no,guest_name,phone,hotel,room,adults,children,
    pregnancy,elderly,mobility,language,tours,manager_notes,status
  ) values (
    v_request,v_buyer||' → '||v_recipient,v_phone,
    'GIFT CERTIFICATE · '||upper(v_mode),'',1,'',false,false,'No','English','[]'::jsonb,v_notes,'PENDING'
  );

  return jsonb_build_object(
    'requestNo',v_request,'status','REQUESTED','publicToken',v_token::text,
    'mode',v_mode,'recipientName',v_recipient,'recipientContact',v_contact,
    'buyerName',v_buyer,'buyerPhone',v_phone,'gift',v_value_text
  );
end;
$$;

revoke all on function public.gift_certificate_request_v2(text,text,text,text,text,numeric,text,date,date,text) from public;
grant execute on function public.gift_certificate_request_v2(text,text,text,text,text,numeric,text,date,date,text) to anon, authenticated;

commit;
