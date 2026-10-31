import { useState } from 'react';
import { Gift, Ticket, CheckCircle2, XCircle } from 'lucide-react';
import type { Bonus, Freebet } from '@/types';
import { bonusTypes } from '@/data/sports';

type Props = {
  bonuses: Bonus[];
  freebets: Freebet[];
  onRefresh: () => void;
};

type ToastType = 'success' | 'error';

export function BonusManager({ bonuses, freebets, onRefresh }: Props) {
  const [claiming, setClaiming] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const handleClaim = async (_type: string, name: string, _amount: number, _wagering: number) => {
    setClaiming(_type);
    setToastType('error');
    setMessage(`${name}: Bu işlem tasarım önizlemesinde kullanılamaz.`);
    setClaiming(null);
  };

  const handleFreebet = async () => {
    setToastType('error');
    setMessage('Freebet talebi için backend bağlantısı daha sonra eklenecek.');
  };

  return (
    <div className="bonus-manager-content">
      <div className="modal-icon"><Gift size={24} /></div>
      <span className="modal-kicker">BONUS & FREEBET</span>
      <h2>Promosyon Merkezi</h2>
      <p className="modal-description">Bonuslarını talep et, çevrim şartlarını takip et ve freebetlerini kullan.</p>

      {message && (
        <div className={`bonus-toast ${toastType === 'error' ? 'toast-error' : 'toast-success'}`}>
          {toastType === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />} {message}
        </div>
      )}

      <div className="freebet-summary">
        <div className="freebet-count">
          <Ticket size={20} />
          <div><strong>{freebets.filter((f) => f.status === 'available').length}</strong><span>Aktif Freebet</span></div>
        </div>
        <button className="claim-freebet-btn" onClick={handleFreebet}>
          <Gift size={15} /> 100₺ Freebet Al
        </button>
      </div>

      <h3 className="bonus-section-title">Aktif Bonusların</h3>
      {bonuses.filter((b) => b.status === 'active').length === 0 ? (
        <p className="empty-message">Henüz aktif bonusun yok.</p>
      ) : (
        <div className="active-bonuses">
          {bonuses.filter((b) => b.status === 'active').map((bonus) => {
            const progressPct = Math.min(100, (Number(bonus.wagering_progress) / (Number(bonus.wagering_requirement) * Number(bonus.amount))) * 100);
            return (
              <div className="active-bonus-card" key={bonus.id}>
                <div className="bonus-card-header">
                  <strong>{bonus.name}</strong>
                  <span className="bonus-amount">{Number(bonus.amount).toFixed(0)} ₺</span>
                </div>
                <div className="wagering-progress">
                  <div className="wagering-track">
                    <div className="wagering-fill" style={{ width: `${progressPct}%` }} />
                  </div>
                  <small>Çevrim: {Number(bonus.wagering_progress).toFixed(0)} / {(Number(bonus.wagering_requirement) * Number(bonus.amount)).toFixed(0)} ₺</small>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="bonus-section-title">Talep Edebileceğin Bonuslar</h3>
      <div className="available-bonuses">
        {bonusTypes.map((bonus) => {
          const alreadyClaimed = bonuses.some((b) => b.type === bonus.type && b.status === 'active');
          return (
            <div className="available-bonus-card" key={bonus.type}>
              <div className="bonus-icon">{bonus.icon}</div>
              <div className="bonus-info">
                <strong>{bonus.name}</strong>
                <small>{bonus.amount}₺ · {bonus.wagering}x çevrim</small>
              </div>
              <button
                className={alreadyClaimed ? 'claim-btn claimed' : 'claim-btn'}
                disabled={alreadyClaimed || claiming === bonus.type}
                onClick={() => handleClaim(bonus.type, bonus.name, bonus.amount, bonus.wagering)}
              >
                {alreadyClaimed ? 'Alındı' : claiming === bonus.type ? '...' : 'Talep Et'}
              </button>
            </div>
          );
        })}
      </div>

      {bonuses.filter((b) => b.status === 'completed').length > 0 && (
        <>
          <h3 className="bonus-section-title">Tamamlanan Bonuslar</h3>
          <div className="completed-bonuses">
            {bonuses.filter((b) => b.status === 'completed').map((bonus) => (
              <div className="completed-bonus" key={bonus.id}>
                <CheckCircle2 size={15} />
                <strong>{bonus.name}</strong>
                <small>{Number(bonus.amount).toFixed(0)}₺</small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
