import type { MarketType } from '@/types';

export type Outcome = 'won' | 'lost' | 'void';

/** Sonucu belirlenemeyen marketler için null döner (kupon beklemede kalır). */
export function determineOutcome(market: MarketType | string, rawLabel: string, home: number, away: number): Outcome | null {
  const label = rawLabel.trim();
  const lower = label.toLocaleLowerCase('tr');
  switch (market) {
    case 'match_result':
      if (label.startsWith('1 ')) return home > away ? 'won' : 'lost';
      if (/^x\b/i.test(label)) return home === away ? 'won' : 'lost';
      if (label.startsWith('2 ')) return away > home ? 'won' : 'lost';
      return null;
    case 'double_chance':
      if (label === '1X') return home >= away ? 'won' : 'lost';
      if (label === 'X2') return away >= home ? 'won' : 'lost';
      if (label === '12') return home !== away ? 'won' : 'lost';
      return null;
    case 'btts': {
      const both = home > 0 && away > 0;
      if (lower === 'var') return both ? 'won' : 'lost';
      if (lower === 'yok') return both ? 'lost' : 'won';
      return null;
    }
    case 'over_under': {
      const line = parseFloat(label.match(/\d+(?:\.\d+)?/)?.[0] ?? '');
      if (Number.isNaN(line)) return null;
      const total = home + away;
      if (lower.startsWith('alt')) return total < line ? 'won' : 'lost';
      if (lower.startsWith('üst') || lower.startsWith('ust')) return total > line ? 'won' : 'lost';
      return null;
    }
    case 'handicap':
      if (label.startsWith('1 (+1)')) return home + 1 > away ? 'won' : 'lost';
      if (label.startsWith('2 (-1)')) return away - 1 > home ? 'won' : 'lost';
      return null;
    default:
      return null; // korner, kart, ilk yarı, oyuncu: istatistik kaynağı yok
  }
}

export function nChooseK(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  let r = 1;
  const m = Math.min(k, n - k);
  for (let i = 1; i <= m; i++) r = (r * (n - m + i)) / i;
  return Math.round(r);
}

export const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Sistem kuponu çarpanı: k'lık tüm alt kümelerin oran çarpımlarının toplamı.
 * 'potential': hepsi kazanır varsayımı. 'settled': kaybeden bacaklı alt kümeler elenir, iptal bacak oranı 1 sayılır.
 */
export function systemMultiplier(odds: number[], status: string[], k: number, mode: 'potential' | 'settled'): number {
  const n = odds.length;
  if (n === 0 || k < 1 || k > n || n > 12) return 0;
  let total = 0;
  for (let mask = 1; mask < 1 << n; mask++) {
    let cnt = 0, prod = 1, ok = true;
    for (let i = 0; i < n; i++) {
      if (!(mask & (1 << i))) continue;
      cnt++;
      if (mode === 'settled') {
        if (status[i] === 'lost') { ok = false; break; }
        if (status[i] !== 'void') prod *= odds[i];
      } else prod *= odds[i];
    }
    if (ok && cnt === k) total += prod;
  }
  return total;
}
