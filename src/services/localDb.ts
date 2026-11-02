import type { Profile, BetSlipRecord, BetSelectionRecord, Transaction, Bonus, Freebet, ResponsibleLimit } from '@/types';

export type StoredSelection = BetSelectionRecord & { round: number };

export type UserRecord = {
  id: string;
  email: string;
  salt: string;
  hash: string;
  profile: Profile;
  details: Record<string, string>;
};

export type UserData = {
  betSlips: BetSlipRecord[];
  betSelections: StoredSelection[];
  transactions: Transaction[];
  bonuses: Bonus[];
  freebets: Freebet[];
  limits: ResponsibleLimit;
};

type DB = { v: 1; users: UserRecord[]; data: Record<string, UserData>; session: string | null };

const KEY = 'bf-demo-db-v1';
const emptyDb = (): DB => ({ v: 1, users: [], data: {}, session: null });

export const emptyUserData = (): UserData => ({
  betSlips: [], betSelections: [], transactions: [], bonuses: [], freebets: [],
  limits: { daily_deposit_limit: null, weekly_deposit_limit: null, daily_loss_limit: null, self_excluded_until: null },
});

let db: DB = read();
const listeners = new Set<() => void>();

function read(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyDb();
    const parsed = JSON.parse(raw) as DB;
    return parsed && parsed.v === 1 ? parsed : emptyDb();
  } catch {
    return emptyDb();
  }
}

export const getDb = () => db;

/** Değişikliği kalıcılaştırır ve dinleyenleri uyarır. */
export function commit() {
  try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* kota/özel mod: bellekte çalışmaya devam */ }
  listeners.forEach((l) => l());
}

export function resetDb() {
  db = emptyDb();
  commit();
}

export function subscribeDb(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

// Başka sekmede yapılan değişiklikleri yansıt
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY) return;
    db = read();
    listeners.forEach((l) => l());
  });
}
