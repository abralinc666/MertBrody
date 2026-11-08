/* ===== AYARLAR ===== */
const WHATSAPP_NO = "905375264464";
const MAP_URL = "https://maps.app.goo.gl/pefyjLuXcUvEDgaU8";
const SERVICES = {"Protez Tırnak":900,"Kalıcı Oje":400,"NailArt Tasarım":50,"Manikür":350,"Pedikür":450,"Spa Bakım":600,"Söküm":200};
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
/* Kampanya şeridi: boş bırakırsanız gizlenir */
const CAMPAIGN = "Yeni sezon tasarımlar geldi — randevunuzu şimdi oluşturun →";
/* Sosyal medya linkleri: boş olanlar gösterilmez */
const SOCIAL = {Instagram:"", TikTok:"", YouTube:""};
/* Google Maps > Paylaş > Harita yerleştir > iframe içindeki src adresini yapıştırın (boşsa gösterilmez) */
const MAP_EMBED = "";
/* Gerçek müşteri yorumları: {n:"Ad S.", t:"Yorum metni", s:5} (boşsa bölüm gösterilmez) */
const REVIEWS = [];
/* Önce/Sonra: img klasörüne iki fotoğraf koyup yollarını yazın (boşsa gösterilmez) */
const BEFORE_AFTER = {before:"", after:""};
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
function pastTimes(){const today=dateEl.min,now=new Date();$$("#times .chip").forEach(c=>{const [h,m]=c.textContent.split(":").map(Number);const past=dateEl.value===today&&(h*60+m)<=now.getHours()*60+now.getMinutes();c.disabled=past;c.style.opacity=past?.35:"";if(past&&c.classList.contains("on")){c.classList.remove("on");time=""}})}
dateEl.addEventListener("change",pastTimes);
function calc(){const s=$$("#chips .chip.on").map(c=>c.dataset.n);const t=s.reduce((a,n)=>a+SERVICES[n],0)+(design?design.p:0);
  total.textContent=(s.length||design)?`Tahmini başlangıç tutarı: ${t.toLocaleString("tr-TR")} ₺`:""}
function openModal(service,d){
  design=d||null;pick.classList.toggle("on",!!d);pick.textContent=d?`✨ Seçilen tasarım: ${d.n} (${d.p} ₺'den)`:"";
  if(service)$$("#chips .chip").forEach(c=>{if(c.dataset.n===service)c.classList.add("on")});
  calc();pastTimes();modal.classList.add("open");modal.setAttribute("aria-hidden","false");document.body.classList.add("lock");
  if(window.gsap)gsap.fromTo(".sheet",{y:30,opacity:0},{y:0,opacity:1,duration:.35,ease:"power2.out"});
}
const closeModal=()=>{modal.classList.remove("open");modal.setAttribute("aria-hidden","true");document.body.classList.toggle("lock",$("#links").classList.contains("open"))};
$$(".js-book").forEach(b=>b.onclick=e=>{e.preventDefault();openModal()});
$$(".svc").forEach(b=>b.onclick=()=>openModal(b.dataset.s));
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
/* Galeri: filtre + büyütme */
const LBL={bordo:"Bordo",mermer:"Mermer & Taşlı",fransiz:"Fransız",yildiz:"Yıldız Desen"};
(()=>{const figs=$$(".grid figure"),fl=$("#filters");
 const mkf=(k,t)=>mk(fl,t,b=>{$$("#filters .chip").forEach(c=>c.classList.toggle("on",c===b));figs.forEach(f=>f.classList.toggle("off",k!=="all"&&!f.dataset.t.split(" ").includes(k)))});
 mkf("all","Tümü").classList.add("on");Object.entries(LBL).forEach(([k,t])=>mkf(k,t));
 const lb=$("#lb"),img=$("#lbImg");let vis=[],li=0;
 const show=k=>{vis=figs.filter(f=>!f.classList.contains("off"));li=(k+vis.length)%vis.length;const f=vis[li];img.src=f.dataset.full;img.alt=f.dataset.d;$("#lbCap").textContent=`${f.dataset.d} · ${f.dataset.p} ₺'den`;lb.classList.add("open");document.body.classList.add("lock")};
 const hide=()=>{lb.classList.remove("open");document.body.classList.remove("lock")};
 figs.forEach(f=>f.onclick=()=>show(figs.filter(x=>!x.classList.contains("off")).indexOf(f)));
 $("#lbX").onclick=hide;lb.onclick=e=>{if(e.target===lb)hide()};$("#lbN").onclick=()=>show(li+1);$("#lbP").onclick=()=>show(li-1);
 $("#lbBook").onclick=()=>{const f=vis[li];hide();openModal(null,{n:f.dataset.d,p:+f.dataset.p})};
 addEventListener("keydown",e=>{if(!lb.classList.contains("open"))return;if(e.key==="Escape")hide();if(e.key==="ArrowRight")show(li+1);if(e.key==="ArrowLeft")show(li-1)});
 let sx=null;lb.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});lb.addEventListener("touchend",e=>{if(sx===null)return;const d=e.changedTouches[0].clientX-sx;sx=null;if(Math.abs(d)>50)show(li+(d<0?1:-1))},{passive:true})})();
