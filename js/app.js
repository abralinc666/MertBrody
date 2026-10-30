/* EPİN PRO - Ana Uygulama, URL Router, Cüzdan, Kupon, Kod Kasası ve Destek Motoru (app.js) */
(() => {
  const { CATS, PRODUCTS, BRANDS, SLIDES, CAMPS, COUPONS, TICKER, REVIEWS, SEO_TEXT, PAY } = window.EPIN_DATA;
  const $ = s => document.querySelector(s);
  const TRY = k => "₺" + (k / 100).toLocaleString("tr-TR", { minimumFractionDigits: 2 });
  const esc = t => String(t ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const toast = m => { const t = $("#toast"); t.textContent = m; t.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("on"), 2200); };

  const IMG = {};
  const S = { cat: "all", q: "", sort: "pop", cart: {}, meta: {}, coupon: null, slide: 0, pm: "wallet", reveal: {} };

  try { S.cart = JSON.parse(localStorage.getItem("epin_cart") || "{}"); } catch (e) {}
  try { S.meta = JSON.parse(localStorage.getItem("epin_cart_meta") || "{}"); } catch (e) {}
  const save = () => {
    try {
      localStorage.setItem("epin_cart", JSON.stringify(S.cart));
      localStorage.setItem("epin_cart_meta", JSON.stringify(S.meta));
    } catch (e) {}
  };

  /* ===== KULLANICI, CÜZDAN VE SİPARİŞ VERİTABANI (MOCK) ===== */
  const U = {
    get: () => { try { return JSON.parse(localStorage.getItem("epin_users") || "{}"); } catch (e) { return {}; } },
    set: u => { try { localStorage.setItem("epin_users", JSON.stringify(u)); } catch (e) {} }
  };
  const O = {
    get: () => { try { return JSON.parse(localStorage.getItem("epin_orders") || "{}"); } catch (e) { return {}; } },
    set: o => { try { localStorage.setItem("epin_orders", JSON.stringify(o)); } catch (e) {} }
  };
  const TK = {
    get: () => { try { return JSON.parse(localStorage.getItem("epin_tickets") || "[]"); } catch (e) { return []; } },
    set: t => { try { localStorage.setItem("epin_tickets", JSON.stringify(t)); } catch (e) {} }
  };

  let ME = null;
  try { ME = localStorage.getItem("epin_me"); } catch (e) {}
  const ST = { wait: "Ödeme bekleniyor", paid: "Ödeme bildirildi", done: "Teslim edildi", cancel: "İptal" };

  /* ===== DİJİTAL E-PİN KOD ÜRETİCİ (KEY VAULT) ===== */
  const hx = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
  function genEpinKey(cat) {
    const pfx = (cat || "EPIN").slice(0, 4).toUpperCase();
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const seg = () => Array.from(crypto.getRandomValues(new Uint8Array(4)), b => chars[b % chars.length]).join("");
    return `${pfx}-${seg()}-${seg()}-${seg()}`;
  }
  const maskKey = k => k ? k.replace(/^([A-Z0-9]+)-([A-Z0-9]{4})-([A-Z0-9]{4})-([A-Z0-9]{4})$/, "$1-****-****-$4") : "";

  /* ===== SEO ROUTER & METADATA GÜNCELLEYİCİ ===== */
  function updateRoute(push = true) {
    const url = new URL(location.href);
    if (S.cat && S.cat !== "all") url.searchParams.set("cat", S.cat); else url.searchParams.delete("cat");
    if (S.sort && S.sort !== "pop") url.searchParams.set("sort", S.sort); else url.searchParams.delete("sort");
    if (push) try { history.pushState({ cat: S.cat, sort: S.sort }, "", url); } catch (e) {}

    const catObj = CATS.find(c => c[0] === S.cat) || CATS[0];
    const seo = SEO_TEXT[S.cat] || {
      title: `${catObj[1]} E-Pin ve Dijital Kodları – EPİN`,
      desc: `${catObj[1]} kategorisindeki tüm dijital kod ve bakiye paketlerini anında teslimat ve güvenli ödeme ile satın alın.`,
      faqs: SEO_TEXT.all.faqs
    };
    document.title = seo.title;
    const md = $('meta[name="description"]');
    if (md) md.setAttribute("content", seo.desc);
    const cn = $("#canon");
    if (cn) cn.setAttribute("href", location.origin + location.pathname + (S.cat !== "all" ? `?cat=${S.cat}` : ""));

    /* Breadcrumb */
    const bc = $("#bc");
    if (bc) {
      bc.innerHTML = `<a href="?cat=all" data-c="all">Ana Sayfa</a><span class="sep">›</span>` +
        (S.cat === "all" ? `<strong>Tüm Oyunlar</strong>` : `<a href="?cat=all" data-c="all">Kategoriler</a><span class="sep">›</span><strong>${esc(catObj[1])}</strong>`);
    }

    /* SEO Box & FAQ Accordion */
    const sb = $("#seoBox");
    if (sb) {
      sb.innerHTML = `<h2>${esc(seo.title)}</h2><p>${esc(seo.desc)}</p><div class="faq-list">${seo.faqs.map(f => `<details class="faq-item"><summary>${esc(f[0])}</summary><div>${esc(f[1])}</div></details>`).join("")}</div>`;
    }
  }

  window.addEventListener("popstate", () => {
    const p = new URLSearchParams(location.search);
    S.cat = p.get("cat") || "all";
    S.sort = p.get("sort") || "pop";
    cats(); brands(); list(); updateRoute(false);
  });

  /* ===== RENDER FONKSİYONLARI ===== */
  function ticker() {
    const el = $("#tickerItems");
    if (!el) return;
    el.innerHTML = TICKER.map(t => `<span><b>${esc(t[0])}</b> · <em>${esc(t[1])}</em> satın aldı (${esc(t[2])} · ${esc(t[3])})</span>`).join("");
  }

  function cats() {
    document.querySelectorAll("#cats .cat").forEach(e => e.remove());
    $("#cats").insertAdjacentHTML("beforeend", CATS.map(c =>
      `<a href="?cat=${esc(c[0])}" class="cat" data-c="${esc(c[0])}" ${c[0] == S.cat ? 'aria-current="page"' : ''}><i style="background:${esc(c[2])}">${esc(c[3])}</i>${esc(c[1])}</a>`
    ).join(""));
  }

  function brands() {
    $("#brands").innerHTML = BRANDS.map(b =>
      `<a href="?cat=${esc(b[0])}" data-c="${esc(b[0])}" ${b[0] == S.cat ? 'aria-current="page"' : ''}><i style="background:${esc(b[2])}">${esc(b[3])}</i>${esc(b[1])}</a>`
    ).join("");
  }

  function camps() {
    $("#camp").innerHTML = CAMPS.map(c =>
      `<div class="cp" style="--g:${c[3]};background:${c[3]}">${esc(c[0])}<span style="font-weight:600;font-size:10px;opacity:.85">${esc(c[1])}</span><strong class="${c[5]}">${esc(c[2])}</strong><a href="?cat=${esc(c[4])}" data-c="${esc(c[4])}">Hemen Al →</a></div>`
    ).join("");
  }

  function hero() {
    $("#hero").innerHTML = SLIDES.map((s, i) =>
      `<div class="slide${i == S.slide ? " on" : ""}" style="--bg-s:${s.bg}" role="group" aria-label="${i + 1}/${SLIDES.length}"><div class="art">${s.art.map(a => `<span>${a}</span>`).join("")}</div><div class="eyebrow">${s.e}</div><h2>${s.h}</h2><p>${s.p}</p><div><a href="?cat=${s.cat}" class="btn" data-c="${s.cat}">${s.b} →</a></div></div>`
    ).join("") + `<button class="arr pv" aria-label="Önceki">‹</button><button class="arr nx" aria-label="Sonraki">›</button><div class="dots">${SLIDES.map((_, i) => `<button aria-label="Slayt ${i + 1}" class="${i == S.slide ? "on" : ""}" data-i="${i}"></button>`).join("")}</div>`;
  }

  function ld() {
    const e = $("#ld");
    if (!e) return;
    const catObj = CATS.find(c => c[0] === S.cat) || CATS[0];
    const seo = SEO_TEXT[S.cat] || SEO_TEXT.all;
    const graph = [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Ana Sayfa", "item": location.origin + location.pathname },
          { "@type": "ListItem", "position": 2, "name": catObj[1], "item": location.href }
        ]
      },
      {
        "@type": "ItemList",
        "itemListElement": PRODUCTS.filter(p => p.active !== false).map((p, i) => ({
          "@type": "ListItem",
          "position": i + 1,
          "item": {
            "@type": "Product",
            "name": p.name + " " + p.variant,
            "description": p.desc || undefined,
            "category": (CATS.find(c => c[0] == p.cat) || [0, ""])[1],
            "aggregateRating": { "@type": "AggregateRating", "ratingValue": String(p.rating || 4.9), "reviewCount": String(p.reviews || 50) },
            "offers": {
              "@type": "Offer",
              "price": (p.price / 100).toFixed(2),
              "priceCurrency": "TRY",
              "availability": "https://schema.org/" + (p.stock > 0 ? "InStock" : "OutOfStock")
            }
          }
        }))
      },
      {
        "@type": "FAQPage",
        "mainEntity": (seo.faqs || []).map(f => ({
          "@type": "Question",
          "name": f[0],
          "acceptedAnswer": { "@type": "Answer", "text": f[1] }
        }))
      }
    ];
    e.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph }).replace(/</g, "\u003c");
  }

  function list() {
    ld();
    let l = PRODUCTS.filter(p => p.active !== false && (S.cat == "all" || p.cat == S.cat) && (p.name + " " + p.variant + " " + p.lbl).toLocaleLowerCase("tr").includes(S.q.toLocaleLowerCase("tr")));
    if (S.sort == "best") l.sort((a, b) => b.sold - a.sold);
    if (S.sort == "disc") l = l.filter(p => p.old);
    if (S.sort == "gift") l = l.filter(p => /kart|card|cüzdan|hediye/i.test(p.name));

    const catName = (CATS.find(c => c[0] === S.cat) || CATS[0])[1];
    $("#ttl").textContent = S.sort == "best" ? "En Çok Satanlar" : S.sort == "disc" ? "İndirimdekiler" : S.sort == "gift" ? "Hediye Kartları" : (S.cat === "all" ? "Popüler Ürünler" : `${catName} Ürünleri`);

    $("#grid").innerHTML = l.length ? l.map(p => {
      const d = p.old ? Math.round(100 - p.price * 100 / p.old) : 0;
      return `<article class="pc" data-id="${p.id}" style="cursor:pointer">
        <div class="pi" style="--g:${p.g}">
          ${IMG[p.id] ? `<img src="${esc(IMG[p.id])}" alt="${esc(p.name)}" loading="lazy">` : ""}
          ${esc(p.lbl)}
          <span class="reg-badge">${esc(p.region || "🇹🇷 TR")}</span>
          ${p.tag ? `<span class="tag">${esc(p.tag)}</span>` : ""}
          ${d ? `<span class="off">%${d}</span>` : ""}
        </div>
        <div class="pb">
          <a href="?cat=${esc(p.cat)}&product=${esc(p.slug || p.id)}" class="n" data-open="${p.id}">${esc(p.name)}</a>
          <span class="v">${esc(p.variant)}</span>
          <div class="meta-row">
            <span class="st ${p.stock ? "" : "no"}">${p.stock ? (p.delivery === "topup" ? "⚡ ID Yükleme" : "Stokta") : "Tükendi"}</span>
            <span class="rt">★ ${p.rating || "4.9"} <small style="color:var(--tx2)">(${p.reviews || 45})</small></span>
          </div>
          <div class="pf">
            <div>${p.old ? `<s>${TRY(p.old)}</s>` : ""}<b>${TRY(p.price)}</b></div>
            <button class="add" data-add="${p.id}" aria-label="${esc(p.name)} sepete ekle" ${p.stock ? "" : "disabled"}>🛒</button>
          </div>
        </div>
      </article>`;
    }).join("") : `<p class="empty">Aramanıza uygun ürün bulunamadı.</p>`;
  }

  function cartTotals() {
    const ids = Object.keys(S.cart).filter(i => PRODUCTS.some(p => p.id == i));
    let n = 0, sub = 0;
    ids.forEach(i => {
      const p = PRODUCTS.find(x => x.id == i), q = S.cart[i];
      n += q; sub += q * p.price;
    });
    const discRate = S.coupon && COUPONS[S.coupon] ? COUPONS[S.coupon].rate : 0;
    const disc = Math.round(sub * discRate / 100);
    const tot = Math.max(0, sub - disc);
    const bonus = Math.round(tot * 0.01);
    return { ids, n, sub, disc, tot, bonus, discRate };
  }

  function cart() {
    const { ids, n, sub, disc, tot, bonus } = cartTotals();
    $("#dl").innerHTML = ids.length ? ids.map(i => {
      const p = PRODUCTS.find(x => x.id == i), q = S.cart[i], pid = S.meta[i];
      return `<div class="li">
        <div>
          <b>${esc(p.name)}</b> <small>${esc(p.variant)} · ${TRY(p.price)}</small>
          ${p.delivery === "topup" ? `<small style="color:var(--p2)">🎯 Oyuncu ID: ${esc(pid || "Girilmedi")}</small>` : `<small style="color:var(--ok)">🔑 Anında Dijital Kod</small>`}
        </div>
        <div class="q">
          <button data-q="${i}" data-d="-1" aria-label="Azalt">−</button>${q}<button data-q="${i}" data-d="1" aria-label="Artır">+</button>
        </div>
      </div>`;
    }).join("") : `<p class="empty">Sepetiniz boş.</p>`;

    $("#cnt").textContent = n;
    $("#sub").textContent = TRY(sub);
    const dr = $("#discRow");
    if (dr) {
      dr.style.display = disc > 0 ? "flex" : "none";
      $("#discVal").textContent = "−" + TRY(disc) + ` (${S.coupon})`;
    }
    $("#tot").textContent = TRY(tot);
    const br = $("#bonusVal");
    if (br) br.textContent = "+" + TRY(bonus);
    $("#co").disabled = !n;
  }

  /* ===== ÜRÜN DETAY MODALI (AKTİVASYON REHBERİ, YORUMLAR, OYUNCU ID) ===== */
  function openProductDetail(id) {
    const p = PRODUCTS.find(x => x.id == id);
    if (!p) return;
    const savedId = S.meta[p.id] || "";
    mv(`
      <h2>${esc(p.name)} – ${esc(p.variant)}</h2>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px">
        <span class="bd done">${esc(p.region || "🇹🇷 TR Bölgesi")}</span>
        <span class="bd paid">${p.delivery === "topup" ? "⚡ Oyuncu ID'ye Otomatik Yükleme" : "🔑 7/24 Anında E-Pin Kodu"}</span>
        <span class="bd">★ ${p.rating || 4.9} (${p.reviews || 50} Değerlendirme)</span>
      </div>
      ${p.img ? `<img src="${esc(p.img)}" alt="" style="width:100%;max-height:190px;object-fit:cover;border-radius:12px;margin-bottom:12px">` : `<div class="pi" style="--g:${p.g};border-radius:12px;margin-bottom:12px;aspect-ratio:16/6">${esc(p.lbl)}</div>`}
      ${p.delivery === "topup" ? `
        <label style="background:#151f38;padding:12px;border-radius:10px;border:1px solid var(--p)">
          🎯 ${esc(p.topupLabel || "Oyuncu ID / Kullanıcı Numarası")} (Zorunlu)
          <input id="topupInput" value="${esc(savedId)}" placeholder="Örn: 5182930412" required>
        </label>
      ` : ""}
      <div class="tabs">
        <button type="button" class="on" data-ptab="desc">Açıklama</button>
        <button type="button" data-ptab="how">Nasıl Yüklenir?</button>
        <button type="button" data-ptab="rev">Yorumlar (${p.reviews || 50})</button>
      </div>
      <div id="ptab-desc" class="ptab-c">
        <p class="note" style="margin-top:0">${esc(p.desc || "Resmi distribütör garantili dijital oyun kodu.")}</p>
      </div>
      <div id="ptab-how" class="ptab-c" style="display:none">
        <ol class="note" style="padding-left:18px;margin-top:0">
          ${p.delivery === "topup"
            ? `<li>Oyuncu ID numaranızı yukarıdaki kutucuğa eksiksiz girin.</li><li>Sepete ekleyip ödemenizi Cüzdan, Havale veya Kripto ile tamamlayın.</li><li>Sistem 1-3 dakika içinde bakiyeyi doğrudan oyun hesabınıza tanımlar.</li>`
            : `<li>Siparişiniz onaylandığında <b>Hesabım > Siparişlerim</b> ekranındaki <b>Kod Kasası</b>'ndan kodunuzu kopyalayın.</li><li>İlgili oyunun mağaza/cüzdan sayfasına gidin ve 'Kod Kullan / Redeem Code' alanına yapıştırın.</li><li>Bakiyeniz anında hesabınıza tanımlanır.</li>`}
        </ol>
      </div>
      <div id="ptab-rev" class="ptab-c" style="display:none">
        ${REVIEWS.map(r => `<div style="border-bottom:1px solid var(--bd);padding:8px 0;font-size:12px"><b>${esc(r.u)}</b> <span style="color:#fbbf24">★★★★★</span> <small style="color:var(--tx2)">· ${esc(r.t)}</small><div style="color:var(--tx2);margin-top:2px">${esc(r.d)}</div></div>`).join("")}
      </div>
      <div class="r tot" style="margin-top:16px">
        <div>${p.old ? `<s style="color:var(--tx2);font-size:13px">${TRY(p.old)}</s> ` : ""}<b>${TRY(p.price)}</b></div>
        <small style="color:var(--ok);font-weight:700">+${TRY(Math.round(p.price * 0.01))} Bonus Puan</small>
      </div>
      <button class="btn" data-add-modal="${p.id}" style="width:100%;justify-content:center" ${p.stock ? "" : "disabled"}>Sepete Ekle</button>
    `);
  }

  /* ===== SEPETE EKLEME VE KUPON KONTROLÜ ===== */
  function addToCart(id, fromModal = false) {
    const p = PRODUCTS.find(x => x.id == id);
    if (!p || !p.stock) return;
    if (p.delivery === "topup") {
      const inp = $("#topupInput");
      const val = inp ? inp.value.trim() : (S.meta[id] || "");
      if (!val || val.length < 4) {
        if (!fromModal) openProductDetail(id);
        setTimeout(() => { const i = $("#topupInput"); if (i) i.focus(); toast("Lütfen Oyuncu ID girin"); }, 60);
        return;
      }
      S.meta[id] = val;
    }
    S.cart[p.id] = Math.min((S.cart[p.id] || 0) + 1, Math.min(p.stock, 5));
    save(); cart();
    if (fromModal) closeM();
    toast("Sepete eklendi");
  }

  /* ===== AKSİYONLAR VE EVENT DELEGATION ===== */
  function setCat(c) {
    S.cat = c; S.sort = "pop";
    cats(); brands(); list(); updateRoute(true);
  }
  function go(i) {
    S.slide = (i + SLIDES.length) % SLIDES.length;
    document.querySelectorAll(".slide").forEach((s, k) => s.classList.toggle("on", k == S.slide));
    document.querySelectorAll(".dots button").forEach((d, k) => d.classList.toggle("on", k == S.slide));
  }
  const drawer = o => { $("#dr").classList.toggle("on", o); $("#ov").classList.toggle("on", o); $("#dr").setAttribute("aria-hidden", !o); };

  document.addEventListener("click", e => {
    const t = e.target.closest("button,a");
    if (!t) {
      const card = e.target.closest(".pc");
      if (card) openProductDetail(card.dataset.id);
      return;
    }
    if (t.dataset.open) { e.preventDefault(); openProductDetail(t.dataset.open); }
    else if (t.dataset.add) { e.stopPropagation(); addToCart(t.dataset.add, false); }
    else if (t.dataset.addModal) { addToCart(t.dataset.addModal, true); }
    else if (t.dataset.ptab) {
      document.querySelectorAll("[data-ptab]").forEach(b => b.classList.toggle("on", b == t));
      document.querySelectorAll(".ptab-c").forEach(c => c.style.display = c.id === "ptab-" + t.dataset.ptab ? "block" : "none");
    }
    else if (t.dataset.q) {
      const i = t.dataset.q; S.cart[i] += +t.dataset.d;
      if (S.cart[i] < 1) { delete S.cart[i]; delete S.meta[i]; } else S.cart[i] = Math.min(S.cart[i], 5);
      save(); cart();
    }
    else if (t.id == "applyCpn") {
      const code = ($("#cpnInput").value || "").trim().toUpperCase();
      if (COUPONS[code]) { S.coupon = code; cart(); toast(`${code} kuponu uygulandı!`); }
      else { S.coupon = null; cart(); toast("Geçersiz kupon kodu"); }
    }
    else if (t.dataset.c) { e.preventDefault(); setCat(t.dataset.c); }
    else if (t.dataset.sort) { e.preventDefault(); S.sort = t.dataset.sort; S.cat = "all"; list(); updateRoute(true); }
    else if (t.dataset.i) go(+t.dataset.i);
    else if (t.classList.contains("pv")) go(S.slide - 1);
    else if (t.classList.contains("nx")) go(S.slide + 1);
    else if (t.id == "cartBtn") drawer(true);
    else if (t.id == "x") drawer(false);
    else if (t.id == "all") { e.preventDefault(); setCat("all"); }
    else if (t.id == "walletBtn") { if (ME) pageOpen("prof", "wal"); else openM("login"); }
    else if (t.id == "supFab") { if (ME) pageOpen("prof", "sup"); else openInfo("contact"); }
    else if (pgClick(t)) {}
    else if (t.id == "co") checkout();
    else if (t.dataset.pm) { S.pm = t.dataset.pm; document.querySelectorAll(".pm").forEach(b => b.setAttribute("aria-pressed", b.dataset.pm == S.pm)); }
    else if ("pay" in t.dataset) place();
    else if (t.dataset.copy) { navigator.clipboard.writeText(t.dataset.copy).then(() => toast("Kopyalandı"), () => toast("Kopyalanamadı")); }
    else if (t.dataset.rev) { S.reveal[t.dataset.rev] = !S.reveal[t.dataset.rev]; const o = findOrder(t.dataset.no); if (o) orderView(o); }
    else if (t.dataset.o) { const o = findOrder(t.dataset.o); if (o) orderView(o); }
    else if (t.id == "join") { S.coupon = "HOSGELDIN5"; cart(); openM("reg"); }
    else if (t.id == "acc") { if (ME) pageOpen("prof", "ov"); else openM("login"); }
    else if (t.id == "out") logout();
    else if (t.dataset.v) { e.preventDefault(); view(t.dataset.v); }
    else if (t.id == "mx") closeM();
    else if (t.id == "bell") toast("Kampanya: HOSGELDIN5 kuponu ile %5 indirim aktif!");
    else if (t.dataset.info) { e.preventDefault(); openInfo(t.dataset.info); }
    else if (t.getAttribute("href") == "#") e.preventDefault();
  });

  $("#ov").onclick = () => drawer(false);
  document.addEventListener("keydown", e => {
    if (e.key == "Escape") { drawer(false); if ($("#md").classList.contains("on")) closeM(); else pageClose(); }
  });
  $("#q").addEventListener("input", e => { S.q = e.target.value.trim(); list(); });

  /* ===== KİMLİK DOĞRULAMA & CÜZDAN GÜNCELLEME ===== */
  const PREVIEW = true, ITER = 600000;
  const strong = p => p.length >= 10 && p.length <= 128 && /[A-Za-z]/.test(p) && /\d/.test(p);
  const teq = (a, b) => { if (a.length != b.length) return false; let r = 0; for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i); return r == 0; };
  async function hash(pw, salt, it = ITER) {
    const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(pw), "PBKDF2", false, ["deriveBits"]);
    return hx(await crypto.subtle.deriveBits({ name: "PBKDF2", salt: new TextEncoder().encode(salt), iterations: it, hash: "SHA-256" }, k, 256));
  }

  function upd() {
    const us = U.get(), u = ME && us[ME];
    if (ME && !u) ME = null;
    $("#acc .t").textContent = u ? u.name.split(" ")[0] + " ▾" : "Giriş Yap";
    $("#walAmt").textContent = u ? TRY(u.balance || 0) : "₺0,00";
  }

  function view(v, err = "") {
    const m = $("#mc");
    const L = v == "login";
    m.innerHTML = `<h2>${L ? "Giriş Yap" : "Üye Ol (%5 Kupon Kazan)"}</h2>
      <form id="af" data-v="${v}" novalidate>
        ${L ? "" : `<label>Ad Soyad<input name="name" autocomplete="name"></label>`}
        <label>E-posta<input name="email" type="email" autocomplete="email"></label>
        <label>Parola<input name="pw" type="password" autocomplete="${L ? "current-password" : "new-password"}"></label>
        ${L ? "" : `<label>Parola (tekrar)<input name="pw2" type="password" autocomplete="new-password"></label>`}
        <p class="err" role="alert">${esc(err)}</p>
        <button class="btn" style="width:100%;justify-content:center">${L ? "Giriş Yap" : "Kayıt Ol ve HOSGELDIN5 Tanımla"}</button>
      </form>
      <p class="note">${L ? `Hesabın yok mu? <a href="#" data-v="reg">Üye ol</a>` : `Zaten üye misin? <a href="#" data-v="login">Giriş yap</a>`}</p>`;
  }

  function openM(v) { view(v); $("#md").classList.add("on"); const i = $("#mc input"); if (i) i.focus(); }
  function closeM() { $("#md").classList.remove("on"); clearInterval(orderView.timer); }
  $("#md").addEventListener("click", e => { if (e.target.id == "md") closeM(); });

  document.addEventListener("submit", async e => {
    const f = e.target;
    if (f.id != "af") return;
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), v = f.dataset.v, em = (d.email || "").trim().toLowerCase(), us = U.get(), pw = d.pw || "";
    const bad = em.length > 254 || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em) ? "Geçerli bir e-posta girin." : pw.length < 1 || pw.length > 128 ? "Parola geçersiz." : v == "reg" && !strong(pw) ? "Parola en az 10 karakter olmalı; harf ve rakam içermeli." : "";
    if (bad) return view(v, bad);
    try {
      if (v == "reg") {
        const nn = (d.name || "").trim();
        if (nn.length < 2 || nn.length > 60) return view(v, "Ad soyad 2-60 karakter olmalı.");
        if (pw != d.pw2) return view(v, "Parolalar eşleşmiyor.");
        if (us[em]) return view(v, "Bu e-posta zaten kayıtlı.");
        const salt = hx(crypto.getRandomValues(new Uint8Array(16)));
        us[em] = { name: nn, salt, it: ITER, h: await hash(pw, salt), role: PREVIEW && !Object.keys(us).length ? "admin" : "user", balance: 25000 /* Yeni üyeye 250 TL deneme cüzdan bakiyesi */, bonus: 0, ts: Date.now() };
        U.set(us);
        S.coupon = "HOSGELDIN5"; cart();
      } else {
        const u = us[em], h = await hash(pw, u ? u.salt : "0000000000000000", u ? (u.it || 100000) : ITER);
        if (!(u && teq(h, u.h))) return view(v, "E-posta veya parola hatalı.");
      }
      ME = em;
      try { localStorage.setItem("epin_me", em); } catch (x) {}
      upd(); closeM();
      toast(v == "reg" ? "Hesap açıldı! ₺250 Deneme Bakiyesi + HOSGELDIN5 tanımlandı" : "Giriş yapıldı");
    } catch (x) { view(v, "İşlem tamamlanamadı."); }
  });

  /* ===== ÖDEME, ANINDA CÜZDAN TESLİMATI, KOD KASASI VE ÖDEME BİLDİRİMİ ===== */
  const mv = h => { $("#mc").innerHTML = h; $("#md").classList.add("on"); };
  const lines = () => Object.keys(S.cart).map(i => ({ p: PRODUCTS.find(x => x.id == i), q: Math.min(5, Math.max(1, parseInt(S.cart[i], 10) || 1)), playerId: S.meta[i] || "" })).filter(l => l.p);
  const findOrder = no => {
    const all = O.get();
    for (const u in all) { const found = (all[u] || []).find(x => x.no == no); if (found) return found; }
    return null;
  };

  function checkout() {
    if (!ME) { drawer(false); toast("Ödeme için giriş yapın"); return openM("login"); }
    const L = lines();
    if (!L.length) return;
    for (const l of L) {
      if (l.p.delivery === "topup" && !l.playerId) {
        drawer(false);
        return openProductDetail(l.p.id);
      }
    }
    const { sub, disc, tot, bonus } = cartTotals();
    const u = U.get()[ME] || { balance: 0 };
    if ((u.balance || 0) >= tot) S.pm = "wallet"; else if (S.pm === "wallet") S.pm = "iban";
    drawer(false);

    const m = (id, n, d, off, badge) => `<button class="pm" data-pm="${id}" aria-pressed="${!off && S.pm == id}" ${off ? "disabled" : ""}><b>${n}</b><span>${d}</span>${badge ? `<em class="${off ? "" : "ok"}">${badge}</em>` : ""}</button>`;
    mv(`
      <h2>Güvenli Ödeme</h2>
      <p class="note" style="margin:0 0 10px">${L.map(l => `${esc(l.p.name)} ${esc(l.p.variant)} ×${l.q} ${l.playerId ? `(ID: ${esc(l.playerId)})` : ""}`).join("<br>")}</p>
      ${disc > 0 ? `<div class="r" style="display:flex;justify-content:space-between;font-size:12px;color:var(--ok);margin-bottom:4px"><span>Kupon (${S.coupon})</span><span>−${TRY(disc)}</span></div>` : ""}
      <div class="r tot"><span>Ödenecek Tutar</span><b>${TRY(tot)}</b></div>
      ${m("wallet", `Site İçi Cüzdan Bakiyesi (${TRY(u.balance || 0)})`, "Anında otomatik onay ve saniyesinde E-Pin teslimatı", (u.balance || 0) < tot, (u.balance || 0) < tot ? "Yetersiz Bakiye" : "Anında Teslimat")}
      ${m("iban", "IBAN / Havale - FAST", "7/24 FAST ile gönderim sonrası Ödeme Bildirimi", 0, "Aktif")}
      ${m("crypto", "Kripto Para (USDT - TRC20)", "15 dk kur garantili blokzincir ödemesi", 0, "Aktif")}
      ${m("card", "3D Secure Banka / Kredi Kartı", "Sertifikalı ödeme geçidi entegrasyonu", 1, "Bakımda")}
      <button class="btn" data-pay style="width:100%;justify-content:center;margin-top:10px">Siparişi Tamamla (+${TRY(bonus)} Puan Kazan)</button>
    `);
  }

  function place() {
    const L = lines();
    if (!ME || !L.length) return;
    if (L.some(l => l.p.stock < l.q)) return toast("Stok yetersiz");
    const { tot, bonus } = cartTotals();
    const us = U.get(), u = us[ME];
    if (S.pm === "wallet" && (u.balance || 0) < tot) return toast("Cüzdan bakiyeniz yetersiz");

    const isInstant = S.pm === "wallet";
    const no = "EP" + Date.now().toString(36).toUpperCase() + hx(crypto.getRandomValues(new Uint8Array(2))).toUpperCase();
    const items = L.map(l => ({
      i: l.p.id,
      n: l.p.name,
      v: l.p.variant,
      q: l.q,
      u: l.p.price,
      delivery: l.p.delivery || "key",
      playerId: l.playerId || undefined,
      keys: Array.from({ length: l.q }, () => l.p.delivery === "topup" ? `TOPUP-OK-${ l.playerId }` : genEpinKey(l.p.cat))
    }));

    const o = { no, ts: Date.now(), exp: Date.now() + 15 * 60e3, method: S.pm, total: tot, bonus, status: isInstant ? "done" : "wait", coupon: S.coupon || undefined, items };
    if (isInstant) {
      u.balance = (u.balance || 0) - tot + bonus;
      u.bonus = (u.bonus || 0) + bonus;
      U.set(us);
    }

    const all = O.get();
    (all[ME] = all[ME] || []).unshift(o);
    O.set(all);
    L.forEach(l => { l.p.stock = Math.max(0, l.p.stock - l.q); });
    saveCat();
    S.cart = {}; S.meta = {}; S.coupon = null;
    save(); cart(); upd();
    orderView(o);
  }

  function orderView(o) {
    clearInterval(orderView.timer);
    const c = o.method == "crypto", w = o.method == "wallet";
    const u = (o.total / PAY.crypto.rate).toFixed(2);
    const done = o.status === "done";

    mv(`
      <h2>Sipariş #${esc(o.no)}</h2>
      <p class="note" style="margin-top:0">Durum: <span class="bd ${o.status}">${ST[o.status]}</span> · Tutar: <b>${TRY(o.total)}</b></p>

      ${done ? `
        <div class="key-box">
          <b style="color:#4ade80;display:block;margin-bottom:6px">🔓 Dijital Kod Kasanız (Teslim Edildi)</b>
          ${(o.items || []).map((it, idx) => `
            <div style="margin-bottom:8px">
              <small style="color:var(--tx2)">${esc(it.n)} (${esc(it.v)}) ×${it.q}</small>
              ${it.delivery === "topup"
                ? `<code>✅ Oyuncu ID (${esc(it.playerId)}) hesabına otomatik yüklendi.</code>`
                : (it.keys || []).map((k, ki) => {
                    const rk = `${o.no}_${idx}_${ki}`;
                    const shown = !!S.reveal[rk];
                    return `<code>${shown ? esc(k) : esc(maskKey(k))}</code>
                      <div><button class="cp2" data-rev="${rk}" data-no="${o.no}">${shown ? "Gizle" : "👁️ Kodu Göster"}</button><button class="cp2" data-copy="${esc(k)}">📋 Kodu Kopyala</button></div>`;
                  }).join("")}
            </div>
          `).join("")}
        </div>
      ` : `
        <div class="key-box" style="border-color:#f59e0b">
          <b style="color:#fbbf24">🔒 Dijital Kod Kasanız (Ödeme Onayı Bekleniyor)</b>
          <p class="note" style="margin-top:4px">Ödeme bildiriminiz onaylandığında E-Pin kodlarınız bu ekranda açılacaktır.</p>
        </div>
      `}

      ${!done && c ? `
        <p class="note">Gönderilecek Tutar: <b>${u} ${PAY.crypto.coin}</b> (${PAY.crypto.net}) · Kalan Süre: <b id="cdTimer" style="color:var(--p2)">15:00</b></p>
        <code>${esc(PAY.crypto.addr)}</code>
        <button class="cp2" data-copy="${esc(PAY.crypto.addr)}">Adresi Kopyala</button>
      ` : ""}

      ${!done && !c && !w ? `
        <p class="note">Banka: <b>${esc(PAY.iban.bank)}</b><br>Alıcı: <b>${esc(PAY.iban.holder)}</b></p>
        <code>${esc(PAY.iban.no)}</code>
        <button class="cp2" data-copy="${esc(PAY.iban.no)}">IBAN Kopyala</button>
        <p class="note">Açıklama kısmına sipariş numaranızı yazın: <b>${esc(o.no)}</b></p>
      ` : ""}

      ${o.status === "wait" ? `
        <form id="payNoticeForm" data-no="${esc(o.no)}" style="margin-top:14px;padding-top:12px;border-top:1px solid var(--bd)">
          <b style="display:block;margin-bottom:8px;font-size:13px">📨 Ödeme Bildirimi Yap (Havale / TxID)</b>
          <label>${c ? "İşlem Hash (TxID) Kodu" : "Gönderen Ad Soyad & Dekont Notu"}
            <input name="ref" placeholder="${c ? "0x... veya TRC20 TxID" : "Örn: Ahmet Yılmaz - Ziraat FAST"}" required>
          </label>
          <button class="btn" style="width:100%;justify-content:center">Ödeme Bildirimini Gönder</button>
        </form>
      ` : o.ref ? `<p class="note" style="color:#60a5fa">✔️ Ödeme bildiriminiz alındı (${esc(o.ref)}). Kontrol ediliyor.</p>` : ""}
    `);

    if (!done && c) {
      const tick = () => {
        const el = $("#cdTimer");
        if (!el) return clearInterval(orderView.timer);
        const left = Math.max(0, Math.floor(((o.exp || Date.now()) - Date.now()) / 1000));
        el.textContent = `${String(Math.floor(left / 60)).padStart(2, "0")}:${String(left % 60).padStart(2, "0")}`;
      };
      tick();
      orderView.timer = setInterval(tick, 1000);
    }
  }

  /* ===== KATALOG KALICILIĞI ===== */
  const CK = "epin_catalog", kr = v => Math.round(parseFloat(String(v).replace(",", ".")) * 100);
  function syncIMG() { for (const k in IMG) delete IMG[k]; PRODUCTS.forEach(p => { if (p.img) IMG[p.id] = p.img; }); }
  function saveCat() { try { localStorage.setItem(CK, JSON.stringify({ c: CATS, p: PRODUCTS })); } catch (e) {} syncIMG(); cats(); list(); }
  syncIMG();

  /* ===== KURUMSAL MODALLAR ===== */
  const DRAFT = '<p class="note" style="color:#fbbf24;margin-top:0">Bilgilendirme: Resmi şirket ve MERSİS bilgileri prodüksiyon ortamında eklenecektir.</p>';
  const INFO = {
    about: ["Hakkımızda", DRAFT + "<p>EPİN, oyunculara 7/24 otomatik dijital kod (Key Vault) ve Oyuncu ID üzerinden anında bakiye yükleme hizmeti sunan yeni nesil e-pin platformudur.</p>"],
    contact: ["7/24 Canlı Destek ve İletişim", "<p>Sipariş numaranızla birlikte Müşteri Panelinizdeki <b>Destek Taleplerim (Ticket)</b> sekmesinden 7/24 kayıt açabilirsiniz.</p><p class='note'>Destek E-posta: destek@epin.example.com</p>"],
    blog: ["Oyun Rehberleri & Blog", "<p><b>• Steam Cüzdan Kodu Nasıl Aktif Edilir?</b><br>Steam sağ üst menüden Cüzdanım > Kod Kullan adımlarını izleyin.</p><p style='margin-top:8px'><b>• Valorant Gece Pazarı Ne Zaman Geliyor?</b><br>Her sezon bitimine 2 hafta kala özel indirimli VP fırsatlarıyla açılır.</p>"],
    refund: ["İade ve İptal Koşulları", DRAFT + "<p>Henüz görüntülenmemiş ('Kodu Göster' butonuna basılmamış) veya ödemesi tamamlanmamış siparişler iptal edilerek Cüzdan Bakiyesine anında iade edilir.</p>"],
    terms: ["Kullanım Koşulları", DRAFT + "<p>Satın alınan kodların bölge (Region Lock) uyumluluğu ürün kartlarında açıkça belirtilmiştir.</p>"],
    privacy: ["Gizlilik ve KVKK Aydınlatma Metni", DRAFT + "<p>Kişisel verileriniz 6698 sayılı KVKK kapsamında yalnızca sipariş teslimatı ve faturalandırma amacıyla işlenir.</p>"],
    distance: ["Mesafeli Satış Sözleşmesi", DRAFT + "<p>Dijital içerik ve anında ifa edilen gayrimaddi mallara ilişkin mesafeli satış sözleşmesi hükümleri geçerlidir.</p>"]
  };
  function openInfo(k) { const i = INFO[k]; if (i) mv(`<h2>${i[0]}</h2>${i[1]}`); }

  /* ===== MÜŞTERİ PANELİ (PROFİL, CÜZDAN, KOD KASASI, DESTEK TALEBİ) VE YÖNETİM PANELİ ===== */
  const isAdmin = () => !!ME && (U.get()[ME] || {}).role == "admin";
  function logout() { ME = null; try { localStorage.removeItem("epin_me"); } catch (x) {} upd(); closeM(); pageClose(); toast("Çıkış yapıldı"); }

  const PG = { k: "", tab: "", edit: null, rm: false };
  const allOrders = () => Object.entries(O.get()).flatMap(([u, l]) => l.map(o => ({ ...o, user: u }))).sort((a, b) => b.ts - a.ts);
  const myOrders = () => O.get()[ME] || [];
  const bdg = s => `<span class="bd ${s}">${ST[s]}</span>`;
  const dt = t => new Date(t).toLocaleDateString("tr-TR");

  function ordT(l, adm) {
    return l.length ? `<div class="tw"><table><tr><th>Sipariş</th>${adm ? "<th>Müşteri</th>" : ""}<th>Tarih</th><th>Yöntem</th><th>Bildirim</th><th>Tutar</th><th>Durum</th><th>İşlem</th></tr>${l.map(o => `<tr><td><b>${esc(o.no)}</b></td>${adm ? `<td>${esc(o.user)}</td>` : ""}<td>${dt(o.ts)}</td><td>${o.method == "wallet" ? "Cüzdan" : o.method == "crypto" ? "Kripto" : "IBAN"}</td><td>${esc(o.ref || "—")}</td><td>${TRY(o.total)}</td><td>${adm ? `<select data-st="${o.no}" data-u="${esc(o.user)}" aria-label="Durum">${Object.keys(ST).map(k => `<option value="${k}" ${k == o.status ? "selected" : ""}>${ST[k]}</option>`).join("")}</select>` : bdg(o.status)}</td><td><button class="sm" data-o="${o.no}">${o.status === "done" ? "🔑 Kodları Gör" : "Detay / Bildirim"}</button></td></tr>`).join("")}</table></div>` : `<p class="note">Henüz sipariş yok.</p>`;
  }

  function pageOpen(k, tab) { if (k == "admin" && !isAdmin()) return; PG.k = k; PG.tab = tab; PG.edit = null; $("#pgv").classList.add("on"); pageRender(); }
  function pageClose() { $("#pgv").classList.remove("on"); }

  function pageRender() {
    const adm = PG.k == "admin";
    const T = adm
      ? [["dash", "Dashboard"], ["prod", "Ürünler"], ["cat", "Kategoriler"], ["ord", "Sipariş & Onay"], ["sup", "Destek Talepleri"]]
      : [["ov", "Genel Bakış"], ["wal", "Cüzdan & Bakiye"], ["ord", "Siparişlerim & Kod Kasası"], ["sup", "Destek Talebi (Ticket)"], ["set", "Hesap Ayarları"]];
    $("#pgt").textContent = adm ? "EPİN · Yönetim Paneli" : "Müşteri Paneli ve Kod Kasası";
    $("#ps").innerHTML = T.map(t => `<button data-tab="${t[0]}" aria-pressed="${PG.tab == t[0]}">${t[1]}</button>`).join("") +
      (!adm && isAdmin() ? `<button data-go="admin" style="color:var(--p2)">⚙️ Yönetim Paneli →</button>` : "") +
      (adm ? `<button data-go="prof">← Müşteri Panelim</button>` : "") +
      `<button data-go="out" style="color:#f87171">Çıkış Yap</button>`;
    $("#pcx").innerHTML = (adm ? AD : PR)[PG.tab]();
  }

  const H = t => `<h2 style="margin-bottom:14px;font-size:20px">${t}</h2>`;

  const PR = {
    ov: () => {
      const u = U.get()[ME], l = myOrders(), sp = l.filter(o => o.status == "paid" || o.status == "done").reduce((a, o) => a + o.total, 0);
      return `<div style="display:flex;gap:16px;align-items:center;margin-bottom:22px"><div class="av">${esc(u.name.split(" ").map(w => w[0]).slice(0, 2).join("").toLocaleUpperCase("tr"))}</div><div><h2 style="font-size:22px">${esc(u.name)}</h2><span style="color:var(--tx2);font-size:13px">${esc(ME)} · ${u.role == "admin" ? "Yönetici" : "Onaylı Oyuncu"}</span></div></div>
      <div class="kp">
        <div class="k"><small>Kullanılabilir Cüzdan</small><b style="color:#4ade80">${TRY(u.balance || 0)}</b></div>
        <div class="k"><small>Kazanılan Bonus Puan</small><b style="color:var(--p2)">${TRY(u.bonus || 0)}</b></div>
        <div class="k"><small>Toplam Sipariş</small><b>${l.length}</b></div>
        <div class="k"><small>Toplam Harcama</small><b>${TRY(sp)}</b></div>
      </div>
      <h3 style="margin-bottom:10px">Son Siparişlerim ve E-Pin Kodlarım</h3>${ordT(l.slice(0, 5))}`;
    },
    wal: () => {
      const u = U.get()[ME];
      return H("Cüzdanım & Bakiye Yükle") + `
        <div class="kp">
          <div class="k"><small>Mevcut Cüzdan Bakiyesi</small><b style="color:#4ade80">${TRY(u.balance || 0)}</b></div>
          <div class="k"><small>Biriken Sadakat Puanı (%1)</small><b style="color:var(--p2)">${TRY(u.bonus || 0)}</b></div>
        </div>
        <form class="fm" id="walForm" novalidate>
          <label>Yüklenecek Tutar (₺)<input name="amt" type="number" min="10" max="50000" value="250" required></label>
          <label>Ödeme Yöntemi<select name="m"><option value="fast">Hızlı Test Bakiye Yükle (Anında Onay)</option><option value="iban">Havale / FAST Bildirimi</option></select></label>
          <div class="w"><button class="btn">+ Bakiyeyi Cüzdana Ekle</button></div>
        </form>
        <p class="note">Cüzdan bakiyenizle yaptığınız tüm alışverişlerde E-Pin kodlarınız saniyesinde otomatik teslim edilir ve %1 nakit bonus kazanırsınız.</p>`;
    },
    ord: () => H("Siparişlerim ve Dijital Kod Kasası") + ordT(myOrders()),
    sup: () => {
      const myT = TK.get().filter(t => t.user === ME);
      return H("7/24 Destek Taleplerim (Ticket)") + `
        <form class="fm" id="tkForm" style="margin-bottom:24px">
          <label>İlgili Sipariş<select name="ord"><option value="Genel">Genel Soru / Ödeme</option>${myOrders().map(o => `<option value="${o.no}">${o.no} (${TRY(o.total)})</option>`).join("")}</select></label>
          <label>Konu Başlığı<input name="sub" placeholder="Örn: Ödeme bildirimi hk." required></label>
          <label class="w">Mesajınız<textarea name="msg" placeholder="Size nasıl yardımcı olabiliriz?" required></textarea></label>
          <div class="w"><button class="btn">Destek Talebi Gönder</button></div>
        </form>
        <h3 style="margin-bottom:10px">Geçmiş Taleplerim</h3>
        ${myT.length ? `<div class="tw"><table><tr><th>No</th><th>Sipariş</th><th>Konu</th><th>Mesaj / Yanıt</th><th>Durum</th></tr>${myT.map(t => `<tr><td>#${t.id}</td><td>${esc(t.ord)}</td><td><b>${esc(t.sub)}</b></td><td>${esc(t.msg)}${t.reply ? `<br><small style="color:#4ade80">Yanıt: ${esc(t.reply)}</small>` : ""}</td><td><span class="bd ${t.reply ? "done" : "paid"}">${t.reply ? "Yanıtlandı" : "Açık"}</span></td></tr>`).join("")}</table></div>` : `<p class="note">Henüz destek talebiniz bulunmuyor.</p>`}`;
    },
    set: () => {
      const u = U.get()[ME];
      return H("Hesap Ayarları") + `<form class="fm" id="sf" novalidate><label class="w">Ad Soyad<input name="name" value="${esc(u.name)}" autocomplete="name"></label><label class="w">E-posta<input value="${esc(ME)}" disabled></label><label>Mevcut parola<input name="cur" type="password"></label><label>Yeni parola<input name="np" type="password"></label><p class="err w" id="se" role="alert"></p><div class="w"><button class="btn">Bilgileri Güncelle</button></div></form>`;
    }
  };

  function pform(id) {
    const p = id == "new" ? { cat: (CATS[1] || [""])[0], active: true, stock: 20, region: "🇹🇷 TR Hesap", delivery: "key" } : PRODUCTS.find(x => x.id == id);
    if (!p) { PG.edit = null; return AD.prod(); }
    return H(id == "new" ? "Yeni Ürün" : "Ürünü Düzenle") + `<form class="fm" id="pf" data-id="${id}" novalidate>
      <label class="w">Ürün adı<input name="name" value="${esc(p.name || "")}"></label>
      <label>Kategori<select name="cat">${CATS.slice(1).map(c => `<option value="${c[0]}" ${c[0] == p.cat ? "selected" : ""}>${esc(c[1])}</option>`).join("")}</select></label>
      <label>Nominal / varyant<input name="variant" value="${esc(p.variant || "")}" placeholder="100 TL"></label>
      <label>Fiyat (₺)<input name="price" inputmode="decimal" value="${p.price ? (p.price / 100).toFixed(2) : ""}"></label>
      <label>Eski fiyat (₺, opsiyonel)<input name="old" inputmode="decimal" value="${p.old ? (p.old / 100).toFixed(2) : ""}"></label>
      <label>Stok<input name="stock" type="number" min="0" value="${p.stock}"></label>
      <label>Bölge Rozeti<input name="region" value="${esc(p.region || "🇹🇷 TR Hesap")}"></label>
      <label>Teslimat Tipi<select name="delivery"><option value="key" ${p.delivery !== "topup" ? "selected" : ""}>🔑 Dijital Kod (Key Vault)</option><option value="topup" ${p.delivery === "topup" ? "selected" : ""}>⚡ Oyuncu ID (Top-Up)</option></select></label>
      <label>Etiket (opsiyonel)<input name="tag" value="${esc(p.tag || "")}"></label>
      <label class="w">Açıklama<textarea name="desc">${esc(p.desc || "")}</textarea></label>
      <label class="w" style="display:flex;gap:8px;align-items:center"><input name="active" type="checkbox" style="width:auto;margin:0" ${p.active !== false ? "checked" : ""}>Satışta (aktif)</label>
      <p class="err w" id="pe" role="alert"></p>
      <div class="w"><button class="btn">Kaydet</button> <button type="button" class="sm" data-pc>Vazgeç</button></div>
    </form>`;
  }

  const AD = {
    dash: () => {
      const all = allOrders(), ok = all.filter(o => o.status == "paid" || o.status == "done"), low = PRODUCTS.filter(p => p.stock <= 10);
      return H("Yönetim Dashboard") + `<div class="kp"><div class="k"><small>Onaylı Ciro</small><b>${TRY(ok.reduce((a, o) => a + o.total, 0))}</b></div><div class="k"><small>Bekleyen Sipariş</small><b>${all.filter(o => o.status == "wait" || o.status == "paid").length}</b></div><div class="k"><small>Toplam Sipariş</small><b>${all.length}</b></div><div class="k"><small>Aktif Ürün</small><b>${PRODUCTS.filter(p => p.active !== false).length}/${PRODUCTS.length}</b></div></div>
      <h3 style="margin-bottom:10px">Düşük Stok Uyarıları (≤10)</h3>${low.length ? `<div class="tw"><table>${low.map(p => `<tr><td>${esc(p.name)} ${esc(p.variant)}</td><td>${p.stock} adet</td></tr>`).join("")}</table></div>` : `<p class="note">Düşük stoklu ürün yok.</p>`}
      <h3 style="margin:20px 0 10px">Son Siparişler</h3>${ordT(all.slice(0, 8), 1)}`;
    },
    prod: () => {
      if (PG.edit) return pform(PG.edit);
      return `<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px"><h2 style="font-size:20px">Ürün Yönetimi</h2><button class="btn" data-new>+ Yeni Ürün</button></div>
      <div class="tw"><table><tr><th>Ürün</th><th>Bölge / Tip</th><th>Fiyat</th><th>Stok</th><th>Durum</th><th></th></tr>${PRODUCTS.map(p => `<tr><td><b>${esc(p.name)}</b><br><small style="color:var(--tx2)">${esc(p.variant)}</small></td><td>${esc(p.region || "TR")} · ${p.delivery === "topup" ? "ID Yükleme" : "E-Pin"}</td><td>${TRY(p.price)}</td><td>${p.stock}</td><td>${p.active === false ? "Pasif" : "Aktif"}</td><td><button class="sm" data-pe="${p.id}">Düzenle</button> <button class="sm dg" data-pd="${p.id}">Sil</button></td></tr>`).join("")}</table></div>`;
    },
    cat: () => H("Kategoriler") + `<form class="fm" id="cf" novalidate style="margin-bottom:20px"><label>Yeni kategori adı<input name="name"></label><label>Renk<input name="color" type="color" value="#8b3dff" style="height:42px;padding:4px"></label><p class="err w" id="ce" role="alert"></p><div class="w"><button class="btn">Kategori Ekle</button></div></form><div class="tw"><table><tr><th>Kategori</th><th>Ürün</th><th></th></tr>${CATS.slice(1).map(c => `<tr><td><span style="display:inline-block;width:12px;height:12px;border-radius:4px;background:${esc(c[2])};margin-right:8px"></span>${esc(c[1])}</td><td>${PRODUCTS.filter(p => p.cat == c[0]).length}</td><td><button class="sm dg" data-cd="${c[0]}">Sil</button></td></tr>`).join("")}</table></div>`,
    ord: () => H("Sipariş ve Ödeme Bildirimi Onayı") + `<p class="note" style="margin:-8px 0 12px">Sipariş durumunu 'Teslim edildi' yaptığınızda müşterinin Kod Kasası otomatik olarak açılır.</p>` + ordT(allOrders(), 1),
    sup: () => {
      const allT = TK.get();
      return H("Müşteri Destek Talepleri") + (allT.length ? `<div class="tw"><table><tr><th>No</th><th>Müşteri</th><th>Sipariş</th><th>Konu & Mesaj</th><th>Yanıtla</th></tr>${allT.map(t => `<tr><td>#${t.id}</td><td>${esc(t.user)}</td><td>${esc(t.ord)}</td><td><b>${esc(t.sub)}</b><br><small>${esc(t.msg)}</small></td><td>${t.reply ? `<span class="bd done">${esc(t.reply)}</span>` : `<form class="tkReply" data-tid="${t.id}" style="display:flex;gap:6px"><input name="rep" placeholder="Yanıt yaz..." required style="padding:6px 8px;border-radius:8px;border:1px solid var(--bd);background:var(--card);color:#fff"><button class="sm">Gönder</button></form>`}</td></tr>`).join("")}</table></div>` : `<p class="note">Açık destek talebi yok.</p>`);
    }
  };

  function pgClick(t) {
    const d = t.dataset;
    if ((d.pe || d.pd || d.cd || "new" in d) && !isAdmin()) return true;
    if (d.tab) { PG.tab = d.tab; PG.edit = null; pageRender(); }
    else if (d.go == "admin") pageOpen("admin", "dash");
    else if (d.go == "prof") pageOpen("prof", "ov");
    else if (d.go == "out") logout();
    else if (t.id == "pgx") pageClose();
    else if ("new" in d) { PG.edit = "new"; pageRender(); }
    else if (d.pe) { PG.edit = d.pe; pageRender(); }
    else if ("pc" in d) { PG.edit = null; pageRender(); }
    else if (d.pd || d.cd) {
      if (!d.arm) { t.dataset.arm = 1; t.textContent = "Emin misiniz?"; return true; }
      if (d.pd) { const i = PRODUCTS.findIndex(p => p.id == d.pd); if (i > -1) PRODUCTS.splice(i, 1); delete S.cart[d.pd]; save(); cart(); }
      else if (PRODUCTS.some(p => p.cat == d.cd)) { toast("Bu kategoride ürün var"); return true; }
      else { CATS.splice(CATS.findIndex(c => c[0] == d.cd), 1); if (S.cat == d.cd) S.cat = "all"; }
      saveCat(); pageRender(); toast("Silindi");
    } else return false;
    return true;
  }

  document.addEventListener("change", e => {
    const s = e.target;
    if (!s.dataset || !s.dataset.st || !isAdmin()) return;
    const a = O.get(), o = (a[s.dataset.u] || []).find(x => x.no == s.dataset.st);
    if (o && ST[s.value]) {
      const was = o.status; o.status = s.value; O.set(a);
      if ((was == "cancel") != (s.value == "cancel")) {
        const k = s.value == "cancel" ? 1 : -1;
        (o.items || []).forEach(it => { const p = PRODUCTS.find(x => x.id == it.i); if (p) p.stock = Math.max(0, p.stock + k * it.q); });
        saveCat();
      }
      pageRender(); toast("Sipariş durumu güncellendi");
    }
  });

  document.addEventListener("submit", async e => {
    const f = e.target, id = f.id;
    if (id === "payNoticeForm") {
      e.preventDefault();
      const no = f.dataset.no, ref = (new FormData(f).get("ref") || "").trim();
      if (!ref) return;
      const all = O.get(), list = all[ME] || [], o = list.find(x => x.no == no);
      if (o) { o.ref = ref; o.status = "paid"; O.set(all); orderView(o); toast("Ödeme bildiriminiz iletildi!"); }
      return;
    }
    if (id === "walForm") {
      e.preventDefault();
      const amt = Math.round(parseFloat(new FormData(f).get("amt") || 0) * 100);
      if (!(amt >= 1000 && amt <= 5000000)) return toast("Geçerli bir tutar girin (10 TL - 50.000 TL)");
      const us = U.get(), u = us[ME];
      u.balance = (u.balance || 0) + amt;
      U.set(us); upd(); pageRender();
      toast(`${TRY(amt)} cüzdanınıza eklendi!`);
      return;
    }
    if (id === "tkForm") {
      e.preventDefault();
      const fd = new FormData(f);
      const all = TK.get();
      all.unshift({ id: Date.now().toString(36).slice(-5).toUpperCase(), user: ME, ord: fd.get("ord"), sub: fd.get("sub"), msg: fd.get("msg"), ts: Date.now() });
      TK.set(all); pageRender(); toast("Destek talebiniz açıldı");
      return;
    }
    if (f.classList.contains("tkReply") && isAdmin()) {
      e.preventDefault();
      const tid = f.dataset.tid, rep = new FormData(f).get("rep");
      const all = TK.get(), t = all.find(x => x.id == tid);
      if (t) { t.reply = rep; TK.set(all); pageRender(); toast("Yanıt gönderildi"); }
      return;
    }
    if (!["sf", "pf", "cf"].includes(id)) return;
    e.preventDefault();
    if (!ME || (id != "sf" && !isAdmin())) return;
    const d = Object.fromEntries(new FormData(f));
    if (id == "sf") {
      const us = U.get(), u = us[ME], nm = (d.name || "").trim();
      if (nm.length < 2) return ($("#se").textContent = "Ad soyad girin.");
      u.name = nm; U.set(us); upd(); pageRender(); toast("Bilgiler güncellendi");
    } else if (id == "cf") {
      const n = (d.name || "").trim(), slug = n.toLocaleLowerCase("tr").replace(/[^a-z0-9]+/g, "-");
      if (n.length < 2) return;
      CATS.push([slug, n, d.color || "#8B3DFF", n[0].toLocaleUpperCase("tr")]);
      saveCat(); pageRender(); toast("Kategori eklendi");
    } else if (id == "pf") {
      const pid = f.dataset.id, price = kr(d.price), old = d.old ? kr(d.old) : 0, stock = parseInt(d.stock, 10) || 0;
      if (!d.name || !(price > 0)) return ($("#pe").textContent = "Ad ve geçerli fiyat girin.");
      const p = pid == "new" ? { id: "p" + Date.now().toString(36), sold: 0, rating: 5.0, reviews: 1 } : PRODUCTS.find(x => x.id == pid);
      if (!p) return;
      const col = (CATS.find(c => c[0] == d.cat) || [0, 0, "#8B3DFF"])[2], nm = d.name.trim();
      Object.assign(p, { name: nm, cat: d.cat, variant: (d.variant || "").trim(), price, old: old || undefined, stock, region: (d.region || "🇹🇷 TR").trim(), delivery: d.delivery || "key", tag: (d.tag || "").trim() || undefined, desc: (d.desc || "").trim(), active: !!d.active, g: p.g || `linear-gradient(135deg,#0B1224,${col})`, lbl: p.lbl || nm.split(" ")[0].toLocaleUpperCase("tr") });
      if (pid == "new") PRODUCTS.push(p);
      saveCat(); PG.edit = null; pageRender(); toast("Ürün kaydedildi");
    }
  });

  /* ===== BAŞLATMA ===== */
  const initParams = new URLSearchParams(location.search);
  if (initParams.get("cat") && CATS.some(c => c[0] === initParams.get("cat"))) S.cat = initParams.get("cat");
  if (initParams.get("sort")) S.sort = initParams.get("sort");

  ticker(); cats(); brands(); camps(); hero(); list(); cart(); upd(); updateRoute(false);

  let auto;
  const play = () => { clearInterval(auto); if (!matchMedia("(prefers-reduced-motion:reduce)").matches) auto = setInterval(() => go(S.slide + 1), 6000); };
  play();
  $("#hero").addEventListener("mouseenter", () => clearInterval(auto));
  $("#hero").addEventListener("mouseleave", play);
})();
