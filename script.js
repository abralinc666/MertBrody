/* ===== AYARLAR — burayı kendinize göre düzenleyin ===== */
const WHATSAPP_NO = "905XXXXXXXXX";   // Ülke kodu ile, başında + ve boşluk olmadan (örn: 905321234567)
const MAP_URL = "https://www.google.com/maps/search/?api=1&query=BC+Nails"; // Google Maps dükkan linkinizi buraya yapıştırın
const SERVICES = ["Protez Tırnak","Kalıcı Oje","NailArt Tasarım","Manikür & Pedikür","Spa Bakım"];
const TIMES = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"];
/* ======================================================= */
const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
const modal = $("#modal"), chips = $("#chips"), times = $("#times"), err = $("#err");
let time = "";

$("#fabMap").href = MAP_URL;
$$(".js-wa").forEach(a => a.href = `https://wa.me/${WHATSAPP_NO}`);

SERVICES.forEach(s => { const b = document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=s; b.onclick=()=>b.classList.toggle("on"); chips.appendChild(b); });
TIMES.forEach(t => { const b = document.createElement("button"); b.type="button"; b.className="chip"; b.textContent=t; b.onclick=()=>{ time=t; $$("#times .chip").forEach(c=>c.classList.toggle("on",c===b)); }; times.appendChild(b); });

const d = $("#date"); d.min = new Date(Date.now()-new Date().getTimezoneOffset()*6e4).toISOString().slice(0,10);

function openModal(service){
  if(service) $$("#chips .chip").forEach(c=>{ if(c.textContent===service) c.classList.add("on"); });
  modal.classList.add("open"); modal.setAttribute("aria-hidden","false"); document.body.style.overflow="hidden";
  gsap.fromTo(".sheet",{y:40,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:.45,ease:"back.out(1.4)"});
}
function closeModal(){ modal.classList.remove("open"); modal.setAttribute("aria-hidden","true"); document.body.style.overflow=""; }
$$(".js-book").forEach(b => b.addEventListener("click", e => { e.preventDefault(); openModal(); }));
$$(".svc").forEach(b => b.addEventListener("click", () => openModal(b.dataset.s)));
$("#close").onclick = closeModal;
modal.addEventListener("click", e => { if(e.target===modal) closeModal(); });
addEventListener("keydown", e => { if(e.key==="Escape") closeModal(); });

$("#send").onclick = () => {
  const sel = $$("#chips .chip.on").map(c=>c.textContent);
  if(!sel.length) return err.textContent = "Lütfen en az bir hizmet seçin.";
  if(!d.value) return err.textContent = "Lütfen bir tarih seçin.";
  if(!time) return err.textContent = "Lütfen bir saat seçin.";
  err.textContent = "";
  const tarih = new Date(d.value+"T00:00").toLocaleDateString("tr-TR",{day:"numeric",month:"long",year:"numeric",weekday:"long"});
  const name = $("#name").value.trim(), note = $("#note").value.trim();
  const msg = `Merhaba, BC Nails'ten randevu almak istiyorum.\n\n` +
    (name?`👤 Ad: ${name}\n`:"") + `💅 Hizmet: ${sel.join(", ")}\n📅 Tarih: ${tarih}\n⏰ Saat: ${time}\n` +
    (note?`📝 Not: ${note}\n`:"") + `\nUygunsa onaylar mısınız? Teşekkürler 🌸`;
  window.open(`https://wa.me/${WHATSAPP_NO}?text=${encodeURIComponent(msg)}`, "_blank");
  closeModal();
};

/* menü */
$("#burger").onclick = () => $("#links").classList.toggle("open");
$$("#links a").forEach(a => a.onclick = () => $("#links").classList.remove("open"));
addEventListener("scroll", () => $("#nav").classList.toggle("solid", scrollY>60), {passive:true});

/* GSAP animasyonları */
gsap.registerPlugin(ScrollTrigger);
const tl = gsap.timeline({defaults:{ease:"power3.out"}});
tl.from(".nav",{y:-60,opacity:0,duration:.7})
  .from(".hero-img",{scale:1.12,duration:1.8,ease:"power2.out"},0)
  .from(".eyebrow",{x:-30,opacity:0,duration:.6},.3)
  .from(".hero h1",{y:50,opacity:0,duration:.9},.45)
  .from(".lead",{y:30,opacity:0,duration:.7},.8)
  .from(".cta .btn",{y:30,opacity:0,stagger:.12,duration:.6},1)
  .from(".neon",{scale:0,rotate:-30,opacity:0,duration:.8,ease:"back.out(2)"},1.1);
gsap.to(".neon",{scale:1.08,repeat:-1,yoyo:true,duration:1.2,ease:"sine.inOut"});
gsap.to(".hero-img",{yPercent:12,ease:"none",scrollTrigger:{trigger:".hero",scrub:true,start:"top top",end:"bottom top"}});
gsap.from(".services",{y:60,opacity:0,duration:.9,scrollTrigger:{trigger:".services",start:"top 90%"}});
gsap.from(".svc",{y:30,opacity:0,stagger:.1,duration:.6,scrollTrigger:{trigger:".services",start:"top 85%"}});
gsap.from(".g-head",{y:30,opacity:0,duration:.7,scrollTrigger:{trigger:".gallery",start:"top 85%"}});
gsap.from(".grid img",{y:60,opacity:0,scale:.92,stagger:.12,duration:.8,ease:"power3.out",scrollTrigger:{trigger:".grid",start:"top 85%"}});
gsap.from(".card",{y:50,opacity:0,stagger:.2,duration:.8,scrollTrigger:{trigger:".cards",start:"top 85%"}});
gsap.from("footer > *",{y:20,opacity:0,stagger:.1,duration:.6,scrollTrigger:{trigger:"footer",start:"top 95%"}});
$$(".nav .links a").forEach(a=>{const t=$(a.getAttribute("href"));ScrollTrigger.create({trigger:t,start:"top 50%",end:"bottom 50%",onToggle:s=>s.isActive&&($$(".links a").forEach(x=>x.classList.remove("active")),a.classList.add("active"))});});
