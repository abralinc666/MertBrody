/*
# Add user identity and contact columns to profiles

1. Modified Tables
- `profiles` — adds columns needed for professional betting site registration:
  - `first_name` (text) — user's legal first name
  - `last_name` (text) — user's legal last name
  - `phone` (text) — phone number with country code
  - `tc_identity` (text) — Turkish TC kimlik number (11 digits, unique)
  - `birth_date` (date) — date of birth for age verification (18+)
  - `country` (text) — country of residence
  - `city` (text) — city of residence
  - `district` (text) — district/borough
  - `address` (text) — full street address
  - `postal_code` (text) — postal/zip code
  - `currency` (text) — preferred currency, defaults to TRY
2. Security
- No new tables. All existing RLS policies on profiles remain unchanged.
- Existing SELECT/UPDATE grants for authenticated role cover the new columns.
- Adds a unique constraint on tc_identity to prevent duplicate registrations.
3. Notes
- Columns are nullable so existing profiles aren't broken.
- The registration form will populate these via user_metadata on signUp.
- A trigger or the app can sync them into the profiles row on first login.
*/

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS first_name text,
  ADD COLUMN IF NOT EXISTS last_name text,
  ADD COLUMN IF NOT EXISTS phone text,
  ADD COLUMN IF NOT EXISTS tc_identity text,
  ADD COLUMN IF NOT EXISTS birth_date date,
  ADD COLUMN IF NOT EXISTS country text DEFAULT 'Türkiye',
  ADD COLUMN IF NOT EXISTS city text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS address text,
  ADD COLUMN IF NOT EXISTS postal_code text,
  ADD COLUMN IF NOT EXISTS currency text DEFAULT 'TRY';

-- Unique constraint on TC identity (only for non-null values)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'profiles_tc_identity_key') THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_tc_identity_key UNIQUE (tc_identity);
  END IF;
END $$;
