import { useEffect, useState } from 'react';
import type { MatchWithMarkets } from '@/types';
import { matches as baseMatches } from '@/data/sports';
import { setMatchState } from '@/services/liveState';
import { api } from '@/services/api';

type Sim = { minute: number; home: number; away: number; status: 'live' | 'ht' | 'ft'; pause: number; round: number };

const TICK_MS = 2500;       // her tikte oyun 1 dakika ilerler (hızlandırılmış demo)
const HT_TICKS = 3;         // devre arası süresi
const FT_TICKS = 12;        // maç sonu bekleme; sonra yeni tur başlar
const STORAGE_KEY = 'bf-demo-sim-v1';

const isBasket = (league: string) => league === 'Basketbol';
const durationOf = (league: string) => (isBasket(league) ? 48 : 90);
const halfOf = (league: string) => (isBasket(league) ? 24 : 45);

function init(): Record<string, Sim> {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') as Record<string, Sim> | null;
    if (saved && baseMatches.every((m) => saved[m.eventId])) return saved;
  } catch { /* bozuk kayıt: sıfırdan başla */ }
  return Object.fromEntries(
    baseMatches.map((m) => [m.eventId, {
      minute: parseInt(m.time, 10) || 1, home: parseInt(m.score[0], 10) || 0, away: parseInt(m.score[1], 10) || 0,
      status: 'live' as const, pause: 0, round: 0,
    }]),
  );
}

function step(s: Sim, league: string): Sim {
  if (s.status === 'ft') {
    // Bekleme bitince aynı karşılaşma için yeni tur
    return s.pause >= FT_TICKS ? { minute: 1, home: 0, away: 0, status: 'live', pause: 0, round: s.round + 1 } : { ...s, pause: s.pause + 1 };
  }
  if (s.status === 'ht') return s.pause >= HT_TICKS ? { ...s, status: 'live', pause: 0, minute: halfOf(league) + 1 } : { ...s, pause: s.pause + 1 };

  const minute = s.minute + 1;
  let { home, away } = s;
  if (isBasket(league)) {
    home += Math.random() < 0.7 ? Math.ceil(Math.random() * 3) : 0;
    away += Math.random() < 0.7 ? Math.ceil(Math.random() * 3) : 0;
  } else if (Math.random() < 0.07) {
    if (Math.random() < 0.5) home += 1; else away += 1;
  }
  if (minute >= durationOf(league)) return { ...s, minute: durationOf(league), home, away, status: 'ft', pause: 0 };
  if (minute === halfOf(league)) return { ...s, minute, home, away, status: 'ht', pause: 0 };
  return { ...s, minute, home, away };
}

/**
 * Örnek (demo) canlı akış. Maç listesi, skor şeridi ve maç merkezi aynı kaynağı kullanır.
 * Biten maçlar demo arka uca iletilir ve bekleyen kuponlar otomatik sonuçlanır.
 */
export function useLiveMatches(): MatchWithMarkets[] {
  const [sim, setSim] = useState<Record<string, Sim>>(init);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSim((prev) => Object.fromEntries(baseMatches.map((m) => [m.eventId, step(prev[m.eventId], m.league)])));
    }, TICK_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sim)); } catch { /* özel mod */ }
    const finished: Array<{ eventId: string; round: number; home: number; away: number }> = [];
    for (const m of baseMatches) {
      const s = sim[m.eventId];
      setMatchState(m.eventId, { status: s.status, round: s.round, home: s.home, away: s.away });
      if (s.status === 'ft') finished.push({ eventId: m.eventId, round: s.round, home: s.home, away: s.away });
    }
    if (finished.length) api.settleFinished(finished);
  }, [sim]);

  return baseMatches.map((m) => {
    const s = sim[m.eventId];
    return {
      ...m,
      status: s.status,
      suspended: s.status === 'ft',
      time: s.status === 'ft' ? 'MS' : s.status === 'ht' ? 'DA' : `${s.minute}'`,
      score: [String(s.home), String(s.away)],
    };
  });
}
