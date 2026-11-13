/* BrodyBet – saf frontend demo (v3) */
const $=s=>document.querySelector(s);
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
const NOOP={from(){},to(){},fromTo(){},set(){},killTweensOf(){},timeline:()=>({to(){return this},from(){return this},fromTo(){return this}})};
const g=window.gsap&&!REDUCE?window.gsap:NOOP;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escAttr=esc;

/* ---- icons: Phosphor (Bold = I, Fill = IF) ---- */
const ICONS=window.ICONS||{};
const I=(k,cls='')=>`<svg class="i${cls?' '+cls:''}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${ICONS[k]||ICONS.grid||''}</svg>`;
const IF=(k,cls='')=>`<svg class="i${cls?' '+cls:''}" viewBox="0 0 256 256" fill="currentColor" aria-hidden="true">${ICONS[k+'F']||ICONS[k]||''}</svg>`;

/* ---- brand ---- */
let markN=0;
const MARK_T=`<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="bbg__" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2FF6A"/><stop offset=".55" stop-color="#BDF23A"/><stop offset="1" stop-color="#86D61B"/></linearGradient><mask id="bbm__"><rect width="64" height="64" fill="#fff"/><path d="M12 43.2L52 21.6L53.4 24.2L13.4 45.8Z" fill="#000"/></mask></defs><rect width="64" height="64" rx="17" fill="url(#bbg__)"/><rect x=".75" y=".75" width="62.5" height="62.5" rx="16.25" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/><path d="M18 13H35.5C42 13 46 16.6 46 22.2C46 26 44 28.7 40.6 30C45 31.1 47.6 34.4 47.6 39C47.6 45.4 43 51 35.6 51H18ZM26.5 20V28H34C36.6 28 38 26.6 38 24C38 21.4 36.6 20 34 20ZM26.5 34.6V44H35C37.8 44 39.4 42.4 39.4 39.3C39.4 36.2 37.8 34.6 35 34.6Z" fill="#0A0F0B" fill-rule="evenodd" mask="url(#bbm__)"/></svg>`;
const markSVG=(style='')=>{const n=++markN;return MARK_T.replace(/__/g,n).replace('class="logo-mark"',`class="logo-mark"${style?` style="${style}"`:''}`)};
const siteName=()=>String(S.settings.siteName||'BrodyBet');
const logoHTML=()=>{
 const site=siteName(),m=site.match(/^(.*?)(Bet)$/i);
 const word=m?`${esc(m[1])}<em>${esc(m[2])}</em>`:esc(site);
 return `<span class="logo" data-go="home" role="link" aria-label="${esc(site)} ana sayfa">${markSVG()}<span class="logo-word">${word}</span></span>`;
};

let promoSwiper=null;
const S={user:null,providers:[],games:[],favs:new Set(),promos:[],matches:[],payments:[],faq:[],unread:0,tx:[],bets:[],summary:null,slip:null,settings:{minPlay:1000,siteName:'BrodyBet'}};
const PLACES=window.TR_PLACES||{};
const CITIES=Object.keys(PLACES);
const fmt=c=>'₺'+(c/100).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const tl=n=>Number(n||0).toLocaleString('tr-TR')+' ₺';
const provName=id=>S.providers.find(p=>p.id===id)?.name||'';
const safeUrl=u=>{const s=String(u||'');return /^(assets\/|data:image\/(png|jpe?g|gif|webp|svg\+xml);|https:\/\/)/i.test(s)?s:''};
const imgFallback=`onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'lg',textContent:this.alt}))"`;
const monoLogo=p=>{const u=safeUrl(p.logo||p.icon);return u?`<img class="mono${p.logo?'':' raw'}" src="${esc(u)}" alt="${esc(p.name)}" loading="lazy" decoding="async" ${imgFallback}>`:`<span class="lg">${esc(p.name)}</span>`};
const demoUrl=g=>{const [t,c]=String(g.play||'').split(':');if(!c)return '';const e=encodeURIComponent;
 if(t==='pp')return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${e(c)}&websiteUrl=${e('https://demogamesfree.pragmaticplay.net')}&jurisdiction=99&lobby_url=${e(location.origin+location.pathname)}&lang=TR&cur=TRY`;
 if(t==='spribe')return `https://demo.spribe.io/launch/${e(c)}?currency=USD&lang=TR&returnurl=${e(location.origin+location.pathname)}`;
 if(t==='png')return `https://asccw.playngonetwork.com/casino/ContainerLauncher?pid=2&gid=${e(c)}&lang=tr_TR&practice=1&channel=${innerWidth<768?'mobile':'desktop'}&demo=2`;
 return ''};
const hue=x=>`linear-gradient(150deg,hsl(${Number(x.hue)||200} 42% 22%),hsl(${Number(x.hue)||200} 30% 8%))`;
const game=x=>{
 const src=safeUrl(x.image);
 const img=src?`<img class="thumb" src="${esc(src)}" alt="" width="300" height="400" loading="lazy" decoding="async" onerror="this.remove()">`:`<span class="gname">${esc(x.name)}</span>`;
 const tag=x.category==='live'?'<span class="tag live">CANLI</span>':x.isNew?'<span class="tag">YENİ</span>':'';
 const demo=x.play?'<span class="tag demo">OYNA</span>':'';
 return `<div class="g"><div class="wrap"><button class="art" style="background:${hue(x)}" data-launch="${esc(x.id)}" aria-label="${esc(x.name)} oyna">${img}${tag}${demo}<span class="play" aria-hidden="true"><i>${IF('play')}</i></span></button><button class="favb ${S.favs.has(x.id)?'on':''}" data-fav="${esc(x.id)}" aria-label="Favori">${IF('heart')}</button></div><b>${esc(x.name)}</b><small>${esc(provName(x.provider))}</small></div>`;
};
const topBar=()=>{
 const guest=S.user?.guest;
 const right=guest?`<button class="chip-login" data-go="me">Giriş Yap</button>`:`<button class="ib" data-bell aria-label="Bildirimler">${I('bell')}${S.unread?'<i class="dot"></i>':''}</button><button class="ib av" data-go="me" aria-label="Hesabım">${esc((S.user.firstName||S.user.username||'B').slice(0,1).toUpperCase())}</button>`;
 return `<header class="top${guest?' guest':''}">${logoHTML()}<button class="top-search" data-search>${I('search')}<span>Oyun, sağlayıcı veya takım ara…</span><kbd>/</kbd></button><span class="sp"></span><div class="bal"><small>Bakiye</small><span id="bal">${fmt(S.user.balance)}</span><button class="plus" data-go="wallet" aria-label="Para yatır">${I('plus')}</button></div>${right}</header>`;
};
const hd=(t,b,x)=>`<div class="hd"><button class="ib" data-go="${b}" aria-label="Geri">${I('back')}</button><span class="t">${esc(t)}</span>${x||'<span style="width:38px"></span>'}</div>`;
const secH=(title,link,icon,extra='',linkAttr='')=>`<div class="sec rv">${icon?`<span class="ico">${IF(icon)}</span>`:''}${title}${extra}${link?`<a data-go="${link}" ${linkAttr}>Tümü ${I('next')}</a>`:''}</div>`;

let cat='Casino',tab='home',prov=null,pt='Oyunlar',promoId=null,q='',sportFilter='all',walletTab='yatir',payGroup='all',profileTab='ozet',first=true,authMode='login',regStep=1,regDraft={},authErr='',stakeAmt=50;
const CATS=[['Casino','casino',''],['Hemen Oyna','play','play'],['Live Casino','live','live'],['Slots','slots','slots'],['Table Games','spade','table'],['Favoriler','heart','fav'],['Promosyonlar','gift','']];
const catRow=()=>`<div class="cats">${CATS.map(c=>`<button class="${c[0]==cat?'on':''}" data-cat="${c[0]}">${IF(c[1])}${c[0]}</button>`).join('')}</div>`;
const TABLE_RE=/blackjack|roulette|rulet|baccarat|poker|hold.?em|craps|sic ?bo|dragon tiger|andar|fan tan|stud|teen patti/i;
const isTable=x=>x.category==='table'||TABLE_RE.test(x.name);
const byCat=l=>{const k=CATS.find(c=>c[0]==cat)?.[2];return k==='table'?l.filter(isTable):k==='fav'?l.filter(x=>S.favs.has(x.id)):k==='play'?l.filter(x=>x.play):k?l.filter(x=>x.category==k):l};
const none='<div class="empty">Bu kategoride içerik yok.</div>';
const when=t=>new Date(t).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const TXN={deposit:['Yatırım','deposit','in'],bonus:['Bonus','gift','bonus'],withdraw:['Çekim','withdraw','out'],bet:['Bahis','ticket','out'],win:['Kazanç','trophy','in']};
const txRow=t=>{const m=TXN[t.type]||[t.type,'receipt','out'];return `<div class="tx"><span class="tx-ic ${m[2]}">${IF(m[1])}</span><span class="tx-t">${esc(t.note||m[0])}<small>${when(t.at)} · ${esc(t.status||'Tamamlandı')}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`};

