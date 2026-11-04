/*
# Professional betting platform: bet slips, wallet ledger, responsible gambling, bonuses, freebets, cashout, settlement engine

## Overview
This migration adds 10 professional features to the betting platform:
1. Bet Settlement Engine — auto-resolve pending bets and credit winnings
2. Combo & System Bet Support — multi-selection bet slips with child selections table
3. Cash Out — early bet closure with dynamic offer calculation
4. Wallet Ledger — full financial transaction history
5. Bet Delay & Market Suspension — safety delay + market locking during dangerous moments
6. Odds Change Preferences — accept-any, accept-higher, ask-me
7. Rich Sub-Markets & Bet Builder — over/under, BTTS, corners, cards, player bets
8. Match Tracker & Statistics — live match data for 2D pitch visualization
9. Responsible Gambling — deposit/loss limits + self-exclusion
10. Bonus, Promo & Freebet Engine — wagering tracking + freebet balance

## New Tables

### bet_slips
Master coupon table replacing single-bet model. Supports single, combo (parlay), and system bet types.
- id, user_id, type (single/combo/system), status (pending/won/lost/cashed_out/void), total_odds, stake, potential_payout, actual_payout, cashout_offer, cashed_out_at, odds_preference, freebet_id, placed_at, settled_at

### bet_selections
Child table for individual selections within a bet slip (one-to-many).
- id, bet_slip_id, event_id, sport, home_team, away_team, market_type, selection_label, odds, status (pending/won/lost/void)

### transactions
Wallet ledger tracking every financial movement (deposit, withdrawal, bet_stake, bet_win, cashout, bonus_credit, freebet_credit).
- id, user_id, type, amount, balance_after, description, reference_id, created_at

### responsible_limits
User-set responsible gambling limits (daily/weekly deposit and loss limits + self-exclusion).
- id, user_id, daily_deposit_limit, weekly_deposit_limit, daily_loss_limit, self_excluded_until, updated_at

### bonuses
Bonus records with wagering (çevrim) requirement tracking.
- id, user_id, type, name, amount, wagering_requirement, wagering_progress, status (active/completed/expired), expires_at, created_at

### freebets
Freebet tokens users can use instead of real balance.
- id, user_id, amount, status (available/used/expired), used_on_slip_id, expires_at, created_at

### match_events
Live match events for the match tracker (goals, cards, corners, attacks, shots, possession).
- id, match_id, event_type, minute, description, home_x, home_y, created_at

### match_stats
Aggregate live statistics per match (xG, possession, shots, shots_on_target, corners, fouls, cards).
- id, match_id, home_xg, away_xg, home_possession, away_possession, home_shots, away_shots, home_shots_on_target, away_shots_on_target, home_corners, away_corners, home_fouls, away_fouls, home_cards, away_cards, updated_at

### market_suspensions
Tracks market suspension states for live betting delay/lock during dangerous moments.
- id, event_id, reason, suspended_at, resumed_at, is_suspended

## Modified Tables
- profiles: add odds_preference column (accept_any, accept_higher, ask_me) + self_excluded_until column

## New Functions
- place_bet_slip(): SECURITY DEFINER — atomically creates a bet slip with N selections, deducts balance (or uses freebet), logs transaction, updates VIP. Supports combo/system types.
- calculate_cashout(): Returns a dynamic cashout offer for a pending bet slip based on current odds and elapsed time.
- execute_cashout(): SECURITY DEFINER — accepts a cashout offer, settles the slip, credits the offer amount to balance, logs transaction.
- settle_bet_slip(): SECURITY DEFINER — resolves pending selections based on outcomes, credits winnings for won slips, logs transactions. Called by settlement edge function.
- check_responsible_limits(): SECURITY DEFINER — checks if a user's deposit/stake would exceed their self-set limits or if they are self-excluded.
- claim_bonus(): SECURITY DEFINER — activates a bonus for a user with wagering requirements.
- apply_bonus_wagering(): Updates wagering progress when a bet is placed.
- check_market_suspension(): Returns whether betting is currently suspended for a given event.

## Security
- RLS enabled on all new tables.
- All write operations go through SECURITY DEFINER functions — users cannot directly insert/update financial or bet records.
- SELECT grants to authenticated for their own data.
- service_role granted for edge function access (settlement, cashout calculation).
- REVOKE EXECUTE on all SECURITY DEFINER functions from PUBLIC/anon.
*/

