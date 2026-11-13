# LovelyTG Tanıtım Sitesi

BrodySOFT için hazırlanmış, koyu zeminli ve limon-yeşili temalı statik tanıtım sitesi (v6.4: bildirim, şablon, zamanlanmış pano, medya, oturum uyarısı, hesap karşılaştır, şifreli yedek, 7g takvim, davet, PWA/kuyruk). Font: Plus Jakarta Sans (Google Fonts).

## Çalıştırma
`index.html` dosyasını tarayıcıda aç veya klasörü statik bir hosting servisine yükle. Derleme adımı yoktur.

## Düzenleme
- Lisans fiyatları: `js/app.js` içindeki `L` dizisi (ad, ay sayısı, toplam fiyat). Aylık fiyat, tasarruf yüzdesi ve yıllık rozet otomatik hesaplanır.
- Özellik modülleri: `js/app.js` içindeki `D` dizisi (`isNew: true` “YENİ” rozeti ekler). “Yenilikler” kartları `NEWS` dizisindedir; son sayı, açılacak modülün sırasıdır.
- Arayüz ekran görüntüleri: `SH` dizisi ve `assets/ui-*.webp` (örnek verilerle hazırlanmıştır).
- Renkler: `css/style.css` başındaki `:root` değişkenleri.
- İletişim bağlantıları (Telegram `t.me/MertBrody`, e-posta, Signal): `index.html`.

## Not
Satın Al butonları, seçilen lisansı yazılı olarak Telegram sohbetine hazır mesaj halinde açar. Site statiktir; ödeme alma ve lisans aktivasyonu için ayrıca bir backend gerekir ve şu an sohbet üzerinden yapılır.
