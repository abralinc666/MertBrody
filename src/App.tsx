import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ChevronRight, CircleHelp, Gift, Headphones, Menu, Moon, Search, Shield, Star, Sun, TriangleAlert,
  UserRound, Volume2, VolumeX, Wallet, X, LogOut, Info,
} from 'lucide-react';
import { api } from '@/services/api';
import type { MatchWithMarkets, ModalType, SelectedBet, BetSlipType, OddsPreference, RegisterValues } from '@/types';
import { sports, games, liveSportsCounts, navItems, winners } from '@/data/sports';
import { useAccount } from '@/hooks/useAccount';
import { useLiveMatches } from '@/hooks/useLiveMatches';
import { useSoundFx, playSound } from '@/hooks/useSoundFx';
import { HeroCarousel } from '@/components/HeroCarousel';
import { MatchList } from '@/components/MatchList';
import { BetSlip, type ActiveSlip } from '@/components/BetSlip';
import { Modal } from '@/components/Modal';
import { MobileDock } from '@/components/MobileDock';
import { CouponFab } from '@/components/CouponFab';
import { MatchTracker } from '@/components/MatchTracker';
import { LiveTicker } from '@/components/LiveTicker';
import { SiteFooter } from '@/components/SiteFooter';
import { Brand } from '@/components/Brand';
import { heroSlides } from '@/data/sports';

const LIVE_STRIP = ['Futbol', 'Basketbol', 'Tenis', 'Voleybol', 'Buz Hokeyi', 'Masa Tenisi', 'Diğer'];
const STRIP_ICONS = ['⚽', '🏀', '🟢', '🏐', '🏒', '🏓', '•••'];

function loadSelectedBets(): SelectedBet[] {
  try {
    const raw = JSON.parse(localStorage.getItem('bf-coupon') || '[]') as SelectedBet[];
    return Array.isArray(raw) ? raw.filter((b) => b && typeof b.eventId === 'string' && typeof b.odds === 'number').slice(0, 12) : [];
  } catch {
    return [];
  }
}

function mapBetError(message: string | undefined): string {
  const m = message || '';
  if (m.includes('Yetersiz bakiye')) return 'Yetersiz bakiye. Bahis oynanamadı.';
  if (m.includes('self-exclusion')) return 'Hesabın dondurulmuş. Bahis oynayamazsın.';
  if (m.includes('Oran değişti') || m.includes('Oran düştü')) return 'Oranlar değişti. Kuponunu kontrol edip tekrar dene.';
  if (m.includes('Piyasa askıda')) return 'Seçtiğin piyasa şu an askıda.';
  if (m.includes('Günlük kayıp limitini')) return 'Günlük limitini aşıyorsun.';
  if (m.includes('Maksimum kazanç') || m.includes('Toplam oran')) return 'Kupon maksimum kazanç/oran sınırını aşıyor.';
  if (m.includes('Geçersiz seçim')) return 'Seçimlerden biri artık geçerli değil. Kuponunu yenile.';
  if (m.includes('Freebet')) return 'Freebet kullanılamadı. Başka bir freebet seç veya kapat.';
  if (m.includes('Invalid stake')) return 'Bahis tutarı 1 ₺ ile 100.000 ₺ arasında olmalı.';
  if (m.includes('Authentication')) return 'Devam etmek için giriş yapmalısın.';
  return 'Bahis kaydedilemedi. Lütfen tekrar dene.';
}

