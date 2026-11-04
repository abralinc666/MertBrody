import { SITE } from '@/config/site';
import type { Sport, Match, HeroSlide, MatchWithMarkets, MarketType, SubMarket } from '@/types';

export const sports: Sport[] = [
  { name: 'Futbol', count: 1247, icon: '⚽' },
  { name: 'Basketbol', count: 214, icon: '🏀' },
  { name: 'Tenis', count: 168, icon: '🟢' },
  { name: 'Voleybol', count: 87, icon: '🏐' },
  { name: 'Buz Hokeyi', count: 64, icon: '🏒' },
  { name: 'Masa Tenisi', count: 178, icon: '🏓' },
  { name: 'Dart', count: 32, icon: '🎯' },
  { name: 'eSpor', count: 142, icon: '🎮' },
  { name: 'Beyzbol', count: 12, icon: '⚾' },
  { name: 'Hentbol', count: 48, icon: '🤱' },
  { name: 'Amerikan Futbolu', count: 24, icon: '🏈' },
  { name: 'Formula 1', count: 11, icon: '🏁' },
];

function buildSubMarkets(odds: string[], home: string, away: string): SubMarket[] {
  return [
    {
      type: 'match_result',
      label: 'Maç Sonucu',
      options: [
        { label: `1 · ${home}`, odds: odds[0] },
        { label: 'X · Beraberlik', odds: odds[1] },
        { label: `2 · ${away}`, odds: odds[2] },
      ],
    },
    {
      type: 'over_under',
      label: 'Alt/Üst 2.5',
      options: [
        { label: 'Alt 2.5', odds: '1.75' },
        { label: 'Üst 2.5', odds: '2.05' },
      ],
    },
    {
      type: 'btts',
      label: 'Karşılıklı Gol',
      options: [
        { label: 'Var', odds: '1.85' },
        { label: 'Yok', odds: '1.95' },
      ],
    },
    {
      type: 'double_chance',
      label: 'Çifte Şans',
      options: [
        { label: '1X', odds: '1.25' },
        { label: '12', odds: '1.30' },
        { label: 'X2', odds: '1.45' },
      ],
    },
    {
      type: 'handicap',
      label: 'Handikap (+1)',
      options: [
        { label: `1 (+1) ${home}`, odds: '1.55' },
        { label: `2 (-1) ${away}`, odds: '2.40' },
      ],
    },
    {
      type: 'corners',
      label: 'Korner Sayısı',
      options: [
        { label: 'Üst 9.5', odds: '1.90' },
        { label: 'Alt 9.5', odds: '1.80' },
      ],
    },
    {
      type: 'cards',
      label: 'Kart Sayısı',
      options: [
        { label: 'Üst 3.5', odds: '2.10' },
        { label: 'Alt 3.5', odds: '1.70' },
      ],
    },
    {
      type: 'first_half',
      label: 'İlk Yarı Sonucu',
      options: [
        { label: `1 · ${home}`, odds: '2.20' },
        { label: 'X · Beraberlik', odds: '1.50' },
        { label: `2 · ${away}`, odds: '3.10' },
      ],
    },
  ];
}

const rawMatches: Match[] = [
  { league: 'Futbol', leagueName: 'Süper Lig', time: '57\'', home: 'Galatasaray', away: 'Fenerbahçe', score: ['1', '0'], odds: ['1.45', '3.80', '6.20'] },
  { league: 'Futbol', leagueName: 'La Liga', time: '63\'', home: 'Real Madrid', away: 'Barcelona', score: ['2', '1'], odds: ['1.70', '3.60', '4.80'] },
  { league: 'Futbol', leagueName: 'Premier League', time: '38\'', home: 'Manchester United', away: 'Liverpool', score: ['0', '1'], odds: ['4.20', '3.90', '1.85'] },
  { league: 'Futbol', leagueName: 'Serie A', time: '26\'', home: 'Inter', away: 'AC Milan', score: ['0', '0'], odds: ['2.10', '3.30', '3.10'] },
  { league: 'Basketbol', leagueName: 'THY EuroLeague', time: '12\'', home: 'Anadolu Efes', away: 'Fenerbahçe Beko', score: ['18', '22'], odds: ['2.05', '12.50', '1.67'] },
];

