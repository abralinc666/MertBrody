/*
# Add user balance and make betting atomically check & deduct balance

1. Modified Tables
- `profiles`: add `balance` column (numeric, default 1000) so users start with a demo balance.

2. Modified Functions
- `place_bet`: now locks the user's profile row, checks the balance is sufficient,
  deducts the stake atomically, then inserts the bet and updates VIP totals.
  Returns JSONB with the new balance instead of a bets row (return type changed).
  This prevents race conditions (double-click attacks) and balance manipulation.

3. Security
- The `balance` column is NOT client-editable: existing UPDATE grant stays on (display_name, avatar_url) only.
- `place_bet` remains SECURITY DEFINER and the sole write path for bets.
- No new grants on the balance column to any client role.

4. Important Notes
- Existing profiles get balance = 1000 (demo starting balance).
- New users get 1000 via the column default.
- The function now returns JSONB with the new balance so the frontend can update instantly.
*/

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS balance numeric(12,2) NOT NULL DEFAULT 1000 CHECK (balance >= 0);

UPDATE public.profiles SET balance = 1000 WHERE balance IS NULL;

DROP FUNCTION IF EXISTS public.place_bet(text, text, text, text, text, numeric, numeric);

CREATE OR REPLACE FUNCTION public.place_bet(
  p_event_id text,
  p_sport text,
  p_home_team text,
  p_away_team text,
  p_selection text,
  p_odds numeric,
  p_stake numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_balance numeric(12,2);
  v_bet_id uuid;
  v_new_points integer;
  v_new_balance numeric(12,2);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF length(trim(p_event_id)) = 0 OR length(trim(p_sport)) = 0 OR length(trim(p_home_team)) = 0 OR length(trim(p_away_team)) = 0 OR length(trim(p_selection)) = 0 THEN RAISE EXCEPTION 'Invalid bet details'; END IF;
  IF p_odds < 1 OR p_odds > 1000 OR p_stake <= 0 OR p_stake > 100000 THEN RAISE EXCEPTION 'Invalid bet values'; END IF;

  -- Lock the profile row to prevent concurrent double-spending
  SELECT balance INTO v_balance
  FROM public.profiles
  WHERE id = auth.uid()
  FOR UPDATE;

  IF v_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;
  IF v_balance < p_stake THEN RAISE EXCEPTION 'Yetersiz bakiye'; END IF;

  v_new_balance := v_balance - p_stake;
  v_new_points := greatest(1, floor(p_stake)::integer);

  -- Deduct balance and update VIP totals atomically
  UPDATE public.profiles
  SET balance = v_new_balance,
      total_staked = total_staked + p_stake,
      vip_points = vip_points + v_new_points,
      vip_level = CASE
        WHEN vip_points + v_new_points >= 10000 THEN 'Elmas'
        WHEN vip_points + v_new_points >= 5000 THEN 'Platin'
        WHEN vip_points + v_new_points >= 2000 THEN 'Altın'
        WHEN vip_points + v_new_points >= 500 THEN 'Gümüş'
        ELSE 'Bronz'
      END,
      updated_at = now()
  WHERE id = auth.uid();

  -- Insert the bet record
  INSERT INTO public.bets (user_id, event_id, sport, home_team, away_team, selection, odds, stake)
  VALUES (auth.uid(), trim(p_event_id), trim(p_sport), trim(p_home_team), trim(p_away_team), trim(p_selection), p_odds, p_stake)
  RETURNING id INTO v_bet_id;

  RETURN jsonb_build_object(
    'status', 'success',
    'bet_id', v_bet_id,
    'new_balance', v_new_balance
  );
END;
$$;

REVOKE EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bet(text, text, text, text, text, numeric, numeric) TO authenticated;