import { ArrowRight, Check, Gift, UserRound, LockKeyhole, Wallet, Shield, Phone, Calendar, ChevronLeft, AlertCircle } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { ModalType, Profile, Bet, Transaction, Bonus, Freebet, ResponsibleLimit } from '@/types';
import { WalletView } from '@/components/WalletView';
import { ResponsibleGambling } from '@/components/ResponsibleGambling';
import { BonusManager } from '@/components/BonusManager';

type Props = {
  modal: ModalType;
  onClose: () => void;
  formSent: boolean;
  authError: string;
  profile: Profile | null;
  betHistory: Bet[];
  sessionEmail: string | null;
  transactions: Transaction[];
  bonuses: Bonus[];
  freebets: Freebet[];
  responsibleLimits: ResponsibleLimit | null;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchModal: (modal: ModalType) => void;
  onRefreshAccount: () => void;
};

export function Modal({
  modal, onClose, formSent, authError, profile, betHistory, sessionEmail,
  transactions, bonuses, freebets, responsibleLimits, onSubmit, onSwitchModal, onRefreshAccount,
}: Props) {
  const isWide = modal === 'promotions' || modal === 'wallet' || modal === 'bonuses' || modal === 'responsible' || modal === 'aml';

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div className={isWide ? 'modal-card promo-modal' : 'modal-card'} onMouseDown={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Pencereyi kapat"><span className="sr-only">Kapat</span>✕</button>

        {modal === 'promotions' && <PromotionsContent onRegister={() => onSwitchModal('register')} onBonuses={() => onSwitchModal('bonuses')} />}
        {modal === 'account' && <AccountContent profile={profile} betHistory={betHistory} sessionEmail={sessionEmail} onWallet={() => onSwitchModal('wallet')} onResponsible={() => onSwitchModal('responsible')} onBonuses={() => onSwitchModal('bonuses')} />}
        {modal === 'wallet' && <WalletView transactions={transactions} balance={Number(profile?.balance || 0)} />}
        {modal === 'responsible' && <ResponsibleGambling limits={responsibleLimits} />}
        {modal === 'aml' && <AmlPolicyContent />}
        {modal === 'bonuses' && <BonusManager bonuses={bonuses} freebets={freebets} onRefresh={onRefreshAccount} />}
        {(modal === 'login' || modal === 'register') && (
          <AuthContent modal={modal} formSent={formSent} authError={authError} onSubmit={onSubmit} onSwitchModal={onSwitchModal} />
        )}
      </div>
    </div>
  );
}

function PromotionsContent({ onRegister, onBonuses }: { onRegister: () => void; onBonuses: () => void }) {
  const promos = [
    { num: '01', title: 'Hoş Geldin %100 Bonusu', desc: 'İlk yatırımına özel %100 bonus fırsatı' },
    { num: '02', title: 'Anlık %40 Kayıp Bonusu', desc: 'Aktif bahislerinde kaybının %40\'ını geri al' },
    { num: '03', title: '1.500 ₺ Deneme Bonusu', desc: 'Yeni üyeler için risksiz oyun deneyimi' },
    { num: '04', title: '%50 Kripto Yatırım Bonusu', desc: 'Kripto yatırımlarında ekstra bonus avantajı' },
    { num: '05', title: 'Telegram Etkinlik Bonusu', desc: 'Topluluk etkinliklerine katıl, sürpriz bonus kazan' },
  ];
  return (
    <>
      <div className="modal-icon"><Gift size={24} /></div>
      <span className="modal-kicker">ROCKSTARBET FIRSATLARI</span>
      <h2>Bonus dünyasını keşfet</h2>
      <p className="modal-description">Sana özel hazırlanan kampanyalarla bahis ve casino deneyimini daha avantajlı yaşa.</p>
      <div className="promo-list">
        {promos.map((p) => (
          <div key={p.num}>
            <span className="promo-number">{p.num}</span>
            <div><strong>{p.title}</strong><small>{p.desc}</small></div>
            <Check size={17} />
          </div>
        ))}
      </div>
      <div className="promo-actions">
        <button className="modal-primary" onClick={onBonuses}>Bonuslarımı Yönet <ArrowRight size={16} /></button>
        <button className="promo-secondary" onClick={onRegister}>Hemen Kayıt Ol <ArrowRight size={16} /></button>
      </div>
    </>
  );
}

