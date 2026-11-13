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
const P=[
['pragmatic','Pragmatic Play','Dünyanın en popüler sağlayıcısı','Pragmatic <span style="color:#d9a441">Play</span>','Dünyanın en sevilen slotları burada.'],
['evolution','Evolution','Live Casino’nun lideri','Evolution','Canlı casino deneyiminin lideri.'],
['playngo','Play’n GO','Efsanevi oyun deneyimi','Play’n <span style="color:#ef6a6a">GO</span>','Efsanevi oyun deneyimi.'],
['bet365','bet365','Güvenilir casino deneyimi','bet<span style="color:#4fbf8a">365</span>','Güvenilir casino deneyimi.'],
['micro','Microgaming','Klasik ve modern oyunlar','<span style="color:#4fbf8a">Micro</span>gaming','Klasik ve modern oyunlar.'],
['hacksaw','Hacksaw Gaming','Yenilikçi oyunlar','HACKSAW','Yenilikçi oyunlar.'],
['elk','ELK Studios','Kaliteli oyunlar','<span style="color:#5aa9e6">ELK</span> Studios','Kaliteli oyunlar.'],
['netent','NetEnt','Premium içerik','Net<span style="color:#4fbf8a">Ent</span>','Premium içerik.'],
['push','Push Gaming','Yüksek kaliteli slotlar','Push Gaming','Yüksek kaliteli slotlar.'],
['relax','Relax Gaming','Sade ve yenilikçi','Relax Gaming','Sade ve yenilikçi.']].map(a=>({id:a[0],n:a[1],d:a[2],lg:a[3],s:a[4]}));
const G=[
['Gates of Olympus','Pragmatic Play','#3b2a78,#14102b'],['Sweet Bonanza','Pragmatic Play','#7a2a5c,#1a0f2a'],
['Wolf Gold','Pragmatic Play','#2a3f78,#0f1426'],['The Dog House','Pragmatic Play','#7a4a2a,#1a1210'],
['Big Bass Bonanza','Pragmatic Play','#1f6a5c,#0c1a1a'],['Starlight Princess','Pragmatic Play','#5a2a7a,#140f26'],
['Sugar Rush','Pragmatic Play','#7a2a4a,#1a0f1a']];
const lg=p=>`<span class="lg">${p.lg}</span>`;
const game=x=>`<button class="g" data-t="${x[0]} yakında"><div class="art" style="background:linear-gradient(150deg,${x[2].split(',')[0]},${x[2].split(',')[1]})"><span>${x[0]}</span></div><b>${x[0]}</b><small>${x[1]}</small></button>`;
const top=()=>`<div class="top"><span class="logo">BETWIN</span><span class="sp"></span><div class="bal"><span id="bal">$10.000,00</span><button class="plus" data-t="Para yatırma yakında" aria-label="Bakiye ekle">${I('plus')}</button></div><button class="ib" data-t="Yeni bildirim yok" aria-label="Bildirimler">${I('bell')}</button></div>`;
const hd=(t,b,x)=>`<div class="hd"><button class="ib" data-go="${b}" aria-label="Geri">${I('back')}</button><span class="t">${t}</span>${x||'<span style="width:38px"></span>'}</div>`;
let cat='Casino',tab='home',prov=null,pt='Oyunlar (1200+)',q='',first=true;
const cats=[['Casino','casino'],['Live Casino','live'],['Slots','slots'],['Table Games','table'],['Promotions','promo']];
const rings=`<svg class="rings" viewBox="0 0 280 280"><circle class="r1" cx="140" cy="140" r="130" stroke-dasharray="2 8"/><circle cx="140" cy="140" r="100"/><circle class="r2" cx="140" cy="140" r="70" stroke-dasharray="40 12"/><circle cx="140" cy="140" r="40"/></svg>`;
const V={
home:()=>top()+`<div class="cats">${cats.map(c=>`<button class="${c[0]==cat?'on':''}" data-cat="${c[0]}">${I(c[1])}${c[0]}</button>`).join('')}</div>
<div class="hero">${rings}<h1>1000+</h1><h2>CASINO OYUNU</h2><p>En iyi sağlayıcılarla üst düzey eğlence.</p><button class="cta" data-go="games">Hemen Oyna ${I('arrow')}</button></div>
<div class="sec">Popüler Sağlayıcılar<a data-go="prov">Tümünü Gör</a></div>
<div class="pgrid">${P.slice(0,6).map(p=>`<button class="pbox" data-p="${p.id}">${lg(p)}</button>`).join('')}</div>
<div class="sec">Yeni Oyunlar<a data-go="games">Tümünü Gör</a></div>
<div class="games">${[G[0],G[1],G[6]].map(game).join('')}</div>`,
prov:()=>hd('Sağlayıcılar','home')+`<label class="search">${I('search')}<input id="q" placeholder="Sağlayıcı ara…" value="${q}"></label><div id="pl">${plist()}</div>`,
detail:()=>{const p=P.find(x=>x.id==prov);return hd(p.n,'prov',`<button class="ib" data-t="Favorilere eklendi" aria-label="Favori">${I('heart')}</button>`)+`<div class="pbanner">${lg(p)}<p>${p.s}</p></div>
<div class="seg">${['Oyunlar (1200+)','Hakkında','Canlı Casino'].map(t=>`<button class="${t==pt?'on':''}" data-pt="${t}">${t}</button>`).join('')}</div>`+
(pt[0]=='O'?`<div class="sec" style="padding-top:8px">Popüler Oyunlar</div><div class="games">${G.slice(0,6).map(game).join('')}</div>`:pt[0]=='H'?`<div class="card"><h3>${p.n}</h3><p>${p.d}. ${p.s}</p></div>`:`<div class="card"><h3>Canlı Casino</h3><p>Canlı masalar yakında burada olacak.</p></div>`)+`<button class="wide" data-t="Sağlayıcı sitesi açılıyor…">Sağlayıcıya Git ${I('ext')}</button>`},
games:()=>top()+`<div class="sec" style="padding-top:6px">Tüm Oyunlar</div><div class="games">${G.concat(G).map(game).join('')}</div>`,
promo:()=>top()+`<div class="sec" style="padding-top:6px">Promosyonlar</div>`+[['Hoş Geldin Bonusu','İlk yatırımına %100 bonus.'],['Haftalık Nakit İade','Her hafta kayıplarının bir kısmı geri dönsün.'],['Ücretsiz Dönüşler','Seçili slotlarda 50 ücretsiz dönüş.']].map(x=>`<div class="card"><h3>${x[0]}</h3><p>${x[1]}</p></div>`).join(''),
me:()=>top()+`<div class="sec" style="padding-top:6px">Profil</div>`+['Hesap bilgileri','Bakiye geçmişi','Favori oyunlar','Ayarlar'].map(x=>`<button class="prow" data-t="${x}"><strong>${x}</strong><span class="go">${I('next')}</span></button>`).join('')};
const plist=()=>{const l=P.filter(p=>p.n.toLowerCase().includes(q.toLowerCase()));return l.length?l.map(p=>`<button class="prow" data-p="${p.id}"><span class="l">${lg(p)}</span><span><strong>${p.n}</strong><small>${p.d}</small></span><span class="go">${I('next')}</span></button>`).join(''):'<div class="card"><p>Sonuç bulunamadı. Farklı bir ad dene.</p></div>'};
const N=[['home','Ana Sayfa'],['prov','Sağlayıcılar'],['games','Oyunlar'],['promo','Promosyonlar'],['me','Profil']];
$('#nav').insertAdjacentHTML('beforeend',N.map(n=>`<button data-go="${n[0]}">${I(n[0])}${n[1]}</button>`).join(''));
function moveInd(){const on=tab=='detail'?'prov':tab,b=[...document.querySelectorAll('#nav button')];
 b.forEach(x=>x.classList.toggle('on',x.dataset.go==on));
 const a=b.find(x=>x.dataset.go==on),r=a.getBoundingClientRect(),n=$('#nav').getBoundingClientRect();
 g.to('#ind',{x:r.left-n.left+r.width/2-18,duration:.45,ease:'power3.out'});if(REDUCE)$('#ind').style.transform=`translateX(${r.left-n.left+r.width/2-18}px)`}
