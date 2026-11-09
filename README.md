# Market — React static storefront

Bu proje Node.js/Express sunucusu çalıştırmaz. Arayüz React ile oluşturulmuştur; Vite yalnızca geliştirme ve derleme aracıdır. Vercel'e `dist/` klasörü statik site olarak dağıtılır.

## Termux'ta yerel geliştirme

Node.js yalnızca Vite geliştirme/derleme araçlarını çalıştırmak için gerekir; yayındaki sitede Node.js backend veya Express sunucusu yoktur.

```bash
npm install
npm run dev -- --host 0.0.0.0
```

## Vercel dağıtımı

1. ZIP'i açıp proje içeriğini GitHub deposunun kök dizinine yükleyin.
2. Vercel'de GitHub deposunu import edin.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Install Command: `npm install`

`vercel.json` SPA yönlendirmesini yapılandırır. Ürün verileri `src/products.json` dosyasından derleme sırasında pakete alınır; çalışma zamanında `/api/products` isteği yoktur. Ürün fotoğrafları `public/assets/products/` altındadır ve `/assets/products/...` yoluyla sunulur. Dosya adlarının büyük/küçük harfleri korunmalıdır (Vercel Linux üzerinde büyük/küçük harfe duyarlıdır).

## İçerik

- React 18 + Vite
- Mevcut arayüzün HTML/CSS yerleşimi korunarak React bileşenlerine taşınmış sayfa
- 48 ürünlük yerel JSON katalog
- 84 yerel ürün görseli
- GSAP ürün kartı animasyonları
- Arama, kategori filtresi, fiyat sıralama
- LocalStorage sepeti
- Mobil uyumlu düzen

## Güvenlik kapsamı

Bu bağımsız demo mağaza arayüzüdür; A101 ile bağlantılı veya resmî değildir. Giriş parolası, kart numarası, CVV, banka bilgisi ya da tek kullanımlık doğrulama kodu toplamaz. Ödeme düğmesi gerçek işlem yapmaz.
