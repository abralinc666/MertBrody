import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  ChevronRight,
  CircleHelp,
  Gift,
  Headphones,
  Search,
  ShieldCheck,
  Star,
  UserRound,
  Sun,
  Moon,
  Wallet,
  Shield,
  Volume2,
  VolumeX,
} from 'lucide-react';
import type { MatchWithMarkets, ModalType, SelectedBet, BetSlipType, OddsPreference } from '@/types';
import { sports, heroSlides, games, liveSportsCounts, navItems, winners } from '@/data/sports';
import { useUserRealtime } from '@/hooks/useUserRealtime';
import { HeroCarousel } from '@/components/HeroCarousel';
import { MatchList } from '@/components/MatchList';
import { BetSlip } from '@/components/BetSlip';
import { Modal } from '@/components/Modal';
import { MobileDock } from '@/components/MobileDock';
import { CouponFab } from '@/components/CouponFab';
import { MatchTracker } from '@/components/MatchTracker';
import { LiveTicker } from '@/components/LiveTicker';
import { useSoundFx, playSound } from '@/hooks/useSoundFx';

function App() {
  const [activeNav, setActiveNav] = useState('Spor Bahisleri');
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [modal, setModal] = useState<ModalType | null>(null);
  const [formSent, setFormSent] = useState(false);
  const [authError, setAuthError] = useState('');
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [betError, setBetError] = useState('');
  const [betSuccess, setBetSuccess] = useState('');
  const [trackerMatch, setTrackerMatch] = useState<MatchWithMarkets | null>(null);

  const { soundOn, toggleSound } = useSoundFx();
  const {
    profile, betHistory, betSlips, transactions, bonuses, freebets, responsibleLimits, refreshAccount,
  } = useUserRealtime();

  const openModal = (nextModal: ModalType) => {
    setFormSent(false);
    setAuthError('');
    setModal(nextModal);
  };

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlideIndex((c) => (c + 1) % heroSlides.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setAuthError('Bu sürüm yalnızca tasarım önizlemesidir. Üyelik ve giriş backend bağlantısı daha sonra eklenecek.');
  };

  const toggleBet = (bet: SelectedBet) => {
    setSelectedBets((current) => {
      const exists = current.some((b) => b.eventId === bet.eventId && b.selectionLabel === bet.selectionLabel);
      if (exists) return current.filter((b) => !(b.eventId === bet.eventId && b.selectionLabel === bet.selectionLabel));
      const fromSameMarket = current.filter((b) => b.eventId === bet.eventId && b.marketType === bet.marketType);
      if (fromSameMarket.length > 0) {
        return [...current.filter((b) => !(b.eventId === bet.eventId && b.marketType === bet.marketType)), bet];
      }
      if (current.length >= 12) return current;
      return [...current, bet];
    });
    setBetError('');
    setBetSuccess('');
  };

  const placeSelectedBet = async (_type: BetSlipType, _stake: number, _freebetId: string | null) => {
    setBetError('Bahis işlemleri tasarım önizlemesinde devre dışıdır. Backend daha sonra bağlanacak.');
  };

  const handleCashout = async (_slipId: string) => {
    setBetError('Kupon bozdurma tasarım önizlemesinde devre dışıdır.');
  };

  const handleOddsPrefChange = async (_pref: OddsPreference) => {
    setBetSuccess('Oran tercihi önizleme modunda değiştirilemez.');
  };

  const activeSlips = useMemo(() =>
    betSlips
      .filter((s) => s.status === 'pending')
      .map((s) => ({ id: s.id, total_odds: Number(s.total_odds), stake: Number(s.stake), status: s.status, potential_payout: Number(s.potential_payout) })),
    [betSlips],
  );

  const prevSlipStatuses = useRef<Record<string, string>>({});
  useEffect(() => {
    const newWin = betSlips.find((s) => s.status === 'won' && prevSlipStatuses.current[s.id] === 'pending');
    if (newWin) playSound('win');
    prevSlipStatuses.current = Object.fromEntries(betSlips.map((s) => [s.id, s.status]));
  }, [betSlips]);

  const scrollToMatches = () => document.getElementById('matches')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToFooter = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <div className={isDark ? 'app-shell' : 'app-shell light-shell'}>
      <header className="topbar">
        <div className="brand"><div className="brand-mark"><ShieldCheck size={22} /></div><span>Rockstar<span>Bet</span></span></div>
        <nav className="primary-nav">
          {navItems.map((item) => (
            <button key={item} className={activeNav === item ? 'nav-item active' : 'nav-item'}
              onClick={() => { setActiveNav(item); if (item === 'Promosyonlar') openModal('promotions'); }}>
              {item}
            </button>
          ))}
        </nav>
        <div className="top-actions">
          <label className="top-search"><Search size={17} /><input type="search" placeholder="Oyun veya kategori ara..." aria-label="Oyun veya kategori ara" /></label>
          <button className="icon-btn" aria-label="Ara"><Search size={18} /></button>
          <button className="icon-btn" aria-label="Ses efektlerini aç/kapat" onClick={toggleSound} data-sound="1">{soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
          <button className="icon-btn" aria-label="Temayı değiştir" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>
          {sessionEmail ? (
            <>
              {profile && <span className="balance-pill">{Number(profile.balance).toFixed(0)} ₺</span>}
              <button className="account-btn" onClick={() => openModal('account')}>
                <UserRound size={15} /> {profile?.display_name || 'Hesabım'}
              </button>
              <button className="login-btn" onClick={() => { setSessionEmail(null); }}>Çıkış</button>
            </>
          ) : (
            <>
              <button className="login-btn" onClick={() => openModal('login')}>Giriş Yap</button>
              <button className="register-btn" onClick={() => openModal('register')}>Kayıt Ol</button>
            </>
          )}
        </div>
      </header>

      <div className="layout">
        <aside className="sidebar">
          <button className="side-link favorites"><Star size={17} fill="currentColor" /> Favorilerim</button>
          <div className="sport-list">
            {sports.map((sport) => (
              <button key={sport.name} className="side-link">
                <span className="sport-icon">{sport.icon}</span><span>{sport.name}</span>
                {sport.count && <small>{sport.count}</small>}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="section-title">Tüm Sporlar <ChevronRight size={16} /></div>
            <button className="sub-link live"><span className="live-dot" /> Canlı Bahis <b>LIVE</b><small>312</small></button>
            <div className="section-title small-title">Spor Bahisleri</div>
            {['Maç Sonuçları', 'Handikap', 'Toplam Gol', 'İlk Yarı / Maç Sonucu', 'Karşılıklı Gol'].map((item) => (
              <button className="sub-link" key={item}>{item}</button>
            ))}
          </div>
          {sessionEmail && (
            <div className="sidebar-section">
              <div className="section-title">Hesabım</div>
              <button className="sub-link" onClick={() => openModal('wallet')}><Wallet size={14} /> Cüzdan</button>
              <button className="sub-link" onClick={() => openModal('bonuses')}><Gift size={14} /> Bonuslarım</button>
              <button className="sub-link" onClick={() => openModal('responsible')}><Shield size={14} /> Sorumlu Oyun</button>
            </div>
          )}
        </aside>

        <main className="content">
          <HeroCarousel
            slideIndex={heroSlideIndex}
            onDotClick={setHeroSlideIndex}
            onCtaClick={() => openModal('register')}
          />

          <section className="live-strip">
            <div className="strip-heading">
              <span><span className="live-dot" /> CANLI</span>
              <button>Tümü <ChevronRight size={15} /></button>
            </div>
            <div className="live-sports">
              {['⚽ Futbol', '🏀 Basketbol', '🟢 Tenis', '🏐 Voleybol', '🏒 Buz Hokeyi', '🏓 Masa Tenisi', '••• Diğer'].map((item, index) => (
                <button key={item}>
                  <strong>{item.split(' ')[0]}</strong>
                  <span>{item.substring(item.indexOf(' ') + 1)}</span>
                  <small>{liveSportsCounts[index]}</small>
                </button>
              ))}
            </div>
          </section>

          <LiveTicker />

          <MatchList
            selectedBets={selectedBets}
            onToggleBet={toggleBet}
            onOpenTracker={(match) => setTrackerMatch(match)}
          />
        </main>

        <aside className="right-column">
          <BetSlip
            selectedBets={selectedBets}
            isCouponOpen={isCouponOpen}
            freebets={freebets.filter((f) => f.status === 'available')}
            oddsPreference={(profile?.odds_preference as OddsPreference) || 'accept_any'}
            onToggleCoupon={() => setIsCouponOpen(!isCouponOpen)}
            onCloseCoupon={() => setIsCouponOpen(false)}
            onRemoveBet={(index) => setSelectedBets(selectedBets.filter((_, i) => i !== index))}
            onPlaceBet={(type, stake, freebetId) => void placeSelectedBet(type, stake, freebetId)}
            onCashout={(slipId) => void handleCashout(slipId)}
            activeSlips={activeSlips}
            onOddsPrefChange={handleOddsPrefChange}
            balance={Number(profile?.balance || 0)}
          />
          {betError && <p className="bet-error-banner">{betError}</p>}
          {betSuccess && <p className="bet-success-banner">{betSuccess}</p>}

          <section className="games-card">
            <div className="right-heading">
              <h2>Casino Oyunları</h2>
              <button>Tümü <ChevronRight size={14} /></button>
            </div>
            <div className="game-grid">
              {games.map((game) => (
                <button className="game-tile" key={game.name}>
                  <div className={`game-art ${game.color}`}><span>{game.icon}</span></div>
                  <small>{game.name}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="winners-card">
            <div className="right-heading">
              <h2>Son Kazananlar</h2>
              <button>Tümü <ChevronRight size={14} /></button>
            </div>
            {winners.map(([name, game, amount, icon]) => (
              <div className="winner" key={name}>
                <span className="winner-icon">{icon}</span>
                <div><strong>{name}</strong><small>{game}</small></div>
                <b>{amount}<small>2 dk önce</small></b>
              </div>
            ))}
          </section>

          <section className="support-card">
            <div className="support-icon"><Headphones size={20} /></div>
            <div><strong>7/24 Canlı Destek</strong><small>Her zaman yanınızdayız!</small></div>
            <CircleHelp size={19} />
          </section>
        </aside>
      </div>

      <CouponFab count={selectedBets.length} onClick={() => setIsCouponOpen(true)} />

      <MobileDock
        sessionEmail={sessionEmail}
        onPromotions={() => openModal('promotions')}
        onBetting={scrollToMatches}
        onAccount={() => sessionEmail ? openModal('account') : openModal('login')}
        onSupport={scrollToFooter}
      />

      <footer className="site-footer">
        <div className="footer-main">
          <div className="footer-brand">
            <div className="brand"><div className="brand-mark"><ShieldCheck size={22} /></div><span>Rockstar<span>Bet</span></span></div>
            <p>Güvenli, hızlı ve keyifli bahis deneyimi. Kazancın heyecanını şimdi yaşa.</p>
            <div className="trust-row"><ShieldCheck size={17} /> Lisanslı ve güvenli platform</div>
          </div>
          <div className="footer-column"><h3>Bahis</h3><button>Canlı Bahis</button><button>Spor Bahisleri</button><button>Maç Sonuçları</button><button>Bahis Kuralları</button></div>
          <div className="footer-column"><h3>Casino</h3><button>Casino Oyunları</button><button>Canlı Casino</button><button>Slotlar</button><button>Jackpot Oyunları</button></div>
          <div className="footer-column"><h3>Yardım</h3><button>Canlı Destek</button><button>Sıkça Sorulanlar</button><button onClick={() => openModal('aml')}>AML / KYC Politikası</button><button onClick={() => openModal('responsible')}>Güvenli Oyun</button><button>İletişim</button></div>
          <div className="footer-licenses">
            <div className="footer-license-heading"><ShieldCheck size={16} /> Lisans ve güvenlik</div>
            <img className="footer-verification-image" src="/assets/footer/file_0000000088c481f4a5275d5bc0cbd1cb.png" alt="RockstarBet doğrulama bilgi kartı" />
            <div className="footer-license-logos">
              <img src="/assets/footer/gaming-license.svg" alt="Gaming license" />
              <img src="/assets/footer/licence-1.svg" alt="Lisans bilgisi" />
              <img src="/assets/footer/licence-2.svg" alt="Lisans bilgisi" />
            </div>
          </div>
          <div className="footer-promo">
            <Gift size={22} /><strong>Bonusları kaçırma</strong>
            <span>Yeni kampanyalardan ilk sen haberdar ol.</span>
            <button onClick={() => openModal('promotions')}>Promosyonları Gör <ArrowRight size={15} /></button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RockstarBet. Tüm hakları saklıdır.</span>
          <div><button>Gizlilik Politikası</button><button>Kullanım Koşulları</button><button onClick={() => openModal('aml')}>AML Politikası</button><button onClick={() => openModal('responsible')}>Sorumlu Bahis</button></div>
          <div className="footer-trust-items">
            <span className="curacao-gaming-badge" aria-label="Curaçao Gaming bilgi rozeti"><ShieldCheck size={18} /><span><strong>CURAÇAO</strong><small>GAMING</small></span></span>
            <span>18+ Sorumlu oynayın.</span>
          </div>
        </div>
      </footer>

      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          formSent={formSent}
          authError={authError}
          profile={profile}
          betHistory={betHistory}
          sessionEmail={sessionEmail}
          transactions={transactions}
          bonuses={bonuses}
          freebets={freebets}
          responsibleLimits={responsibleLimits}
          onSubmit={handleFormSubmit}
          onSwitchModal={openModal}
          onRefreshAccount={() => void refreshAccount()}
        />
      )}

      {trackerMatch && <MatchTracker match={trackerMatch} onClose={() => setTrackerMatch(null)} />}
    </div>
  );
}

export default App;
