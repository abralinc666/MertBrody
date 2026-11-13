/* Tarayıcı içi backend: localStorage. CMS overrides CATALOG. */
(()=>{
const KEY='bw_db_v1',SES='bw_session';
let C=window.CATALOG;
if(window.CMS){window.CMS.seedFromCatalog(C);C=window.CMS.applyToCatalog(C);window.CATALOG=C}
const START=100000,MAX_BAL=100000000,MAX_DEP=500000;
const fresh=()=>({users:[],tx:[],favs:{},claims:{},notifs:[],bets:[],tickets:[]});
let db;try{db=JSON.parse(localStorage.getItem(KEY))||fresh()}catch{db=fresh()}
if(!db.bets)db.bets=[];
if(!db.tickets)db.tickets=[];
const bad=(status,m)=>{throw Object.assign(new Error(m),{status,code:status})};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch{bad(507,'Kayıt yazılamadı. Tarayıcı depolama alanı dolu olabilir.')}};
const rid=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join('');
const hex=a=>Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');
async function hash(pw,salt=rid()){
 if(crypto.subtle){const enc=new TextEncoder(),k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  return salt+':'+hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},k,256)))}
 let h=5381;for(const ch of salt+pw)h=((h<<5)+h+ch.charCodeAt(0))|0;return salt+':'+(h>>>0).toString(16)}
const pub=u=>({id:u.id,username:u.username,guest:!!u.guest,balance:u.balance,createdAt:u.createdAt,
 firstName:u.firstName||'',lastName:u.lastName||'',tc:u.tc||'',email:u.email||'',phone:u.phone||'',
 address:u.address||'',city:u.city||'',district:u.district||'',promoCode:u.promoCode||'',
 kycStatus:u.guest?'misafir':(u.kycStatus||'doğrulandı')});
const addTx=(u,type,amount,note)=>{u.balance+=amount;db.tx.push({id:rid(),uid:u.id,type,amount,balance:u.balance,note,at:Date.now(),status:'Tamamlandı'});return db.tx[db.tx.length-1]};
const notify=(uid,title)=>db.notifs.push({id:rid(),uid,title,read:false,at:Date.now()});
function newUser(username,pass,guest,profile={}){
 const u={id:rid(),username,pass,guest,balance:0,createdAt:Date.now(),kycStatus:guest?'misafir':'doğrulandı',...profile};db.users.push(u);
 addTx(u,'bonus',START,'Başlangıç kredisi');notify(u.id,'Hoş geldin! Hesabına başlangıç kredisi eklendi.');
 localStorage.setItem(SES,u.id);save();return u}
/* Demo: 11 haneli TC; gerçek ortamda algoritma + MERNİS doğrulaması gerekir */
const validTC=t=>/^[1-9]\d{10}$/.test(t);
const validMail=e=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validPhone=p=>/^(\+90|0)?5\d{9}$/.test(String(p).replace(/[\s-]/g,''));
const money=(v,min,max)=>{const n=Math.round(Number(v)*100);if(!Number.isFinite(n)||n<min||n>max)bad(400,`Tutar ${min/100} ile ${max/100} arasında olmalı.`);return n};
const tries=[];const throttle=()=>{const n=Date.now();while(tries.length&&n-tries[0]>60000)tries.shift();if(tries.length>=10)bad(429,'Çok fazla deneme. Biraz bekle.');tries.push(n)};
const refreshC=()=>{if(window.CMS){const merged=window.CMS.applyToCatalog(window.CATALOG_BASE||window.CATALOG);Object.keys(merged).forEach(k=>{window.CATALOG[k]=merged[k]});C=window.CATALOG}else C=window.CATALOG;return C};
const minPlay=()=>{const n=Number((refreshC().settings||{}).minPlay);return Number.isFinite(n)&&n>=100&&n<=10000000?n:1000};
const minDepositOf=x=>{const m=String(x.minDeposit||'').replace(/\./g,'').match(/(\d+)/);return m?Number(m[1])*100:0};
const needAuth=u=>{if(!u||u.guest)bad(401,'Oynamak için giriş yap');return u};
const needBalance=(u,min)=>{if(u.balance<min)bad(400,'Yetersiz bakiye');return u};

