/* Tarayıcı içi "backend": sunucu yok, veriler localStorage'da tutulur.
   app.js ile aynı API biçimini (api(yol, yöntem, gövde)) kullanır. */
(()=>{
const KEY='bw_db_v1',SES='bw_session',C=window.CATALOG;
const START=100000,MAX_BAL=100000000,MAX_DEP=500000; // kuruş cinsinden
const fresh=()=>({users:[],tx:[],favs:{},claims:{},notifs:[]});
let db;try{db=JSON.parse(localStorage.getItem(KEY))||fresh()}catch{db=fresh()}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(db))}catch{}};
const bad=(status,m)=>{throw Object.assign(new Error(m),{status})};
const rid=()=>Array.from(crypto.getRandomValues(new Uint8Array(8)),b=>b.toString(16).padStart(2,'0')).join('');
const hex=a=>Array.from(a,b=>b.toString(16).padStart(2,'0')).join('');
async function hash(pw,salt=rid()){
 if(crypto.subtle){const enc=new TextEncoder(),k=await crypto.subtle.importKey('raw',enc.encode(pw),'PBKDF2',false,['deriveBits']);
  return salt+':'+hex(new Uint8Array(await crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode(salt),iterations:100000,hash:'SHA-256'},k,256)))}
 let h=5381;for(const ch of salt+pw)h=((h<<5)+h+ch.charCodeAt(0))|0;return salt+':'+(h>>>0).toString(16)}
const pub=u=>({id:u.id,username:u.username,guest:!!u.guest,balance:u.balance,createdAt:u.createdAt});
const addTx=(u,type,amount,note)=>{u.balance+=amount;db.tx.push({id:rid(),uid:u.id,type,amount,balance:u.balance,note,at:Date.now()})};
const notify=(uid,title)=>db.notifs.push({id:rid(),uid,title,read:false,at:Date.now()});
function newUser(username,pass,guest){
 const u={id:rid(),username,pass,guest,balance:0,createdAt:Date.now()};db.users.push(u);
 addTx(u,'bonus',START,'Başlangıç kredisi');notify(u.id,'Hoş geldin! Hesabına başlangıç kredisi eklendi.');
 localStorage.setItem(SES,u.id);save();return u}
const money=(v,min,max)=>{const n=Math.round(Number(v)*100);if(!Number.isFinite(n)||n<min||n>max)bad(400,`Tutar ${min/100} ile ${max/100} arasında olmalı.`);return n};
const tries=[];const throttle=()=>{const n=Date.now();while(tries.length&&n-tries[0]>60000)tries.shift();if(tries.length>=10)bad(429,'Çok fazla deneme. Biraz bekle.');tries.push(n)};

window.api=async function(path,method='GET',body={}){
 body=body||{};const [p,qs]=path.split('?'),q=new URLSearchParams(qs||''),seg=p.split('/').filter(Boolean),k=method+' /'+seg.join('/');
 const uid=localStorage.getItem(SES),user=db.users.find(u=>u.id===uid);
 const need=()=>{if(!user)bad(401,'Oturum geçersiz.');return user};
 const m=(re)=>k.match(re);let r;
 if(k==='POST /auth/guest'){throttle();const u=newUser('misafir_'+rid().slice(0,6),null,true);return {user:pub(u)}}
 if(k==='POST /auth/register'){throttle();const un=String(body.username||'').trim(),pw=String(body.password||'');
  if(!/^[a-zA-Z0-9_]{3,20}$/.test(un))bad(400,'Kullanıcı adı 3-20 karakter olmalı (harf, rakam, _).');
  if(pw.length<8)bad(400,'Şifre en az 8 karakter olmalı.');
  if(db.users.some(u=>u.username.toLowerCase()===un.toLowerCase()))bad(409,'Bu kullanıcı adı alınmış.');
  return {user:pub(newUser(un,await hash(pw),false))}}
 if(k==='POST /auth/login'){throttle();const u=db.users.find(x=>!x.guest&&x.username.toLowerCase()===String(body.username||'').toLowerCase());
  if(!u||(await hash(String(body.password||''),u.pass.split(':')[0]))!==u.pass)bad(401,'Kullanıcı adı veya şifre hatalı.');
  localStorage.setItem(SES,u.id);return {user:pub(u)}}
 if(k==='GET /me')return {user:pub(need())};
 if(k==='GET /providers'){const s=(q.get('q')||'').toLowerCase();return {providers:C.providers.filter(x=>x.name.toLowerCase().includes(s))}}
 if(r=m(/^GET \/providers\/([^/]+)$/)){const x=C.providers.find(v=>v.id===r[1]);if(!x)bad(404,'Sağlayıcı bulunamadı.');return {provider:x,games:C.games.filter(g=>g.provider===x.id)}}
 if(k==='GET /games'){let l=C.games;const c=q.get('category'),pr=q.get('provider'),s=(q.get('q')||'').toLowerCase();
  if(c)l=l.filter(g=>g.category===c);if(pr)l=l.filter(g=>g.provider===pr);if(s)l=l.filter(g=>g.name.toLowerCase().includes(s));if(q.get('new'))l=l.filter(g=>g.isNew);return {games:l}}
 if(r=m(/^POST \/games\/([^/]+)\/launch$/)){need();const g=C.games.find(x=>x.id===r[1]);if(!g)bad(404,'Oyun bulunamadı.');return {demo:true,game:g,message:`${g.name} demo modunda açıldı. Sanal kredi kullanılır.`}}
 if(k==='GET /favorites')return {favorites:db.favs[need().id]||[]};
 if(r=m(/^(POST|DELETE) \/favorites\/([^/]+)$/)){const u=need(),a=db.favs[u.id]=db.favs[u.id]||[];
  if(r[1]==='POST'){if(!C.games.some(g=>g.id===r[2]))bad(404,'Oyun bulunamadı.');if(!a.includes(r[2]))a.push(r[2])}else db.favs[u.id]=a.filter(x=>x!==r[2]);
  save();return {favorites:db.favs[u.id]}}
 if(k==='GET /wallet')return {balance:need().balance};
 if(k==='GET /wallet/transactions')return {transactions:db.tx.filter(t=>t.uid===need().id).slice(-30).reverse()};
 if(k==='POST /wallet/deposit'){const u=need(),n=money(body.amount,100,MAX_DEP);if(u.balance+n>MAX_BAL)bad(400,'Bakiye üst sınırına ulaşıldı.');addTx(u,'deposit',n,'Sanal kredi yükleme');save();return {balance:u.balance}}
 if(k==='GET /promotions'){const u=need();return {promotions:C.promotions.map(x=>({...x,claimed:(db.claims[u.id]||[]).includes(x.id)}))}}
 if(r=m(/^POST \/promotions\/([^/]+)\/claim$/)){const u=need(),x=C.promotions.find(v=>v.id===r[1]);if(!x)bad(404,'Promosyon bulunamadı.');
  const a=db.claims[u.id]=db.claims[u.id]||[];if(a.includes(x.id))bad(409,'Bu promosyonu zaten aldın.');
  a.push(x.id);addTx(u,'bonus',x.bonus,x.title);notify(u.id,`${x.title} hesabına eklendi.`);save();return {balance:u.balance}}
 if(k==='GET /notifications'){const l=db.notifs.filter(n=>n.uid===need().id).slice(-20).reverse();return {notifications:l,unread:l.filter(n=>!n.read).length}}
 if(k==='POST /notifications/read'){const u=need();db.notifs.forEach(n=>{if(n.uid===u.id)n.read=true});save();return {ok:true}}
 bad(404,'Bulunamadı.')};
})();
