/* Betwin – saf frontend (örnek veri). GSAP yüklenemezse animasyonsuz çalışır. */
const $=s=>document.querySelector(s);
const REDUCE=matchMedia('(prefers-reduced-motion:reduce)').matches;
const g=window.gsap&&!REDUCE?window.gsap:{from(){},to(){},fromTo(){},set(){},killTweensOf(){},timeline:()=>({to(){return this}})};
const ic=d=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const IC={
home:'<path d="M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
prov:'<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
games:'<circle cx="12" cy="12" r="9"/><path d="M10 8.5l5 3.5-5 3.5z"/>',
promo:'<path d="M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z"/>',
me:'<path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/>',
bell:'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0"/>',
search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
back:'<path d="M15 18l-6-6 6-6"/>',next:'<path d="M9 18l6-6-6-6"/>',
heart:'<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
plus:'<path d="M12 5v14M5 12h14"/>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
ext:'<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
casino:'<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r=".9"/><circle cx="15.5" cy="15.5" r=".9"/><circle cx="12" cy="12" r=".9"/>',
live:'<rect x="2" y="5" width="14" height="14" rx="2"/><path d="M22 7l-6 5 6 5z"/>',
slots:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>',
table:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>'};
const I=k=>ic(IC[k]);
/* ---------- API: js/api.js (tarayıcı içi backend) ---------- */
const S={user:null,providers:[],games:[],favs:new Set(),promos:[],unread:0,tx:[]};
const fmt=c=>'$'+(c/100).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const lgo={pragmatic:'Pragmatic <span style="color:#d9a441">Play</span>',playngo:'Play’n <span style="color:#ef6a6a">GO</span>',bet365:'bet<span style="color:#4fbf8a">365</span>',micro:'<span style="color:#4fbf8a">Micro</span>gaming',hacksaw:'HACKSAW',elk:'<span style="color:#5aa9e6">ELK</span> Studios',netent:'Net<span style="color:#4fbf8a">Ent</span>'};
const lg=p=>`<span class="lg">${lgo[p.id]||p.name}</span>`;
const hue=x=>`linear-gradient(150deg,hsl(${x.hue} 45% 30%),hsl(${x.hue} 40% 9%))`;
const game=x=>`<div class="g"><div class="wrap"><button class="art" style="background:${hue(x)}" data-launch="${x.id}"><span>${x.name}</span></button><button class="favb ${S.favs.has(x.id)?'on':''}" data-fav="${x.id}" aria-label="Favori">${I('heart')}</button></div><b>${x.name}</b><small>${S.providers.find(p=>p.id===x.provider)?.name||''}</small></div>`;
const top=()=>`<div class="top"><span class="logo">BETWIN</span><span class="sp"></span><div class="bal"><span id="bal">${fmt(S.user.balance)}</span><button class="plus" data-go="me" aria-label="Bakiye ekle">${I('plus')}</button></div><button class="ib" data-bell aria-label="Bildirimler">${I('bell')}${S.unread?'<i class="dot"></i>':''}</button></div>`;
const hd=(t,b,x)=>`<div class="hd"><button class="ib" data-go="${b}" aria-label="Geri">${I('back')}</button><span class="t">${t}</span>${x||'<span style="width:38px"></span>'}</div>`;
let cat='Casino',tab='home',prov=null,pt='Oyunlar',q='',first=true,authMode='login',authErr='';
const CATS=[['Casino','casino',''],['Live Casino','live','live'],['Slots','slots','slots'],['Table Games','table','table'],['Promotions','promo','']];
const catRow=()=>`<div class="cats">${CATS.map(c=>`<button class="${c[0]==cat?'on':''}" data-cat="${c[0]}">${I(c[1])}${c[0]}</button>`).join('')}</div>`;
const byCat=l=>{const k=CATS.find(c=>c[0]==cat)[2];return k?l.filter(g=>g.category==k):l};
const rings=`<svg class="rings" viewBox="0 0 280 280"><circle class="r1" cx="140" cy="140" r="130" stroke-dasharray="2 8"/><circle cx="140" cy="140" r="100"/><circle class="r2" cx="140" cy="140" r="70" stroke-dasharray="40 12"/><circle cx="140" cy="140" r="40"/></svg>`;
const none='<div class="empty">Bu kategoride oyun yok. Başka bir kategori dene.</div>';
const plist=()=>{const l=S.providers.filter(p=>p.name.toLowerCase().includes(q.toLowerCase()));return l.length?l.map(p=>`<button class="prow" data-p="${p.id}"><span class="l">${lg(p)}</span><span><strong>${p.name}</strong><small>${p.tagline}</small></span><span class="go">${I('next')}</span></button>`).join(''):'<div class="empty">Sonuç bulunamadı. Farklı bir ad dene.</div>'};
const when=t=>new Date(t).toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
const TXN={deposit:'Yükleme',bonus:'Bonus'};
const V={
home:()=>{const gl=byCat(S.games);return top()+catRow()+`<div class="hero">${rings}<h1>${S.games.length}+</h1><h2>CASINO OYUNU</h2><p>En iyi sağlayıcılarla üst düzey eğlence.</p><button class="cta" data-go="games">Hemen Oyna ${I('arrow')}</button></div>
<div class="sec">Popüler Sağlayıcılar<a data-go="prov">Tümünü Gör</a></div>
<div class="pgrid">${S.providers.slice(0,6).map(p=>`<button class="pbox" data-p="${p.id}">${lg(p)}</button>`).join('')}</div>
<div class="sec">${cat=='Casino'?'Yeni Oyunlar':cat}<a data-go="games">Tümünü Gör</a></div>
${gl.length?`<div class="games">${(cat=='Casino'?gl.filter(g=>g.isNew):gl).slice(0,3).map(game).join('')}</div>`:none}`},
prov:()=>hd('Sağlayıcılar','home')+`<label class="search">${I('search')}<input id="q" placeholder="Sağlayıcı ara…" value="${q}"></label><div id="pl">${plist()}</div>`,
detail:()=>{const p=S.providers.find(x=>x.id==prov),gl=S.games.filter(g=>g.provider==prov);
 return hd(p.name,'prov')+`<div class="pbanner">${lg(p)}<p>${p.about}</p></div>
<div class="seg">${['Oyunlar','Hakkında','Canlı Casino'].map(t=>`<button class="${t==pt?'on':''}" data-pt="${t}">${t}${t=='Oyunlar'?` (${gl.length})`:''}</button>`).join('')}</div>`+
(pt=='Oyunlar'?`<div class="games">${gl.map(game).join('')}</div>`:pt=='Hakkında'?`<div class="card"><h3>${p.name}</h3><p>${p.tagline}. ${p.about}</p></div>`:(g=>g.length?`<div class="games">${g.map(game).join('')}</div>`:'<div class="empty">Bu sağlayıcının canlı masası yok.</div>')(gl.filter(x=>x.category=='live')))+`<button class="wide" data-t="Sağlayıcı sitesi demo modunda kapalı">Sağlayıcıya Git ${I('ext')}</button>`},
games:()=>{const gl=byCat(S.games);return top()+catRow()+`<div class="sec" style="padding-top:6px">Tüm Oyunlar</div>${gl.length?`<div class="games">${gl.map(game).join('')}</div>`:none}`},
promo:()=>top()+`<div class="sec" style="padding-top:6px">Promosyonlar</div>`+S.promos.map(x=>`<div class="pcard"><div><h3>${x.title}</h3><p>${x.desc}</p></div><button class="btn" data-claim="${x.id}" ${x.claimed?'disabled':''}>${x.claimed?'Alındı':'Al'}</button></div>`).join(''),
me:()=>{const u=S.user;return top()+`<div class="sec" style="padding-top:6px">${u.guest?'Misafir hesap':u.username}</div>
<div class="card"><h3>${fmt(u.balance)}</h3><p>Sanal kredi bakiyesi. Gerçek para içermez.</p></div>
<div class="chips">${[100,500,1000].map(a=>`<button data-dep="${a}">+${a}</button>`).join('')}</div>`+
(u.guest?`<div class="sec">${authMode=='login'?'Giriş yap':'Hesap oluştur'}</div><form class="form" id="af"><input name="username" placeholder="Kullanıcı adı" autocomplete="username" required><input name="password" type="password" placeholder="Şifre (en az 8 karakter)" autocomplete="${authMode=='login'?'current-password':'new-password'}" required><div class="row"><button class="btn">${authMode=='login'?'Giriş yap':'Kayıt ol'}</button><button type="button" class="btn alt" data-mode>${authMode=='login'?'Hesap oluştur':'Girişe dön'}</button></div></form><div class="err">${authErr}</div>`:`<div style="padding:0 16px 8px"><button class="btn alt" style="width:100%" data-logout>Çıkış yap</button></div>`)+
`<div class="sec">Son İşlemler</div>`+(S.tx.length?S.tx.map(t=>`<div class="tx"><span>${t.note||TXN[t.type]}<small>${when(t.at)}</small></span><span class="${t.amount>=0?'pos':'neg'}">${t.amount>=0?'+':''}${fmt(t.amount)}</span></div>`).join(''):'<div class="empty">Henüz işlem yok.</div>')}};
const N=[['home','Ana Sayfa'],['prov','Sağlayıcılar'],['games','Oyunlar'],['promo','Promosyonlar'],['me','Profil']];
$('#nav').insertAdjacentHTML('beforeend',N.map(n=>`<button data-go="${n[0]}">${I(n[0])}${n[1]}</button>`).join(''));
function moveInd(){const on=tab=='detail'?'prov':tab,b=[...document.querySelectorAll('#nav button')];
 b.forEach(x=>x.classList.toggle('on',x.dataset.go==on));
 const a=b.find(x=>x.dataset.go==on),r=a.getBoundingClientRect(),n=$('#nav').getBoundingClientRect(),x=r.left-n.left+r.width/2-18;
 g.to('#ind',{x,duration:.45,ease:'power3.out'});if(REDUCE)$('#ind').style.transform=`translateX(${x}px)`}
function intro(){
 g.from('.top > *',{y:-10,opacity:0,stagger:.06,duration:.5,ease:'power3.out'});
 g.from('.cats button',{x:20,opacity:0,stagger:.05,duration:.5,ease:'power3.out',delay:.1,clearProps:'all'});
 g.from('.hero',{y:24,opacity:0,duration:.7,ease:'power3.out',delay:.15,clearProps:'all'});
 g.from('.hero h1,.hero h2,.hero p,.hero .cta',{y:14,opacity:0,stagger:.08,duration:.6,ease:'power3.out',delay:.3,clearProps:'all'});
 g.to('.r1',{rotation:360,svgOrigin:'140 140',duration:60,repeat:-1,ease:'none'});
 g.to('.r2',{rotation:-360,svgOrigin:'140 140',duration:40,repeat:-1,ease:'none'});
 g.from('.pbox,.g,.prow,.card,.pcard,.pbanner,.seg,.search,.wide,.tx',{y:18,opacity:0,stagger:.04,duration:.5,ease:'power3.out',delay:.25,clearProps:'all'});
 g.from('.sec',{x:-12,opacity:0,stagger:.1,duration:.5,ease:'power3.out',delay:.3,clearProps:'all'});
 const b=$('#bal');if(b&&first){const o={v:0},end=S.user.balance;g.to(o,{v:end,duration:1.2,ease:'power2.out',delay:.3,onUpdate(){b.textContent=fmt(o.v)},onComplete(){b.textContent=fmt(S.user.balance)}});first=false}}
function render(anim=true){
 $('#app').innerHTML=V[tab]();moveInd();
 const i=$('#q');if(i)i.oninput=e=>{q=e.target.value;$('#pl').innerHTML=plist()};
 const f=$('#af');if(f)f.onsubmit=auth;
 if(anim){scrollTo(0,0);intro()}}
function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);
 g.fromTo(d,{y:12,opacity:0},{y:0,opacity:1,duration:.3,ease:'power2.out'});g.to(d,{opacity:0,y:8,duration:.3,delay:1.8,onComplete:()=>d.remove()});setTimeout(()=>d.remove(),2400)}
