import { useState } from 'react';
import { ArrowDownLeft, ArrowUpRight, Gift, Wallet } from 'lucide-react';
import { api } from '@/services/api';
import type { Transaction } from '@/types';

type Props = {
  transactions: Transaction[];
  balance: number;
};

export function WalletView({ transactions, balance }: Props) {
  const [amount, setAmount] = useState('250');
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [busy, setBusy] = useState(false);

  const deposit = async () => {
    setBusy(true); setMsg(null);
    try {
      await api.deposit(Number(amount));
      setMsg({ text: `${Number(amount).toFixed(2)} ₺ demo bakiye eklendi.`, ok: true });
    } catch (e) {
      setMsg({ text: (e as Error).message, ok: false });
    }
    setBusy(false);
  };

  const typeIcons: Record<string, typeof Wallet> = {
    deposit: ArrowDownLeft,
    withdrawal: ArrowUpRight,
    bet_stake: ArrowUpRight,
    bet_win: ArrowDownLeft,
    cashout: ArrowDownLeft,
    bonus_credit: Gift,
    freebet_credit: Gift,
    freebet_stake: ArrowUpRight,
    loss_refund: ArrowDownLeft,
  };

  const typeLabels: Record<string, string> = {
    deposit: 'Para Yatırma',
    withdrawal: 'Para Çekme',
    bet_stake: 'Bahis Tutarı',
    bet_win: 'Bahis Kazancı',
    cashout: 'Erken Bozdurma',
    bonus_credit: 'Bonus Kredisi',
    freebet_credit: 'Freebet Kredisi',
    freebet_stake: 'Freebet Kullanımı',
    loss_refund: 'Kayıp İadesi',
  };

  return (
    <>
      <div className="modal-icon"><Wallet size={24} /></div>
      <span className="modal-kicker">CÜZDAN & İŞLEMLER</span>
      <h2>Finansal Geçmiş</h2>
      <div className="account-balance">
        <strong>{Number(balance).toFixed(0)} ₺</strong>
        <span>Güncel Bakiye</span>
      </div>
      <div className="deposit-box">
        <label htmlFor="deposit-amount">Demo para yatır <span className="demo-pill">Demo</span></label>
        <div className="deposit-row">
          <div className="stake-input">
            <input id="deposit-amount" type="number" inputMode="decimal" min={10} value={amount} onChange={(e) => setAmount(e.target.value)} />
            <span>₺</span>
          </div>
          <button type="button" className="claim-btn" onClick={() => void deposit()} disabled={busy}>Yatır</button>
        </div>
        <div className="stake-quick">
          {[100, 250, 500, 1000].map((v) => <button key={v} type="button" onClick={() => setAmount(String(v))}>{v}₺</button>)}
        </div>
        {msg && <p className={msg.ok ? 'limit-message' : 'auth-error'} role="status">{msg.text}</p>}
      </div>
      <div className="wallet-list">
        {transactions.length === 0 ? (
          <p className="empty-message">Henüz finansal işlem bulunmuyor.</p>
        ) : (
          transactions.slice(0, 20).map((tx) => {
            const Icon = typeIcons[tx.type] || Wallet;
            const isPositive = tx.amount > 0;
            return (
              <div className="wallet-row" key={tx.id}>
                <div className={`wallet-icon ${isPositive ? 'positive' : 'negative'}`}>
                  <Icon size={16} />
                </div>
                <div className="wallet-detail">
                  <strong>{typeLabels[tx.type] || tx.type}</strong>
                  <small>{new Date(tx.created_at).toLocaleDateString('tr-TR')} · {tx.description || ''}</small>
                </div>
                <div className={`wallet-amount ${isPositive ? 'positive' : 'negative'}`}>
                  {isPositive ? '+' : ''}{Number(tx.amount).toFixed(2)} ₺
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
