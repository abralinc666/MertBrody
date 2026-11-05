import './hero3d.js';

const $ = (s, el = document) => el.querySelector(s);
const tl = (n) => n.toLocaleString('tr-TR', { style: 'currency', currency: 'TRY' });
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const anim = (fn) => { if (window.gsap && !RM) fn(window.gsap); };

const state = { games: [], products: [], game: 'all', q: '', cart: load() };
function load() { try { return JSON.parse(localStorage.getItem('epin-cart')) || {}; } catch { return {}; } }
function save() { try { localStorage.setItem('epin-cart', JSON.stringify(state.cart)); } catch { /* özel mod */ } }

const gameOf = (slug) => state.games.find((g) => g.slug === slug);
const theme = (g) => `--c1:${g.c1};--c2:${g.c2}`;
const amount = (p) => { const m = p.name.match(/([\d.]+)\s*(.*)$/); return m ? `${m[1]} ${m[2]}` : p.name; };
const art = (p, cls = 'art') => { const g = gameOf(p.game); return `<div class="${cls}" style="${theme(g)}"><small>${esc(g.name)}</small><strong>${esc(amount(p))}</strong></div>`; };

let toastTimer;
function toast(msg) { const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200); }

/* ---------- menü ---------- */
function renderMenu() {
  const item = (id, label, extra = '') => `<button class="nav${state.game === id ? ' on' : ''}" data-go="${id}">${label}${extra}</button>`;
  $('#menu').innerHTML =
    item('all', 'Ana sayfa') +
    '<div class="label">Oyunlar</div>' +
    state.games.map((g) => item(g.slug, esc(g.name))).join('') +
    '<div class="label">Hesap</div>' +
    '<button class="nav" aria-disabled="true">Bakiye yükle<em class="pill">YAKINDA</em></button>' +
    '<button class="nav" aria-disabled="true">Destek<em class="pill">YAKINDA</em></button>';
}
function openSide(open) {
  $('#side').classList.toggle('open', open);
  $('#scrim').classList.toggle('show', open);
  if (open) anim((g) => g.fromTo('#menu > *', { x: -22, opacity: 0 }, { x: 0, opacity: 1, duration: .5, stagger: .025, delay: .08, ease: 'power3.out', clearProps: 'transform,opacity' }));
}

/* ---------- vitrin ---------- */
function renderGames() {
  $('#games').innerHTML = state.games.map((g) => {
    const n = state.products.filter((p) => p.game === g.slug).length;
    return `<button class="game" data-go="${g.slug}" style="${theme(g)}"><b>${esc(g.name)}</b><small>${n ? n + ' paket' : 'Yakında'}</small></button>`;
  }).join('');
}
function renderChips() {
  const all = [{ slug: 'all', name: 'Hepsi' }, ...state.games];
  $('#chips').innerHTML = all.map((g) => `<button class="chip${state.game === g.slug ? ' on' : ''}" role="tab" aria-selected="${state.game === g.slug}" data-go="${g.slug}">${esc(g.name)}</button>`).join('');
}
function renderGrid(animate = true) {
  const q = state.q.trim().toLocaleLowerCase('tr');
  const list = state.products.filter((p) => (state.game === 'all' || p.game === state.game) && (!q || p.name.toLocaleLowerCase('tr').includes(q)));
  const g = gameOf(state.game);
  $('#listTitle').textContent = g ? g.name + ' paketleri' : 'Tüm paketler';
  $('#grid').innerHTML = list.length ? list.map((p) => `
    <button class="card" data-id="${p.id}" style="${theme(gameOf(p.game))}" ${p.inStock ? '' : 'disabled'}>
      ${art(p)}${p.featured ? '<span class="star">AVANTAJLI</span>' : ''}
      <div class="card-b"><span class="price">${tl(p.price)}</span>${p.inStock ? '<span class="plus" aria-hidden="true">+</span>' : '<small>Stokta yok</small>'}</div>
    </button>`).join('') : '<div class="empty">Bu seçimde şu an paket yok.</div>';
  if (animate && list.length) anim((gs) => gs.fromTo('#grid .card', { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .55, stagger: .04, ease: 'power3.out', clearProps: 'transform,opacity' }));
}
function setGame(slug, scroll) {
  state.game = slug; renderMenu(); renderChips(); renderGrid();
  openSide(false);
  if (scroll) $('#paketler').scrollIntoView({ behavior: RM ? 'auto' : 'smooth' });
}

