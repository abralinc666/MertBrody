/* BrodyBet Admin CMS */
(()=>{
const $=s=>document.querySelector(s);
const C=()=>window.CATALOG_BASE||window.CATALOG;
const SES='bw_admin_ok';
let view='dash',edit=null;

CMS.snapshot(window.CATALOG);
CMS.seedFromCatalog(window.CATALOG);

const adminTok=()=>CMS.sessionToken();
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

const titles={dash:'Ana Panel',users:'Kullanıcılar',bonuses:'Bonuslar',payments:'Yatırımlar',games:'Oyunlar',tickets:'Destek',settings:'Ayarlar'};
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
 else if(view==='tickets')v.innerHTML=ticketsView();
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
 const favCount={};Object.values(d.favs||{}).forEach(a=>(a||[]).forEach(id=>{favCount[id]=(favCount[id]||0)+1}));
 const pop=gamesList.slice().sort((a,b)=>(favCount[b.id]||0)-(favCount[a.id]||0)).slice(0,5);
 const days=[...Array(7)].map((_,i)=>{const s=new Date();s.setHours(0,0,0,0);s.setDate(s.getDate()-(6-i));const a=s.getTime(),b=a+86400000;const sum=ty=>(d.tx||[]).filter(t=>t.type===ty&&t.at>=a&&t.at<b).reduce((n,t)=>n+Math.abs(t.amount),0);return {dep:sum('deposit'),wd:sum('withdraw'),bonus:sum('bonus')}});
 const lineOf=(key,color)=>{const vals=days.map(x=>x[key]);const max=Math.max(1,...days.flatMap(x=>[x.dep,x.wd,x.bonus]));const pts=vals.map((v,i)=>`${(i*400/6).toFixed(1)},${(148-(v/max)*120).toFixed(1)}`);return `<path d="M${pts.join(' L')}" fill="none" stroke="${color}" stroke-width="3"/>`};
 const line=`<svg class="chart-line" viewBox="0 0 400 160" preserveAspectRatio="none">${lineOf('dep','#C6F54A')}${lineOf('wd','#E2FF6A')}${lineOf('bonus','#6ee7a8')}</svg>`;
 const TBL=/blackjack|roulette|rulet|baccarat|poker|hold.?em|craps|sic ?bo|dragon tiger|andar|fan tan|stud|teen patti/i,isT=g=>g.category==='table'||TBL.test(g.name);
 const slotN=gamesList.filter(g=>g.category==='slots').length,tableN=gamesList.filter(isT).length,liveN=gamesList.filter(g=>g.category==='live'&&!isT(g)).length,allN=gamesList.length||1;
 const pct=(n)=>Math.round(n/allN*1000)/10;
 const arc=(n,color,offset)=>`<circle cx="21" cy="21" r="15.9" fill="transparent" stroke="${color}" stroke-width="5" stroke-dasharray="${(n/allN*100).toFixed(1)} ${(100-n/allN*100).toFixed(1)}" stroke-dashoffset="${offset}"/>`;
 const donut=`<svg width="120" height="120" viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9" fill="transparent" stroke="#243022" stroke-width="5"/>${arc(slotN,'#C6F54A',25)}${arc(liveN,'#E2FF6A',25-(slotN/allN*100))}${arc(tableN,'#6ee7a8',25-((slotN+liveN)/allN*100))}</svg>`;
 const since=Date.now()-86400000;
 const newUsers=(d.users||[]).filter(u=>!u.guest&&u.createdAt>=since).length;
 const dep24=new Set((d.tx||[]).filter(t=>t.type==='deposit'&&t.at>=since).map(t=>t.uid)).size;
 const wd24=new Set((d.tx||[]).filter(t=>t.type==='withdraw'&&t.at>=since).map(t=>t.uid)).size;
 return `<div class="hero-banner"><img src="assets/brand/welcome-banner.jpg" alt=""><div class="hb"><h3>%100 RİSKSİZ İADE BONUSU</h3><a class="cta" href="index.html">Hemen Katıl!</a></div></div>
 <div class="stats">
  <div class="stat"><small>Toplam Dağıtılan Bonus</small><strong>${fmt0(bonus)}</strong><em>+ claim ${claims}</em></div>
  <div class="stat"><small>Toplam Yatırımlar</small><strong>${fmt0(dep)}</strong><em>demo yatırımlar</em></div>
  <div class="stat"><small>Toplam Çekimler</small><strong>${fmt0(wd)}</strong><em>demo çekimler</em></div>
  <div class="stat"><small>Aktif Kullanıcılar</small><strong>${users}</strong><em>${promos.filter(p=>p.active!==false).length} aktif bonus</em></div>
 </div>
 <div class="grid2">
  <div class="panel"><div class="panel-h"><h3>Son 7 Günlük Finansal Özet</h3></div><div class="panel-b">${line}<div style="display:flex;gap:14px;margin-top:8px;font-size:11px;color:var(--mu)"><span style="color:#C6F54A">● Yatırımlar</span><span style="color:#E2FF6A">● Çekimler</span><span style="color:#6ee7a8">● Bonuslar</span></div></div></div>
  <div class="panel"><div class="panel-h"><h3>Oyunlara Göre Dağılım</h3></div><div class="panel-b"><div class="donut-wrap">${donut}<div class="legend"><div><b>Slot</b> ${pct(slotN)}%</div><div><b>Canlı Show</b> ${pct(liveN)}%</div><div><b>Masa Oyunları</b> ${pct(tableN)}%</div></div></div></div></div>
 </div>
 <div class="grid3">
  <div class="panel"><div class="panel-h"><h3>Son İşlemler</h3></div><div class="panel-b" style="padding:0;max-height:280px;overflow:auto">${recent.length?`<table class="table"><thead><tr><th>Kullanıcı</th><th>Tür</th><th>Tutar</th><th>Durum</th></tr></thead><tbody>${recent.map(t=>{const u=(d.users||[]).find(x=>x.id===t.uid);return `<tr><td>${esc(u?.username||'—')}</td><td>${esc(t.type)}</td><td>${fmt(t.amount)}</td><td><span class="badge on">${esc(t.status||'Tamamlandı')}</span></td></tr>`}).join('')}</tbody></table>`:'<div class="empty">İşlem yok</div>'}</div></div>
  <div class="panel"><div class="panel-h"><h3>En Popüler Oyunlar</h3></div><div class="panel-b">${pop.map((g,i)=>`<div class="pop-row">${g.image?`<img class="thumb" src="${esc(g.image)}" alt="">`:'<span class="thumb"></span>'}<b>${i+1}. ${esc(g.name)}</b><span>${favCount[g.id]||0} favori</span></div>`).join('')||'<div class="empty">Oyun yok</div>'}</div></div>
  <div class="panel"><div class="panel-h"><h3>Son 24 Saat</h3></div><div class="panel-b"><div class="mini-stats"><div><span>Yeni kayıt</span><strong>${newUsers}</strong></div><div><span>Yatırım yapan</span><strong>${dep24}</strong></div><div><span>Çekim yapan</span><strong>${wd24}</strong></div><div><span>Aktif oyun</span><strong>${gamesList.length}</strong></div></div></div></div>
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
  <td>${p.image?`<img class="thumb" src="${esc(p.image)}" alt="">`:'—'}</td>
  <td><b>${esc(p.title)}</b><div style="color:var(--mu);font-size:12px">${esc(p.badge||'')} · ${esc(p.subtitle||'')}</div></td>
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
 <div class="panel-b" style="padding:0;overflow:auto"><table class="table"><thead><tr><th>Logo</th><th>İsim</th><th>Tip</th><th>Limit</th><th>ETA</th><th>Durum</th><th></th></tr></thead><tbody>
 ${list.map(p=>`<tr><td>${p.logo?`<img class="thumb logo" src="${esc(p.logo)}" alt="">`:'<span class="nologo">Otomatik</span>'}</td><td><b>${esc(p.name)}</b></td><td>${esc(p.type||'')}</td><td>${p.min||'—'} – ${p.max||'—'} ₺</td><td>${esc(p.eta||'')}</td>
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
  <div class="field"><label>Grup</label><select name="group">${[['banka','Banka'],['ecuzdan','E-cüzdan'],['kart','Kart / QR'],['kripto','Kripto']].map(([k,l])=>`<option value="${k}" ${(p.group||'banka')===k?'selected':''}>${l}</option>`).join('')}</select></div>
  <div class="field"><label>Min (₺)</label><input name="min" type="number" min="1" step="1" value="${p.min||100}"></div>
  <div class="field"><label>Maks (₺)</label><input name="max" type="number" min="1" step="1" value="${p.max||50000}"></div>
  <div class="field full"><label>Logo URL / yol</label><input name="logo" value="${esc(String(p.logo||'').startsWith('data:')?'':p.logo||'')}" placeholder="assets/payments/papara.png — boş = otomatik rozet"></div>
  <div class="field full"><label>veya logo yükle (PNG/SVG, şeffaf zemin önerilir)</label><input name="file" type="file" accept="image/*">${p.logo?`<label class="chk"><input type="checkbox" name="clearLogo"> Mevcut logoyu kaldır</label>`:''}</div>
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
  <td>${g.image?`<img class="thumb" src="${esc(g.image)}" alt="">`:'—'}</td>
  <td><b>${esc(g.name)}</b></td><td>${esc(g.category)}</td><td>${esc(g.provider)}</td>
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

function ticketsView(){
 const list=(db().tickets||[]).slice().reverse();
 return `<div class="panel"><div class="panel-h"><h3>Destek talepleri (${list.length})</h3></div>
 <div class="panel-b" style="padding:0;overflow:auto"><table class="table"><thead><tr><th>Kullanıcı</th><th>Mesaj</th><th>Durum</th><th>Tarih</th></tr></thead><tbody>
 ${list.length?list.map(t=>`<tr><td><b>${esc(t.username||'—')}</b></td><td>${esc(t.message)}</td><td>${esc(t.status||'Açık')}</td><td>${t.at?new Date(t.at).toLocaleString('tr-TR'):'—'}</td></tr>`).join(''):'<tr><td colspan="4" class="empty">Talep yok</td></tr>'}
 </tbody></table></div></div>`;
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
  const tl=Number(fd.get('minPlayTl'));
  if(!Number.isFinite(tl)||tl<1||tl>100000){alert('Min oyun bakiyesi 1 ile 100.000 TL arasında olmalı.');return}
  const name=String(fd.get('siteName')||'').trim();
  if(name.length<2||name.length>40){alert('Site adı 2-40 karakter olmalı.');return}
  const np=String(fd.get('newPass')||'');
  if(np&&np.length<8){alert('Yeni şifre en az 8 karakter olmalı.');return}
  CMS.setSettings({siteName:name,minPlay:Math.round(tl*100)});
  if(np){CMS.setAdminPass(np);sessionStorage.setItem(SES,adminTok())}
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
  const title=String(fd.get('title')||'').trim();
  const bonusTl=Number(fd.get('bonusTl'));
  if(title.length<2){alert('Bonus adı gerekli.');return}
  if(!Number.isFinite(bonusTl)||bonusTl<0||bonusTl>1000000){alert('Bonus tutarı 0 ile 1.000.000 TL arasında olmalı.');return}
  const item={
   id:p?.id||rid(),title,badge:String(fd.get('badge')||''),subtitle:String(fd.get('subtitle')||''),
   desc:String(fd.get('desc')||''),summary:String(fd.get('summary')||''),wager:String(fd.get('wager')||''),
   duration:String(fd.get('duration')||''),minDeposit:String(fd.get('minDeposit')||''),maxBonus:String(fd.get('maxBonus')||''),
   eligible:String(fd.get('eligible')||''),withdraw:String(fd.get('withdraw')||''),
   terms:String(fd.get('terms')||'').split('\n').map(s=>s.trim()).filter(Boolean),
   bonus:Math.round(bonusTl*100),image,active:fd.get('active')==='1',
   example:p?.example||'',exceptions:p?.exceptions||[]
  };
  if(!id&&list.some(x=>x.id===item.id)){alert('Bu bonus kimliği zaten var.');return}
  const next=id?list.map(x=>x.id===id?item:x):[...list,item];
  CMS.setPromotions(next);m.remove();render();
 };
}

function openPay(id){
 const list=CMS.getAllPayments(C());
 const p=id?list.find(x=>x.id===id):{};
 const m=modal(payForm(p||{}));
 m.querySelector('[data-close]').onclick=()=>m.remove();
 m.querySelector('#payForm').onsubmit=async e=>{
  e.preventDefault();const fd=new FormData(e.target);
  const name=String(fd.get('name')||'').trim();
  if(name.length<2){alert('Yöntem adı gerekli.');return}
  const min=Number(fd.get('min')),max=Number(fd.get('max'));
  if(!Number.isFinite(min)||!Number.isFinite(max)||min<1||max<min||max>500000){alert('Limitler geçersiz (1 ≤ min ≤ maks ≤ 500.000).');return}
  let logo=String(fd.get('logo')||'').trim()||(String(p?.logo||'').startsWith('data:')?p.logo:'');
  if(logo&&!/^(assets\/|https:\/\/|data:image\/)/.test(logo)){alert('Logo yolu assets/ ile ya da https:// ile başlamalı.');return}
  const file=fd.get('file');if(file&&file.size)logo=(await readFileAsDataURL(file))||logo;
  if(fd.get('clearLogo'))logo='';
  const item={...(p||{}),id:p?.id||('pay_'+rid().slice(2)),name,type:String(fd.get('type')||''),eta:String(fd.get('eta')||''),group:String(fd.get('group')||'banka'),min:Math.round(min),max:Math.round(max),logo,active:fd.get('active')==='1'};
  if(!id&&list.some(x=>x.id===item.id)){alert('Bu yöntem kimliği zaten var.');return}
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
  const gid=String(fd.get('id')||'').trim(),gname=String(fd.get('name')||'').trim(),cat=String(fd.get('category')),prov=String(fd.get('provider')||'').trim();
  if(!/^[a-z0-9-]{2,40}$/.test(gid)){alert('Oyun kimliği 2-40 karakter, küçük harf, rakam ve tire olmalı.');return}
  if(gname.length<2){alert('Oyun adı gerekli.');return}
  if(!['slots','live','table'].includes(cat)){alert('Geçersiz kategori.');return}
  if(!(C().providers||[]).some(p=>p.id===prov)){alert('Bu sağlayıcı kimliği katalogda yok.');return}
  if(!id&&list.some(x=>x.id===gid)){alert('Bu oyun kimliği zaten var.');return}
  const item={id:gid,name:gname,category:cat,provider:prov,
   image,hue:Number(fd.get('hue')||200),active:fd.get('active')==='1',isNew:!!g?.isNew};
  const next=id?list.map(x=>x.id===id?{...x,...item}:x):[...list,item];
  CMS.setGames(next);m.remove();render();
 };
}

requireAuth();
})();
