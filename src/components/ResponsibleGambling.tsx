import { useEffect, useState } from 'react';
import { Shield, AlertTriangle, Lock } from 'lucide-react';
import type { ResponsibleLimit } from '@/types';

type Props = {
  limits: ResponsibleLimit | null;
};

export function ResponsibleGambling({ limits }: Props) {
  const [dailyDeposit, setDailyDeposit] = useState('');
  const [weeklyDeposit, setWeeklyDeposit] = useState('');
  const [dailyLoss, setDailyLoss] = useState('');
  const [excludeDays, setExcludeDays] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (limits) {
      setDailyDeposit(limits.daily_deposit_limit?.toString() || '');
      setWeeklyDeposit(limits.weekly_deposit_limit?.toString() || '');
      setDailyLoss(limits.daily_loss_limit?.toString() || '');
    }
  }, [limits]);

  const handleSave = async () => {
    setSaving(true);
    setMessage('Bu ayarlar şu anda yalnızca önizleme amaçlıdır; backend daha sonra bağlanacak.');
    setSaving(false);
  };

  const isExcluded = limits?.self_excluded_until && new Date(limits.self_excluded_until) > new Date();

  return (
    <>
      <div className="modal-icon"><Shield size={24} /></div>
      <span className="modal-kicker">SORUMLU OYUN</span>
      <h2>Limitlerini Belirle</h2>
      <p className="modal-description">Kendini korumak için günlük ve haftalık limitler koyabilir, hesabını geçici olarak dondurabilirsin.</p>

      {isExcluded && (
        <div className="exclusion-banner">
          <Lock size={16} /> Hesabın {new Date(limits!.self_excluded_until!).toLocaleDateString('tr-TR')} tarihine kadar donduruldu.
        </div>
      )}

      <div className="limits-form">
        <label>
          Günlük Yatırım Limiti (₺)
          <input type="number" value={dailyDeposit} onChange={(e) => setDailyDeposit(e.target.value)} placeholder="Örn: 500" />
        </label>
        <label>
          Haftalık Yatırım Limiti (₺)
          <input type="number" value={weeklyDeposit} onChange={(e) => setWeeklyDeposit(e.target.value)} placeholder="Örn: 2000" />
        </label>
        <label>
          Günlük Kayıp Limiti (₺)
          <input type="number" value={dailyLoss} onChange={(e) => setDailyLoss(e.target.value)} placeholder="Örn: 300" />
        </label>
        <label>
          Hesap Dondurma (Gün)
          <input type="number" value={excludeDays} onChange={(e) => setExcludeDays(e.target.value)} placeholder="Örn: 7" />
          <small>Hesabını belirtilen gün sayısı kadar dondurur. Bu süre boyunca bahis oynayamazsın.</small>
        </label>
      </div>

      {message && <p className="limit-message">{message}</p>}

      <button className="modal-primary" onClick={handleSave} disabled={saving}>
        {saving ? 'Kaydediliyor...' : 'Limitleri Kaydet'}
      </button>

      <div className="responsible-warning">
        <AlertTriangle size={14} />
        <span>18+ Sorumlu oynayın. Bahis bağımlılık yapabilir. Yardım için: 190.</span>
      </div>
    </>
  );
}
