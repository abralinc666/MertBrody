/**
 * Demo arka uç: tüm iş kuralları tarayıcıda çalışır, veri localStorage'da saklanır.
 * Gerçek bir sunucuya geçerken yalnızca bu dosyanın dışa aktardığı `api` nesnesi yeniden uygulanır;
 * arayüz kodu bu arayüze bağlıdır. (Önceki Supabase sürümü: _backend-hazir/supabase)
 */
import type {
  BetSlipRecord, BetSlipType, Bonus, Freebet, OddsPreference, Profile, RegisterValues, ResponsibleLimit,
  BetSelectionRecord, Transaction,
} from '@/types';
import { matches as catalogMatches, bonusTypes } from '@/data/sports';
import { getMatchState } from '@/services/liveState';
import { determineOutcome, nChooseK, round2, systemMultiplier, type Outcome } from '@/services/settlement';
import { commit, emptyUserData, getDb, resetDb, subscribeDb, type StoredSelection, type UserData, type UserRecord } from '@/services/localDb';

/* ---------------- Sabitler ---------------- */
const DEMO_START_BALANCE = 1000;
const MIN_STAKE = 1;
const MAX_STAKE = 100000;
const MAX_TOTAL_ODDS = 10000;
const MAX_PAYOUT = 1000000;
const CASHOUT_MARGIN = 0.9;
const MAX_SELECTIONS = 12;

/* ---------------- Oran kataloğu ---------------- */
const catalog = new Map<string, number>();
for (const m of catalogMatches) for (const sm of m.subMarkets) for (const o of sm.options) {
  catalog.set(`${m.eventId}|${sm.type}|${o.label}`, Number(o.odds));
}

/* ---------------- Yardımcılar ---------------- */
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`);
const nowIso = () => new Date().toISOString();
const fail = (message: string): never => { throw new Error(message); };

async function hashPassword(password: string, salt: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${salt}:${password}`));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  // Güvenli olmayan bağlamlar (http) için basit yedek; yalnızca demo
  let h = 5381;
  for (const ch of `${salt}:${password}`) h = ((h << 5) + h + ch.charCodeAt(0)) >>> 0;
  return `fallback-${h}`;
}

const currentUserId = () => getDb().session;
function requireUser(): { user: UserRecord; data: UserData } {
  const db = getDb();
  const user = db.users.find((u) => u.id === db.session);
  if (!user) return fail('Authentication required');
  const data = db.data[user.id] ?? (db.data[user.id] = emptyUserData());
  return { user, data };
}

function addTransaction(data: UserData, user: UserRecord, type: string, amount: number, description: string) {
  data.transactions.unshift({ id: uid(), type, amount: round2(amount), balance_after: round2(user.profile.balance), description, created_at: nowIso() });
  if (data.transactions.length > 200) data.transactions.length = 200;
}

function creditBalance(user: UserRecord, amount: number) { user.profile.balance = round2(user.profile.balance + amount); }

const startOfToday = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const isExcluded = (limits: ResponsibleLimit) => Boolean(limits.self_excluded_until && new Date(limits.self_excluded_until) > new Date());

const VIP = [{ name: 'Elmas', min: 10000 }, { name: 'Platin', min: 5000 }, { name: 'Altın', min: 2000 }, { name: 'Gümüş', min: 500 }, { name: 'Bronz', min: 0 }];

/* ---------------- Anlık görüntü (React için) ---------------- */
export type Snapshot = {
  sessionEmail: string | null;
  profile: Profile | null;
  betSlips: BetSlipRecord[];
  betSelections: BetSelectionRecord[];
  transactions: Transaction[];
  bonuses: Bonus[];
  freebets: Freebet[];
  responsibleLimits: ResponsibleLimit | null;
};

function buildSnapshot(): Snapshot {
  const db = getDb();
  const user = db.users.find((u) => u.id === db.session);
  if (!user) return { sessionEmail: null, profile: null, betSlips: [], betSelections: [], transactions: [], bonuses: [], freebets: [], responsibleLimits: null };
  const data = db.data[user.id] ?? emptyUserData();
  return {
    sessionEmail: user.email,
    profile: { ...user.profile },
    betSlips: [...data.betSlips],
    betSelections: data.betSelections.map(({ round: _round, ...rest }) => rest),
    transactions: [...data.transactions],
    bonuses: [...data.bonuses],
    freebets: [...data.freebets],
    responsibleLimits: { ...data.limits },
  };
}

