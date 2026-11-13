/* BrodyBet – saf frontend demo */
const $=s=>document.querySelector(s);
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
if(window.gsap&&window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
const g=window.gsap&&!REDUCE?window.gsap:{from(){},to(){},fromTo(){},set(){},killTweensOf(){},timeline:()=>({to(){return this},from(){return this},fromTo(){return this}})};
const ic=d=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={
home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
sport:'<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18M5.5 5.5c3 4 10 4 13 0M5.5 18.5c3-4 10-4 13 0"/>',
live:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
promo:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
me:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
prov:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
back:'<path d="M15 18l-6-6 6-6"/>',next:'<path d="M9 18l6-6-6-6"/>',
heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
casino:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r=".9"/><circle cx="15.5" cy="15.5" r=".9"/><circle cx="12" cy="12" r=".9"/>',
slots:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
table:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
wallet:'<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 14h2"/>',
support:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>'
};
const I=k=>ic(IC[k]||IC.home);
let promoSwiper=null;

const S={user:null,providers:[],games:[],favs:new Set(),promos:[],matches:[],payments:[],faq:[],unread:0,tx:[],bets:[],summary:null,slip:null,settings:{minPlay:1000,siteName:'BrodyBet'}};
const CITIES=['Adana','Ankara','Antalya','Bursa','Diyarbakır','Erzurum','Eskişehir','Gaziantep','İstanbul','İzmir','Kayseri','Kocaeli','Konya','Mersin','Samsun','Trabzon'];
const DISTRICTS={İstanbul:['Kadıköy','Beşiktaş','Üsküdar','Bakırköy','Şişli','Fatih','Ataşehir','Maltepe'],Ankara:['Çankaya','Keçiören','Yenimahalle','Mamak','Etimesgut'],İzmir:['Konak','Karşıyaka','Bornova','Buca','Bayraklı'],Antalya:['Muratpaşa','Kepez','Konyaaltı','Alanya'],default:['Merkez','1. Bölge','2. Bölge']};
const fmt=c=>'₺'+(c/100).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const lg=(p,big)=>p.icon?`<img class="lgimg${big?' big':''}" src="${p.icon}" alt="${p.name}" title="${p.name}" loading="lazy" decoding="async" onerror="this.style.display='none'">`:`<span class="lg">${p.name}</span>`;
const hue=x=>`linear-gradient(150deg,hsl(${x.hue||200} 42% 22%),hsl(${x.hue||200} 30% 8%))`;
const game=x=>{
 const img=x.image
  ?`<img class="thumb" src="${x.image}" alt="${x.name}" width="300" height="400" loading="lazy" decoding="async" fetchpriority="low" onerror="this.remove()">`
  :'';
 return `<div class="g"><div class="wrap"><button class="art" style="background:${hue(x)}" data-launch="${x.id}" aria-label="${x.name}">${img}<span class="play" aria-hidden="true"><i>${I('play')}</i></span></button><button class="favb ${S.favs.has(x.id)?'on':''}" data-fav="${x.id}" aria-label="Favori">${I('heart')}</button></div><b>${x.name}</b><small>${S.providers.find(p=>p.id===x.provider)?.name||''}</small></div>`;
};
const top=()=>{
 const site=S.settings.siteName||'BrodyBet';
 const loginChip=S.user?.guest?`<button class="chip-login" data-go="me">Giriş Yap</button>`:'';
 return `<div class="top"><img class="brand" src="assets/brand/logo.png" alt="${site}" data-go="home"><span class="sp"></span>${loginChip}<div class="bal"><span id="bal">${fmt(S.user.balance)}</span><button class="plus" data-go="wallet" aria-label="Cüzdan">${I('plus')}</button></div><button class="ib" data-bell aria-label="Bildirimler">${I('bell')}${S.unread?'<i class="dot"></i>':''}</button></div>`;
};
const hd=(t,b,x)=>`<div class="hd"><button class="ib" data-go="${b}" aria-label="Geri">${I('back')}</button><span class="t">${t}</span>${x||'<span style="width:38px"></span>'}</div>`;

let cat='Casino',tab='home',prov=null,pt='Oyunlar',promoId=null,q='',sportFilter='all',walletTab='yatir',profileTab='ozet',first=true,authMode='login',regStep=1,regDraft={},authErr='',stakeAmt=50;
const CATS=[['Casino','casino',''],['Live Casino','live','live'],['Slots','slots','slots'],['Table Games','table','table'],['Promosyonlar','promo','']];
const catRow=()=>`<div class="cats">${CATS.map(c=>`<button class="${c[0]==cat?'on':''}" data-cat="${c[0]}">${I(c[1])}${c[0]}</button>`).join('')}</div>`;
const byCat=l=>{const k=CATS.find(c=>c[0]==cat)?.[2];return k?l.filter(g=>g.category==k):l};
const none='<div class="empty">Bu kategoride içerik yok.</div>';
const when=t=>new Date(t).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const TXN={deposit:'Yükleme',bonus:'Bonus',withdraw:'Çekim',bet:'Bahis',win:'Kazanç'};

const promoCard=x=>`<button class="bcard" data-promo="${x.id}"><img src="${x.image}" alt="${x.title}" loading="lazy"><div class="bmeta"><span class="bbadge">${x.badge||''}</span><h3>${x.title}</h3><p>${x.subtitle||x.desc}</p>${x.claimed?'<em class="taken">Alındı</em>':''}</div></button>`;
const matchRow=m=>{
 const odds=Object.entries(m.odds).filter(([,v])=>v!=null).map(([k,v])=>`<button class="odd" data-bet="${m.id}" data-sel="${k}" data-odd="${v}" data-label="${m.home} vs ${m.away} · ${k}">${k}<b>${v.toFixed(2)}</b></button>`).join('');
 return `<div class="mrow ${m.live?'is-live':''}"><div class="mhead"><span>${m.league}</span><span>${m.live?`<i class="live-dot"></i> ${m.score||'Canlı'}`:m.time}</span></div><div class="mteams"><strong>${m.home}</strong><span>vs</span><strong>${m.away}</strong></div><div class="odds">${odds}</div></div>`;
};
const plist=()=>{const l=S.providers.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||(p.type||'').includes(q.toLowerCase()));
 return l.length?l.map(p=>`<button class="prow" data-p="${p.id}"><span class="l">${lg(p)}</span><span><strong>${p.name}</strong><small>${p.type==='infra'?'Altyapı · ':''}${p.tagline}</small></span><span class="go">${I('next')}</span></button>`).join(''):'<div class="empty">Sonuç bulunamadı.</div>'};
