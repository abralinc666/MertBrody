import { Dices, Gamepad2, Gift, Headphones, Home, PlayCircle, Spade, Ticket, Trophy, Video, ArrowRight } from 'lucide-react';
import type { ComponentType } from 'react';
import { Brand } from '@/components/Brand';

export type NavEntry = { label: string; icon: ComponentType<{ size?: number }>; badge?: string };

export const SIDE_NAV: NavEntry[] = [
  { label: 'Ana Sayfa', icon: Home },
  { label: 'Spor Bahisleri', icon: Trophy },
  { label: 'Canlı Bahis', icon: PlayCircle, badge: 'CANLI' },
  { label: 'Casino', icon: Dices },
  { label: 'Canlı Casino', icon: Video },
  { label: 'Slot Oyunları', icon: Gamepad2 },
  { label: 'Poker', icon: Spade },
  { label: 'Tombala', icon: Ticket },
  { label: 'Promosyonlar', icon: Gift },
  { label: 'Yardım', icon: Headphones },
];

export function NavLinks({ active, onNavigate }: { active: string; onNavigate: (label: string) => void }) {
  return (
    <>
      {SIDE_NAV.map(({ label, icon: Icon, badge }) => (
        <button type="button" key={label} className={active === label ? 'nav-link active' : 'nav-link'} aria-current={active === label ? 'page' : undefined} onClick={() => onNavigate(label)}>
          <Icon size={20} /> <span>{label}</span>
          {badge && <span className="nav-badge">{badge}</span>}
        </button>
      ))}
    </>
  );
}

export function SideNav({ active, onNavigate, onPromo }: { active: string; onNavigate: (label: string) => void; onPromo: () => void }) {
  return (
    <aside className="side-nav" aria-label="Site menüsü">
      <Brand />
      <nav className="nav-list" aria-label="Ana menü"><NavLinks active={active} onNavigate={onNavigate} /></nav>
      <div className="side-promo">
        <strong>Her yatırıma özel bonus!</strong>
        <button type="button" className="promo-btn" onClick={onPromo}>DETAYLAR <ArrowRight size={13} /></button>
      </div>
    </aside>
  );
}