let snapshot = buildSnapshot();
subscribeDb(() => { snapshot = buildSnapshot(); });

/* ---------------- Kupon ---------------- */
export type PlaceBetInput = {
  type: BetSlipType;
  stake: number;
  selections: Array<{ eventId: string; homeTeam: string; awayTeam: string; marketType: string; selectionLabel: string; odds: number }>;
  freebetId: string | null;
  oddsPreference: OddsPreference;
  systemSize: number | null;
};

function evaluateSlip(user: UserRecord, data: UserData, slip: BetSlipRecord) {
  const sels = data.betSelections.filter((s) => s.bet_slip_id === slip.id);
  const pending = sels.filter((s) => s.status === 'pending').length;
  const lost = sels.filter((s) => s.status === 'lost').length;
  const won = sels.filter((s) => s.status === 'won');
  const voids = sels.filter((s) => s.status === 'void').length;
  const freebet = Boolean(slip.freebet_id);
  let final: 'won' | 'lost' | 'void';
  let payout = 0;

  if (slip.type !== 'system') {
    if (lost > 0) final = 'lost';
    else if (pending > 0) return;
    else if (won.length === 0) { final = 'void'; payout = freebet ? 0 : slip.stake; }
    else {
      const eff = round2(won.reduce((t, s) => t * s.odds, 1));
      final = 'won';
      payout = freebet ? round2(slip.stake * (eff - 1)) : round2(slip.stake * eff);
    }
  } else {
    if (pending > 0) return;
    const mult = systemMultiplier(sels.map((s) => s.odds), sels.map((s) => s.status), slip.system_size ?? 0, 'settled');
    payout = round2((slip.unit_stake ?? 0) * mult);
    final = voids === sels.length ? 'void' : payout > 0 ? 'won' : 'lost';
  }

  if (final === 'void' && freebet) {
    const fb = data.freebets.find((f) => f.id === slip.freebet_id);
    if (fb && fb.status === 'used') fb.status = 'available';
  }
  slip.status = final;
  slip.actual_payout = payout;
  slip.settled_at = nowIso();
  if (payout > 0) {
    creditBalance(user, payout);
    addTransaction(data, user, 'bet_win', payout, final === 'void' ? 'Bahis iadesi' : 'Bahis kazancı');
  }
}

function wonOdds(data: UserData, slipId: string): number {
  return round2(data.betSelections.filter((s) => s.bet_slip_id === slipId && s.status === 'won').reduce((t, s) => t * s.odds, 1));
}