const promoCard=x=>`<button class="bcard" data-promo="${esc(x.id)}"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}" loading="lazy" decoding="async"><div class="bmeta"><span class="bbadge">${esc(x.badge||'')}</span><h3>${esc(x.title)}</h3><p>${esc(x.subtitle||x.desc||'')}</p>${x.claimed?'<em class="taken">✓ Alındı</em>':''}</div></button>`;

/* ---- payment logos (generated badges; admin-uploaded logo wins) ---- */
const PAY_GROUPS=[['all','Tümü','squares'],['banka','Banka','bank'],['ecuzdan','E-cüzdan','ewallet'],['kart','Kart / QR','card'],['kripto','Kripto','btc']];
const payGroupOf=p=>p.group||({banka:'banka','e-cüzdan':'ecuzdan',kart:'kart',qr:'kart',kripto:'kripto'}[String(p.type||'').toLowerCase()]||'banka');
const payLogo=p=>{
 const u=safeUrl(p.logo);if(u)return `<span class="pl pl-img"><img src="${esc(u)}" alt="${esc(p.name)}"></span>`;
 const gr=payGroupOf(p),nm=esc(String(p.name).split(/[ /(]/)[0]);
 if(gr==='kripto'){const btc=p.coin==='btc'||/btc|bitcoin/i.test(p.name);
  return `<span class="pl pl-kripto"><i class="coin ${btc?'btc':'usdt'}">${btc?'₿':'₮'}</i><em>${btc?'BTC':'USDT'}</em></span>`}
 if(p.id==='qr'||/qr/i.test(p.name))return `<span class="pl pl-qr">${I('qr')}<em>QR</em></span>`;
 if(gr==='kart')return `<span class="pl pl-kart"><i class="chip"></i><i class="wave">${I('card')}</i><em>KART</em></span>`;
 if(gr==='ecuzdan')return `<span class="pl pl-ecuzdan">${IF('ewallet')}<em>${nm}</em></span>`;
 return `<span class="pl pl-banka">${IF('bank')}<em>${/fast/i.test(p.name)?'FAST':'EFT'}</em></span>`;
};

/* ---- live engine ---- */
const ODD_ORDER=['1','X','2'];
const crestColor=name=>{let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))%360;return `hsl(${h} 70% 62%)`};
const isBasket=m=>/basket/i.test(m.sport);
const sportIcon=m=>/basket/i.test(m.sport)?'basket':/dövüş|ufc|boks/i.test(m.sport+m.league)?'boxing':/tenis/i.test(m.sport)?'tennis':'sport';
function liveInit(m){
 if(!m.live||m._init)return;m._init=true;
 const mm=parseInt((String(m.time).match(/(\d+)'/)||[])[1]||'1',10);
 m._clock=(isBasket(m)?Math.min(mm,38):Math.min(mm,88))*60+Math.floor(Math.random()*50);
 const [a,b]=String(m.score||'0-0').split('-').map(n=>parseInt(n,10)||0);m._sc=[a,b];
}
const clockText=m=>{
 if(isBasket(m)){const q=Math.min(4,Math.floor(m._clock/600)+1),left=Math.max(0,q*600-m._clock);return `Ç${q} ${String(Math.floor(left/60)).padStart(2,'0')}:${String(left%60).padStart(2,'0')}`}
 const min=Math.floor(m._clock/60);if(min>=90)return `90+${Math.min(9,min-89)}'`;
 return `${String(min).padStart(2,'0')}:${String(m._clock%60).padStart(2,'0')}`;
};
const matchRow=m=>{
 liveInit(m);
 const keys=ODD_ORDER.filter(k=>m.odds[k]!=null);
 const odds=keys.map(k=>{const v=m.odds[k];const sel=S.slip&&S.slip.id===m.id&&S.slip.sel===k;return `<button class="odd${sel?' sel':''}" data-bet="${esc(m.id)}" data-sel="${k}" data-odd="${v}" data-label="${esc(m.home)} - ${esc(m.away)} · ${k}">${k}<b>${v.toFixed(2)}</b></button>`}).join('');
 const sc=i=>m.live?`<span class="sc" data-sc="${esc(m.id)}-${i}">${m._sc[i]}</span>`:'';
 const crest=n=>`<span class="crest" style="background:${crestColor(n)}">${esc(String(n).slice(0,1))}</span>`;
 return `<div class="mrow ${m.live?'is-live':''}"><div class="mhead"><span class="lg-name">${IF(sportIcon(m))}${esc(m.league)}</span>${m.live?`<span class="clock"><i class="live-dot"></i><span data-clock="${esc(m.id)}">${clockText(m)}</span></span>`:`<span class="when">${I('clock')}${esc(m.time)}</span>`}</div>
<div class="mteams"><div class="team">${crest(m.home)}<span class="nm">${esc(m.home)}</span>${sc(0)}</div><div class="team">${crest(m.away)}<span class="nm">${esc(m.away)}</span>${sc(1)}</div></div><div class="odds" style="--n:${keys.length}">${odds}</div></div>`;
};
function flashOdd(m,k,dir){
 document.querySelectorAll(`[data-bet="${CSS.escape(m.id)}"][data-sel="${k}"]`).forEach(el=>{
  el.dataset.odd=m.odds[k];el.querySelector('b').textContent=m.odds[k].toFixed(2);
  el.classList.remove('up','down');void el.offsetWidth;el.classList.add(dir);
  clearTimeout(el._t);el._t=setTimeout(()=>el.classList.remove('up','down'),2400);
 });
}
let liveTick=0;
function liveStep(){
 if(document.hidden)return;liveTick++;
 for(const m of S.matches){
  if(!m.live)continue;liveInit(m);
  const cap=isBasket(m)?2400:5640;if(m._clock<cap)m._clock++;
  const ck=document.querySelector(`[data-clock="${CSS.escape(m.id)}"]`);if(ck)ck.textContent=clockText(m);
  let scorer=-1,pts=0;
  if(isBasket(m)){if(Math.random()<.12){scorer=Math.random()<.5?0:1;pts=Math.random()<.3?3:Math.random()<.2?1:2}}
  else if(Math.random()<.0035){scorer=Math.random()<.5?0:1;pts=1}
  if(scorer>=0&&m._clock<cap){
   m._sc[scorer]+=pts;m.score=m._sc.join('-');
   document.querySelectorAll(`[data-sc="${CSS.escape(m.id)}-${scorer}"]`).forEach(el=>{el.textContent=m._sc[scorer];el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')});
   if(!isBasket(m))toast(`GOL! ${scorer?m.away:m.home} · ${m.home} ${m._sc[0]}-${m._sc[1]} ${m.away}`);
  }
  if(liveTick%3===0&&Math.random()<.45){
   const keys=ODD_ORDER.filter(k=>m.odds[k]!=null),k=keys[Math.floor(Math.random()*keys.length)];
   const old=m.odds[k],nv=Math.min(50,Math.max(1.01,Math.round(old*(1+(Math.random()-.5)*.08)*100)/100));
   if(nv!==old){m.odds[k]=nv;flashOdd(m,k,nv>old?'up':'down')}
  }
 }
}
setInterval(liveStep,1000);

const plist=()=>{const s=q.toLowerCase();const l=S.providers.filter(p=>p.name.toLowerCase().includes(s)||(p.type||'').includes(s));
 const n=id=>S.games.filter(x=>x.provider===id).length;
 return l.length?`<div class="pcards">${l.map(p=>`<button class="pcard" data-p="${esc(p.id)}"><span class="pc-logo">${monoLogo(p)}</span><span class="pc-meta"><strong>${esc(p.name)}</strong><small>${p.type==='infra'?'Altyapı':n(p.id)+' oyun'}</small></span></button>`).join('')}</div>`:'<div class="empty">Sonuç bulunamadı.</div>'};
const slipBox=()=>{
 if(!S.slip)return '';
 const pot=Math.round(stakeAmt*100*S.slip.odd);
 return `<div class="slip"><div class="slip-h"><strong>${IF('ticket')} Kupon · 1 seçim</strong><button type="button" data-clear-slip>Temizle</button></div><p>${esc(S.slip.label)}</p><p class="muted">Oran <b class="num">${S.slip.odd.toFixed(2)}</b></p><div class="stake-row"><input id="stake" type="number" min="1" step="1" inputmode="decimal" value="${stakeAmt}"><span>₺</span></div><p class="muted">Olası getiri: <b class="num" id="pot">${fmt(pot)}</b></p><button class="btn" style="width:100%;margin-top:10px" type="button" data-place-bet>Bahis Yap</button></div>`;
};
const footer=()=>`<footer class="foot rv">${logoHTML()}
<div class="foot-pay">${S.payments.slice(0,9).map(payLogo).join('')}</div>
<p>${esc(siteName())} bir demo projesidir. Gerçek para kullanılmaz; tüm bakiyeler, bahisler ve ödemeler sanal kredi ile simüle edilir.</p>
<div class="foot-links"><button data-go="promo">Bonuslar</button><button data-go="prov">Sağlayıcılar</button><button data-go="sport">Spor</button><button data-go="games">Casino</button><button data-go="support">Destek & SSS</button></div>
<div class="foot-badges"><span class="b18">18+</span><span>${I('shield')} Sorumlu Oyun</span><span>${I('info')} Demo · Sanal kredi</span></div>
<small>© ${new Date().getFullYear()} ${esc(siteName())}</small></footer>`;

function gateMsg(err){
 const m=err?.message||'';
 if(err?.status===401||/giriş/i.test(m)){toast(m||'Oynamak için giriş yap');closeSheet();tab='me';authMode='login';render();return true}
 if(/yetersiz bakiye/i.test(m)){toast(m);closeSheet();tab='wallet';walletTab='yatir';render();return true}
 return false;
}

const V={
home:()=>{
 const live=S.matches.filter(m=>m.live);
 const playable=S.games.filter(x=>x.play).slice(0,14);
 const newGames=S.games.filter(x=>x.isNew).slice(0,12);
 const liveGames=S.games.filter(x=>x.category==='live'&&!isTable(x)).slice(0,12);
 const tableGames=S.games.filter(isTable).slice(0,12);
 const slots=S.games.filter(x=>x.category==='slots'&&!x.isNew).slice(0,12);
 const upcoming=S.matches.filter(m=>!m.live).slice(0,3);
 return topBar()+`<div class="hero-carousel"><div class="swiper swiper-promo"><div class="swiper-wrapper">${S.promos.slice(0,6).map(x=>`<div class="swiper-slide"><button class="slide" data-promo="${esc(x.id)}" aria-label="${esc(x.title)}"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}" decoding="async"></button></div>`).join('')}</div></div><div class="promo-dots"></div></div>
<div class="quick">
<button data-go="sport"><i>${IF('sport')}</i><span>Spor</span></button>
<button data-go="live"><i>${IF('live')}</i><span>Canlı Bahis</span></button>
<button data-go="games" data-cat-go="Casino"><i>${IF('casino')}</i><span>Casino</span></button>
<button data-go="games" data-cat-go="Live Casino"><i>${IF('tv')}</i><span>Canlı Casino</span></button>
<button data-go="promo"><i>${IF('gift')}</i><span>Bonuslar</span></button>
<button data-go="wallet"><i>${IF('wallet')}</i><span>Para Yatır</span></button>
</div>
${playable.length?secH('Hemen Oyna','games','play',' <span class="count ok">Ücretsiz demo</span>','data-cat-go="Hemen Oyna"')+`<div class="rail rv">${playable.map(game).join('')}</div>`:''}
${live.length?secH('Şu An Canlı','live','live',` <span class="count">${live.length} maç</span>`)+`<div class="lrail rv">${live.map(matchRow).join('')}</div>`:''}
${newGames.length?secH('Öne Çıkan Oyunlar','games','flame','','data-cat-go="Casino"')+`<div class="rail rv">${newGames.map(game).join('')}</div>`:''}
${liveGames.length?secH('Canlı Casino','games','tv','','data-cat-go="Live Casino"')+`<div class="rail rv">${liveGames.map(game).join('')}</div>`:''}
${upcoming.length?secH('Yaklaşan Maçlar','sport','sport')+`<div class="mgrid rv">${upcoming.map(matchRow).join('')}</div>`:''}
${slots.length?secH('Popüler Slotlar','games','slots','','data-cat-go="Slots"')+`<div class="rail rv">${slots.map(game).join('')}</div>`:''}
${tableGames.length?secH('Masa Oyunları','games','spade','','data-cat-go="Table Games"')+`<div class="rail rv">${tableGames.map(game).join('')}</div>`:''}
${secH('Bonuslar','promo','gift')}
<div class="bscroll rv">${S.promos.slice(0,6).map(promoCard).join('')}</div>
${footer()}`},

sport:()=>{const list=sportFilter==='all'?S.matches.filter(m=>!m.live):S.matches.filter(m=>!m.live&&m.sport===sportFilter);
 const sports=['all',...new Set(S.matches.map(m=>m.sport))];
 const sic=s=>s==='all'?'grid':/basket/i.test(s)?'basket':/dövüş/i.test(s)?'boxing':/tenis/i.test(s)?'tennis':'sport';
 return topBar()+`<div class="sec"><span class="ico">${IF('sport')}</span>Spor Bahisleri</div>
<div class="cats">${sports.map(s=>`<button class="${sportFilter===s?'on':''}" data-sfilter="${esc(s)}">${IF(sic(s))}${s==='all'?'Tümü':esc(s)}</button>`).join('')}</div>
<div class="mgrid">${list.length?list.map(matchRow).join(''):none}</div>${slipBox()}`},

live:()=>{const list=S.matches.filter(m=>m.live);
 return topBar()+`<div class="sec"><span class="ico live">${IF('live')}</span>Canlı Bahis<span class="count">${list.length} maç</span></div>
<p class="lead">Skor, süre ve oranlar anlık güncellenir (simülasyon).</p>
<div class="mgrid">${list.length?list.map(matchRow).join(''):'<div class="empty">Şu an canlı maç yok.</div>'}</div>${slipBox()}`},

games:()=>{const gl=byCat(S.games);
 return topBar()+`<div class="sec"><span class="ico">${IF('casino')}</span>Casino <span class="muted" style="font-family:var(--font);font-weight:500">· ${gl.length} oyun</span><a data-search>${I('search')} Ara</a></div>`+catRow()+(gl.length?`<div class="games">${gl.map(game).join('')}</div>`:cat==='Favoriler'?'<div class="empty">Henüz favori oyunun yok. Oyun kartındaki kalbe dokunarak ekleyebilirsin.</div>':none)},

prov:()=>hd('Sağlayıcılar','home')+`<label class="search">${I('search')}<input id="q" placeholder="Sağlayıcı veya altyapı ara…" value="${esc(q)}"></label><div id="pl">${plist()}</div>`,

detail:()=>{const p=S.providers.find(x=>x.id==prov),gl=S.games.filter(x=>x.provider==prov);
 if(!p)return hd('Sağlayıcı','prov')+'<div class="empty">Bulunamadı.</div>';
 return hd(p.name,'prov')+`<div class="pbanner"><span class="pc-logo big">${monoLogo(p)}</span><div><strong>${esc(p.name)}</strong><p>${esc(p.about)}</p></div></div>
<div class="seg">${['Oyunlar','Hakkında','Canlı Casino'].map(t=>`<button class="${t==pt?'on':''}" data-pt="${t}">${t}${t=='Oyunlar'?` (${gl.length})`:''}</button>`).join('')}</div>`+
(pt=='Oyunlar'?(gl.length?`<div class="games">${gl.map(game).join('')}</div>`:none):pt=='Hakkında'?`<div class="card"><h3>${esc(p.name)}</h3><p>${esc(p.tagline)}. ${esc(p.about)}</p></div>`:(l=>l.length?`<div class="games">${l.map(game).join('')}</div>`:'<div class="empty">Bu sağlayıcının canlı masası yok.</div>')(gl.filter(x=>x.category=='live')))},

promo:()=>topBar()+`<div class="sec"><span class="ico">${IF('gift')}</span>Promosyonlar & Bonuslar</div>
<p class="lead">Bonus kartına dokunarak tüm şartları görüntüle.</p>
<div class="blist">${S.promos.map(promoCard).join('')}</div>`,

promodetail:()=>{const x=S.promos.find(p=>p.id===promoId);
 if(!x)return hd('Bonus','promo')+'<div class="empty">Bonus bulunamadı.</div>';
 const block=(t,ic,body)=>`<div class="card term"><h3>${IF(ic)}${t}</h3>${body}</div>`;
 return hd('Bonus şartları','promo')+`<div class="narrow"><div style="height:14px"></div><div class="promo-hero"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}"></div>
<div class="promo-head"><span class="bbadge">${esc(x.badge||'')}</span><h1>${esc(x.title)}</h1><p>${esc(x.subtitle||'')}</p></div>
${block('Bonus özeti','info',`<p>${esc(x.summary||x.desc||'')}</p>`)}
${block('Kimler yararlanabilir','user',`<p>${esc(x.eligible||'—')}</p>`)}
${block('Limitler','coins',`<ul class="tlist"><li>Minimum yatırım: <b>${esc(x.minDeposit||'—')}</b></li><li>Maksimum bonus: <b>${esc(x.maxBonus||'—')}</b></li></ul>`)}
${block('Çevrim','swap',`<p>${esc(x.wager||'—')}</p>`)}
${block('Süre','timer',`<p>${esc(x.duration||'—')}</p>`)}
${block('Çekim koşulları','withdraw',`<p>${esc(x.withdraw||'—')}</p>`)}
${x.example?block('Örnek hesaplama','chart',`<p>${esc(x.example)}</p>`):''}
${block('Şartlar','check',`<ul class="tlist">${(x.terms||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`)}
${(x.exceptions||[]).length?block('İstisnalar','shield',`<ul class="tlist">${x.exceptions.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`):''}
<button class="wide" data-claim="${esc(x.id)}" ${x.claimed?'disabled':''}>${IF(x.claimed?'check':'gift')} ${x.claimed?'Bu bonus alındı':'Bonusu Al (demo)'}</button>
<p class="disclaimer">Demo ortamında gerçek para yoktur.</p></div>`},

wallet:()=>{const u=S.user,sm=S.summary||{};
 const list=S.payments.filter(p=>walletTab==='cek'?payGroupOf(p)!=='kart':true).filter(p=>payGroup==='all'||payGroupOf(p)===payGroup);
 const groups=PAY_GROUPS.filter(([k])=>k==='all'||S.payments.some(p=>payGroupOf(p)===k&&(walletTab!=='cek'||k!=='kart')));
 const tabs=[['yatir','Para Yatır','deposit'],['cek','Para Çek','withdraw'],['gecmis','Geçmiş','history']];
 const methods=list.length?list.map(p=>`<div class="pm"><span class="pm-logo">${payLogo(p)}</span><span class="pm-info"><b>${esc(p.name)}</b><small>${I('clock')}${esc(p.eta||'')}</small></span><span class="pm-lim"><small>Min</small><b>${tl(p.min||100)}</b><small>Maks</small><b>${tl(p.max||50000)}</b></span><button class="pm-go" data-sheet="${walletTab==='cek'?'wd':'dep'}" data-pm="${esc(p.id)}">${walletTab==='cek'?'Çek':'Yatır'}</button></div>`).join(''):'<div class="empty">Bu grupta yöntem yok.</div>';
 return topBar()+`<div class="wallet-hero"><div class="wh-top"><span class="wh-ic">${IF('wallet')}</span><div><small>Kullanılabilir bakiye</small><strong>${fmt(u.balance)}</strong></div></div>
<div class="wh-stats"><span>${I('deposit')}<small>Yatırım</small><b>${fmt(sm.deposits||0)}</b></span><span>${I('withdraw')}<small>Çekim</small><b>${fmt(sm.withdrawals||0)}</b></span><span>${I('gift')}<small>Bonus</small><b>${fmt(sm.bonuses||0)}</b></span></div></div>
<div class="seg icons">${tabs.map(([k,l,ic])=>`<button class="${walletTab===k?'on':''}" data-wtab="${k}">${IF(ic)}${l}</button>`).join('')}</div>`+
(walletTab==='gecmis'?(S.tx.length?`<div class="txlist">${S.tx.map(txRow).join('')}</div>`:'<div class="empty">Henüz işlem yok.</div>'):
`<div class="cats paycats">${groups.map(([k,l,ic])=>`<button class="${payGroup===k?'on':''}" data-pgroup="${k}">${k==='all'?IF('grid'):IF(ic)}${l}</button>`).join('')}</div>
<p class="lead">${walletTab==='cek'?'Çekim yapmak istediğin yöntemi seç. Çekimler simülasyondur.':'Yatırım yapmak istediğin yöntemi seç (demo · sanal kredi).'}</p>
<div class="pmlist">${methods}</div>
<div class="sec">${I('history')} Son İşlemler<a data-wtab="gecmis">Tümü ${I('next')}</a></div>`+(S.tx.length?`<div class="txlist">${S.tx.slice(0,5).map(txRow).join('')}</div>`:'<div class="empty">Henüz işlem yok.</div>'))},

support:()=>topBar()+`<div class="sec"><span class="ico">${IF('support')}</span>Destek & SSS</div>
<div class="sup-tiles"><button data-focus-sup>${IF('chat')}<b>Canlı Destek</b><small>Talep oluştur</small></button><button data-go="promo">${IF('gift')}<b>Bonus Yardımı</b><small>Şartlar ve çevrim</small></button><button data-go="wallet">${IF('wallet')}<b>Ödemeler</b><small>Yatırım ve çekim</small></button></div>
${S.faq.map(f=>`<details class="faq"><summary>${I('info')}<span>${esc(f.q)}</span></summary><p>${esc(f.a)}</p></details>`).join('')}
<div class="sec">${I('chat')} Talep oluştur</div>
<form class="form" id="supForm"><textarea name="message" required minlength="5" maxlength="1000" placeholder="Mesajını yaz…"></textarea><button class="btn" type="submit">Talebi gönder</button></form>
<div class="card"><h3>${IF('shield')} Sorumlu oyun</h3><p class="muted">18+ · Yalnızca demo / sanal kredi. Oyun bir eğlence aracıdır; limitlerini bil.</p></div>`,

me:()=>{const u=S.user;
 if(u.guest)return topBar()+`<div class="auth-wrap">${authViews()}</div>`;
 const tabs=[['ozet','Özet','grid'],['bilgi','Bilgiler','id'],['finans','Finans','chart'],['bahis','Bahisler','ticket'],['bonus','Bonus','gift'],['guvenlik','Güvenlik','lock']];
 const initial=esc((u.firstName||u.username||'B').slice(0,1).toUpperCase());
 const name=esc([u.firstName,u.lastName].filter(Boolean).join(' ')||u.username);
 return topBar()+`<div class="profile">
<div class="profile-hero"><div class="avatar">${initial}</div><div><h2>${name}</h2><p>@${esc(u.username)}</p><span class="pill">${IF('shield')} ${esc(u.kycStatus||'Hesap')}</span></div></div>
<div class="wallet-card"><small>Kullanılabilir bakiye</small><strong>${fmt(u.balance)}</strong>
<div class="wallet-actions"><button data-go="wallet">${IF('deposit')} Para yatır</button><button class="ghost" data-go="wallet" data-wtab-go="cek">${IF('withdraw')} Para çek</button></div></div>
</div>
<div class="seg scroll icons">${tabs.map(([k,l,ic])=>`<button class="${profileTab===k?'on':''}" data-ptab="${k}">${IF(ic)}${l}</button>`).join('')}</div>
${profileBody(u)}
<div style="padding:8px var(--pad) 20px"><button class="btn alt" style="width:100%" data-logout>${I('signout')} Çıkış yap</button></div>`}
};

const row=(l,v)=>`<div class="pinfo"><span>${esc(l)}</span><b>${v==null||v===''?'—':esc(v)}</b></div>`;
const maskTC=t=>t&&t.length===11?t.slice(0,3)+'*****'+t.slice(-3):'—';
const maskPhone=p=>{const s=String(p||'');return s.length>4?s.slice(0,3)+'***'+s.slice(-2):'—'};

function profileBody(u){
 const sm=S.summary||{};
 const k=(ic,l,v)=>`<div class="kpi"><span class="kpi-ic">${IF(ic)}</span><small>${l}</small><strong>${v}</strong></div>`;
 if(profileTab==='ozet')return `<div class="kpi3">${k('deposit','Yatırım',fmt(sm.deposits||0))}${k('withdraw','Çekim',fmt(sm.withdrawals||0))}${k('gift','Bonus',fmt(sm.bonuses||0))}${k('ticket','Bahis',sm.bets||0)}${k('trophy','Kazanan',sm.wins||0)}${k('heart','Favori',S.favs.size)}</div>
 <div class="list-links">
  <button data-go="wallet">${IF('wallet')} Cüzdan ${I('next','go')}</button>
  <button data-go="games" data-cat-go="Favoriler">${IF('heart')} Favori oyunlarım ${I('next','go')}</button>
  <button data-go="promo">${IF('gift')} Bonuslar ${I('next','go')}</button>
  <button data-go="support">${IF('support')} Destek ${I('next','go')}</button>
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
  (fin.length?`<div class="txlist">${fin.map(txRow).join('')}</div>`:'<div class="empty">Finansal işlem yok.</div>')}
 if(profileTab==='bahis')return S.bets.length?`<div class="txlist">${S.bets.map(b=>`<div class="tx"><span class="tx-ic ${b.won?'in':'out'}">${IF(b.won?'trophy':'ticket')}</span><span class="tx-t">${esc(b.selection)}<small>${when(b.at)} · oran ${esc(b.odd)} · ${esc(b.status)}</small></span><span class="${b.won?'pos':'neg'}">${b.won?'+':'-'}${fmt(b.won?b.payout:b.stake)}</span></div>`).join('')}</div>`:'<div class="empty">Bahis geçmişi boş.</div>';
 if(profileTab==='bonus'){const claimed=S.promos.filter(p=>p.claimed);
  return claimed.length?claimed.map(p=>`<div class="card"><h3>${esc(p.title)}</h3><p>${esc(p.subtitle||p.desc)}</p><p class="muted">Durum: Alındı · ${fmt(p.bonus||0)}</p></div>`).join('')+'<button class="wide alt" data-go="promo">Tüm bonuslar</button>':'<div class="empty">Henüz bonus alınmadı.</div><button class="wide" data-go="promo">Bonuslara git</button>'}
 if(profileTab==='guvenlik')return `<div class="card">
  ${row('Hesap durumu','Aktif')}${row('KYC doğrulama',u.kycStatus)}
  ${row('2FA','Kapalı (demo)')}${row('Son giriş','Bu oturum')}
  <p class="muted" style="margin-top:12px">Güvenlik ayarları demo ortamında değiştirilemez.</p>
 </div>`;
 return '';
}

function authViews(){
 const hero=(t,s)=>`<div class="auth-hero">${markSVG('width:40px;height:40px')}<h2>${t}</h2><p>${s}</p></div>`;
 if(authMode==='login')return hero('Tekrar hoş geldin','Hesabına giriş yap, kaldığın yerden devam et.')+`<div style="height:12px"></div>
<form class="form" id="af"><input name="username" placeholder="Kullanıcı adı" autocomplete="username" required>
<input name="password" type="password" placeholder="Şifre" autocomplete="current-password" required>
<button class="btn" type="submit">Giriş yap</button>
<button type="button" class="btn alt" data-mode>Hesap oluştur</button></form><div class="err">${esc(authErr)}</div>`;
 const d=regDraft,cities=CITIES.map(c=>`<option value="${escAttr(c)}" ${d.city===c?'selected':''}>${esc(c)}</option>`).join('');
 const distList=PLACES[d.city]||[];
 const dists=distList.map(x=>`<option value="${escAttr(x)}" ${d.district===x?'selected':''}>${esc(x)}</option>`).join('');
 if(regStep===1)return hero('Hesap oluştur','Adım 1/2 · Kişisel ve iletişim bilgileri')+`<div style="height:12px"></div>
<div class="steps"><i class="on"></i><i></i></div>
<form class="form" id="reg1">
<div class="row"><input name="firstName" placeholder="Ad" required value="${escAttr(d.firstName)}"><input name="lastName" placeholder="Soyad" required value="${escAttr(d.lastName)}"></div>
<input name="tc" placeholder="T.C. Kimlik No" inputmode="numeric" maxlength="11" required value="${escAttr(d.tc)}">
<input name="email" type="email" placeholder="E-posta" required value="${escAttr(d.email)}">
<input name="phone" placeholder="Telefon (05xx...)" inputmode="tel" required value="${escAttr(d.phone)}">
<input name="address" placeholder="Adres" required value="${escAttr(d.address)}">
<select name="city" required id="citySel"><option value="">İl seç</option>${cities}</select>
<select name="district" required id="distSel" ${d.city?'':'disabled'}><option value="">${d.city?'İlçe seç':'Önce il seç'}</option>${dists}</select>
<button class="btn" type="submit">Devam et</button>
<button type="button" class="btn alt" data-mode>Girişe dön</button></form><div class="err">${esc(authErr)}</div>`;
 return hero('Hesap oluştur','Adım 2/2 · Hesap bilgileri')+`<div style="height:12px"></div>
<div class="steps"><i class="on"></i><i class="on"></i></div>
<form class="form" id="af">
<input name="username" placeholder="Kullanıcı adı" autocomplete="username" required value="${escAttr(d.username)}">
<input name="password" type="password" placeholder="Şifre (en az 8 karakter)" autocomplete="new-password" required>
<input name="password2" type="password" placeholder="Şifre tekrar" autocomplete="new-password" required>
<input name="promoCode" placeholder="Promosyon kodu (opsiyonel)" value="${escAttr(d.promoCode)}">
<label class="check"><input type="checkbox" name="terms" required> 18 yaşından büyük olduğumu ve şartları kabul ettiğimi onaylıyorum.</label>
<button class="btn" type="submit">Kayıt ol</button>
<button type="button" class="btn alt" data-reg-back>Geri</button></form><div class="err">${esc(authErr)}</div>`;
}

/* ---- navigation: floating mobile bar + desktop sidebar ---- */
function buildNav(){
 const nav=$('#nav');
 nav.innerHTML=`<div class="nav-brand">${logoHTML()}</div>
<div class="nav-bar">
<button class="nb" data-menu aria-label="Menü">${IF('menu')}<span>Menü</span></button>
<button class="nb" data-go="games" data-nk="games">${IF('casino')}<span>Casino</span></button>
<button class="nb fab" data-go="wallet" data-nk="wallet" aria-label="Cüzdan"><span class="fab-ring">${markSVG()}</span><span>Cüzdan</span></button>
<button class="nb" data-go="sport" data-nk="sport">${IF('sport')}<span>Spor</span><i class="badge" data-live-badge hidden></i></button>
<button class="nb" data-search aria-label="Ara">${IF('search')}<span>Ara</span></button>
</div>
<div class="nav-side">
${[['home','Ana Sayfa','home'],['sport','Spor Bahisleri','sport'],['live','Canlı Bahis','live'],['games','Casino','casino'],['promo','Promosyonlar','gift'],['wallet','Cüzdan','wallet'],['me','Hesabım','user'],['support','Destek','support']].map(([k,l,ic])=>`<button class="ns" data-go="${k}" data-nk="${k}">${IF(ic)}<span>${l}</span>${k==='live'?'<i class="badge" data-live-badge hidden></i>':''}</button>`).join('')}
<button class="ns" data-search>${IF('search')}<span>Oyun ara</span></button>
</div>`;
}
function updateLiveBadge(){const n=S.matches.filter(m=>m.live).length;document.querySelectorAll('[data-live-badge]').forEach(b=>{b.hidden=!n;b.textContent=n})}
function navKey(){
 if(tab==='detail'||tab==='prov')return 'games';
 if(tab==='promodetail')return 'promo';
 if(tab==='live')return document.querySelector('.ns[data-nk="live"]')&&DESK.matches?'live':'sport';
 return tab;
}
function markNav(){const k=navKey();document.querySelectorAll('#nav [data-nk]').forEach(b=>b.classList.toggle('on',b.dataset.nk===k))}

/* ---- overlays: drawer, sheet, search ---- */
function overlay(cls,html,onOpen){
 document.querySelector('.'+cls)?.remove();
 const bg=document.createElement('div');bg.className='ov '+cls;bg.innerHTML=html;document.body.appendChild(bg);
 document.body.classList.add('noscroll');
 requestAnimationFrame(()=>bg.classList.add('open'));
 bg.addEventListener('click',e=>{if(e.target===bg||e.target.closest('[data-close]'))closeOv(bg)});
 onOpen&&onOpen(bg);return bg;
}
function closeOv(bg){if(!bg)return;bg.classList.remove('open');setTimeout(()=>{bg.remove();if(!document.querySelector('.ov'))document.body.classList.remove('noscroll')},REDUCE?0:260)}
const closeAll=()=>document.querySelectorAll('.ov').forEach(closeOv);
const closeSheet=()=>document.querySelectorAll('.ov.sheet-ov').forEach(closeOv);
addEventListener('keydown',e=>{if(e.key==='Escape')closeAll();else if(e.key==='/'&&!/input|textarea|select/i.test(document.activeElement?.tagName||'')&&!document.querySelector('.ov')&&S.user){e.preventDefault();openSearch()}});

function openDrawer(){
 const u=S.user,live=S.matches.filter(m=>m.live).length;
 const item=(attrs,ic,l,extra='')=>`<button class="dr-item" ${attrs}>${IF(ic)}<span>${l}</span>${extra}${I('next','go')}</button>`;
 overlay('drawer-ov',`<aside class="drawer" role="dialog" aria-label="Menü">
<div class="dr-head">${logoHTML()}<button class="ib" data-close aria-label="Kapat">${I('close')}</button></div>
${u.guest?`<div class="dr-user"><div><b>Hoş geldin</b><small>Bonuslardan yararlanmak için giriş yap.</small></div><div class="dr-btns"><button class="btn" data-go="me" data-auth="login">Giriş Yap</button><button class="btn alt" data-go="me" data-auth="register">Kayıt Ol</button></div></div>`:
`<div class="dr-user"><div class="dr-row"><span class="avatar sm">${esc((u.firstName||u.username||'B').slice(0,1).toUpperCase())}</span><div><b>${esc(u.firstName||u.username)}</b><small>@${esc(u.username)}</small></div><span class="dr-bal">${fmt(u.balance)}</span></div><div class="dr-btns"><button class="btn" data-go="wallet">${IF('deposit')} Yatır</button><button class="btn alt" data-go="wallet" data-wtab-go="cek">${IF('withdraw')} Çek</button></div></div>`}
<div class="dr-tiles">
<button data-go="promo"><i class="t1">${IF('gift')}</i><b>Bonuslar</b><small>Kampanyalar</small></button>
<button data-go="wallet"><i class="t2">${IF('deposit')}</i><b>Para Yatır</b><small>Anında</small></button>
<button data-go="live"><i class="t3">${IF('live')}</i><b>Canlı Bahis</b><small>${live} maç</small></button>
<button data-go="games" data-cat-go="Favoriler"><i class="t4">${IF('heart')}</i><b>Favoriler</b><small>${S.favs.size} oyun</small></button>
<button data-go="me" data-ptab-go="bahis"><i class="t5">${IF('ticket')}</i><b>Kuponlarım</b><small>Bahis geçmişi</small></button>
<button data-go="support"><i class="t6">${IF('support')}</i><b>Destek</b><small>7/24 yardım</small></button>
</div>
<p class="dr-label">Spor</p>
${item('data-go="sport"','sport','Spor Bahisleri')}
${item('data-go="live"','live','Canlı Bahis',live?`<i class="badge">${live}</i>`:'')}
<p class="dr-label">Casino</p>
${item('data-go="games" data-cat-go="Casino"','casino','Tüm Oyunlar')}
${item('data-go="games" data-cat-go="Live Casino"','tv','Canlı Casino')}
${item('data-go="games" data-cat-go="Slots"','slots','Slot Oyunları')}
${item('data-go="games" data-cat-go="Table Games"','spade','Masa Oyunları')}
${item('data-go="prov"','grid','Sağlayıcılar')}
<p class="dr-label">Hesap</p>
${u.guest?item('data-go="me"','user','Giriş Yap / Kayıt Ol'):item('data-go="me"','user','Hesabım')+item('data-go="wallet" data-wtab-go="gecmis"','history','İşlem Geçmişi')}
${item('data-go="support"','support','Destek & SSS')}
${u.guest?'':item('data-logout','signout','Çıkış Yap')}
<div class="dr-foot"><span class="b18">18+</span><small>Demo · sanal kredi. Sorumlu oyna.</small></div>
</aside>`);
}

function openSearch(){
 let sq='';
 const results=()=>{
  const s=sq.trim().toLowerCase();
  if(!s){
   const pop=['Sweet Bonanza','Crazy Time','Aviator','Blackjack','Rulet','Gates of Olympus'];
   const featured=S.games.filter(x=>x.isNew).slice(0,9);
   return `<p class="sr-label">Popüler aramalar</p><div class="sr-chips">${pop.map(p=>`<button data-sq="${esc(p)}">${I('search')}${esc(p)}</button>`).join('')}</div><p class="sr-label">Öne çıkanlar</p><div class="games">${featured.map(game).join('')}</div>`;
  }
  const gs=S.games.filter(x=>x.name.toLowerCase().includes(s)||provName(x.provider).toLowerCase().includes(s)||(s==='rulet'&&/roulette/i.test(x.name))).slice(0,30);
  const ps=S.providers.filter(p=>p.name.toLowerCase().includes(s)).slice(0,6);
  const ms=S.matches.filter(m=>(m.home+' '+m.away+' '+m.league).toLowerCase().includes(s)).slice(0,4);
  if(!gs.length&&!ps.length&&!ms.length)return `<div class="empty">“${esc(sq)}” için sonuç bulunamadı.</div>`;
  return (ms.length?`<p class="sr-label">Maçlar</p><div class="mgrid sr-m">${ms.map(matchRow).join('')}</div>`:'')+
   (ps.length?`<p class="sr-label">Sağlayıcılar</p><div class="pcards">${ps.map(p=>`<button class="pcard" data-p="${esc(p.id)}"><span class="pc-logo">${monoLogo(p)}</span><span class="pc-meta"><strong>${esc(p.name)}</strong></span></button>`).join('')}</div>`:'')+
   (gs.length?`<p class="sr-label">Oyunlar · ${gs.length}</p><div class="games">${gs.map(game).join('')}</div>`:'');
 };
 overlay('search-ov',`<div class="search-panel" role="dialog" aria-label="Ara"><div class="sp-head"><label class="search">${I('search')}<input id="sq" placeholder="Oyun, sağlayıcı veya takım ara…" autocomplete="off"></label><button class="ib" data-close aria-label="Kapat">${I('close')}</button></div><div class="sp-body" id="sr">${results()}</div></div>`,bg=>{
  const inp=bg.querySelector('#sq');setTimeout(()=>inp.focus(),60);
  inp.oninput=()=>{sq=inp.value;bg.querySelector('#sr').innerHTML=results()};
  bg.addEventListener('click',e=>{const c=e.target.closest('[data-sq]');if(c){inp.value=sq=c.dataset.sq;bg.querySelector('#sr').innerHTML=results()}});
 });
}

function openPaySheet(kind,pid){
 const p=S.payments.find(x=>x.id===pid);if(!p)return;
 if(S.user.guest&&kind==='wd'){toast('Çekim için giriş yap');tab='me';render();return}
 const lo=Number(p.min)||100,hi=Number(p.max)||50000;
 const chips=[lo,250,500,1000,2500,5000].filter((v,i,a)=>v>=lo&&v<=hi&&a.indexOf(v)===i).slice(0,5);
 const dep=kind==='dep';
 overlay('sheet-ov',`<div class="sheet" role="dialog" aria-label="${dep?'Para yatır':'Para çek'}"><span class="grab"></span>
<div class="sh-head"><button class="ib" data-close aria-label="Geri">${I('back')}</button><b>${dep?'Para Yatır':'Para Çek'}</b><button class="ib" data-close aria-label="Kapat">${I('close')}</button></div>
<div class="sh-method"><span class="pm-logo">${payLogo(p)}</span><div><b>${esc(p.name)}</b><small>${esc(p.type||'')} · ${esc(p.eta||'')}</small></div></div>
<label class="amount"><span>Tutar</span><div><input id="amt" type="number" inputmode="decimal" min="${lo}" max="${hi}" step="1" value="${chips[1]||lo}"><em>₺</em></div></label>
<div class="chips">${chips.map(v=>`<button data-amt="${v}">${tl(v)}</button>`).join('')}</div>
<div class="sh-info"><span>Min</span><b>${tl(lo)}</b><span>Maks</span><b>${tl(hi)}</b><span>Süre</span><b>${esc(p.eta||'—')}</b></div>
${!dep?`<div class="sh-note">${I('info')} Mevcut bakiye: <b>${fmt(S.user.balance)}</b></div>`:''}
<button class="btn sh-go" data-confirm>${IF(dep?'deposit':'withdraw')} ${dep?'Yatırımı Onayla':'Çekimi Onayla'}</button>
<p class="disclaimer" style="text-align:center">Demo ortamı · gerçek para transferi yapılmaz.</p></div>`,bg=>{
  const amt=bg.querySelector('#amt');
  bg.addEventListener('click',e=>{
   const c=e.target.closest('[data-amt]');if(c)amt.value=c.dataset.amt;
   if(e.target.closest('[data-confirm]'))act(async()=>{
    const amount=Number(amt.value);if(!Number.isFinite(amount)||amount<lo||amount>hi)return toast(`Tutar ${tl(lo)} ile ${tl(hi)} arasında olmalı`);
    const r=await api(dep?'/wallet/deposit':'/wallet/withdraw','POST',{amount,method:p.id});
    setBal(r.balance);closeOv(bg);await Promise.all([loadTx(),loadProfileExtra()]);
    toast(dep?`+${tl(amount)} yüklendi`:`${tl(amount)} çekim talebi oluşturuldu`);render(false)});
  });
 });
}

function openGame(gm){
 const url=demoUrl(gm);
 overlay('game-ov',`<div class="game-panel" role="dialog" aria-label="${esc(gm.name)}">
<div class="gp-head"><button class="ib" data-close aria-label="Kapat">${I('back')}</button><div class="gp-t"><b>${esc(gm.name)}</b><small>${esc(provName(gm.provider))} · <span class="demo-pill">DEMO</span></small></div>
<button class="ib" data-gp-fav aria-label="Favori">${IF('heart')}</button>
<button class="ib" data-gp-full aria-label="Tam ekran">${I('arrowsOut')}</button>
<a class="ib" href="${esc(url)}" target="_blank" rel="noopener" aria-label="Yeni sekmede aç">${I('external')}</a>
<button class="ib" data-close aria-label="Kapat">${I('close')}</button></div>
<div class="gp-body"><div class="gp-load">${markSVG('width:54px;height:54px')}<p>${esc(gm.name)} yükleniyor…</p></div><iframe src="${esc(url)}" title="${esc(gm.name)}" allow="autoplay; fullscreen; clipboard-write" referrerpolicy="no-referrer-when-downgrade"></iframe></div>
<div class="gp-foot">${I('info')}<span>Ücretsiz demo — oyun içi sanal bakiye kullanılır, ${esc(siteName())} bakiyen etkilenmez. Oyun açılmazsa (ör. Brave kalkanları) <a href="${esc(url)}" target="_blank" rel="noopener">yeni sekmede aç</a>.</span></div>
</div>`,bg=>{
  const fr=bg.querySelector('iframe');fr.addEventListener('load',()=>setTimeout(()=>bg.querySelector('.gp-load')?.classList.add('hide'),400));
  bg.querySelector('[data-gp-full]').onclick=()=>{const el=bg.querySelector('.gp-body');(el.requestFullscreen||el.webkitRequestFullscreen||(()=>{})).call(el)};
  const fb=bg.querySelector('[data-gp-fav]');fb.classList.toggle('on',S.favs.has(gm.id));
  fb.onclick=()=>{if(S.user.guest){toast('Favoriler için giriş yap');return}const on=S.favs.has(gm.id);act(async()=>{await api('/favorites/'+encodeURIComponent(gm.id),on?'DELETE':'POST');on?S.favs.delete(gm.id):S.favs.add(gm.id);fb.classList.toggle('on',!on);document.querySelectorAll(`[data-fav="${CSS.escape(gm.id)}"]`).forEach(x=>x.classList.toggle('on',!on))})};
 });
}
function showWelcome(name){
 overlay('welcome-ov',`<div class="welcome-card" role="dialog" aria-modal="true"><button class="welcome-x" type="button" data-close aria-label="Kapat">${I('close')}</button>
 <img src="assets/brand/welcome-v2.jpg" alt="Hoş geldiniz">
 <div class="welcome-body"><h2>Hoş geldin${name?`, ${esc(name)}`:''}!</h2>
 <p>Hesabın hazır. Bonusları keşfet; spor, canlı ve casino tarafının keyfini çıkar.</p>
 <button type="button" class="btn" data-close style="width:100%">Devam et</button></div></div>`);
}

const DESK=matchMedia('(min-width:1024px)');
function killPromoSwiper(){if(promoSwiper){try{promoSwiper.destroy(true,true)}catch(_){}promoSwiper=null}}
function mountPromoSwiper(){
 killPromoSwiper();
 if(!window.Swiper||!$('.swiper-promo'))return;
 const n=$('.swiper-promo').querySelectorAll('.swiper-slide').length;
 promoSwiper=new Swiper('.swiper-promo',{
  slidesPerView:1,spaceBetween:12,speed:650,loop:n>=4,
  autoplay:REDUCE||n<2?false:{delay:4500,disableOnInteraction:false,pauseOnMouseEnter:true},
  pagination:{el:'.promo-dots',clickable:true},
  breakpoints:{640:{slidesPerView:2,spaceBetween:12},1024:{slidesPerView:2,spaceBetween:14}},
  resistanceRatio:.65
 });
}
let io=null;
function reveal(){
 io?.disconnect();
 const els=document.querySelectorAll('#app .rv');
 if(REDUCE||!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('in'));return}
 io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -40px 0px'});
 els.forEach(e=>io.observe(e));
}
function intro(){
 const b=$('#bal');if(!b||!first)return;first=false;
 if(REDUCE){b.textContent=fmt(S.user.balance);return}
 const end=S.user.balance,t0=performance.now(),D=800;
 const step=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);b.textContent=fmt(Math.round(end*e));if(k<1)requestAnimationFrame(step)};
 requestAnimationFrame(step);
}
function render(anim=true){
 killPromoSwiper();
 $('#app').innerHTML=V[tab]?V[tab]():'<div class="empty">Sayfa yok.</div>';markNav();updateLiveBadge();
 const i=$('#q');if(i)i.oninput=e=>{q=e.target.value;$('#pl').innerHTML=plist()};
 const f=$('#af');if(f)f.onsubmit=auth;
 const r1=$('#reg1');if(r1)r1.onsubmit=e=>{e.preventDefault();const d=Object.fromEntries(new FormData(e.target));regDraft={...regDraft,...d};regStep=2;authErr='';render(false)};
 const city=$('#citySel');if(city)city.onchange=()=>{regDraft.city=city.value;regDraft.district='';const sel=$('#distSel');const list=PLACES[city.value]||[];sel.disabled=!city.value;sel.innerHTML=`<option value="">${city.value?'İlçe seç':'Önce il seç'}</option>`+list.map(x=>`<option value="${escAttr(x)}">${esc(x)}</option>`).join('')};
 const sup=$('#supForm');if(sup)sup.onsubmit=e=>{e.preventDefault();act(async()=>{const message=String(new FormData(e.target).get('message')||'');toast((await api('/support','POST',{message})).message);e.target.reset()})};
 const st=$('#stake');if(st)st.oninput=()=>{const v=Math.max(0,+st.value||0);stakeAmt=v||stakeAmt;const p=$('#pot');if(p&&S.slip)p.textContent=fmt(Math.round(v*100*S.slip.odd))};
 mountPromoSwiper();reveal();
 if(anim){scrollTo(0,0);intro()}
}
function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.setAttribute('role','status');d.textContent=t;document.body.appendChild(d);
 g.fromTo(d,{y:12,opacity:0},{y:0,opacity:1,duration:.3});g.to(d,{opacity:0,y:8,duration:.3,delay:2.2,onComplete:()=>d.remove()});setTimeout(()=>d.remove(),2900)}
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
 S.matches=sp.matches.map(m=>({...m,odds:{...m.odds}}));S.payments=pay.payments;S.faq=faq.faq}