function AmlPolicyContent() {
  return (
    <>
      <div className="modal-icon"><Shield size={24} /></div>
      <span className="modal-kicker">ROCKSTARBET UYUM MERKEZİ</span>
      <h2>AML ve KYC Politikası</h2>
      <p className="modal-description">RockstarBet, platformun güvenli ve yasalara uygun kullanılmasını desteklemek için müşterini tanıma (KYC) ve kara para aklamayı önleme (AML) kontrolleri uygular.</p>
      <div className="aml-policy-content">
        <section><h3>TC kimlik numaranız neden istenir?</h3><p>TC kimlik numarası; yaş sınırını doğrulamak, hesabın size ait olduğunu kontrol etmek, aynı kişi adına açılan mükerrer hesapları önlemek ve finansal suçlarla mücadele yükümlülüklerini yerine getirmek amacıyla istenir. Bu bilgi bahis tercihleriniz veya reklam profili oluşturmak için kullanılmaz.</p></section>
        <section><h3>Uyum ve inceleme birimi</h3><p>Uyum ekibi; olağandışı işlem örüntülerini, hesap güvenliğini ve para yatırma/çekme işlemlerini risk temelli yaklaşımla inceleyebilir. Gerekli durumlarda ek belge talep edilebilir ve kanunen yetkili kurumlara bildirim yapılabilir.</p></section>
        <section><h3>Verilerin korunması</h3><p>Kimlik ve iletişim verileri yalnızca belirli, açık ve meşru amaçlarla; erişim yetkileri sınırlandırılarak ve ilgili mevzuatta öngörülen süreler boyunca işlenir. Saklama süresi sona erdiğinde veriler güvenli yöntemlerle silinir veya anonimleştirilir.</p></section>
        <section><h3>Şeffaflık ve haklarınız</h3><p>Hangi verilerin işlendiği, işleme amacı ve başvuru haklarınız hakkında ayrıntılı bilgi için Gizlilik/KVKK metinlerini inceleyebilir veya destek ekibimizle iletişime geçebilirsiniz. Bu bilgilendirme hukuki danışmanlık yerine geçmez.</p></section>
      </div>
    </>
  );
}

function AccountContent({ profile, betHistory, sessionEmail, onWallet, onResponsible, onBonuses }: {
  profile: Profile | null; betHistory: Bet[]; sessionEmail: string | null;
  onWallet: () => void; onResponsible: () => void; onBonuses: () => void;
}) {
  return (
    <>
      <div className="modal-icon"><UserRound size={24} /></div>
      <span className="modal-kicker">HESABIM</span>
      <h2>{profile?.display_name || 'Profilin'}</h2>
      <div className="account-balance">
        <strong>{Number(profile?.balance || 0).toFixed(0)} ₺</strong>
        <span>Güncel Bakiye</span>
      </div>
      <div className="vip-panel">
        <div className="vip-heading">
          <strong>{profile?.vip_level || 'Bronz'} VIP</strong>
          <span>{profile?.vip_points || 0} / 500 puan</span>
        </div>
        <div className="vip-track"><i style={{ width: `${Math.min(100, ((profile?.vip_points || 0) / 500) * 100)}%` }} /></div>
        <small>Bahis yaptıkça VIP seviyen ve ayrıcalıkların artar.</small>
      </div>
      <div className="account-stats">
        <div><strong>{Number(profile?.total_staked || 0).toFixed(0)} ₺</strong><span>Toplam bahis</span></div>
        <div><strong>{betHistory.length}</strong><span>Bahis geçmişi</span></div>
        <div><strong className="email-truncate">{sessionEmail}</strong><span>E-posta</span></div>
      </div>
      <div className="account-quick-actions">
        <button className="quick-action-btn" onClick={onWallet}><Wallet size={16} /> Cüzdan</button>
        <button className="quick-action-btn" onClick={onBonuses}><Gift size={16} /> Bonuslar</button>
        <button className="quick-action-btn" onClick={onResponsible}><Shield size={16} /> Sorumlu Oyun</button>
      </div>
      <div className="history-list">
        <h3>Son bahisler</h3>
        {betHistory.length ? betHistory.slice(0, 5).map((bet) => (
          <div className="history-row" key={bet.id}>
            <div><strong>{bet.home_team} - {bet.away_team}</strong><small>{bet.selection} · {new Date(bet.placed_at).toLocaleDateString('tr-TR')}</small></div>
            <b>{Number(bet.stake).toFixed(0)} ₺</b>
          </div>
        )) : <p>Henüz kayıtlı bir bahis geçmişin yok.</p>}
      </div>
    </>
  );
}