function App() {
  const [activeNav, setActiveNav] = useState('Spor Bahisleri');
  const [heroSlideIndex, setHeroSlideIndex] = useState(0);
  const [selectedBets, setSelectedBets] = useState<SelectedBet[]>(loadSelectedBets);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [demoBanner, setDemoBanner] = useState(true);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try { return localStorage.getItem('bf-theme') !== 'light'; } catch { return true; }
  });
  const [modal, setModal] = useState<ModalType | null>(null);
  const [infoTitle, setInfoTitle] = useState('');
  const [notice, setNotice] = useState('');
  const [authError, setAuthError] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [isCouponOpen, setIsCouponOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [betError, setBetError] = useState('');
  const [betSuccess, setBetSuccess] = useState('');
  const [placing, setPlacing] = useState(false);
  const [trackerId, setTrackerId] = useState<string | null>(null);
  const [matchQuery, setMatchQuery] = useState('');
  const [activeSport, setActiveSport] = useState('Tüm Maçlar');

  const { soundOn, toggleSound } = useSoundFx();
  const liveMatches = useLiveMatches();
  const trackerMatch: MatchWithMarkets | null = useMemo(
    () => liveMatches.find((m) => m.eventId === trackerId) ?? null,
    [liveMatches, trackerId],
  );

  const openModal = useCallback((next: ModalType, title = '') => {
    setNotice('');
    setAuthError('');
    setInfoTitle(title);
    setNavOpen(false);
    setModal(next);
  }, []);

  const { profile, betSlips, betSelections, transactions, bonuses, freebets, responsibleLimits, sessionEmail } = useAccount();

  // Tema: kalıcı + sayfa zemini (aşırı kaydırmada beyaz/siyah parlama olmasın)
  useEffect(() => {
    try { localStorage.setItem('bf-theme', isDark ? 'dark' : 'light'); } catch { /* özel gezinti modu */ }
    document.body.style.background = isDark ? '#061322' : '#eef3f7';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
  }, [isDark]);

  useEffect(() => {
    try { localStorage.setItem('bf-coupon', JSON.stringify(selectedBets)); } catch { /* özel mod */ }
  }, [selectedBets]);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroSlideIndex((c) => (c + 1) % heroSlides.length), 5000);
    return () => window.clearInterval(timer);
  }, []);

  // Bildirim bannerları kendiliğinden kaybolur
  useEffect(() => {
    if (!betError && !betSuccess) return;
    const t = window.setTimeout(() => { setBetError(''); setBetSuccess(''); }, 7000);
    return () => window.clearTimeout(t);
  }, [betError, betSuccess]);

  // Esc: menü ve mobil kupon
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || modal) return;
      setNavOpen(false);
      setIsCouponOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [modal]);

  /* ---------- Kimlik doğrulama (demo arka uç) ---------- */
  const handleLogin = async (email: string, password: string) => {
    setAuthBusy(true); setAuthError('');
    try {
      await api.auth.signIn(email, password);
      setModal(null);
    } catch (e) {
      setAuthError((e as Error).message);
    }
    setAuthBusy(false);
  };

  const handleRegister = async (v: RegisterValues) => {
    setAuthBusy(true); setAuthError('');
    try {
      await api.auth.signUp(v);
      setNotice('Hesabın oluşturuldu! Denemen için 1.000 ₺ demo bakiye hesabına tanımlandı.');
    } catch (e) {
      setAuthError((e as Error).message);
    }
    setAuthBusy(false);
  };

  const handleResetPassword = async (email: string) => {
    setAuthBusy(true); setAuthError('');
    const exists = await api.auth.requestPasswordReset(email);
    setAuthBusy(false);
    if (!exists) { setAuthError('Bu e-posta ile kayıtlı bir demo hesap bulunamadı.'); return; }
    setRecoveryEmail(email);
    openModal('recovery');
  };

  const handleUpdatePassword = async (password: string) => {
    setAuthBusy(true); setAuthError('');
    try {
      await api.auth.updatePassword(recoveryEmail, password);
      setNotice('Şifren güncellendi. Yeni şifrenle giriş yapabilirsin.');
    } catch (e) {
      setAuthError((e as Error).message);
    }
    setAuthBusy(false);
  };

  const handleSignOut = async () => {
    setNavOpen(false);
    await api.auth.signOut();
    setSelectedBets([]);
  };

  /* ---------- Kupon ---------- */
  const toggleBet = (bet: SelectedBet) => {
    setSelectedBets((current) => {
      const same = (b: SelectedBet) => b.eventId === bet.eventId && b.marketType === bet.marketType;
      if (current.some((b) => same(b) && b.selectionLabel === bet.selectionLabel)) {
        return current.filter((b) => !(same(b) && b.selectionLabel === bet.selectionLabel));
      }
      // Aynı marketten tek seçim: yenisi eskisinin yerine geçer
      const withoutSame = current.filter((b) => !same(b));
      if (withoutSame.length >= 12) return current;
      return [...withoutSame, bet];
    });
    setBetError('');
    setBetSuccess('');
  };

  const placeSelectedBet = async (type: BetSlipType, stake: number, freebetId: string | null, systemSize: number | null) => {
    if (!sessionEmail) { openModal('login'); return; }
    if (selectedBets.length === 0 || placing) return;
    setPlacing(true); setBetError(''); setBetSuccess('');

    const preference = (profile?.odds_preference as OddsPreference) || 'accept_any';
    // Tekli: her seçim ayrı kupon
    const batches = type === 'single' ? selectedBets.map((b) => [b]) : [selectedBets];
    const placedBets: SelectedBet[] = [];
    let potential = 0;
    let failure = '';

    for (const batch of batches) {
      try {
        const res = await api.placeBet({
          type, stake, freebetId: batches.length === 1 ? freebetId : null, oddsPreference: preference,
          systemSize: type === 'system' ? systemSize : null,
          selections: batch.map((b) => ({ eventId: b.eventId, homeTeam: b.homeTeam, awayTeam: b.awayTeam, marketType: b.marketType, selectionLabel: b.selectionLabel, odds: b.odds })),
        });
        placedBets.push(...batch);
        potential += res.potentialPayout;
      } catch (e) {
        failure = mapBetError((e as Error).message);
        break;
      }
    }

    if (placedBets.length > 0) {
      playSound('betPlaced');
      const count = type === 'single' ? ` (${placedBets.length} kupon)` : '';
      setBetSuccess(`Kuponun oluşturuldu${count}! Olası kazanç: ${potential.toFixed(2)} ₺`);
      setSelectedBets((cur) => cur.filter((b) => !placedBets.includes(b)));
      if (!failure) setIsCouponOpen(false);
    }
    if (failure) {
      setBetError(placedBets.length > 0 ? `${failure} Kalan seçimler kuponunda duruyor.` : failure);
      playSound('error');
    }
    setPlacing(false);
  };

  const requestCashoutOffer = async (slipId: string): Promise<number | null> => {
    try {
      const res = await api.calculateCashout(slipId);
      if (!res.available || !res.offer) { setBetError('Bu kupon için şu an bozdurma teklifi yok. Kuponun seçimleri sonuçlandıkça teklif oluşur.'); return null; }
      return res.offer;
    } catch {
      setBetError('Bozdurma teklifi alınamadı.');
      return null;
    }
  };

  const handleCashout = async (slipId: string, offer: number) => {
    try {
      const res = await api.executeCashout(slipId, offer);
      playSound('cashout');
      setBetSuccess(`Kupon bozduruldu: ${res.payout.toFixed(2)} ₺ hesabına aktarıldı.`);
    } catch (e) {
      setBetError((e as Error).message.includes('Teklif değişti') ? 'Teklif değişti. Yeni teklifi almak için tekrar dene.' : 'Bozdurma işlemi başarısız.');
      playSound('error');
    }
  };

  const handleOddsPrefChange = async (pref: OddsPreference) => {
    if (!profile) { openModal('login'); return; }
    await api.setOddsPreference(pref);
  };

  const activeSlips: ActiveSlip[] = useMemo(() =>
    betSlips.filter((s) => s.status === 'pending').map((s) => ({
      id: s.id, total_odds: Number(s.total_odds), stake: Number(s.stake), status: s.status,
      potential_payout: Number(s.potential_payout), cashoutable: s.type !== 'system' && !s.freebet_id,
    })),
    [betSlips],
  );

  const prevSlipStatuses = useRef<Record<string, string>>({});
  useEffect(() => {
    const prev = prevSlipStatuses.current;
    if (betSlips.some((s) => s.status === 'won' && prev[s.id] === 'pending')) playSound('win');
    prevSlipStatuses.current = Object.fromEntries(betSlips.map((s) => [s.id, s.status]));
  }, [betSlips]);

  /* ---------- Gezinme ---------- */
  const scrollTo = (id: string) => {
    setNavOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const goMatches = () => scrollTo('matches');
  const goCasino = () => scrollTo('casino');
  const goFooter = () => scrollTo('site-footer');
  const focusSearch = () => {
    setNavOpen(false);
    goMatches();
    window.setTimeout(() => document.getElementById('match-search')?.focus({ preventScroll: true }), 350);
  };
  const pickSport = (name: string) => { setActiveSport(name); goMatches(); };

  const handleNav = (item: string) => {
    setActiveNav(item);
    setNavOpen(false);
    if (item === 'Promosyonlar') openModal('promotions');
    else if (item === 'Spor Bahisleri' || item === 'Canlı Bahis') goMatches();
    else if (['Casino', 'Canlı Casino', 'Slotlar'].includes(item)) goCasino();
    else openModal('info', item);
  };

  const info = (title: string) => () => openModal('info', title);
  const themeLabel = isDark ? 'Açık temaya geç' : 'Koyu temaya geç';

  return (
    <div className={isDark ? 'app-shell' : 'app-shell light-shell'}>
      {demoBanner && (
        <div className="demo-banner" role="note">
          <Info size={15} />
          <span><b>Demo modu:</b> hesaplar, bakiye ve kuponlar yalnızca bu tarayıcıda saklanır; maçlar, oranlar ve skorlar örnektir. Gerçek para yoktur.</span>
          <button type="button" onClick={() => setDemoBanner(false)} aria-label="Bilgilendirmeyi kapat"><X size={15} /></button>
        </div>
      )}

      <header className="topbar">
        <Brand />
        <nav className="primary-nav" aria-label="Ana menü">
          {navItems.map((item) => (
            <button type="button" key={item} className={activeNav === item ? 'nav-item active' : 'nav-item'} onClick={() => handleNav(item)}>{item}</button>
          ))}
        </nav>

        <div className="top-actions">
          <label className="top-search">
            <Search size={17} />
            <input type="search" placeholder="Takım veya lig ara..." aria-label="Takım veya lig ara" value={matchQuery}
              onChange={(e) => setMatchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') goMatches(); }} />
          </label>
          <button type="button" className="icon-btn only-small" aria-label="Maç ara" onClick={focusSearch}><Search size={18} /></button>
          <button type="button" className="icon-btn hide-small" aria-label={soundOn ? 'Ses efektlerini kapat' : 'Ses efektlerini aç'} onClick={toggleSound} data-sound="1">{soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}</button>
          <button type="button" className="icon-btn hide-small" aria-label={themeLabel} onClick={() => setIsDark(!isDark)}>{isDark ? <Sun size={17} /> : <Moon size={17} />}</button>

          {sessionEmail ? (
            <>
              {profile && <span className="balance-pill" title="Bakiye">{Number(profile.balance).toLocaleString('tr-TR', { maximumFractionDigits: 0 })} ₺</span>}
              <button type="button" className="account-btn" onClick={() => openModal('account')} aria-label="Hesabım">
                <UserRound size={15} /> <span className="account-name">{profile?.display_name || 'Hesabım'}</span>
              </button>
              <button type="button" className="login-btn hide-small" onClick={() => void handleSignOut()}>Çıkış</button>
            </>
          ) : (
            <>
              <button type="button" className="login-btn" onClick={() => openModal('login')}>Giriş<span className="hide-xs"> Yap</span></button>
              <button type="button" className="register-btn" onClick={() => openModal('register')}>Kayıt<span className="hide-xs"> Ol</span></button>
            </>
          )}
          <button type="button" className="icon-btn mobile-menu" aria-label={navOpen ? 'Menüyü kapat' : 'Menüyü aç'} aria-expanded={navOpen} onClick={() => setNavOpen(!navOpen)}>
            {navOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {navOpen && (
        <>
          <div className="drawer-backdrop" onClick={() => setNavOpen(false)} />
          <nav className="nav-drawer" aria-label="Menü">
            {navItems.map((item) => (
              <button type="button" key={item} className={activeNav === item ? 'drawer-item active' : 'drawer-item'} onClick={() => handleNav(item)}>{item}</button>
            ))}
            <div className="drawer-tools">
              <button type="button" onClick={() => setIsDark(!isDark)}>{isDark ? <Sun size={16} /> : <Moon size={16} />} {isDark ? 'Açık tema' : 'Koyu tema'}</button>
              <button type="button" onClick={toggleSound} data-sound="1">{soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />} Ses {soundOn ? 'açık' : 'kapalı'}</button>
              {sessionEmail && <button type="button" onClick={() => void handleSignOut()}><LogOut size={16} /> Çıkış yap</button>}
            </div>
          </nav>
        </>
      )}

      <div className="layout">
        <aside className="sidebar" aria-label="Sporlar">
          <button type="button" className="side-link favorites" onClick={goMatches}><Star size={17} fill="currentColor" /> <span>Favorilerim</span></button>
          <div className="sport-list">
            {sports.map((sport) => (
              <button type="button" key={sport.name} className={activeSport === sport.name ? 'side-link current' : 'side-link'} onClick={() => pickSport(sport.name)}>
                <span className="sport-icon" aria-hidden>{sport.icon}</span><span className="side-name">{sport.name}</span>
                {sport.count && <small>{sport.count}</small>}
              </button>
            ))}
          </div>
          <div className="sidebar-section">
            <div className="section-title">Tüm Sporlar <ChevronRight size={16} /></div>
            <button type="button" className="sub-link live" onClick={goMatches}><span className="live-dot" /> Canlı Bahis <b>LIVE</b><small>312</small></button>
            <div className="section-title small-title">Spor Bahisleri</div>
            {['Maç Sonuçları', 'Handikap', 'Toplam Gol', 'İlk Yarı / Maç Sonucu', 'Karşılıklı Gol'].map((item) => (
              <button type="button" className="sub-link" key={item} onClick={goMatches}>{item}</button>
            ))}
          </div>
          {sessionEmail && (
            <div className="sidebar-section">
              <div className="section-title">Hesabım</div>
              <button type="button" className="sub-link with-icon" onClick={() => openModal('wallet')}><Wallet size={14} /> Cüzdan</button>
              <button type="button" className="sub-link with-icon" onClick={() => openModal('bonuses')}><Gift size={14} /> Bonuslarım</button>
              <button type="button" className="sub-link with-icon" onClick={() => openModal('responsible')}><Shield size={14} /> Sorumlu Oyun</button>
            </div>
          )}
        </aside>

        <main className="content">
          <HeroCarousel slideIndex={heroSlideIndex} onDotClick={setHeroSlideIndex} onCtaClick={() => (sessionEmail ? openModal('bonuses') : openModal('register'))} />

          <section className="live-strip" aria-label="Canlı spor dalları">
            <div className="strip-heading">
              <span><span className="live-dot" /> CANLI</span>
              <button type="button" onClick={() => pickSport('Tüm Maçlar')}>Tümü <ChevronRight size={15} /></button>
            </div>
            <div className="live-sports">
              {LIVE_STRIP.map((name, i) => (
                <button type="button" key={name} onClick={() => pickSport(name)}>
                  <strong aria-hidden>{STRIP_ICONS[i]}</strong>
                  <span>{name}</span>
                  <small>{liveSportsCounts[i]}</small>
                </button>
              ))}
            </div>
          </section>

          <LiveTicker matches={liveMatches} />

          <MatchList
            matches={liveMatches}
            selectedBets={selectedBets}
            onToggleBet={toggleBet}
            onOpenTracker={(m) => setTrackerId(m.eventId)}
            query={matchQuery}
            onQueryChange={setMatchQuery}
            sport={activeSport}
            onSportChange={setActiveSport}
          />
        </main>

        <aside className="right-column">
          <div className="coupon-slot">
            {isCouponOpen && <div className="coupon-backdrop" onClick={() => setIsCouponOpen(false)} />}
            <BetSlip
              selectedBets={selectedBets}
              isCouponOpen={isCouponOpen}
              freebets={freebets.filter((f) => f.status === 'available' && (!f.expires_at || new Date(f.expires_at) > new Date()))}
              oddsPreference={(profile?.odds_preference as OddsPreference) || 'accept_any'}
              placing={placing}
              signedIn={Boolean(sessionEmail)}
              onToggleCoupon={() => setIsCouponOpen(!isCouponOpen)}
              onCloseCoupon={() => setIsCouponOpen(false)}
              onRemoveBet={(index) => setSelectedBets((cur) => cur.filter((_, i) => i !== index))}
              onPlaceBet={(type, stake, freebetId, size) => void placeSelectedBet(type, stake, freebetId, size)}
              onRequestCashoutOffer={requestCashoutOffer}
              onCashout={(id, offer) => void handleCashout(id, offer)}
              activeSlips={activeSlips}
              onOddsPrefChange={(p) => void handleOddsPrefChange(p)}
              balance={Number(profile?.balance || 0)}
            />
          </div>
          {betError && <p className="bet-error-banner" role="alert">{betError}</p>}
          {betSuccess && <p className="bet-success-banner" role="status">{betSuccess}</p>}

          <section className="games-card" id="casino">
            <div className="right-heading">
              <h2>Casino Oyunları</h2>
              <button type="button" onClick={info('Casino Oyunları')}>Tümü <ChevronRight size={14} /></button>
            </div>
            <div className="game-grid">
              {games.map((game) => (
                <button type="button" className="game-tile" key={game.name} onClick={info(game.name)}>
                  <div className="game-art" style={{ backgroundImage: game.gradient }}><span aria-hidden>{game.icon}</span></div>
                  <small>{game.name}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="winners-card">
            <div className="right-heading">
              <h2>Son Kazananlar</h2>
              <span className="demo-pill">Örnek</span>
            </div>
            {winners.map(([name, game, amount, icon]) => (
              <div className="winner" key={name}>
                <span className="winner-icon" aria-hidden>{icon}</span>
                <div><strong>{name}</strong><small>{game}</small></div>
                <b>{amount}<small>2 dk önce</small></b>
              </div>
            ))}
          </section>

          <button type="button" className="support-card" onClick={info('Canlı Destek')}>
            <span className="support-icon"><Headphones size={20} /></span>
            <span className="support-text"><strong>7/24 Canlı Destek</strong><small>Her zaman yanındayız!</small></span>
            <CircleHelp size={19} />
          </button>
        </aside>
      </div>

      <CouponFab count={selectedBets.length} onClick={() => setIsCouponOpen(true)} />
      <MobileDock
        sessionEmail={sessionEmail}
        onPromotions={() => openModal('promotions')}
        onBetting={goMatches}
        onAccount={() => (sessionEmail ? openModal('account') : openModal('login'))}
        onSupport={goFooter}
      />

      <SiteFooter onOpen={openModal} onGoMatches={goMatches} onGoCasino={goCasino} />

      {modal && (
        <Modal
          modal={modal}
          onClose={() => setModal(null)}
          notice={notice}
          authError={authError}
          authBusy={authBusy}
          infoTitle={infoTitle}
          profile={profile}
          betSlips={betSlips}
          betSelections={betSelections}
          sessionEmail={sessionEmail}
          transactions={transactions}
          bonuses={bonuses}
          freebets={freebets}
          responsibleLimits={responsibleLimits}
          onLogin={(e, p) => void handleLogin(e, p)}
          onRegister={(v) => void handleRegister(v)}
          onResetPassword={(e) => void handleResetPassword(e)}
          onUpdatePassword={(p) => void handleUpdatePassword(p)}
          onSwitchModal={openModal}
          onResetDemo={() => { api.resetDemo(); setSelectedBets([]); setModal(null); }}
        />
      )}

      {trackerMatch && <MatchTracker match={trackerMatch} onClose={() => setTrackerId(null)} />}
    </div>
  );
}

export default App;
