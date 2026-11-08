/* ===== AYARLAR ===== */
const WHATSAPP_NO = {{js:WHATSAPP_NUMBER}};
const MAP_URL = {{js:MAP_URL}};
const SERVICES = {"Protez Tırnak":900,"Kalıcı Oje":400,"NailArt Tasarım":50,"Manikür":350,"Pedikür":450,"Spa Bakım":600,"Söküm":200};
const MIN={"Protez Tırnak":120,"Kalıcı Oje":45,"NailArt Tasarım":30,"Manikür":45,"Pedikür":60,"Spa Bakım":60,"Söküm":20}; /* tahmini süreler (dk) – düzenleyebilirsiniz */
const CLOSE=20*60;
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
/* Kampanya şeridi: boş bırakırsanız gizlenir */
const CAMPAIGN = {{js:CAMPAIGN}};
/* Sosyal medya linkleri: boş olanlar gösterilmez */
const SOCIAL = {Instagram:{{js:INSTAGRAM}}, TikTok:{{js:TIKTOK}}, YouTube:{{js:YOUTUBE}}};
/* Google Maps > Paylaş > Harita yerleştir > iframe içindeki src adresini yapıştırın (boşsa gösterilmez) */
const MAP_EMBED = {{js:MAP_EMBED}};
/* Gerçek müşteri yorumları: {n:"Ad S.", t:"Yorum metni", s:5} (boşsa bölüm gösterilmez) */
const REVIEWS = [];
/* Önce/Sonra: img klasörüne iki fotoğraf koyup yollarını yazın (boşsa gösterilmez) */
const BEFORE_AFTER = {before:"", after:""};
/* =================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const modal=$("#modal"),chips=$("#chips"),err=$("#err"),pick=$("#pick"),total=$("#total"),dateEl=$("#date");
let time="",design=null;let favs=new Set();try{favs=new Set(JSON.parse(localStorage.getItem("bcFav")||"[]").filter(x=>typeof x==="string").slice(0,20))}catch(_){}
$("#fabMap").href=$("#mapLink").href=MAP_URL;
$$(".js-wa").forEach(a=>a.href=`https://wa.me/${WHATSAPP_NO}`);
const mk=(p,t,fn,cls="chip")=>{const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=t;b.onclick=()=>fn(b);p.appendChild(b);return b};
Object.entries(SERVICES).forEach(([n,p])=>{const b=mk(chips,`${n} · ${p} ₺ · ${MIN[n]} dk`,b=>{b.classList.toggle("on");calc()});b.dataset.n=n});
TIMES.forEach(t=>mk($("#times"),t,b=>{time=t;$$("#times .chip").forEach(c=>c.classList.toggle("on",c===b))}));
dateEl.min=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
const dur=()=>$$("#chips .chip.on").reduce((a,c)=>a+MIN[c.dataset.n],0)+(design?design.m||0:0);
function pastTimes(){const today=dateEl.min,now=new Date(),D=dur();$$("#times .chip").forEach(c=>{const [h,m]=c.textContent.split(":").map(Number);const bad=(dateEl.value===today&&(h*60+m)<=now.getHours()*60+now.getMinutes())||(h*60+m+D>CLOSE);c.disabled=bad;c.style.opacity=bad?.35:"";if(bad&&c.classList.contains("on")){c.classList.remove("on");time=""}})}
dateEl.addEventListener("change",pastTimes);
function calc(){const s=$$("#chips .chip.on").map(c=>c.dataset.n);const t=s.reduce((a,n)=>a+SERVICES[n],0)+(design?design.p:0);
  const D=dur();$("#dur").textContent=D?("Tahmini süre: "+(D>=60?Math.floor(D/60)+" sa ":"")+(D%60?D%60+" dk":"")).trim()+" · kapanış 20:00":"";pastTimes();
  total.textContent=(s.length||design)?`Tahmini başlangıç tutarı: ${t.toLocaleString("tr-TR")} ₺`:""}
function openModal(service,d){
  design=d||null;const fv=favs.size&&!d;pick.classList.toggle("on",!!d||!!fv);pick.textContent=d?`✨ Seçilen tasarım: ${d.n} (${d.p} ₺'den)`:fv?`♡ Beğendiklerin: ${[...favs].join(", ")}`:"";
  if(service)$$("#chips .chip").forEach(c=>{if(c.dataset.n===service)c.classList.add("on")});
  calc();pastTimes();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("lock");
}
const closeModal=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.toggle("lock",$("#links").classList.contains("open"))};
$$(".js-book").forEach(b=>b.onclick=e=>{e.preventDefault();openModal()});
$$(".svc").forEach(b=>b.onclick=()=>openModal(b.dataset.s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* Galeri: filtre + büyütme */
const LBL={bordo:"Bordo",mermer:"Mermer & Taşlı",fransiz:"Fransız",yildiz:"Yıldız Desen"};
(()=>{const figs=$$(".grid figure"),fl=$("#filters");favs=new Set([...favs].filter(n=>figs.some(f=>f.dataset.d===n)));
 let cur="all";const ok=(f,k)=>k==="all"||(k==="fav"?favs.has(f.dataset.d):f.dataset.t.split(" ").includes(k));const apply=()=>figs.forEach(f=>f.classList.toggle("off",!ok(f,cur)));const mkf=(k,t)=>mk(fl,t,b=>{$$("#filters .chip").forEach(c=>c.classList.toggle("on",c===b));cur=k;apply()});
 mkf("all","Tümü").classList.add("on");Object.entries(LBL).forEach(([k,t])=>mkf(k,t));
 const fb=mkf("fav","♡ Favorilerim");const upd=()=>{fb.textContent="♡ Favorilerim"+(favs.size?" ("+favs.size+")":"");figs.forEach(f=>{const h=f.querySelector(".fav"),on=favs.has(f.dataset.d);h.classList.toggle("on",on);h.textContent=on?"♥":"♡"})};
 figs.forEach(f=>{const h=document.createElement("button");h.type="button";h.className="fav";h.setAttribute("aria-label","Favorilere ekle");h.onclick=e=>{e.stopPropagation();favs.has(f.dataset.d)?favs.delete(f.dataset.d):favs.add(f.dataset.d);try{localStorage.setItem("bcFav",JSON.stringify([...favs]))}catch(_){}upd();apply()};f.appendChild(h)});upd();
 const lb=$("#lb"),img=$("#lbImg");let vis=[],li=0;
 const show=k=>{vis=figs.filter(f=>!f.classList.contains("off"));li=(k+vis.length)%vis.length;const f=vis[li];img.src=f.dataset.full;img.alt=f.dataset.d;$("#lbCap").textContent=`${f.dataset.d} · ${f.dataset.p} ₺'den`;lb.classList.add("open");document.body.classList.add("lock")};
 const hide=()=>{lb.classList.remove("open");document.body.classList.remove("lock")};
 figs.forEach(f=>f.onclick=()=>show(figs.filter(x=>!x.classList.contains("off")).indexOf(f)));
 $("#lbX").onclick=hide;lb.onclick=e=>{if(e.target===lb)hide()};$("#lbN").onclick=()=>show(li+1);$("#lbP").onclick=()=>show(li-1);
 $("#lbBook").onclick=()=>{const f=vis[li];hide();openModal(null,{n:f.dataset.d,p:+f.dataset.p,m:120})};
 addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")hide();if(e.key==="ArrowRight")show(li+1);if(e.key==="ArrowLeft")show(li-1)});
 let sx=null;lb.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener("touchend",e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>50)show(li+(d<0?1:-1))},{passive:true})})();