function intro(){
 g.from('.top > *',{y:-10,opacity:0,stagger:.06,duration:.5,ease:'power3.out'});
 g.from('.cats button',{x:20,opacity:0,stagger:.05,duration:.5,ease:'power3.out',delay:.1});
 g.from('.hero',{y:24,opacity:0,duration:.7,ease:'power3.out',delay:.15});
 g.from('.hero h1,.hero h2,.hero p,.hero .cta',{y:14,opacity:0,stagger:.08,duration:.6,ease:'power3.out',delay:.3});
 g.to('.r1',{rotation:360,svgOrigin:'140 140',duration:60,repeat:-1,ease:'none'});
 g.to('.r2',{rotation:-360,svgOrigin:'140 140',duration:40,repeat:-1,ease:'none'});
 g.from('.pbox,.g,.prow,.card,.pbanner,.seg,.search,.wide',{y:18,opacity:0,stagger:.045,duration:.5,ease:'power3.out',delay:.25,clearProps:'all'});
 g.from('.sec',{x:-12,opacity:0,stagger:.1,duration:.5,ease:'power3.out',delay:.3});
 const b=$('#bal');if(b&&first){const o={v:0};g.to(o,{v:10000,duration:1.4,ease:'power2.out',delay:.3,onUpdate(){b.textContent='$'+o.v.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})}});first=false}}