const slipBox=()=>{
 if(!S.slip)return '';
 const pot=Math.round(stakeAmt*100*S.slip.odd);
 return `<div class="slip"><div class="slip-h"><strong>Kupon</strong><button type="button" data-clear-slip>Temizle</button></div><p>${S.slip.label}</p><p class="muted">Oran <b>${S.slip.odd.toFixed(2)}</b></p><div class="stake-row"><input id="stake" type="number" min="1" step="1" value="${stakeAmt}"><span>₺</span></div><p class="muted">Olası getiri: <b>${fmt(pot)}</b></p><button class="btn" type="button" data-place-bet>Bahis Yap</button></div>`;
};

function gateMsg(err){
 const m=err?.message||'';
 if(err?.status===401||/giriş/i.test(m)){toast(m||'Oynamak için giriş yap');tab='me';authMode='login';render();return true}
 if(/yetersiz bakiye/i.test(m)){toast(m);tab='wallet';walletTab='yatir';render();return true}
 return false;
}

const V={
home:()=>{const gl=byCat(S.games);const live=S.matches.filter(m=>m.live).slice(0,2);
 const featured=(cat==='Casino'?gl.filter(x=>x.isNew):gl).slice(0,10);
 return top()+`<div class="quick"><button data-go="sport">${I('sport')}Spor</button><button data-go="live">${I('live')}Canlı</button><button data-go="games">${I('casino')}Casino</button><button data-go="promo">${I('promo')}Bonus</button><button data-go="wallet">${I('wallet')}Cüzdan</button><button data-go="support">${I('support')}Destek</button></div>
<div class="hero"><h1>${S.settings.siteName||'BrodyBet'}</h1><h2>SPOR · CASİNO · CANLI</h2><p>${S.games.length}+ oyun · sanal krediyle demo deneyim.</p><div class="hero-actions"><button class="cta" data-go="sport">Bahis Yap ${I('arrow')}</button><button class="cta alt" data-go="promo">Bonusları Gör</button></div></div>
<div class="sec">Öne Çıkan Bonuslar<a data-go="promo">Tümü</a></div>
<div class="swiper swiper-promo"><div class="swiper-wrapper">${S.promos.slice(0,5).map(x=>`<div class="swiper-slide">${promoCard(x)}</div>`).join('')}</div><div class="swiper-pagination"></div></div>
${live.length?`<div class="sec">Canlı Bahis<a data-go="live">Tümü</a></div><div class="mgrid">${live.map(matchRow).join('')}</div>`:''}
<div class="sec">Popüler Sağlayıcılar<a data-go="prov">Tümünü Gör</a></div>
<div class="pgrid">${S.providers.filter(p=>p.type!=='infra').slice(0,9).map(p=>`<button class="pbox" data-p="${p.id}">${lg(p)}</button>`).join('')}</div>
<div class="sec">${cat==='Casino'?'Yeni Oyunlar':cat}<a data-go="games">Tümünü Gör</a></div>
${featured.length?`<div class="rail">${featured.map(game).join('')}</div>`:none}`},

sport:()=>{const list=sportFilter==='all'?S.matches.filter(m=>!m.live):S.matches.filter(m=>!m.live&&m.sport===sportFilter);
 const sports=['all',...new Set(S.matches.map(m=>m.sport))];
 return top()+`<div class="sec" style="padding-top:8px">Spor Bahisleri</div>
<div class="cats">${sports.map(s=>`<button class="${sportFilter===s?'on':''}" data-sfilter="${s}">${s==='all'?'Tümü':s}</button>`).join('')}</div>
<div class="mgrid">${list.length?list.map(matchRow).join(''):none}</div>${slipBox()}`},

live:()=>{const list=S.matches.filter(m=>m.live);
 return top()+`<div class="sec" style="padding-top:8px"><span class="live-tag"><i class="live-dot"></i> Canlı Bahis</span></div>
<div class="mgrid">${list.length?list.map(matchRow).join(''):'<div class="empty">Şu an canlı maç yok.</div>'}</div>${slipBox()}`},

games:()=>{const gl=byCat(S.games);
 return top()+catRow()+`<div class="sec" style="padding-top:6px">Casino · ${gl.length} oyun</div>${gl.length?`<div class="games">${gl.map(game).join('')}</div>`:none}`},

prov:()=>hd('Sağlayıcılar','home')+`<label class="search">${I('search')}<input id="q" placeholder="Sağlayıcı veya altyapı ara…" value="${q}"></label><div id="pl">${plist()}</div>`,

detail:()=>{const p=S.providers.find(x=>x.id==prov),gl=S.games.filter(g=>g.provider==prov);
 if(!p)return hd('Sağlayıcı','prov')+'<div class="empty">Bulunamadı.</div>';
 return hd(p.name,'prov')+`<div class="pbanner">${lg(p,true)}<p>${p.about}</p></div>
<div class="seg">${['Oyunlar','Hakkında','Canlı Casino'].map(t=>`<button class="${t==pt?'on':''}" data-pt="${t}">${t}${t=='Oyunlar'?` (${gl.length})`:''}</button>`).join('')}</div>`+
(pt=='Oyunlar'?`<div class="games">${gl.map(game).join('')||none}</div>`:pt=='Hakkında'?`<div class="card"><h3>${p.name}</h3><p>${p.tagline}. ${p.about}</p></div>`:(g=>g.length?`<div class="games">${g.map(game).join('')}</div>`:'<div class="empty">Bu sağlayıcının canlı masası yok.</div>')(gl.filter(x=>x.category=='live')))},

promo:()=>top()+`<div class="sec" style="padding-top:6px">Promosyonlar & Bonuslar</div>
<p class="lead">Bonus kartına tıklayarak şartları görüntüle.</p>
<div class="blist">${S.promos.map(promoCard).join('')}</div>`,

promodetail:()=>{const x=S.promos.find(p=>p.id===promoId);
 if(!x)return hd('Bonus','promo')+'<div class="empty">Bonus bulunamadı.</div>';
 const block=(t,body)=>`<div class="card term"><h3>${t}</h3>${body}</div>`;
 return hd('Bonus şartları','promo')+`<div class="promo-hero"><img src="${x.image}" alt="${x.title}"><div class="promo-overlay"><span class="bbadge">${x.badge||''}</span><h1>${x.title}</h1><p>${x.subtitle||''}</p></div></div>
${block('Bonus özeti',`<p>${x.summary||x.desc}</p>`)}
${block('Kimler yararlanabilir',`<p>${x.eligible||'—'}</p>`)}
${block('Limitler',`<ul class="tlist"><li>Minimum yatırım: <b>${x.minDeposit||'—'}</b></li><li>Maksimum bonus: <b>${x.maxBonus||'—'}</b></li></ul>`)}
${block('Çevrim',`<p>${x.wager||'—'}</p>`)}
${block('Süre',`<p>${x.duration||'—'}</p>`)}
${block('Çekim koşulları',`<p>${x.withdraw||'—'}</p>`)}
${x.example?block('Örnek hesaplama',`<p>${x.example}</p>`):''}
${block('Şartlar',`<ul class="tlist">${(x.terms||[]).map(t=>`<li>${t}</li>`).join('')}</ul>`)}
${(x.exceptions||[]).length?block('İstisnalar',`<ul class="tlist">${x.exceptions.map(t=>`<li>${t}</li>`).join('')}</ul>`):''}
<button class="wide" data-claim="${x.id}" ${x.claimed?'disabled':''}>${x.claimed?'Bu bonus alındı':'Bonusu Al (demo)'}</button>
<p class="disclaimer">Demo ortamında gerçek para yoktur.</p>`},

wallet:()=>{const u=S.user;
 return top()+`<div class="sec" style="padding-top:6px">Cüzdan</div>
<div class="card bal-card"><h3>${fmt(u.balance)}</h3><p>Sanal kredi · min oyun ${fmt(S.settings.minPlay||1000)}</p></div>
<div class="seg">${[['yatir','Yatır'],['cek','Çek'],['yontem','Yöntemler']].map(([k,l])=>`<button class="${walletTab===k?'on':''}" data-wtab="${k}">${l}</button>`).join('')}</div>`+
(walletTab==='yatir'?`<div class="chips">${[100,250,500,1000].map(a=>`<button data-dep="${a}">+${a} ₺</button>`).join('')}</div>
<p class="lead">Ödeme yöntemi (demo):</p><div class="paygrid">${S.payments.map(p=>`<button class="pay" data-dep-method="${p.id}" data-dep="250"><strong>${p.name}</strong><small>${p.type} · ${p.eta}</small></button>`).join('')}</div>`:
walletTab==='cek'?`<div class="card"><p>Çekim simülasyondur.</p></div><div class="chips">${[50,100,250].map(a=>`<button data-wd="${a}">${a} ₺ çek</button>`).join('')}</div>`:
`<div class="paygrid">${S.payments.map(p=>`<div class="pay static"><strong>${p.name}</strong><small>${p.type} · ${p.eta}</small></div>`).join('')}</div>`)+
`<div class="sec">Son İşlemler</div>`+(S.tx.length?S.tx.map(t=>`<div class="tx"><span>${t.note||TXN[t.type]||t.type}<small>${when(t.at)}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`).join(''):'<div class="empty">Henüz işlem yok.</div>')},

support:()=>top()+`<div class="sec" style="padding-top:6px">Destek & SSS</div>
${S.faq.map(f=>`<details class="faq"><summary>${f.q}</summary><p>${f.a}</p></details>`).join('')}
<button class="wide alt" data-support>Canlı destek talebi (demo)</button>
<div class="card"><h3>Sorumlu oyun</h3><p class="muted">18+ · Yalnızca demo / sanal kredi.</p></div>`,

me:()=>{const u=S.user;
 if(u.guest)return top()+authViews();
 const tabs=[['ozet','Özet'],['bilgi','Bilgilerim'],['finans','Finansal'],['bahis','Bahisler'],['bonus','Bonuslar'],['guvenlik','Güvenlik']];
 return top()+`<div class="sec" style="padding-top:6px">Profilim</div>
<div class="card bal-card"><h3>${fmt(u.balance)}</h3><p>${u.firstName||''} ${u.lastName||''} · @${u.username}</p></div>
<div class="seg scroll">${tabs.map(([k,l])=>`<button class="${profileTab===k?'on':''}" data-ptab="${k}">${l}</button>`).join('')}</div>
${profileBody(u)}
<div style="padding:8px 16px 20px"><button class="btn alt" style="width:100%" data-logout>Çıkış yap</button></div>`}
};

