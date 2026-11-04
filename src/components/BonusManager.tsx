import { useState } from 'react';
import { Gift, Ticket, CheckCircle2, XCircle } from 'lucide-react';
import type { Bonus, Freebet } from '@/types';
import { api } from '@/services/api';
import { bonusTypes } from '@/data/sports';

type Props = {
  bonuses: Bonus[];
  freebets: Freebet[];
};

type ToastType = 'success' | 'error';

function friendlyError(message: string | undefined, fallback: string): string {
  const m = message || '';
  if (m.includes('zaten alındı')) return 'Bu bonusu daha önce aldın.';
  if (m.includes('Authentication')) return 'Devam etmek için giriş yapmalısın.';
  return fallback;
}

export function BonusManager({ bonuses, freebets }: Props) {
  const [claiming, setClaiming] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [toastType, setToastType] = useState<ToastType>('success');

  const activeBonuses = bonuses.filter((b) => b.status === 'active');
  const completedBonuses = bonuses.filter((b) => b.status === 'completed');
  const freebetClaimed = freebets.some((f) => f.source === 'claim');

  const handleClaim = async (type: string, name: string) => {
    setClaiming(type);
    setMessage('');
    // Tutar ve çevrim şartı arka uçtaki bonus tanımından gelir; arayüz yalnızca türü gönderir.
    try {
      await api.claimBonus(type);
      setToastType('success');
      setMessage(`${name} hesabına eklendi!`);
    } catch (e) {
      setToastType('error');
      setMessage(friendlyError((e as Error).message, 'Bonus alınamadı. Lütfen tekrar dene.'));
    }
    setClaiming(null);
  };

  const handleFreebet = async () => {
    setClaiming('freebet');
    try {
      await api.claimFreebet();
      setToastType('success');
      setMessage('100 ₺ freebet hesabına eklendi!');
    } catch (e) {
      setToastType('error');
      setMessage(friendlyError((e as Error).message, 'Freebet alınamadı. Lütfen tekrar dene.'));
    }
    setClaiming(null);
  };

  return (
    <div className="bonus-manager-content">
      <div className="modal-icon"><Gift size={24} /></div>
      <span className="modal-kicker">BONUS & FREEBET</span>
      <h2>Promosyon Merkezi</h2>
      <p className="modal-description">Bonuslarını talep et, çevrim şartlarını takip et ve freebetlerini kullan.</p>

      {message && (
        <div className={`bonus-toast ${toastType === 'error' ? 'toast-error' : 'toast-success'}`} role="status">
          {toastType === 'error' ? <XCircle size={16} /> : <CheckCircle2 size={16} />} <span>{message}</span>
        </div>
      )}

      <div className="freebet-summary">
        <div className="freebet-count">
          <Ticket size={20} />
          <div><strong>{freebets.filter((f) => f.status === 'available').length}</strong><span>Aktif Freebet</span></div>
        </div>
        <button type="button" className="claim-freebet-btn" onClick={handleFreebet} disabled={freebetClaimed || claiming === 'freebet'}>
          <Gift size={15} /> {freebetClaimed ? 'Freebet alındı' : '100₺ Freebet Al'}
        </button>
      </div>

      <h3 className="bonus-section-title">Aktif Bonusların</h3>
      {activeBonuses.length === 0 ? (
        <p className="empty-message">Henüz aktif bonusun yok.</p>
      ) : (
        <div className="active-bonuses">
          {activeBonuses.map((bonus) => {
            const target = Number(bonus.wagering_requirement) * Number(bonus.amount);
            const progressPct = target > 0 ? Math.min(100, (Number(bonus.wagering_progress) / target) * 100) : 0;
            return (
              <div className="active-bonus-card" key={bonus.id}>
                <div className="bonus-card-header">
                  <strong>{bonus.name}</strong>
                  <span className="bonus-amount">{Number(bonus.amount).toFixed(0)} ₺</span>
                </div>
                <div className="wagering-progress">
                  <div className="wagering-track"><div className="wagering-fill" style={{ width: `${progressPct}%` }} /></div>
                  <small>Çevrim: {Number(bonus.wagering_progress).toFixed(0)} / {target.toFixed(0)} ₺</small>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <h3 className="bonus-section-title">Talep Edebileceğin Bonuslar</h3>
      <div className="available-bonuses">
        {bonusTypes.map((bonus) => {
          const alreadyClaimed = bonuses.some((b) => b.type === bonus.type);
          return (
            <div className="available-bonus-card" key={bonus.type}>
              <div className="bonus-icon">{bonus.icon}</div>
              <div className="bonus-info">
                <strong>{bonus.name}</strong>
                <small>{bonus.amount}₺ · {bonus.wagering}x çevrim</small>
              </div>
              <button
                type="button"
                className={alreadyClaimed ? 'claim-btn claimed' : 'claim-btn'}
                disabled={alreadyClaimed || claiming === bonus.type}
                onClick={() => void handleClaim(bonus.type, bonus.name)}
              >
                {alreadyClaimed ? 'Alındı' : claiming === bonus.type ? '...' : 'Talep Et'}
              </button>
            </div>
          );
        })}
      </div>

      {completedBonuses.length > 0 && (
        <>
          <h3 className="bonus-section-title">Tamamlanan Bonuslar</h3>
          <div className="completed-bonuses">
            {completedBonuses.map((bonus) => (
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