const setBal=b=>{S.user.balance=b;const e=$('#bal');if(e)e.textContent=fmt(b)};
async function loadUserData(){
 const [f,p,n]=await Promise.all([api('/favorites'),api('/promotions'),api('/notifications')]);
 S.favs=new Set(f.favorites);S.promos=p.promotions;S.unread=n.unread}
async function loadTx(){S.tx=(await api('/wallet/transactions')).transactions}
async function auth(e){e.preventDefault();const d=Object.fromEntries(new FormData(e.target));
 try{const r=await api('/auth/'+(authMode=='login'?'login':'register'),'POST',d);S.user=r.user;authErr='';
  await Promise.all([loadUserData(),loadTx()]);first=true;toast(authMode=='login'?'Giriş yapıldı':'Hesap oluşturuldu');render()}
 catch(x){authErr=x.message;$('.err').textContent=authErr}}
async function act(fn){try{await fn()}catch(x){toast(x.message)}}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-go],[data-p],[data-cat],[data-pt],[data-t],[data-fav],[data-launch],[data-claim],[data-dep],[data-bell],[data-mode],[data-logout]');if(!b||!S.user)return;const d=b.dataset;
 if(d.go){tab=d.go;if(tab=='me')loadTx().then(()=>tab=='me'&&render(false));render()}
 else if(d.p){prov=d.p;pt='Oyunlar';tab='detail';render()}
 else if(d.cat){if(d.cat=='Promotions'){tab='promo';render();return}cat=d.cat;render(false);g.from('.cats .on',{scale:.9,duration:.3,ease:'back.out(2)'});g.from('.games > *',{y:12,opacity:0,stagger:.04,duration:.4,clearProps:'all'})}
 else if(d.pt){pt=d.pt;render(false);g.from('.seg ~ *',{y:10,opacity:0,stagger:.04,duration:.4,ease:'power3.out',clearProps:'all'})}
 else if(d.fav)act(async()=>{const on=S.favs.has(d.fav);on?S.favs.delete(d.fav):S.favs.add(d.fav);document.querySelectorAll(`[data-fav="${d.fav}"]`).forEach(x=>x.classList.toggle('on',!on));
  g.fromTo(b,{scale:1.3},{scale:1,duration:.4,ease:'back.out(3)'});try{await api('/favorites/'+d.fav,on?'DELETE':'POST')}catch(x){on?S.favs.add(d.fav):S.favs.delete(d.fav);document.querySelectorAll(`[data-fav="${d.fav}"]`).forEach(y=>y.classList.toggle('on',on));throw x}})
 else if(d.launch)act(async()=>toast((await api(`/games/${d.launch}/launch`,'POST')).message))
 else if(d.claim)act(async()=>{const r=await api(`/promotions/${d.claim}/claim`,'POST');setBal(r.balance);S.promos.find(x=>x.id==d.claim).claimed=true;toast('Bonus hesabına eklendi');render(false)})
 else if(d.dep)act(async()=>{const r=await api('/wallet/deposit','POST',{amount:+d.dep});setBal(r.balance);await loadTx();toast(`+${d.dep} sanal kredi eklendi`);render(false)})
 else if('bell' in d)act(async()=>{const n=await api('/notifications');toast(n.notifications[0]?.title||'Yeni bildirim yok');if(n.unread){await api('/notifications/read','POST');S.unread=0;document.querySelector('.dot')?.remove()}})
 else if('mode' in d){authMode=authMode=='login'?'register':'login';authErr='';render(false)}
 else if('logout' in d){localStorage.removeItem('bw_session');location.reload()}
 else if(d.t)toast(d.t)});
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(b)g.to(b,{scale:.97,duration:.1})});
['pointerup','pointercancel'].forEach(ev=>document.addEventListener(ev,()=>g.to('button',{scale:1,duration:.25,ease:'back.out(3)',overwrite:'auto'}),true));
document.addEventListener('pointermove',e=>{const h=$('.hero .rings');if(h)g.to(h,{x:(e.clientX/innerWidth-.5)*14,y:(e.clientY/innerHeight-.5)*10,duration:.8,ease:'power2.out'})});
addEventListener('resize',moveInd);
(async()=>{
 try{
  try{S.user=(await api('/me')).user}catch(x){if(x.status&&x.status!=401)throw x;S.user=(await api('/auth/guest','POST')).user}
  const [p,gm]=await Promise.all([api('/providers'),api('/games'),]).then(r=>[r[0].providers,r[1].games]);
  S.providers=p;S.games=gm;await Promise.all([loadUserData(),loadTx()]);render();
 }catch(x){$('#app').innerHTML='<div class="empty">Veriler yüklenemedi.<br>Sayfayı yenile veya tarayıcı verilerine izin ver.</div>'}
})();
