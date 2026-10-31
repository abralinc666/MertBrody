import { useMemo, useState } from 'react';
import { ShoppingBasket, X, Gift, TrendingUp, Settings2, Layers } from 'lucide-react';
import type { SelectedBet, BetSlipType, OddsPreference, Freebet } from '@/types';
import { playSound } from '@/hooks/useSoundFx';

type Props = {
  selectedBets: SelectedBet[];
  isCouponOpen: boolean;
  freebets: Freebet[];
  oddsPreference: OddsPreference;
  onToggleCoupon: () => void;
  onCloseCoupon: () => void;
  onRemoveBet: (index: number) => void;
  onPlaceBet: (type: BetSlipType, stake: number, freebetId: string | null) => void;
  onCashout: (slipId: string) => void;
  activeSlips: Array<{ id: string; total_odds: number; stake: number; status: string; potential_payout: number }>;
  onOddsPrefChange: (pref: OddsPreference) => void;
  balance: number;
};

function generateCombinations<T>(arr: T[], k: number): T[][] {
  if (k === 0) return [[]];
  if (k > arr.length) return [];
  if (k === arr.length) return [arr];
  const [first, ...rest] = arr;
  const withFirst = generateCombinations(rest, k - 1).map((c) => [first, ...c]);
  const withoutFirst = generateCombinations(rest, k);
  return [...withFirst, ...withoutFirst];
}

