import { ShoppingBasket } from 'lucide-react';

type Props = {
  count: number;
  onClick: () => void;
};

export function CouponFab({ count, onClick }: Props) {
  return (
    <button type="button" className="mobile-coupon-fab" aria-label="Kuponu aç" onClick={onClick}>
      <ShoppingBasket size={22} />
      {count > 0 && <span className="fab-badge">{count}</span>}
    </button>
  );
}
