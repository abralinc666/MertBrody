# RockstarBet — Değişiklik Özeti

## Çalıştırma
```
npm install
npm run dev
```
Başka bir ayar gerekmez. (`.env` yalnızca isteğe bağlı lisans bilgisi içindir.)

## Tema ve isim
- Marka adı plan.md'deki gibi **RockstarBet** (tek yerden: `src/config/site.ts`).
- Tema referans görsele göre pembe/mor: sol menü (CANLI rozeti, "Her yatırıma özel bonus" kartı), üst çubukta arama + Güncel Bonuslar / VIP Kulüp / Etkinlikler,
  gün batımı şehir silüetli vitrin (oklar + noktalar), kategori kartları, Popüler Oyunlar, sağ altta Canlı Destek balonu.
- Vitrindeki çizimler özgün vektör sanattır; referans görseldeki üçüncü taraf karakter/logo/oyun görselleri kullanılmadı.
- Ödeme markası logoları ve "Güvenli ve Lisanslı" iddiası eklenmedi (gerçek ödeme/lisans yok).
- `docs/plan.md`: canlı veri ve ürün planı (lisanslı sağlayıcı gerektirir; henüz uygulanmadı).

## Demo modu (Supabase kaldırıldı)
- Tüm arka uç kuralları tarayıcıda çalışır: `src/services/api.ts` (veri: localStorage).
- Kayıtta 1.000 ₺ demo bakiye verilir; Cüzdan'dan demo para yatırılabilir.
- Maç akışı hızlandırılmış demodur (1 dk ≈ 2,5 sn). Maç bitince bekleyen kuponlar otomatik sonuçlanır;
  bitince bir süre sonra aynı karşılaşma yeni turla yeniden başlar.
- Çalışanlar: kayıt/giriş/çıkış, şifre yenileme (demo), tekli/kombine/sistem kupon, freebet, cashout,
  bonus (her biri tek sefer), günlük/haftalık limitler, self-exclusion, VIP seviyesi, kupon ve favorilerin kalıcılığı.
- Şifreler tuzlu SHA-256 ile saklanır ama bu yalnızca demodur; gerçek kullanıcı verisi için kullanmayın.
- "Hesabım → Demo verilerini sıfırla" ile her şey temizlenir.

## Gerçek arka uca geçiş
`_backend-hazir/` klasöründe hazır Supabase SQL (güvenlik düzeltmeleriyle) ve edge function'lar var.
Arayüz yalnızca `src/services/api.ts` içindeki `api` nesnesine bağlıdır; geçişte yalnızca onu yeniden yazmak yeterli.
Ayrıntı: `_backend-hazir/README.md`.

## Diğer
- Bolt kalıntıları temizlendi; marka tek yerden (`src/config/site.ts`).
- Footer yeniden yazıldı; sahte "Verified Operator" görseli ve doğrulanamayan lisans/yardım hattı iddiaları kaldırıldı.
- CSS tek tasarım sistemiyle baştan yazıldı (koyu/açık tema, 320–1440+ px, taşma yok).

## Bilinen sınırlar
- Maçlar, oranlar, skorlar ve "Son Kazananlar" örnek veridir.
- Korner, kart, ilk yarı ve oyuncu marketleri otomatik sonuçlanmaz; o kuponlar beklemede kalır.
