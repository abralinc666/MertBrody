import { Radio } from 'lucide-react';
import type { MatchWithMarkets } from '@/types';

export function LiveTicker({ matches }: { matches: MatchWithMarkets[] }) {
  const liveCount = matches.filter((m) => m.status === 'live').length;

  return (
    <section className="live-ticker-section" aria-label="Canlı skorlar">
      <div className="live-ticker-header">
        <h2><Radio size={18} /> Canlı Skorlar <span className="demo-pill">Demo veri</span></h2>
        <span className="live-ticker-count"><span className="live-dot" /> {liveCount} maç devam ediyor</span>
      </div>
      <div className="live-ticker-scroll">
        {matches.map((m) => (
          <div className={`live-ticker-item ${m.status === 'ht' ? 'ht-status' : ''} ${m.status === 'ft' ? 'ft-status' : ''}`} key={m.eventId}>
            <div className="ticker-item-top">
              <span className="ticker-league">{m.leagueName}</span>
              <span className={`ticker-minute ${m.status === 'live' ? 'live-min' : ''}`}>
                {m.status === 'ht' ? 'DEVRE' : m.status === 'ft' ? 'BİTTİ' : m.time}
              </span>
            </div>
            <div className="ticker-item-teams">
              <div className="ticker-team"><strong>{m.home}</strong><span className="ticker-score">{m.score[0]}</span></div>
              <div className="ticker-team"><strong>{m.away}</strong><span className="ticker-score">{m.score[1]}</span></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