/* ---------- ürün penceresi ---------- */
function openProduct(id) {
  const p = state.products.find((x) => x.id === id); if (!p) return;
  let qty = 1;
  const d = $('#dlg');
  d.innerHTML = `<button class="icon-btn x" aria-label="Kapat" data-close><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    ${art(p)}
    <div class="dlg-b"><h3 id="dlgTitle">${esc(p.name)}</h3><p>${esc(p.description)}</p>
      <div class="row"><b class="price">${tl(p.price)}</b>
        <div class="qty"><button data-q="-1" aria-label="Azalt">−</button><output>1</output><button data-q="1" aria-label="Artır">+</button></div></div>
      <button class="btn wide" data-add>Sepete ekle</button></div>`;
  d.onclick = (e) => {
    if (e.target === d || e.target.closest('[data-close]')) return d.close();
    const q = e.target.closest('[data-q]');
    if (q) { qty = Math.min(10, Math.max(1, qty + +q.dataset.q)); $('output', d).textContent = qty; }
    if (e.target.closest('[data-add]')) { addToCart(p.id, qty); d.close(); }
  };
  d.showModal();
  anim((g) => g.from(d, { scale: .94, y: 16, opacity: 0, duration: .4, ease: 'power3.out', clearProps: 'all' }));
}

/* ---------- sepet ---------- */
function addToCart(id, n = 1) { state.cart[id] = Math.min(10, (state.cart[id] || 0) + n); save(); renderCart(); toast('Sepete eklendi'); }
function renderCart() {
  const ids = Object.keys(state.cart).filter((id) => state.products.some((p) => p.id === +id));
  const count = ids.reduce((s, id) => s + state.cart[id], 0);
  const badge = $('#cartCount'); badge.hidden = !count; badge.textContent = count;
  let total = 0;
  $('#cartBody').innerHTML = ids.length ? ids.map((id) => {
    const p = state.products.find((x) => x.id === +id), n = state.cart[id]; total += p.price * n;
    return `<div class="line" style="${theme(gameOf(p.game))}">${art(p, 'art mini')}
      <div><b>${esc(p.name)}</b><small>${tl(p.price)}</small></div>
      <div class="qty"><button data-cq="${id}" data-d="-1" aria-label="Azalt">−</button><output>${n}</output><button data-cq="${id}" data-d="1" aria-label="Artır">+</button></div></div>`;
  }).join('') : '<div class="ok"><p>Sepetin boş.</p></div>';
  $('#cartTotal').textContent = tl(total);
  $('#checkout').disabled = !ids.length;
}
function openCart(open) {
  const c = $('#cart'); c.classList.toggle('open', open); c.setAttribute('aria-hidden', !open);
  $('#scrim').classList.toggle('show', open);
}
async function checkout() {
  const items = Object.entries(state.cart).map(([id, qty]) => ({ id: +id, qty }));
  const btn = $('#checkout'); btn.disabled = true; btn.textContent = 'Gönderiliyor…';
  try {
    const r = await fetch('/api/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Sipariş oluşturulamadı.');
    state.cart = {}; save(); renderCart();
    $('#cartBody').innerHTML = `<div class="ok"><h4>Sipariş talebi alındı</h4><p>Referans: <b>${esc(data.ref)}</b><br>Toplam: ${tl(data.total)}</p><p style="margin-top:14px">Bu bir demo önizlemesidir: ödeme alınmadı ve sipariş kaydedilmedi.</p></div>`;
  } catch (e) { toast(e.message); }
  btn.textContent = 'Siparişi tamamla'; btn.disabled = !Object.keys(state.cart).length;
}

/* ---------- olaylar ---------- */
document.addEventListener('click', (e) => {
  const go = e.target.closest('[data-go]'); if (go) { e.preventDefault(); setGame(go.dataset.go, go.dataset.go !== 'all' || !go.classList.contains('brand')); return; }
  const card = e.target.closest('.card[data-id]'); if (card) return openProduct(+card.dataset.id);
  const cq = e.target.closest('[data-cq]');
  if (cq) { const id = cq.dataset.cq, n = (state.cart[id] || 0) + +cq.dataset.d; if (n < 1) delete state.cart[id]; else state.cart[id] = Math.min(10, n); save(); renderCart(); }
});
$('#menuBtn').onclick = () => openSide(true);
$('#cartBtn').onclick = () => openCart(true);
$('#cartClose').onclick = () => openCart(false);
$('#scrim').onclick = () => { openSide(false); openCart(false); };
$('#checkout').onclick = checkout;
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { openSide(false); openCart(false); } });
let t; $('#q').oninput = (e) => { clearTimeout(t); t = setTimeout(() => { state.q = e.target.value; renderGrid(false); }, 120); };
$('#year').textContent = new Date().getFullYear();

/* ---------- başlat ---------- */
(async function init() {
  try {
    const r = await fetch('/api/products'); if (!r.ok) throw 0;
    Object.assign(state, await r.json());
  } catch {
    $('#grid').innerHTML = '<div class="empty">Paketler yüklenemedi. Sayfayı yenile.</div>'; return;
  }
  renderMenu(); renderGames(); renderChips(); renderGrid(false); renderCart();
  anim((g) => {
    g.from('.hero-in > *', { y: 28, opacity: 0, duration: .8, stagger: .1, ease: 'power3.out', clearProps: 'all' });
    g.from('.game', { y: 20, opacity: 0, duration: .6, stagger: .06, delay: .25, ease: 'power3.out', clearProps: 'all' });
  });
})();
