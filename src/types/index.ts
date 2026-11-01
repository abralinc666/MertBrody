export type Sport = { name: string; count?: number; icon: string };
export type Match = { league: string; time: string; home: string; away: string; score: string[]; odds: string[]; leagueName?: string };
export type Profile = { id: string; display_name: string | null; vip_level: string; vip_points: number; total_staked: number; balance: number; odds_preference: string };
export type LiveScore = { id: string; league?: string; home: string; away: string; homeScore: string; awayScore: string; time: string; status: string };
export type HeroSlide = { kicker: string; value: string; title: string; description: string };

export type ModalType = 'login' | 'register' | 'recovery' | 'promotions' | 'account' | 'wallet' | 'responsible' | 'bonuses' | 'aml' | 'info';

export type MarketType = 'match_result' | 'over_under' | 'btts' | 'handicap' | 'corners' | 'cards' | 'player_bet' | 'first_half' | 'double_chance';

export type SubMarket = {
  type: MarketType;
  label: string;
  options: Array<{ label: string; odds: string }>;
};

export type MatchStatus = 'live' | 'ht' | 'ft';

export type MatchWithMarkets = Match & {
  subMarkets: SubMarket[];
  eventId: string;
  suspended: boolean;
  leagueName: string;
  status: MatchStatus;
};

export type BetSlipType = 'single' | 'combo' | 'system';
export type OddsPreference = 'accept_any' | 'accept_higher' | 'ask_me';

export type BetSlipRecord = {
  id: string;
  type: BetSlipType;
  status: string;
  total_odds: number;
  stake: number;
  potential_payout: number;
  actual_payout: number;
  cashout_offer: number;
  placed_at: string;
  settled_at: string | null;
  system_size: number | null;
  unit_stake: number | null;
  freebet_id: string | null;
};

export type BetSelectionRecord = {
  id: string;
  bet_slip_id: string;
  event_id: string;
  home_team: string;
  away_team: string;
  market_type: string;
  selection_label: string;
  odds: number;
  status: string;
};

export type Transaction = {
  id: string;
  type: string;
  amount: number;
  balance_after: number;
  description: string | null;
  created_at: string;
};

export type Bonus = {
  id: string;
  type: string;
  name: string;
  amount: number;
  wagering_requirement: number;
  wagering_progress: number;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export type Freebet = {
  id: string;
  amount: number;
  source?: string;
  status: string;
  expires_at: string | null;
  created_at: string;
};

export type ResponsibleLimit = {
  daily_deposit_limit: number | null;
  weekly_deposit_limit: number | null;
  daily_loss_limit: number | null;
  self_excluded_until: string | null;
};

export type MatchEvent = {
  id: string;
  match_id: string;
  event_type: string;
  minute: number;
  description: string | null;
  home_x: number | null;
  home_y: number | null;
  created_at: string;
};

export type MatchStats = {
  match_id: string;
  home_xg: number;
  away_xg: number;
  home_possession: number;
  away_possession: number;
  home_shots: number;
  away_shots: number;
  home_shots_on_target: number;
  away_shots_on_target: number;
  home_corners: number;
  away_corners: number;
  home_fouls: number;
  away_fouls: number;
  home_cards: number;
  away_cards: number;
};

export type SelectedBet = {
  eventId: string;
  homeTeam: string;
  awayTeam: string;
  marketType: MarketType;
  marketLabel: string;
  selectionLabel: string;
  odds: number;
};

export type RegisterValues = {
  first_name: string; last_name: string; tc_identity: string; birth_date: string;
  phone: string; email: string; city: string; district: string; address: string;
  postal_code: string; country: string; displayName: string; email_confirm: string;
  password: string; terms: boolean; kvkk: boolean;
};
