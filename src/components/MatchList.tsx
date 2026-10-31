import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Lock, MoreHorizontal, Search, Star, Zap } from 'lucide-react';
import type { MatchWithMarkets, SelectedBet } from '@/types';
import { matches, sportFilters } from '@/data/sports';

type Props = {
  selectedBets: SelectedBet[];
  onToggleBet: (bet: SelectedBet) => void;
  onOpenTracker: (match: MatchWithMarkets) => void;
};

export function MatchList({ selectedBets, onToggleBet, onOpenTracker }: Props) {
  const [activeSport, setActiveSport] = useState('Tüm Maçlar');
  const [expandedMatch, setExpandedMatch] = useState<string | null>(null);
  const [betDelay, setBetDelay] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = useMemo(() => {
    let result = activeSport === 'Tüm Maçlar' ? matches : matches.filter((m) => m.league === activeSport);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((m) =>
        m.home.toLowerCase().includes(q) ||
        m.away.toLowerCase().includes(q) ||
        m.leagueName.toLowerCase().includes(q) ||
        m.league.toLowerCase().includes(q),
      );
    }
    return result;
  }, [activeSport, searchQuery]);

  const handleBetClick = (bet: SelectedBet) => {
    setBetDelay(true);
    setTimeout(() => {
      onToggleBet(bet);
      setBetDelay(false);
    }, 3000);
  };

  const isBetSelected = (match: MatchWithMarkets, label: string) =>
    selectedBets.some((b) => b.eventId === match.eventId && b.selectionLabel === label);

  return (
    <section className="matches-card" id="matches">
      <div className="card-header">
        <h2>Canlı Bahis</h2>
        <div className="match-search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Lig veya takım ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && <button onClick={() => setSearchQuery('')} aria-label="Temizle">✕</button>}
        </div>
        <div className="filter-row">
          {sportFilters.map((item) => (
            <button key={item} className={activeSport === item ? 'filter active' : 'filter'} onClick={() => setActiveSport(item)}>{item}</button>
          ))}
        </div>
      </div>
      {filteredMatches.length === 0 && (
        <p className="empty-search-message">Aramanızla eşleşen maç bulunamadı.</p>
      )}
      {filteredMatches.map((match) => (
        <div className="match-group" key={match.eventId}>
          <div className="league-label">
            <span>{match.league === 'Futbol' ? '⚽' : '🏀'}</span> {match.leagueName}
            <button className="tracker-btn" onClick={() => onOpenTracker(match)} title="Maç Merkezi">
              <Zap size={14} /> <small>Merkez</small>
            </button>
            <MoreHorizontal size={17} />
          </div>
          {match.suspended && (
            <div className="market-suspended-banner">
              <Lock size={13} /> Bahisler geçici olarak askıya alındı (Tehlikeli atak)
            </div>
          )}
          <div className="match-row">
            <button className="star-match"><Star size={15} /></button>
            <span className="live-tag">LIVE</span>
            <span className="match-time">{match.time}</span>
            <div className="teams"><span>{match.home}</span><span>{match.away}</span></div>
            <div className="scores"><span>{match.score[0]}</span><span>{match.score[1]}</span></div>
            <div className="odds">
              {match.odds.map((odd) => (
                <OddsButton
                  key={odd}
                  odd={odd}
                  selected={isBetSelected(match, `1 · ${match.home}`) && odd === match.odds[0] || isBetSelected(match, 'X · Beraberlik') && odd === match.odds[1] || isBetSelected(match, `2 · ${match.away}`) && odd === match.odds[2]}
                  disabled={match.suspended || betDelay}
                  onClick={() => {
                    const label = odd === match.odds[0] ? `1 · ${match.home}` : odd === match.odds[1] ? 'X · Beraberlik' : `2 · ${match.away}`;
                    handleBetClick({
                      eventId: match.eventId,
                      homeTeam: match.home,
                      awayTeam: match.away,
                      marketType: 'match_result',
                      marketLabel: 'Maç Sonucu',
                      selectionLabel: label,
                      odds: Number(odd),
                    });
                  }}
                />
              ))}
            </div>
            <button className="expand-markets-btn" onClick={() => setExpandedMatch(expandedMatch === match.eventId ? null : match.eventId)}>
              <span>+{match.subMarkets.length} market</span>
              <ChevronDown size={14} className={expandedMatch === match.eventId ? 'chevron-rotated' : ''} />
            </button>
          </div>
          {expandedMatch === match.eventId && (
            <div className="sub-markets">
              {match.subMarkets.filter((sm) => sm.type !== 'match_result').map((sm) => (
                <div className="sub-market-row" key={sm.type}>
                  <div className="sub-market-label">{sm.label}</div>
                  <div className="sub-market-options">
                    {sm.options.map((opt) => (
                      <button
                        key={opt.label}
                        className={isBetSelected(match, opt.label) ? 'sub-odd selected' : 'sub-odd'}
                        disabled={match.suspended || betDelay}
                        onClick={() => handleBetClick({
                          eventId: match.eventId,
                          homeTeam: match.home,
                          awayTeam: match.away,
                          marketType: sm.type,
                          marketLabel: sm.label,
                          selectionLabel: opt.label,
                          odds: Number(opt.odds),
                        })}
                      >
                        <small>{opt.label}</small>
                        <strong>{opt.odds}</strong>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="bet-builder-hint">
                <Zap size={13} /> Bet Builder: Aynı maçtan farklı marketleri tek kuponda birleştir
              </div>
            </div>
          )}
        </div>
      ))}
      {betDelay && (
        <div className="bet-delay-overlay">
          <div className="bet-delay-content">
            <div className="bet-delay-spinner" />
            <span>Bahis 3 saniye güvenlik beklemesinde...</span>
          </div>
        </div>
      )}
    </section>
  );
}

function OddsButton({ odd, selected, disabled, onClick }: { odd: string; selected: boolean; disabled: boolean; onClick: () => void }) {
  const prevRef = useRef(odd);
  const [trend, setTrend] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    if (odd !== prevRef.current) {
      setTrend(Number(odd) > Number(prevRef.current) ? 'up' : 'down');
      prevRef.current = odd;
      const timer = window.setTimeout(() => setTrend(null), 1200);
      return () => window.clearTimeout(timer);
    }
  }, [odd]);

  return (
    <button
      className={selected ? 'odd selected' : 'odd'}
      data-trend={trend}
      disabled={disabled}
      onClick={onClick}
    >
      {odd}
    </button>
  );
}