/* Kampanya + isteğe bağlı bölümler */
(()=>{const p=$("#promo");if(CAMPAIGN){p.textContent=CAMPAIGN;p.href="#";p.hidden=false;p.onclick=e=>{e.preventDefault();openModal()}}
 const sec=(cls,id,html,before)=>{const s=document.createElement("section");s.className=cls;if(id)s.id=id;s.innerHTML=html;$(before).before(s)};
 if(BEFORE_AFTER.before&&BEFORE_AFTER.after)sec("ba","","<h2>Önce / <em>Sonra</em></h2><div class='bas' id='bas'><img src='"+esc(BEFORE_AFTER.before)+"' alt='Önce' loading='lazy'><img class='af' src='"+esc(BEFORE_AFTER.after)+"' alt='Sonra' loading='lazy'><i></i><em>Önce</em><em>Sonra</em><input type='range' min='0' max='100' value='50' aria-label='Önce sonra karşılaştırma'></div>","#fiyatlar");
 const bas=$("#bas");if(bas)bas.querySelector("input").oninput=e=>bas.style.setProperty("--p",e.target.value+"%");
 if(REVIEWS.length)sec("reviews","yorumlar","<h2>Müşteri <em>Yorumları</em></h2><div class='rgrid'>"+REVIEWS.map(r=>`<div class="rc"><div class="st">${"★".repeat(Math.min(5,r.s||5))}</div>${esc(r.t)}<b>${esc(r.n)}</b></div>`).join("")+"</div>","#sss");
 const ct=$(".contact>div"),soc=Object.entries(SOCIAL).filter(([,u])=>u);
 if(soc.length){const d=document.createElement("div");d.className="socs";soc.forEach(([n,u])=>{const a=document.createElement("a");a.href=u;a.textContent=n;a.target="_blank";a.rel="noopener noreferrer";d.appendChild(a)});ct.appendChild(d)}
 if(MAP_EMBED){const f=document.createElement("iframe");f.src=MAP_EMBED;f.loading="lazy";f.title="BC Nails konum";f.referrerPolicy="no-referrer-when-downgrade";ct.appendChild(f)}})();