async function auth(e){e.preventDefault();
 const raw=Object.fromEntries(new FormData(e.target));
 const payload=authMode==='register'?{...regDraft,...raw}:raw;
 try{const r=await api('/auth/'+(authMode=='login'?'login':'register'),'POST',payload);S.user=r.user;authErr='';regStep=1;regDraft={};
  await Promise.all([loadUserData(),loadTx(),loadProfileExtra()]);first=true;buildNav();render();
  showWelcome(S.user.firstName||S.user.username)}
 catch(x){authErr=x.message;const el=$('.err');if(el)el.textContent=authErr}}
async function act(fn){try{await fn()}catch(x){if(!gateMsg(x))toast(x.message)}}

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-go],[data-p],[data-cat],[data-pt],[data-fav],[data-launch],[data-claim],[data-bell],[data-mode],[data-logout],[data-promo],[data-bet],[data-sfilter],[data-wtab],[data-pgroup],[data-sheet],[data-ptab],[data-reg-back],[data-clear-slip],[data-place-bet],[data-menu],[data-search],[data-focus-sup]');
 if(!b||!S.user)return;const d=b.dataset;
 const inOv=b.closest('.drawer-ov,.search-ov');
 const nav=()=>{if(inOv)closeAll()};
 if('menu' in d){openDrawer();return}
 if('search' in d){openSearch();return}
 if(d.go){nav();tab=d.go;if(d.wtabGo)walletTab=d.wtabGo;else if(tab==='wallet'&&!b.closest('.seg'))walletTab=walletTab==='gecmis'?'yatir':walletTab;
  if(d.catGo)cat=d.catGo;if(d.ptabGo)profileTab=d.ptabGo;if(d.auth){authMode=d.auth;regStep=1}
  if(tab==='me'||tab==='wallet'){render();Promise.all([loadTx(),loadProfileExtra()]).then(()=>(tab==='me'||tab==='wallet')&&render(false)).catch(()=>{})}else render()}
 else if(d.ptab){profileTab=d.ptab;render(false)}
 else if('regBack' in d){regStep=1;authErr='';render(false)}
 else if(d.p){nav();prov=d.p;pt='Oyunlar';tab='detail';render()}
 else if(d.promo){promoId=d.promo;tab='promodetail';render()}
 else if(d.cat){if(d.cat==='Promosyonlar'){tab='promo';render();return}cat=d.cat;tab='games';render(false)}
 else if(d.pt){pt=d.pt;render(false)}
 else if(d.sfilter){sportFilter=d.sfilter;render(false)}
 else if(d.wtab){walletTab=d.wtab;if(walletTab==='cek'&&payGroup==='kart')payGroup='all';render(false)}
 else if(d.pgroup){payGroup=d.pgroup;render(false)}
 else if(d.sheet){openPaySheet(d.sheet,d.pm)}
 else if('focusSup' in d){$('#supForm textarea')?.focus();$('#supForm')?.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'center'})}
 else if(d.bet){nav();if(S.user.guest){toast('Bahis için giriş yap');tab='me';authMode='login';render();return}
  S.slip={id:d.bet,sel:d.sel,odd:+d.odd,label:d.label};toast('Kuponuna eklendi');
  if(tab!=='sport'&&tab!=='live'){const m=S.matches.find(x=>x.id===d.bet);tab=m?.live?'live':'sport'}
  render(false);$('.slip')?.scrollIntoView({behavior:REDUCE?'auto':'smooth',block:'nearest'})}
 else if('clearSlip' in d){S.slip=null;render(false)}
 else if('placeBet' in d)act(async()=>{
  const st=$('#stake');const v=+(st?.value||stakeAmt);
  if(!Number.isFinite(v)||v<1)return toast('Geçerli bir tutar gir');stakeAmt=v;
  if(!S.slip)return toast('Kupon boş');
  const r=await api('/bets','POST',{stake:stakeAmt,odd:S.slip.odd,selection:S.slip.label});
  setBal(r.balance);S.slip=null;await Promise.all([loadTx(),loadProfileExtra()]);toast(r.won?`Tebrikler! +${fmt(r.payout)}`:'Bu kupon kaybetti (demo)');render(false)})
 else if(d.fav)act(async()=>{const on=S.favs.has(d.fav);on?S.favs.delete(d.fav):S.favs.add(d.fav);document.querySelectorAll(`[data-fav="${CSS.escape(d.fav)}"]`).forEach(x=>x.classList.toggle('on',!on));
  try{await api('/favorites/'+encodeURIComponent(d.fav),on?'DELETE':'POST')}catch(x){on?S.favs.add(d.fav):S.favs.delete(d.fav);document.querySelectorAll(`[data-fav="${CSS.escape(d.fav)}"]`).forEach(y=>y.classList.toggle('on',on));throw x}})
 else if(d.launch){nav();const gm=S.games.find(x=>x.id===d.launch);if(gm&&demoUrl(gm))openGame(gm);else toast(gm?.category==='live'?'Canlı masalar demo modunda açılamıyor.':'Bu oyun yakında oynanabilir olacak.')}
 else if(d.claim)act(async()=>{const r=await api(`/promotions/${encodeURIComponent(d.claim)}/claim`,'POST');setBal(r.balance);const p=S.promos.find(x=>x.id==d.claim);if(p)p.claimed=true;toast('Bonus hesabına eklendi');render(false)})
 else if('bell' in d)act(async()=>{const n=await api('/notifications');toast(n.notifications[0]?.title||'Yeni bildirim yok');if(n.unread){await api('/notifications/read','POST');S.unread=0;document.querySelector('.dot')?.remove()}})
 else if('mode' in d){authMode=authMode=='login'?'register':'login';regStep=1;authErr='';render(false)}
 else if('logout' in d){localStorage.removeItem('bw_session');location.reload()}
});

/* tactile press — only animates the pressed element */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||REDUCE)return;b.style.transition='transform .1s';b.style.transform='scale(.97)';
 const up=()=>{b.style.transform='';setTimeout(()=>{b.style.transition='';},150);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
 addEventListener('pointerup',up);addEventListener('pointercancel',up)});
DESK.addEventListener?.('change',markNav);

(async()=>{
 try{
  try{S.user=(await api('/me')).user}catch(x){if(x.status&&x.status!=401)throw x;S.user=(await api('/auth/guest','POST')).user}
  const [p,gm]=await Promise.all([api('/providers'),api('/games')]).then(r=>[r[0].providers,r[1].games]);
  S.providers=p;S.games=gm;await Promise.all([loadUserData(),loadTx(),loadExtra(),loadProfileExtra()]);
  buildNav();render();
 }catch(x){console.error(x);$('#app').innerHTML='<div class="empty">Veriler yüklenemedi.<br>Sayfayı yenile.</div>'}
})();