function render(anim=true){
 $('#app').innerHTML=V[tab]();moveInd();
 const i=$('#q');if(i)i.oninput=e=>{q=e.target.value;$('#pl').innerHTML=plist()};
 if(anim){scrollTo(0,0);intro()}}
function toast(t){document.querySelector('.toast')?.remove();const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);
 g.fromTo(d,{y:12,opacity:0},{y:0,opacity:1,duration:.3,ease:'power2.out'});g.to(d,{opacity:0,y:8,duration:.3,delay:1.6,onComplete:()=>d.remove()});if(REDUCE)setTimeout(()=>d.remove(),1800)}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-go],[data-p],[data-cat],[data-pt],[data-t]');if(!b)return;
 if(b.dataset.go){tab=b.dataset.go;render()}
 else if(b.dataset.p){prov=b.dataset.p;pt='Oyunlar (1200+)';tab='detail';render()}
 else if(b.dataset.cat){cat=b.dataset.cat;render(false);g.from('.cats .on',{scale:.9,duration:.3,ease:'back.out(2)'})}
 else if(b.dataset.pt){pt=b.dataset.pt;render(false);g.from('.seg ~ *',{y:10,opacity:0,stagger:.04,duration:.4,ease:'power3.out',clearProps:'all'})}
 else if(b.dataset.t)toast(b.dataset.t)});
document.addEventListener('pointerdown',e=>{const b=e.target.closest('button');if(b)g.to(b,{scale:.96,duration:.1})});
['pointerup','pointercancel','pointerleave'].forEach(ev=>document.addEventListener(ev,()=>g.to('button',{scale:1,duration:.25,ease:'back.out(3)',overwrite:'auto'}),true));
document.addEventListener('pointermove',e=>{const h=$('.hero .rings');if(h)g.to(h,{x:(e.clientX/innerWidth-.5)*14,y:(e.clientY/innerHeight-.5)*10,duration:.8,ease:'power2.out'})});
addEventListener('resize',moveInd);
render();
