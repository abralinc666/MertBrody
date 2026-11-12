'use strict';
// Yayıncı verisi: gerçek fotoğraf için p alanına yol yazın, örn. 'fotograflar/zeynep.jpg'. Boşsa renkli avatar gösterilir.
const S=[
{id:1,n:'Zeynep M.',c:'İzmir',a:24,h:320,v:842,t:['Sohbet','Müzik'],p:''},
{id:2,n:'Elif K.',c:'Kayseri',a:26,h:20,v:615,t:['Oyun','Sohbet'],p:''},
{id:3,n:'Derya Y.',c:'Adana',a:23,h:270,v:530,t:['Dans','Müzik'],p:''},
{id:4,n:'Selin A.',c:'İstanbul',a:25,h:190,v:1204,t:['Sohbet','Moda'],p:''},
{id:5,n:'Merve T.',c:'Ankara',a:27,h:300,v:388,t:['Oyun','Sanat'],p:''},
{id:6,n:'Ebru S.',c:'İzmir',a:28,h:340,v:476,t:['Müzik','Yoga'],p:''},
{id:7,n:'Gizem B.',c:'Adana',a:24,h:240,v:951,t:['Dans','Sohbet'],p:''},
{id:8,n:'Deniz P.',c:'Kayseri',a:22,h:10,v:293,t:['Sanat','Oyun'],p:''}];
const G=[['🌹','Gül',10],['💖','Kalp',50],['👑','Taç',200],['🚀','Roket',500],['💎','Elmas',1000]];
const P=[[100,'49,99 ₺'],[500,'219,99 ₺'],[1200,'469,99 ₺'],[3000,'999,99 ₺']];
const UNLOCK=150, NAMES=['Can','Mert','Burak','Emre','Ahmet','Kerem','Onur','Tolga'];
const LINES=['Merhaba, yayın çok güzel!','Bu şarkıyı bir daha çalar mısın?','Selamlar herkese','Bugün çok enerjiksin','Nerelisin?','Harika gidiyor 👏'];
const $=s=>document.querySelector(s), esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ls={get(k,d){try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
let user=ls.get('lc_user',null), coins=ls.get('lc_coins',0), unlocked=ls.get('lc_unlocked',{}), city='', term='', timer=null;
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches, hasG=typeof gsap!=='undefined';
if(hasG&&typeof ScrollTrigger!=='undefined')gsap.registerPlugin(ScrollTrigger);

function av(s,cls=''){const bg=s.p?`background-image:url('${esc(s.p)}')`:`background:linear-gradient(160deg,hsl(${s.h},80%,55%),hsl(${(s.h+60)%360},70%,25%))`;return `<div class="av ${cls}" style="${bg}">${s.p?'':esc(s.n[0])}</div>`}
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2600)}
function sync(){$('#balv').textContent=coins.toLocaleString('tr-TR');$('#login').textContent=user?user:'Giriş yap';ls.set('lc_coins',coins);ls.set('lc_unlocked',unlocked)}

// Liste
function list(){return S.filter(s=>(!city||s.c===city)&&(!term||(s.n+s.c+s.t.join(' ')).toLowerCase().includes(term)))}
function render(){
  const l=list();$('#grid').innerHTML=l.map(s=>`<button class="card" data-id="${s.id}">${av(s)}<div class="in"><h3>${esc(s.n)}, ${s.a}</h3><p>${esc(s.c)}</p><div class="tags">${s.t.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div></button>`).join('');
  l.forEach(s=>{const c=document.querySelector(`.card[data-id="${s.id}"] .av`);c.insertAdjacentHTML('beforeend',`<span class="live">Canlı</span><span class="view" data-v="${s.id}">${s.v}</span>`)});
  $('#empty').hidden=l.length>0;$('#gt').textContent=city?`${city} yayınları`:'Şu an canlı';
  if(hasG&&!reduce)gsap.from('.card',{y:40,opacity:0,duration:.6,stagger:.07,ease:'power3.out',clearProps:'all'});
}
function chips(){const cs=[...new Set(S.map(s=>s.c))];$('#chips').innerHTML=['Tümü',...cs].map(c=>`<button class="${(c==='Tümü'&&!city)||c===city?'on':''}" data-c="${c}">${esc(c)}</button>`).join('')}
$('#chips').onclick=e=>{const b=e.target.closest('button');if(!b)return;city=b.dataset.c==='Tümü'?'':b.dataset.c;chips();render()};
$('#q').oninput=e=>{term=e.target.value.trim().toLowerCase();render()};
$('#reset').onclick=()=>{city='';term='';$('#q').value='';chips();render()};
$('#grid').onclick=e=>{const c=e.target.closest('.card');if(c)room(+c.dataset.id)};
$('#explore').onclick=()=>$('#live').scrollIntoView({behavior:reduce?'auto':'smooth'});

