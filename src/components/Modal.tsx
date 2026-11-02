import { ArrowRight, Check, Gift, UserRound, LockKeyhole, Wallet, Shield, Phone, Calendar, ChevronLeft, AlertCircle, Info, Eye, EyeOff, Mail } from 'lucide-react';
import { FormEvent, useState } from 'react';
import type { ModalType, Profile, BetSlipRecord, BetSelectionRecord, Transaction, Bonus, Freebet, ResponsibleLimit, RegisterValues } from '@/types';
import { WalletView } from '@/components/WalletView';
import { ResponsibleGambling } from '@/components/ResponsibleGambling';
import { BonusManager } from '@/components/BonusManager';
import { ModalShell } from '@/components/ModalShell';
import { SITE } from '@/config/site';
import { ageFromBirthDate, isEmail, isValidTc } from '@/lib/validation';

type Props = {
  modal: ModalType;
  onClose: () => void;
  notice: string;
  authError: string;
  authBusy: boolean;
  infoTitle: string;
  profile: Profile | null;
  betSlips: BetSlipRecord[];
  betSelections: BetSelectionRecord[];
  sessionEmail: string | null;
  transactions: Transaction[];
  bonuses: Bonus[];
  freebets: Freebet[];
  responsibleLimits: ResponsibleLimit | null;
  onLogin: (email: string, password: string) => void;
  onRegister: (values: RegisterValues) => void;
  onResetPassword: (email: string) => void;
  onUpdatePassword: (password: string) => void;
  onSwitchModal: (modal: ModalType) => void;
  onResetDemo: () => void;
};

const MODAL_LABELS: Record<ModalType, string> = {
  login: 'Giriş yap', register: 'Kayıt ol', recovery: 'Yeni şifre belirle', promotions: 'Promosyonlar',
  account: 'Hesabım', wallet: 'Cüzdan', responsible: 'Sorumlu oyun', bonuses: 'Bonuslar',
  aml: 'AML ve KYC politikası', info: 'Bilgi',
};

export function Modal(props: Props) {
  const { modal, onClose } = props;
  const isWide = ['promotions', 'wallet', 'bonuses', 'responsible', 'aml', 'account'].includes(modal);

  return (
    <ModalShell onClose={onClose} label={modal === 'info' ? props.infoTitle : MODAL_LABELS[modal]} className={isWide ? 'promo-modal' : ''}>
      {modal === 'promotions' && <PromotionsContent onRegister={() => props.onSwitchModal('register')} onBonuses={() => props.onSwitchModal(props.sessionEmail ? 'bonuses' : 'login')} />}
      {modal === 'account' && <AccountContent {...props} onResetDemo={props.onResetDemo} onWallet={() => props.onSwitchModal('wallet')} onResponsible={() => props.onSwitchModal('responsible')} onBonuses={() => props.onSwitchModal('bonuses')} />}
      {modal === 'wallet' && <WalletView transactions={props.transactions} balance={Number(props.profile?.balance || 0)} />}
      {modal === 'responsible' && <ResponsibleGambling limits={props.responsibleLimits} signedIn={Boolean(props.sessionEmail)} />}
      {modal === 'aml' && <AmlPolicyContent />}
      {modal === 'bonuses' && <BonusManager bonuses={props.bonuses} freebets={props.freebets} />}
      {modal === 'info' && <InfoContent title={props.infoTitle} />}
      {modal === 'login' && <LoginContent {...props} />}
      {modal === 'register' && <RegisterContent {...props} />}
      {modal === 'recovery' && <RecoveryContent {...props} />}
    </ModalShell>
  );
}

function InfoContent({ title }: { title: string }) {
  return (
    <>
      <div className="modal-icon"><Info size={24} /></div>
      <span className="modal-kicker">{SITE.name.toUpperCase()}</span>
      <h2>{title}</h2>
      <p className="modal-description">Bu bölümün içeriği henüz yayınlanmadı. Güncel bilgi için daha sonra tekrar kontrol edebilirsin.</p>
    </>
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
      <span className="modal-kicker">{SITE.name.toUpperCase()} FIRSATLARI</span>
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
        <button type="button" className="modal-primary" onClick={onBonuses}>Bonuslarımı Yönet <ArrowRight size={16} /></button>
        <button type="button" className="promo-secondary" onClick={onRegister}>Hemen Kayıt Ol <ArrowRight size={16} /></button>
      </div>
    </>
  );
}

