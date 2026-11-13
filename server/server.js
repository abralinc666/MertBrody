const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const {db,save}=require('./db'),cat=require('./catalog');
const PORT=process.env.PORT||3000,PUB=path.join(__dirname,'..','public');
const SF=path.join(__dirname,'data','secret.key');
const SECRET=process.env.TOKEN_SECRET||(fs.existsSync(SF)?fs.readFileSync(SF,'utf8'):(s=>(fs.writeFileSync(SF,s),s))(crypto.randomBytes(32).toString('hex')));
const START=100000; // 1.000,00 kredi (kuruş cinsinden tutulur)
const MAX_BAL=100000000, MAX_DEP=500000;

/* ---------- yardımcılar ---------- */
const b64=b=>Buffer.from(b).toString('base64url');
const sign=s=>crypto.createHmac('sha256',SECRET).update(s).digest('base64url');
const mkToken=uid=>{const p=b64(JSON.stringify({uid,exp:Date.now()+30*864e5}));return p+'.'+sign(p)};
function readToken(t){if(!t)return null;const [p,s]=t.split('.');if(!p||!s)return null;
 const a=Buffer.from(s),b=Buffer.from(sign(p));if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return null;
 try{const d=JSON.parse(Buffer.from(p,'base64url'));return d.exp>Date.now()?d.uid:null}catch{return null}}
const hash=(pw,salt=crypto.randomBytes(16).toString('hex'))=>salt+':'+crypto.scryptSync(pw,salt,64).toString('hex');
const check=(pw,h)=>{const [s,x]=h.split(':');const y=hash(pw,s).split(':')[1];return crypto.timingSafeEqual(Buffer.from(x),Buffer.from(y))};
const id=()=>crypto.randomBytes(8).toString('hex');
const pub=u=>({id:u.id,username:u.username,guest:!!u.guest,balance:u.balance,createdAt:u.createdAt});
class HttpError extends Error{constructor(c,m){super(m);this.code=c}}
const bad=(c,m)=>{throw new HttpError(c,m)};
function addTx(u,type,amount,note){u.balance+=amount;db.tx.push({id:id(),uid:u.id,type,amount,balance:u.balance,note,at:Date.now()})}
function notify(uid,title){db.notifs.push({id:id(),uid,title,read:false,at:Date.now()})}
function newUser(username,pw,guest){
 const u={id:id(),username,pass:pw?hash(pw):null,guest,balance:0,createdAt:Date.now()};
 db.users.push(u);addTx(u,'bonus',START,'Başlangıç kredisi');notify(u.id,'Hoş geldin! Hesabına başlangıç kredisi eklendi.');save();return u}
const hits=new Map();
function limit(key,max,win=60000){const n=Date.now(),a=(hits.get(key)||[]).filter(t=>n-t<win);if(a.length>=max)bad(429,'Çok fazla deneme. Biraz bekle.');a.push(n);hits.set(key,a)}
setInterval(()=>hits.clear(),600000).unref();

/* ---------- rotalar ---------- */
const R=[];const route=(m,p,auth,fn)=>R.push({m,re:new RegExp('^'+p.replace(/:(\w+)/g,'(?<$1>[^/]+)')+'$'),auth,fn});
const money=(v,min,max)=>{const n=Math.round(Number(v)*100);if(!Number.isFinite(n)||n<min||n>max)bad(400,`Tutar ${min/100} ile ${max/100} arasında olmalı.`);return n};

route('POST','/api/auth/guest',false,(c)=>{limit('g'+c.ip,10);const u=newUser('misafir_'+id().slice(0,6),null,true);return {token:mkToken(u.id),user:pub(u)}});
route('POST','/api/auth/register',false,(c)=>{limit('r'+c.ip,10);
 const un=String(c.body.username||'').trim(),pw=String(c.body.password||'');
 if(!/^[a-zA-Z0-9_]{3,20}$/.test(un))bad(400,'Kullanıcı adı 3-20 karakter olmalı (harf, rakam, _).');
 if(pw.length<8)bad(400,'Şifre en az 8 karakter olmalı.');
 if(db.users.some(u=>u.username.toLowerCase()===un.toLowerCase()))bad(409,'Bu kullanıcı adı alınmış.');
 const u=newUser(un,pw,false);return {token:mkToken(u.id),user:pub(u)}});
route('POST','/api/auth/login',false,(c)=>{limit('l'+c.ip,10);
 const u=db.users.find(x=>!x.guest&&x.username.toLowerCase()===String(c.body.username||'').toLowerCase());
 if(!u||!check(String(c.body.password||''),u.pass))bad(401,'Kullanıcı adı veya şifre hatalı.');
 return {token:mkToken(u.id),user:pub(u)}});
route('GET','/api/me',true,c=>({user:pub(c.user)}));

