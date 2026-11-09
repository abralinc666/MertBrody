# Sepetim — Node.js demo mağaza

Bu paket, gönderilen PHP tabanlı arşivden bağımsız olarak hazırlanmış, genel amaçlı ve markasız bir e-ticaret arayüzü örneğidir. Node.js + Express, HTML, CSS, vanilla JavaScript ve GSAP kullanır.

## Gereksinimler
- Node.js 20 veya üzeri
- npm

## Çalıştırma
```bash
npm install
npm start
```
Tarayıcıda `http://127.0.0.1:3000` adresini açın.

Geliştirme modunda:
```bash
npm run dev
```

## İçerik
- Responsive ürün kataloğu, arama ve kategori filtreleri
- localStorage tabanlı demo sepeti
- Ürün/adet doğrulaması yapan Express API
- GSAP giriş animasyonları (hareket azaltma tercihi desteklenir)
- Helmet güvenlik başlıkları ve checkout rate limit
- `/health` sağlık kontrolü

## Önemli güvenlik sınırı
Bu demo kart numarası, son kullanma tarihi, CVV, banka şifresi veya SMS/OTP kodu istemez, işlemez ya da saklamaz. Checkout endpoint'i bilerek `501 payment_provider_required` döndürür. Gerçek ödeme için işletmenin kendi hesabıyla lisanslı ödeme sağlayıcısının barındırılan ödeme sayfası veya sağlayıcının onaylı tokenizasyon çözümü kullanılmalıdır. Kart verisini uygulama sunucusuna almayın.

## Üretime almadan önce
- Kendi marka kimliğinizi ve lisanslı ürün görsellerinizi ekleyin.
- Gerçek ürün/veritabanı ve sipariş yönetimini tasarlayın.
- Yetkilendirme, CSRF (cookie tabanlı oturum eklenirse), log maskeleme, yedekleme ve izleme ekleyin.
- Ödeme sağlayıcısı webhook imzasını sunucu tarafında doğrulayın.
- HTTPS, güvenli secret yönetimi ve bağımlılık taraması yapılandırın.

Bu paket, gönderilen arşivdeki marka varlıklarını, yönetim panelini, kart/OTP toplama akışlarını veya mevcut veritabanını taşımamaktadır.
