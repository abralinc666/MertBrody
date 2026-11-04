/*
# Güvenlik ve doğruluk düzeltmeleri

Bu migration, önceki sürümlerdeki kritik açıkları ve mantık hatalarını kapatır:

1. İstemci kaynaklı tutar/oran açıkları
   - claim_bonus(tutar istemciden geliyordu)  -> claim_bonus(p_type) + bonus_definitions
   - grant_freebet(tutar istemciden geliyordu) -> claim_freebet() (kullanıcı başına tek sefer)
   - execute_cashout(teklif istemciden geliyordu) -> teklif sunucuda yeniden hesaplanır
   - place_bet_slip oranları istemciden alıyordu -> odds_catalog'dan doğrulanır
   - place_bet (eski, oran/market doğrulaması yok) kaldırıldı
2. Yetki açıkları
   - settle_bet_slip artık yalnızca service_role tarafından çağrılabilir
   - responsible_limits tablosuna doğrudan yazma kapatıldı, yalnızca RPC
   - self-exclusion süresi kısaltılamaz
   - odds_preference sütunu güncellenebilir hale getirildi (kaydedilemiyordu)
3. Sonuçlandırma mantığı
   - jsonb -> uuid hatası, bekleyen seçimlerle kazanç ödenmesi, void'in tam ödeme sayılması düzeltildi
   - Sistem kuponları artık gerçekten sonuçlandırılıyor
4. Cashout formülü: peşin sömürülebilir (oran*0.5) yerine kazanılmış bacakların oranı * 0.90
5. Sorumlu oyun: günlük kayıp limiti artık bahis sırasında uygulanıyor
6. Kayıt: boş string -> NULL, 18 yaş ve TC biçim kontrolü sunucuda
7. Realtime yayını (supabase_realtime) tablolara eklendi
*/

-- ============ ODDS CATALOG ============
CREATE TABLE IF NOT EXISTS public.odds_catalog (
  event_id text NOT NULL,
  market_type text NOT NULL,
  selection_label text NOT NULL,
  odds numeric(8,2) NOT NULL CHECK (odds >= 1 AND odds <= 1000),
  suspended boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (event_id, market_type, selection_label)
);
ALTER TABLE public.odds_catalog ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.odds_catalog FROM anon, authenticated;
GRANT SELECT ON public.odds_catalog TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.odds_catalog TO service_role;
DROP POLICY IF EXISTS "read_odds_catalog" ON public.odds_catalog;
CREATE POLICY "read_odds_catalog" ON public.odds_catalog FOR SELECT TO anon, authenticated USING (true);

-- ============ BONUS DEFINITIONS ============
CREATE TABLE IF NOT EXISTS public.bonus_definitions (
  type text PRIMARY KEY,
  name text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  wagering_requirement integer NOT NULL DEFAULT 1 CHECK (wagering_requirement >= 1)
);
ALTER TABLE public.bonus_definitions ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.bonus_definitions FROM anon, authenticated;
GRANT SELECT ON public.bonus_definitions TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bonus_definitions TO service_role;
DROP POLICY IF EXISTS "read_bonus_definitions" ON public.bonus_definitions;
CREATE POLICY "read_bonus_definitions" ON public.bonus_definitions FOR SELECT TO anon, authenticated USING (true);

