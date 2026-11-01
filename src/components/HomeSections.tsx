import { ArrowRight, Star } from 'lucide-react';
import { games } from '@/data/sports';

type TileProps = { onSports: () => void; onCasino: () => void; onInfo: (title: string) => void };

export function CategoryTiles({ onSports, onCasino, onInfo }: TileProps) {
  const tiles = [
    { icon: '⚽', title: 'Spor Bahisleri', text: "%100'e varan hoş geldin bonusu!", action: onSports },
    { icon: '🎰', title: 'Slot Oyunları', text: 'Binlerce oyun seni bekliyor!', action: onCasino },
    { icon: '🎲', title: 'Casino', text: 'Canlı casino heyecanı!', action: onCasino },
    { icon: '🎥', title: 'Canlı Casino', text: 'Gerçek krupiyelerle canlı deneyim!', action: onCasino },
    { icon: '🃏', title: 'Poker', text: 'Stratejini konuştur!', action: () => onInfo('Poker') },
  ];
  return (
    <section className="category-section" aria-label="Kategoriler">
      <div className="category-row">
        {tiles.map((t) => (
          <button type="button" key={t.title} className="category-tile" onClick={t.action}>
            <span className="category-icon" aria-hidden>{t.icon}</span>
            <span className="category-text"><strong>{t.title}</strong><small>{t.text}</small></span>
            <span className="category-go" aria-hidden><ArrowRight size={15} /></span>
          </button>
        ))}
      </div>
    </section>
  );
}

export function PopularGames({ onOpen }: { onOpen: (name: string) => void }) {
  return (
    <section id="casino" aria-label="Popüler oyunlar">
      <div className="section-head">
        <h2><Star size={20} /> Popüler Oyunlar</h2>
        <button type="button" onClick={() => onOpen('Tüm Oyunlar')}>Tüm Oyunlar <ArrowRight size={14} /></button>
      </div>
      <div className="popular-row">
        {games.map((g) => (
          <button type="button" key={g.name} className="popular-tile" style={{ backgroundImage: g.gradient }} onClick={() => onOpen(g.name)}>
            <span className="popular-art" aria-hidden>{g.icon}</span>
            <span className="popular-name">{g.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
