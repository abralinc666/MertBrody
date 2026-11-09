'use strict';
const $ = (selector) => document.querySelector(selector);
const money = (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
let cart = [];
try { cart = JSON.parse(localStorage.getItem('market-demo-cart') || '[]'); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
let products = [];
let catalogFallback = [];

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
}
async function loadProducts() {
  const params = new URLSearchParams({ q: $('#searchInput').value.trim(), category: $('#categorySelect').value, sort: $('#sortSelect').value });
  const response = await fetch(`/api/products?${params}`);
  if (!response.ok) throw new Error('Ürünler yüklenemedi.');
  const data = await response.json();
  products = data.items;
  renderProducts();
}
async function loadCatalog() {
  const response = await fetch('/api/products');
  if (!response.ok) throw new Error('Katalog yüklenemedi.');
  catalogFallback = (await response.json()).items;
}
function renderProducts() {
  const grid = $('#productGrid');
  $('#resultCount').textContent = products.length;
  $('#emptyState').hidden = products.length !== 0;
  grid.innerHTML = products.map((product) => `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image">${product.badge ? `<span class="product-badge">${escapeHtml(product.badge)}</span>` : ''}
        <img loading="lazy" src="${escapeHtml(product.image)}" alt="${escapeHtml(product.name)}">
      </div>
      <div class="product-info"><h3 class="product-name">${escapeHtml(product.name)}</h3>
        <span class="old-price">${product.oldPrice > product.price ? money(product.oldPrice) : ''}</span>
        <div class="product-foot"><strong class="product-price">${money(product.price)}</strong><button class="add-button" data-add="${product.id}">SEPETE EKLE</button></div>
      </div>
    </article>`).join('');
  if (window.gsap && products.length) gsap.fromTo('.product-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .32, stagger: .025, ease: 'power2.out' });
}
function getProduct(id) { return catalogFallback.find((product) => product.id === id); }
function saveCart() { localStorage.setItem('market-demo-cart', JSON.stringify(cart)); renderCart(); }
function renderCart() {
  $('#cartCount').textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  $('#cartItems').innerHTML = cart.length ? cart.map((item) => {
    const product = getProduct(item.id);
    if (!product) return '';
    return `<div class="cart-row"><img src="${escapeHtml(product.image)}" alt=""><div>${escapeHtml(product.name)}<strong>${money(product.price)}</strong><div class="qty-controls"><button data-dec="${product.id}" aria-label="Azalt">−</button><span>${item.qty}</span><button data-inc="${product.id}" aria-label="Artır">+</button></div></div><button data-remove="${product.id}" aria-label="Ürünü sil">×</button></div>`;
  }).join('') : '<p class="cart-empty">Sepetiniz henüz boş.</p>';
  const total = cart.reduce((sum, item) => { const product = getProduct(item.id); return sum + (product ? product.price * item.qty : 0); }, 0);
  $('#cartTotal').textContent = money(total);
  $('#demoCheckout').disabled = cart.length === 0;
}
function openCart(open) {
  $('#cartDrawer').classList.toggle('open', open);
  $('#backdrop').classList.toggle('show', open);
  $('#cartDrawer').setAttribute('aria-hidden', String(!open));
}
function selectCategory(category) {
  $('#categorySelect').value = category;
  loadProducts().then(() => $('#products').scrollIntoView({ behavior: 'smooth' })).catch(showError);
}
function showError(error) { console.error(error); $('#emptyState').hidden = false; $('#emptyState').textContent = 'İçerik yüklenirken bir sorun oluştu. Sayfayı yenileyin.'; }

$('#productGrid').addEventListener('click', (event) => {
  const button = event.target.closest('[data-add]');
  if (!button) return;
  const id = Number(button.dataset.add);
  const item = cart.find((entry) => entry.id === id);
  if (item) item.qty += 1; else cart.push({ id, qty: 1 });
  saveCart();
  button.textContent = 'EKLENDİ';
  setTimeout(() => { if (button.isConnected) button.textContent = 'SEPETE EKLE'; }, 850);
});
$('#cartItems').addEventListener('click', (event) => {
  const id = Number(event.target.dataset.inc || event.target.dataset.dec || event.target.dataset.remove);
  if (!id) return;
  const item = cart.find((entry) => entry.id === id);
  if (event.target.dataset.remove) cart = cart.filter((entry) => entry.id !== id);
  else if (event.target.dataset.inc) item.qty += 1;
  else if (item.qty > 1) item.qty -= 1;
  else cart = cart.filter((entry) => entry.id !== id);
  saveCart();
});
$('#cartToggle').addEventListener('click', () => openCart(true));
$('#cartClose').addEventListener('click', () => openCart(false));
$('#backdrop').addEventListener('click', () => openCart(false));
$('#searchForm').addEventListener('submit', (event) => { event.preventDefault(); loadProducts().catch(showError); $('#products').scrollIntoView({ behavior: 'smooth' }); });
$('#categorySelect').addEventListener('change', () => loadProducts().catch(showError));
$('#sortSelect').addEventListener('change', () => loadProducts().catch(showError));
document.querySelectorAll('[data-category], [data-navcat]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); selectCategory(element.dataset.category || element.dataset.navcat); }));
$('#demoCheckout').addEventListener('click', () => alert('Bu arayüz demo amaçlıdır. Gerçek ödeme işlemi yapılmaz.'));

Promise.all([loadCatalog(), loadProducts()]).then(renderCart).catch(showError);
