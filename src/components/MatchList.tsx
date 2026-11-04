import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Lock, Search, Star, X, Zap } from 'lucide-react';
import type { MatchWithMarkets, SelectedBet } from '@/types';
import { sportFilters } from '@/data/sports';

type Props = {
  matches: MatchWithMarkets[];
  selectedBets: SelectedBet[];
  onToggleBet: (bet: SelectedBet) => void;
  onOpenTracker: (match: MatchWithMarkets) => void;
  query: string;
  onQueryChange: (q: string) => void;
  sport: string;
  onSportChange: (s: string) => void;
};

const ONE_X_TWO = ['1', 'X', '2'];

export function MatchList({ matches, selectedBets, onToggleBet, onOpenTracker, query, onQueryChange, sport, onSportChange }: Props) {
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem('bf-fav') || '[]') as string[]); } catch { return new Set(); }
  });

  const filtered = useMemo(() => {
    const q = query.toLocaleLowerCase('tr').trim();
    return matches.filter((m) =>
      (sport === 'Tüm Maçlar' || m.league === sport) &&
      (!q || [m.home, m.away, m.leagueName, m.league].some((x) => x.toLocaleLowerCase('tr').includes(q))),
    );
  }, [matches, sport, query]);

  const isSelected = (m: MatchWithMarkets, marketType: string, label: string) =>
    selectedBets.some((b) => b.eventId === m.eventId && b.marketType === marketType && b.selectionLabel === label);

  const toggleFavorite = (id: string) => setFavorites((prev) => {
    const next = new Set(prev);
    if (next.has(id)) next.delete(id); else next.add(id);
    try { localStorage.setItem('bf-fav', JSON.stringify([...next])); } catch { /* özel mod */ }
    return next;
  });

  return (
    <section className="matches-card" id="matches">
      <div className="card-header">
        <div className="card-title-row">
          <h2>Canlı Bahis</h2>
          <span className="demo-pill" title="Maçlar, oranlar ve skorlar örnek verilerdir">Demo veri</span>
        </div>
        <div className="match-search-bar">
          <Search size={16} />
          <input id="match-search" type="search" placeholder="Lig veya takım ara..." aria-label="Lig veya takım ara" value={query} onChange={(e) => onQueryChange(e.target.value)} />
          {query && <button type="button" onClick={() => onQueryChange('')} aria-label="Aramayı temizle"><X size={14} /></button>}
        </div>
        <div className="filter-row" role="tablist" aria-label="Spor filtresi">
          {sportFilters.map((item) => (
            <button key={item} type="button" role="tab" aria-selected={sport === item} className={sport === item ? 'filter active' : 'filter'} onClick={() => onSportChange(item)}>{item}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 && <p className="empty-search-message">Eşleşen maç bulunamadı.</p>}

      {filtered.map((match) => {
        const opts = match.subMarkets[0].options;
        const expanded = expandedMatch === match.eventId;
        return (
          <div className="match-group" key={match.eventId}>
            <div className="league-label">
              <span className="league-name"><span aria-hidden>{match.league === 'Futbol' ? '⚽' : '🏀'}</span> {match.leagueName}</span>
              <button type="button" className="tracker-btn" onClick={() => onOpenTracker(match)} title="Maç Merkezi">
                <Zap size={14} /> <small>Merkez</small>
              </button>
            </div>
            {match.suspended && (
              <div className="market-suspended-banner"><Lock size={13} /> <span>Maç sona erdi, bahisler kapandı.</span></div>
            )}
            <div className="match-row">
              <div className="match-meta">
                <button type="button" className={`star-match ${favorites.has(match.eventId) ? 'on' : ''}`} onClick={() => toggleFavorite(match.eventId)} aria-label="Favorilere ekle" aria-pressed={favorites.has(match.eventId)}>
                  <Star size={15} fill={favorites.has(match.eventId) ? 'currentColor' : 'none'} />
                </button>
                <span className={match.status === 'ft' ? 'live-tag ended' : 'live-tag'}>{match.status === 'ft' ? 'BİTTİ' : 'LIVE'}</span>
                <span className="match-time">{match.time}</span>
              </div>
              <div className="teams">
                <span><b>{match.home}</b><i>{match.score[0]}</i></span>
                <span><b>{match.away}</b><i>{match.score[1]}</i></span>
              </div>
              <div className="odds">
                {opts.map((opt, i) => (
                  <OddsButton
                    key={opt.label}
                    caption={ONE_X_TWO[i]}
                    odd={opt.odds}
                    selected={isSelected(match, 'match_result', opt.label)}
                    disabled={match.suspended}
                    onClick={() => onToggleBet({
                      eventId: match.eventId, homeTeam: match.home, awayTeam: match.away,
                      marketType: 'match_result', marketLabel: 'Maç Sonucu', selectionLabel: opt.label, odds: Number(opt.odds),
                    })}
                  />
                ))}
              </div>
              <button type="button" className="expand-markets-btn" onClick={() => setExpandedMatch(expanded ? null : match.eventId)} aria-expanded={expanded}>
                <span>+{match.subMarkets.length - 1} market</span>
                <ChevronDown size={14} className={expanded ? 'chevron-rotated' : ''} />
              </button>
            </div>
            {expanded && (
              <div className="sub-markets">
                {match.subMarkets.filter((sm) => sm.type !== 'match_result').map((sm) => (
                  <div className="sub-market-row" key={sm.type}>
                    <div className="sub-market-label">{sm.label}</div>
                    <div className="sub-market-options">
                      {sm.options.map((o) => (
                        <button
                          key={o.label}
                          type="button"
                          className={isSelected(match, sm.type, o.label) ? 'sub-odd selected' : 'sub-odd'}
                          disabled={match.suspended}
                          onClick={() => onToggleBet({
                            eventId: match.eventId, homeTeam: match.home, awayTeam: match.away,
                            marketType: sm.type, marketLabel: sm.label, selectionLabel: o.label, odds: Number(o.odds),
                          })}
                        >
                          <small>{o.label}</small>
                          <strong>{o.odds}</strong>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <div className="bet-builder-hint"><Zap size={13} /> Bet Builder: aynı maçtan farklı marketleri tek kuponda birleştir</div>
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}

function OddsButton({ caption, odd, selected, disabled, onClick }: { caption: string; odd: string; selected: boolean; disabled: boolean; onClick: () => void }) {
  const prevRef = useRef(odd);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (odd === prevRef.current) return;
    setTrend(Number(odd) > Number(prevRef.current) ? 'up' : 'down');
    prevRef.current = odd;
    const timer = window.setTimeout(() => setTrend(null), 1200);
    return () => window.clearTimeout(timer);
  }, [odd]);

  return (
    <button type="button" className={selected ? 'odd selected' : 'odd'} data-trend={trend ?? undefined} disabled={disabled} aria-pressed={selected} onClick={onClick}>
      <small>{caption}</small>
      <strong>{odd}</strong>
    </button>
  );
}
