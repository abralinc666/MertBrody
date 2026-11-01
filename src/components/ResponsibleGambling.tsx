import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import type { ResponsibleLimit } from '@/types';
import { api } from '@/services/api';

type Props = {
  limits: ResponsibleLimit | null;
  signedIn: boolean;
};

const toNumber = (v: string): number | null => {
  if (v.trim() === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export function ResponsibleGambling({ limits, signedIn }: Props) {
  const [dailyDeposit, setDailyDeposit] = useState('');
  const [weeklyDeposit, setWeeklyDeposit] = useState('');
  const [dailyLoss, setDailyLoss] = useState('');
  const [excludeDays, setExcludeDays] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  useEffect(() => {
    if (limits) {
      setDailyDeposit(limits.daily_deposit_limit?.toString() || '');
      setWeeklyDeposit(limits.weekly_deposit_limit?.toString() || '');
      setDailyLoss(limits.daily_loss_limit?.toString() || '');
    }
  }, [limits]);

  const handleSave = async () => {
    const values = [toNumber(dailyDeposit), toNumber(weeklyDeposit), toNumber(dailyLoss), toNumber(excludeDays)];
    if (values.some((v) => v !== null && (Number.isNaN(v) || v <= 0))) {
      setMessage({ text: 'Değerler sıfırdan büyük sayı olmalı.', ok: false });
      return;
    }
    const days = values[3];
    if (days !== null && !window.confirm(`Hesabın ${days} gün boyunca dondurulacak ve bu süre içinde bahis oynayamayacaksın. Bu işlem geri alınamaz. Onaylıyor musun?`)) return;

    setSaving(true);
    setMessage(null);
    try {
      await api.setLimits({ dailyDeposit: values[0], weeklyDeposit: values[1], dailyLoss: values[2], excludeDays: days !== null ? Math.floor(days) : null });
      setMessage({ text: 'Limitlerin başarıyla kaydedildi.', ok: true });
      setExcludeDays('');
    } catch {
      setMessage({ text: 'Limitler kaydedilemedi. Lütfen tekrar dene.', ok: false });
    }
    setSaving(false);
  };

  const isExcluded = Boolean(limits?.self_excluded_until && new Date(limits.self_excluded_until) > new Date());

  return (
    <>
      <div className="modal-icon"><Shield size={24} /></div>
      <span className="modal-kicker">SORUMLU OYUN</span>
      <h2>Limitlerini Belirle</h2>
      <p className="modal-description">Kendini korumak için günlük ve haftalık limitler koyabilir, hesabını geçici olarak dondurabilirsin.</p>

      {!signedIn ? (
        <p className="empty-message">Limit belirlemek için önce giriş yapmalısın.</p>
      ) : (
        <>
          {isExcluded && (
            <div className="exclusion-banner">
              <Lock size={16} /> <span>Hesabın {new Date(limits!.self_excluded_until!).toLocaleDateString('tr-TR')} tarihine kadar donduruldu.</span>
            </div>
          )}

          <div className="limits-form">
            <label>Günlük Yatırım Limiti (₺)
              <input type="number" min={1} inputMode="decimal" value={dailyDeposit} onChange={(e) => setDailyDeposit(e.target.value)} placeholder="Örn: 500" />
            </label>
            <label>Haftalık Yatırım Limiti (₺)
              <input type="number" min={1} inputMode="decimal" value={weeklyDeposit} onChange={(e) => setWeeklyDeposit(e.target.value)} placeholder="Örn: 2000" />
            </label>
            <label>Günlük Bahis (Kayıp) Limiti (₺)
              <input type="number" min={1} inputMode="decimal" value={dailyLoss} onChange={(e) => setDailyLoss(e.target.value)} placeholder="Örn: 300" />
              <small>Bir günde oynayabileceğin toplam bahis tutarını sınırlar.</small>
            </label>
            <label>Hesap Dondurma (Gün)
              <input type="number" min={1} max={3650} inputMode="numeric" value={excludeDays} onChange={(e) => setExcludeDays(e.target.value)} placeholder="Örn: 7" />
              <small>Hesabını belirtilen gün sayısı kadar dondurur. Bu süre boyunca bahis oynayamazsın. Süre kısaltılamaz.</small>
            </label>
          </div>

          {message && <p className={message.ok ? 'limit-message' : 'auth-error'} role="status">{message.text}</p>}

          <button type="button" className="modal-primary" onClick={() => void handleSave()} disabled={saving}>
            {saving ? 'Kaydediliyor...' : 'Limitleri Kaydet'}
          </button>
        </>
      )}

      <div className="responsible-warning">
        <AlertTriangle size={14} />
        <span>18+ Sorumlu oynayın. Bahis bağımlılık yapabilir. Kontrolü kaybettiğini düşünüyorsan bir uzmandan veya bağımlılık danışma hizmetlerinden destek al.</span>
      </div>
    </>
  );
}