// Canlı izleyici sayacı
setInterval(()=>{S.forEach(s=>{s.v=Math.max(50,s.v+Math.round((Math.random()-.45)*18));document.querySelectorAll(`[data-v="${s.id}"]`).forEach(el=>{el.textContent=s.v});const r=$(`#rv${s.id}`);if(r)r.textContent=s.v+' izleyici'})},2500);

// Modal
function open(html,sm){$('#mc').innerHTML=html;$('#modal').classList.toggle('sm',!!sm);$('#ov').hidden=false;document.body.style.overflow='hidden';if(hasG&&!reduce)gsap.fromTo('#modal',{y:30,opacity:0,scale:.97},{y:0,opacity:1,scale:1,duration:.35,ease:'power3.out'});$('#x').focus()}
function close(){$('#ov').hidden=true;document.body.style.overflow='';clearInterval(timer);timer=null}
$('#x').onclick=close;$('#ov').onclick=e=>{if(e.target.id==='ov')close()};document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#ov').hidden)close()});

// Giriş
function auth(after){open(`<h2>Giriş yap veya kaydol</h2><p class="note">18 yaş ve üzeri olmalısın.</p><form class="f" id="af"><input id="an" placeholder="Kullanıcı adı" required minlength="3" maxlength="20"><input id="ae" type="email" placeholder="E-posta" required><input id="ap" type="password" placeholder="Şifre (en az 6 karakter)" required minlength="6"><label class="note"><input type="checkbox" required> 18 yaşından büyüğüm, kullanım şartlarını kabul ediyorum</label><button class="btn">Devam et</button></form><p class="note">Bu sürümde giriş yalnızca tarayıcıda saklanır; gerçek hesap sistemi için sunucu gerekir.</p>`,1);
  $('#af').onsubmit=e=>{e.preventDefault();user=$('#an').value.trim();ls.set('lc_user',user);sync();close();toast(`Hoş geldin, ${user}`);if(after)after()}}
$('#login').onclick=()=>user?(user=null,ls.set('lc_user',null),sync(),toast('Çıkış yapıldı')):auth();

// Jeton mağazası
function store(){if(!user)return auth(store);
  open(`<h2>Jeton yükle</h2><p class="note">Bakiyen: ${coins} jeton. Jetonlarla hediye gönderir, özel içeriklerin kilidini açarsın.</p><div class="packs">${P.map((p,i)=>`<button data-i="${i}"><b>${p[0]} jeton</b><span>${p[1]}</span></button>`).join('')}</div><p class="note">Demo: ödeme alınmaz, jeton doğrudan eklenir. Canlıya çıkarken iyzico veya PayTR gibi bir ödeme altyapısı sunucu tarafında bağlanmalıdır.</p>`,1);
  $('#mc').onclick=e=>{const b=e.target.closest('[data-i]');if(!b)return;coins+=P[b.dataset.i][0];sync();toast(`${P[b.dataset.i][0]} jeton eklendi`);close()}}
$('#bal').onclick=store;$('#buy').onclick=store;