-- ============ SEED ============
insert into public.odds_catalog (event_id, market_type, selection_label, odds) values
  ('Galatasaray-Fenerbahçe', 'match_result', '1 · Galatasaray', 1.45),
  ('Galatasaray-Fenerbahçe', 'match_result', 'X · Beraberlik', 3.80),
  ('Galatasaray-Fenerbahçe', 'match_result', '2 · Fenerbahçe', 6.20),
  ('Galatasaray-Fenerbahçe', 'over_under', 'Alt 2.5', 1.75),
  ('Galatasaray-Fenerbahçe', 'over_under', 'Üst 2.5', 2.05),
  ('Galatasaray-Fenerbahçe', 'btts', 'Var', 1.85),
  ('Galatasaray-Fenerbahçe', 'btts', 'Yok', 1.95),
  ('Galatasaray-Fenerbahçe', 'double_chance', '1X', 1.25),
  ('Galatasaray-Fenerbahçe', 'double_chance', '12', 1.30),
  ('Galatasaray-Fenerbahçe', 'double_chance', 'X2', 1.45),
  ('Galatasaray-Fenerbahçe', 'handicap', '1 (+1) Galatasaray', 1.55),
  ('Galatasaray-Fenerbahçe', 'handicap', '2 (-1) Fenerbahçe', 2.40),
  ('Galatasaray-Fenerbahçe', 'corners', 'Üst 9.5', 1.90),
  ('Galatasaray-Fenerbahçe', 'corners', 'Alt 9.5', 1.80),
  ('Galatasaray-Fenerbahçe', 'cards', 'Üst 3.5', 2.10),
  ('Galatasaray-Fenerbahçe', 'cards', 'Alt 3.5', 1.70),
  ('Galatasaray-Fenerbahçe', 'first_half', '1 · Galatasaray', 2.20),
  ('Galatasaray-Fenerbahçe', 'first_half', 'X · Beraberlik', 1.50),
  ('Galatasaray-Fenerbahçe', 'first_half', '2 · Fenerbahçe', 3.10),
  ('Real Madrid-Barcelona', 'match_result', '1 · Real Madrid', 1.70),
  ('Real Madrid-Barcelona', 'match_result', 'X · Beraberlik', 3.60),
  ('Real Madrid-Barcelona', 'match_result', '2 · Barcelona', 4.80),
  ('Real Madrid-Barcelona', 'over_under', 'Alt 2.5', 1.75),
  ('Real Madrid-Barcelona', 'over_under', 'Üst 2.5', 2.05),
  ('Real Madrid-Barcelona', 'btts', 'Var', 1.85),
  ('Real Madrid-Barcelona', 'btts', 'Yok', 1.95),
  ('Real Madrid-Barcelona', 'double_chance', '1X', 1.25),
  ('Real Madrid-Barcelona', 'double_chance', '12', 1.30),
  ('Real Madrid-Barcelona', 'double_chance', 'X2', 1.45),
  ('Real Madrid-Barcelona', 'handicap', '1 (+1) Real Madrid', 1.55),
  ('Real Madrid-Barcelona', 'handicap', '2 (-1) Barcelona', 2.40),
  ('Real Madrid-Barcelona', 'corners', 'Üst 9.5', 1.90),
  ('Real Madrid-Barcelona', 'corners', 'Alt 9.5', 1.80),
  ('Real Madrid-Barcelona', 'cards', 'Üst 3.5', 2.10),
  ('Real Madrid-Barcelona', 'cards', 'Alt 3.5', 1.70),
  ('Real Madrid-Barcelona', 'first_half', '1 · Real Madrid', 2.20),
  ('Real Madrid-Barcelona', 'first_half', 'X · Beraberlik', 1.50),
  ('Real Madrid-Barcelona', 'first_half', '2 · Barcelona', 3.10),
  ('Manchester United-Liverpool', 'match_result', '1 · Manchester United', 4.20),
  ('Manchester United-Liverpool', 'match_result', 'X · Beraberlik', 3.90),
  ('Manchester United-Liverpool', 'match_result', '2 · Liverpool', 1.85),
  ('Manchester United-Liverpool', 'over_under', 'Alt 2.5', 1.75),
  ('Manchester United-Liverpool', 'over_under', 'Üst 2.5', 2.05),
  ('Manchester United-Liverpool', 'btts', 'Var', 1.85),
  ('Manchester United-Liverpool', 'btts', 'Yok', 1.95),
  ('Manchester United-Liverpool', 'double_chance', '1X', 1.25),
  ('Manchester United-Liverpool', 'double_chance', '12', 1.30),
  ('Manchester United-Liverpool', 'double_chance', 'X2', 1.45),
  ('Manchester United-Liverpool', 'handicap', '1 (+1) Manchester United', 1.55),
  ('Manchester United-Liverpool', 'handicap', '2 (-1) Liverpool', 2.40),
  ('Manchester United-Liverpool', 'corners', 'Üst 9.5', 1.90),
  ('Manchester United-Liverpool', 'corners', 'Alt 9.5', 1.80),
  ('Manchester United-Liverpool', 'cards', 'Üst 3.5', 2.10),
  ('Manchester United-Liverpool', 'cards', 'Alt 3.5', 1.70),
  ('Manchester United-Liverpool', 'first_half', '1 · Manchester United', 2.20),
  ('Manchester United-Liverpool', 'first_half', 'X · Beraberlik', 1.50),
  ('Manchester United-Liverpool', 'first_half', '2 · Liverpool', 3.10),
  ('Inter-AC Milan', 'match_result', '1 · Inter', 2.10),
  ('Inter-AC Milan', 'match_result', 'X · Beraberlik', 3.30),
  ('Inter-AC Milan', 'match_result', '2 · AC Milan', 3.10),
  ('Inter-AC Milan', 'over_under', 'Alt 2.5', 1.75),
  ('Inter-AC Milan', 'over_under', 'Üst 2.5', 2.05),
  ('Inter-AC Milan', 'btts', 'Var', 1.85),
  ('Inter-AC Milan', 'btts', 'Yok', 1.95),
  ('Inter-AC Milan', 'double_chance', '1X', 1.25),
  ('Inter-AC Milan', 'double_chance', '12', 1.30),
  ('Inter-AC Milan', 'double_chance', 'X2', 1.45),
  ('Inter-AC Milan', 'handicap', '1 (+1) Inter', 1.55),
  ('Inter-AC Milan', 'handicap', '2 (-1) AC Milan', 2.40),
  ('Inter-AC Milan', 'corners', 'Üst 9.5', 1.90),
  ('Inter-AC Milan', 'corners', 'Alt 9.5', 1.80),
  ('Inter-AC Milan', 'cards', 'Üst 3.5', 2.10),
  ('Inter-AC Milan', 'cards', 'Alt 3.5', 1.70),
  ('Inter-AC Milan', 'first_half', '1 · Inter', 2.20),
  ('Inter-AC Milan', 'first_half', 'X · Beraberlik', 1.50),
  ('Inter-AC Milan', 'first_half', '2 · AC Milan', 3.10),
  ('Anadolu Efes-Fenerbahçe Beko', 'match_result', '1 · Anadolu Efes', 2.05),
  ('Anadolu Efes-Fenerbahçe Beko', 'match_result', 'X · Beraberlik', 12.50),
  ('Anadolu Efes-Fenerbahçe Beko', 'match_result', '2 · Fenerbahçe Beko', 1.67),
  ('Anadolu Efes-Fenerbahçe Beko', 'over_under', 'Alt 2.5', 1.75),
  ('Anadolu Efes-Fenerbahçe Beko', 'over_under', 'Üst 2.5', 2.05),
  ('Anadolu Efes-Fenerbahçe Beko', 'btts', 'Var', 1.85),
  ('Anadolu Efes-Fenerbahçe Beko', 'btts', 'Yok', 1.95),
  ('Anadolu Efes-Fenerbahçe Beko', 'double_chance', '1X', 1.25),
  ('Anadolu Efes-Fenerbahçe Beko', 'double_chance', '12', 1.30),
  ('Anadolu Efes-Fenerbahçe Beko', 'double_chance', 'X2', 1.45),
  ('Anadolu Efes-Fenerbahçe Beko', 'handicap', '1 (+1) Anadolu Efes', 1.55),
  ('Anadolu Efes-Fenerbahçe Beko', 'handicap', '2 (-1) Fenerbahçe Beko', 2.40),
  ('Anadolu Efes-Fenerbahçe Beko', 'corners', 'Üst 9.5', 1.90),
  ('Anadolu Efes-Fenerbahçe Beko', 'corners', 'Alt 9.5', 1.80),
  ('Anadolu Efes-Fenerbahçe Beko', 'cards', 'Üst 3.5', 2.10),
  ('Anadolu Efes-Fenerbahçe Beko', 'cards', 'Alt 3.5', 1.70),
  ('Anadolu Efes-Fenerbahçe Beko', 'first_half', '1 · Anadolu Efes', 2.20),
  ('Anadolu Efes-Fenerbahçe Beko', 'first_half', 'X · Beraberlik', 1.50),
  ('Anadolu Efes-Fenerbahçe Beko', 'first_half', '2 · Fenerbahçe Beko', 3.10)
