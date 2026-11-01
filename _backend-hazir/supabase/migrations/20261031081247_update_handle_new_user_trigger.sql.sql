/*
# Update handle_new_user trigger to capture full registration data

1. Modified Functions
- `handle_new_user()` — now inserts all identity fields from raw_user_meta_data:
  first_name, last_name, phone, tc_identity, birth_date, country, city,
  district, address, postal_code, currency
2. Security
- Function remains SECURITY DEFINER with search_path = 'public'
- Still fires AFTER INSERT on auth.users (existing trigger unchanged)
- No new grants needed — SECURITY DEFINER bypasses RLS for the insert
3. Notes
- All new fields are pulled from raw_user_meta_data which is set by
  supabase.auth.signUp({ options: { data: {...} } })
- COALESCE keeps existing behavior: display_name falls back to email prefix
- ON CONFLICT (id) DO NOTHING prevents duplicate profile rows
*/

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.profiles (
    id,
    display_name,
    first_name,
    last_name,
    phone,
    tc_identity,
    birth_date,
    country,
    city,
    district,
    address,
    postal_code,
    currency
  )
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data ->> 'display_name',
      NEW.raw_user_meta_data ->> 'first_name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    NEW.raw_user_meta_data ->> 'phone',
    NEW.raw_user_meta_data ->> 'tc_identity',
    (NEW.raw_user_meta_data ->> 'birth_date')::date,
    COALESCE(NEW.raw_user_meta_data ->> 'country', 'Türkiye'),
    NEW.raw_user_meta_data ->> 'city',
    NEW.raw_user_meta_data ->> 'district',
    NEW.raw_user_meta_data ->> 'address',
    NEW.raw_user_meta_data ->> 'postal_code',
    COALESCE(NEW.raw_user_meta_data ->> 'currency', 'TRY')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;