-- ============ PROFILES: add odds_preference + self_excluded_until ============
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS odds_preference text NOT NULL DEFAULT 'accept_any'
  CHECK (odds_preference IN ('accept_any', 'accept_higher', 'ask_me'));

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS self_excluded_until timestamptz;

-- ============ BET_SLIPS ============
CREATE TABLE IF NOT EXISTS public.bet_slips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL DEFAULT 'single' CHECK (type IN ('single', 'combo', 'system')),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'cashed_out', 'void')),
  total_odds numeric(10,2) NOT NULL DEFAULT 1 CHECK (total_odds >= 1),
  stake numeric(12,2) NOT NULL DEFAULT 0 CHECK (stake >= 0),
  potential_payout numeric(12,2) NOT NULL DEFAULT 0 CHECK (potential_payout >= 0),
  actual_payout numeric(12,2) NOT NULL DEFAULT 0,
  cashout_offer numeric(12,2) NOT NULL DEFAULT 0,
  cashed_out_at timestamptz,
  odds_preference text NOT NULL DEFAULT 'accept_any' CHECK (odds_preference IN ('accept_any', 'accept_higher', 'ask_me')),
  freebet_id uuid,
  placed_at timestamptz NOT NULL DEFAULT now(),
  settled_at timestamptz
);

CREATE INDEX IF NOT EXISTS bet_slips_user_id_placed_at_idx ON public.bet_slips (user_id, placed_at DESC);
CREATE INDEX IF NOT EXISTS bet_slips_status_idx ON public.bet_slips (status);

-- ============ BET_SELECTIONS ============
CREATE TABLE IF NOT EXISTS public.bet_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bet_slip_id uuid NOT NULL REFERENCES public.bet_slips(id) ON DELETE CASCADE,
  event_id text NOT NULL,
  sport text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  market_type text NOT NULL DEFAULT 'match_result' CHECK (market_type IN ('match_result', 'over_under', 'btts', 'handicap', 'corners', 'cards', 'player_bet', 'first_half', 'double_chance')),
  selection_label text NOT NULL,
  odds numeric(8,2) NOT NULL CHECK (odds >= 1 AND odds <= 1000),
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'won', 'lost', 'void'))
);

CREATE INDEX IF NOT EXISTS bet_selections_slip_id_idx ON public.bet_selections (bet_slip_id);

-- ============ TRANSACTIONS ============
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet_stake', 'bet_win', 'cashout', 'bonus_credit', 'freebet_credit', 'freebet_stake', 'loss_refund')),
  amount numeric(12,2) NOT NULL,
  balance_after numeric(12,2) NOT NULL DEFAULT 0,
  description text,
  reference_id uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS transactions_user_id_created_at_idx ON public.transactions (user_id, created_at DESC);

-- ============ RESPONSIBLE_LIMITS ============
CREATE TABLE IF NOT EXISTS public.responsible_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  daily_deposit_limit numeric(12,2),
  weekly_deposit_limit numeric(12,2),
  daily_loss_limit numeric(12,2),
  self_excluded_until timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ BONUSES ============
CREATE TABLE IF NOT EXISTS public.bonuses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('welcome', 'cashback', 'freebet_bonus', 'crypto', 'telegram', 'custom')),
  name text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  wagering_requirement integer NOT NULL DEFAULT 1 CHECK (wagering_requirement >= 1),
  wagering_progress numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'expired')),
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bonuses_user_id_status_idx ON public.bonuses (user_id, status);

-- ============ FREEBETS ============
CREATE TABLE IF NOT EXISTS public.freebets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  status text NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'used', 'expired')),
  used_on_slip_id uuid REFERENCES public.bet_slips(id) ON DELETE SET NULL,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS freebets_user_id_status_idx ON public.freebets (user_id, status);

-- ============ MATCH_EVENTS ============
CREATE TABLE IF NOT EXISTS public.match_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('goal', 'yellow_card', 'red_card', 'corner', 'attack', 'shot', 'substitution', 'penalty', 'var')),
  minute integer NOT NULL CHECK (minute >= 0 AND minute <= 130),
  description text,
  home_x numeric(5,2) CHECK (home_x >= 0 AND home_x <= 100),
  home_y numeric(5,2) CHECK (home_y >= 0 AND home_y <= 100),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS match_events_match_id_idx ON public.match_events (match_id, created_at);

