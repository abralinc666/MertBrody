import { useMemo } from 'react';
import { Activity, Target, Flag, Circle } from 'lucide-react';
import type { MatchWithMarkets, MatchStats, MatchEvent } from '@/types';
import { ModalShell } from '@/components/ModalShell';

type Props = {
  match: MatchWithMarkets;
  onClose: () => void;
};

function seeded(seed: string) {
  let h = 2166136261;
  for (const ch of seed) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}

/** Demo istatistik ve olaylar: maçın skoruna ve dakikasına uyumlu, aynı maç için tutarlı üretilir. */
function buildDemoData(match: MatchWithMarkets): { stats: MatchStats; events: MatchEvent[] } {
  const rnd = seeded(match.eventId);
  const minute = Math.max(1, parseInt(match.time, 10) || (match.status === 'ft' ? 90 : 45));
  const progress = Math.min(1, minute / (match.league === 'Basketbol' ? 48 : 90));
  const scale = (base: number) => Math.round(base * (0.6 + rnd() * 0.8) * progress);
  const possession = 40 + Math.round(rnd() * 20);
  const homeGoals = Number(match.score[0]) || 0;
  const awayGoals = Number(match.score[1]) || 0;
  const stats: MatchStats = {
    match_id: match.eventId,
    home_xg: Number((homeGoals * 0.7 + rnd()).toFixed(1)), away_xg: Number((awayGoals * 0.7 + rnd()).toFixed(1)),
    home_possession: possession, away_possession: 100 - possession,
    home_shots: scale(14), away_shots: scale(11),
    home_shots_on_target: scale(6), away_shots_on_target: scale(4),
    home_corners: scale(7), away_corners: scale(5),
    home_fouls: scale(12), away_fouls: scale(13),
    home_cards: scale(2), away_cards: scale(2),
  };

  const events: MatchEvent[] = [];
  const add = (type: string, side: 'home' | 'away', label: string, atMinute: number, x: number, y: number) =>
    events.push({ id: `${events.length + 1}`, match_id: match.eventId, event_type: type, minute: atMinute, description: `${side === 'home' ? match.home : match.away} ${label}`, home_x: x, home_y: y, created_at: '' });
  const at = () => Math.max(1, Math.round(rnd() * (minute - 1)) + 1);
  if (match.league !== 'Basketbol') {
    for (let i = 0; i < Math.min(homeGoals, 6); i++) add('goal', 'home', 'gol', at(), 80 + rnd() * 12, 35 + rnd() * 30);
    for (let i = 0; i < Math.min(awayGoals, 6); i++) add('goal', 'away', 'gol', at(), 8 + rnd() * 12, 35 + rnd() * 30);
    if (stats.home_corners > 0) add('corner', 'home', 'korner', at(), 92, rnd() > 0.5 ? 8 : 92);
    if (stats.away_corners > 0) add('corner', 'away', 'korner', at(), 8, rnd() > 0.5 ? 8 : 92);
    if (stats.away_cards > 0) add('yellow_card', 'away', 'sarı kart', at(), 25 + rnd() * 20, 20 + rnd() * 60);
    add('shot', rnd() > 0.5 ? 'home' : 'away', 'şut', at(), 15 + rnd() * 70, 20 + rnd() * 60);
  }
  events.sort((a, b) => a.minute - b.minute);
  return { stats, events };
}

export function MatchTracker({ match, onClose }: Props) {
  const { stats: mockStats, events: mockEvents } = useMemo(() => buildDemoData(match), [match]);
  const isSample = true;

  return (
    <ModalShell onClose={onClose} label="Maç Merkezi" className="match-tracker-modal">
        <span className="modal-kicker">MAÇ MERKEZİ</span>
        {isSample && <span className="demo-pill sample-note">Demo istatistik</span>}
        <h2>{match.home} <span className="tracker-score">{match.score[0]} - {match.score[1]}</span> {match.away}</h2>
        <span className="tracker-minute"><span className="live-dot" /> {match.time}</span>

        <div className="pitch-container">
          <div className="pitch">
            <div className="pitch-center-line" />
            <div className="pitch-center-circle" />
            <div className="pitch-goal-left" />
            <div className="pitch-goal-right" />
            {mockEvents.map((event) => (
              <div
                key={event.id}
                className={`pitch-event event-${event.event_type}`}
                style={{ left: `${event.home_x || 50}%`, top: `${event.home_y || 50}%` }}
                title={`${event.minute}' ${event.description}`}
              >
                <span>{event.minute}'</span>
                <small>{event.description}</small>
              </div>
            ))}
            <div className="pitch-ball" style={{ left: '60%', top: '50%' }} />
          </div>
          <div className="pitch-legend">
            <span><Circle size={10} className="event-goal" /> Gol</span>
            <span><Flag size={10} className="event-corner" /> Korner</span>
            <span><Activity size={10} className="event-attack" /> Atak</span>
            <span><Target size={10} className="event-shot" /> Şut</span>
          </div>
        </div>

        <div className="stats-grid">
          <StatBar label="Topla Oynama" home={mockStats.home_possession} away={mockStats.away_possession} suffix="%" />
          <StatBar label="xG (Gol Beklentisi)" home={mockStats.home_xg} away={mockStats.away_xg} />
          <StatBar label="Şutlar" home={mockStats.home_shots} away={mockStats.away_shots} />
          <StatBar label="İsabetli Şut" home={mockStats.home_shots_on_target} away={mockStats.away_shots_on_target} />
          <StatBar label="Korner" home={mockStats.home_corners} away={mockStats.away_corners} />
          <StatBar label="Faul" home={mockStats.home_fouls} away={mockStats.away_fouls} />
          <StatBar label="Kart" home={mockStats.home_cards} away={mockStats.away_cards} />
        </div>

        <div className="event-timeline">
          <h3>Olay Akışı</h3>
          {mockEvents.map((event) => (
            <div className="timeline-event" key={event.id}>
              <span className="timeline-minute">{event.minute}'</span>
              <span className={`timeline-icon event-${event.event_type}`}>
                {event.event_type === 'goal' ? '⚽' : event.event_type === 'yellow_card' ? '🟨' : event.event_type === 'corner' ? '🚩' : event.event_type === 'shot' ? '🎯' : '⚡'}
              </span>
              <span className="timeline-desc">{event.description}</span>
            </div>
          ))}
        </div>
    </ModalShell>
  );
}

function StatBar({ label, home, away, suffix = '' }: { label: string; home: number; away: number; suffix?: string }) {
  const total = home + away || 1;
  const homePct = (home / total) * 100;
  return (
    <div className="stat-bar-row">
      <span className="stat-home">{home}{suffix}</span>
      <div className="stat-bar-container">
        <small>{label}</small>
        <div className="stat-bar-track">
          <div className="stat-bar-home" style={{ width: `${homePct}%` }} />
          <div className="stat-bar-away" style={{ width: `${100 - homePct}%` }} />
        </div>
      </div>
      <span className="stat-away">{away}{suffix}</span>
    </div>
  );
}
