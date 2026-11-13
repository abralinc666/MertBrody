/* LovelyTG tanıtım sitesi — özellik modülleri, yenilikler, ekran görüntüleri, lisans seçimi, mobil menü */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Mobil menü ---------- */
  var burger = $("burger"), menu = $("menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    document.body.classList.toggle("nav-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    burger.textContent = open ? "✕" : "☰";
  }
  burger.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });
  document.addEventListener("click", function (e) { if (menu.classList.contains("open") && !e.target.closest("header")) setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* Aktif menü vurgusu */
  var navLinks = menu.querySelectorAll('a[href^="#"]');
  var sections = [];
  navLinks.forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    var el = document.getElementById(id);
    if (el) sections.push({ id: id, el: el, a: a });
  });
  function markNav() {
    var y = window.scrollY + 100, curId = sections.length ? sections[0].id : "";
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].el.offsetTop <= y) curId = sections[i].id;
    }
    navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + curId); });
  }
  window.addEventListener("scroll", markNav, { passive: true });
  markNav();

  /* ---------- Özellik modülleri ---------- */
  var D = [
    { i: "🧠", t: "Yapay Zekâ Komuta Merkezi", s: "Sohbet kutusu değil, uygulamayı yöneten bir asistan.",
      l: ["Doğal dille görev planlama: “Yarın 09.00’da seçtiğim gruplara günaydın mesajı planla”", "Yanıt şablonları: sık kullandığınız metinleri kaydedip Chat6 bestecisine tek tıkla yapıştırma", "Son 7 gündeki grup hareketlerini analiz etme", "Yanıtlanmamış mesajları bulma", "Haftanın en aktif gruplarını gösterme", "Gelen mesajlara göre cevap taslakları oluşturma", "Son işlemlerdeki hataları inceleyip çözüm önerme", "Asistanın yaptığı her okuma ve yazma işlemi denetim kaydına yazılır", "Asistanın oluşturduğu otomasyonu tek tıkla geri alma", "İstediğiniz sohbet için AI erişimini kapatma"],
      n: "<b>Önce hazırlar, sonra sorar.</b> Yapay zekâ işlemi hazırlar, önizleme sunar ve gönderim gibi önemli eylemler için onayınızı alır. Dış AI servisine giden metinlerde e-posta ve telefon numaraları maskelenir." },
    { i: "🔀", t: "Otomasyon Stüdyosu", s: "Zamanlı mesajlar, paylaşım planları ve hikâyeler tek yerde.", isNew: true,
      l: ["Günlük, haftalık ve özel takvimle zamanlı mesaj", "7 günlük otomasyon takvimi: planlayıcı üstünde haftalık grid", "Zamanlanmış mesaj panosu: Telethon’daki bekleyen mesajları listele ve iptal et", "Aynı mesaja birden fazla varyant", "Gönderimden önce hedef ve yazma izni kontrolü", "Medya paylaşım planı (görsel/video kampanyaları)", "Hikâye ve kanal paylaşımı akışları", "Akıllı zamanlama önerileri", "“Çalışan otomasyonlar” listesinde zamanlı mesaj, tepki kuralı ve kuyruk birlikte", "Tüm otomasyonları tek hamlede duraklatma"],
      f: ["Her sabah 09.00", "Seçilen grupları kontrol et", "Hedef ve yazma izni kontrolü", "AI mesaj taslağı hazırla", "Onayla ve planla"] },
    { i: "🎙", t: "Ses Merkezi", s: "Mesaja uygun sesi bulur; siz onaylamadan hiçbir şey gönderilmez.",
      l: ["Sesler/ klasöründeki .ogg, .mp3 ve diğer sesleri tarama", "Alt klasörden kategori; etiketleme, arama, önizleme, düzenleme", "Mesaja en uygun sesi öneren eşleştirme motoru (yerel puanlama, isteğe bağlı AI)", "Yanıt hafızası: aynı mesaj tekrar analiz edilmez, JSON veya Markdown olarak dışa aktarılır", "Hesap başına kişilik profili: ton, hitap ve yanıt uzunluğu", "Onaylı gönderim kuyruğu: zamanlama, durum takibi, başarısız işlemleri yönetme", "Mesaj analizi: konu, niyet, duygu ve aciliyet", "Simülasyon modu: gerçek mesaj göndermeden eşleşmeyi ve akışı test edin"],
      n: "<b>Önce onay, sonra gönderim.</b> Kuyruktaki öğe onaylanana kadar bekler. FloodWait gelirse kuyruk durur ve bekleme bitince kaldığı yerden sürer. Sonucu belirsiz kalan gönderim kendiliğinden tekrar edilmez." },
    { i: "😊", t: "Akıllı Tepkiler", s: "Yorumlara ve grup mesajlarına, mesajın anlamına uygun emoji tepkisi.",
      l: ["Kanal yorumlarına ve normal gruplara tepki kuralı", "Emoji, mesajın duygusuna göre seçilir: olumlu 👍/🔥, teşekkür 🙏, kutlama 🎉, şaka 😁", "Olumsuz mesaja asla tepki verilmez", "Aynı mesaj her zaman aynı emojiyi alır; sıra ya da rastgelelik yok", "İsterseniz eski “sırayla” modu", "Kural başına minimum aralık ve saatlik sınır", "Tepkiden önce yazma izni kontrolü", "Günlük en fazla 300 tepki"],
      n: "Gruplarda kullanılabilecek tepkiler grubun ayarına bağlıdır; grup bir emojiye izin vermiyorsa o tepki atlanır." },
    { i: "📊", t: "Analiz ve Sohbet İçgörüsü", s: "Gruplarınızda neyin konuşulduğunu rakamlarla ve yorumla görün.",
      l: ["24 saatlik sohbet analizi: sohbet Markdown dosyasına dökülür, Python ile istatistik çıkarılır, AI en yaygın konuları yorumlar", "Mesaj, kişi, en yoğun saat, soru ve bağlantı sayıları", "En sık kelimeler, ikililer ve emojiler", "Grup analizi ve en aktif sohbetler", "Soru istatistikleri", "Kelime takibi", "Raporlar"],
      n: "AI’ya giden metinde kişi adları K1, K2… olarak değiştirilir; e-posta ve telefon maskelenir. AI kapalıysa konular yerel kelime sıklığından çıkarılır." },
    { i: "💬", t: "Mesajlar ve Gelen Kutusu", s: "Telegram’ı tek panelden okuyun ve yönetin.", isNew: true,
      l: ["Chat6 sohbet ekranı: gönderme, düzenleme, silme, okundu, zamanlama", "Akıllı bildirim merkezi: okunmamış DM + son hata/FloodWait + Sentinel özeti", "Yanıt şablonları CRUD; besteci menüsünden hızlı ekleme", "Zamanlanmış mesaj panosu: bekleyenleri gör, iptal et", "Medya galeri: sohbetten foto/video sayfalama ve önizleme", "Davet linki yöneticisi: admin olduğunuz grup/kanalda dışa aktar veya iptal", "Üye listesi ve CSV indirme", "Sohbeti ZIP olarak indirme", "Tüm sohbetlerde mesaj arama"],
      n: "<b>Üye çekme yok.</b> Davet araçları yalnızca yöneticisi olduğunuz sohbetler içindir; spam amaçlı toplu davet yoktur." },
    { i: "🛡", t: "Hesap Koruma", s: "Hesabınızı riske atmadan çalışmak için gönderimden önce kontrol.",
      l: ["Yazma izni önceden kontrol edilir; izin yoksa Telegram’a hiç istek gitmez", "FloodWait’i algılar, gönderimi durdurur ve süre dolunca devam ettirir", "PeerFlood’da otomasyonlar kapanır ve gönderim bir saat durur", "Yakın zamanda FloodWait olduysa dakika sınırı otomatik düşer", "Günlük gönderim kotası ve kalan hak göstergesi", "Yavaş mod süresi dolmadan gönderim yapılmaz", "Aynı metin çok sohbete gidiyorsa uyarı", "Kuru çalıştırma: mesajlar, tepkiler ve tüm otomasyonlar Telegram’a gitmeden doğrulanır"],
      n: "Bu kontroller Telegram’ın kurallarına uymanıza ve hesabınızı korumanıza yardımcı olur; sınırları aşmak veya atlatmak için tasarlanmamıştır." },
    { i: "🔐", t: "Güvenlik ve Sentinel", s: "Güvenilirlik, LovelyTG’nin öncelikli işi.", isNew: true,
      l: ["Yönetici şifresi ve panel PIN’i; hatalı denemelerde kilit", "Oturum/cihaz uyarısı: yeni cihaz oturumu algılanınca log + bildirim merkezi", "Şifreli yedek: parola ile Fernet; isteğe bağlı oturum dosyası (onaylı)", "AI Sentinel: otomasyon hatalarını izler, nedenini açıklar, bulguları kaydeder", "Bildirim merkezinde Sentinel özeti", "Hesap sağlığı özeti ve uyarılar", "İşlem denetim kayıtları", "Başka sitelerden medya erişimi reddedilir"],
      n: "<b>Şifreli yedekte oturum dosyası risklidir.</b> Varsayılan yedek ayar-only kalır; oturum ancak parola + açık onay ile pakete girer. Sentinel kendi başına düzeltme yapmaz." },
    { i: "📡", t: "Performans ve Olay Merkezi", s: "Sistemde olan her şey görünür.",
      l: ["İşlem konsolu ve bildirimler", "Ana panelde bekleyen akış / kampanya / işlem kuyruğu özeti", "Kayıtlar (hata, uyarı, bilgi)", "Performans sayfası", "Etkileşim olmadığında yenileme sıklığını düşüren akıllı canlı yenileme", "Hatalı işlemler için ayrıntılı açıklama"],
      f: ["Hesap bağlantısı", "Otomasyon", "Tepki", "Telegram bekleme sınırı", "Yedekleme"], fl: "Takip edilen olaylar" },
    { i: "📱", t: "Çoklu Hesap ve Mobil", s: "Birden fazla hesap, her cihazda sade bir arayüz.", isNew: true,
      l: ["Birden fazla Telegram hesabı ekleme ve hızlı geçiş", "Hesap karşılaştırma: meta, kota ve otomasyon sayıları yan yana", "Her hesabın verisi ve sınırları ayrı tutulur", "PWA: telefonda uygulama gibi açılır; yalnızca statik varlıklar önbelleğe alınır", "6 hub menü; son açtığınız alt sayfayı hatırlayan sekmeler", "Telefon, tablet ve masaüstüne uyumlu arayüz"],
      n: "<b>Her hesabın sınırı korunur.</b> Hesaplar birbirinin yerine gönderim yapan bir havuza dönüşmez." }
  ];
  var T = $("tabs"), P = $("fpanel"), cur = 0;
  var mc = $("modCount"); if (mc) mc.textContent = D.length;

  function panelHtml(d) {
    var h = "<h3>" + d.t + (d.isNew ? ' <span class="new">YENİ</span>' : "") + '</h3><p class="sub">' + d.s + '</p><ul class="fl">' + d.l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>";
    if (d.f) h += '<div class="note"><b>' + (d.fl || "Örnek akış") + '</b><div class="flow">' + d.f.map(function (x, j) { return (j ? '<em aria-hidden="true">→</em>' : "") + "<span>" + x + "</span>"; }).join("") + "</div></div>";
    if (d.n) h += '<div class="note">' + d.n + "</div>";
    return h;
  }
  function select(k, focus) {
    cur = k; P.innerHTML = panelHtml(D[k]); P.setAttribute("aria-labelledby", "tab" + k);
    var b = T.children;
    for (var j = 0; j < b.length; j++) { var on = j === k; b[j].setAttribute("aria-selected", on ? "true" : "false"); b[j].tabIndex = on ? 0 : -1; }
    if (focus) b[k].focus();
    if (window.innerWidth <= 900) T.scrollTo({ left: Math.max(0, b[k].offsetLeft - 16), behavior: "smooth" });
  }
  D.forEach(function (d, k) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "tab"; b.id = "tab" + k; b.setAttribute("role", "tab"); b.setAttribute("aria-controls", "fpanel");
    b.innerHTML = "<i>" + d.i + "</i><span>" + d.t + "</span>" + (d.isNew ? '<u class="dot" title="Yeni"></u>' : "");
    b.addEventListener("click", function () { select(k); });
    T.appendChild(b);
  });
  T.addEventListener("keydown", function (e) {
    var n = D.length, k = cur, wide = window.innerWidth > 900;
    var next = wide ? "ArrowDown" : "ArrowRight", prev = wide ? "ArrowUp" : "ArrowLeft";
    if (e.key === next) k = (cur + 1) % n;
    else if (e.key === prev) k = (cur + n - 1) % n;
    else if (e.key === "Home") k = 0;
    else if (e.key === "End") k = n - 1;
    else return;
    e.preventDefault(); select(k, true);
  });
  select(0);

  /* ---------- Yenilikler kartları (v6.4) ---------- */
  var NEWS = [
    ["🔔", "Bildirim Merkezi", "Okunmamış DM, hata/FloodWait günlüğü ve Sentinel özeti tek ekranda.", 5],
    ["✎", "Yanıt Şablonları", "Sık kullanılan metinleri kaydedin; Chat6 bestecisine tek tıkla ekleyin.", 0],
    ["🕒", "Zamanlanmış Pano", "Bekleyen zamanlı mesajları listeleyin ve tek tıkla iptal edin.", 1],
    ["🖼", "Medya Galeri", "Sohbetten fotoğraf ve videoları sayfalayın; mevcut önizlemelerle bakın.", 5],
    ["📱", "Oturum Uyarısı", "Yeni cihaz oturumu algılanınca kayıt ve bildirim merkezine düşer.", 7],
    ["⧉", "Hesap Karşılaştır", "Aktif ve listedeki hesapların kota/otomasyon özetini yan yana görün.", 9],
    ["🔐", "Şifreli Yedek", "Parola ile Fernet yedek; oturum dosyası yalnızca onayla pakete girer.", 7],
    ["📅", "7 Günlük Takvim", "Planlayıcı üstünde haftalık otomasyon grid’i.", 1],
    ["🔗", "Davet Linki", "Admin olduğunuz grup/kanalda davet linkini dışa aktarın veya iptal edin.", 5],
    ["⬇", "PWA + Kuyruk", "Statik PWA önbelleği ve ana panelde bekleyen akış/kampanya özeti.", 9]
  ];
  var N = $("news");
  NEWS.forEach(function (x) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "card nw";
    b.innerHTML = "<i>" + x[0] + "</i><h3>" + x[1] + "</h3><p>" + x[2] + '</p><span class="more">Ayrıntı →</span>';
    b.addEventListener("click", function () {
      select(x[3]);
      var sec = $("tum-ozellikler");
      sec.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    });
    N.appendChild(b);
  });

  /* ---------- Arayüz ekranları ---------- */
  var SH = [
    ["Akıllı Tepkiler", "assets/ui-tepkiler.webp", "Tepkiler sayfası: kanal yorumları ve normal grup sekmeleri, duyguya göre emoji seçimi"],
    ["Ses Merkezi", "assets/ui-ses-merkezi.webp", "Ses Merkezi: kütüphane, eşleştirme, kuyruk, mesaj analizi, profil ve simülasyon sekmeleri"],
    ["Sentinel", "assets/ui-sentinel.webp", "AI Sentinel: otomasyon hataları için bulgular ve öneriler"]
  ];
  var ST = $("shotTabs"), SI = $("shotImg"), SC = $("shotCap"), sc = 0;
  function pickShot(k, focus) {
    sc = k; SI.src = SH[k][1]; $("shotLink").href = SH[k][1]; SI.alt = SH[k][2]; SC.textContent = "Örnek verilerle hazırlanmış v6.4 ekran görüntüsü: " + SH[k][0];
    var b = ST.children;
    for (var j = 0; j < b.length; j++) { b[j].setAttribute("aria-selected", j === k ? "true" : "false"); b[j].tabIndex = j === k ? 0 : -1; }
    if (focus) b[k].focus();
  }
  SH.forEach(function (x, k) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "stab"; b.setAttribute("role", "tab"); b.textContent = x[0];
    b.addEventListener("click", function () { pickShot(k); });
    ST.appendChild(b);
  });
  ST.addEventListener("keydown", function (e) {
    var k = sc, n = SH.length;
    if (e.key === "ArrowRight") k = (sc + 1) % n; else if (e.key === "ArrowLeft") k = (sc + n - 1) % n; else return;
    e.preventDefault(); pickShot(k, true);
  });
  pickShot(0);

  /* ---------- Lisans ---------- */
  var L = [{ n: "1 Aylık Lisans", m: 1, p: 817.16 }, { n: "3 Aylık Lisans", m: 3, p: 2050.62 }, { n: "6 Aylık Lisans", m: 6, p: 3386.86, b: "Popüler" }, { n: "1 Yıllık Lisans", m: 12, p: 5648.19 }];
  var f = function (x) { return x.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "₺"; };
  var sv = function (d) { return Math.round((1 - d.p / d.m / L[0].p) * 100); };
  L[3].b = "%" + sv(L[3]) + " Tasarruf";          // rozet fiyattan hesaplanır; elle güncellemeye gerek yok
  var O = $("opts"), sel = 2;
  function show() {
    var d = L[sel], pm = d.p / d.m;
    $("pTotal").textContent = f(d.p);
    $("pMonth").textContent = d.m > 1 ? f(pm) + " / ay" : "Aylık ödeme";
    $("pSave").textContent = d.m > 1 ? "%" + sv(d) + " tasarruf (1 aylığa göre)" : "";
    var c = O.children;
    for (var i = 0; i < c.length; i++) { c[i].setAttribute("aria-checked", i === sel ? "true" : "false"); c[i].tabIndex = i === sel ? 0 : -1; }
    $("buy").href = "https://t.me/MertBrody?text=" + encodeURIComponent("Merhaba, LovelyTG " + d.n + " (" + f(d.p) + ") satın almak istiyorum.");
  }
  L.forEach(function (d, i) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "opt"; b.setAttribute("role", "radio");
    b.innerHTML = (d.b ? "<em>" + d.b + "</em>" : "") + "<b>" + d.n + "</b><span>" + f(d.p) + "</span>";
    b.addEventListener("click", function () { sel = i; show(); });
    O.appendChild(b);
  });
  O.addEventListener("keydown", function (e) {
    var n = L.length, k = sel;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") k = (sel + 1) % n; else if (e.key === "ArrowLeft" || e.key === "ArrowUp") k = (sel + n - 1) % n; else return;
    e.preventDefault(); sel = k; show(); O.children[k].focus();
  });
  show();
})();