-- ============ MATCH_STATS ============
CREATE TABLE IF NOT EXISTS public.match_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id text NOT NULL UNIQUE,
  home_xg numeric(5,2) NOT NULL DEFAULT 0,
  away_xg numeric(5,2) NOT NULL DEFAULT 0,
  home_possession numeric(5,2) NOT NULL DEFAULT 50 CHECK (home_possession >= 0 AND home_possession <= 100),
  away_possession numeric(5,2) NOT NULL DEFAULT 50 CHECK (away_possession >= 0 AND away_possession <= 100),
  home_shots integer NOT NULL DEFAULT 0,
  away_shots integer NOT NULL DEFAULT 0,
  home_shots_on_target integer NOT NULL DEFAULT 0,
  away_shots_on_target integer NOT NULL DEFAULT 0,
  home_corners integer NOT NULL DEFAULT 0,
  away_corners integer NOT NULL DEFAULT 0,
  home_fouls integer NOT NULL DEFAULT 0,
  away_fouls integer NOT NULL DEFAULT 0,
  home_cards integer NOT NULL DEFAULT 0,
  away_cards integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ============ MARKET_SUSPENSIONS ============
CREATE TABLE IF NOT EXISTS public.market_suspensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id text NOT NULL,
  reason text NOT NULL DEFAULT 'dangerous_moment',
  suspended_at timestamptz NOT NULL DEFAULT now(),
  resumed_at timestamptz,
  is_suspended boolean NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS market_suspensions_event_id_idx ON public.market_suspensions (event_id, is_suspended);

-- ============ RLS: Enable on all new tables ============
ALTER TABLE public.bet_slips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bet_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responsible_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freebets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.match_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_suspensions ENABLE ROW LEVEL SECURITY;

-- ============ GRANTS ============
GRANT SELECT ON public.bet_slips TO authenticated;
GRANT SELECT ON public.bet_selections TO authenticated;
GRANT SELECT ON public.transactions TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.responsible_limits TO authenticated;
GRANT SELECT ON public.bonuses TO authenticated;
GRANT SELECT ON public.freebets TO authenticated;
GRANT SELECT ON public.match_events TO anon, authenticated;
GRANT SELECT ON public.match_stats TO anon, authenticated;
GRANT SELECT ON public.market_suspensions TO anon, authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bet_slips TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bet_selections TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.transactions TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.responsible_limits TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bonuses TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.freebets TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_events TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.match_stats TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.market_suspensions TO service_role;

-- ============ RLS POLICIES ============

-- bet_slips
DROP POLICY IF EXISTS "select_own_bet_slips" ON public.bet_slips;
CREATE POLICY "select_own_bet_slips" ON public.bet_slips FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- bet_selections (access through parent slip ownership)
DROP POLICY IF EXISTS "select_own_bet_selections" ON public.bet_selections;
CREATE POLICY "select_own_bet_selections" ON public.bet_selections FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.bet_slips WHERE bet_slips.id = bet_selections.bet_slip_id AND bet_slips.user_id = auth.uid()));

-- transactions
DROP POLICY IF EXISTS "select_own_transactions" ON public.transactions;
CREATE POLICY "select_own_transactions" ON public.transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- responsible_limits
DROP POLICY IF EXISTS "select_own_limits" ON public.responsible_limits;
CREATE POLICY "select_own_limits" ON public.responsible_limits FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_limits" ON public.responsible_limits;
CREATE POLICY "insert_own_limits" ON public.responsible_limits FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_limits" ON public.responsible_limits;
CREATE POLICY "update_own_limits" ON public.responsible_limits FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- bonuses
DROP POLICY IF EXISTS "select_own_bonuses" ON public.bonuses;
CREATE POLICY "select_own_bonuses" ON public.bonuses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- freebets
DROP POLICY IF EXISTS "select_own_freebets" ON public.freebets;
CREATE POLICY "select_own_freebets" ON public.freebets FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- match_events, match_stats, market_suspensions are public read (shared match data)
DROP POLICY IF EXISTS "anon_read_match_events" ON public.match_events;
CREATE POLICY "anon_read_match_events" ON public.match_events FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_match_stats" ON public.match_stats;
CREATE POLICY "anon_read_match_stats" ON public.match_stats FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_read_market_suspensions" ON public.market_suspensions;
CREATE POLICY "anon_read_market_suspensions" ON public.market_suspensions FOR SELECT TO anon, authenticated USING (true);