function AmlPolicyContent() {
  return (
    <>
      <div className="modal-icon"><Shield size={24} /></div>
      <span className="modal-kicker">{SITE.name.toUpperCase()} UYUM MERKEZİ</span>
      <h2>AML ve KYC Politikası</h2>
      <p className="modal-description">{SITE.name}, platformun güvenli ve yasalara uygun kullanılmasını desteklemek için müşterini tanıma (KYC) ve kara para aklamayı önleme (AML) kontrolleri uygular.</p>
      <div className="aml-policy-content">
        <section><h3>TC kimlik numaranız neden istenir?</h3><p>TC kimlik numarası; yaş sınırını doğrulamak, hesabın size ait olduğunu kontrol etmek, aynı kişi adına açılan mükerrer hesapları önlemek ve finansal suçlarla mücadele yükümlülüklerini yerine getirmek amacıyla istenir. Bu bilgi bahis tercihleriniz veya reklam profili oluşturmak için kullanılmaz.</p></section>
        <section><h3>Uyum ve inceleme birimi</h3><p>Uyum ekibi; olağandışı işlem örüntülerini, hesap güvenliğini ve para yatırma/çekme işlemlerini risk temelli yaklaşımla inceleyebilir. Gerekli durumlarda ek belge talep edilebilir ve kanunen yetkili kurumlara bildirim yapılabilir.</p></section>
        <section><h3>Verilerin korunması</h3><p>Kimlik ve iletişim verileri yalnızca belirli, açık ve meşru amaçlarla; erişim yetkileri sınırlandırılarak ve ilgili mevzuatta öngörülen süreler boyunca işlenir. Saklama süresi sona erdiğinde veriler güvenli yöntemlerle silinir veya anonimleştirilir.</p></section>
        <section><h3>Şeffaflık ve haklarınız</h3><p>Hangi verilerin işlendiği, işleme amacı ve başvuru haklarınız hakkında ayrıntılı bilgi için Gizlilik/KVKK metinlerini inceleyebilir veya destek ekibimizle iletişime geçebilirsiniz. Bu bilgilendirme hukuki danışmanlık yerine geçmez.</p></section>
      </div>
    </>
  );
}

const VIP_LEVELS = [
  { name: 'Bronz', min: 0 }, { name: 'Gümüş', min: 500 }, { name: 'Altın', min: 2000 },
  { name: 'Platin', min: 5000 }, { name: 'Elmas', min: 10000 },
];

const SLIP_STATUS: Record<string, string> = {
  pending: 'Bekliyor', won: 'Kazandı', lost: 'Kaybetti', cashed_out: 'Bozduruldu', void: 'İade',
};