on conflict (event_id, market_type, selection_label) do update set odds = excluded.odds;

insert into public.bonus_definitions (type, name, amount, wagering_requirement) values
  ('welcome', 'Hoş Geldin %100 Bonusu', 500, 5),
  ('cashback', 'Anlık %40 Kayıp İadesi', 200, 3),
  ('freebet_bonus', '500 ₺ Freebet', 500, 1),
  ('crypto', '%50 Kripto Yatırım Bonusu', 250, 4),
  ('telegram', 'Telegram Etkinlik Bonusu', 100, 2)
on conflict (type) do update set name = excluded.name, amount = excluded.amount, wagering_requirement = excluded.wagering_requirement;

-- ============ SCHEMA ADDITIONS ============
ALTER TABLE public.bet_slips ADD COLUMN IF NOT EXISTS system_size integer;
ALTER TABLE public.bet_slips ADD COLUMN IF NOT EXISTS unit_stake numeric(12,2);
ALTER TABLE public.freebets ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'promo';

-- Bir kullanıcı her bonus türünü ömür boyu yalnızca bir kez alabilir.
-- (Eski verilerde tekrar varsa index atlanır; fonksiyonlar ayrıca EXISTS kontrolü yapar.)
DO $$
BEGIN
  BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS bonuses_one_per_type_idx ON public.bonuses (user_id, type) WHERE type <> 'custom';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'bonuses_one_per_type_idx atlandı: mevcut tekrar eden bonus kayıtları var';
  END;
  BEGIN
    CREATE UNIQUE INDEX IF NOT EXISTS freebets_one_claim_idx ON public.freebets (user_id) WHERE source = 'claim';
  EXCEPTION WHEN unique_violation THEN
    RAISE NOTICE 'freebets_one_claim_idx atlandı';
  END;
END $$;

-- ============ PRIVILEGES ============
-- İstemci kendi odds_preference değerini kaydedebilsin (önceden yetki yoktu).
GRANT UPDATE (odds_preference) ON public.profiles TO authenticated;
-- Sorumlu oyun limitleri yalnızca set_responsible_limits() ile değişir.
REVOKE INSERT, UPDATE, DELETE ON public.responsible_limits FROM authenticated;
DROP POLICY IF EXISTS "insert_own_limits" ON public.responsible_limits;
DROP POLICY IF EXISTS "update_own_limits" ON public.responsible_limits;

-- ============ ESKİ, AÇIK İÇEREN FONKSİYONLARI KALDIR ============
DROP FUNCTION IF EXISTS public.place_bet(text, text, text, text, text, numeric, numeric);
DROP FUNCTION IF EXISTS public.place_bet_slip(text, numeric, jsonb, uuid, text);
DROP FUNCTION IF EXISTS public.claim_bonus(text, text, numeric, integer);
DROP FUNCTION IF EXISTS public.grant_freebet(numeric);
DROP FUNCTION IF EXISTS public.execute_cashout(uuid, numeric);

-- ============ YARDIMCI FONKSİYONLAR ============
CREATE OR REPLACE FUNCTION public._n_choose_k(n integer, k integer)
RETURNS integer LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE r numeric := 1; i integer;
BEGIN
  IF k < 0 OR k > n THEN RETURN 0; END IF;
  FOR i IN 1..least(k, n - k) LOOP
    r := r * (n - least(k, n - k) + i) / i;
  END LOOP;
  RETURN round(r)::integer;
END;
$$;

-- Sistem kuponu çarpanı: p_k'lık tüm alt kümelerin oran çarpımlarının toplamı.
-- 'potential': hepsi kazanır varsayımı; 'settled': kaybeden bacaklı alt kümeler elenir, iptal bacak oranı 1 sayılır.
CREATE OR REPLACE FUNCTION public._system_multiplier(p_odds numeric[], p_status text[], p_k integer, p_mode text)
RETURNS numeric LANGUAGE plpgsql IMMUTABLE AS $$
DECLARE
  n integer := coalesce(array_length(p_odds, 1), 0);
  m integer; i integer; cnt integer; prod numeric; ok boolean; total numeric := 0;
