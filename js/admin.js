/* BrodyBet Admin CMS */
(()=>{
const $=s=>document.querySelector(s);
const C=()=>window.CATALOG_BASE||window.CATALOG;
const SES='bw_admin_ok';
let view='dash',edit=null;

CMS.snapshot(window.CATALOG);
CMS.seedFromCatalog(window.CATALOG);

const adminTok=()=>CMS.hash('bw-admin-session');
function authed(){return sessionStorage.getItem(SES)===adminTok()}
function requireAuth(){
 if(authed()){showApp();return}
 $('#login').classList.remove('hidden');
 $('#shell').classList.add('hidden');
}
function showApp(){
 $('#login').classList.add('hidden');
 $('#shell').classList.remove('hidden');
 render();
}

$('#loginForm').onsubmit=e=>{
 e.preventDefault();
 const pass=new FormData(e.target).get('pass');
 if(CMS.checkAdmin(pass)){sessionStorage.setItem(SES,adminTok());$('#loginErr').textContent='';showApp()}
 else $('#loginErr').textContent='Şifre hatalı';
};
$('#logout').onclick=()=>{sessionStorage.removeItem(SES);location.reload()};
$('#menuBtn').onclick=()=>$('.side').classList.toggle('open');
$('#sideNav').onclick=e=>{
 const b=e.target.closest('[data-view]');if(!b)return;
 view=b.dataset.view;
 [...$('#sideNav').children].forEach(x=>x.classList.toggle('on',x===b));
 $('.side').classList.remove('open');
 render();
};

const titles={dash:'Ana Panel',users:'Kullanıcılar',bonuses:'Bonuslar',payments:'Yatırımlar',games:'Oyunlar',settings:'Ayarlar'};
const fmt=c=>'₺'+((c||0)/100).toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt0=c=>'₺'+((c||0)/100).toLocaleString('tr-TR',{maximumFractionDigits:0});

function db(){try{return JSON.parse(localStorage.getItem('bw_db_v1'))||{users:[],tx:[],claims:{}}}catch{return{users:[],tx:[],claims:{}}}}

function readFileAsDataURL(file){return new Promise((res,rej)=>{
 if(!file)return res('');
 if(file.size>450000){alert('Görsel ~400KB altında olmalı. Küçültüp tekrar dene.');return res('')}
 const r=new FileReader();r.onload=()=>res(r.result);r.onerror=rej;r.readAsDataURL(file);
})}

function modal(html){
 const bg=document.createElement('div');bg.className='modal-bg';bg.innerHTML=`<div class="modal">${html}</div>`;
 bg.addEventListener('click',e=>{if(e.target===bg)bg.remove()});
 document.body.appendChild(bg);return bg;
}

function render(){
 if(!authed())return;
 $('#viewTitle').textContent=titles[view]||'';
 const v=$('#view');
 if(view==='dash')v.innerHTML=dash();
 else if(view==='users')v.innerHTML=usersView();
 else if(view==='bonuses')v.innerHTML=bonuses();
 else if(view==='payments')v.innerHTML=payments();
 else if(view==='games')v.innerHTML=games();
 else if(view==='settings')v.innerHTML=settings();
 bindView();
}

function dash(){
 const d=db();
 const promos=CMS.getAllPromotions(C());
 const gamesList=CMS.getAllGames(C()).filter(g=>g.active!==false);
 const claims=Object.values(d.claims||{}).reduce((n,a)=>n+(a?.length||0),0);
 const dep=(d.tx||[]).filter(t=>t.type==='deposit').reduce((s,t)=>s+t.amount,0);
 const wd=(d.tx||[]).filter(t=>t.type==='withdraw').reduce((s,t)=>s+Math.abs(t.amount),0);
 const bonus=(d.tx||[]).filter(t=>t.type==='bonus').reduce((s,t)=>s+t.amount,0);
 const users=(d.users||[]).filter(u=>!u.guest).length;
 const recent=(d.tx||[]).slice(-10).reverse();
 const pop=gamesList.slice(0,5);
 const line=`<svg class="chart-line" viewBox="0 0 400 160" preserveAspectRatio="none"><defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#B8F520" stop-opacity=".35"/><stop offset="100%" stop-color="#B8F520" stop-opacity="0"/></linearGradient></defs><path d="M0,120 C40,110 70,60 110,70 C150,80 170,40 210,55 C250,70 280,30 320,45 C350,55 380,25 400,35 L400,160 L0,160 Z" fill="url(#lg)"/><path d="M0,120 C40,110 70,60 110,70 C150,80 170,40 210,55 C250,70 280,30 320,45 C350,55 380,25 400,35" fill="none" stroke="#B8F520" stroke-width="3"/><path d="M0,100 C50,95 90,80 130,90 C180,105 220,70 270,85 C320,100 360,75 400,80" fill="none" stroke="#E4FF6B" stroke-width="2" opacity=".7"/><path d="M0,130 C60,125 100,115 160,120 C220,125 280,100 340,110 C370,115 390,105 400,108" fill="none" stroke="#6ee7a8" stroke-width="2" opacity=".55"/></svg>`;
 const donut=`<svg width="120" height="120" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#243022" stroke-width="5"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#B8F520" stroke-width="5" stroke-dasharray="43 57" stroke-dashoffset="25"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#E4FF6B" stroke-width="5" stroke-dasharray="24 76" stroke-dashoffset="-18"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#6ee7a8" stroke-width="5" stroke-dasharray="18 82" stroke-dashoffset="-42"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#93A089" stroke-width="5" stroke-dasharray="9 91" stroke-dashoffset="-60"/><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#3d4a3d" stroke-width="5" stroke-dasharray="6 94" stroke-dashoffset="-69"/></svg>`;
 return `<div class="hero-banner"><img src="assets/brand/welcome-banner.png" alt=""><div class="hb"><h3>%100 RİSKSİZ İADE BONUSU</h3><a class="cta" href="index.html">Hemen Katıl!</a></div></div>
 <div class="stats">
  <div class="stat"><small>Toplam Dağıtılan Bonus</small><strong>${fmt0(bonus)}</strong><em>+ claim ${claims}</em></div>
  <div class="stat"><small>Toplam Yatırımlar</small><strong>${fmt0(dep)}</strong><em>demo yatırımlar</em></div>
  <div class="stat"><small>Toplam Çekimler</small><strong>${fmt0(wd)}</strong><em>demo çekimler</em></div>
  <div class="stat"><small>Aktif Kullanıcılar</small><strong>${users}</strong><em>${promos.filter(p=>p.active!==false).length} aktif bonus</em></div>
 </div>
 <div class="grid2">
  <div class="panel"><div class="panel-h"><h3>Son 7 Günlük Finansal Özet</h3></div><div class="panel-b">${line}<div style="display:flex;gap:14px;margin-top:8px;font-size:11px;color:var(--mu)"><span style="color:#B8F520">● Yatırımlar</span><span style="color:#E4FF6B">● Çekimler</span><span style="color:#6ee7a8">● Bonuslar</span></div></div></div>
  <div class="panel"><div class="panel-h"><h3>Oyunlara Göre Dağılım</h3></div><div class="panel-b"><div class="donut-wrap">${donut}<div class="legend"><div><b>Slot</b> 42.8%</div><div><b>Canlı Casino</b> 23.6%</div><div><b>Spor</b> 18.4%</div><div><b>Sanal</b> 8.7%</div><div><b>Diğer</b> 6.5%</div></div></div></div></div>
 </div>
 <div class="grid3">
  <div class="panel"><div class="panel-h"><h3>Son İşlemler</h3></div><div class="panel-b" style="padding:0;max-height:280px;overflow:auto">${recent.length?`<table class="table"><thead><tr><th>Kullanıcı</th><th>Tür</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>${recent.map(t=>{const u=(d.users||[]).find(x=>x.id===t.uid);return `<tr><td>${esc(u?.username||'—')}</td><td>${esc(t.type)}</td><td>${fmt(t.amount)}</td><td><span class="badge on">${t.status||'Tamamlandı'}</span></td></tr>`}).join('')}</tbody></table>`:'<div class="empty">İşlem yok</div>'}</div></div>
  <div class="panel"><div class="panel-h"><h3>En Popüler Oyunlar</h3></div><div class="panel-b">${pop.map((g,i)=>`<div class="pop-row">${g.image?`<img class="thumb" src="${g.image}" alt="">`:'<span class="thumb"></span>'}<b>${i+1}. ${g.name}</b><span>${(92-i*7).toFixed(1)}%</span></div>`).join('')||'<div class="empty">Oyun yok</div>'}</div></div>
  <div class="panel"><div class="panel-h"><h3>Son 24 Saat</h3></div><div class="panel-b"><div class="mini-stats"><div><span>Yeni kayıt</span><strong>${users}</strong></div><div><span>Yatırım yapan</span><strong>${(d.tx||[]).filter(t=>t.type==='deposit').length}</strong></div><div><span>Çekim yapan</span><strong>${(d.tx||[]).filter(t=>t.type==='withdraw').length}</strong></div><div><span>Aktif oyun</span><strong>${gamesList.length}</strong></div></div></div></div>
 </div>`;
}

function usersView(){
 const list=(db().users||[]).filter(u=>!u.guest).slice().reverse();
 return `<div class="panel"><div class="panel-h"><h3>Kayıtlı kullanıcılar (${list.length})</h3></div>
 <div class="panel-b" style="padding:0;overflow:auto"><table class="table"><thead><tr><th>Kullanıcı</th><th>E-posta</th><th>İl</th><th>Bakiye</th><th>Kayıt</th></tr></thead><tbody>
 ${list.length?list.map(u=>`<tr><td><b>${esc(u.username)}</b><div style="color:var(--mu);font-size:11px">${esc(u.firstName||'')} ${esc(u.lastName||'')}</div></td><td>${esc(u.email||'—')}</td><td>${esc(u.city||'—')}</td><td>${fmt(u.balance)}</td><td>${u.createdAt?new Date(u.createdAt).toLocaleDateString('tr-TR'):'—'}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">Henüz kayıtlı kullanıcı yok.</td></tr>'}
 </tbody></table></div></div>`;
}

function bonuses(){
 const list=CMS.getAllPromotions(C());
 return `<div class="panel"><div class="panel-h"><h3>Bonus listesi</h3><button class="btn" data-new-bonus>+ Yeni bonus</button></div>
 <div class="panel-b" style="padding:0;overflow:auto">
 <table class="table"><thead><tr><th></th><th>İsim</th><th>Tutar</th><th>Durum</th><th></th></tr></thead><tbody>
 ${list.map(p=>`<tr>
  <td>${p.image?`<img class="thumb" src="${p.image}" alt="">`:'—'}</td>
  <td><b>${p.title}</b><div style="color:var(--mu);font-size:12px">${p.badge||''} · ${p.subtitle||''}</div></td>
  <td>${fmt(p.bonus)}</td>
  <td><span class="badge ${p.active===false?'off':'on'}">${p.active===false?'Pasif':'Aktif'}</span></td>
  <td class="actions"><button class="btn ghost sm" data-edit-bonus="${p.id}">Düzenle</button>
  <button class="btn ghost sm" data-toggle-bonus="${p.id}">${p.active===false?'Aktifleştir':'Pasifleştir'}</button>
  <button class="btn danger sm" data-del-bonus="${p.id}">Sil</button></td>
 </tr>`).join('')}
 </tbody></table></div></div>`;
}

function bonusForm(p={}){
 const terms=(p.terms||[]).join('\n');
 return `<h3>${p.id?'Bonus düzenle':'Yeni bonus'}</h3>
 <form id="bonusForm" class="form-grid">
  <div class="field"><label>İsim</label><input name="title" required value="${esc(p.title||'')}"></div>
  <div class="field"><label>Badge</label><input name="badge" value="${esc(p.badge||'')}"></div>
  <div class="field"><label>Alt başlık</label><input name="subtitle" value="${esc(p.subtitle||'')}"></div>
  <div class="field"><label>Bonus tutarı (₺)</label><input name="bonusTl" type="number" step="1" value="${(p.bonus||0)/100}"></div>
  <div class="field full"><label>Kısa açıklama</label><input name="desc" value="${esc(p.desc||'')}"></div>
  <div class="field full"><label>Özet</label><textarea name="summary">${esc(p.summary||'')}</textarea></div>
  <div class="field"><label>Çevrim</label><input name="wager" value="${esc(p.wager||'')}"></div>
  <div class="field"><label>Süre</label><input name="duration" value="${esc(p.duration||'')}"></div>
  <div class="field"><label>Min yatırım</label><input name="minDeposit" value="${esc(p.minDeposit||'')}"></div>
  <div class="field"><label>Max bonus</label><input name="maxBonus" value="${esc(p.maxBonus||'')}"></div>
  <div class="field full"><label>Kimler yararlanabilir</label><textarea name="eligible">${esc(p.eligible||'')}</textarea></div>
  <div class="field full"><label>Çekim koşulları</label><textarea name="withdraw">${esc(p.withdraw||'')}</textarea></div>
  <div class="field full"><label>Şartlar (satır satır)</label><textarea name="terms">${esc(terms)}</textarea></div>
  <div class="field full"><label>Görsel URL / yol</label><input name="image" value="${esc(p.image||'')}" placeholder="assets/bonuses/..."></div>
  <div class="field full"><label>veya dosya yükle</label><input name="file" type="file" accept="image/*"></div>
  <div class="field"><label>Aktif</label><select name="active"><option value="1" ${p.active!==false?'selected':''}>Evet</option><option value="0" ${p.active===false?'selected':''}>Hayır</option></select></div>
  <div class="form-actions full"><button type="button" class="btn ghost" data-close>İptal</button><button class="btn" type="submit">Kaydet</button></div>
 </form>`;
}

function payments(){
 const list=CMS.getAllPayments(C());
 return `<div class="panel"><div class="panel-h"><h3>Yatırım yöntemleri</h3><button class="btn" data-new-pay>+ Ekle</button></div>
 <div class="panel-b" style="padding:0;overflow:auto"><table class="table"><thead><tr><th>İsim</th><th>Tip</th><th>ETA</th><th>Durum</th><th></th></tr></thead><tbody>
 ${list.map(p=>`<tr><td><b>${p.name}</b></td><td>${p.type||''}</td><td>${p.eta||''}</td>
 <td><span class="badge ${p.active===false?'off':'on'}">${p.active===false?'Pasif':'Aktif'}</span></td>
 <td class="actions"><button class="btn ghost sm" data-edit-pay="${p.id}">Düzenle</button>
 <button class="btn ghost sm" data-toggle-pay="${p.id}">${p.active===false?'Aktifleştir':'Pasifleştir'}</button>
 <button class="btn danger sm" data-del-pay="${p.id}">Sil</button></td></tr>`).join('')}
 </tbody></table></div></div>`;
}

function payForm(p={}){
 return `<h3>${p.id?'Yöntem düzenle':'Yeni yöntem'}</h3>
 <form id="payForm" class="form-grid">
  <div class="field"><label>İsim</label><input name="name" required value="${esc(p.name||'')}"></div>
  <div class="field"><label>Tip</label><input name="type" value="${esc(p.type||'E-cüzdan')}"></div>
  <div class="field"><label>ETA</label><input name="eta" value="${esc(p.eta||'Anında')}"></div>
  <div class="field"><label>Aktif</label><select name="active"><option value="1" ${p.active!==false?'selected':''}>Evet</option><option value="0" ${p.active===false?'selected':''}>Hayır</option></select></div>
  <div class="form-actions full"><button type="button" class="btn ghost" data-close>İptal</button><button class="btn" type="submit">Kaydet</button></div>
 </form>`;
}

function games(){
 const list=CMS.getAllGames(C());
 const q=($('#gameQ')?.value||'').toLowerCase();
 const filtered=q?list.filter(g=>g.name.toLowerCase().includes(q)||g.category.includes(q)):list;
 return `<div class="panel"><div class="panel-h"><h3>Oyunlar (${list.length})</h3>
 <input id="gameQ" placeholder="Ara…" value="${esc(q)}" style="padding:8px 12px;border-radius:10px;border:1px solid var(--ln);background:var(--s2);color:var(--tx);width:180px">
 <button class="btn" data-new-game>+ Oyun</button></div>
 <div class="panel-b" style="padding:0;overflow:auto;max-height:65vh"><table class="table"><thead><tr><th></th><th>İsim</th><th>Kategori</th><th>Provider</th><th>Durum</th><th></th></tr></thead><tbody>
 ${filtered.slice(0,80).map(g=>`<tr>
  <td>${g.image?`<img class="thumb" src="${g.image}" alt="">`:'—'}</td>
  <td><b>${g.name}</b></td><td>${g.category}</td><td>${g.provider}</td>
  <td><span class="badge ${g.active===false?'off':'on'}">${g.active===false?'Pasif':'Aktif'}</span></td>
  <td class="actions"><button class="btn ghost sm" data-edit-game="${g.id}">Düzenle</button>
  <button class="btn ghost sm" data-toggle-game="${g.id}">${g.active===false?'Aktif':'Pasif'}</button></td>
 </tr>`).join('')}
 </tbody></table></div></div>`;
}

function gameForm(g={}){
 return `<h3>${g.id?'Oyun düzenle':'Yeni oyun'}</h3>
 <form id="gameForm" class="form-grid">
  <div class="field"><label>İsim</label><input name="name" required value="${esc(g.name||'')}"></div>
  <div class="field"><label>ID (slug)</label><input name="id" required value="${esc(g.id||'')}" ${g.id?'readonly':''}></div>
  <div class="field"><label>Kategori</label><select name="category"><option value="slots" ${g.category==='slots'?'selected':''}>slots</option><option value="live" ${g.category==='live'?'selected':''}>live</option><option value="table" ${g.category==='table'?'selected':''}>table</option></select></div>
  <div class="field"><label>Provider id</label><input name="provider" value="${esc(g.provider||'pragmatic')}"></div>
  <div class="field full"><label>Görsel URL</label><input name="image" value="${esc(g.image||'')}"></div>
  <div class="field full"><label>veya dosya</label><input name="file" type="file" accept="image/*"></div>
  <div class="field"><label>Hue</label><input name="hue" type="number" value="${g.hue||200}"></div>
  <div class="field"><label>Aktif</label><select name="active"><option value="1" ${g.active!==false?'selected':''}>Evet</option><option value="0" ${g.active===false?'selected':''}>Hayır</option></select></div>
  <div class="form-actions full"><button type="button" class="btn ghost" data-close>İptal</button><button class="btn" type="submit">Kaydet</button></div>
 </form>`;
}

function settings(){
 const s=CMS.load().settings||{};
 return `<div class="panel"><div class="panel-h"><h3>Site ayarları</h3></div><div class="panel-b">
 <form id="setForm" class="form-grid">
  <div class="field"><label>Site adı</label><input name="siteName" value="${esc(s.siteName||'BrodyBet')}"></div>
  <div class="field"><label>Min oyun bakiyesi (₺)</label><input name="minPlayTl" type="number" step="1" value="${(s.minPlay||1000)/100}"></div>
  <div class="field"><label>Yeni admin şifresi</label><input name="newPass" type="password" placeholder="Boş bırak = değişmez"></div>
  <div class="form-actions full"><button class="btn" type="submit">Kaydet</button></div>
 </form>
 <p style="margin-top:16px;color:var(--mu);font-size:13px">CMS sıfırlamak için tarayıcıda <code>bw_cms_v1</code> anahtarını sil.</p>
 </div></div>`;
}

function esc(s){return String(s??'').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;')}
function rid(){return 'b_'+Math.random().toString(36).slice(2,9)}

function bindView(){
 const root=$('#view');
 root.querySelector('[data-new-bonus]')?.addEventListener('click',()=>openBonus());
 root.querySelectorAll('[data-edit-bonus]').forEach(b=>b.onclick=()=>openBonus(b.dataset.editBonus));
 root.querySelectorAll('[data-toggle-bonus]').forEach(b=>b.onclick=()=>{
  const list=CMS.getAllPromotions(C());const p=list.find(x=>x.id===b.dataset.toggleBonus);if(!p)return;
  p.active=p.active===false;CMS.setPromotions(list);render()});
 root.querySelectorAll('[data-del-bonus]').forEach(b=>b.onclick=()=>{
  if(!confirm('Bonus silinsin mi?'))return;
  CMS.setPromotions(CMS.getAllPromotions(C()).filter(x=>x.id!==b.dataset.delBonus));render()});

 root.querySelector('[data-new-pay]')?.addEventListener('click',()=>openPay());
 root.querySelectorAll('[data-edit-pay]').forEach(b=>b.onclick=()=>openPay(b.dataset.editPay));
 root.querySelectorAll('[data-toggle-pay]').forEach(b=>b.onclick=()=>{
  const list=CMS.getAllPayments(C());const p=list.find(x=>x.id===b.dataset.togglePay);if(!p)return;
  p.active=p.active===false;CMS.setPayments(list);render()});
 root.querySelectorAll('[data-del-pay]').forEach(b=>b.onclick=()=>{
  if(!confirm('Yöntem silinsin mi?'))return;
  CMS.setPayments(CMS.getAllPayments(C()).filter(x=>x.id!==b.dataset.delPay));render()});

 root.querySelector('[data-new-game]')?.addEventListener('click',()=>openGame());
 root.querySelectorAll('[data-edit-game]').forEach(b=>b.onclick=()=>openGame(b.dataset.editGame));
 root.querySelectorAll('[data-toggle-game]').forEach(b=>b.onclick=()=>{
  const list=CMS.getAllGames(C());const g=list.find(x=>x.id===b.dataset.toggleGame);if(!g)return;
  g.active=g.active===false;CMS.setGames(list);render()});
 const gq=$('#gameQ');if(gq)gq.onkeydown=e=>{if(e.key==='Enter')render()};

 $('#setForm')?.addEventListener('submit',e=>{
  e.preventDefault();const fd=new FormData(e.target);
  const patch={siteName:String(fd.get('siteName')||'BrodyBet'),minPlay:Math.round(Number(fd.get('minPlayTl')||10)*100)};
  CMS.setSettings(patch);
  const np=String(fd.get('newPass')||'');if(np)CMS.setAdminPass(np);
  alert('Ayarlar kaydedildi');render();
 });
}

function openBonus(id){
 const list=CMS.getAllPromotions(C());
 const p=id?list.find(x=>x.id===id):{};
 const m=modal(bonusForm(p||{}));
 m.querySelector('[data-close]').onclick=()=>m.remove();
 m.querySelector('#bonusForm').onsubmit=async e=>{
  e.preventDefault();const fd=new FormData(e.target);
  let image=String(fd.get('image')||'');
  const file=fd.get('file');if(file&&file.size)image=(await readFileAsDataURL(file))||image;
  const item={
   id:p?.id||rid(),title:String(fd.get('title')),badge:String(fd.get('badge')||''),subtitle:String(fd.get('subtitle')||''),
   desc:String(fd.get('desc')||''),summary:String(fd.get('summary')||''),wager:String(fd.get('wager')||''),
   duration:String(fd.get('duration')||''),minDeposit:String(fd.get('minDeposit')||''),maxBonus:String(fd.get('maxBonus')||''),
   eligible:String(fd.get('eligible')||''),withdraw:String(fd.get('withdraw')||''),
   terms:String(fd.get('terms')||'').split('\n').map(s=>s.trim()).filter(Boolean),
   bonus:Math.round(Number(fd.get('bonusTl')||0)*100),image,active:fd.get('active')==='1',
   example:p?.example||'',exceptions:p?.exceptions||[]
  };
  const next=id?list.map(x=>x.id===id?item:x):[...list,item];
  CMS.setPromotions(next);m.remove();render();
 };
}

function openPay(id){
 const list=CMS.getAllPayments(C());
 const p=id?list.find(x=>x.id===id):{};
 const m=modal(payForm(p||{}));
 m.querySelector('[data-close]').onclick=()=>m.remove();
 m.querySelector('#payForm').onsubmit=e=>{
  e.preventDefault();const fd=new FormData(e.target);
  const item={id:p?.id||('pay_'+rid().slice(2)),name:String(fd.get('name')),type:String(fd.get('type')||''),eta:String(fd.get('eta')||''),active:fd.get('active')==='1'};
  const next=id?list.map(x=>x.id===id?item:x):[...list,item];
  CMS.setPayments(next);m.remove();render();
 };
}

function openGame(id){
 const list=CMS.getAllGames(C());
 const g=id?list.find(x=>x.id===id):{};
 const m=modal(gameForm(g||{}));
 m.querySelector('[data-close]').onclick=()=>m.remove();
 m.querySelector('#gameForm').onsubmit=async e=>{
  e.preventDefault();const fd=new FormData(e.target);
  let image=String(fd.get('image')||'');
  const file=fd.get('file');if(file&&file.size)image=(await readFileAsDataURL(file))||image;
  const item={id:String(fd.get('id')).trim(),name:String(fd.get('name')),category:String(fd.get('category')),provider:String(fd.get('provider')),
   image,hue:Number(fd.get('hue')||200),active:fd.get('active')==='1',isNew:!!g?.isNew};
  const next=id?list.map(x=>x.id===id?{...x,...item}:x):[...list,item];
  CMS.setGames(next);m.remove();render();
 };
}

requireAuth();
})();