function AccountContent({ profile, betSlips, betSelections, sessionEmail, onWallet, onResponsible, onBonuses, onResetDemo }: {
  profile: Profile | null; betSlips: BetSlipRecord[]; betSelections: BetSelectionRecord[]; sessionEmail: string | null;
  onWallet: () => void; onResponsible: () => void; onBonuses: () => void; onResetDemo: () => void;
}) {
  const points = profile?.vip_points || 0;
  const nextLevel = VIP_LEVELS.find((l) => l.min > points);
  const currentMin = [...VIP_LEVELS].reverse().find((l) => l.min <= points)?.min ?? 0;
  const pct = nextLevel ? Math.min(100, ((points - currentMin) / (nextLevel.min - currentMin)) * 100) : 100;

  const describe = (slip: BetSlipRecord) => {
    const sels = betSelections.filter((s) => s.bet_slip_id === slip.id);
    if (slip.type === 'single' && sels[0]) return { title: `${sels[0].home_team} - ${sels[0].away_team}`, sub: sels[0].selection_label };
    if (slip.type === 'system') return { title: `Sistem ${slip.system_size ?? ''}/${sels.length}`, sub: `${sels.length} seçim` };
    return { title: `Kombine · ${sels.length || ''} seçim`, sub: `Oran ${Number(slip.total_odds).toFixed(2)}` };
  };

  return (
    <>
      <div className="modal-icon"><UserRound size={24} /></div>
      <span className="modal-kicker">HESABIM</span>
      <h2>{profile?.display_name || 'Profilin'}</h2>
      <div className="account-balance">
        <strong>{Number(profile?.balance || 0).toFixed(2)} ₺</strong>
        <span>Güncel Bakiye</span>
      </div>
      <div className="vip-panel">
        <div className="vip-heading">
          <strong>{profile?.vip_level || 'Bronz'} VIP</strong>
          <span>{nextLevel ? `${points} / ${nextLevel.min} puan` : `${points} puan · en üst seviye`}</span>
        </div>
        <div className="vip-track"><i style={{ width: `${pct}%` }} /></div>
        <small>Bahis yaptıkça VIP seviyen ve ayrıcalıkların artar.</small>
      </div>
      <div className="account-stats">
        <div><strong>{Number(profile?.total_staked || 0).toFixed(0)} ₺</strong><span>Toplam bahis</span></div>
        <div><strong>{betSlips.length}</strong><span>Kupon</span></div>
        <div><strong className="email-truncate" title={sessionEmail || ''}>{sessionEmail}</strong><span>E-posta</span></div>
      </div>
      <div className="account-quick-actions">
        <button type="button" className="quick-action-btn" onClick={onWallet}><Wallet size={16} /> Cüzdan</button>
        <button type="button" className="quick-action-btn" onClick={onBonuses}><Gift size={16} /> Bonuslar</button>
        <button type="button" className="quick-action-btn" onClick={onResponsible}><Shield size={16} /> Sorumlu Oyun</button>
      </div>
      <div className="history-list">
        <h3>Son kuponlar</h3>
        {betSlips.length ? betSlips.slice(0, 6).map((slip) => {
          const d = describe(slip);
          return (
            <div className="history-row" key={slip.id}>
              <div><strong>{d.title}</strong><small>{d.sub} · {new Date(slip.placed_at).toLocaleDateString('tr-TR')} · {SLIP_STATUS[slip.status] || slip.status}</small></div>
              <b>{Number(slip.stake).toFixed(0)} ₺</b>
            </div>
          );
        }) : <p>Henüz kayıtlı bir kuponun yok.</p>}
      </div>
      <button type="button" className="reset-demo" onClick={() => { if (window.confirm('Tüm demo verileri (hesaplar, kuponlar, bakiye) bu tarayıcıdan silinecek. Emin misin?')) onResetDemo(); }}>Demo verilerini sıfırla</button>
    </>
  );
}

function PasswordInput({ name, value, onChange, placeholder, autoComplete, minLength = 8 }: {
  name: string; value: string; onChange: (v: string) => void; placeholder: string; autoComplete: string; minLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="password-field">
      <input name={name} type={show ? 'text' : 'password'} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} minLength={minLength} required autoComplete={autoComplete} />
      <button type="button" className="password-toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Şifreyi gizle' : 'Şifreyi göster'}>
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}

