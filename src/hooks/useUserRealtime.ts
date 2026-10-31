import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Bet, BetSlipRecord, BetSelectionRecord, Transaction, Bonus, Freebet, ResponsibleLimit } from '@/types';

export function useUserRealtime() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [betHistory, setBetHistory] = useState<Bet[]>([]);
  const [betSlips, setBetSlips] = useState<BetSlipRecord[]>([]);
  const [betSelections, setBetSelections] = useState<BetSelectionRecord[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bonuses, setBonuses] = useState<Bonus[]>([]);
  const [freebets, setFreebets] = useState<Freebet[]>([]);
  const [responsibleLimits, setResponsibleLimits] = useState<ResponsibleLimit | null>(null);
  const [userId, setUserId] = useState<string | undefined>();

  const refreshAccount = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    setUserId(userData.user.id);

    const [
      { data: profileData },
      { data: betsData },
      { data: slipsData },
      { data: txData },
      { data: bonusData },
      { data: freebetData },
      { data: limitsData },
    ] = await Promise.all([
      supabase.from('profiles').select('id, display_name, vip_level, vip_points, total_staked, balance, odds_preference').eq('id', userData.user.id).maybeSingle(),
      supabase.from('bets').select('id, home_team, away_team, selection, odds, stake, status, placed_at').order('placed_at', { ascending: false }).limit(10),
      supabase.from('bet_slips').select('id, type, status, total_odds, stake, potential_payout, actual_payout, cashout_offer, placed_at, settled_at').order('placed_at', { ascending: false }).limit(20),
      supabase.from('transactions').select('id, type, amount, balance_after, description, created_at').order('created_at', { ascending: false }).limit(50),
      supabase.from('bonuses').select('id, type, name, amount, wagering_requirement, wagering_progress, status, expires_at, created_at').order('created_at', { ascending: false }),
      supabase.from('freebets').select('id, amount, status, expires_at, created_at').order('created_at', { ascending: false }),
      supabase.from('responsible_limits').select('daily_deposit_limit, weekly_deposit_limit, daily_loss_limit, self_excluded_until').eq('user_id', userData.user.id).maybeSingle(),
    ]);

    setProfile(profileData as Profile | null);
    setBetHistory((betsData || []) as Bet[]);
    setBetSlips((slipsData || []) as BetSlipRecord[]);
    setTransactions((txData || []) as Transaction[]);
    setBonuses((bonusData || []) as Bonus[]);
    setFreebets((freebetData || []) as Freebet[]);
    setResponsibleLimits(limitsData as ResponsibleLimit | null);
  };

  // Fetch selections for all loaded slips
  useEffect(() => {
    if (betSlips.length === 0) { setBetSelections([]); return; }
    const slipIds = betSlips.map((s) => s.id);
    supabase.from('bet_selections').select('id, bet_slip_id, event_id, home_team, away_team, market_type, selection_label, odds, status')
      .in('bet_slip_id', slipIds).then(({ data }) => {
        setBetSelections((data || []) as BetSelectionRecord[]);
      });
  }, [betSlips]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) void refreshAccount();
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) void refreshAccount();
      else {
        setProfile(null); setBetHistory([]); setBetSlips([]); setTransactions([]);
        setBonuses([]); setFreebets([]); setResponsibleLimits(null); setUserId(undefined);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Realtime: listen for profile changes and new bets
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('profile-and-bets-v2')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => { setProfile(payload.new as Profile); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bet_slips', filter: `user_id=eq.${userId}` },
        () => { void refreshAccount(); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'transactions', filter: `user_id=eq.${userId}` },
        () => { void refreshAccount(); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bonuses', filter: `user_id=eq.${userId}` },
        () => { void refreshAccount(); },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'freebets', filter: `user_id=eq.${userId}` },
        () => { void refreshAccount(); },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return {
    profile, betHistory, betSlips, betSelections, transactions,
    bonuses, freebets, responsibleLimits, refreshAccount,
  };
}
