import { useEffect, useMemo, useState } from 'react';
import { ShoppingBasket, X, Gift, TrendingUp, Settings2, Layers } from 'lucide-react';
import type { SelectedBet, BetSlipType, OddsPreference, Freebet } from '@/types';
import { playSound } from '@/hooks/useSoundFx';

export type ActiveSlip = { id: string; total_odds: number; stake: number; status: string; potential_payout: number; cashoutable: boolean };

type Props = {
  selectedBets: SelectedBet[];
  isCouponOpen: boolean;
  freebets: Freebet[];
  oddsPreference: OddsPreference;
  placing: boolean;
  signedIn: boolean;
  onToggleCoupon: () => void;
  onCloseCoupon: () => void;
  onRemoveBet: (index: number) => void;
  onPlaceBet: (type: BetSlipType, stake: number, freebetId: string | null, systemSize: number | null) => void;
  onRequestCashoutOffer: (slipId: string) => Promise<number | null>;
  onCashout: (slipId: string, offer: number) => void;
  activeSlips: ActiveSlip[];
  onOddsPrefChange: (pref: OddsPreference) => void;
  balance: number;
};

const BET_DELAY_SECONDS = 3;

function combinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > arr.length) return [];
  if (k === arr.length) return [arr];
  const [first, ...rest] = arr;
  return [...combinations(rest, k - 1).map((c) => [first, ...c]), ...combinations(rest, k)];
}