route('GET','/api/providers',false,c=>{const q=(c.q.get('q')||'').toLowerCase();return {providers:cat.providers.filter(p=>p.name.toLowerCase().includes(q))}});
route('GET','/api/providers/:id',false,c=>{const p=cat.providers.find(x=>x.id===c.p.id);if(!p)bad(404,'Sağlayıcı bulunamadı.');return {provider:p,games:cat.games.filter(g=>g.provider===p.id)}});
route('GET','/api/games',false,c=>{const {q}=c;let l=cat.games;
 const k=q.get('category'),pr=q.get('provider'),s=(q.get('q')||'').toLowerCase();
 if(k)l=l.filter(g=>g.category===k);if(pr)l=l.filter(g=>g.provider===pr);if(s)l=l.filter(g=>g.name.toLowerCase().includes(s));
 if(q.get('new'))l=l.filter(g=>g.isNew);return {games:l}});
route('POST','/api/games/:id/launch',true,c=>{const g=cat.games.find(x=>x.id===c.p.id);if(!g)bad(404,'Oyun bulunamadı.');
 return {demo:true,game:g,message:`${g.name} demo modunda açıldı. Sanal kredi kullanılır.`}});

route('GET','/api/favorites',true,c=>({favorites:db.favs[c.user.id]||[]}));
route('POST','/api/favorites/:id',true,c=>{if(!cat.games.some(g=>g.id===c.p.id))bad(404,'Oyun bulunamadı.');
 const a=db.favs[c.user.id]=db.favs[c.user.id]||[];if(!a.includes(c.p.id))a.push(c.p.id);save();return {favorites:a}});
route('DELETE','/api/favorites/:id',true,c=>{db.favs[c.user.id]=(db.favs[c.user.id]||[]).filter(x=>x!==c.p.id);save();return {favorites:db.favs[c.user.id]}});

route('GET','/api/wallet',true,c=>({balance:c.user.balance}));
route('GET','/api/wallet/transactions',true,c=>({transactions:db.tx.filter(t=>t.uid===c.user.id).slice(-30).reverse()}));
route('POST','/api/wallet/deposit',true,c=>{limit('d'+c.user.id,20);const n=money(c.body.amount,100,MAX_DEP);
 if(c.user.balance+n>MAX_BAL)bad(400,'Bakiye üst sınırına ulaşıldı.');addTx(c.user,'deposit',n,'Sanal kredi yükleme');save();return {balance:c.user.balance}});

route('GET','/api/promotions',true,c=>({promotions:cat.promotions.map(p=>({...p,claimed:!!(db.claims[c.user.id]||[]).includes(p.id)}))}));
route('POST','/api/promotions/:id/claim',true,c=>{const p=cat.promotions.find(x=>x.id===c.p.id);if(!p)bad(404,'Promosyon bulunamadı.');
 const a=db.claims[c.user.id]=db.claims[c.user.id]||[];if(a.includes(p.id))bad(409,'Bu promosyonu zaten aldın.');
 a.push(p.id);addTx(c.user,'bonus',p.bonus,p.title);notify(c.user.id,`${p.title} hesabına eklendi.`);save();return {balance:c.user.balance}});

route('GET','/api/notifications',true,c=>{const l=db.notifs.filter(n=>n.uid===c.user.id).slice(-20).reverse();return {notifications:l,unread:l.filter(n=>!n.read).length}});
route('POST','/api/notifications/read',true,c=>{db.notifs.forEach(n=>{if(n.uid===c.user.id)n.read=true});save();return {ok:true}});

/* ---------- sunucu ---------- */
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.ico':'image/x-icon','.json':'application/json'};
const send=(res,code,obj)=>{const b=JSON.stringify(obj);res.writeHead(code,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'});res.end(b)};
const readBody=req=>new Promise((ok,no)=>{let s='';req.on('data',d=>{s+=d;if(s.length>10240){no(new HttpError(413,'İstek çok büyük.'));req.destroy()}});req.on('end',()=>{try{ok(s?JSON.parse(s):{})}catch{no(new HttpError(400,'Geçersiz JSON.'))}})});

http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://x');
  if(url.pathname.startsWith('/api/')){
   for(const r of R){if(r.m!==req.method)continue;const m=url.pathname.match(r.re);if(!m)continue;
    const c={ip:req.socket.remoteAddress,q:url.searchParams,p:m.groups||{},body:{}};
    if(r.auth){const uid=readToken((req.headers.authorization||'').replace('Bearer ',''));c.user=db.users.find(u=>u.id===uid);if(!c.user)bad(401,'Oturum geçersiz.')}
    if(req.method==='POST')c.body=await readBody(req);
    return send(res,200,r.fn(c))}
   bad(404,'Bulunamadı.')}
  let f=path.normalize(path.join(PUB,url.pathname==='/'?'index.html':decodeURIComponent(url.pathname)));
  if(!f.startsWith(PUB)||!fs.existsSync(f)||fs.statSync(f).isDirectory())bad(404,'Bulunamadı.');
  res.writeHead(200,{'Content-Type':MIME[path.extname(f)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});fs.createReadStream(f).pipe(res);
 }catch(e){if(e instanceof HttpError)send(res,e.code,{error:e.message});else{console.error(e);send(res,500,{error:'Sunucu hatası.'})}}
}).listen(PORT,()=>console.log(`Betwin hazır: http://localhost:${PORT}`));