const row=(l,v)=>`<div class="pinfo"><span>${l}</span><b>${v||'—'}</b></div>`;
const maskTC=t=>t&&t.length===11?t.slice(0,3)+'*****'+t.slice(-3):'—';
const maskPhone=p=>{const s=String(p||'');return s.length>4?s.slice(0,3)+'***'+s.slice(-2):'—'};

function profileBody(u){
 const sm=S.summary||{};
 if(profileTab==='ozet')return `<div class="kpi3">
  <div class="kpi"><small>Bakiye</small><strong>${fmt(u.balance)}</strong></div>
  <div class="kpi"><small>Yatırım</small><strong>${fmt(sm.deposits||0)}</strong></div>
  <div class="kpi"><small>Çekim</small><strong>${fmt(sm.withdrawals||0)}</strong></div>
  <div class="kpi"><small>Bonus</small><strong>${fmt(sm.bonuses||0)}</strong></div>
  <div class="kpi"><small>Bahis</small><strong>${sm.bets||0}</strong></div>
  <div class="kpi"><small>Kazanan</small><strong>${sm.wins||0}</strong></div>
 </div>
 <div class="list-links">
  <button data-go="wallet">${I('wallet')} Cüzdan</button>
  <button data-go="promo">${I('promo')} Bonuslar</button>
  <button data-go="support">${I('support')} Destek</button>
 </div>`;
 if(profileTab==='bilgi')return `<div class="card"><p class="muted" style="margin-bottom:10px">Bilgiler yalnızca görüntülenir; değiştirilemez.</p>
  ${row('Ad',u.firstName)}${row('Soyad',u.lastName)}${row('T.C. Kimlik',maskTC(u.tc))}
  ${row('E-posta',u.email)}${row('Telefon',maskPhone(u.phone))}
  ${row('Adres',u.address)}${row('İl',u.city)}${row('İlçe',u.district)}
  ${row('Kullanıcı adı',u.username)}${row('Promosyon kodu',u.promoCode||'—')}
  ${row('Üyelik',when(u.createdAt))}${row('KYC',u.kycStatus)}
 </div>`;
 if(profileTab==='finans'){const fin=S.tx.filter(t=>['deposit','withdraw','bonus','win'].includes(t.type));
  return `<div class="card"><h3>Finansal özet</h3><p>Yatırım ${fmt(sm.deposits||0)} · Çekim ${fmt(sm.withdrawals||0)} · Bonus ${fmt(sm.bonuses||0)}</p></div>`+
  (fin.length?fin.map(t=>`<div class="tx"><span>${t.note||TXN[t.type]||t.type}<small>${when(t.at)} · ${t.status||'Tamamlandı'}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`).join(''):'<div class="empty">Finansal işlem yok.</div>')}
 if(profileTab==='bahis')return S.bets.length?S.bets.map(b=>`<div class="tx"><span>${b.selection}<small>${when(b.at)} · oran ${b.odd} · ${b.status}</small></span><span class="${b.won?'pos':'neg'}">${b.won?'+':'-'}${fmt(b.won?b.payout:b.stake)}</span></div>`).join(''):'<div class="empty">Bahis geçmişi boş.</div>';
 if(profileTab==='bonus'){const claimed=S.promos.filter(p=>p.claimed);
  return claimed.length?claimed.map(p=>`<div class="card"><h3>${p.title}</h3><p>${p.subtitle||p.desc}</p><p class="muted">Durum: Alındı · ${fmt(p.bonus||0)}</p></div>`).join('')+'<button class="wide alt" data-go="promo">Tüm bonuslar</button>':'<div class="empty">Henüz bonus alınmadı.</div><button class="wide" data-go="promo">Bonuslara git</button>'}
 if(profileTab==='guvenlik')return `<div class="card">
  ${row('Hesap durumu','Aktif')}${row('KYC doğrulama',u.kycStatus)}
  ${row('2FA','Kapalı (demo)')}${row('Son giriş','Bu oturum')}
  <p class="muted" style="margin-top:12px">Güvenlik ayarları demo ortamında değiştirilemez.</p>
 </div>`;
 return '';
}

