import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { gsap } from 'gsap';
import productsData from './products.json';
import './styles.css';

const money = (value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(value);
const CART_KEY = 'market-demo-cart';
function readCart() {
  try {
    const value = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    return Array.isArray(value) ? value.filter((x) => Number.isInteger(x.id) && Number.isInteger(x.qty) && x.qty > 0) : [];
  } catch { return []; }
}

function App() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Tümü');
  const [sort, setSort] = useState('recommended');
  const [cart, setCart] = useState(readCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [notice, setNotice] = useState('');

  const visibleProducts = useMemo(() => {
    let result = productsData.filter((p) => {
      const matchesQuery = `${p.name} ${p.category}`.toLocaleLowerCase('tr').includes(query.trim().toLocaleLowerCase('tr'));
      return matchesQuery && (category === 'Tümü' || p.category === category);
    });
    if (sort === 'price-asc') result = [...result].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [query, category, sort]);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    if (visibleProducts.length) {
      gsap.fromTo('.product-card', { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .32, stagger: .025, ease: 'power2.out' });
    }
  }, [cart, visibleProducts]);

  useEffect(() => {
    document.body.style.overflow = cartOpen ? 'hidden' : '';
    const onKey = (event) => { if (event.key === 'Escape') setCartOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey); };
  }, [cartOpen]);

  const cartProducts = cart.map((item) => ({ ...item, product: productsData.find((p) => p.id === item.id) })).filter((x) => x.product);
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const cartTotal = cartProducts.reduce((sum, item) => sum + item.product.price * item.qty, 0);

  function addToCart(id) {
    setCart((current) => {
      const found = current.find((item) => item.id === id);
      return found ? current.map((item) => item.id === id ? { ...item, qty: item.qty + 1 } : item) : [...current, { id, qty: 1 }];
    });
    setNotice('Ürün sepetinize eklendi.');
    window.setTimeout(() => setNotice(''), 1600);
  }
  function changeQty(id, amount) {
    setCart((current) => current.map((item) => item.id === id ? { ...item, qty: item.qty + amount } : item).filter((item) => item.qty > 0));
  }
  function removeItem(id) { setCart((current) => current.filter((item) => item.id !== id)); }
  function chooseCategory(value) {
    setCategory(value);
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }
  function submitSearch(event) {
    event.preventDefault();
    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
  }

  return <>
    <div className="topline"><div className="wrap"><span>Alışverişin kolay yolu</span><nav><a href="#about">Hakkımızda</a><a href="#support">Yardım</a><a href="#footer">İletişim</a></nav></div></div>
    <header className="header">
      <div className="wrap header-main">
        <a className="brand" href="#top" aria-label="Market ana sayfa"><span className="brand-symbol">M</span><span>market<span className="brand-dot">.</span></span></a>
        <form className="search" onSubmit={submitSearch}><input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ne aramıştınız?" aria-label="Ürün ara" /><button type="submit" aria-label="Ara">⌕</button></form>
        <div className="header-actions"><a className="account" href="#account"><span className="icon">♙</span><span><b>Hesabım</b><small>Üyelik işlemleri</small></span></a><button className="cart-button" onClick={() => setCartOpen(true)}><span className="icon">🛒</span><span><b>Sepetim</b><small><i>{cartCount}</i> ürün</small></span></button></div>
      </div>
      <div className="nav"><div className="wrap nav-inner"><a className="selected" href="#campaigns">Ana Sayfa</a><a href="#products">Tüm Ürünler</a><a href="#products" onClick={() => chooseCategory('Elektronik')}>Elektronik</a><a href="#products" onClick={() => chooseCategory('Ev & Yaşam')}>Ev & Yaşam</a><a href="#products" onClick={() => chooseCategory('Anne & Yaşam')}>Anne & Yaşam</a><a href="#products" onClick={() => chooseCategory('Outdoor')}>Outdoor</a><a href="#campaigns">Kampanyalar</a></div></div>
    </header>
    <main id="top">
      <section className="wrap hero-section" id="campaigns">
        <div className="hero-main"><div className="hero-copy"><span className="eyebrow">HAFTANIN FIRSATLARI</span><h1>Aradığın her şey,<br /><em>tek bir yerde.</em></h1><p>Günlük ihtiyaçlardan teknolojiye, seçili ürünleri keşfet.</p><a className="hero-cta" href="#products">Alışverişe başla <b>→</b></a></div><div className="hero-art"><div className="hero-orbit"></div><img id="heroProductImage" src="/assets/products/a2f1729f1c0ba6a4ab070b080e8d2d87cdf1787f.jpg" alt="Öne çıkan ürün" /></div><div className="hero-pagination"><span className="active"></span><span></span><span></span></div></div>
        <div className="hero-side"><article className="side-promo promo-yellow"><span>EV & YAŞAM</span><h2>Yaşam alanına<br />yenilik kat.</h2><a href="#products" onClick={() => chooseCategory('Ev & Yaşam')}>Ürünleri keşfet →</a><img src="/assets/products/0f0e7d371a9480cde33e3b52f1dc0ba7dbe39446.jpg" alt="Ev yaşam ürünü" /></article><article className="side-promo promo-light"><span>TEKNOLOJİ</span><h2>Yeni nesil<br />alışveriş.</h2><a href="#products" onClick={() => chooseCategory('Elektronik')}>Fırsatlara göz at →</a><img src="/assets/products/5eda588454cfe218d54690883cf17084ae490fd0.jpg" alt="Teknoloji ürünü" /></article></div>
      </section>
      <section className="wrap benefit-row"><div><b>✓</b><span><strong>Güvenli alışveriş</strong><small>Korunan alışveriş deneyimi</small></span></div><div><b>↗</b><span><strong>Özenle seçilmiş ürünler</strong><small>İhtiyacına uygun seçenekler</small></span></div><div><b>⌂</b><span><strong>Kolay keşif</strong><small>Aradığını hızlıca bul</small></span></div><div><b>♡</b><span><strong>Her zaman yanında</strong><small>Destek ve bilgilendirme</small></span></div></section>
      <section className="wrap category-section"><div className="section-heading"><div><span className="eyebrow">KATEGORİLER</span><h2>İhtiyacına göre keşfet</h2></div><a href="#products">Tüm kategoriler <b>→</b></a></div><div className="category-cards"><button className="category-card" onClick={() => chooseCategory('Elektronik')}><span className="category-icon">⌁</span><b>Elektronik</b><small>Teknoloji ve aksesuar</small></button><button className="category-card" onClick={() => chooseCategory('Ev & Yaşam')}><span className="category-icon">⌂</span><b>Ev & Yaşam</b><small>Yaşam alanına dokunuş</small></button><button className="category-card" onClick={() => chooseCategory('Anne & Yaşam')}><span className="category-icon">♡</span><b>Anne & Yaşam</b><small>Günlük ihtiyaçlar</small></button><button className="category-card" onClick={() => chooseCategory('Outdoor')}><span className="category-icon">△</span><b>Outdoor</b><small>Keşif ve açık hava</small></button></div></section>
      <section className="products-section" id="products"><div className="wrap"><div className="section-heading product-heading"><div><span className="eyebrow">SENİN İÇİN SEÇTİK</span><h2>Öne çıkan ürünler</h2><p><strong>{visibleProducts.length}</strong> ürün listeleniyor</p></div><div className="sort-tools"><label htmlFor="categorySelect">Kategori</label><select id="categorySelect" value={category} onChange={(e) => setCategory(e.target.value)}><option value="Tümü">Tüm kategoriler</option><option>Elektronik</option><option>Ev & Yaşam</option><option>Anne & Yaşam</option><option>Outdoor</option></select><label htmlFor="sortSelect">Sırala</label><select id="sortSelect" value={sort} onChange={(e) => setSort(e.target.value)}><option value="recommended">Önerilen</option><option value="price-asc">Fiyat artan</option><option value="price-desc">Fiyat azalan</option></select></div></div>
        <div className="product-grid" aria-live="polite">{visibleProducts.map((product) => <article className="product-card" key={product.id}><div className="product-image">{product.badge && <span className="product-badge">{product.badge}</span>}<img loading="lazy" src={product.image} alt={product.name} onError={(e) => { e.currentTarget.src = '/assets/image-unavailable.svg'; }} /></div><div className="product-info"><h3 className="product-name">{product.name}</h3><span className="old-price">{product.oldPrice > product.price ? money(product.oldPrice) : ''}</span><div className="product-foot"><strong className="product-price">{money(product.price)}</strong><button className="add-button" onClick={() => addToCart(product.id)}>SEPETE EKLE</button></div></div></article>)}</div>
        {visibleProducts.length === 0 && <div className="empty-state">Aramanızla eşleşen ürün bulunamadı.</div>}
      </div></section>
      <section className="wrap bottom-banner" id="about"><div><span className="eyebrow">MARKETİ KEŞFET</span><h2>İyi alışveriş,<br />doğru seçimle başlar.</h2><p>Farklı kategorilerdeki ürünleri tek ekranda incele.</p><a href="#products">Ürünlere göz at →</a></div><div className="banner-images"><img src="/assets/products/1adb5ea931af45d2fc42d520fcf533b760eb818d.jpg" alt="Ürün" /><img src="/assets/products/9494c093195fe4adcb4b40684f2e119f67ed8510.jpg" alt="Ürün" /></div></section>
    </main>
    <footer className="footer" id="footer"><div className="wrap footer-grid"><div><a className="brand" href="#top"><span className="brand-symbol">M</span><span>market<span className="brand-dot">.</span></span></a><p>Bağımsız online mağaza arayüzü.</p></div><div><b>Kurumsal</b><a href="#about">Hakkımızda</a><a href="#footer">İletişim</a></div><div id="support"><b>Yardım</b><a href="#support">Sıkça sorulan sorular</a><a href="#support">Teslimat bilgileri</a></div><div><b>Bilgilendirme</b><p>Bu proje arayüz demosudur. Gerçek ödeme, kart veya doğrulama bilgisi alınmaz.</p></div></div><div className="wrap copyright">© 2026 Market Demo. Bağımsız arayüz çalışması.</div></footer>
    <aside className={`cart-drawer ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}><div className="drawer-head"><h2>Sepetim</h2><button onClick={() => setCartOpen(false)} aria-label="Sepeti kapat">×</button></div><div className="cart-items">{cartProducts.length ? cartProducts.map((item) => <div className="cart-row" key={item.id}><img src={item.product.image} alt="" /><div>{item.product.name}<strong>{money(item.product.price)}</strong><div className="qty-controls"><button onClick={() => changeQty(item.id, -1)} aria-label="Azalt">−</button><span>{item.qty}</span><button onClick={() => changeQty(item.id, 1)} aria-label="Artır">+</button></div></div><button onClick={() => removeItem(item.id)} aria-label="Ürünü sil">×</button></div>) : <p className="cart-empty">Sepetiniz henüz boş.</p>}</div><div className="drawer-total"><span>Toplam</span><strong>{money(cartTotal)}</strong><button disabled={!cart.length} onClick={() => setNotice('Bu demo sürümünde ödeme işlemi yapılmaz.')}>Alışverişe devam et</button><small>Demo sürümünde ödeme işlemi yapılmaz.</small></div></aside>
    <div className={`drawer-backdrop ${cartOpen ? 'show' : ''}`} onClick={() => setCartOpen(false)} aria-hidden="true"></div>
    {notice && <div className="toast" role="status">{notice}</div>}
  </>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App /></React.StrictMode>);