$("#close").onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#send").onclick=()=>{
  const sel=$$("#chips .chip.on").map(c=>c.dataset.n);
  if(!sel.length&&!design)return err.textContent="Lütfen en az bir hizmet seçin.";
  if(!dateEl.value)return err.textContent="Lütfen bir tarih seçin.";
  if(!time)return err.textContent="Lütfen bir saat seçin.";
  err.textContent="";
  const tarih=new Date(dateEl.value+"T00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"});
  const cl=v=>v.replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,200),name=cl($("#name").value),note=cl($("#note").value);
  const msg=`Merhaba, BC Nails'ten randevu almak istiyorum.\n\n`+(name?`*Ad:* ${name}\n`:"")+
   (sel.length?`*Hizmet:* ${sel.join(", ")}\n`:"")+(design?`*Tasarım:* ${design.n}\n`:"")+(favs.size&&!design?`*Beğendiği tasarımlar:* ${[...favs].join(", ")}\n`:"")+
   `*Tarih:* ${tarih}\n*Saat:* ${time}\n`+(dur()?`*Tahmini süre:* ${$("#dur").textContent.split(" · ")[0].replace("Tahmini süre: ","")}\n`:"")+(total.textContent?`*${total.textContent.split(":")[0]}:*${total.textContent.split(":")[1]}\n`:"")+(note?`*Not:* ${note}\n`:"")+`\nUygunsa onaylar mısınız? Teşekkürler.`;
  const url=`https://api.whatsapp.com/send?phone=${WHATSAPP_NO}&text=${encodeURIComponent(msg)}`;
  const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener noreferrer";document.body.appendChild(a);a.click();a.remove();
  closeModal();$$("#chips .chip.on,#times .chip.on").forEach(c=>c.classList.remove("on"));time="";design=null;dateEl.value="";$("#note").value="";
};
const menu=(o)=>{const on=o===undefined?!$("#links").classList.contains("open"):o;$("#links").classList.toggle("open",on);$("#burger").classList.toggle("open",on);document.body.classList.toggle("lock",on||modal.classList.contains("open"))};
$("#burger").onclick=()=>menu();
$$("#links a").forEach(a=>a.addEventListener("click",()=>menu(false)));
$$(".menu-cta").forEach(b=>b.addEventListener("click",()=>menu(false)));
addEventListener("resize",()=>{if(innerWidth>980)menu(false)});
addEventListener("keydown",e=>{if(e.key==="Escape")menu(false)});
let tk=0;addEventListener("scroll",()=>{if(tk)return;tk=requestAnimationFrame(()=>{$("#nav").classList.toggle("solid",scrollY>60);$(".fab").classList.toggle("low",scrollY<40);tk=0})},{passive:true});
/* hafif animasyonlar: IntersectionObserver + GSAP sadece açılışta */
$$(".svc,.grid figure,.how li,.plist>div,.card,details,.contact>div,.g-head").forEach(e=>e.classList.add("rv"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=[...e.target.parentNode.children].indexOf(e.target);e.target.style.transitionDelay=Math.min(i,5)*70+"ms";e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
$$(".rv").forEach(e=>io.observe(e));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$(".links a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}),{threshold:.35});
$$("section[id]").forEach(s=>so.observe(s));
/* Carousel: dokunarak kaydırma */
(()=>{let x=null;const h=$(".hero");h.addEventListener("touchstart",e=>{x=e.touches[0].clientX},{passive:true});h.addEventListener("touchend",e=>{if(x===null)return;const d=e.changedTouches[0].clientX-x;x=null;if(Math.abs(d)>50)$(d<0?"#next":"#prev").click()},{passive:true})})();
/* Carousel */
(()=>{const sl=$$(".slide"),dots=$("#dots"),cap=$("#cap");let i=0,t;
 sl.forEach((_,k)=>{const d=document.createElement("i");d.onclick=()=>{go(k);auto()};dots.appendChild(d)});
 function go(n){sl[i].classList.remove("on");i=(n+sl.length)%sl.length;const s=sl[i];s.loading="eager";s.classList.add("on");cap.textContent=s.dataset.c;[...dots.children].forEach((d,k)=>d.classList.toggle("on",k===i))}
 function auto(){clearInterval(t);if(!matchMedia("(prefers-reduced-motion:reduce)").matches)t=setInterval(()=>go(i+1),5500)}
 $("#next").onclick=()=>{go(i+1);auto()};$("#prev").onclick=()=>{go(i-1);auto()};
 document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(t):auto());
 addEventListener("load",()=>sl.forEach(s=>s.loading="eager"));
 go(0);auto()})();

$(".fab").classList.toggle("low",scrollY<40);

const openWA=t=>{const a=document.createElement("a");a.href=`https://api.whatsapp.com/send?phone=${WHATSAPP_NO}&text=${encodeURIComponent(t)}`;a.target="_blank";a.rel="noopener noreferrer";document.body.appendChild(a);a.click();a.remove()};
/* Tasarım oluşturucu */
(()=>{const box=$("#bctl"),svg=$("#bsvg");if(!box)return;
const SH={Badem:[.14,.5],Kare:[1,.94],Oval:[.34,.55],Stiletto:[0,.34],Koffin:[.62,.55]},CO={Bordo:"#6d1230",Pembe:"#f7a8c4",Nude:"#e6c3b3",Kırmızı:"#c8102e",Beyaz:"#f7f1ec",Siyah:"#1c1517",Lila:"#b9a0d8"};
const FX={"Düz":0,French:100,Ombre:100,"Kedi Gözü":150,Chrome:150,Mermer:150},EX=["Taş","Yıldız","Kalp"],UZ=["Doğal tırnak","Protez tırnak"];
let st={sh:"Badem",co:"Bordo",fx:"Düz",ex:[],pr:true};try{Object.assign(st,JSON.parse(localStorage.getItem("bcBuild")||"{}"))}catch(_){}
if(!Object.hasOwn(SH,st.sh))st.sh="Badem";if(!Object.hasOwn(CO,st.co))st.co="Bordo";if(!Object.hasOwn(FX,st.fx))st.fx="Düz";st.ex=Array.isArray(st.ex)?st.ex.filter(x=>EX.includes(x)):[];st.pr=!!st.pr;
const G=[];const grp=(t,arr,on,set)=>{const d=document.createElement("div"),w=document.createElement("div");d.innerHTML=`<label>${t}</label>`;w.className="chips";d.appendChild(w);arr.forEach(n=>{const sw=!!CO[n],b=mk(w,sw?"":n,()=>{set(n);draw()},sw?"sw":"chip");b.dataset.v=n;if(sw){b.style.background=CO[n];b.setAttribute("aria-label",n)}});box.appendChild(d);G.push([w,on])};
grp("Tırnak şekli",Object.keys(SH),v=>v===st.sh,v=>st.sh=v);grp("Renk",Object.keys(CO),v=>v===st.co,v=>st.co=v);grp("Efekt",Object.keys(FX),v=>v===st.fx,v=>st.fx=v);
grp("Süs (birden fazla seçilebilir)",EX,v=>st.ex.includes(v),v=>st.ex=st.ex.includes(v)?st.ex.filter(x=>x!==v):[...st.ex,v]);grp("Uzatma",UZ,v=>(v===UZ[1])===st.pr,v=>st.pr=v===UZ[1]);
const info=()=>{const p=(st.pr?900:400)+FX[st.fx]+st.ex.length*60,m=(st.pr?120:45)+(st.fx!=="Düz"?15:0)+st.ex.length*10;return{p,m,n:`Özel tasarım: ${[st.sh,st.co,st.fx,...st.ex,st.pr?"Protez":"Doğal"].join(" · ")}`}};
const draw=()=>{const c=CO[st.co],[tw,sf]=SH[st.sh],nude="#f1d9cf";
 let s=`<defs><linearGradient id="go" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="${nude}"/><stop offset="1" stop-color="${c}"/></linearGradient><linearGradient id="gk" x1="0" y1="0" x2="1" y2="0"><stop offset=".25" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset=".75" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="gc" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".7"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient></defs>`;
 [[48,172,-8,62],[102,160,-4,84],[156,156,0,92],[210,160,4,84],[264,172,8,66]].forEach(([x,y,r,H],i)=>{const W=36,q=H*sf,k=tw===0?.12:tw<.2?.5:1,d=`M${-W/2} 0V${-q}Q${-W/2*k} ${-H} ${-tw*W/2} ${-H}H${tw*W/2}Q${W/2*k} ${-H} ${W/2} ${-q}V0Z`,f=st.fx;
  let o=f==="French"?`<path d="M${-W} ${-H*.38}Q0 ${-H*.2} ${W} ${-H*.38}V${-H-2}H${-W}Z" fill="${c}"/>`:f==="Kedi Gözü"?`<rect x="${-W/2}" y="${-H}" width="${W}" height="${H}" fill="url(#gk)" transform="skewX(-14)"/>`:f==="Chrome"?`<rect x="${-W/2}" y="${-H}" width="${W}" height="${H}" fill="url(#gc)"/>`:f==="Mermer"?`<path d="M${-W/2} ${-H*.3}Q0 ${-H*.55} ${W/2} ${-H*.2}M${-W/2} ${-H*.65}Q${W/4} ${-H*.5} ${W/2} ${-H*.8}" stroke="#fff" stroke-opacity=".7" stroke-width="1.6" fill="none"/>`:"";
  if(i%2){if(st.ex.includes("Taş"))o+=`<circle cx="-5" cy="${-H*.16}" r="2.6" fill="#fff" stroke="#cfcfcf" stroke-width=".6"/><circle cx="4" cy="${-H*.24}" r="2" fill="#fff" stroke="#cfcfcf" stroke-width=".6"/>`;if(st.ex.includes("Yıldız"))o+=`<text x="0" y="${-H*.5}" font-size="15" text-anchor="middle" fill="#fff">✦</text>`;if(st.ex.includes("Kalp"))o+=`<text x="0" y="${-H*.32}" font-size="12" text-anchor="middle" fill="#ff8fb1">♥</text>`}
  s+=`<g transform="translate(${x} ${y}) rotate(${r})"><clipPath id="c${i}"><path d="${d}"/></clipPath><path d="${d}" fill="${f==="French"?nude:f==="Ombre"?"url(#go)":c}"/><g clip-path="url(#c${i})">${o}</g><ellipse cx="${-W*.18}" cy="${-H*.35}" rx="2.4" ry="${H*.14}" fill="#fff" opacity=".28"/><path d="${d}" fill="none" stroke="#0003"/></g>`});
 svg.innerHTML=s;G.forEach(([w,on])=>[...w.children].forEach(b=>b.classList.toggle("on",on(b.dataset.v))));
 const I=info();$("#bsum").textContent=`${I.n.replace("Özel tasarım: ","")} — ~${I.p.toLocaleString("tr-TR")} ₺ · ~${I.m>=60?Math.floor(I.m/60)+" sa ":""}${I.m%60?I.m%60+" dk":""}`;try{localStorage.setItem("bcBuild",JSON.stringify(st))}catch(_){}};
$("#bbook").onclick=()=>{const I=info();openModal(null,{n:I.n,p:I.p,m:I.m})};draw()})();
/* Hediye kartı */
(()=>{const w=$("#gAmt");if(!w)return;let a=1000;const bs=[500,1000,1500,2000].map(v=>mk(w,v.toLocaleString("tr-TR")+" ₺",b=>{a=v;bs.forEach(x=>x.classList.toggle("on",x===b))}));bs[1].classList.add("on");
$("#gSend").onclick=()=>{const n=$("#gName").value.replace(/[\u0000-\u001f\u007f]/g," ").trim().slice(0,60);openWA(`Merhaba, BC Nails için ${a.toLocaleString("tr-TR")} ₺ değerinde hediye kartı almak istiyorum.`+(n?`\n*Kime:* ${n}`:"")+`\nDetayları paylaşır mısınız?`)}})();