function authViews(){
 if(authMode==='login')return `<div class="sec" style="padding-top:6px">Giriş yap</div>
<form class="form" id="af"><input name="username" placeholder="Kullanıcı adı" autocomplete="username" required>
<input name="password" type="password" placeholder="Şifre" autocomplete="current-password" required>
<button class="btn" type="submit">Giriş yap</button>
<button type="button" class="btn alt" data-mode>Hesap oluştur</button></form><div class="err">${authErr}</div>`;
 const d=regDraft,cities=CITIES.map(c=>`<option value="${c}" ${d.city===c?'selected':''}>${c}</option>`).join('');
 const distList=DISTRICTS[d.city]||DISTRICTS.default;
 const dists=distList.map(x=>`<option value="${x}" ${d.district===x?'selected':''}>${x}</option>`).join('');
 if(regStep===1)return `<div class="sec" style="padding-top:6px">Kayıt · 1/2</div>
<p class="lead">Kişisel ve iletişim bilgileri</p>
<div class="steps"><i class="on"></i><i></i></div>
<form class="form" id="reg1">
<div class="row"><input name="firstName" placeholder="Ad" required value="${escAttr(d.firstName)}"><input name="lastName" placeholder="Soyad" required value="${escAttr(d.lastName)}"></div>
<input name="tc" placeholder="T.C. Kimlik No" inputmode="numeric" maxlength="11" required value="${escAttr(d.tc)}">
<input name="email" type="email" placeholder="E-posta" required value="${escAttr(d.email)}">
<input name="phone" placeholder="Telefon (05xx...)" inputmode="tel" required value="${escAttr(d.phone)}">
<input name="address" placeholder="Adres" required value="${escAttr(d.address)}">
<div class="row"><select name="city" required id="citySel"><option value="">İl</option>${cities}</select>
<select name="district" required id="distSel"><option value="">İlçe</option>${dists}</select></div>
<button class="btn" type="submit">Devam et</button>
<button type="button" class="btn alt" data-mode>Girişe dön</button></form><div class="err">${authErr}</div>`;
 return `<div class="sec" style="padding-top:6px">Kayıt · 2/2</div>
<p class="lead">Hesap bilgileri</p>
<div class="steps"><i class="on"></i><i class="on"></i></div>
<form class="form" id="af">
<input name="username" placeholder="Kullanıcı adı" autocomplete="username" required value="${escAttr(d.username)}">
<input name="password" type="password" placeholder="Şifre (en az 8 karakter)" autocomplete="new-password" required>
<input name="password2" type="password" placeholder="Şifre tekrar" autocomplete="new-password" required>
<input name="promoCode" placeholder="Promosyon kodu (opsiyonel)" value="${escAttr(d.promoCode)}">
<label class="check"><input type="checkbox" name="terms" required> 18+ olduğumu ve şartları kabul ediyorum.</label>
<button class="btn" type="submit">Kayıt ol</button>
<button type="button" class="btn alt" data-reg-back>Geri</button></form><div class="err">${authErr}</div>`;
}
const escAttr=s=>String(s??'').replace(/"/g,'&quot;');

const N=[['home','Ana Sayfa'],['sport','Spor'],['live','Canlı'],['games','Casino'],['me','Hesap']];
$('#nav').insertAdjacentHTML('beforeend',N.map(n=>`<button data-go="${n[0]}">${I(n[0]==='games'?'casino':n[0])}${n[1]}</button>`).join(''));

function navKey(){
 if(tab==='detail'||tab==='prov')return 'games';
 if(tab==='promodetail'||tab==='promo')return 'home';
 if(tab==='wallet'||tab==='support')return 'me';
 return tab;
}
function showWelcome(name){
 document.querySelector('.welcome-pop')?.remove();
 const d=document.createElement('div');d.className='welcome-pop';
 d.innerHTML=`<div class="welcome-card"><button class="welcome-x" type="button" aria-label="Kapat">×</button>
 <img src="assets/brand/welcome-popup.png" alt="Hoş geldiniz" onerror="this.src='assets/brand/welcome-banner.png'">
 <div class="welcome-body"><h2>Hoş geldiniz${name?`, ${name}`:''}!</h2>
 <p>BrodyBet hesabın hazır. Bonusları keşfet, spor ve casino’nun tadını çıkar.</p>
 <button type="button" class="btn welcome-ok">Devam et</button></div></div>`;
 document.body.appendChild(d);
 const close=()=>{g.to(d,{opacity:0,duration:.2,onComplete:()=>d.remove()})};
 d.querySelector('.welcome-x').onclick=close;
 d.querySelector('.welcome-ok').onclick=close;
 d.addEventListener('click',e=>{if(e.target===d)close()});
 g.fromTo(d,{opacity:0},{opacity:1,duration:.25});
 g.fromTo(d.querySelector('.welcome-card'),{y:24,scale:.96},{y:0,scale:1,duration:.4,ease:'power3.out'});
}
function moveInd(){
 const on=navKey(),b=[...document.querySelectorAll('#nav button')];
 b.forEach(x=>x.classList.toggle('on',x.dataset.go==on));
 const a=b.find(x=>x.dataset.go==on);if(!a)return;
 const r=a.getBoundingClientRect(),n=$('#nav').getBoundingClientRect(),x=r.left-n.left+r.width/2-18;
 g.to('#ind',{x,duration:.45,ease:'power3.out'});if(REDUCE)$('#ind').style.transform=`translateX(${x}px)`;
}
function killPromoSwiper(){if(promoSwiper){try{promoSwiper.destroy(true,true)}catch(_){}promoSwiper=null}}
function mountPromoSwiper(){
 killPromoSwiper();
 if(!window.Swiper||!$('.swiper-promo'))return;
 promoSwiper=new Swiper('.swiper-promo',{
  slidesPerView:'auto',spaceBetween:12,speed:650,
  autoplay:REDUCE?false:{delay:3800,disableOnInteraction:false,pauseOnMouseEnter:true},
  pagination:{el:'.swiper-promo .swiper-pagination',clickable:true},
  resistanceRatio:.65
 });
}
function intro(){
 if(window.ScrollTrigger) ScrollTrigger.getAll().forEach(t=>t.kill());
 g.from('.top > *',{y:-10,opacity:0,stagger:.04,duration:.4,ease:'power3.out'});
 g.from('.hero',{y:18,opacity:0,duration:.55,ease:'power3.out',delay:.05});
 g.from('.quick button',{y:12,opacity:0,stagger:.04,duration:.35,ease:'power3.out',delay:.08,clearProps:'transform'});
 const reveal=document.querySelectorAll('.bcard,.mrow,.g,.prow,.card,.pay,.faq,.swiper-promo,.rail,.pbox');
 if(reveal.length){
  if(window.ScrollTrigger&&!REDUCE){
   g.from(reveal,{y:18,opacity:0,stagger:.02,duration:.4,ease:'power3.out',clearProps:'all',
    scrollTrigger:{trigger:'#app',start:'top 85%',toggleActions:'play none none none'}});
  }else g.from(reveal,{y:14,opacity:0,stagger:.02,duration:.35,ease:'power3.out',delay:.1,clearProps:'all'});
 }
 const b=$('#bal');if(b&&first){const o={v:0},end=S.user.balance;g.to(o,{v:end,duration:1,ease:'power2.out',delay:.15,onUpdate(){b.textContent=fmt(o.v)},onComplete(){b.textContent=fmt(S.user.balance)}});first=false}
}
function render(anim=true){
 killPromoSwiper();
 if(window.ScrollTrigger) ScrollTrigger.getAll().forEach(t=>t.kill());
 $('#app').innerHTML=V[tab]?V[tab]():'<div class="empty">Sayfa yok.</div>';moveInd();
 const i=$('#q');if(i)i.oninput=e=>{q=e.target.value;$('#pl').innerHTML=plist()};
 const f=$('#af');if(f)f.onsubmit=auth;
 const r1=$('#reg1');if(r1)r1.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));regDraft={...regDraft,...d};regStep=2;authErr='';render(false)};
 const city=$('#citySel');if(city)city.onchange=()=>{regDraft.city=city.value;regDraft.district='';const sel=$('#distSel');const list=DISTRICTS[city.value]||DISTRICTS.default;sel.innerHTML='<option value="">İlçe</option>'+list.map(x=>`<option value="${x}">${x}</option>`).join('')};
 mountPromoSwiper();
 if(anim){scrollTo(0,0);intro()}
}
function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);
 g.fromTo(d,{y:12,opacity:0},{y:0,opacity:1,duration:.3});g.to(d,{opacity:0,y:8,duration:.3,delay:1.8,onComplete:()=>d.remove()});setTimeout(()=>d.remove(),2400)}