export const matches: MatchWithMarkets[] = rawMatches.map((m) => ({
  ...m,
  leagueName: m.leagueName || m.league,
  eventId: `${m.home}-${m.away}`,
  suspended: false,
  status: 'live' as const,
  subMarkets: buildSubMarkets(m.odds, m.home, m.away),
}));

export const heroSlides: HeroSlide[] = [
  { kicker: `${SITE.name}'te`, value: '%100', title: 'Hoş Geldin Bonusu!', description: 'Yeni üyelerimize özel kaçırılmayacak fırsat!' },
  { kicker: 'Anlık kayıp bonusu', value: '%40', title: 'Kayıp Bonusu!', description: 'Aktif bahislerinde kaybının %40\'ını geri al!' },
  { kicker: 'Yeni üye fırsatı', value: '1.500 ₺', title: 'Deneme Bonusu!', description: 'Risksiz oyun deneyimiyle hemen başla!' },
  { kicker: 'Kripto yatırım', value: '%50', title: 'Kripto Bonusu!', description: 'Kripto yatırımlarında ekstra avantaj kazan!' },
  { kicker: 'Topluluk etkinliği', value: 'BONUS', title: 'Telegram Etkinliği!', description: 'Etkinliklere katıl, sürpriz bonusları yakala!' },
];

export const games = [
  { name: 'Sweet Bonanza', gradient: 'linear-gradient(135deg,#ec4899,#fb7185 55%,#facc15)', icon: '🍭' },
  { name: 'Gates of Olympus', gradient: 'linear-gradient(135deg,#f59e0b,#c2410c 55%,#1e3a8a)', icon: '⚡' },
  { name: 'Big Bass Bonanza', gradient: 'linear-gradient(135deg,#16a34a,#bef264)', icon: '🐟' },
  { name: 'Roulette', gradient: 'linear-gradient(135deg,#7f1d1d,#f59e0b)', icon: '◉' },
  { name: 'Blackjack', gradient: 'linear-gradient(135deg,#047857,#86efac)', icon: '♠' },
  { name: 'Crazy Time', gradient: 'linear-gradient(135deg,#f97316,#dc2626)', icon: '★' },
];

export const liveSportsCounts = [67, 28, 12, 9, 7, 6, 5];

export const sportFilters = ['Tüm Maçlar', 'Futbol', 'Basketbol', 'Tenis', 'Voleybol', 'Buz Hokeyi'];

export const navItems = ['Spor Bahisleri', 'Canlı Bahis', 'Casino', 'Canlı Casino', 'Slotlar', 'Sanal Bahis', 'Tombala', 'Promosyonlar'];

export const winners = [
  ['AhmetK***', 'Sweet Bonanza', '₺ 12.450', '🍭'],
  ['Merve34**', 'Gates of Olympus', '₺ 8.760', '⚡'],
  ['Kadir06**', 'Big Bass Bonanza', '₺ 6.320', '🐟'],
] as const;

export const bonusTypes = [
  { type: 'welcome', name: 'Hoş Geldin %100 Bonusu', amount: 500, wagering: 5, icon: '🎁' },
  { type: 'cashback', name: 'Anlık %40 Kayıp İadesi', amount: 200, wagering: 3, icon: '💸' },
  { type: 'freebet_bonus', name: '500 ₺ Freebet', amount: 500, wagering: 1, icon: '🎰' },
  { type: 'crypto', name: '%50 Kripto Yatırım Bonusu', amount: 250, wagering: 4, icon: '₿' },
  { type: 'telegram', name: 'Telegram Etkinlik Bonusu', amount: 100, wagering: 2, icon: '📢' },
] as const;

export const marketTypeLabels: Record<MarketType, string> = {
  match_result: 'Maç Sonucu',
  over_under: 'Alt/Üst',
  btts: 'Karşılıklı Gol',
  handicap: 'Handikap',
  corners: 'Korner',
  cards: 'Kart',
  player_bet: 'Oyuncu',
  first_half: 'İlk Yarı',
  double_chance: 'Çifte Şans',
};
