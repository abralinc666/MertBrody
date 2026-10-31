import type { Profile, Bet, BetSlipRecord, Transaction, Bonus, Freebet, ResponsibleLimit } from '@/types';

// Frontend-only preview: no authentication, database, or realtime connection.
export function useUserRealtime() {
  const profile: Profile | null = null;
  const betHistory: Bet[] = [];
  const betSlips: BetSlipRecord[] = [];
  const transactions: Transaction[] = [];
  const bonuses: Bonus[] = [];
  const freebets: Freebet[] = [];
  const responsibleLimits: ResponsibleLimit | null = null;
  const refreshAccount = async () => {};

  return { profile, betHistory, betSlips, transactions, bonuses, freebets, responsibleLimits, refreshAccount };
}
