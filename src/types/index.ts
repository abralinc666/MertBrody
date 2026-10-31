export type Sport = { name: string; count?: number; icon: string };
export type Match = { league: string; time: string; home: string; away: string; score: string[]; odds: string[]; leagueName?: string };
export type Profile = { id: string; display_name: string | null; vip_level: string; vip_points: number; total_staked: number; balance: number; odds_preference: string };
export type Bet = { id: string; home_team: string; away_team: string; selection: string; odds: number; stake: number; status: string; placed_at: string };
export type LiveScore = { id: string; home: string; away: string; homeScore: string; awayScore: string; time: string; status: string };
export type HeroSlide = { kicker: string; value: string; title: string; description: string };

export type ModalType = 'login' | 'register' | 'promotions' | 'account' | 'wallet' | 'responsible' | 'bonuses' | 'aml' | 'match-tracker';

export type MarketType = 'match_result' | 'over_under' | 'btts' | 'handicap' | 'corners' | 'cards' | 'player_bet' | 'first_half' | 'double_chance';

export type SubMarket = {
  type: MarketType;
  label: string;
  options: Array<{ label: string; odds: string }>;
};

export type MatchWithMarkets = Match & {
  subMarkets: SubMarket[];
  eventId: string;
  suspended: boolean;
  leagueName: string;
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
