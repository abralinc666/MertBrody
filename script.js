/* ===== AYARLAR ===== */
const WHATSAPP_NO = "905375264464";
const MAP_URL = "https://maps.app.goo.gl/pefyjLuXcUvEDgaU8";
const SERVICES = {"Protez Tırnak":900,"Kalıcı Oje":400,"NailArt Tasarım":50,"Manikür":350,"Pedikür":450,"Spa Bakım":600,"Söküm":200};
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
/* =================== */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const modal=$("#modal"),chips=$("#chips"),err=$("#err"),pick=$("#pick"),total=$("#total"),dateEl=$("#date");
let time="",design=null;
$("#fabMap").href=$("#mapLink").href=MAP_URL;
$$(".js-wa").forEach(a=>a.href=`https://wa.me/${WHATSAPP_NO}`);
const mk=(p,t,fn,cls="chip")=>{const b=document.createElement("button");b.type="button";b.className=cls;b.textContent=t;b.onclick=()=>fn(b);p.appendChild(b);return b};
Object.entries(SERVICES).forEach(([n,p])=>{const b=mk(chips,`${n} · ${p} ₺`,b=>{b.classList.toggle("on");calc()});b.dataset.n=n});
TIMES.forEach(t=>mk($("#times"),t,b=>{time=t;$$("#times .chip").forEach(c=>c.classList.toggle("on",c===b))}));
dateEl.min=new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);
function calc(){const s=$$("#chips .chip.on").map(c=>c.dataset.n);const t=s.reduce((a,n)=>a+SERVICES[n],0)+(design?design.p:0);
  total.textContent=(s.length||design)?`Tahmini başlangıç tutarı: ${t.toLocaleString("tr-TR")} ₺`:""}
function openModal(service,d){
  design=d||null;pick.classList.toggle("on",!!d);pick.textContent=d?`✨ Seçilen tasarım: ${d.n} (${d.p} ₺'den)`:"";
  if(service)$$("#chips .chip").forEach(c=>{if(c.dataset.n===service)c.classList.add("on")});
  calc();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
  if(window.gsap)gsap.fromTo(".sheet",{y:30,opacity:0},{y:0,opacity:1,duration:.35,ease:"power2.out"});
}
const closeModal=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.style.overflow=""};
$$(".js-book").forEach(b=>b.onclick=e=>{e.preventDefault();openModal()});
$$(".svc").forEach(b=>b.onclick=()=>openModal(b.dataset.s));
$$(".grid figure").forEach(f=>f.onclick=()=>openModal(null,{n:f.dataset.d,p:+f.dataset.p}));
$("#close").onclick=closeModal;modal.onclick=e=>{if(e.target===modal)closeModal()};
addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});
$("#send").onclick=()=>{
  const sel=$$("#chips .chip.on").map(c=>c.dataset.n);
  if(!sel.length&&!design)return err.textContent="Lütfen en az bir hizmet seçin.";
  if(!dateEl.value)return err.textContent="Lütfen bir tarih seçin.";
  if(!time)return err.textContent="Lütfen bir saat seçin.";
  err.textContent="";
  const tarih=new Date(dateEl.value+"T00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"});
  const name=$("#name").value.trim(),note=$("#note").value.trim();
  const msg=`Merhaba, BC Nails'ten randevu almak istiyorum.\n\n`+(name?`*Ad:* ${name}\n`:"")+
   (sel.length?`*Hizmet:* ${sel.join(", ")}\n`:"")+(design?`*Tasarım:* ${design.n}\n`:"")+
   `*Tarih:* ${tarih}\n*Saat:* ${time}\n`+(total.textContent?`*${total.textContent.split(":")[0]}:*${total.textContent.split(":")[1]}\n`:"")+(note?`*Not:* ${note}\n`:"")+`\nUygunsa onaylar mısınız? Teşekkürler.`;
  const url=`https://api.whatsapp.com/send?phone=${WHATSAPP_NO}&text=${encodeURIComponent(msg)}`;
  if(!window.open(url,"_blank"))location.href=url;closeModal();
};
$("#burger").onclick=()=>{$("#links").classList.toggle("open");$("#burger").classList.toggle("open")};
$$("#links a").forEach(a=>a.onclick=()=>{$("#links").classList.remove("open");$("#burger").classList.remove("open")});
let tk=0;addEventListener("scroll",()=>{if(tk)return;tk=requestAnimationFrame(()=>{$("#nav").classList.toggle("solid",scrollY>60);tk=0})},{passive:true});
/* hafif animasyonlar: IntersectionObserver + GSAP sadece açılışta */
$$(".svc,.grid figure,.how li,.plist>div,.card,details,.contact>div,.g-head").forEach(e=>e.classList.add("rv"));
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const i=[...e.target.parentNode.children].indexOf(e.target);e.target.style.transitionDelay=Math.min(i,5)*70+"ms";e.target.classList.add("in");io.unobserve(e.target)}}),{rootMargin:"0px 0px -8% 0px"});
$$(".rv").forEach(e=>io.observe(e));
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$(".links a").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))}),{threshold:.35});
$$("section[id]").forEach(s=>so.observe(s));
addEventListener("load",()=>{if(!window.gsap)return;gsap.from([".eyebrow","h1",".lead",".cta",".stats"],{y:30,opacity:0,duration:.7,stagger:.12,ease:"power3.out"});gsap.from(".nav",{y:-50,opacity:0,duration:.6})});

/* Carousel */
(()=>{const sl=$$(".slide"),dots=$("#dots"),cap=$("#cap");let i=0,t;
 sl.forEach((_,k)=>{const d=document.createElement("i");d.onclick=()=>{go(k);auto()};dots.appendChild(d)});
 function go(n){sl[i].classList.remove("on");i=(n+sl.length)%sl.length;const s=sl[i];if(s.loading==="lazy")s.loading="eager";s.classList.add("on");cap.textContent=s.dataset.c;[...dots.children].forEach((d,k)=>d.classList.toggle("on",k===i))}
 function auto(){clearInterval(t);if(!matchMedia("(prefers-reduced-motion:reduce)").matches)t=setInterval(()=>go(i+1),5500)}
 $("#next").onclick=()=>{go(i+1);auto()};$("#prev").onclick=()=>{go(i-1);auto()};
 document.addEventListener("visibilitychange",()=>document.hidden?clearInterval(t):auto());
 addEventListener("load",()=>sl.forEach(s=>s.loading="eager"));
 go(0);auto()})();
