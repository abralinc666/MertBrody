'use strict';

const state = { products: [], category: 'Tümü', cart: readCart() };
const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);

function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem('sepetim-demo-cart') || '[]');
    return Array.isArray(value) ? value.filter((item) => typeof item.id === 'string' && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 20) : [];
  } catch { return []; }
}
function saveCart() { localStorage.setItem('sepetim-demo-cart', JSON.stringify(state.cart)); }
function notify(message) {
  const toast = $('#toast'); toast.textContent = message; toast.classList.add('show');
  clearTimeout(notify.timer); notify.timer = setTimeout(() => toast.classList.remove('show'), 2100);
}
function visibleProducts() {
  const query = $('#searchInput').value.trim().toLocaleLowerCase('tr-TR');
  return state.products.filter((p) => (state.category === 'Tümü' || p.category === state.category) && `${p.name} ${p.category}`.toLocaleLowerCase('tr-TR').includes(query));
}
function renderProducts() {
  const products = visibleProducts();
  $('#productGrid').innerHTML = products.length ? products.map((p) => `
    <article class="product-card">
      <div class="product-visual ${p.color}">${p.badge ? `<span class="badge">${p.badge}</span>` : ''}<span class="emoji" aria-hidden="true">${p.icon}</span></div>
      <div class="product-meta"><div class="product-category">${p.category}</div><h3 class="product-name">${p.name}</h3><div class="product-bottom"><div class="product-price">${money(p.price)} <span class="product-unit">/ ${p.unit}</span></div><button class="add-button" data-add="${p.id}" aria-label="${p.name} sepete ekle">+</button></div></div>
    </article>`).join('') : '<div class="loading">Aramana uygun ürün bulunamadı.</div>';
  if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.fromTo('.product-card', { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: .35, stagger: .045, ease: 'power2.out' });
}
function cartLines() {
  return state.cart.map((line) => { const product = state.products.find((p) => p.id === line.id); return product ? { ...product, quantity: line.quantity } : null; }).filter(Boolean);
}
function renderCart() {
  const lines = cartLines();
  const count = lines.reduce((sum, item) => sum + item.quantity, 0);
  const total = lines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  $('#cartCount').textContent = count;
  $('#cartTotal').textContent = money(total);
  $('#cartItems').innerHTML = lines.length ? lines.map((p) => `
    <div class="cart-row"><div class="cart-thumb ${p.color}">${p.icon}</div><div><strong>${p.name}</strong><small>${money(p.price)} / ${p.unit}</small><div class="quantity"><button data-qty="${p.id}" data-delta="-1" aria-label="Azalt">−</button><span>${p.quantity}</span><button data-qty="${p.id}" data-delta="1" aria-label="Artır">+</button></div></div><span class="row-price">${money(p.price * p.quantity)}</span></div>`).join('') : '<div class="empty-cart">Sepetin henüz boş.<br>Beğendiğin ürünleri ekleyebilirsin.</div>';
}
function addToCart(id) {
  const line = state.cart.find((item) => item.id === id);
  if (line) { if (line.quantity >= 20) return notify('Bir üründen en fazla 20 adet ekleyebilirsin.'); line.quantity += 1; }
  else state.cart.push({ id, quantity: 1 });
  saveCart(); renderCart(); notify('Ürün sepete eklendi.');
}
function changeQuantity(id, delta) {
  const line = state.cart.find((item) => item.id === id); if (!line) return;
  line.quantity += delta; if (line.quantity <= 0) state.cart = state.cart.filter((item) => item.id !== id);
  if (line.quantity > 20) line.quantity = 20;
  saveCart(); renderCart();
}
function openCart() { $('#cartDrawer').classList.add('open'); $('#cartDrawer').setAttribute('aria-hidden', 'false'); $('#overlay').classList.add('show'); document.body.style.overflow = 'hidden'; }
function closeCart() { $('#cartDrawer').classList.remove('open'); $('#cartDrawer').setAttribute('aria-hidden', 'true'); $('#overlay').classList.remove('show'); document.body.style.overflow = ''; }
function showModal() { $('#demoModal').classList.add('show'); }

async function init() {
  try {
    const response = await fetch('/api/products'); if (!response.ok) throw new Error('Ürün servisi yanıt vermedi.');
    const data = await response.json(); state.products = data.products;
    state.cart = state.cart.filter((line) => state.products.some((p) => p.id === line.id));
    saveCart(); renderProducts(); renderCart();
  } catch (error) { $('#productGrid').innerHTML = `<div class="loading">${error.message}</div>`; }
  if (window.gsap && !matchMedia('(prefers-reduced-motion: reduce)').matches) gsap.from('.hero-copy > *', { y: 18, opacity: 0, duration: .65, stagger: .09, ease: 'power2.out' });
}

$('#productGrid').addEventListener('click', (event) => { const button = event.target.closest('[data-add]'); if (button) addToCart(button.dataset.add); });
$('#cartItems').addEventListener('click', (event) => { const button = event.target.closest('[data-qty]'); if (button) changeQuantity(button.dataset.qty, Number(button.dataset.delta)); });
$('#filters').addEventListener('click', (event) => { const button = event.target.closest('[data-category]'); if (!button) return; state.category = button.dataset.category; document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button)); renderProducts(); });
$('#searchInput').addEventListener('input', renderProducts);
$('#openCart').addEventListener('click', openCart); $('#closeCart').addEventListener('click', closeCart); $('#overlay').addEventListener('click', closeCart);
$('#checkoutButton').addEventListener('click', async () => {
  if (!state.cart.length) return notify('Önce sepetine ürün eklemelisin.');
  const button = $('#checkoutButton'); button.disabled = true; button.textContent = 'Kontrol ediliyor...';
  try {
    const response = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: state.cart }) });
    const result = await response.json();
    if (result.status === 'payment_provider_required') showModal(); else notify(result.error || 'İşlem tamamlanamadı.');
  } catch { notify('Sunucuya ulaşılamadı.'); }
  finally { button.disabled = false; button.innerHTML = 'Devam et <span>↗</span>'; }
});
$('#closeModal').addEventListener('click', () => $('#demoModal').classList.remove('show'));
$('#modalOk').addEventListener('click', () => $('#demoModal').classList.remove('show'));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeCart(); $('#demoModal').classList.remove('show'); } });
init();
