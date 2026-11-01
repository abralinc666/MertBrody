/*
# Create user profiles, VIP progress, and betting history

1. New Tables
- `profiles`: one private profile per authenticated user; stores display name and server-controlled VIP totals.
- `bets`: private betting history rows owned by the authenticated user; stores event, selection, odds, stake, and result status.

2. Profile Columns
- `id`: references the Supabase auth user.
- `display_name`, `avatar_url`: user-editable profile details.
- `vip_level`, `vip_points`, `total_staked`: server-controlled loyalty and activity totals.

3. Bet Columns
- `user_id`: filled from the authenticated session, never trusted from the browser.
- `event_id`, `sport`, `home_team`, `away_team`, `selection`, `odds`, `stake`, `status`, `placed_at`.

4. Security
- Enable RLS on both tables.
- Authenticated users can only read their own profile and bets.
- Profile writes are limited to display name and avatar URL.
- Bet creation happens through a SECURITY DEFINER function that derives the owner from auth.uid(), validates values, and updates VIP totals atomically.
- Anonymous users receive no access to private records or the betting function.

5. Important Notes
- This migration does not create a custom authentication table; Supabase Auth remains the source of identity.
- Email confirmation is not changed by this migration.
*/

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  avatar_url text,
  vip_level text NOT NULL DEFAULT 'Bronz',
  vip_points integer NOT NULL DEFAULT 0 CHECK (vip_points >= 0),
  total_staked numeric(12,2) NOT NULL DEFAULT 0 CHECK (total_staked >= 0),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.bets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  event_id text NOT NULL,
  sport text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  selection text NOT NULL,
  odds numeric(8,2) NOT NULL CHECK (odds >= 1 AND odds <= 1000),
  stake numeric(12,2) NOT NULL CHECK (stake > 0 AND stake <= 100000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void')),
  placed_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bets_user_id_placed_at_idx ON public.bets (user_id, placed_at DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bets ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON public.profiles TO authenticated;
GRANT UPDATE (display_name, avatar_url) ON public.profiles TO authenticated;
GRANT SELECT ON public.bets TO authenticated;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their profile details" ON public.profiles;
CREATE POLICY "Users can update their profile details" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view their own bets" ON public.bets;
CREATE POLICY "Users can view their own bets" ON public.bets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(NEW.email, '@', 1)))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.place_bet(
  p_event_id text,
  p_sport text,
  p_home_team text,
  p_away_team text,
  p_selection text,
  p_odds numeric,
  p_stake numeric
)
RETURNS public.bets
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_bet public.bets;
  v_points integer;
  v_level text;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF length(trim(p_event_id)) = 0 OR length(trim(p_sport)) = 0 OR length(trim(p_home_team)) = 0 OR length(trim(p_away_team)) = 0 OR length(trim(p_selection)) = 0 THEN RAISE EXCEPTION 'Invalid bet details'; END IF;
  IF p_odds < 1 OR p_odds > 1000 OR p_stake <= 0 OR p_stake > 100000 THEN RAISE EXCEPTION 'Invalid bet values'; END IF;

  INSERT INTO public.bets (user_id, event_id, sport, home_team, away_team, selection, odds, stake)
  VALUES (auth.uid(), trim(p_event_id), trim(p_sport), trim(p_home_team), trim(p_away_team), trim(p_selection), p_odds, p_stake)
  RETURNING * INTO v_bet;

  UPDATE public.profiles
  SET total_staked = total_staked + p_stake,
      vip_points = vip_points + greatest(1, floor(p_stake)::integer),
      vip_level = CASE
        WHEN vip_points + greatest(1, floor(p_stake)::integer) >= 10000 THEN 'Elmas'
        WHEN vip_points + greatest(1, floor(p_stake)::integer) >= 5000 THEN 'Platin'
        WHEN vip_points + greatest(1, floor(p_stake)::integer) >= 2000 THEN 'Altın'
        WHEN vip_points + greatest(1, floor(p_stake)::integer) >= 500 THEN 'Gümüş'
        ELSE 'Bronz'
      END,
      updated_at = now()
  WHERE id = auth.uid();

  RETURN v_bet;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) TO authenticated;
