# EPİN PRO – Final Modüler Sürüm (v2.0) ve Mimari Kılavuz

## 📁 Klasör ve Dosya Yapısı
- `index.html` — Semantik HTML5 iskeleti, Breadcrumb, SEO alanları, Canlı Teslimat Bandı ve Sepet/Modal kapsayıcıları.
- `css/styles.css` — Tüm masaüstü/mobil uyumlu (responsive) stiller, koyu tema değişkenleri ve bileşen tasarımları.
- `js/data.js` — Kategori, ürün, bölge (Region Lock), teslimat tipi (`key` / `topup`), kupon (`HOSGELDIN5`, `EPIN10`), müşteri yorumları ve kategori bazlı SEO/SSS verileri.
- `js/app.js` — URL Router (`?cat=...`), JSON-LD Schema (`Product`, `BreadcrumbList`, `FAQPage`), Site İçi Cüzdan, Dijital Kod Kasası (Key Vault), Oyuncu ID doğrulaması, Ödeme Bildirimi ve 7/24 Ticket sistemi.
- `robots.txt` & `sitemap.xml` — Arama motoru tarama ve indeksleme dosyaları.

## ✅ Eklenen 10 Kritik E-Pin Özelliği ve SEO Geliştirmeleri
1. **Dijital Kod Kasası (Key Vault):** Cüzdan ile alınan veya admin tarafından onaylanan siparişlerde `STEAM-XXXX-XXXX-XXXX` formatında benzersiz kod üretilir, maskeli gösterilir (`****`) ve tek tıkla kopyalanır.
2. **Oyuncu ID (Top-Up) Zorunluluğu:** PUBG Mobile UC ve Mobile Legends Elmas ürünlerinde sepete eklerken zorunlu Oyuncu ID alanı açılır ve siparişe işlenir.
3. **Site İçi Cüzdan & %1 Nakit Bonus:** Yeni üye olan herkese test amaçlı **₺250,00 Cüzdan Bakiyesi** tanımlanır; cüzdanla yapılan ödemeler saniyesinde onaylanır ve %1 Bonus Puan kazandırır.
4. **Çalışan İndirim Kuponu Sistemi:** Sepet çekmecesinde `HOSGELDIN5` (%5) ve `EPIN10` (%10) kupon kodları anında indirimi uygular.
5. **Bölge / Sunucu Rozetleri (Region Lock):** Tüm ürün kartlarında `🇹🇷 TR Hesap`, `🌍 Global ID`, `🇺🇸 ABD Bölgesi` rozetleri yer alır.
6. **"Nasıl Yüklenir?" Aktivasyon Rehberi:** Ürün detay modalında 3 sekme (`Açıklama`, `Nasıl Yüklenir?`, `Yorumlar`) bulunur.
7. **Havale/FAST & Kripto Ödeme Bildirimi + 15 Dk Sayaç:** IBAN ve USDT ödemelerinde müşteri TxID veya gönderen adını girerek ödeme bildirimi yapar; kripto ödemelerinde 15 dakikalık geri sayım çalışır.
8. **Canlı Teslimat Bandı ve Müşteri Yorumları:** Üst barda gerçek zamanlı sosyal kanıt akışı ve ürün kartlarında yıldız puanları (`AggregateRating` Schema destekli) yer alır.
9. **7/24 Destek Talebi (Ticket) Sistemi:** Sağ alt yüzen destek butonu ve müşteri panelinde sipariş seçmeli Ticket açma / Admin panelinden yanıtlama modülü aktiftir.
10. **Dinamik URL Routing, Breadcrumb ve FAQ Schema:** Kategoriler `<a href="?cat=...">` yapısına geçirilmiş; sayfa başlığı, meta açıklama, canonical URL, Breadcrumb ve kategori altı SSS akordeonu seçilen kategoriye göre dinamik hale getirilmiştir.