export function BetSlip({
  selectedBets, isCouponOpen, freebets, oddsPreference,
  onToggleCoupon, onCloseCoupon, onRemoveBet, onPlaceBet, onCashout, activeSlips, onOddsPrefChange, balance,
}: Props) {
  const [slipType, setSlipType] = useState<BetSlipType>('single');
  const [stake, setStake] = useState(100);
  const [useFreebet, setUseFreebet] = useState(false);
  const [selectedFreebet, setSelectedFreebet] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [systemSize, setSystemSize] = useState(2);

  const betTotal = useMemo(() => selectedBets.reduce((total, b) => total * b.odds, 1), [selectedBets]);
  const potentialPayout = useMemo(() => stake * betTotal, [stake, betTotal]);

  const systemCombinations = useMemo(() => {
    if (slipType !== 'system' || selectedBets.length < 2) return [];
    const k = Math.min(systemSize, selectedBets.length);
    return generateCombinations(selectedBets, k);
  }, [slipType, selectedBets, systemSize]);

  const systemCombinationCount = systemCombinations.length;
  const systemTotalStake = useMemo(() => stake * systemCombinationCount, [stake, systemCombinationCount]);
  const systemMaxPayout = useMemo(() => {
    if (systemCombinations.length === 0) return 0;
    const allOdds = systemCombinations.map((combo) => combo.reduce((total, b) => total * b.odds, 1));
    return Math.max(...allOdds) * stake;
  }, [systemCombinations, stake]);

  const handlePlace = () => {
    onPlaceBet(slipType, slipType === 'system' ? systemTotalStake : stake, useFreebet ? selectedFreebet : null);
  };

  const availableSystemSizes = useMemo(() => {
    const max = Math.min(selectedBets.length - 1, 8);
    return Array.from({ length: max - 1 }, (_, i) => i + 2);
  }, [selectedBets.length]);

  return (
    <section className={isCouponOpen ? 'coupon-card mobile-coupon-open' : 'coupon-card'}>
      <div className="coupon-title">
        <button className="mobile-coupon-toggle" onClick={onToggleCoupon} aria-label="Kuponu aç veya kapat"><ShoppingBasket size={18} /></button>
        <button className="mobile-coupon-close" onClick={onCloseCoupon} aria-label="Kuponu kapat"><X size={16} /></button>
        <h2><ShoppingBasket size={18} /> Kupon</h2>
        <span>{selectedBets.length}</span>
      </div>

      <div className="coupon-tabs">
        <button className={slipType === 'single' ? 'active' : ''} onClick={() => { setSlipType('single'); playSound('tab'); }}>Tekli</button>
        <button className={slipType === 'combo' ? 'active' : ''} onClick={() => { setSlipType('combo'); playSound('tab'); }}>Kombine</button>
        <button className={slipType === 'system' ? 'active' : ''} onClick={() => { setSlipType('system'); playSound('tab'); }}>Sistem</button>
      </div>

      <div className="coupon-settings-bar">
        <button className="settings-toggle" onClick={() => setShowSettings(!showSettings)}>
          <Settings2 size={14} /> Oran Ayarları
        </button>
        {showSettings && (
          <div className="odds-pref-options">
            <button className={oddsPreference === 'accept_any' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('accept_any')}>Her oranı kabul et</button>
            <button className={oddsPreference === 'accept_higher' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('accept_higher')}>Sadece yükseleni</button>
            <button className={oddsPreference === 'ask_me' ? 'pref-btn active' : 'pref-btn'} onClick={() => onOddsPrefChange('ask_me')}>Değişirse sor</button>
          </div>
        )}
      </div>

      {selectedBets.length === 0 ? (
        <div className="empty-coupon">
          <ShoppingBasket size={35} />
          <p>Kuponunuzda seçim bulunmuyor.</p>
          <small>Oranların üzerine tıklayarak<br />kuponunuza ekleyebilirsiniz.</small>
        </div>
      ) : (
        <div className="selected-bets">
          {selectedBets.map((bet, i) => (
            <div className="selected-bet" key={`${bet.eventId}-${bet.selectionLabel}`}>
              <div className="bet-info">
                <strong>{bet.selectionLabel}</strong>
                <small>{bet.homeTeam} - {bet.awayTeam}</small>
                <small className="bet-market">{bet.marketLabel}</small>
              </div>
              <div className="bet-actions">
                <span className="bet-odd">{bet.odds.toFixed(2)}</span>
                <button onClick={() => onRemoveBet(i)}><X size={13} /></button>
              </div>
            </div>
          ))}

          {slipType === 'single' && (
            <div className="total-odds">Toplam Oran <strong>{betTotal.toFixed(2)}</strong></div>
          )}

          {slipType === 'combo' && (
            <>
              <div className="total-odds">Toplam Oran <strong>{betTotal.toFixed(2)}</strong></div>
              <div className="slip-type-info">
                <TrendingUp size={14} /> Kombine: Tüm seçimler tek kuponda. Tümü doğru olmalı.
              </div>
            </>
          )}

          {slipType === 'system' && (
            <div className="system-bet-panel">
              <div className="system-header">
                <Layers size={15} /> Sistem Bahsi
              </div>
              {selectedBets.length < 2 ? (
                <p className="system-hint">Sistem bahsi için en az 2 seçim gerekli.</p>
              ) : (
                <>
                  <div className="system-size-selector">
                    <label>Sistem türü</label>
                    <div className="system-size-buttons">
                      {availableSystemSizes.map((size) => (
                        <button
                          key={size}
                          className={systemSize === size ? 'system-size-btn active' : 'system-size-btn'}
                          onClick={() => { setSystemSize(size); playSound('tab'); }}
                        >
                          {size}/{selectedBets.length}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="system-summary">
                    <div className="system-summary-row">
                      <span>Kombinasyon sayısı</span>
                      <strong>{systemCombinationCount}</strong>
                    </div>
                    <div className="system-summary-row">
                      <span>Kupon başına tutar</span>
                      <strong>{stake.toFixed(0)} ₺</strong>
                    </div>
                    <div className="system-summary-row">
                      <span>Toplam tutar</span>
                      <strong className="system-total-cost">{systemTotalStake.toFixed(0)} ₺</strong>
                    </div>
                    <div className="system-summary-row">
                      <span>Maks. kazanç</span>
                      <strong className="system-max-win">{systemMaxPayout.toFixed(2)} ₺</strong>
                    </div>
                  </div>
                  <div className="system-combination-list">
                    {systemCombinations.slice(0, 8).map((combo, idx) => (
                      <div className="system-combo-row" key={idx}>
                        <small>{idx + 1}.</small>
                        <span>{combo.map((b) => b.selectionLabel).join(' + ')}</span>
                        <b>{combo.reduce((t, b) => t * b.odds, 1).toFixed(2)}</b>
                      </div>
                    ))}
                    {systemCombinations.length > 8 && (
                      <p className="system-more">+{systemCombinations.length - 8} kombinasyon daha</p>
                    )}
                  </div>
                  <div className="slip-type-info">
                    <Layers size={14} /> {systemSize}/{selectedBets.length} sistemi: En az {systemSize} seçim doğruysa kazanırsın.
                  </div>
                </>
              )}
            </div>
          )}

          {freebets.length > 0 && (
            <label className="freebet-toggle">
              <input type="checkbox" checked={useFreebet} onChange={(e) => setUseFreebet(e.target.checked)} />
              <Gift size={14} /> Freebet kullan ({freebets.length} adet)
            </label>
          )}
          {useFreebet && freebets.length > 0 && (
            <select className="freebet-select" value={selectedFreebet || ''} onChange={(e) => setSelectedFreebet(e.target.value)}>
              <option value="">Freebet seç</option>
              {freebets.map((fb) => (
                <option key={fb.id} value={fb.id}>{Number(fb.amount).toFixed(0)} ₺ - {fb.status}</option>
              ))}
            </select>
          )}

          <div className="stake-input-row">
            <label>{slipType === 'system' ? 'Kupon Başına Tutar' : 'Bahis Tutarı'}</label>
            <div className="stake-input">
              <input type="number" value={stake} min={1} onChange={(e) => setStake(Number(e.target.value) || 0)} />
              <span>₺</span>
            </div>
          </div>
          <div className="stake-quick">
            {[50, 100, 250, 500].map((amt) => (
              <button key={amt} onClick={() => setStake(amt)}>{amt}₺</button>
            ))}
            <button onClick={() => setStake(Math.floor(slipType === 'system' ? balance / systemCombinationCount : balance))}>Max</button>
          </div>

          {slipType !== 'system' && (
            <div className="potential-payout">
              <span>Olası Kazanç</span>
              <strong>{potentialPayout.toFixed(2)} ₺</strong>
            </div>
          )}
          {slipType === 'system' && systemCombinationCount > 0 && (
            <div className="potential-payout">
              <span>Maks. Kazanç</span>
              <strong>{systemMaxPayout.toFixed(2)} ₺</strong>
            </div>
          )}
        </div>
      )}

      <button className="place-bet" onClick={handlePlace} disabled={selectedBets.length === 0 || (slipType === 'system' && selectedBets.length < 2)}>
        {selectedBets.length === 0 ? 'Bahis Yap' :
         slipType === 'system' && selectedBets.length < 2 ? 'En az 2 seçim gerekli' :
         slipType === 'system' ? `${systemTotalStake.toFixed(0)}₺ Sistem Oyna` :
         `${stake}₺ Bahis Yap`}
      </button>

      {activeSlips.length > 0 && (
        <div className="active-slips-section">
          <div className="active-slips-title"><TrendingUp size={15} /> Aktif Kuponlarım</div>
          {activeSlips.map((slip) => (
            <ActiveSlipRow key={slip.id} slip={slip} onCashout={onCashout} />
          ))}
        </div>
      )}
    </section>
  );
}

function ActiveSlipRow({ slip, onCashout }: {
  slip: { id: string; total_odds: number; stake: number; status: string; potential_payout: number };
  onCashout: (id: string) => void;
}) {
  const [cashoutOffer, setCashoutOffer] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOffer = async () => {
    setLoading(true);
    try {
      setCashoutOffer(slip.stake * slip.total_odds * 0.65);
    } catch {
      setCashoutOffer(slip.stake * slip.total_odds * 0.65);
    } finally {
      setLoading(false);
    }
  };

  if (slip.status !== 'pending') return null;

  return (
    <div className="active-slip-row">
      <div className="active-slip-info">
        <strong>Oran {Number(slip.total_odds).toFixed(2)}</strong>
        <small>{Number(slip.stake).toFixed(0)}₺ · Potansiyel: {Number(slip.potential_payout).toFixed(0)}₺</small>
      </div>
      <button className="cashout-btn" onClick={cashoutOffer ? () => onCashout(slip.id) : fetchOffer} disabled={loading}>
        {cashoutOffer ? `${cashoutOffer.toFixed(0)}₺ Bozdur` : loading ? '...' : 'Bozdur'}
      </button>
    </div>
  );
}