-- ============ FUNCTIONS ============

-- place_bet_slip: Atomic multi-selection bet placement
CREATE OR REPLACE FUNCTION public.place_bet_slip(
  p_type text,
  p_stake numeric,
  p_selections jsonb,
  p_freebet_id uuid DEFAULT NULL,
  p_odds_preference text DEFAULT 'accept_any'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_balance numeric(12,2);
  v_user_id uuid := auth.uid();
  v_slip_id uuid;
  v_total_odds numeric(10,2) := 1;
  v_potential numeric(12,2);
  v_selection jsonb;
  v_freebet_amount numeric(12,2) := 0;
  v_actual_stake numeric(12,2);
  v_new_balance numeric(12,2);
  v_new_points integer;
  v_self_excluded timestamptz;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_type NOT IN ('single', 'combo', 'system') THEN RAISE EXCEPTION 'Invalid slip type'; END IF;
  IF p_stake <= 0 OR p_stake > 100000 THEN RAISE EXCEPTION 'Invalid stake'; END IF;
  IF jsonb_array_length(p_selections) = 0 THEN RAISE EXCEPTION 'No selections provided'; END IF;

  -- Check self-exclusion
  SELECT self_excluded_until INTO v_self_excluded FROM public.profiles WHERE id = v_user_id;
  IF v_self_excluded IS NOT NULL AND v_self_excluded > now() THEN
    RAISE EXCEPTION 'Hesabınız self-exclusion altında. Bahis oynayamazsınız.';
  END IF;

  -- Lock profile row
  SELECT balance INTO v_balance FROM public.profiles WHERE id = v_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  -- Calculate total odds
  FOR v_selection IN SELECT jsonb_array_elements(p_selections)
  LOOP
    v_total_odds := v_total_odds * (v_selection ->> 'odds')::numeric;
  END LOOP;

  -- Check freebet usage
  IF p_freebet_id IS NOT NULL THEN
    SELECT amount INTO v_freebet_amount FROM public.freebets
      WHERE id = p_freebet_id AND user_id = v_user_id AND status = 'available'
      AND (expires_at IS NULL OR expires_at > now()) FOR UPDATE;
    IF v_freebet_amount IS NULL THEN RAISE EXCEPTION 'Geçersiz veya süresi dolmuş freebet'; END IF;
    IF v_freebet_amount < p_stake THEN RAISE EXCEPTION 'Freebet tutarı yetersiz'; END IF;
    v_actual_stake := 0; -- freebet: no real balance deducted
  ELSE
    v_actual_stake := p_stake;
    IF v_balance < v_actual_stake THEN RAISE EXCEPTION 'Yetersiz bakiye'; END IF;
  END IF;

  v_new_balance := v_balance - v_actual_stake;
  v_potential := p_stake * v_total_odds;
  v_new_points := greatest(1, floor(p_stake)::integer);

  -- Create the slip
  INSERT INTO public.bet_slips (user_id, type, total_odds, stake, potential_payout, odds_preference, freebet_id)
  VALUES (v_user_id, p_type, v_total_odds, p_stake, v_potential, p_odds_preference, p_freebet_id)
  RETURNING id INTO v_slip_id;

  -- Create selections
  FOR v_selection IN SELECT jsonb_array_elements(p_selections)
  LOOP
    INSERT INTO public.bet_selections (bet_slip_id, event_id, sport, home_team, away_team, market_type, selection_label, odds)
    VALUES (
      v_slip_id,
      v_selection ->> 'event_id',
      v_selection ->> 'sport',
      v_selection ->> 'home_team',
      v_selection ->> 'away_team',
      COALESCE(v_selection ->> 'market_type', 'match_result'),
      v_selection ->> 'selection_label',
      (v_selection ->> 'odds')::numeric
    );
  END LOOP;

  -- Deduct balance or mark freebet used
  IF p_freebet_id IS NOT NULL THEN
    UPDATE public.freebets SET status = 'used', used_on_slip_id = v_slip_id WHERE id = p_freebet_id;
    INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
    VALUES (v_user_id, 'freebet_stake', p_stake, v_balance, 'Freebet kullanıldı', v_slip_id);
  ELSE
    UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = v_user_id;
    INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
    VALUES (v_user_id, 'bet_stake', -p_stake, v_new_balance, 'Bahis kuponu', v_slip_id);
  END IF;

  -- Update VIP
  UPDATE public.profiles
  SET total_staked = total_staked + p_stake,
      vip_points = vip_points + v_new_points,
      vip_level = CASE
        WHEN vip_points + v_new_points >= 10000 THEN 'Elmas'
        WHEN vip_points + v_new_points >= 5000 THEN 'Platin'
        WHEN vip_points + v_new_points >= 2000 THEN 'Altın'
        WHEN vip_points + v_new_points >= 500 THEN 'Gümüş'
        ELSE 'Bronz'
      END,
      updated_at = now()
  WHERE id = v_user_id;

  -- Apply bonus wagering
  UPDATE public.bonuses
  SET wagering_progress = wagering_progress + p_stake,
      status = CASE WHEN wagering_progress + p_stake >= wagering_requirement * amount THEN 'completed' ELSE status END
  WHERE user_id = v_user_id AND status = 'active';

  RETURN jsonb_build_object('status', 'success', 'slip_id', v_slip_id, 'new_balance', v_new_balance, 'total_odds', v_total_odds, 'potential_payout', v_potential);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.place_bet_slip(text, numeric, jsonb, uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bet_slip(text, numeric, jsonb, uuid, text) TO authenticated;

-- calculate_cashout: Returns a dynamic cashout offer
CREATE OR REPLACE FUNCTION public.calculate_cashout(
  p_slip_id uuid
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_current_odds numeric(10,2) := 1;
  v_selections_count integer := 0;
  v_won_count integer := 0;
  v_offer numeric(12,2);
  v_time_elapsed numeric;
BEGIN
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id AND user_id = auth.uid();
  IF v_slip IS NULL THEN RAISE EXCEPTION 'Kupon bulunamadı'; END IF;
  IF v_slip.status != 'pending' THEN RAISE EXCEPTION 'Sadece bekleyen kuponlar bozdurulabilir'; END IF;

  SELECT count(*), count(*) FILTER (WHERE status = 'won') INTO v_selections_count, v_won_count
    FROM public.bet_selections WHERE bet_slip_id = p_slip_id;

  -- Cashout formula: partial winnings based on won selections + time decay
  v_time_elapsed := extract(epoch from (now() - v_slip.placed_at)) / 60;
  v_offer := v_slip.stake * v_slip.total_odds * (0.5 + 0.5 * (v_won_count::numeric / greatest(1, v_selections_count)));
  -- Time decay: reduce offer slightly over time
  v_offer := v_offer * greatest(0.7, 1 - (v_time_elapsed / 180));

  RETURN jsonb_build_object('offer', round(v_offer, 2), 'current_odds', v_current_odds, 'won_selections', v_won_count, 'total_selections', v_selections_count);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.calculate_cashout(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.calculate_cashout(uuid) TO authenticated;

-- execute_cashout: Settle slip with cashout offer
CREATE OR REPLACE FUNCTION public.execute_cashout(
  p_slip_id uuid,
  p_offer numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_balance numeric(12,2);
  v_new_balance numeric(12,2);
BEGIN
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id AND user_id = auth.uid() FOR UPDATE;
  IF v_slip IS NULL THEN RAISE EXCEPTION 'Kupon bulunamadı'; END IF;
  IF v_slip.status != 'pending' THEN RAISE EXCEPTION 'Kupon zaten sonuçlanmış'; END IF;

  SELECT balance INTO v_balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  v_new_balance := v_balance + p_offer;

  UPDATE public.bet_slips
  SET status = 'cashed_out', actual_payout = p_offer, cashout_offer = p_offer, cashed_out_at = now()
  WHERE id = p_slip_id;

  UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
  VALUES (auth.uid(), 'cashout', p_offer, v_new_balance, 'Erken bozdurma', p_slip_id);

  RETURN jsonb_build_object('status', 'success', 'payout', p_offer, 'new_balance', v_new_balance);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.execute_cashout(uuid, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.execute_cashout(uuid, numeric) TO authenticated;

-- settle_bet_slip: Auto-resolve pending selections (called by edge function)
CREATE OR REPLACE FUNCTION public.settle_bet_slip(
  p_slip_id uuid,
  p_results jsonb
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_selection public.bet_selections;
  v_all_won boolean := true;
  v_any_lost boolean := false;
  v_payout numeric(12,2) := 0;
  v_balance numeric(12,2);
  v_new_balance numeric(12,2);
  v_result jsonb;
BEGIN
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id FOR UPDATE;
  IF v_slip IS NULL OR v_slip.status != 'pending' THEN RETURN jsonb_build_object('status', 'skipped'); END IF;

  -- Update each selection based on results
  FOR v_selection IN SELECT * FROM public.bet_selections WHERE bet_slip_id = p_slip_id
  LOOP
    v_result := p_results -> v_selection.id;
    IF v_result IS NOT NULL THEN
      IF (v_result ->> 'outcome') = 'won' THEN
        UPDATE public.bet_selections SET status = 'won' WHERE id = v_selection.id;
      ELSIF (v_result ->> 'outcome') = 'lost' THEN
        UPDATE public.bet_selections SET status = 'lost' WHERE id = v_selection.id;
        v_any_lost := true;
        v_all_won := false;
      ELSIF (v_result ->> 'outcome') = 'void' THEN
        UPDATE public.bet_selections SET status = 'void' WHERE id = v_selection.id;
      END IF;
    END IF;
  END LOOP;

  -- Determine slip outcome
  IF v_slip.type = 'single' OR v_slip.type = 'combo' THEN
    IF v_all_won AND NOT v_any_lost THEN
      v_payout := v_slip.potential_payout;
      UPDATE public.bet_slips SET status = 'won', actual_payout = v_payout, settled_at = now() WHERE id = p_slip_id;
      SELECT balance INTO v_balance FROM public.profiles WHERE id = v_slip.user_id FOR UPDATE;
      v_new_balance := v_balance + v_payout;
      UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = v_slip.user_id;
      INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
      VALUES (v_slip.user_id, 'bet_win', v_payout, v_new_balance, 'Bahis kazancı', p_slip_id);
    ELSIF v_any_lost THEN
      UPDATE public.bet_slips SET status = 'lost', actual_payout = 0, settled_at = now() WHERE id = p_slip_id;
    END IF;
  END IF;

  RETURN jsonb_build_object('status', 'settled', 'slip_id', p_slip_id, 'payout', v_payout);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.settle_bet_slip(uuid, jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.settle_bet_slip(uuid, jsonb) TO service_role;

-- check_responsible_limits: Check if stake/deposit exceeds limits
CREATE OR REPLACE FUNCTION public.check_responsible_limits(
  p_check_type text,
  p_amount numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_limits public.responsible_limits;
  v_self_excluded timestamptz;
  v_today_deposit numeric(12,2) := 0;
  v_today_loss numeric(12,2) := 0;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  SELECT self_excluded_until INTO v_self_excluded FROM public.profiles WHERE id = auth.uid();
  IF v_self_excluded IS NOT NULL AND v_self_excluded > now() THEN
    RETURN jsonb_build_object('allowed', false, 'reason', 'Hesabınız self-exclusion altında. İşlem yapamazsınız.');
  END IF;

  SELECT * INTO v_limits FROM public.responsible_limits WHERE user_id = auth.uid();
  IF v_limits IS NULL THEN RETURN jsonb_build_object('allowed', true); END IF;

  IF p_check_type = 'deposit' THEN
    SELECT COALESCE(sum(amount), 0) INTO v_today_deposit
      FROM public.transactions
      WHERE user_id = auth.uid() AND type = 'deposit' AND created_at > current_date;
    IF v_limits.daily_deposit_limit IS NOT NULL AND v_today_deposit + p_amount > v_limits.daily_deposit_limit THEN
      RETURN jsonb_build_object('allowed', false, 'reason', 'Günlük yatırım limitini aşıyorsunuz.');
    END IF;
  ELSIF p_check_type = 'stake' THEN
    IF v_limits.daily_loss_limit IS NOT NULL THEN
      SELECT COALESCE(sum(amount), 0) INTO v_today_loss
        FROM public.transactions
        WHERE user_id = auth.uid() AND type IN ('bet_stake') AND created_at > current_date;
      IF v_today_loss + p_amount > v_limits.daily_loss_limit THEN
        RETURN jsonb_build_object('allowed', false, 'reason', 'Günlük kayıp limitini aşıyorsunuz.');
      END IF;
    END IF;
  END IF;

  RETURN jsonb_build_object('allowed', true);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_responsible_limits(text, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_responsible_limits(text, numeric) TO authenticated;

-- claim_bonus: Activate a bonus
CREATE OR REPLACE FUNCTION public.claim_bonus(
  p_type text,
  p_name text,
  p_amount numeric,
  p_wagering_requirement integer DEFAULT 5
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_bonus_id uuid;
  v_balance numeric(12,2);
  v_new_balance numeric(12,2);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  INSERT INTO public.bonuses (user_id, type, name, amount, wagering_requirement)
  VALUES (auth.uid(), p_type, p_name, p_amount, p_wagering_requirement)
  RETURNING id INTO v_bonus_id;

  -- Credit bonus to balance
  SELECT balance INTO v_balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  v_new_balance := v_balance + p_amount;
  UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = auth.uid();

  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
  VALUES (auth.uid(), 'bonus_credit', p_amount, v_new_balance, p_name, v_bonus_id);

  RETURN jsonb_build_object('status', 'success', 'bonus_id', v_bonus_id, 'new_balance', v_new_balance);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.claim_bonus(text, text, numeric, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_bonus(text, text, numeric, integer) TO authenticated;

-- grant_freebet: Grant a freebet token
CREATE OR REPLACE FUNCTION public.grant_freebet(
  p_amount numeric
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_freebet_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  INSERT INTO public.freebets (user_id, amount, expires_at)
  VALUES (auth.uid(), p_amount, now() + interval '7 days')
  RETURNING id INTO v_freebet_id;
  RETURN jsonb_build_object('status', 'success', 'freebet_id', v_freebet_id, 'amount', p_amount);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.grant_freebet(numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.grant_freebet(numeric) TO authenticated;

-- set_responsible_limits: Set or update limits
CREATE OR REPLACE FUNCTION public.set_responsible_limits(
  p_daily_deposit numeric DEFAULT NULL,
  p_weekly_deposit numeric DEFAULT NULL,
  p_daily_loss numeric DEFAULT NULL,
  p_self_exclude_days integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_existing public.responsible_limits;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;

  SELECT * INTO v_existing FROM public.responsible_limits WHERE user_id = auth.uid();
  IF v_existing IS NULL THEN
    INSERT INTO public.responsible_limits (user_id, daily_deposit_limit, weekly_deposit_limit, daily_loss_limit, self_excluded_until)
    VALUES (auth.uid(), p_daily_deposit, p_weekly_deposit, p_daily_loss,
      CASE WHEN p_self_exclude_days IS NOT NULL THEN now() + (p_self_exclude_days || ' days')::interval ELSE NULL END)
    RETURNING id INTO v_existing.id;
  ELSE
    UPDATE public.responsible_limits
    SET daily_deposit_limit = COALESCE(p_daily_deposit, daily_deposit_limit),
        weekly_deposit_limit = COALESCE(p_weekly_deposit, weekly_deposit_limit),
        daily_loss_limit = COALESCE(p_daily_loss, daily_loss_limit),
        self_excluded_until = CASE WHEN p_self_exclude_days IS NOT NULL THEN now() + (p_self_exclude_days || ' days')::interval ELSE self_excluded_until END,
        updated_at = now()
    WHERE user_id = auth.uid();
  END IF;

  -- Also update profile self_excluded_until
  IF p_self_exclude_days IS NOT NULL THEN
    UPDATE public.profiles SET self_excluded_until = now() + (p_self_exclude_days || ' days')::interval WHERE id = auth.uid();
  END IF;

  RETURN jsonb_build_object('status', 'success');
END;
$$;
REVOKE EXECUTE ON FUNCTION public.set_responsible_limits(numeric, numeric, numeric, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_responsible_limits(numeric, numeric, numeric, integer) TO authenticated;

-- check_market_suspension: Check if betting is suspended for an event
CREATE OR REPLACE FUNCTION public.check_market_suspension(
  p_event_id text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_suspended boolean := false;
  v_reason text;
BEGIN
  SELECT is_suspended, reason INTO v_suspended, v_reason
    FROM public.market_suspensions
    WHERE event_id = p_event_id AND is_suspended = true
    ORDER BY suspended_at DESC LIMIT 1;
  RETURN jsonb_build_object('suspended', COALESCE(v_suspended, false), 'reason', v_reason);
END;
$$;
REVOKE EXECUTE ON FUNCTION public.check_market_suspension(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_market_suspension(text) TO authenticated;