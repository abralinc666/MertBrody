/* BrodyBet – saf frontend demo (v2) */
const $=s=>document.querySelector(s);
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
const NOOP={from(){},to(){},fromTo(){},set(){},killTweensOf(){},timeline:()=>({to(){return this},from(){return this},fromTo(){return this}})};
const g=window.gsap&&!REDUCE?window.gsap:NOOP;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const escAttr=esc;
const ic=d=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={
home:'<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
sport:'<circle cx="12" cy="12" r="9"/><path d="M12 7.5l4.3 3.1-1.6 5h-5.4l-1.6-5z"/><path d="M12 3v4.5M3.6 9.3l4.1 1.3M20.4 9.3l-4.1 1.3M6.6 19.2l2.7-3.6M17.4 19.2l-2.7-3.6"/>',
live:'<circle cx="12" cy="12" r="2.5"/><path d="M16.2 7.8a6 6 0 0 1 0 8.4M7.8 16.2a6 6 0 0 1 0-8.4M19 5a10 10 0 0 1 0 14M5 19A10 10 0 0 1 5 5"/>',
promo:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
me:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
prov:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
back:'<path d="M15 18l-6-6 6-6"/>',next:'<path d="M9 18l6-6-6-6"/>',
heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
play:'<path d="M8 5v14l11-7z" fill="currentColor" stroke="none"/>',
casino:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1" fill="currentColor"/><circle cx="15.5" cy="15.5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/>',
slots:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
table:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
wallet:'<rect x="2" y="6" width="20" height="14" rx="2"/><path d="M2 10h20M16 14h2"/>',
support:'<path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/>',
trophy:'<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
flame:'<path d="M12 22c4 0 7-2.7 7-7 0-4-3-6.5-4-9.5-1.5 2-2 3.5-2 5-1.5-1-3-3-3-6-3 2.5-5 6-5 10.5 0 4.3 3 7 7 7z"/>'
};
const I=k=>ic(IC[k]||IC.home);

/* ---- brand ---- */
let markN=0;
const MARK_T=`<svg class="logo-mark" viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="bbg__" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E2FF6A"/><stop offset=".55" stop-color="#BDF23A"/><stop offset="1" stop-color="#86D61B"/></linearGradient><mask id="bbm__"><rect width="64" height="64" fill="#fff"/><path d="M12 43.2L52 21.6L53.4 24.2L13.4 45.8Z" fill="#000"/></mask></defs><rect width="64" height="64" rx="17" fill="url(#bbg__)"/><rect x=".75" y=".75" width="62.5" height="62.5" rx="16.25" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5"/><path d="M18 13H35.5C42 13 46 16.6 46 22.2C46 26 44 28.7 40.6 30C45 31.1 47.6 34.4 47.6 39C47.6 45.4 43 51 35.6 51H18ZM26.5 20V28H34C36.6 28 38 26.6 38 24C38 21.4 36.6 20 34 20ZM26.5 34.6V44H35C37.8 44 39.4 42.4 39.4 39.3C39.4 36.2 37.8 34.6 35 34.6Z" fill="#0A0F0B" fill-rule="evenodd" mask="url(#bbm__)"/></svg>`;
const markSVG=(style='')=>{const n=++markN;return MARK_T.replace(/__/g,n).replace('class="logo-mark"',`class="logo-mark"${style?` style="${style}"`:''}`)};
const logoHTML=()=>{
 const site=String(S.settings.siteName||'BrodyBet');
 const m=site.match(/^(.*?)(Bet)$/i);
 const word=m?`${esc(m[1])}<em>${esc(m[2])}</em>`:esc(site);
 return `<span class="logo" data-go="home" role="link" aria-label="${esc(site)} ana sayfa">${markSVG()}<span class="logo-word">${word}</span></span>`;
};

