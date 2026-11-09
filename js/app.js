/* LovelyTG tanıtım sitesi — özellik modülleri, yenilikler, ekran görüntüleri, lisans seçimi, mobil menü */
(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };

  /* ---------- Mobil menü ---------- */
  var burger = $("burger"), menu = $("menu");
  function setMenu(open) {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
    burger.textContent = open ? "✕" : "☰";
  }
  burger.addEventListener("click", function () { setMenu(!menu.classList.contains("open")); });
  menu.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); burger.focus(); } });
  document.addEventListener("click", function (e) { if (menu.classList.contains("open") && !e.target.closest("header")) setMenu(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 900) setMenu(false); });

  /* ---------- Özellik modülleri ---------- */
  var D = [
    { i: "🧠", t: "Yapay Zekâ Komuta Merkezi", s: "Sohbet kutusu değil, uygulamayı yöneten bir asistan.",
      l: ["Doğal dille görev planlama: “Yarın 09.00’da seçtiğim gruplara günaydın mesajı planla”", "Son 7 gündeki grup hareketlerini analiz etme", "Yanıtlanmamış mesajları bulma", "Haftanın en aktif gruplarını gösterme", "Gelen mesajlara göre cevap taslakları oluşturma", "Son işlemlerdeki hataları inceleyip çözüm önerme", "Asistanın yaptığı her okuma ve yazma işlemi denetim kaydına yazılır", "Asistanın oluşturduğu otomasyonu tek tıkla geri alma", "İstediğiniz sohbet için AI erişimini kapatma"],
      n: "<b>Önce hazırlar, sonra sorar.</b> Yapay zekâ işlemi hazırlar, önizleme sunar ve gönderim gibi önemli eylemler için onayınızı alır. Dış AI servisine giden metinlerde e-posta ve telefon numaraları maskelenir." },
    { i: "🔀", t: "Otomasyon Stüdyosu", s: "Zamanlı mesajlar, paylaşım planları ve hikâyeler tek yerde.",
      l: ["Günlük, haftalık ve özel takvimle zamanlı mesaj", "Aynı mesaja birden fazla varyant", "Gönderimden önce hedef ve yazma izni kontrolü", "Medya paylaşım planı (görsel/video kampanyaları)", "Hikâye ve kanal paylaşımı akışları", "Akıllı zamanlama önerileri", "“Çalışan otomasyonlar” listesinde zamanlı mesaj, tepki kuralı ve kuyruk birlikte", "Her otomasyon için gönderim geçmişi", "Tüm otomasyonları tek hamlede duraklatma"],
      f: ["Her sabah 09.00", "Seçilen grupları kontrol et", "Hedef ve yazma izni kontrolü", "AI mesaj taslağı hazırla", "Onayla ve planla"] },
    { i: "🎙", t: "Ses Merkezi", s: "Mesaja uygun sesi bulur; siz onaylamadan hiçbir şey gönderilmez.", isNew: true,
      l: ["Sesler/ klasöründeki .ogg, .mp3 ve diğer sesleri tarama", "Alt klasörden kategori; etiketleme, arama, önizleme, düzenleme", "Mesaja en uygun sesi öneren eşleştirme motoru (yerel puanlama, isteğe bağlı AI)", "Yanıt hafızası: aynı mesaj tekrar analiz edilmez, JSON veya Markdown olarak dışa aktarılır", "Hesap başına kişilik profili: ton, hitap ve yanıt uzunluğu", "Onaylı gönderim kuyruğu: zamanlama, durum takibi, başarısız işlemleri yönetme", "Mesaj analizi: konu, niyet, duygu ve aciliyet", "Simülasyon modu: gerçek mesaj göndermeden eşleşmeyi ve akışı test edin"],
      n: "<b>Önce onay, sonra gönderim.</b> Kuyruktaki öğe onaylanana kadar bekler. FloodWait gelirse kuyruk durur ve bekleme bitince kaldığı yerden sürer. Sonucu belirsiz kalan gönderim kendiliğinden tekrar edilmez." },
    { i: "😊", t: "Akıllı Tepkiler", s: "Yorumlara ve grup mesajlarına, mesajın anlamına uygun emoji tepkisi.", isNew: true,
      l: ["Kanal yorumlarına ve normal gruplara tepki kuralı", "Emoji, mesajın duygusuna göre seçilir: olumlu 👍/🔥, teşekkür 🙏, kutlama 🎉, şaka 😁", "Olumsuz mesaja asla tepki verilmez", "Aynı mesaj her zaman aynı emojiyi alır; sıra ya da rastgelelik yok", "İsterseniz eski “sırayla” modu", "Kural başına minimum aralık ve saatlik sınır", "Tepkiden önce yazma izni kontrolü", "Günlük en fazla 300 tepki"],
      n: "Gruplarda kullanılabilecek tepkiler grubun ayarına bağlıdır; grup bir emojiye izin vermiyorsa o tepki atlanır." },
    { i: "📊", t: "Analiz ve Sohbet İçgörüsü", s: "Gruplarınızda neyin konuşulduğunu rakamlarla ve yorumla görün.", isNew: true,
      l: ["24 saatlik sohbet analizi: sohbet Markdown dosyasına dökülür, Python ile istatistik çıkarılır, AI en yaygın konuları yorumlar", "Mesaj, kişi, en yoğun saat, soru ve bağlantı sayıları", "En sık kelimeler, ikililer ve emojiler", "Grup analizi ve en aktif sohbetler", "Soru istatistikleri", "Kelime takibi", "Raporlar"],
      n: "AI’ya giden metinde kişi adları K1, K2… olarak değiştirilir; e-posta ve telefon maskelenir. AI kapalıysa konular yerel kelime sıklığından çıkarılır." },
    { i: "💬", t: "Mesajlar ve Gelen Kutusu", s: "Telegram’ı tek panelden okuyun ve yönetin.",
      l: ["Sohbet listesi ve mesaj akışı", "Mesaj gönderme, düzenleme, silme, okundu işaretleme", "Gelen özel mesajlar tek yerde", "Tüm sohbetlerde mesaj arama", "Üye listesi ve CSV indirme", "Fotoğraf, video, çıkartma ve GIF önizleme", "Sohbeti ZIP olarak indirme"] },
    { i: "🛡", t: "Hesap Koruma", s: "Hesabınızı riske atmadan çalışmak için gönderimden önce kontrol.", isNew: true,
      l: ["Yazma izni önceden kontrol edilir; izin yoksa Telegram’a hiç istek gitmez", "FloodWait’i algılar, gönderimi durdurur ve süre dolunca devam ettirir", "PeerFlood’da otomasyonlar kapanır ve gönderim bir saat durur", "Yakın zamanda FloodWait olduysa dakika sınırı otomatik düşer", "Günlük gönderim kotası ve kalan hak göstergesi", "Yavaş mod süresi dolmadan gönderim yapılmaz", "Aynı metin çok sohbete gidiyorsa uyarı", "Kuru çalıştırma: mesajlar, tepkiler ve tüm otomasyonlar Telegram’a gitmeden doğrulanır"],
      n: "Bu kontroller Telegram’ın kurallarına uymanıza ve hesabınızı korumanıza yardımcı olur; sınırları aşmak veya atlatmak için tasarlanmamıştır." },
    { i: "🔐", t: "Güvenlik ve Sentinel", s: "Güvenilirlik, LovelyTG’nin öncelikli işi.",
      l: ["Yönetici şifresi ve panel PIN’i; hatalı denemelerde kilit", "AI Sentinel: otomasyon hatalarını izler, nedenini açıklar, bulguları kaydeder", "Hesap sağlığı özeti ve uyarılar", "Ayar yedeği alma", "İşlem denetim kayıtları", "Yüklenen ZIP dosyalarında boyut ve oran sınırları", "Başka sitelerden medya erişimi reddedilir"],
      n: "<b>Sentinel kendi başına düzeltme yapmaz.</b> Bulguyu ve önerisini gösterir; karar sizindir." },
    { i: "📡", t: "Performans ve Olay Merkezi", s: "Sistemde olan her şey görünür.",
      l: ["İşlem konsolu ve bildirimler", "Kayıtlar (hata, uyarı, bilgi)", "Performans sayfası", "Etkileşim olmadığında yenileme sıklığını düşüren akıllı canlı yenileme", "Hatalı işlemler için ayrıntılı açıklama"],
      f: ["Hesap bağlantısı", "Otomasyon", "Tepki", "Telegram bekleme sınırı", "Yedekleme"], fl: "Takip edilen olaylar" },
    { i: "📱", t: "Çoklu Hesap ve Mobil", s: "Birden fazla hesap, her cihazda sade bir arayüz.",
      l: ["Birden fazla Telegram hesabı ekleme ve hızlı geçiş", "Her hesabın verisi ve sınırları ayrı tutulur", "Telefonda uygulama gibi açılan PWA", "25 sayfa, 6 ana başlıkta sade menü", "Son açtığınız alt sayfayı hatırlayan sekmeler", "Telefon, tablet ve masaüstüne uyumlu arayüz"],
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
    for (var j = 0; j < b.length; j++) { var on = j === k; b[j].setAttribute("aria-selected", on); b[j].tabIndex = on ? 0 : -1; }
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

  /* ---------- Yenilikler kartları ---------- */
  var NEWS = [
    ["🎙", "Ses Merkezi", "Sesleri kategorile, mesaja uygun sesi öner, onaylı kuyrukla gönder.", 2],
    ["😊", "Akıllı Tepkiler", "Emoji artık mesajın duygusuna göre; normal gruplarda da çalışır.", 3],
    ["📊", "24 Saat Analizi", "Sohbet Markdown’a dökülür, istatistik çıkar, AI en yaygın konuları yorumlar.", 4],
    ["🛡", "Yazma İzni Kontrolü", "İzin yoksa Telegram’a istek gitmez; hesabınız gereksiz hata almaz.", 6],
    ["🧪", "Kuru Çalıştırma ve Simülasyon", "Hiçbir şey göndermeden otomasyonları ve eşleşmeleri test edin.", 6],
    ["🧭", "Sade Menü", "25 menü maddesi 6 başlıkta; alt sayfalar üstte sekme olarak.", 9]
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
    sc = k; SI.src = SH[k][1]; $("shotLink").href = SH[k][1]; SI.alt = SH[k][2]; SC.textContent = "Örnek verilerle hazırlanmış v6.3 ekran görüntüsü: " + SH[k][0];
    var b = ST.children;
    for (var j = 0; j < b.length; j++) { b[j].setAttribute("aria-selected", j === k); b[j].tabIndex = j === k ? 0 : -1; }
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
    for (var i = 0; i < c.length; i++) { c[i].setAttribute("aria-checked", i === sel); c[i].tabIndex = i === sel ? 0 : -1; }
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