const money = (n: number) => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function BetSlip({
  selectedBets, isCouponOpen, freebets, oddsPreference, placing, signedIn,
  onToggleCoupon, onCloseCoupon, onRemoveBet, onPlaceBet, onRequestCashoutOffer, onCashout, activeSlips, onOddsPrefChange, balance,
}: Props) {
  const [slipType, setSlipType] = useState<BetSlipType>('single');
  const [stakeText, setStakeText] = useState('100');
  const [useFreebet, setUseFreebet] = useState(false);
  const [selectedFreebet, setSelectedFreebet] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [systemSize, setSystemSize] = useState(2);
  const [countdown, setCountdown] = useState<number | null>(null);

  const n = selectedBets.length;
  const stake = Math.max(0, Math.round((Number(stakeText) || 0) * 100) / 100);

  // Tekli kuponda her seçim ayrı kupon olur; seçim 1'e düşünce bile tür korunur.
  const comboOdds = useMemo(() => selectedBets.reduce((t, b) => t * b.odds, 1), [selectedBets]);

  const sizes = useMemo(() => Array.from({ length: Math.max(0, Math.min(n - 1, 8) - 1) }, (_, i) => i + 2), [n]);
  const effectiveSize = sizes.includes(systemSize) ? systemSize : sizes[0] ?? 2;

  const systemCombos = useMemo(() => (slipType === 'system' && n >= 3 ? combinations(selectedBets, effectiveSize) : []), [slipType, selectedBets, effectiveSize, n]);
  const comboCount = systemCombos.length;
  const systemMaxPayout = useMemo(() => systemCombos.reduce((sum, c) => sum + c.reduce((t, b) => t * b.odds, 1) * stake, 0), [systemCombos, stake]);

  const freebetAllowed = slipType === 'combo' || (slipType === 'single' && n === 1);
  const freebetOn = useFreebet && freebetAllowed && freebets.length > 0;

  let totalStake = stake;
  let potential = stake * comboOdds;
  if (slipType === 'single') { totalStake = stake * n; potential = selectedBets.reduce((s, b) => s + stake * b.odds, 0); }
  if (slipType === 'system') { totalStake = stake * comboCount; potential = systemMaxPayout; }
  if (freebetOn) { totalStake = 0; potential = stake * (comboOdds - 1); }

  const invalid =
    n === 0 || stake < 1 ||
    (slipType === 'combo' && n < 2) ||
    (slipType === 'system' && (n < 3 || comboCount === 0)) ||
    (freebetOn && !selectedFreebet);
  const insufficient = signedIn && !freebetOn && totalStake > balance;

  // Canlı bahis güvenlik beklemesi: seçim anında değil, bahis onaylanırken uygulanır.
  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      onPlaceBet(slipType, stake, freebetOn ? selectedFreebet : null, slipType === 'system' ? effectiveSize : null);
      return;
    }
    const t = window.setTimeout(() => setCountdown((c) => (c === null ? null : c - 1)), 1000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // Seçimler değişirse bekleyen onay iptal edilir (yanlış kupon gönderilmesin)
  useEffect(() => { setCountdown(null); }, [selectedBets, slipType, stakeText]);

  const startPlace = () => {
    if (!signedIn) { onPlaceBet(slipType, stake, null, null); return; }
    setCountdown(BET_DELAY_SECONDS);
  };

  const setType = (t: BetSlipType) => { setSlipType(t); playSound('tab'); };

  const buttonLabel =
    placing ? 'Kupon kaydediliyor...' :
    countdown !== null ? `Onaylanıyor... ${countdown}` :
    n === 0 ? 'Bahis Yap' :
    slipType === 'combo' && n < 2 ? 'Kombine için en az 2 seçim' :
    slipType === 'system' && n < 3 ? 'Sistem için en az 3 seçim' :
    !signedIn ? 'Giriş yap ve oyna' :
    insufficient ? 'Yetersiz bakiye' :
    freebetOn ? 'Freebet ile oyna' :
    `${money(totalStake)} ₺ ${slipType === 'system' ? 'Sistem Oyna' : 'Bahis Yap'}`;

  return (
    <section className={isCouponOpen ? 'coupon-card mobile-coupon-open' : 'coupon-card'} aria-label="Kupon">
      <div className="coupon-title">
        <button type="button" className="mobile-coupon-toggle" onClick={onToggleCoupon} aria-label="Kuponu aç veya kapat"><ShoppingBasket size={18} /></button>
        <h2><ShoppingBasket size={18} /> Kupon <span className="coupon-count">{n}</span></h2>
        <button type="button" className="mobile-coupon-close" onClick={onCloseCoupon} aria-label="Kuponu kapat"><X size={18} /></button>
      </div>

      <div className="coupon-tabs" role="tablist">
        {([['single', 'Tekli'], ['combo', 'Kombine'], ['system', 'Sistem']] as const).map(([t, label]) => (
          <button key={t} type="button" role="tab" aria-selected={slipType === t} className={slipType === t ? 'active' : ''} onClick={() => setType(t)}>{label}</button>
        ))}
      </div>

      <div className="coupon-settings-bar">
        <button type="button" className="settings-toggle" onClick={() => setShowSettings(!showSettings)} aria-expanded={showSettings}>
          <Settings2 size={14} /> Oran Ayarları
        </button>
        {showSettings && (
          <div className="odds-pref-options">
            <button type="button" className={oddsPreference === 'accept_any' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('accept_any')}>Her oranı kabul et</button>
            <button type="button" className={oddsPreference === 'accept_higher' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('accept_higher')}>Sadece yükseleni</button>
            <button type="button" className={oddsPreference === 'ask_me' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('ask_me')}>Değişirse sor</button>
          </div>
        )}
      </div>

      {n === 0 ? (
        <div className="empty-coupon">
          <ShoppingBasket size={35} />
          <p>Kuponunda seçim bulunmuyor.</p>
          <small>Oranların üzerine tıklayarak kuponuna ekleyebilirsin.</small>
        </div>
      ) : (
        <div className="selected-bets">
          {selectedBets.map((bet, i) => (
            <div className="selected-bet" key={`${bet.eventId}-${bet.marketType}-${bet.selectionLabel}`}>
              <div className="bet-info">
                <strong>{bet.selectionLabel}</strong>
                <small>{bet.homeTeam} - {bet.awayTeam}</small>
                <small className="bet-market">{bet.marketLabel}</small>
              </div>
              <div className="bet-actions">
                <span className="bet-odd">{bet.odds.toFixed(2)}</span>
                <button type="button" onClick={() => onRemoveBet(i)} aria-label={`${bet.selectionLabel} seçimini kaldır`}><X size={14} /></button>
              </div>
            </div>
          ))}

          {slipType === 'single' && (
            <div className="slip-type-info"><TrendingUp size={14} /> <span>Tekli: her seçim ayrı bir kupon olarak oynanır{n > 1 ? ` (${n} kupon)` : ''}.</span></div>
          )}
          {slipType === 'combo' && (
            <>
              <div className="total-odds"><span>Toplam Oran</span> <strong>{comboOdds.toFixed(2)}</strong></div>
              <div className="slip-type-info"><TrendingUp size={14} /> <span>Kombine: tüm seçimler tek kuponda. Tümü doğru olmalı.</span></div>
            </>
          )}

          {slipType === 'system' && (
            <div className="system-bet-panel">
              <div className="system-header"><Layers size={15} /> Sistem Bahsi</div>
              {n < 3 ? (
                <p className="system-hint">Sistem bahsi için en az 3 seçim gerekli.</p>
              ) : (
                <>
                  <div className="system-size-selector">
                    <span className="system-label">Sistem türü</span>
                    <div className="system-size-buttons">
                      {sizes.map((size) => (
                        <button key={size} type="button" className={effectiveSize === size ? 'system-size-btn active' : 'system-size-btn'} onClick={() => { setSystemSize(size); playSound('tab'); }}>
                          {size}/{n}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="system-summary">
                    <div className="system-summary-row"><span>Kombinasyon sayısı</span><strong>{comboCount}</strong></div>
                    <div className="system-summary-row"><span>Kombinasyon başına tutar</span><strong>{money(stake)} ₺</strong></div>
                    <div className="system-summary-row"><span>Toplam tutar</span><strong className="system-total-cost">{money(totalStake)} ₺</strong></div>
                    <div className="system-summary-row"><span>Maks. kazanç</span><strong className="system-max-win">{money(systemMaxPayout)} ₺</strong></div>
                  </div>
                  <div className="system-combination-list">
                    {systemCombos.slice(0, 8).map((combo, idx) => (
                      <div className="system-combo-row" key={idx}>
                        <small>{idx + 1}.</small>
                        <span>{combo.map((b) => b.selectionLabel).join(' + ')}</span>
                        <b>{combo.reduce((t, b) => t * b.odds, 1).toFixed(2)}</b>
                      </div>
                    ))}
                    {comboCount > 8 && <p className="system-more">+{comboCount - 8} kombinasyon daha</p>}
                  </div>
                  <div className="slip-type-info"><Layers size={14} /> <span>{effectiveSize}/{n} sistemi: en az {effectiveSize} seçim doğruysa kazanırsın.</span></div>
                </>
              )}
            </div>
          )}

          {freebets.length > 0 && (
            <label className={`freebet-toggle ${freebetAllowed ? '' : 'disabled'}`}>
              <input type="checkbox" checked={freebetOn} disabled={!freebetAllowed} onChange={(e) => setUseFreebet(e.target.checked)} />
              <Gift size={14} /> <span>Freebet kullan ({freebets.length} adet){!freebetAllowed && ' · bu kuponda kullanılamaz'}</span>
            </label>
          )}
          {freebetOn && (
            <select className="freebet-select" value={selectedFreebet} onChange={(e) => setSelectedFreebet(e.target.value)} aria-label="Freebet seç">
              <option value="">Freebet seç</option>
              {freebets.map((fb) => <option key={fb.id} value={fb.id}>{Number(fb.amount).toFixed(0)} ₺</option>)}
            </select>
          )}

          <div className="stake-input-row">
            <label htmlFor="stake-input">{slipType === 'system' ? 'Kombinasyon Başına Tutar' : slipType === 'single' && n > 1 ? 'Kupon Başına Tutar' : 'Bahis Tutarı'}</label>
            <div className="stake-input">
              <input id="stake-input" type="number" inputMode="decimal" value={stakeText} min={1} step="any" onChange={(e) => setStakeText(e.target.value)} />
              <span>₺</span>
            </div>
          </div>
          <div className="stake-quick">
            {[50, 100, 250, 500].map((amt) => <button key={amt} type="button" onClick={() => setStakeText(String(amt))}>{amt}₺</button>)}
            <button type="button" onClick={() => {
              const mult = slipType === 'system' ? Math.max(1, comboCount) : slipType === 'single' ? Math.max(1, n) : 1;
              setStakeText(String(Math.max(0, Math.floor(balance / mult))));
            }}>Max</button>
          </div>

          <div className="potential-payout">
            <span>{slipType === 'system' ? 'Maks. Kazanç' : 'Olası Kazanç'}</span>
            <strong>{money(potential)} ₺</strong>
          </div>
        </div>
      )}

      <div className="place-bet-row">
        <button type="button" className="place-bet" onClick={startPlace} disabled={invalid || placing || countdown !== null || insufficient}>
          {buttonLabel}
        </button>
        {countdown !== null && <button type="button" className="cancel-bet" onClick={() => setCountdown(null)}>İptal</button>}
      </div>

      {activeSlips.length > 0 && (
        <div className="active-slips-section">
          <div className="active-slips-title"><TrendingUp size={15} /> Aktif Kuponlarım</div>
          {activeSlips.map((slip) => <ActiveSlipRow key={slip.id} slip={slip} onRequestOffer={onRequestCashoutOffer} onCashout={onCashout} />)}
        </div>
      )}
    </section>
  );
}

function ActiveSlipRow({ slip, onRequestOffer, onCashout }: {
  slip: ActiveSlip;
  onRequestOffer: (id: string) => Promise<number | null>;
  onCashout: (id: string, offer: number) => void;
}) {
  const [offer, setOffer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOffer = async () => {
    setLoading(true);
    // Teklif sunucudan alınır; bozdurma sırasında sunucu aynı teklifi yeniden doğrular.
    setOffer(await onRequestOffer(slip.id));
    setLoading(false);
  };

  return (
    <div className="active-slip-row">
      <div className="active-slip-info">
        <strong>Oran {Number(slip.total_odds).toFixed(2)}</strong>
        <small>{Number(slip.stake).toFixed(0)}₺ · Potansiyel: {Number(slip.potential_payout).toFixed(0)}₺</small>
      </div>
      {slip.cashoutable ? (
        <button type="button" className="cashout-btn" disabled={loading}
          onClick={offer ? () => { onCashout(slip.id, offer); setOffer(null); } : () => void fetchOffer()}>
          {offer ? `${offer.toFixed(0)}₺ Bozdur` : loading ? '...' : 'Teklif Al'}
        </button>
      ) : <small className="cashout-na">Bozdurulamaz</small>}
    </div>
  );
}
