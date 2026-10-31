import { useEffect, useState } from 'react';
import { Radio } from 'lucide-react';
import { matches } from '@/data/sports';

type LiveMatchState = {
  eventId: string;
  minute: number;
  home: string;
  away: string;
  homeScore: number;
  awayScore: number;
  leagueName: string;
  sport: string;
  status: 'live' | 'ht' | 'ft';
};

function initLiveMatches(): LiveMatchState[] {
  return matches.map((m) => {
    const minute = parseInt(m.time.replace("'", ''), 10) || 1;
    return {
      eventId: m.eventId,
      minute,
      home: m.home,
      away: m.away,
      homeScore: parseInt(m.score[0], 10) || 0,
      awayScore: parseInt(m.score[1], 10) || 0,
      leagueName: m.leagueName,
      sport: m.league,
      status: 'live' as const,
    };
  });
}

export function LiveTicker() {
  const [liveMatches, setLiveMatches] = useState<LiveMatchState[]>(initLiveMatches);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setLiveMatches((prev) =>
        prev.map((m) => {
          if (m.status !== 'live') return m;
          const newMinute = m.minute + 1;
          if (newMinute >= 90) {
            return { ...m, minute: 90, status: 'ft' as const };
          }
          if (newMinute === 45) {
            return { ...m, minute: 45, status: 'ht' as const };
          }
          if (m.sport === 'Basketbol') {
            return { ...m, minute: newMinute };
          }
          const scoreChance = Math.random();
          if (scoreChance < 0.08) {
            return Math.random() < 0.5
              ? { ...m, minute: newMinute, homeScore: m.homeScore + 1 }
              : { ...m, minute: newMinute, awayScore: m.awayScore + 1 };
          }
          return { ...m, minute: newMinute };
        }),
      );
      setPulse(true);
      window.setTimeout(() => setPulse(false), 600);
    }, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const liveCount = liveMatches.filter((m) => m.status === 'live').length;

  return (
    <section className="live-ticker-section">
      <div className="live-ticker-header">
        <h2><Radio size={18} className={pulse ? 'pulse-on' : ''} /> Canlı Skorlar</h2>
        <span className="live-ticker-count">
          <span className="live-dot" /> {liveCount} maç devam ediyor
        </span>
      </div>
      <div className="live-ticker-scroll">
        {liveMatches.map((m) => (
          <div
            className={`live-ticker-item ${m.status === 'ht' ? 'ht-status' : ''} ${m.status === 'ft' ? 'ft-status' : ''}`}
            key={m.eventId}
          >
            <div className="ticker-item-top">
              <span className="ticker-league">{m.leagueName}</span>
              <span className={`ticker-minute ${m.status === 'live' ? 'live-min' : ''}`}>
                {m.status === 'ht' ? 'DEVRE' : m.status === 'ft' ? 'BİTTİ' : `${m.minute}'`}
              </span>
            </div>
            <div className="ticker-item-teams">
              <div className="ticker-team">
                <strong>{m.home}</strong>
                <span className="ticker-score">{m.homeScore}</span>
              </div>
              <div className="ticker-team">
                <strong>{m.away}</strong>
                <span className="ticker-score">{m.awayScore}</span>
              </div>
            </div>
            {m.status === 'live' && (
              <div className="ticker-progress-bar">
                <div className="ticker-progress-fill" style={{ width: `${Math.min(100, (m.minute / 90) * 100)}%` }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
