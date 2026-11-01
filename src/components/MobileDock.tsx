import { Gift, Info, MessageCircle, ShoppingBasket, WalletCards } from 'lucide-react';

type Props = {
  sessionEmail: string | null;
  onPromotions: () => void;
  onBetting: () => void;
  onAccount: () => void;
  onSupport: () => void;
};

export function MobileDock({ sessionEmail, onPromotions, onBetting, onAccount, onSupport }: Props) {
  return (
    <nav className="mobile-dock" aria-label="Mobil menü">
      <button type="button" onClick={onPromotions}><Gift size={18} /><span>Promosyon</span></button>
      <button type="button" onClick={onBetting}><ShoppingBasket size={18} /><span>Bahis</span></button>
      <button type="button" className="dock-center" onClick={onAccount}>
        <span><WalletCards size={21} /></span>
        <small>{sessionEmail ? 'Profilim' : 'Cüzdan'}</small>
      </button>
      <button type="button" onClick={onSupport}><MessageCircle size={18} /><span>Destek</span></button>
      <button type="button" onClick={onSupport}><Info size={18} /><span>Hakkımızda</span></button>
    </nav>
  );
}
