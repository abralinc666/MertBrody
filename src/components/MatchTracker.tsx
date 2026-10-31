import { useEffect, useState } from 'react';
import { X, Activity, Target, Flag, Circle } from 'lucide-react';
import type { MatchWithMarkets, MatchStats, MatchEvent } from '@/types';
import { supabase } from '@/lib/supabase';

type Props = {
  match: MatchWithMarkets;
  onClose: () => void;
};

export function MatchTracker({ match, onClose }: Props) {
  const [stats, setStats] = useState<MatchStats | null>(null);
  const [events, setEvents] = useState<MatchEvent[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const matchId = match.eventId;
      const [{ data: statsData }, { data: eventsData }] = await Promise.all([
        supabase.from('match_stats').select('*').eq('match_id', matchId).maybeSingle(),
        supabase.from('match_events').select('*').eq('match_id', matchId).order('minute', { ascending: true }),
      ]);
      setStats(statsData as MatchStats | null);
      setEvents((eventsData || []) as MatchEvent[]);
    };
    void loadData();
  }, [match.eventId]);

  const mockStats: MatchStats = stats || {
    match_id: match.eventId,
    home_xg: 1.4, away_xg: 0.8,
    home_possession: 58, away_possession: 42,
    home_shots: 12, away_shots: 7,
    home_shots_on_target: 5, away_shots_on_target: 3,
    home_corners: 6, away_corners: 3,
    home_fouls: 8, away_fouls: 11,
    home_cards: 1, away_cards: 2,
  };

  const mockEvents: MatchEvent[] = events.length ? events : [
    { id: '1', match_id: match.eventId, event_type: 'goal', minute: 23, description: `${match.home} gol`, home_x: 75, home_y: 45, created_at: '' },
    { id: '2', match_id: match.eventId, event_type: 'yellow_card', minute: 34, description: `${match.away} sarı kart`, home_x: 30, home_y: 55, created_at: '' },
    { id: '3', match_id: match.eventId, event_type: 'corner', minute: 41, description: `${match.home} korner`, home_x: 88, home_y: 15, created_at: '' },
    { id: '4', match_id: match.eventId, event_type: 'shot', minute: 52, description: `${match.away} şut`, home_x: 20, home_y: 40, created_at: '' },
  ];

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className="modal-card match-tracker-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}><X size={18} /></button>
        <span className="modal-kicker">MAÇ MERKEZİ</span>
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
      </div>
    </div>
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