BEGIN
  IF n = 0 OR p_k < 1 OR p_k > n OR n > 12 THEN RETURN 0; END IF;
  FOR m IN 1..(1 << n) - 1 LOOP
    cnt := 0; prod := 1; ok := true;
    FOR i IN 0..n - 1 LOOP
      IF (m & (1 << i)) <> 0 THEN
        cnt := cnt + 1;
        IF p_mode = 'settled' THEN
          IF p_status[i + 1] = 'lost' THEN ok := false; EXIT; END IF;
          IF p_status[i + 1] <> 'void' THEN prod := prod * p_odds[i + 1]; END IF;
        ELSE
          prod := prod * p_odds[i + 1];
        END IF;
      END IF;
    END LOOP;
    IF ok AND cnt = p_k THEN total := total + prod; END IF;
  END LOOP;
  RETURN total;
END;
$$;
-- Bir kuponun belirli durumdaki seçimlerinin oran çarpımı (tam hassasiyet, 2 haneye yuvarlı).
CREATE OR REPLACE FUNCTION public._slip_odds_product(p_slip_id uuid, p_status text)
RETURNS numeric LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE r record; prod numeric := 1;
BEGIN
  FOR r IN SELECT odds FROM public.bet_selections WHERE bet_slip_id = p_slip_id AND status = p_status
  LOOP
    prod := prod * r.odds;
  END LOOP;
  RETURN round(prod, 2);