const setBal=b=>{S.user.balance=b;const e=$('#bal');if(e)e.textContent=fmt(b)};
async function loadUserData(){
 const [f,p,n,set]=await Promise.all([api('/favorites'),api('/promotions'),api('/notifications'),api('/settings')]);
 S.favs=new Set(f.favorites);S.promos=p.promotions;S.unread=n.unread;S.settings=set.settings||S.settings}
async function loadTx(){S.tx=(await api('/wallet/transactions')).transactions}
async function loadProfileExtra(){
 if(S.user?.guest){S.bets=[];S.summary=null;return}
 const [b,s]=await Promise.all([api('/bets'),api('/profile/summary')]);
 S.bets=b.bets;S.summary=s.summary}
async function loadExtra(){
 const [sp,pay,faq]=await Promise.all([api('/sports'),api('/payments'),api('/faq')]);
 S.matches=sp.matches;S.payments=pay.payments;S.faq=faq.faq}
async function auth(e){e.preventDefault();
 const raw=Object.fromEntries(new FormData(e.target));
 const payload=authMode==='register'?{...regDraft,...raw}:raw;
 try{const r=await api('/auth/'+(authMode=='login'?'login':'register'),'POST',payload);S.user=r.user;authErr='';regStep=1;regDraft={};
  await Promise.all([loadUserData(),loadTx(),loadProfileExtra()]);first=true;render();
  showWelcome(S.user.firstName||S.user.username)}
 catch(x){authErr=x.message;$('.err').textContent=authErr}}