function LoginContent({ notice, authError, authBusy, onLogin, onResetPassword, onSwitchModal }: Props) {
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (mode === 'login') onLogin(email.trim(), password);
    else onResetPassword(email.trim());
  };

  return (
    <>
      <div className="modal-icon">{mode === 'login' ? <UserRound size={24} /> : <Mail size={24} />}</div>
      <span className="modal-kicker">{SITE.name.toUpperCase()} HESABIN</span>
      <h2>{mode === 'login' ? 'Tekrar hoş geldin' : 'Şifreni sıfırla'}</h2>
      {mode === 'reset' && <p className="modal-description">Demo modunda e-posta gönderilmez; hesabın bu tarayıcıda kayıtlıysa doğrudan yeni şifre belirleyebilirsin.</p>}
      {notice && <div className="form-success"><Check size={22} /><span>{notice}</span></div>}
      <form onSubmit={submit} noValidate={false}>
        <label>E-posta adresin<input name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com" required autoComplete="email" /></label>
        {mode === 'login' && (
          <label>Şifren<PasswordInput name="password" value={password} onChange={setPassword} placeholder="••••••••" autoComplete="current-password" minLength={6} /></label>
        )}
        {authError && <p className="auth-error" role="alert"><AlertCircle size={15} /> {authError}</p>}
        {mode === 'login' && <button className="forgot-password" type="button" onClick={() => setMode('reset')}>Şifremi unuttum</button>}
        <button className="modal-primary" type="submit" disabled={authBusy}>
          {authBusy ? 'Lütfen bekle...' : mode === 'login' ? 'Giriş Yap' : 'Devam Et'} <ArrowRight size={16} />
        </button>
        {mode === 'reset'
          ? <p className="switch-auth"><button type="button" onClick={() => setMode('login')}>Girişe dön</button></p>
          : <p className="switch-auth">Hesabın yok mu? <button type="button" onClick={() => onSwitchModal('register')}>Kayıt ol</button></p>}
      </form>
    </>
  );
}

function RecoveryContent({ notice, authError, authBusy, onUpdatePassword }: Props) {
  const [password, setPassword] = useState('');
  const [again, setAgain] = useState('');
  const [localError, setLocalError] = useState('');

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (password !== again) { setLocalError('Şifreler eşleşmiyor.'); return; }
    setLocalError('');
    onUpdatePassword(password);
  };

  return (
    <>
      <div className="modal-icon"><LockKeyhole size={24} /></div>
      <span className="modal-kicker">ŞİFRE YENİLEME</span>
      <h2>Yeni şifre belirle</h2>
      {notice ? <div className="form-success"><Check size={22} /><span>{notice}</span></div> : (
        <form onSubmit={submit}>
          <label>Yeni şifre<PasswordInput name="password" value={password} onChange={setPassword} placeholder="En az 8 karakter" autoComplete="new-password" /></label>
          <label>Şifre (tekrar)<PasswordInput name="password2" value={again} onChange={setAgain} placeholder="Şifreyi tekrar yaz" autoComplete="new-password" /></label>
          {(localError || authError) && <p className="auth-error" role="alert"><AlertCircle size={15} /> {localError || authError}</p>}
          <button className="modal-primary" type="submit" disabled={authBusy}>{authBusy ? 'Kaydediliyor...' : 'Şifreyi Güncelle'} <ArrowRight size={16} /></button>
        </form>
      )}
    </>
  );
}

const EMPTY_REGISTER: RegisterValues = {
  first_name: '', last_name: '', tc_identity: '', birth_date: '', phone: '', email: '', city: '', district: '',
  address: '', postal_code: '', country: 'Türkiye', displayName: '', email_confirm: '', password: '',
  terms: false, kvkk: false,
};