END;
$$;
REVOKE ALL ON FUNCTION public._slip_odds_product(uuid, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._slip_odds_product(uuid, text) TO service_role, postgres;
REVOKE ALL ON FUNCTION public._n_choose_k(integer, integer) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._system_multiplier(numeric[], text[], integer, text) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public._n_choose_k(integer, integer) TO service_role;
GRANT EXECUTE ON FUNCTION public._system_multiplier(numeric[], text[], integer, text) TO service_role;

-- ============ place_bet_slip ============
CREATE OR REPLACE FUNCTION public.place_bet_slip(
  p_type text,
  p_stake numeric,
  p_selections jsonb,
  p_freebet_id uuid DEFAULT NULL,
  p_odds_preference text DEFAULT 'accept_any',
  p_system_size integer DEFAULT NULL
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_balance numeric(12,2);
  v_self_excluded timestamptz;
  v_loss_limit numeric(12,2);
  v_day_start timestamptz := date_trunc('day', now() AT TIME ZONE 'Europe/Istanbul') AT TIME ZONE 'Europe/Istanbul';
  v_today_staked numeric(12,2);
  v_count integer;
  v_sel jsonb;
  v_cat record;
  v_event text; v_market text; v_label text; v_client_odds numeric;
  v_key text; v_seen text[] := '{}';
  v_odds numeric[] := '{}'; v_status text[] := '{}';
  v_rows jsonb := '[]'::jsonb;
  v_total_odds numeric := 1;
  v_combos integer := 1;
  v_total_stake numeric(12,2);
  v_potential numeric(12,2);
  v_freebet_amount numeric(12,2);
  v_actual_stake numeric(12,2) := 0;
  v_new_balance numeric(12,2);
  v_slip_id uuid;
  v_points integer;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF p_type NOT IN ('single', 'combo', 'system') THEN RAISE EXCEPTION 'Invalid slip type'; END IF;
  IF p_odds_preference NOT IN ('accept_any', 'accept_higher', 'ask_me') THEN RAISE EXCEPTION 'Invalid odds preference'; END IF;
  IF p_selections IS NULL OR jsonb_typeof(p_selections) <> 'array' THEN RAISE EXCEPTION 'Invalid selections'; END IF;
  p_stake := round(p_stake, 2);
  IF p_stake IS NULL OR p_stake < 1 OR p_stake > 100000 THEN RAISE EXCEPTION 'Invalid stake'; END IF;

  v_count := jsonb_array_length(p_selections);
  IF v_count < 1 OR v_count > 12 THEN RAISE EXCEPTION 'Invalid selection count'; END IF;
  IF p_type = 'single' AND v_count <> 1 THEN RAISE EXCEPTION 'Tekli kuponda tek seçim olmalı'; END IF;
  IF p_type = 'combo' AND v_count < 2 THEN RAISE EXCEPTION 'Kombine için en az 2 seçim gerekli'; END IF;
  IF p_type = 'system' THEN
    IF v_count < 3 THEN RAISE EXCEPTION 'Sistem için en az 3 seçim gerekli'; END IF;
    IF p_system_size IS NULL OR p_system_size < 2 OR p_system_size >= v_count THEN RAISE EXCEPTION 'Geçersiz sistem türü'; END IF;
    v_combos := public._n_choose_k(v_count, p_system_size);
    IF v_combos > 500 THEN RAISE EXCEPTION 'Çok fazla kombinasyon'; END IF;
    IF p_freebet_id IS NOT NULL THEN RAISE EXCEPTION 'Freebet sistem kuponunda kullanılamaz'; END IF;
  END IF;
  v_total_stake := round(p_stake * v_combos, 2);
  IF v_total_stake > 100000 THEN RAISE EXCEPTION 'Invalid stake'; END IF;

  -- Self-exclusion
  SELECT self_excluded_until INTO v_self_excluded FROM public.profiles WHERE id = v_user_id;
  IF v_self_excluded IS NOT NULL AND v_self_excluded > now() THEN
    RAISE EXCEPTION 'Hesabınız self-exclusion altında. Bahis oynayamazsınız.';
  END IF;

  -- Profil satırını kilitle
  SELECT balance INTO v_balance FROM public.profiles WHERE id = v_user_id FOR UPDATE;
  IF v_balance IS NULL THEN RAISE EXCEPTION 'Profile not found'; END IF;

  -- Seçimleri katalogla doğrula (oran sunucudan gelir)
  FOR v_sel IN SELECT value FROM jsonb_array_elements(p_selections)
  LOOP
    v_event := nullif(trim(v_sel ->> 'event_id'), '');
    v_market := nullif(trim(v_sel ->> 'market_type'), '');
    v_label := nullif(trim(v_sel ->> 'selection_label'), '');
    IF v_event IS NULL OR v_market IS NULL OR v_label IS NULL THEN RAISE EXCEPTION 'Geçersiz seçim'; END IF;

    SELECT odds, suspended INTO v_cat FROM public.odds_catalog
      WHERE event_id = v_event AND market_type = v_market AND selection_label = v_label;
    IF NOT FOUND THEN RAISE EXCEPTION 'Geçersiz seçim'; END IF;
    IF v_cat.suspended THEN RAISE EXCEPTION 'Piyasa askıda'; END IF;

    v_client_odds := nullif(v_sel ->> 'odds', '')::numeric;
    IF v_client_odds IS NOT NULL AND v_client_odds <> v_cat.odds THEN
      IF p_odds_preference = 'ask_me' THEN RAISE EXCEPTION 'Oran değişti'; END IF;
      IF p_odds_preference = 'accept_higher' AND v_cat.odds < v_client_odds THEN RAISE EXCEPTION 'Oran düştü'; END IF;
    END IF;

    v_key := v_event || '|' || v_market;
    IF v_key = ANY (v_seen) THEN RAISE EXCEPTION 'Aynı marketten birden fazla seçim yapılamaz'; END IF;
    v_seen := v_seen || v_key;

    v_odds := v_odds || v_cat.odds;
    v_status := v_status || 'pending'::text;
    v_total_odds := v_total_odds * v_cat.odds;
    v_rows := v_rows || jsonb_build_object(
      'event_id', v_event, 'market_type', v_market, 'selection_label', v_label, 'odds', v_cat.odds,
      'sport', coalesce(nullif(left(trim(v_sel ->> 'sport'), 40), ''), 'Futbol'),
      'home_team', left(coalesce(nullif(trim(v_sel ->> 'home_team'), ''), '-'), 80),
      'away_team', left(coalesce(nullif(trim(v_sel ->> 'away_team'), ''), '-'), 80)
    );
  END LOOP;

  v_total_odds := round(v_total_odds, 2);
  IF v_total_odds > 10000 THEN RAISE EXCEPTION 'Toplam oran sınırı aşıldı'; END IF;

  -- Günlük kayıp limiti
  SELECT daily_loss_limit INTO v_loss_limit FROM public.responsible_limits WHERE user_id = v_user_id;
  IF v_loss_limit IS NOT NULL THEN
    SELECT COALESCE(sum(-amount), 0) INTO v_today_staked FROM public.transactions
      WHERE user_id = v_user_id AND type = 'bet_stake' AND created_at >= v_day_start;
    IF v_today_staked + v_total_stake > v_loss_limit AND p_freebet_id IS NULL THEN
      RAISE EXCEPTION 'Günlük kayıp limitini aşıyorsunuz.';
    END IF;
  END IF;

  -- Freebet / bakiye
  IF p_freebet_id IS NOT NULL THEN
    SELECT amount INTO v_freebet_amount FROM public.freebets
      WHERE id = p_freebet_id AND user_id = v_user_id AND status = 'available'
        AND (expires_at IS NULL OR expires_at > now()) FOR UPDATE;
    IF v_freebet_amount IS NULL THEN RAISE EXCEPTION 'Geçersiz veya süresi dolmuş freebet'; END IF;
    IF v_freebet_amount < p_stake THEN RAISE EXCEPTION 'Freebet tutarı yetersiz'; END IF;
    v_actual_stake := 0;
  ELSE
    v_actual_stake := v_total_stake;
    IF v_balance < v_actual_stake THEN RAISE EXCEPTION 'Yetersiz bakiye'; END IF;
  END IF;

  -- Olası kazanç
  IF p_type = 'system' THEN
    v_potential := round(p_stake * public._system_multiplier(v_odds, v_status, p_system_size, 'potential'), 2);
  ELSIF p_freebet_id IS NOT NULL THEN
    v_potential := round(p_stake * (v_total_odds - 1), 2);  -- freebet: stake iade edilmez
  ELSE
    v_potential := round(p_stake * v_total_odds, 2);
  END IF;
  IF v_potential > 1000000 THEN RAISE EXCEPTION 'Maksimum kazanç limiti aşıldı'; END IF;

  v_new_balance := v_balance - v_actual_stake;
  v_points := greatest(1, floor(v_actual_stake)::integer);
  IF v_actual_stake = 0 THEN v_points := 0; END IF;

  INSERT INTO public.bet_slips (user_id, type, total_odds, stake, potential_payout, odds_preference, freebet_id, system_size, unit_stake)
  VALUES (v_user_id, p_type, v_total_odds, v_total_stake, v_potential, p_odds_preference, p_freebet_id,
          CASE WHEN p_type = 'system' THEN p_system_size END,
          CASE WHEN p_type = 'system' THEN p_stake END)
  RETURNING id INTO v_slip_id;

  INSERT INTO public.bet_selections (bet_slip_id, event_id, sport, home_team, away_team, market_type, selection_label, odds)
  SELECT v_slip_id, r ->> 'event_id', r ->> 'sport', r ->> 'home_team', r ->> 'away_team',
         r ->> 'market_type', r ->> 'selection_label', (r ->> 'odds')::numeric
  FROM jsonb_array_elements(v_rows) AS r;

  IF p_freebet_id IS NOT NULL THEN
    UPDATE public.freebets SET status = 'used', used_on_slip_id = v_slip_id WHERE id = p_freebet_id;
    INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
    VALUES (v_user_id, 'freebet_stake', 0, v_balance, 'Freebet kullanıldı: ' || trim(to_char(p_stake, 'FM999999990.00')) || ' ₺', v_slip_id);
  ELSE
    UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = v_user_id;
    INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
    VALUES (v_user_id, 'bet_stake', -v_actual_stake, v_new_balance, 'Bahis kuponu', v_slip_id);
  END IF;

  IF v_actual_stake > 0 THEN
    UPDATE public.profiles
    SET total_staked = total_staked + v_actual_stake,
        vip_points = vip_points + v_points,
        vip_level = CASE
          WHEN vip_points + v_points >= 10000 THEN 'Elmas'
          WHEN vip_points + v_points >= 5000 THEN 'Platin'
          WHEN vip_points + v_points >= 2000 THEN 'Altın'
          WHEN vip_points + v_points >= 500 THEN 'Gümüş'
          ELSE 'Bronz'
        END,
        updated_at = now()
    WHERE id = v_user_id;

    UPDATE public.bonuses
    SET wagering_progress = wagering_progress + v_actual_stake,
        status = CASE WHEN wagering_progress + v_actual_stake >= wagering_requirement * amount THEN 'completed' ELSE status END
    WHERE user_id = v_user_id AND status = 'active';
  END IF;

  RETURN jsonb_build_object('status', 'success', 'slip_id', v_slip_id, 'new_balance', v_new_balance,
                            'total_odds', v_total_odds, 'total_stake', v_total_stake, 'potential_payout', v_potential);
END;
$$;
REVOKE ALL ON FUNCTION public.place_bet_slip(text, numeric, jsonb, uuid, text, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.place_bet_slip(text, numeric, jsonb, uuid, text, integer) TO authenticated;

-- ============ CASHOUT ============
-- Teklif = stake * (kazanılmış bacakların oranı) * 0.90. Hiç bacak kazanmadıysa stake'in %90'ı.
CREATE OR REPLACE FUNCTION public.calculate_cashout(p_slip_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_won_odds numeric := 1;
  v_total integer; v_won integer;
  v_offer numeric(12,2);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id AND user_id = auth.uid();
  IF NOT FOUND THEN RAISE EXCEPTION 'Kupon bulunamadı'; END IF;
  IF v_slip.status <> 'pending' THEN RAISE EXCEPTION 'Sadece bekleyen kuponlar bozdurulabilir'; END IF;
  IF v_slip.freebet_id IS NOT NULL OR v_slip.type = 'system' THEN
    RETURN jsonb_build_object('offer', 0, 'available', false);
  END IF;

  SELECT count(*), count(*) FILTER (WHERE status = 'won')
    INTO v_total, v_won
    FROM public.bet_selections WHERE bet_slip_id = p_slip_id;
  v_won_odds := public._slip_odds_product(p_slip_id, 'won');

  v_offer := round(v_slip.stake * v_won_odds * 0.90, 2);
  RETURN jsonb_build_object('offer', v_offer, 'available', v_offer > 0, 'won_selections', v_won, 'total_selections', v_total);
END;
$$;
REVOKE ALL ON FUNCTION public.calculate_cashout(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.calculate_cashout(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.execute_cashout(p_slip_id uuid, p_expected_offer numeric DEFAULT NULL)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_calc jsonb;
  v_offer numeric(12,2);
  v_balance numeric(12,2);
  v_new_balance numeric(12,2);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id AND user_id = auth.uid() FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Kupon bulunamadı'; END IF;
  IF v_slip.status <> 'pending' THEN RAISE EXCEPTION 'Kupon zaten sonuçlanmış'; END IF;

  v_calc := public.calculate_cashout(p_slip_id);
  IF NOT (v_calc ->> 'available')::boolean THEN RAISE EXCEPTION 'Bu kupon bozdurulamaz'; END IF;
  v_offer := (v_calc ->> 'offer')::numeric;
  IF p_expected_offer IS NOT NULL AND abs(p_expected_offer - v_offer) > 0.01 THEN
    RAISE EXCEPTION 'Teklif değişti';
  END IF;

  SELECT balance INTO v_balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  v_new_balance := v_balance + v_offer;

  UPDATE public.bet_slips
  SET status = 'cashed_out', actual_payout = v_offer, cashout_offer = v_offer, cashed_out_at = now(), settled_at = now()
  WHERE id = p_slip_id;
  UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = auth.uid();
  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
  VALUES (auth.uid(), 'cashout', v_offer, v_new_balance, 'Erken bozdurma', p_slip_id);

  RETURN jsonb_build_object('status', 'success', 'payout', v_offer, 'new_balance', v_new_balance);
END;
$$;
REVOKE ALL ON FUNCTION public.execute_cashout(uuid, numeric) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.execute_cashout(uuid, numeric) TO authenticated;

-- ============ SETTLEMENT (yalnızca service_role) ============
CREATE OR REPLACE FUNCTION public.settle_bet_slip(p_slip_id uuid, p_results jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_slip public.bet_slips;
  v_sel record;
  v_outcome text;
  v_odds numeric[]; v_status text[];
  v_n integer; v_pending integer; v_lost integer; v_won integer; v_void integer;
  v_final text; v_payout numeric(12,2) := 0; v_eff numeric := 1; v_mult numeric;
  v_balance numeric(12,2); v_new_balance numeric(12,2);
BEGIN
  SELECT * INTO v_slip FROM public.bet_slips WHERE id = p_slip_id FOR UPDATE;
  IF NOT FOUND OR v_slip.status <> 'pending' THEN RETURN jsonb_build_object('status', 'skipped'); END IF;

  FOR v_sel IN SELECT id FROM public.bet_selections WHERE bet_slip_id = p_slip_id AND status = 'pending'
  LOOP
    v_outcome := p_results -> v_sel.id::text ->> 'outcome';
    IF v_outcome IN ('won', 'lost', 'void') THEN
      UPDATE public.bet_selections SET status = v_outcome WHERE id = v_sel.id;
    END IF;
  END LOOP;

  SELECT array_agg(odds ORDER BY id), array_agg(status ORDER BY id), count(*),
         count(*) FILTER (WHERE status = 'pending'), count(*) FILTER (WHERE status = 'lost'),
         count(*) FILTER (WHERE status = 'won'), count(*) FILTER (WHERE status = 'void')
    INTO v_odds, v_status, v_n, v_pending, v_lost, v_won, v_void
    FROM public.bet_selections WHERE bet_slip_id = p_slip_id;

  IF v_n = 0 THEN RETURN jsonb_build_object('status', 'skipped'); END IF;

  IF v_slip.type IN ('single', 'combo') THEN
    IF v_lost > 0 THEN
      v_final := 'lost';
    ELSIF v_pending > 0 THEN
      RETURN jsonb_build_object('status', 'partial', 'pending', v_pending);
    ELSIF v_won = 0 THEN
      v_final := 'void';
      v_payout := CASE WHEN v_slip.freebet_id IS NULL THEN v_slip.stake ELSE 0 END;
    ELSE
      v_eff := public._slip_odds_product(p_slip_id, 'won');
      v_final := 'won';
      v_payout := CASE WHEN v_slip.freebet_id IS NULL THEN round(v_slip.stake * v_eff, 2)
                       ELSE round(v_slip.stake * (v_eff - 1), 2) END;
    END IF;
  ELSE
    IF v_pending > 0 THEN RETURN jsonb_build_object('status', 'partial', 'pending', v_pending); END IF;
    v_mult := public._system_multiplier(v_odds, v_status, v_slip.system_size, 'settled');
    v_payout := round(coalesce(v_slip.unit_stake, 0) * v_mult, 2);
    IF v_void = v_n THEN v_final := 'void';
    ELSIF v_payout > 0 THEN v_final := 'won';
    ELSE v_final := 'lost'; END IF;
  END IF;

  IF v_final = 'void' AND v_slip.freebet_id IS NOT NULL THEN
    UPDATE public.freebets SET status = 'available', used_on_slip_id = NULL WHERE id = v_slip.freebet_id AND status = 'used';
  END IF;

  UPDATE public.bet_slips SET status = v_final, actual_payout = v_payout, settled_at = now() WHERE id = p_slip_id;

  IF v_payout > 0 THEN
    SELECT balance INTO v_balance FROM public.profiles WHERE id = v_slip.user_id FOR UPDATE;
    v_new_balance := v_balance + v_payout;
    UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = v_slip.user_id;
    INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
    VALUES (v_slip.user_id, 'bet_win', v_payout, v_new_balance,
            CASE WHEN v_final = 'void' THEN 'Bahis iadesi' ELSE 'Bahis kazancı' END, p_slip_id);
  END IF;

  RETURN jsonb_build_object('status', 'settled', 'slip_id', p_slip_id, 'result', v_final, 'payout', v_payout);
END;
$$;
REVOKE ALL ON FUNCTION public.settle_bet_slip(uuid, jsonb) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.settle_bet_slip(uuid, jsonb) TO service_role;

-- ============ BONUS / FREEBET ============
CREATE OR REPLACE FUNCTION public.claim_bonus(p_type text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_def public.bonus_definitions;
  v_bonus_id uuid;
  v_balance numeric(12,2);
  v_new_balance numeric(12,2);
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  SELECT * INTO v_def FROM public.bonus_definitions WHERE type = p_type;
  IF NOT FOUND THEN RAISE EXCEPTION 'Bonus bulunamadı'; END IF;

  IF v_def.type <> 'custom' AND EXISTS (SELECT 1 FROM public.bonuses WHERE user_id = auth.uid() AND type = v_def.type) THEN
    RAISE EXCEPTION 'Bu bonus zaten alındı';
  END IF;
  BEGIN
    INSERT INTO public.bonuses (user_id, type, name, amount, wagering_requirement)
    VALUES (auth.uid(), v_def.type, v_def.name, v_def.amount, v_def.wagering_requirement)
    RETURNING id INTO v_bonus_id;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Bu bonus zaten alındı';
  END;

  SELECT balance INTO v_balance FROM public.profiles WHERE id = auth.uid() FOR UPDATE;
  v_new_balance := v_balance + v_def.amount;
  UPDATE public.profiles SET balance = v_new_balance, updated_at = now() WHERE id = auth.uid();
  INSERT INTO public.transactions (user_id, type, amount, balance_after, description, reference_id)
  VALUES (auth.uid(), 'bonus_credit', v_def.amount, v_new_balance, v_def.name, v_bonus_id);

  RETURN jsonb_build_object('status', 'success', 'bonus_id', v_bonus_id, 'new_balance', v_new_balance);
END;
$$;
REVOKE ALL ON FUNCTION public.claim_bonus(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_bonus(text) TO authenticated;

CREATE OR REPLACE FUNCTION public.claim_freebet()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE v_id uuid;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF EXISTS (SELECT 1 FROM public.freebets WHERE user_id = auth.uid() AND source = 'claim') THEN
    RAISE EXCEPTION 'Freebet zaten alındı';
  END IF;
  BEGIN
    INSERT INTO public.freebets (user_id, amount, expires_at, source)
    VALUES (auth.uid(), 100, now() + interval '7 days', 'claim')
    RETURNING id INTO v_id;
  EXCEPTION WHEN unique_violation THEN
    RAISE EXCEPTION 'Freebet zaten alındı';
  END;
  RETURN jsonb_build_object('status', 'success', 'freebet_id', v_id, 'amount', 100);
END;
$$;
REVOKE ALL ON FUNCTION public.claim_freebet() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_freebet() TO authenticated;

-- ============ SORUMLU OYUN ============
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
  v_until timestamptz;
  v_current timestamptz;
BEGIN
  IF auth.uid() IS NULL THEN RAISE EXCEPTION 'Authentication required'; END IF;
  IF (p_daily_deposit IS NOT NULL AND p_daily_deposit <= 0)
     OR (p_weekly_deposit IS NOT NULL AND p_weekly_deposit <= 0)
     OR (p_daily_loss IS NOT NULL AND p_daily_loss <= 0) THEN
    RAISE EXCEPTION 'Limitler sıfırdan büyük olmalı';
  END IF;
  IF p_self_exclude_days IS NOT NULL AND (p_self_exclude_days < 1 OR p_self_exclude_days > 3650) THEN
    RAISE EXCEPTION 'Geçersiz dondurma süresi';
  END IF;

  SELECT self_excluded_until INTO v_current FROM public.profiles WHERE id = auth.uid();
  -- Dondurma yalnızca uzatılabilir, kısaltılamaz.
  IF p_self_exclude_days IS NOT NULL THEN
    v_until := greatest(coalesce(v_current, now()), now() + make_interval(days => p_self_exclude_days));
  END IF;

  INSERT INTO public.responsible_limits (user_id, daily_deposit_limit, weekly_deposit_limit, daily_loss_limit, self_excluded_until)
  VALUES (auth.uid(), p_daily_deposit, p_weekly_deposit, p_daily_loss, v_until)
  ON CONFLICT (user_id) DO UPDATE
  SET daily_deposit_limit = COALESCE(EXCLUDED.daily_deposit_limit, public.responsible_limits.daily_deposit_limit),
      weekly_deposit_limit = COALESCE(EXCLUDED.weekly_deposit_limit, public.responsible_limits.weekly_deposit_limit),
      daily_loss_limit = COALESCE(EXCLUDED.daily_loss_limit, public.responsible_limits.daily_loss_limit),
      self_excluded_until = COALESCE(EXCLUDED.self_excluded_until, public.responsible_limits.self_excluded_until),
      updated_at = now();

  IF v_until IS NOT NULL THEN
    UPDATE public.profiles SET self_excluded_until = v_until WHERE id = auth.uid();
  END IF;

  RETURN jsonb_build_object('status', 'success');
END;
$$;
REVOKE ALL ON FUNCTION public.set_responsible_limits(numeric, numeric, numeric, integer) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.set_responsible_limits(numeric, numeric, numeric, integer) TO authenticated;

-- Yetkisiz çağrılmaması için kalan SECURITY DEFINER fonksiyonlarda authenticated dışındaki rolleri kapat.
REVOKE ALL ON FUNCTION public.check_responsible_limits(text, numeric) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.check_market_suspension(text) FROM PUBLIC, anon;

-- ============ KAYIT TETİKLEYİCİSİ ============
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_birth date := nullif(NEW.raw_user_meta_data ->> 'birth_date', '')::date;
  v_tc text := nullif(NEW.raw_user_meta_data ->> 'tc_identity', '');
BEGIN
  IF v_birth IS NOT NULL AND v_birth > (current_date - interval '18 years')::date THEN
    RAISE EXCEPTION 'Yaş sınırı: 18 yaşından küçükler kayıt olamaz';
  END IF;
  IF v_tc IS NOT NULL AND v_tc !~ '^[0-9]{11}$' THEN
    RAISE EXCEPTION 'Geçersiz TC kimlik numarası biçimi';
  END IF;

  INSERT INTO public.profiles (
    id, display_name, first_name, last_name, phone, tc_identity, birth_date,
    country, city, district, address, postal_code, currency
  )
  VALUES (
    NEW.id,
    COALESCE(nullif(NEW.raw_user_meta_data ->> 'display_name', ''), nullif(NEW.raw_user_meta_data ->> 'first_name', ''), split_part(NEW.email, '@', 1)),
    nullif(NEW.raw_user_meta_data ->> 'first_name', ''),
    nullif(NEW.raw_user_meta_data ->> 'last_name', ''),
    nullif(NEW.raw_user_meta_data ->> 'phone', ''),
    v_tc,
    v_birth,
    COALESCE(nullif(NEW.raw_user_meta_data ->> 'country', ''), 'Türkiye'),
    nullif(NEW.raw_user_meta_data ->> 'city', ''),
    nullif(NEW.raw_user_meta_data ->> 'district', ''),
    nullif(NEW.raw_user_meta_data ->> 'address', ''),
    nullif(NEW.raw_user_meta_data ->> 'postal_code', ''),
    COALESCE(nullif(NEW.raw_user_meta_data ->> 'currency', ''), 'TRY')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$function$;

-- ============ REALTIME YAYINI ============
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['profiles', 'bet_slips', 'transactions', 'bonuses', 'freebets']
  LOOP
    BEGIN
      EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', t);
    EXCEPTION WHEN duplicate_object OR undefined_object THEN
      NULL;
    END;
  END LOOP;
END $$;