/* Kampanya + isteğe bağlı bölümler */
(()=>{const p=$("#promo");if(CAMPAIGN){p.textContent=CAMPAIGN;p.href="#";p.hidden=false;p.onclick=e=>{e.preventDefault();openModal()}}
 const sec=(cls,id,html,before)=>{const s=document.createElement("section");s.className=cls;if(id)s.id=id;s.innerHTML=html;$(before).before(s)};
 if(BEFORE_AFTER.before&&BEFORE_AFTER.after)sec("ba","","<h2>Önce / <em>Sonra</em></h2><div class='bas' id='bas'><img src='"+esc(BEFORE_AFTER.before)+"' alt='Önce' loading='lazy'><img class='af' src='"+esc(BEFORE_AFTER.after)+"' alt='Sonra' loading='lazy'><i></i><em>Önce</em><em>Sonra</em><input type='range' min='0' max='100' value='50' aria-label='Önce sonra karşılaştırma'></div>","#fiyatlar");
 const bas=$("#bas");if(bas)bas.querySelector("input").oninput=e=>bas.style.setProperty("--p",e.target.value+"%");
 if(REVIEWS.length)sec("reviews","yorumlar","<h2>Müşteri <em>Yorumları</em></h2><div class='rgrid'>"+REVIEWS.map(r=>`<div class="rc"><div class="st">${"★".repeat(Math.min(5,r.s||5))}</div>${esc(r.t)}<b>${esc(r.n)}</b></div>`).join("")+"</div>","#sss");
 const ct=$(".contact>div"),soc=Object.entries(SOCIAL).filter(([,u])=>u);
 if(soc.length){const d=document.createElement("div");d.className="socs";soc.forEach(([n,u])=>{const a=document.createElement("a");a.href=u;a.textContent=n;a.target="_blank";a.rel="noopener";d.appendChild(a)});ct.appendChild(d)}
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
  const name=$("#name").value.trim(),note=$("#note").value.trim();
  const msg=`Merhaba, BC Nails'ten randevu almak istiyorum.\n\n`+(name?`*Ad:* ${name}\n`:"")+
   (sel.length?`*Hizmet:* ${sel.join(", ")}\n`:"")+(design?`*Tasarım:* ${design.n}\n`:"")+
   `*Tarih:* ${tarih}\n*Saat:* ${time}\n`+(total.textContent?`*${total.textContent.split(":")[0]}:*${total.textContent.split(":")[1]}\n`:"")+(note?`*Not:* ${note}\n`:"")+`\nUygunsa onaylar mısınız? Teşekkürler.`;
  const url=`https://api.whatsapp.com/send?phone=${WHATSAPP_NO}&text=${encodeURIComponent(msg)}`;
  const a=document.createElement("a");a.href=url;a.target="_blank";a.rel="noopener";document.body.appendChild(a);a.click();a.remove();
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
addEventListener("load",()=>{if(!window.gsap||matchMedia("(prefers-reduced-motion:reduce)").matches)return;gsap.from([".eyebrow","h1",".lead",".cta",".stats"],{y:30,opacity:0,duration:.7,stagger:.12,ease:"power3.out",clearProps:"all"})});
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
