# LovelyTG Tanıtım Sitesi

Responsive, tek sayfalık ürün tanıtım ve lisans satış arayüzü. HTML + CSS + JavaScript + GSAP kullanır.

## Çalıştırma
- `index.html` dosyasını tarayıcıda açabilir veya klasörü bir statik hosting servisine yükleyebilirsiniz.
- GSAP ve Google Fonts CDN üzerinden yüklenir; animasyon/fontlar için internet bağlantısı gerekir.
- Diğer içerikler yerel dosyalardır.

## Yayına almadan önce
1. `js/config.js` dosyasındaki örnek fiyatları gerçek fiyatlarla değiştirin.
2. `bank.name` ve `bank.iban` alanlarını gerçek ödeme bilgilerinizle doldurun.
3. `crypto.network` ve `crypto.wallet` alanlarını doğru ağ/cüzdanla doldurun.
4. Paketlerin sunduğu özellikleri ürünün gerçek yeteneklerine göre düzenleyin.
5. İletişim, gizlilik, mesafeli satış, iade/iptal ve lisans koşulları sayfalarını ekleyin.
6. Gerçek sipariş, ödeme teyidi ve lisans aktivasyonu için güvenli backend geliştirin.

## Önemli teknik notlar
- Fiyatlar yalnızca örnek/demo değerlerdir.
- IBAN ve kripto cüzdan adresleri placeholder'dır; gerçek ödeme almaz.
- Sipariş formu sadece talep metni oluşturur ve kopyalar. Sunucuya veri göndermez.
- Lisans kontrolü yalnızca ön yüzde yapılmamalıdır. Paket yetkileri API/backend tarafında doğrulanmalıdır.
- Kripto ödemelerinde ağ, varlık ve adres bilgisi ödeme öncesinde doğrulanmalıdır.
- Telegram'ın marka/ürün kimliğiyle resmi bağlantı veya onay izlenimi verilmemelidir.