// Yayın odası
function room(id){const s=S.find(x=>x.id===id),un=unlocked[id]||[];
  open(`<div class="room"><div><div class="stage">${av(s)}<span class="live">Canlı</span><span class="view" id="rv${id}">${s.v} izleyici</span><div class="nm"><h2>${esc(s.n)}, ${s.a}</h2><small>${esc(s.c)} · ${s.t.map(esc).join(', ')}</small></div></div><h3 style="margin:16px 0 8px">Özel galeri</h3><div class="priv" id="pv"></div></div>
  <div class="side"><div class="chat" id="ch" aria-live="polite"></div><div class="gifts" id="gf">${G.map((g,i)=>`<button data-g="${i}"><i>${g[0]}</i>${g[1]}<br>${g[2]} J</button>`).join('')}</div><form class="send" id="sf"><input id="sm" placeholder="Mesaj yaz" maxlength="140" autocomplete="off"><button>Gönder</button></form></div></div>`);
  const ch=$('#ch');const add=(n,t,c='')=>{const d=document.createElement('div');if(c)d.className=c;d.innerHTML=`<b>${esc(n)}</b> ${esc(t)}`;ch.appendChild(d);while(ch.children.length>60)ch.firstChild.remove();ch.scrollTop=ch.scrollHeight};
  add('Sistem','Yayına hoş geldin. Saygılı ol, hediyelerle yayıncıyı destekle.');
  timer=setInterval(()=>{if(Math.random()<.35){const g=G[Math.floor(Math.random()*3)];add(NAMES[Math.floor(Math.random()*8)],`${g[1]} gönderdi ${g[0]}`,'g')}else add(NAMES[Math.floor(Math.random()*8)],LINES[Math.floor(Math.random()*LINES.length)])},2200);
  const pv=()=>{$('#pv').innerHTML=[1,2,3].map(n=>un.includes(n)?`<button class="un" data-n="${n}">Fotoğraf ${n}<br>Açık</button>`:`<button data-n="${n}">Kilitli<br>${UNLOCK} J</button>`).join('')};pv();
  $('#pv').onclick=e=>{const b=e.target.closest('button');if(!b)return;const n=+b.dataset.n;if(un.includes(n))return toast('Bu içerik açık');
    if(!user)return auth(()=>room(id));if(coins<UNLOCK){toast('Yetersiz jeton');return store()}
    coins-=UNLOCK;un.push(n);unlocked[id]=un;sync();pv();toast('Özel içerik açıldı');if(hasG&&!reduce)gsap.from(`#pv [data-n="${n}"]`,{scale:.7,duration:.5,ease:'back.out(2)'})};
  $('#gf').onclick=e=>{const b=e.target.closest('[data-g]');if(!b)return;const g=G[b.dataset.g];if(!user)return auth(()=>room(id));
    if(coins<g[2]){toast('Yetersiz jeton');return store()}coins-=g[2];sync();add(user,`${g[1]} gönderdi ${g[0]}`,'g');
    if(hasG&&!reduce){const r=b.getBoundingClientRect(),f=document.createElement('div');f.className='fly';f.textContent=g[0];f.style.left=r.left+r.width/2+'px';f.style.top=r.top+'px';document.body.appendChild(f);
      gsap.to(f,{y:-260,x:gsap.utils.random(-80,80),scale:2.2,rotation:gsap.utils.random(-25,25),opacity:0,duration:1.6,ease:'power2.out',onComplete:()=>f.remove()})}};
  $('#sf').onsubmit=e=>{e.preventDefault();if(!user)return auth(()=>room(id));const v=$('#sm').value.trim();if(v){add(user,v);$('#sm').value=''}};
}

// Açılış: tek koordineli hero sahnesi + yüzen yayıncı kartları
(function init(){
  const art=$('#art');[[0,S[3],'6%','8%',-6],[1,S[0],'38%','0%',4],[2,S[6],'58%','44%',-3]].forEach(([i,s,l,t,r])=>{const d=document.createElement('div');d.className='fc';d.style.cssText=`left:${l};top:${t};transform:rotate(${r}deg)`;d.innerHTML=`${av(s)}<b>${esc(s.n)}</b><small>${esc(s.c)}</small>`;d.querySelector('.av').insertAdjacentHTML('beforeend','<span class="live">Canlı</span>');art.appendChild(d)});
  chips();render();sync();
  if(!hasG||reduce)return;
  const tl=gsap.timeline({defaults:{ease:'power3.out'}});
  tl.from('.hero h1',{y:50,opacity:0,duration:.9}).from('.hero p,.cta,.feat li',{y:24,opacity:0,stagger:.08,duration:.6},'-=.5').from('.fc',{y:80,opacity:0,scale:.85,stagger:.15,duration:.9},'-=.8');
  document.querySelectorAll('.fc').forEach((el,i)=>gsap.to(el,{y:i%2?-16:16,duration:2.4+i*.4,repeat:-1,yoyo:true,ease:'sine.inOut'}));
  gsap.to('.orb',{rotation:360,duration:30,repeat:-1,ease:'none'});
})();