function RegisterContent({ notice, authError, authBusy, onRegister, onSwitchModal }: Props) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<RegisterValues>(EMPTY_REGISTER);
  const [stepError, setStepError] = useState('');

  const set = <K extends keyof RegisterValues>(key: K, value: RegisterValues[K]) => setValues((v) => ({ ...v, [key]: value }));

  const steps = [
    { title: 'Kimlik', icon: <UserRound size={18} /> },
    { title: 'İletişim', icon: <Phone size={18} /> },
    { title: 'Güvenlik', icon: <LockKeyhole size={18} /> },
  ];

  // Adım bazlı doğrulama. (Önceki sürümde yalnızca görünen adımın alanları gönderiliyordu; artık tüm değerler state'te tutulur.)
  const validate = (s: number): string => {
    if (s === 0) {
      if (values.first_name.trim().length < 2 || values.last_name.trim().length < 2) return 'Ad ve soyad en az 2 karakter olmalı.';
      if (!isValidTc(values.tc_identity)) return 'Geçerli bir 11 haneli TC kimlik numarası gir.';
      const age = ageFromBirthDate(values.birth_date);
      if (age === null) return 'Doğum tarihini gir.';
      if (age < 18) return '18 yaşından küçükler kayıt olamaz.';
      if (age > 110) return 'Doğum tarihini kontrol et.';
    }
    if (s === 1) {
      if (!/^[0-9+ ]{10,}$/.test(values.phone.trim())) return 'Geçerli bir telefon numarası gir.';
      if (!isEmail(values.email.trim())) return 'Geçerli bir e-posta adresi gir.';
      if (!values.city.trim() || !values.district.trim() || !values.address.trim()) return 'Şehir, ilçe ve adres alanlarını doldur.';
      if (values.postal_code.trim().length < 5) return 'Posta kodu en az 5 haneli olmalı.';
    }
    if (s === 2) {
      if (values.displayName.trim().length < 3) return 'Kullanıcı adı en az 3 karakter olmalı.';
      if (values.email_confirm.trim().toLowerCase() !== values.email.trim().toLowerCase()) return 'E-posta adresleri eşleşmiyor.';
      if (values.password.length < 8) return 'Şifre en az 8 karakter olmalı.';
      if (!values.terms || !values.kvkk) return 'Devam etmek için koşulları ve KVKK metnini onaylamalısın.';
    }
    return '';
  };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = validate(step);
    setStepError(err);
    if (err) return;
    if (step < 2) { setStep(step + 1); return; }
    onRegister({ ...values, email: values.email.trim(), displayName: values.displayName.trim() });
  };

  if (notice) {
    return (
      <>
        <div className="modal-icon"><UserRound size={24} /></div>
        <span className="modal-kicker">{SITE.name.toUpperCase()} HESABIN</span>
        <h2>Aramıza katıl</h2>
        <div className="form-success"><Check size={26} /><strong>Kayıt tamamlandı</strong><span>{notice}</span></div>
      </>
    );
  }

  return (
    <>
      <div className="modal-icon"><UserRound size={24} /></div>
      <span className="modal-kicker">{SITE.name.toUpperCase()} HESABIN</span>
      <h2>Aramıza katıl</h2>

      <div className="reg-stepper" aria-label={`Adım ${step + 1} / 3`}>
        {steps.map((s, i) => (
          <div key={s.title} className={`reg-step ${i === step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <div className="reg-step-icon">{i < step ? <Check size={14} /> : s.icon}</div>
            <small>{s.title}</small>
          </div>
        ))}
      </div>

      <form onSubmit={submit}>
        {step === 0 && (
          <div className="reg-step-content">
            <div className="reg-field-row">
              <label>Ad<input type="text" value={values.first_name} onChange={(e) => set('first_name', e.target.value)} placeholder="Adın" required minLength={2} autoComplete="given-name" /></label>
              <label>Soyad<input type="text" value={values.last_name} onChange={(e) => set('last_name', e.target.value)} placeholder="Soyadın" required minLength={2} autoComplete="family-name" /></label>
            </div>
            <label>TC Kimlik No<input type="text" value={values.tc_identity} onChange={(e) => set('tc_identity', e.target.value.replace(/\D/g, '').slice(0, 11))} placeholder="11 haneli TC kimlik numaran" required inputMode="numeric" autoComplete="off" /></label>
            <small className="aml-field-note"><Shield size={13} /> <span>TC kimlik numaran yalnızca yaş doğrulama, müşteri tanıma (KYC), hesap güvenliği ve kara para aklamayı önleme yükümlülükleri kapsamında işlenir. <button type="button" onClick={() => onSwitchModal('aml')}>Neden istiyoruz?</button></span></small>
            <label>Doğum Tarihi<div className="reg-icon-field"><Calendar size={16} /><input type="date" value={values.birth_date} onChange={(e) => set('birth_date', e.target.value)} required autoComplete="bday" max={new Date().toISOString().slice(0, 10)} /></div></label>
            <small className="reg-hint">18 yaşından küçükler bahis oynayamaz. Doğum tarihin yaş kontrolü için kullanılır.</small>
          </div>
        )}

        {step === 1 && (
          <div className="reg-step-content">
            <label>Telefon Numarası<div className="reg-icon-field"><Phone size={16} /><input type="tel" value={values.phone} onChange={(e) => set('phone', e.target.value)} placeholder="05XX XXX XX XX" required autoComplete="tel" /></div></label>
            <label>E-posta<input type="email" value={values.email} onChange={(e) => set('email', e.target.value)} placeholder="ornek@mail.com" required autoComplete="email" /></label>
            <div className="reg-field-row">
              <label>Şehir<input type="text" value={values.city} onChange={(e) => set('city', e.target.value)} placeholder="İl" required autoComplete="address-level1" /></label>
              <label>İlçe<input type="text" value={values.district} onChange={(e) => set('district', e.target.value)} placeholder="İlçe" required autoComplete="address-level2" /></label>
            </div>
            <label>Açık Adres<input type="text" value={values.address} onChange={(e) => set('address', e.target.value)} placeholder="Mahalle, sokak, bina no, daire no" required autoComplete="street-address" /></label>
            <div className="reg-field-row">
              <label>Posta Kodu<input type="text" value={values.postal_code} onChange={(e) => set('postal_code', e.target.value)} placeholder="34XXX" required minLength={5} autoComplete="postal-code" inputMode="numeric" /></label>
              <label>Ülke<input type="text" value={values.country} onChange={(e) => set('country', e.target.value)} required autoComplete="country-name" /></label>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="reg-step-content">
            <label>Kullanıcı Adı<input type="text" value={values.displayName} onChange={(e) => set('displayName', e.target.value)} placeholder="Profilinde görünecek ad" required minLength={3} autoComplete="username" /></label>
            <label>E-posta adresini doğrula<input type="email" value={values.email_confirm} onChange={(e) => set('email_confirm', e.target.value)} placeholder="Aynı e-posta adresini tekrar yaz" required autoComplete="off" /></label>
            <label>Şifre<PasswordInput name="password" value={values.password} onChange={(v) => set('password', v)} placeholder="En az 8 karakter" autoComplete="new-password" /></label>
            <label className="reg-checkbox">
              <input type="checkbox" checked={values.terms} onChange={(e) => set('terms', e.target.checked)} required />
              <span>Kullanım Koşulları ve Gizlilik Politikası'nı okudum, kabul ediyorum. 18 yaşından büyüğüm.</span>
            </label>
            <label className="reg-checkbox">
              <input type="checkbox" checked={values.kvkk} onChange={(e) => set('kvkk', e.target.checked)} required />
              <span>KVKK kapsamında kişisel verilerimin işlenmesini onaylıyorum.</span>
            </label>
            <small className="registration-aml-disclosure">Kimlik bilgileri; finansal suçların önlenmesi, şüpheli işlemlerin incelenmesi ve yasal mercilere yapılması gereken bildirimler için gerekli süre boyunca güvenli şekilde saklanabilir.</small>
          </div>
        )}

        {(stepError || authError) && <p className="auth-error" role="alert"><AlertCircle size={15} /> {stepError || authError}</p>}

        <div className="reg-nav-buttons">
          {step > 0 && (
            <button type="button" className="reg-back-btn" onClick={() => { setStep(step - 1); setStepError(''); }}>
              <ChevronLeft size={16} /> Geri
            </button>
          )}
          <button className="modal-primary" type="submit" disabled={authBusy}>
            {step < 2 ? 'Devam Et' : authBusy ? 'Oluşturuluyor...' : 'Hesap Oluştur'} <ArrowRight size={16} />
          </button>
        </div>
        <p className="switch-auth">Zaten hesabın var mı? <button type="button" onClick={() => onSwitchModal('login')}>Giriş yap</button></p>
      </form>
    </>
  );
}