let promoSwiper=null;
const S={user:null,providers:[],games:[],favs:new Set(),promos:[],matches:[],payments:[],faq:[],unread:0,tx:[],bets:[],summary:null,slip:null,settings:{minPlay:1000,siteName:'BrodyBet'}};
const PLACES=window.TR_PLACES||{};
const CITIES=Object.keys(PLACES);
const fmt=c=>'₺'+(c/100).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const provName=id=>S.providers.find(p=>p.id===id)?.name||'';
const lg=(p,big)=>p.icon?`<img class="lgimg${big?' big':''}" src="${esc(p.icon)}" alt="${esc(p.name)}" title="${esc(p.name)}" loading="lazy" decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'lg',textContent:this.alt}))">`:`<span class="lg">${esc(p.name)}</span>`;
const tileBg=p=>{const t=String(p.tile||'dark');return t==='light'?'#EEF2EA':/^#[0-9a-f]{6}$/i.test(t)?t:'var(--s2)'};
const hue=x=>`linear-gradient(150deg,hsl(${Number(x.hue)||200} 42% 22%),hsl(${Number(x.hue)||200} 30% 8%))`;
const safeUrl=u=>{const s=String(u||'');return /^(assets\/|data:image\/|https?:\/\/)/.test(s)?s:''};
const game=x=>{
 const src=safeUrl(x.image);
 const img=src?`<img class="thumb" src="${esc(src)}" alt="" width="300" height="400" loading="lazy" decoding="async" onerror="this.remove()">`:'';
 const tag=x.category==='live'?'<span class="tag live">CANLI</span>':x.isNew?'<span class="tag">YENİ</span>':'';
 return `<div class="g"><div class="wrap"><button class="art" style="background:${hue(x)}" data-launch="${esc(x.id)}" aria-label="${esc(x.name)} oyna">${img}${tag}<span class="play" aria-hidden="true"><i>${I('play')}</i></span></button><button class="favb ${S.favs.has(x.id)?'on':''}" data-fav="${esc(x.id)}" aria-label="Favori">${I('heart')}</button></div><b>${esc(x.name)}</b><small>${esc(provName(x.provider))}</small></div>`;
};
const topBar=()=>{
 const loginChip=S.user?.guest?`<button class="chip-login" data-go="me">Giriş Yap</button>`:'';
 return `<header class="top${S.user?.guest?" guest":""}">${logoHTML()}<span class="sp"></span>${loginChip}<div class="bal"><small>Bakiye</small><span id="bal">${fmt(S.user.balance)}</span><button class="plus" data-go="wallet" aria-label="Para yatır">${I('plus')}</button></div><button class="ib" data-bell aria-label="Bildirimler">${I('bell')}${S.unread?'<i class="dot"></i>':''}</button></header>`;
};
const hd=(t,b,x)=>`<div class="hd"><button class="ib" data-go="${b}" aria-label="Geri">${I('back')}</button><span class="t">${esc(t)}</span>${x||'<span style="width:38px"></span>'}</div>`;
const secH=(title,link,icon,extra='')=>`<div class="sec rv">${icon?`<span class="ico">${I(icon)}</span>`:''}${title}${extra}${link?`<a data-go="${link}">Tümü ${I('next')}</a>`:''}</div>`;

let cat='Casino',tab='home',prov=null,pt='Oyunlar',promoId=null,q='',sportFilter='all',walletTab='yatir',profileTab='ozet',first=true,authMode='login',regStep=1,regDraft={},authErr='',stakeAmt=50;
const CATS=[['Casino','casino',''],['Live Casino','live','live'],['Slots','slots','slots'],['Table Games','table','table'],['Promosyonlar','promo','']];
const catRow=()=>`<div class="cats">${CATS.map(c=>`<button class="${c[0]==cat?'on':''}" data-cat="${c[0]}">${I(c[1])}${c[0]}</button>`).join('')}</div>`;
const TABLE_RE=/blackjack|roulette|rulet|baccarat|poker|hold.?em|craps|sic ?bo|dragon tiger|andar|fan tan|stud|teen patti/i;
const isTable=x=>x.category==='table'||TABLE_RE.test(x.name);
const byCat=l=>{const k=CATS.find(c=>c[0]==cat)?.[2];return k==='table'?l.filter(isTable):k?l.filter(x=>x.category==k):l};
const none='<div class="empty">Bu kategoride içerik yok.</div>';
const when=t=>new Date(t).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const TXN={deposit:'Yükleme',bonus:'Bonus',withdraw:'Çekim',bet:'Bahis',win:'Kazanç'};

const promoCard=x=>`<button class="bcard" data-promo="${esc(x.id)}"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}" loading="lazy" decoding="async"><div class="bmeta"><span class="bbadge">${esc(x.badge||'')}</span><h3>${esc(x.title)}</h3><p>${esc(x.subtitle||x.desc||'')}</p>${x.claimed?'<em class="taken">✓ Alındı</em>':''}</div></button>`;

/* ---- live engine: clock, score and odds move in place ---- */
const ODD_ORDER=['1','X','2'];
const crestColor=name=>{let h=0;for(const ch of String(name))h=(h*31+ch.charCodeAt(0))%360;return `hsl(${h} 70% 62%)`};
const isBasket=m=>/basket/i.test(m.sport);
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
 return `<div class="mrow ${m.live?'is-live':''}"><div class="mhead"><span class="lg-name">${I(isBasket(m)?'trophy':'sport')}${esc(m.league)}</span>${m.live?`<span class="clock"><i class="live-dot"></i><span data-clock="${esc(m.id)}">${clockText(m)}</span></span>`:`<span class="when">${esc(m.time)}</span>`}</div>
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
  // score events
  let scorer=-1,pts=0;
  if(isBasket(m)){if(Math.random()<.12){scorer=Math.random()<.5?0:1;pts=Math.random()<.3?3:Math.random()<.2?1:2}}
  else if(Math.random()<.0035){scorer=Math.random()<.5?0:1;pts=1}
  if(scorer>=0&&m._clock<cap){
   m._sc[scorer]+=pts;m.score=m._sc.join('-');
   document.querySelectorAll(`[data-sc="${CSS.escape(m.id)}-${scorer}"]`).forEach(el=>{el.textContent=m._sc[scorer];el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')});
   if(!isBasket(m))toast(`GOL! ${scorer?m.away:m.home} · ${m.home} ${m._sc[0]}-${m._sc[1]} ${m.away}`);
  }
  // odds drift
  if(liveTick%3===0&&Math.random()<.45){
   const keys=ODD_ORDER.filter(k=>m.odds[k]!=null),k=keys[Math.floor(Math.random()*keys.length)];
   const old=m.odds[k],nv=Math.min(50,Math.max(1.01,Math.round(old*(1+(Math.random()-.5)*.08)*100)/100));
   if(nv!==old){m.odds[k]=nv;flashOdd(m,k,nv>old?'up':'down')}
  }
 }
}
setInterval(liveStep,1000);

const plist=()=>{const s=q.toLowerCase();const l=S.providers.filter(p=>p.name.toLowerCase().includes(s)||(p.type||'').includes(s));
 return l.length?l.map(p=>`<button class="prow" data-p="${esc(p.id)}"><span class="l logo-tile" style="background:${tileBg(p)}">${lg(p)}</span><span><strong>${esc(p.name)}</strong><small>${p.type==='infra'?'Altyapı · ':''}${esc(p.tagline)}</small></span><span class="go">${I('next')}</span></button>`).join(''):'<div class="empty">Sonuç bulunamadı.</div>'};
const slipBox=()=>{
 if(!S.slip)return '';
 const pot=Math.round(stakeAmt*100*S.slip.odd);
 return `<div class="slip"><div class="slip-h"><strong>Kupon · 1 seçim</strong><button type="button" data-clear-slip>Temizle</button></div><p>${esc(S.slip.label)}</p><p class="muted">Oran <b class="num">${S.slip.odd.toFixed(2)}</b></p><div class="stake-row"><input id="stake" type="number" min="1" step="1" inputmode="decimal" value="${stakeAmt}"><span>₺</span></div><p class="muted">Olası getiri: <b class="num" id="pot">${fmt(pot)}</b></p><button class="btn" style="width:100%;margin-top:10px" type="button" data-place-bet>Bahis Yap</button></div>`;
};
const footer=()=>`<footer class="foot rv">${logoHTML()}
<p>${esc(S.settings.siteName||'BrodyBet')} bir demo projesidir. Gerçek para kullanılmaz; tüm bakiyeler, bahisler ve ödemeler sanal kredi ile simüle edilir.</p>
<div class="foot-links"><button data-go="promo">Bonuslar</button><button data-go="prov">Sağlayıcılar</button><button data-go="sport">Spor</button><button data-go="games">Casino</button><button data-go="support">Destek & SSS</button></div>
<div class="foot-badges"><span class="b18">18+</span><span>Sorumlu Oyun</span><span>Demo · Sanal kredi</span></div>
<small>© ${new Date().getFullYear()} ${esc(S.settings.siteName||'BrodyBet')}</small></footer>`;

function gateMsg(err){
 const m=err?.message||'';
 if(err?.status===401||/giriş/i.test(m)){toast(m||'Oynamak için giriş yap');tab='me';authMode='login';render();return true}
 if(/yetersiz bakiye/i.test(m)){toast(m);tab='wallet';walletTab='yatir';render();return true}
 return false;
}

const V={
home:()=>{
 const live=S.matches.filter(m=>m.live);
 const newGames=S.games.filter(x=>x.isNew).slice(0,12);
 const liveGames=S.games.filter(x=>x.category==='live'&&!isTable(x)).slice(0,12);
 const tableGames=S.games.filter(isTable).slice(0,12);
 const upcoming=S.matches.filter(m=>!m.live).slice(0,3);
 return topBar()+`<div class="hero-carousel"><div class="swiper swiper-promo"><div class="swiper-wrapper">${S.promos.slice(0,6).map(x=>`<div class="swiper-slide"><button class="slide" data-promo="${esc(x.id)}" aria-label="${esc(x.title)}"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}" decoding="async"></button></div>`).join('')}</div></div><div class="promo-dots"></div></div>
<div class="quick">
<button data-go="sport"><i>${I('sport')}</i><span>Spor</span></button>
<button data-go="live"><i>${I('live')}</i><span>Canlı</span></button>
<button data-go="games"><i>${I('casino')}</i><span>Casino</span></button>
<button data-go="promo"><i>${I('promo')}</i><span>Bonuslar</span></button>
<button data-go="wallet"><i>${I('wallet')}</i><span>Cüzdan</span></button>
<button data-go="support"><i>${I('support')}</i><span>Destek</span></button>
</div>
${live.length?secH('Şu An Canlı','live','live',` <span class="count">${live.length} maç</span>`)+`<div class="lrail rv">${live.map(matchRow).join('')}</div>`:''}
${newGames.length?secH('Öne Çıkan Oyunlar','games','flame')+`<div class="rail rv">${newGames.map(game).join('')}</div>`:''}
${liveGames.length?secH('Canlı Casino','games','casino')+`<div class="rail rv">${liveGames.map(game).join('')}</div>`:''}
${upcoming.length?secH('Yaklaşan Maçlar','sport','sport')+`<div class="mgrid rv">${upcoming.map(matchRow).join('')}</div>`:''}
${secH('Popüler Sağlayıcılar','prov','prov')}
<div class="pgrid rv">${S.providers.filter(p=>p.type!=='infra').slice(0,12).map(p=>`<button class="pbox${/^#/.test(p.tile||'')?' op':''}" style="background:${tileBg(p)}" data-p="${esc(p.id)}" aria-label="${esc(p.name)}">${lg(p)}</button>`).join('')}</div>
${tableGames.length?secH('Masa Oyunları','games','table')+`<div class="rail rv">${tableGames.map(game).join('')}</div>`:''}
${secH('Bonuslar','promo','promo')}
<div class="bscroll rv">${S.promos.slice(0,6).map(promoCard).join('')}</div>
${footer()}`},

sport:()=>{const list=sportFilter==='all'?S.matches.filter(m=>!m.live):S.matches.filter(m=>!m.live&&m.sport===sportFilter);
 const sports=['all',...new Set(S.matches.map(m=>m.sport))];
 return topBar()+`<div class="sec">Spor Bahisleri</div>
<div class="cats">${sports.map(s=>`<button class="${sportFilter===s?'on':''}" data-sfilter="${esc(s)}">${s==='all'?'Tümü':esc(s)}</button>`).join('')}</div>
<div class="mgrid">${list.length?list.map(matchRow).join(''):none}</div>${slipBox()}`},

live:()=>{const list=S.matches.filter(m=>m.live);
 return topBar()+`<div class="sec"><span class="live-tag"><i class="live-dot"></i> Canlı Bahis</span><span class="count">${list.length} maç</span></div>
<p class="lead">Skor, süre ve oranlar anlık güncellenir (simülasyon).</p>
<div class="mgrid">${list.length?list.map(matchRow).join(''):'<div class="empty">Şu an canlı maç yok.</div>'}</div>${slipBox()}`},

games:()=>{const gl=byCat(S.games);
 return topBar()+`<div class="sec">Casino <span class="muted" style="font-family:var(--font);font-weight:500">· ${gl.length} oyun</span></div>`+catRow()+(gl.length?`<div class="games">${gl.map(game).join('')}</div>`:none)},

prov:()=>hd('Sağlayıcılar','home')+`<label class="search">${I('search')}<input id="q" placeholder="Sağlayıcı veya altyapı ara…" value="${esc(q)}"></label><div id="pl">${plist()}</div>`,

detail:()=>{const p=S.providers.find(x=>x.id==prov),gl=S.games.filter(x=>x.provider==prov);
 if(!p)return hd('Sağlayıcı','prov')+'<div class="empty">Bulunamadı.</div>';
 return hd(p.name,'prov')+`<div class="pbanner"><span class="logo-tile" style="background:${tileBg(p)}">${lg(p,true)}</span><p>${esc(p.about)}</p></div>
<div class="seg">${['Oyunlar','Hakkında','Canlı Casino'].map(t=>`<button class="${t==pt?'on':''}" data-pt="${t}">${t}${t=='Oyunlar'?` (${gl.length})`:''}</button>`).join('')}</div>`+
(pt=='Oyunlar'?(gl.length?`<div class="games">${gl.map(game).join('')}</div>`:none):pt=='Hakkında'?`<div class="card"><h3>${esc(p.name)}</h3><p>${esc(p.tagline)}. ${esc(p.about)}</p></div>`:(l=>l.length?`<div class="games">${l.map(game).join('')}</div>`:'<div class="empty">Bu sağlayıcının canlı masası yok.</div>')(gl.filter(x=>x.category=='live')))},

promo:()=>topBar()+`<div class="sec">Promosyonlar & Bonuslar</div>
<p class="lead">Bonus kartına dokunarak tüm şartları görüntüle.</p>
<div class="blist">${S.promos.map(promoCard).join('')}</div>`,

promodetail:()=>{const x=S.promos.find(p=>p.id===promoId);
 if(!x)return hd('Bonus','promo')+'<div class="empty">Bonus bulunamadı.</div>';
 const block=(t,body)=>`<div class="card term"><h3>${t}</h3>${body}</div>`;
 return hd('Bonus şartları','promo')+`<div style="height:14px"></div><div class="promo-hero"><img src="${esc(safeUrl(x.image))}" alt="${esc(x.title)}"></div>
<div class="promo-head"><span class="bbadge">${esc(x.badge||'')}</span><h1>${esc(x.title)}</h1><p>${esc(x.subtitle||'')}</p></div>
${block('Bonus özeti',`<p>${esc(x.summary||x.desc||'')}</p>`)}
${block('Kimler yararlanabilir',`<p>${esc(x.eligible||'—')}</p>`)}
${block('Limitler',`<ul class="tlist"><li>Minimum yatırım: <b>${esc(x.minDeposit||'—')}</b></li><li>Maksimum bonus: <b>${esc(x.maxBonus||'—')}</b></li></ul>`)}
${block('Çevrim',`<p>${esc(x.wager||'—')}</p>`)}
${block('Süre',`<p>${esc(x.duration||'—')}</p>`)}
${block('Çekim koşulları',`<p>${esc(x.withdraw||'—')}</p>`)}
${x.example?block('Örnek hesaplama',`<p>${esc(x.example)}</p>`):''}
${block('Şartlar',`<ul class="tlist">${(x.terms||[]).map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`)}
${(x.exceptions||[]).length?block('İstisnalar',`<ul class="tlist">${x.exceptions.map(t=>`<li>${esc(t)}</li>`).join('')}</ul>`):''}
<button class="wide" data-claim="${esc(x.id)}" ${x.claimed?'disabled':''}>${x.claimed?'Bu bonus alındı':'Bonusu Al (demo)'}</button>
<p class="disclaimer">Demo ortamında gerçek para yoktur.</p>`},

wallet:()=>{const u=S.user;
 return topBar()+`<div class="sec">Cüzdan</div>
<div class="card bal-card"><small>Kullanılabilir bakiye</small><h3>${fmt(u.balance)}</h3><p>Sanal kredi · min. oyun bakiyesi ${fmt(S.settings.minPlay||1000)}</p></div>
<div class="seg">${[['yatir','Yatır'],['cek','Çek'],['yontem','Yöntemler']].map(([k,l])=>`<button class="${walletTab===k?'on':''}" data-wtab="${k}">${l}</button>`).join('')}</div>`+
(walletTab==='yatir'?`<div class="chips">${[100,250,500,1000].map(a=>`<button data-dep="${a}">+${a} ₺</button>`).join('')}</div>
<p class="lead" style="margin-top:8px">Ödeme yöntemi (demo · 250 ₺):</p><div class="paygrid">${S.payments.map(p=>`<button class="pay" data-dep-method="${esc(p.id)}" data-dep="250"><strong>${esc(p.name)}</strong><small>${esc(p.type)} · ${esc(p.eta)}</small></button>`).join('')}</div>`:
walletTab==='cek'?`<div class="card"><p>Çekim simülasyondur; gerçek para transferi yapılmaz.</p></div><div class="chips">${[50,100,250].map(a=>`<button data-wd="${a}">${a} ₺ çek</button>`).join('')}</div>`:
`<div class="paygrid">${S.payments.map(p=>`<div class="pay static"><strong>${esc(p.name)}</strong><small>${esc(p.type)} · ${esc(p.eta)}</small></div>`).join('')}</div>`)+
`<div class="sec">Son İşlemler</div>`+(S.tx.length?S.tx.map(t=>`<div class="tx"><span>${esc(t.note||TXN[t.type]||t.type)}<small>${when(t.at)}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`).join(''):'<div class="empty">Henüz işlem yok.</div>')},

support:()=>topBar()+`<div class="sec">Destek & SSS</div>
${S.faq.map(f=>`<details class="faq"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}
<div class="sec">Talep oluştur</div>
<form class="form" id="supForm"><textarea name="message" required minlength="5" maxlength="1000" placeholder="Mesajını yaz…"></textarea><button class="btn" type="submit">Talebi gönder</button></form>
<div class="card"><h3>Sorumlu oyun</h3><p class="muted">18+ · Yalnızca demo / sanal kredi. Oyun bir eğlence aracıdır; limitlerini bil.</p></div>`,

me:()=>{const u=S.user;
 if(u.guest)return topBar()+authViews();
 const tabs=[['ozet','Özet'],['bilgi','Bilgiler'],['finans','Finans'],['bahis','Bahis'],['bonus','Bonus'],['guvenlik','Güvenlik']];
 const initial=esc((u.firstName||u.username||'B').slice(0,1).toUpperCase());
 const name=esc([u.firstName,u.lastName].filter(Boolean).join(' ')||u.username);
 return topBar()+`<div class="profile">
<div class="profile-hero"><div class="avatar">${initial}</div><div><h2>${name}</h2><p>@${esc(u.username)}</p><span class="pill">${esc(u.kycStatus||'Hesap')}</span></div></div>
<div class="wallet-card"><small>Kullanılabilir bakiye</small><strong>${fmt(u.balance)}</strong>
<div class="wallet-actions"><button data-go="wallet">Para yatır</button><button class="ghost" data-go="wallet" data-wtab-go="cek">Para çek</button></div></div>
</div>
<div class="seg scroll">${tabs.map(([k,l])=>`<button class="${profileTab===k?'on':''}" data-ptab="${k}">${l}</button>`).join('')}</div>
${profileBody(u)}
<div style="padding:8px var(--pad) 20px"><button class="btn alt" style="width:100%" data-logout>Çıkış yap</button></div>`}
};

const row=(l,v)=>`<div class="pinfo"><span>${esc(l)}</span><b>${v==null||v===''?'—':esc(v)}</b></div>`;
const maskTC=t=>t&&t.length===11?t.slice(0,3)+'*****'+t.slice(-3):'—';
const maskPhone=p=>{const s=String(p||'');return s.length>4?s.slice(0,3)+'***'+s.slice(-2):'—'};

function profileBody(u){
 const sm=S.summary||{};
 if(profileTab==='ozet')return `<div class="kpi3">
  <div class="kpi"><small>Yatırım</small><strong>${fmt(sm.deposits||0)}</strong></div>
  <div class="kpi"><small>Çekim</small><strong>${fmt(sm.withdrawals||0)}</strong></div>
  <div class="kpi"><small>Bonus</small><strong>${fmt(sm.bonuses||0)}</strong></div>
  <div class="kpi"><small>Bahis</small><strong>${sm.bets||0}</strong></div>
  <div class="kpi"><small>Kazanan</small><strong>${sm.wins||0}</strong></div>
  <div class="kpi"><small>Favori</small><strong>${S.favs.size}</strong></div>
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
  (fin.length?fin.map(t=>`<div class="tx"><span>${esc(t.note||TXN[t.type]||t.type)}<small>${when(t.at)} · ${esc(t.status||'Tamamlandı')}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`).join(''):'<div class="empty">Finansal işlem yok.</div>')}
 if(profileTab==='bahis')return S.bets.length?S.bets.map(b=>`<div class="tx"><span>${esc(b.selection)}<small>${when(b.at)} · oran ${esc(b.odd)} · ${esc(b.status)}</small></span><span class="${b.won?'pos':'neg'}">${b.won?'+':'-'}${fmt(b.won?b.payout:b.stake)}</span></div>`).join(''):'<div class="empty">Bahis geçmişi boş.</div>';
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

/* ---- nav ---- */
const N=[['home','Ana Sayfa','home'],['sport','Spor','sport'],['live','Canlı','live'],['games','Casino','casino'],['me','Hesap','me']];
function buildNav(){
 const nav=$('#nav');
 nav.querySelectorAll('button,.nav-brand').forEach(x=>x.remove());
 nav.insertAdjacentHTML('beforeend',`<div class="nav-brand">${logoHTML()}</div>`+N.map(n=>`<button data-go="${n[0]}">${I(n[2])}<span>${n[1]}</span>${n[0]==='live'?'<i class="badge" id="liveBadge" hidden></i>':''}</button>`).join(''));
}
function updateLiveBadge(){const b=$('#liveBadge');if(!b)return;const n=S.matches.filter(m=>m.live).length;b.hidden=!n;b.textContent=n}
function navKey(){
 if(tab==='detail'||tab==='prov')return 'games';
 if(tab==='promodetail'||tab==='promo')return 'home';
 if(tab==='wallet'||tab==='support')return 'me';
 return tab;
}
function showWelcome(name){
 document.querySelector('.welcome-pop')?.remove();
 const d=document.createElement('div');d.className='welcome-pop';d.setAttribute('role','dialog');d.setAttribute('aria-modal','true');
 d.innerHTML=`<div class="welcome-card"><button class="welcome-x" type="button" aria-label="Kapat">×</button>
 <img src="assets/brand/welcome-v2.jpg" alt="Hoş geldiniz">
 <div class="welcome-body"><h2>Hoş geldin${name?`, ${esc(name)}`:''}!</h2>
 <p>Hesabın hazır. Bonusları keşfet; spor, canlı ve casino tarafının keyfini çıkar.</p>
 <button type="button" class="btn welcome-ok">Devam et</button></div></div>`;
 document.body.appendChild(d);
 const close=()=>{d.style.transition='opacity .2s';d.style.opacity='0';setTimeout(()=>d.remove(),220)};
 d.querySelector('.welcome-x').onclick=close;
 d.querySelector('.welcome-ok').onclick=close;
 d.addEventListener('click',e=>{if(e.target===d)close()});
 g.fromTo(d,{opacity:0},{opacity:1,duration:.25});
 g.fromTo(d.querySelector('.welcome-card'),{y:24,scale:.96},{y:0,scale:1,duration:.4,ease:'power3.out'});
}
const DESK=matchMedia('(min-width:1024px)');
function moveInd(){
 const on=navKey(),b=[...document.querySelectorAll('#nav button')];
 b.forEach(x=>x.classList.toggle('on',x.dataset.go==on));
 const a=b.find(x=>x.dataset.go==on);if(!a)return;
 const r=a.getBoundingClientRect(),n=$('#nav').getBoundingClientRect(),ind=$('#ind');
 const tf=DESK.matches?`translate(0px,${r.top-n.top+r.height/2-13}px)`:`translate(${r.left-n.left+r.width/2-18}px,0px)`;
 if(!ind._placed||REDUCE){ind.style.transition='none';ind.style.transform=tf;ind._placed=true}
 else{ind.style.transition='transform .45s cubic-bezier(.2,.8,.2,1)';ind.style.transform=tf}
}
function killPromoSwiper(){if(promoSwiper){try{promoSwiper.destroy(true,true)}catch(_){}promoSwiper=null}}
function mountPromoSwiper(){
 killPromoSwiper();
 if(!window.Swiper||!$('.swiper-promo'))return;
 const n=$('.swiper-promo').querySelectorAll('.swiper-slide').length;
 promoSwiper=new Swiper('.swiper-promo',{
  slidesPerView:1,spaceBetween:12,speed:650,loop:n>=4,
  autoplay:REDUCE||n<2?false:{delay:4500,disableOnInteraction:false,pauseOnMouseEnter:true},
  pagination:{el:'.promo-dots',clickable:true},
  breakpoints:{1024:{slidesPerView:2,spaceBetween:14}},
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
 $('#app').innerHTML=V[tab]?V[tab]():'<div class="empty">Sayfa yok.</div>';moveInd();updateLiveBadge();
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
 const b=e.target.closest('[data-go],[data-p],[data-cat],[data-pt],[data-fav],[data-launch],[data-claim],[data-dep],[data-dep-method],[data-wd],[data-bell],[data-mode],[data-logout],[data-promo],[data-bet],[data-sfilter],[data-wtab],[data-ptab],[data-reg-back],[data-clear-slip],[data-place-bet]');
 if(!b||!S.user)return;const d=b.dataset;
 if(d.go){tab=d.go;if(d.wtabGo)walletTab=d.wtabGo;if(tab==='me'||tab==='wallet'){render();Promise.all([loadTx(),loadProfileExtra()]).then(()=>(tab==='me'||tab==='wallet')&&render(false)).catch(()=>{})}else render()}
 else if(d.ptab){profileTab=d.ptab;render(false)}
 else if('regBack' in d){regStep=1;authErr='';render(false)}
 else if(d.p){prov=d.p;pt='Oyunlar';tab='detail';render()}
 else if(d.promo){promoId=d.promo;tab='promodetail';render()}
 else if(d.cat){if(d.cat==='Promosyonlar'){tab='promo';render();return}cat=d.cat;tab='games';render(false)}
 else if(d.pt){pt=d.pt;render(false)}
 else if(d.sfilter){sportFilter=d.sfilter;render(false)}
 else if(d.wtab){walletTab=d.wtab;render(false)}
 else if(d.bet){if(S.user.guest){toast('Bahis için giriş yap');tab='me';authMode='login';render();return}
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
 else if(d.launch)act(async()=>toast((await api(`/games/${encodeURIComponent(d.launch)}/launch`,'POST')).message))
 else if(d.claim)act(async()=>{const r=await api(`/promotions/${encodeURIComponent(d.claim)}/claim`,'POST');setBal(r.balance);const p=S.promos.find(x=>x.id==d.claim);if(p)p.claimed=true;toast('Bonus hesabına eklendi');render(false)})
 else if(d.dep||d.depMethod)act(async()=>{const amount=+(d.dep||250);const r=await api('/wallet/deposit','POST',{amount,method:d.depMethod||'havale'});setBal(r.balance);await loadTx();toast(`+${amount} ₺ yüklendi`);render(false)})
 else if(d.wd)act(async()=>{const r=await api('/wallet/withdraw','POST',{amount:+d.wd});setBal(r.balance);await loadTx();toast(`${d.wd} ₺ çekim simüle edildi`);render(false)})
 else if('bell' in d)act(async()=>{const n=await api('/notifications');toast(n.notifications[0]?.title||'Yeni bildirim yok');if(n.unread){await api('/notifications/read','POST');S.unread=0;document.querySelector('.dot')?.remove()}})
 else if('mode' in d){authMode=authMode=='login'?'register':'login';regStep=1;authErr='';render(false)}
 else if('logout' in d){localStorage.removeItem('bw_session');location.reload()}
});

/* tactile press — only animates the pressed element */
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(!b||REDUCE)return;b.style.transition='transform .1s';b.style.transform='scale(.97)';
 const up=()=>{b.style.transform='';setTimeout(()=>{b.style.transition='';},150);removeEventListener('pointerup',up);removeEventListener('pointercancel',up)};
 addEventListener('pointerup',up);addEventListener('pointercancel',up)});
addEventListener('resize',moveInd);
DESK.addEventListener?.('change',moveInd);

(async()=>{
 try{
  try{S.user=(await api('/me')).user}catch(x){if(x.status&&x.status!=401)throw x;S.user=(await api('/auth/guest','POST')).user}
  const [p,gm]=await Promise.all([api('/providers'),api('/games')]).then(r=>[r[0].providers,r[1].games]);
  S.providers=p;S.games=gm;await Promise.all([loadUserData(),loadTx(),loadExtra(),loadProfileExtra()]);
  buildNav();render();
 }catch(x){console.error(x);$('#app').innerHTML='<div class="empty">Veriler yüklenemedi.<br>Sayfayı yenile.</div>'}
})();