/* ---------------- Dışa açık API ---------------- */
export const api = {
  subscribe: subscribeDb,
  getSnapshot: () => snapshot,

  auth: {
    async signUp(v: RegisterValues): Promise<void> {
      const db = getDb();
      const email = v.email.trim().toLowerCase();
      if (db.users.some((u) => u.email === email)) fail('Bu e-posta adresi zaten kayıtlı.');
      if (db.users.some((u) => u.details.tc_identity === v.tc_identity)) fail('Bu TC kimlik numarası zaten kayıtlı.');
      const salt = uid();
      const id = uid();
      const user: UserRecord = {
        id, email, salt, hash: await hashPassword(v.password, salt),
        profile: { id, display_name: v.displayName, vip_level: 'Bronz', vip_points: 0, total_staked: 0, balance: DEMO_START_BALANCE, odds_preference: 'accept_any' },
        details: {
          first_name: v.first_name.trim(), last_name: v.last_name.trim(), tc_identity: v.tc_identity, birth_date: v.birth_date,
          phone: v.phone.trim(), city: v.city.trim(), district: v.district.trim(), address: v.address.trim(), postal_code: v.postal_code.trim(), country: v.country.trim(),
        },
      };
      const data = emptyUserData();
      db.users.push(user);
      db.data[id] = data;
      addTransaction(data, user, 'deposit', DEMO_START_BALANCE, 'Demo başlangıç bakiyesi');
      db.session = id;
      commit();
    },
    async signIn(email: string, password: string): Promise<void> {
      const db = getDb();
      const user = db.users.find((u) => u.email === email.trim().toLowerCase());
      if (!user || (await hashPassword(password, user.salt)) !== user.hash) fail('E-posta veya şifre hatalı.');
      db.session = user!.id;
      commit();
    },
    async signOut(): Promise<void> { getDb().session = null; commit(); },
    /** Demo: e-posta gönderilmediği için hesap varsa doğrudan şifre yenileme adımına geçilir. */
    async requestPasswordReset(email: string): Promise<boolean> {
      return getDb().users.some((u) => u.email === email.trim().toLowerCase());
    },
    async updatePassword(email: string, password: string): Promise<void> {
      const user = getDb().users.find((u) => u.email === email.trim().toLowerCase());
      if (!user) fail('Hesap bulunamadı.');
      user!.salt = uid();
      user!.hash = await hashPassword(password, user!.salt);
      commit();
    },
  },

  async setOddsPreference(pref: OddsPreference): Promise<void> {
    const { user } = requireUser();
    user.profile.odds_preference = pref;
    commit();
  },

  async deposit(amount: number): Promise<void> {
    const { user, data } = requireUser();
    amount = round2(amount);
    if (!Number.isFinite(amount) || amount < 10 || amount > 50000) fail('Tutar 10 ile 50.000 ₺ arasında olmalı.');
    if (isExcluded(data.limits)) fail('Hesabınız self-exclusion altında. İşlem yapılamaz.');
    const { daily_deposit_limit: daily, weekly_deposit_limit: weekly } = data.limits;
    const sumSince = (ms: number) => data.transactions.filter((t) => t.type === 'deposit' && new Date(t.created_at).getTime() >= ms && t.description !== 'Demo başlangıç bakiyesi').reduce((s, t) => s + t.amount, 0);
    if (daily != null && sumSince(startOfToday()) + amount > daily) fail('Günlük yatırım limitini aşıyorsunuz.');
    if (weekly != null && sumSince(Date.now() - 7 * 86400000) + amount > weekly) fail('Haftalık yatırım limitini aşıyorsunuz.');
    creditBalance(user, amount);
    addTransaction(data, user, 'deposit', amount, 'Demo para yatırma');
    commit();
  },

  async placeBet(input: PlaceBetInput): Promise<{ slipId: string; potentialPayout: number; totalStake: number }> {
    const { user, data } = requireUser();
    const { type, selections, freebetId, oddsPreference, systemSize } = input;
    const stake = round2(input.stake);
    const n = selections.length;

    if (!Number.isFinite(stake) || stake < MIN_STAKE || stake > MAX_STAKE) fail('Invalid stake');
    if (n < 1 || n > MAX_SELECTIONS) fail('Invalid selection count');
    if (type === 'single' && n !== 1) fail('Tekli kuponda tek seçim olmalı');
    if (type === 'combo' && n < 2) fail('Kombine için en az 2 seçim gerekli');
    let combos = 1;
    if (type === 'system') {
      if (n < 3) fail('Sistem için en az 3 seçim gerekli');
      if (systemSize == null || systemSize < 2 || systemSize >= n) fail('Geçersiz sistem türü');
      combos = nChooseK(n, systemSize!);
      if (combos > 500) fail('Çok fazla kombinasyon');
      if (freebetId) fail('Freebet sistem kuponunda kullanılamaz');
    }
    const totalStake = round2(stake * combos);
    if (totalStake > MAX_STAKE) fail('Invalid stake');
    if (isExcluded(data.limits)) fail('Hesabınız self-exclusion altında. Bahis oynayamazsınız.');

    // Seçimleri katalogla doğrula: oran her zaman katalogdan gelir
    const seen = new Set<string>();
    const rows = selections.map((s) => {
      const catalogOdds = catalog.get(`${s.eventId}|${s.marketType}|${s.selectionLabel}`);
      if (catalogOdds === undefined) fail('Geçersiz seçim');
      const state = getMatchState(s.eventId);
      if (state?.status === 'ft') fail('Piyasa askıda');
      if (s.odds !== catalogOdds) {
        if (oddsPreference === 'ask_me') fail('Oran değişti');
        if (oddsPreference === 'accept_higher' && catalogOdds! < s.odds) fail('Oran düştü');
      }
      const key = `${s.eventId}|${s.marketType}`;
      if (seen.has(key)) fail('Aynı marketten birden fazla seçim yapılamaz');
      seen.add(key);
      return { ...s, odds: catalogOdds!, round: state?.round ?? 0 };
    });

    const totalOdds = round2(rows.reduce((t, r) => t * r.odds, 1));
    if (totalOdds > MAX_TOTAL_ODDS) fail('Toplam oran sınırı aşıldı');

    // Günlük bahis limiti
    const lossLimit = data.limits.daily_loss_limit;
    if (lossLimit != null && !freebetId) {
      const today = data.transactions.filter((t) => t.type === 'bet_stake' && new Date(t.created_at).getTime() >= startOfToday()).reduce((s, t) => s - t.amount, 0);
      if (today + totalStake > lossLimit) fail('Günlük kayıp limitini aşıyorsunuz.');
    }

    // Freebet / bakiye
    let freebet: Freebet | undefined;
    let actualStake = 0;
    if (freebetId) {
      freebet = data.freebets.find((f) => f.id === freebetId && f.status === 'available' && (!f.expires_at || new Date(f.expires_at) > new Date()));
      if (!freebet) fail('Geçersiz veya süresi dolmuş freebet');
      if (freebet!.amount < stake) fail('Freebet tutarı yetersiz');
    } else {
      actualStake = totalStake;
      if (user.profile.balance < actualStake) fail('Yetersiz bakiye');
    }

    const potential = type === 'system'
      ? round2(stake * systemMultiplier(rows.map((r) => r.odds), rows.map(() => 'pending'), systemSize!, 'potential'))
      : freebet ? round2(stake * (totalOdds - 1)) : round2(stake * totalOdds);
    if (potential > MAX_PAYOUT) fail('Maksimum kazanç limiti aşıldı');

    const slip: BetSlipRecord = {
      id: uid(), type, status: 'pending', total_odds: totalOdds, stake: totalStake, potential_payout: potential, actual_payout: 0,
      cashout_offer: 0, placed_at: nowIso(), settled_at: null, system_size: type === 'system' ? systemSize : null,
      unit_stake: type === 'system' ? stake : null, freebet_id: freebet ? freebet.id : null,
    };
    data.betSlips.unshift(slip);
    for (const r of rows) {
      const sel: StoredSelection = {
        id: uid(), bet_slip_id: slip.id, event_id: r.eventId, home_team: r.homeTeam, away_team: r.awayTeam,
        market_type: r.marketType, selection_label: r.selectionLabel, odds: r.odds, status: 'pending', round: r.round,
      };
      data.betSelections.push(sel);
    }

    if (freebet) {
      freebet.status = 'used';
      addTransaction(data, user, 'freebet_stake', 0, `Freebet kullanıldı: ${stake.toFixed(2)} ₺`);
    } else {
      user.profile.balance = round2(user.profile.balance - actualStake);
      addTransaction(data, user, 'bet_stake', -actualStake, 'Bahis kuponu');
      const points = Math.max(1, Math.floor(actualStake));
      user.profile.total_staked = round2(user.profile.total_staked + actualStake);
      user.profile.vip_points += points;
      user.profile.vip_level = VIP.find((l) => user.profile.vip_points >= l.min)!.name;
      for (const b of data.bonuses) {
        if (b.status !== 'active') continue;
        b.wagering_progress = round2(b.wagering_progress + actualStake);
        if (b.wagering_progress >= b.wagering_requirement * b.amount) b.status = 'completed';
      }
    }
    commit();
    return { slipId: slip.id, potentialPayout: potential, totalStake };
  },

  /** Teklif = stake × (kazanılmış bacakların oranı) × 0.90. */
  async calculateCashout(slipId: string): Promise<{ offer: number; available: boolean }> {
    const { data } = requireUser();
    const slip = data.betSlips.find((s) => s.id === slipId);
    if (!slip) fail('Kupon bulunamadı');
    if (slip!.status !== 'pending') fail('Sadece bekleyen kuponlar bozdurulabilir');
    if (slip!.freebet_id || slip!.type === 'system') return { offer: 0, available: false };
    const offer = round2(slip!.stake * wonOdds(data, slipId) * CASHOUT_MARGIN);
    return { offer, available: offer > 0 };
  },

  async executeCashout(slipId: string, expectedOffer: number | null): Promise<{ payout: number }> {
    const { user, data } = requireUser();
    const slip = data.betSlips.find((s) => s.id === slipId);
    if (!slip) fail('Kupon bulunamadı');
    if (slip!.status !== 'pending') fail('Kupon zaten sonuçlanmış');
    if (slip!.freebet_id || slip!.type === 'system') fail('Bu kupon bozdurulamaz');
    const offer = round2(slip!.stake * wonOdds(data, slipId) * CASHOUT_MARGIN);
    if (expectedOffer != null && Math.abs(expectedOffer - offer) > 0.01) fail('Teklif değişti');
    slip!.status = 'cashed_out';
    slip!.actual_payout = offer;
    slip!.cashout_offer = offer;
    slip!.settled_at = nowIso();
    creditBalance(user, offer);
    addTransaction(data, user, 'cashout', offer, 'Erken bozdurma');
    commit();
    return { payout: offer };
  },

  async claimBonus(type: string): Promise<void> {
    const { user, data } = requireUser();
    const def = bonusTypes.find((b) => b.type === type);
    if (!def) fail('Bonus bulunamadı');
    if (data.bonuses.some((b) => b.type === type)) fail('Bu bonus zaten alındı');
    const bonus: Bonus = {
      id: uid(), type, name: def!.name, amount: def!.amount, wagering_requirement: def!.wagering,
      wagering_progress: 0, status: 'active', expires_at: null, created_at: nowIso(),
    };
    data.bonuses.unshift(bonus);
    creditBalance(user, bonus.amount);
    addTransaction(data, user, 'bonus_credit', bonus.amount, bonus.name);
    commit();
  },

  async claimFreebet(): Promise<void> {
    const { data } = requireUser();
    if (data.freebets.some((f) => f.source === 'claim')) fail('Freebet zaten alındı');
    data.freebets.unshift({ id: uid(), amount: 100, source: 'claim', status: 'available', expires_at: new Date(Date.now() + 7 * 86400000).toISOString(), created_at: nowIso() });
    commit();
  },

  async setLimits(p: { dailyDeposit: number | null; weeklyDeposit: number | null; dailyLoss: number | null; excludeDays: number | null }): Promise<void> {
    const { user, data } = requireUser();
    const positive = (v: number | null) => v === null || (Number.isFinite(v) && v > 0);
    if (![p.dailyDeposit, p.weeklyDeposit, p.dailyLoss].every(positive)) fail('Limitler sıfırdan büyük olmalı');
    if (p.excludeDays !== null && (!Number.isFinite(p.excludeDays) || p.excludeDays < 1 || p.excludeDays > 3650)) fail('Geçersiz dondurma süresi');
    const l = data.limits;
    l.daily_deposit_limit = p.dailyDeposit ?? l.daily_deposit_limit;
    l.weekly_deposit_limit = p.weeklyDeposit ?? l.weekly_deposit_limit;
    l.daily_loss_limit = p.dailyLoss ?? l.daily_loss_limit;
    if (p.excludeDays !== null) {
      // Dondurma yalnızca uzatılabilir, kısaltılamaz
      const wanted = Date.now() + p.excludeDays * 86400000;
      const current = l.self_excluded_until ? new Date(l.self_excluded_until).getTime() : 0;
      l.self_excluded_until = new Date(Math.max(wanted, current)).toISOString();
    }
    void user;
    commit();
  },

  /** Biten maçların sonuçlarıyla bekleyen seçimleri sonuçlandırır (tekrar çağrılması güvenlidir). */
  settleFinished(results: Array<{ eventId: string; round: number; home: number; away: number }>) {
    const db = getDb();
    if (results.length === 0 || db.users.length === 0) return;
    let changed = false;
    for (const user of db.users) {
      const data = db.data[user.id];
      if (!data) continue;
      const touched = new Set<string>();
      for (const sel of data.betSelections) {
        if (sel.status !== 'pending') continue;
        const res = results.find((r) => r.eventId === sel.event_id && r.round === sel.round);
        if (!res) continue;
        const outcome: Outcome | null = determineOutcome(sel.market_type, sel.selection_label, res.home, res.away);
        if (!outcome) continue;
        sel.status = outcome;
        touched.add(sel.bet_slip_id);
        changed = true;
      }
      for (const slipId of touched) {
        const slip = data.betSlips.find((s) => s.id === slipId);
        if (slip && slip.status === 'pending') evaluateSlip(user, data, slip);
      }
    }
    if (changed) commit();
  },

  resetDemo: () => { resetDb(); },
  currentUserId,
};
