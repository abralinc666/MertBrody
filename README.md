# Online Mağaza — Node.js yeniden tasarım

Bu sürüm, önceki bağımsız tasarımdan farklı olarak kaynak projedeki mağaza listeleme düzenini esas alır: üst bilgilendirme şeridi, geniş arama alanı, hesap/sepet aksiyonları, yatay kategori menüsü, sol kategori filtresi, sıralama alanı ve üç sütunlu ürün kartları. Mobilde aynı hiyerarşi korunur.

## Kurulum
- Node.js 20+
- `npm install`
- `npm start`
- `http://127.0.0.1:3000`

## Teknoloji
Node.js, Express, HTML, CSS, JavaScript, GSAP, Helmet ve express-rate-limit.

## Kapsam ve güvenlik
- PHP kaldırıldı; ürün listeleme API'si Express ile sunulur.
- Arama, kategori filtresi, sıralama, sepet ve LocalStorage çalışır.
- Kaynak projedeki ürün fotoğraflarından demo görseller kullanılır.
- Kaynak projedeki A101 marka işaretleri ve ödeme/kimlik doğrulama toplama akışları taşınmamıştır. Bu proje bağımsız demo mağazadır; kart numarası, CVV veya OTP toplamaz ve ödeme işlemez.
- Gerçek ödeme için lisanslı sağlayıcının barındırılan ödeme sayfası veya tokenizasyon SDK'sı ayrıca entegre edilmelidir.
