# EPIN — sade e-pin vitrini

HTML + CSS + JavaScript, GSAP animasyonları, three.js 3D arka plan ve Node.js (Vercel serverless) API.
Eski PHP/MySQL scriptinin vitrin tarafının yerine geçer; ürünler `veritabani.sql` dosyasından alındı (26 paket).

## Yapı
```
public/index.html   tek sayfa
public/style.css    tüm stiller
public/app.js       menü, filtre, ürün penceresi, sepet (+ GSAP)
public/hero3d.js    three.js hero arka planı (isteğe bağlı, hata olursa kendini kaldırır)
api/products.js     GET  /api/products
api/order.js        POST /api/order  (fiyatı sunucuda yeniden hesaplar)
lib/catalog.js      katalog yükleyici
data/products.json  oyunlar + ürünler
server.js           yerel geliştirme sunucusu (bağımlılık yok)
```

## Yerelde çalıştır
```
node server.js        # http://localhost:3000
```

## GitHub + Vercel
```
git init && git add . && git commit -m "ilk sürüm"
git branch -M main
git remote add origin https://github.com/KULLANICI/epin-modern.git
git push -u origin main
```
Vercel → **Add New → Project** → repoyu seç → **Framework Preset: Other** → Deploy.
Çıktı klasörü `vercel.json` içinde `public` olarak ayarlı, ayrıca ayar gerekmez.
Her branch/PR için otomatik önizleme (preview) adresi oluşur.

Ürün eklemek veya fiyat değiştirmek için `data/products.json` dosyasını düzenleyip push etmen yeterli.

## Bu sürümde YOK (bilerek)
- Ödeme (Shopier), üyelik/giriş, admin paneli, bakiye, kupon, destek, blog. `api/order.js` bir **demo**dur: sipariş saklamaz, ödeme almaz.
- Ürün görselleri (zip'te yoktu): oyuna özel renklerle üretilen kartlar kullanılır. `public/` altına görsel koyup `app.js` içindeki `art()` fonksiyonunu değiştirerek gerçek görsele geçebilirsin.

## Sıradaki adımlar
1. Veritabanı: Neon/Supabase (Postgres) → siparişler, kullanıcılar.
2. Ödeme: Shopier/iyzico/PayTR için ayrı bir `api/` fonksiyonu + webhook; teslimat (e-pin kodu) ödeme onayından sonra.
3. Giriş: Auth.js veya Supabase Auth.

## Önemli
Eski PHP dosyalarını (`baglan.php`, `shopierAPI.php` vb.) GitHub'a yükleme: veritabanı/Shopier anahtarları içerebilir. Bu repo onlara ihtiyaç duymaz.