async function act(fn){try{await fn()}catch(x){if(!gateMsg(x))toast(x.message)}}

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-go],[data-p],[data-cat],[data-pt],[data-fav],[data-launch],[data-claim],[data-dep],[data-dep-method],[data-wd],[data-bell],[data-mode],[data-logout],[data-promo],[data-bet],[data-sfilter],[data-wtab],[data-ptab],[data-reg-back],[data-support],[data-clear-slip],[data-place-bet]');
 if(!b||!S.user)return;const d=b.dataset;
 if(d.go){tab=d.go;if(tab==='me'||tab==='wallet')Promise.all([loadTx(),loadProfileExtra()]).then(()=>(tab==='me'||tab==='wallet')&&render(false));else render()}
 else if(d.ptab){profileTab=d.ptab;render(false)}
 else if('regBack' in d){regStep=1;authErr='';render(false)}
 else if(d.p){prov=d.p;pt='Oyunlar';tab='detail';render()}
 else if(d.promo){promoId=d.promo;tab='promodetail';render()}
 else if(d.cat){if(d.cat==='Promosyonlar'){tab='promo';render();return}cat=d.cat;tab='games';render(false)}
 else if(d.pt){pt=d.pt;render(false)}
 else if(d.sfilter){sportFilter=d.sfilter;render(false)}
 else if(d.wtab){walletTab=d.wtab;render(false)}
 else if(d.bet){if(S.user.guest){toast('Oynamak için giriş yap');tab='me';render();return}
  S.slip={id:d.bet,sel:d.sel,odd:+d.odd,label:d.label};toast('Kuponuna eklendi');render(false)}
 else if('clearSlip' in d){S.slip=null;render(false)}
 else if('placeBet' in d)act(async()=>{
  const st=$('#stake');stakeAmt=Math.max(1,+(st?.value||stakeAmt));
  if(!S.slip)return toast('Kupon boş');
  const r=await api('/bets','POST',{stake:stakeAmt,odd:S.slip.odd,selection:S.slip.label});
  setBal(r.balance);S.slip=null;await Promise.all([loadTx(),loadProfileExtra()]);toast(r.won?'Tebrikler, kazandın!':'Bu tur kaybettin (demo)');render(false)})
 else if(d.fav)act(async()=>{const on=S.favs.has(d.fav);on?S.favs.delete(d.fav):S.favs.add(d.fav);document.querySelectorAll(`[data-fav="${d.fav}"]`).forEach(x=>x.classList.toggle('on',!on));
  try{await api('/favorites/'+d.fav,on?'DELETE':'POST')}catch(x){on?S.favs.add(d.fav):S.favs.delete(d.fav);document.querySelectorAll(`[data-fav="${d.fav}"]`).forEach(y=>y.classList.toggle('on',on));throw x}})
 else if(d.launch)act(async()=>toast((await api(`/games/${d.launch}/launch`,'POST')).message))
 else if(d.claim)act(async()=>{const r=await api(`/promotions/${d.claim}/claim`,'POST');setBal(r.balance);const p=S.promos.find(x=>x.id==d.claim);if(p)p.claimed=true;toast('Bonus hesabına eklendi');render(false)})
 else if(d.dep||d.depMethod)act(async()=>{const amount=+(d.dep||250);const r=await api('/wallet/deposit','POST',{amount,method:d.depMethod||'havale'});setBal(r.balance);await loadTx();toast(`+${amount} ₺ yüklendi`);render(false)})
 else if(d.wd)act(async()=>{const r=await api('/wallet/withdraw','POST',{amount:+d.wd});setBal(r.balance);await loadTx();toast(`${d.wd} ₺ çekim simüle edildi`);render(false)})
 else if('bell' in d)act(async()=>{const n=await api('/notifications');toast(n.notifications[0]?.title||'Yeni bildirim yok');if(n.unread){await api('/notifications/read','POST');S.unread=0;document.querySelector('.dot')?.remove()}})
 else if('mode' in d){authMode=authMode=='login'?'register':'login';regStep=1;authErr='';render(false)}
 else if('logout' in d){localStorage.removeItem('bw_session');location.reload()}
 else if('support' in d)act(async()=>{toast((await api('/support','POST')).message)})
});

document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(b)g.to(b,{scale:.97,duration:.1})});
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>g.to('button',{scale:1,duration:.2,ease:'back.out(2)',overwrite:'auto'}),true));
addEventListener('resize',moveInd);

(async()=>{
 try{
  try{S.user=(await api('/me')).user}catch(x){if(x.status&&x.status!=401)throw x;S.user=(await api('/auth/guest','POST')).user}
  const [p,gm]=await Promise.all([api('/providers'),api('/games')]).then(r=>[r[0].providers,r[1].games]);
  S.providers=p;S.games=gm;await Promise.all([loadUserData(),loadTx(),loadExtra(),loadProfileExtra()]);render();
 }catch(x){$('#app').innerHTML='<div class="empty">Veriler yüklenemedi.<br>Sayfayı yenile.</div>'}
})();