window.api=async function(path,method='GET',body={}){
 body=body||{};refreshC();C=window.CATALOG;
 const [p,qs]=path.split('?'),q=new URLSearchParams(qs||''),seg=p.split('/').filter(Boolean),k=method+' /'+seg.join('/');
 const uid=localStorage.getItem(SES),user=db.users.find(u=>u.id===uid);
 const need=()=>{if(!user)bad(401,'Oturum geçersiz.');return user};
 const m=(re)=>k.match(re);let r;

 if(k==='POST /auth/guest'){throttle();
  const drop=new Set(db.users.filter(u=>u.guest).map(u=>u.id));
  if(drop.size){db.users=db.users.filter(u=>!u.guest);db.tx=db.tx.filter(t=>!drop.has(t.uid));db.bets=(db.bets||[]).filter(b=>!drop.has(b.uid));db.notifs=db.notifs.filter(n=>!drop.has(n.uid));save()}
  const u=newUser('misafir_'+rid().slice(0,6),null,true);return {user:pub(u)}}
 if(k==='POST /auth/register'){throttle();
  const firstName=String(body.firstName||'').trim(),lastName=String(body.lastName||'').trim();
  const tc=String(body.tc||'').replace(/\D/g,''),email=String(body.email||'').trim().toLowerCase();
  const phone=String(body.phone||'').replace(/[\s-]/g,''),address=String(body.address||'').trim();
  const city=String(body.city||'').trim(),district=String(body.district||'').trim();
  const un=String(body.username||'').trim(),pw=String(body.password||''),promoCode=String(body.promoCode||'').trim();
  if(firstName.length<2||lastName.length<2)bad(400,'Ad ve soyad gerekli.');
  if(!validTC(tc))bad(400,'Geçerli bir T.C. kimlik no gir.');
  if(!validMail(email))bad(400,'Geçerli e-posta gir.');
  if(!validPhone(phone))bad(400,'Geçerli cep telefonu gir (05xxxxxxxxx).');
  if(address.length<5)bad(400,'Adres en az 5 karakter olmalı.');
  const places=window.TR_PLACES||{};
  if(!places[city])bad(400,'Listeden bir il seç.');
  if(!places[city].includes(district))bad(400,'Seçilen ile ait bir ilçe seç.');
  if(!/^[a-zA-Z0-9_]{3,20}$/.test(un))bad(400,'Kullanıcı adı 3-20 karakter olmalı (harf, rakam, _).');
  if(pw.length<8)bad(400,'Şifre en az 8 karakter olmalı.');
  if(pw!==String(body.password2||''))bad(400,'Şifreler eşleşmiyor.');
  if(!body.terms)bad(400,'18+ onayı gerekli.');
  if(db.users.some(u=>u.username.toLowerCase()===un.toLowerCase()))bad(409,'Bu kullanıcı adı alınmış.');
  if(db.users.some(u=>u.email&&u.email===email))bad(409,'Bu e-posta kayıtlı.');
  if(db.users.some(u=>u.tc&&u.tc===tc))bad(409,'Bu T.C. kimlik no kayıtlı.');
  const u=newUser(un,await hash(pw),false,{firstName,lastName,tc,email,phone,address,city,district,promoCode});
  return {user:pub(u),welcome:true}}
 if(k==='POST /auth/login'){throttle();const u=db.users.find(x=>!x.guest&&x.username.toLowerCase()===String(body.username||'').toLowerCase());
  if(!u||(await hash(String(body.password||''),u.pass.split(':')[0]))!==u.pass)bad(401,'Kullanıcı adı veya şifre hatalı.');
  localStorage.setItem(SES,u.id);return {user:pub(u),welcome:true}}
 if(k==='GET /me')return {user:pub(need())};
 if(k==='GET /profile/summary'){const u=needAuth(need());
  const my=db.tx.filter(t=>t.uid===u.id);
  const bets=db.bets.filter(b=>b.uid===u.id);
  const dep=my.filter(t=>t.type==='deposit').reduce((s,t)=>s+t.amount,0);
  const wd=my.filter(t=>t.type==='withdraw').reduce((s,t)=>s+Math.abs(t.amount),0);
  const bonus=my.filter(t=>t.type==='bonus').reduce((s,t)=>s+t.amount,0);
  const stake=bets.reduce((s,b)=>s+b.stake,0),won=bets.filter(b=>b.won).length;
  return {summary:{balance:u.balance,deposits:dep,withdrawals:wd,bonuses:bonus,bets:bets.length,wins:won,stake,claims:(db.claims[u.id]||[]).length}}}
 if(k==='GET /bets'){const u=need();return {bets:db.bets.filter(b=>b.uid===u.id).slice(-50).reverse()}}

 if(k==='GET /providers'){const s=(q.get('q')||'').toLowerCase();return {providers:C.providers.filter(x=>x.name.toLowerCase().includes(s))}}
 if(r=m(/^GET \/providers\/([^/]+)$/)){const x=C.providers.find(v=>v.id===r[1]);if(!x)bad(404,'Sağlayıcı bulunamadı.');return {provider:x,games:C.games.filter(g=>g.provider===x.id&&g.active!==false)}}
 if(k==='GET /games'){let l=C.games.filter(g=>g.active!==false);const c=q.get('category'),pr=q.get('provider'),s=(q.get('q')||'').toLowerCase();
  if(c)l=l.filter(g=>g.category===c);if(pr)l=l.filter(g=>g.provider===pr);if(s)l=l.filter(g=>g.name.toLowerCase().includes(s));if(q.get('new'))l=l.filter(g=>g.isNew);return {games:l}}
 if(r=m(/^POST \/games\/([^/]+)\/launch$/)){const u=needAuth(need());needBalance(u,minPlay());
  const g=C.games.find(x=>x.id===r[1]&&x.active!==false);if(!g)bad(404,'Oyun bulunamadı.');
  return {demo:true,game:g,message:`${g.name} demo modunda açıldı.`}}

 if(k==='GET /favorites')return {favorites:db.favs[need().id]||[]};
 if(r=m(/^(POST|DELETE) \/favorites\/([^/]+)$/)){const u=need(),a=db.favs[u.id]=db.favs[u.id]||[];
  if(r[1]==='POST'){if(!C.games.some(g=>g.id===r[2]))bad(404,'Oyun bulunamadı.');if(!a.includes(r[2]))a.push(r[2])}else db.favs[u.id]=a.filter(x=>x!==r[2]);
  save();return {favorites:db.favs[u.id]}}

 if(k==='GET /wallet')return {balance:need().balance};
 if(k==='GET /wallet/transactions')return {transactions:db.tx.filter(t=>t.uid===need().id).slice(-30).reverse()};
 if(k==='POST /wallet/deposit'){const u=need(),n=money(body.amount,100,MAX_DEP);if(u.balance+n>MAX_BAL)bad(400,'Bakiye üst sınırına ulaşıldı.');
  const method=(C.payments||[]).find(p=>p.id===body.method)?.name||'Sanal kredi';
  addTx(u,'deposit',n,method+' ile yükleme');save();return {balance:u.balance}}
 if(k==='POST /wallet/withdraw'){const u=needAuth(need()),n=money(body.amount,100,MAX_DEP);if(u.balance<n)bad(400,'Yetersiz bakiye');
  addTx(u,'withdraw',-n,'Sanal çekim talebi');notify(u.id,'Çekim talebin simüle edildi.');save();return {balance:u.balance}}

 if(k==='GET /promotions'){const u=need();return {promotions:(C.promotions||[]).filter(x=>x.active!==false).map(x=>({...x,claimed:(db.claims[u.id]||[]).includes(x.id)}))}}
 if(r=m(/^GET \/promotions\/([^/]+)$/)){const u=need(),x=(C.promotions||[]).find(v=>v.id===r[1]);if(!x||x.active===false)bad(404,'Promosyon bulunamadı.');
  return {promotion:{...x,claimed:(db.claims[u.id]||[]).includes(x.id)}}}
 if(r=m(/^POST \/promotions\/([^/]+)\/claim$/)){const u=needAuth(need());
  const x=(C.promotions||[]).find(v=>v.id===r[1]);if(!x||x.active===false)bad(404,'Promosyon bulunamadı.');
  const a=db.claims[u.id]=db.claims[u.id]||[];if(a.includes(x.id))bad(409,'Bu promosyonu zaten aldın.');
  const needDep=minDepositOf(x);
  if(needDep){const dep=db.tx.filter(t=>t.uid===u.id&&t.type==='deposit').reduce((s,t)=>s+t.amount,0);if(dep<needDep)bad(400,`Bu bonus için en az ${needDep/100} TL yatırım gerekli.`)}
  const bonusAmt=Math.round(Number(x.bonus)||0);
  if(!Number.isFinite(bonusAmt)||bonusAmt<0)bad(400,'Bonus tutarı geçersiz.');
  a.push(x.id);addTx(u,'bonus',bonusAmt,x.title);notify(u.id,`${x.title} hesabına eklendi.`);save();return {balance:u.balance}}

 if(k==='GET /sports'){let l=C.sports||[];if(q.get('live')==='1')l=l.filter(x=>x.live);if(q.get('sport'))l=l.filter(x=>x.sport===q.get('sport'));return {matches:l}}
 if(k==='POST /bets'){const u=needAuth(need());needBalance(u,minPlay());
  const stake=money(body.stake,100,MAX_DEP),odd=Number(body.odd);
  if(!Number.isFinite(odd)||odd<1.01||odd>1000)bad(400,'Oran 1.01 ile 1000 arasında olmalı.');
  if(u.balance<stake)bad(400,'Yetersiz bakiye');
  const win=Math.random()>.48;let payout=win?Math.round(stake*odd):0;
  if(!Number.isFinite(payout)||payout<0)bad(400,'Kazanç hesaplanamadı.');
  if(payout>50000000)payout=50000000;
  if(u.balance-stake+payout>MAX_BAL)bad(400,'Bakiye üst sınırına ulaşıldı.');
  addTx(u,'bet',-stake,`${body.selection||'Bahis'} @ ${odd}`);
  if(win)addTx(u,'win',payout,'Bahis kazancı');
  db.bets.push({id:rid(),uid:u.id,selection:body.selection||'Bahis',odd,stake,payout:win?payout:0,won:win,status:win?'Kazandı':'Kaybetti',at:Date.now()});
  notify(u.id,win?`Bahis kazandı! +${(payout/100).toFixed(2)}`:'Bahis kaybetti (demo).');
  save();return {balance:u.balance,won:win,payout}}

 if(k==='GET /payments')return {payments:C.payments||[]};
 if(k==='GET /faq')return {faq:C.faq||[]};
 if(k==='GET /settings')return {settings:C.settings||{minPlay:1000,siteName:'BrodyBet'}};
 if(k==='POST /support'){const u=need();const message=String(body.message||'').trim();
  if(message.length<5||message.length>1000)bad(400,'Mesaj 5-1000 karakter olmalı.');
  db.tickets.push({id:rid(),uid:u.id,username:u.username,message,at:Date.now(),status:'Açık'});
  notify(u.id,'Destek talebin alındı (demo).');save();return {ok:true,message:'Destek talebin kaydedildi.'}}
 if(k==='GET /notifications'){const l=db.notifs.filter(n=>n.uid===need().id).slice(-20).reverse();return {notifications:l,unread:l.filter(n=>!n.read).length}}
 if(k==='POST /notifications/read'){const u=need();db.notifs.forEach(n=>{if(n.uid===u.id)n.read=true});save();return {ok:true}}

 /* Admin istatistikleri panelde doğrudan hesaplanıyor; yetkisiz /admin/stats uç noktası kaldırıldı. */
 bad(404,'Bulunamadı.')};
})();
