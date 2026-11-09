(()=>{
const cfg=window.LOVELYTG_CONFIG,$=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
const money=n=>new Intl.NumberFormat("tr-TR").format(n)+" "+cfg.currency;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const ST={live:["Kullanımda","live"],dev:["Geliştiriliyor",""],plan:["Planlı","dev"]};
const MODS=[
["Yapay zekâ merkezi","dev","Uygulamayı yöneten asistan. İşi hazırlar, önizleme gösterir, gönderim gibi önemli adımlarda onay ister.",["Zamanlama komutları","Grup hareketi analizi","Yanıtlanmamış mesajları bulma","Cevap taslakları","Hata inceleme ve çözüm önerisi","Kendi API anahtarınla çalışır"]],
["Otomasyon stüdyosu","dev","Günlük ve haftalık görevleri hedef, saat ve kurallarla kur. Görsel akış oluşturucu kod yazmadan çalışacak.",["Günlük, haftalık, özel takvim","Birden fazla tetikleyici","Koşullu işlemler","Kopyalama ve şablonlar","Hatada durdur ve bildir","Otomasyon başına geçmiş"],"automation","Otomasyon merkezi: yeni otomasyon formu ve kayıtlı otomasyonlar"],
["Hesap merkezi","live","Kayıtlı hesaplar arasında tek tıkla geçiş. Her hesabın oturumu ve veritabanı ayrı tutulur.",["Telefon kodu ve iki adımlı doğrulama","Hesap bazlı oturum durumu","Oturum yedekleme ve geri yükleme","Hesaba özel limitler","Etiket ve gruplar","Hızlı geçiş"]],
["Akıllı gelen kutusu","live","Özel sohbetleri tek yerde topla, filtrele ve yanıtla. Cevap önerileri taslak olarak gelir.",["Okunmadı ve yanıt bekliyor filtreleri","Yerel cevap önerileri","Ortak grup analizi","Kişi etiketleri","Konuşma notları","Mesaj arşivi"],"messages","Mesajlar ekranı: sohbet, yanıt önerisi ve zamanlama"],
["Analitik","live","7, 30 ve 90 günlük etkinliği oku. Hacim, aktif sohbetler ve sık geçen kelimeler elinin altında.",["Gelen ve giden karşılaştırması","En aktif sohbetler","Anahtar kelime takibi","CSV raporları ve üye listeleri","Sohbet ve profil dışa aktarımı","Haftalık otomatik rapor, yolda"],"analytics","Grup analizi: toplam mesaj, en aktif sohbetler ve öne çıkan konular"],
["Güvenlik merkezi","live","Telegram oturumlarını ve cihazları gör, istemediğini sonlandır. Panel girişi ve şifreli yedek koruma ekler.",["Aktif oturum listesi","Oturum sonlandırma","Panel girişi","Yedekleme ve geri yükleme","Tüm otomasyonları duraklat","Gönderim kotaları"]],
["İçerik stüdyosu","plan","Mesajları tek yerde hazırla, önizle ve takvime yerleştir.",["Şablonlar ve değişkenler","AI ile metin iyileştirme","Medya arşivi","Taslak ve onay bekleyenler","Yayın takvimi","İçerik performansı"]],
["Olay merkezi","live","Sistemde olan her şeyi tek akışta izle. Hata aldığında nedenini ve ne yapacağını gör.",["İşlem kayıtları","Otomasyon, soru ve hata olayları","Filtrelenebilir loglar","Bildirimler","Teslimat inceleme ekranı","Mobil uyumlu PWA"]]];
const tabs=$("#tabs"),pane=$("#pane");
tabs.innerHTML=MODS.map((m,i)=>`<button role="tab" id="t${i}" aria-selected="${i==0}" aria-controls="pane" tabindex="${i?-1:0}">${m[0]}<span class="tag ${ST[m[1]][1]}">${ST[m[1]][0]}</span></button>`).join("");
function show(i){const m=MODS[i];$$("[role=tab]",tabs).forEach((b,j)=>{b.setAttribute("aria-selected",j==i);b.tabIndex=j==i?0:-1});
pane.setAttribute("aria-labelledby","t"+i);pane.innerHTML=`<span class="tag ${ST[m[1]][1]}">${ST[m[1]][0]}</span><h3>${m[0]}</h3><p>${m[2]}</p><ul>${m[3].map(x=>`<li>${x}</li>`).join("")}</ul>${m[4]?`<figure><div class="frame sm"><img src="assets/${m[4]}.webp" width="1440" height="941" alt="${m[5]}" loading="lazy"></div><figcaption>Örnek verilerle v4.9 arayüzü.</figcaption></figure>`:""}`}
show(0);
tabs.addEventListener("click",e=>{const b=e.target.closest("[role=tab]");if(b)show($$("[role=tab]",tabs).indexOf(b))});
tabs.addEventListener("keydown",e=>{const t=$$("[role=tab]",tabs),i=t.indexOf(document.activeElement),k=e.key;
const n=k=="ArrowDown"||k=="ArrowRight"?(i+1)%t.length:k=="ArrowUp"||k=="ArrowLeft"?(i-1+t.length)%t.length:-1;if(n>=0){e.preventDefault();t[n].focus();show(n)}});

const ROAD=[["Altyapı sağlamlaştırma","app.py modüllere ayrılıyor: otomasyon, Telegram katmanı, AI, güvenlik.","dev"],["Dashboard ve mobil arayüz","PWA olarak telefondan kullanılıyor, yeni tasarım hazırlanıyor.","dev"],["Çoklu hesap merkezi","Kayıtlı hesaplar, ayrı oturumlar ve hızlı geçiş.","live"],["Görsel otomasyon stüdyosu","Kod yazmadan akış kurma.","plan"],["AI komuta merkezi","Sohbet, analiz ve taslak uçları var; komuta arayüzü geliştiriliyor.","dev"],["Akıllı gelen kutusu","Özel sohbet gelen kutusu ve cevap önerileri.","live"],["Analitik laboratuvarı","7, 30, 90 günlük analiz ve CSV raporlar.","live"],["Eklenti sistemi","Modülleri açıp kapatma ve entegrasyonlar.","plan"]];
$("#roadBody").innerHTML=ROAD.map(r=>`<tr><td>${r[0]}<small>${r[1]}</small></td><td><span class="tag ${ST[r[2]][1]}">${ST[r[2]][0]}</span></td></tr>`).join("");

/* Duraklatma örneği */
const kill=$("#kill"),kb=$("#killBtn");let off=false;
kb.onclick=()=>{off=!off;kill.classList.toggle("off",off);kb.textContent=off?"Hepsini sürdür":"Tümünü duraklat";$$("#killList em").forEach(x=>x.textContent=off?"Duraklatıldı":"Çalışıyor")};

/* Lisans ve sipariş */
let period="monthly";
const label={yearly:"Yıllık lisans ücreti",weekly:"7 günlük lisans ücreti",monthly:"Aylık lisans ücreti"};
function renderPlans(){$("#plans").innerHTML=cfg.plans.map(p=>`<article class="plan ${p.featured?"featured":""}">${p.featured?'<span class="popular">En çok tercih edilen</span>':""}<h3>${esc(p.name)}</h3><p class="plan-desc">${esc(p.description)}</p><div class="price">${money(p.prices[period])}<small> ${cfg.periods[period].suffix}</small></div><p class="price-note">${label[period]}</p><ul>${p.features.map(f=>`<li>${esc(f)}</li>`).join("")}</ul><button class="btn" data-plan="${p.id}">${esc(p.name)} seç</button></article>`).join("");
const sel=$("#orderPlan"),prev=sel.value;sel.innerHTML=cfg.plans.map(p=>`<option value="${p.id}">${esc(p.name)}: ${money(p.prices[period])} / ${cfg.periods[period].label}</option>`).join("");if(cfg.plans.some(p=>p.id===prev))sel.value=prev}
renderPlans();
$$(".switch button").forEach(b=>b.onclick=()=>{period=b.dataset.period;$$(".switch button").forEach(x=>x.classList.toggle("active",x===b));renderPlans()});
$("#plans").onclick=e=>{const b=e.target.closest("[data-plan]");if(!b)return;$("#orderPlan").value=b.dataset.plan;$("#siparis").scrollIntoView({behavior:reduce?"auto":"smooth"})};
$("#bankName").textContent=cfg.bank.name;$("#ibanValue").textContent=cfg.bank.iban;$("#cryptoNetwork").textContent=cfg.crypto.network;$("#walletValue").textContent=cfg.crypto.wallet;
$$(".pay-tabs button").forEach(b=>b.onclick=()=>{const c=b.dataset.method=="crypto";$$(".pay-tabs button").forEach(x=>x.classList.toggle("active",x===b));$("#ibanPanel").hidden=c;$("#cryptoPanel").hidden=!c});
function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove("show"),2200)}
$$("[data-copy]").forEach(b=>b.onclick=async()=>{try{await navigator.clipboard.writeText(b.dataset.copy=="iban"?cfg.bank.iban:cfg.crypto.wallet);toast("Panoya kopyalandı.")}catch{toast("Kopyalanamadı. Metni seçip kopyala.")}});
$("#orderForm").onsubmit=e=>{e.preventDefault();const d=new FormData(e.currentTarget),p=cfg.plans.find(x=>x.id===d.get("plan"));
const t=["LOVELYTG LİSANS TALEBİ","İsim: "+d.get("customer"),"İletişim: "+d.get("contact"),"Paket: "+p.name,"Süre: "+cfg.periods[period].label,"Tutar: "+money(p.prices[period]),"Ödeme: "+d.get("method"),"Not: "+(d.get("note")||"-")].join("\n");
const r=$("#formResult");r.hidden=false;r.textContent=t;navigator.clipboard?.writeText(t).then(()=>toast("Talep metni kopyalandı.")).catch(()=>{})};
$("#year").textContent=new Date().getFullYear();
const mt=$("#menuToggle"),nav=$("#nav");mt.onclick=()=>mt.setAttribute("aria-expanded",nav.classList.toggle("open"));
$$("#nav a").forEach(a=>a.onclick=()=>{nav.classList.remove("open");mt.setAttribute("aria-expanded","false")});
})();

// BrodySOFT iletişim kopyalama
document.querySelectorAll("[data-copy-text]").forEach(button=>button.addEventListener("click",async()=>{
 try{await navigator.clipboard.writeText(button.dataset.copyText);const t=document.querySelector("#toast");t.textContent="Kullanıcı adı kopyalandı.";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
 catch{const t=document.querySelector("#toast");t.textContent="Kopyalama desteklenmiyor.";t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
}));