function AuthContent({ modal, formSent, authError, onSubmit, onSwitchModal }: {
  modal: 'login' | 'register';
  formSent: boolean;
  authError: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onSwitchModal: (modal: ModalType) => void;
}) {
  const [regStep, setRegStep] = useState(0);

  if (modal === 'login') {
    return (
      <>
        <div className="modal-icon"><UserRound size={24} /></div>
        <span className="modal-kicker">ROCKSTARBET HESABIN</span>
        <h2>Tekrar hoş geldin</h2>
        {formSent ? (
          <div className="form-success">
            <Check size={26} />
            <strong>Giriş isteğin alındı.</strong>
            <span>Hesabına giriş yapıldı.</span>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label>E-posta adresin<input name="email" type="email" placeholder="ornek@mail.com" required /></label>
            <label>Şifren <div className="password-field"><input name="password" type="password" placeholder="••••••••" minLength={6} required /><LockKeyhole size={16} /></div></label>
            {authError && <p className="auth-error">{authError}</p>}
            <button className="forgot-password" type="button">Şifremi unuttum</button>
            <button className="modal-primary" type="submit">Giriş Yap <ArrowRight size={16} /></button>
            <p className="switch-auth">Hesabın yok mu? <button type="button" onClick={() => onSwitchModal('register')}>Kayıt ol</button></p>
          </form>
        )}
      </>
    );
  }

  const steps = [
    { title: 'Kimlik Bilgileri', icon: <UserRound size={18} /> },
    { title: 'İletişim & Adres', icon: <Phone size={18} /> },
    { title: 'Güvenlik', icon: <LockKeyhole size={18} /> },
  ];

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (regStep < 2) {
      setRegStep(regStep + 1);
    } else {
      onSubmit(e);
    }
  };

  const handleBack = () => {
    if (regStep > 0) setRegStep(regStep - 1);
  };

  return (
    <>
      <div className="modal-icon"><UserRound size={24} /></div>
      <span className="modal-kicker">ROCKSTARBET HESABIN</span>
      <h2>Aramıza katıl</h2>

      {formSent ? (
        <div className="form-success">
          <Check size={26} />
          <strong>Kayıt isteğin alındı!</strong>
          <span>Hesabın oluşturuldu. Hoş geldin bonusun hazır.</span>
        </div>
      ) : (
        <>
          <div className="reg-stepper">
            {steps.map((s, i) => (
              <div key={s.title} className={`reg-step ${i === regStep ? 'active' : ''} ${i < regStep ? 'done' : ''}`}>
                <div className="reg-step-icon">{i < regStep ? <Check size={14} /> : s.icon}</div>
                <small>{s.title}</small>
              </div>
            ))}
          </div>

          <form onSubmit={handleNext}>
            {regStep === 0 && (
              <div className="reg-step-content">
                <div className="reg-field-row">
                  <label>Ad<input name="first_name" type="text" placeholder="Adınız" required minLength={2} /></label>
                  <label>Soyad<input name="last_name" type="text" placeholder="Soyadınız" required minLength={2} /></label>
                </div>
                <label>TC Kimlik No<input name="tc_identity" type="text" placeholder="11 haneli TC kimlik numaranız" required minLength={11} maxLength={11} pattern="[0-9]{11}" inputMode="numeric" /></label>
                <small className="aml-field-note"><Shield size={13} /> TC kimlik numaranız yalnızca yaş doğrulama, müşteri tanıma (KYC), hesap güvenliği ve kara para aklamayı önleme yükümlülükleri kapsamında işlenir. <button type="button" onClick={() => onSwitchModal('aml')}>Neden istiyoruz?</button></small>
                <label>Doğum Tarihi<div className="reg-icon-field"><Calendar size={16} /><input name="birth_date" type="date" required /></div></label>
                <small className="reg-hint">18 yaşından küçükler bahis oynayamaz. Doğum tarihiniz yaş kontrolü için kullanılır.</small>
              </div>
            )}

            {regStep === 1 && (
              <div className="reg-step-content">
                <label>Telefon Numarası<div className="reg-icon-field"><Phone size={16} /><input name="phone" type="tel" placeholder="05XX XXX XX XX" required pattern="[0-9+ ]{10,}" /></div></label>
                <label>E-posta<input name="email" type="email" placeholder="ornek@mail.com" required /></label>
                <div className="reg-field-row">
                  <label>Şehir<input name="city" type="text" placeholder="İl" required /></label>
                  <label>İlçe<input name="district" type="text" placeholder="İlçe" required /></label>
                </div>
                <label>Açık Adres<input name="address" type="text" placeholder="Mahalle, sokak, bina no, daire no" required /></label>
                <div className="reg-field-row">
                  <label>Posta Kodu<input name="postal_code" type="text" placeholder="34XXX" required minLength={5} /></label>
                  <label>Ülke<input name="country" type="text" defaultValue="Türkiye" required /></label>
                </div>
              </div>
            )}

            {regStep === 2 && (
              <div className="reg-step-content">
                <label>Kullanıcı Adı<input name="displayName" type="text" placeholder="Profilinde görünecek ad" required minLength={3} /></label>
                <label>E-posta Adresi<input name="email_confirm" type="email" placeholder="ornek@mail.com" required /></label>
                <label>Şifre <div className="password-field"><input name="password" type="password" placeholder="En az 6 karakter" minLength={6} required /><LockKeyhole size={16} /></div></label>
                <small className="reg-hint">Şifren en az 6 karakter olmalıdır. Güçlü bir şifre seçin.</small>
                <label className="reg-checkbox">
                  <input type="checkbox" name="terms" required />
                  <span><Check size={14} /> <a href="#" onClick={(e) => e.preventDefault()}>Kullanım Koşulları</a> ve <a href="#" onClick={(e) => e.preventDefault()}>Gizlilik Politikası</a>'nı okudum, kabul ediyorum. 18+ yaşındayım.</span>
                </label>
                <label className="reg-checkbox">
                  <input type="checkbox" name="kvkk" required />
                  <span><Check size={14} /> KVKK kapsamında kişisel verilerimin işlenmesini onaylıyorum.</span>
                </label>
                <small className="registration-aml-disclosure">Kimlik bilgileri; finansal suçların önlenmesi, şüpheli işlemlerin incelenmesi ve yasal mercilere yapılması gereken bildirimler için gerekli süre boyunca güvenli şekilde saklanabilir.</small>
              </div>
            )}

            {authError && (
              <p className="auth-error"><AlertCircle size={15} /> {authError}</p>
            )}

            <div className="reg-nav-buttons">
              {regStep > 0 && (
                <button type="button" className="reg-back-btn" onClick={handleBack}>
                  <ChevronLeft size={16} /> Geri
                </button>
              )}
              <button className="modal-primary" type="submit">
                {regStep < 2 ? 'Devam Et' : 'Hesap Oluştur'} <ArrowRight size={16} />
              </button>
            </div>

            <p className="switch-auth">Zaten hesabın var mı? <button type="button" onClick={() => onSwitchModal('login')}>Giriş yap</button></p>
          </form>
        </>
      )}
    </>
  );
}
