# RockstarBet — Canlı Spor Veri Motoru ve Platform Geliştirme Planı

**Belge türü:** Yazılım geliştirme / teknik uygulama planı  
**Hedef proje:** Mevcut React + TypeScript + Vite + Supabase tabanlı RockstarBet arayüzü  
**Öncelik:** Önce gerçek spor verisi altyapısı, ardından kullanıcı deneyimi ve ürün özellikleri  
**Önemli:** Bu doküman teknik planlamadır. Üretim kullanımı; yürürlükteki mevzuat, gerekli lisanslar, veri sağlayıcı sözleşmeleri ve ödeme/operasyon izinleri doğrulanmadan başlatılmamalıdır.

---

## 1. Projenin amacı

Mevcut uygulamadaki demo/simülasyon maç verilerini, yetkili bir spor veri sağlayıcısından gelen gerçek maç verileriyle değiştirmek. Maç listesi, canlı skor şeridi ve maç merkezi aynı doğrulanmış veri kaynağını kullanmalıdır.

Sistem aşağıdaki verileri sağlayıcı sözleşmesinin kapsadığı ölçüde desteklemelidir:

- Fikstür, maç başlangıç saati ve maç durumu
- Canlı skor ve maç dakikası
- Gol, kart, oyuncu değişikliği, penaltı ve devre/maç sonu olayları
- Takım ve oyuncu kadroları
- Maç istatistikleri (topla oynama, şut, isabetli şut, korner, faul vb.)
- Lig puan durumu ve takım formu
- Sağlayıcı veriyorsa oran ve market değişimleri

**Kapsam ayrımı:** Spor verisi sağlayıcısı maç bilgisi verir. Bahis oranları/marketleri ayrı bir yetkili bahis oranı sağlayıcısından gelebilir. Skor API'sinden oran üretmeye veya gerçek oran varmış gibi göstermeye kesinlikle çalışılmamalıdır.

## 2. Mevcut kod tabanının tespit edilen durumu

İncelenen ZIP içindeki temel dosyalar:

| Dosya | Mevcut görev | Yapılacak işlem |
|---|---|---|
| `src/hooks/useLiveMatches.ts` | `setInterval` ile demo skor/dakika simülasyonu yapıyor; `Math.random()` kullanıyor. | Üretimde simülasyon kaldırılmalı; gerçek veri servisine bağlanmalı. |
| `src/components/MatchList.tsx` | Maç listesini, filtreleri, aramayı, favorileri ve oran seçeneklerini gösteriyor. | Mevcut UI korunarak gerçek maç/market verisi bağlanmalı. |
| `src/components/MatchTracker.tsx` | Maç merkezi ekranı. `buildDemoData()` ile sahte istatistik ve olay üretiyor. | Demo üretimi kaldırılmalı; gerçek olay/istatistik endpoint'leri kullanılmalı. |
| `src/components/LiveTicker.tsx` | Canlı skor şeridi. | Aynı merkezi canlı veri deposundan beslenmeli. |
| `src/services/api.ts` | Mevcut demo/uygulama API katmanı ve kupon işlemleri. | Spor sağlayıcı entegrasyonu buraya doğrudan gömülmemeli; ayrı servis katmanı kurulmalı. |
| `src/services/liveState.ts` | Maçın anlık durumunu tutan yardımcı katman. | Yeni event kimliği ve veri sürümüyle uyumlu hale getirilmeli. |
| `src/data/sports.ts` | Örnek maç ve market kataloğu. | Demo fixture'ları yalnız geliştirme/test ortamında tutulmalı. |
| `_backend-hazir/supabase/functions/live-scores/index.ts` | ESPN scoreboard endpoint'lerinden lig bazlı skor çekiyor; 15 saniye cache kullanıyor. | Sağlayıcı adaptörüne dönüştürülmeli; sağlayıcı ve lisans doğrulaması yapılmalı. |
| `_backend-hazir/supabase/migrations/*live_scores_cache*` | Canlı skor cache tablosu. | Cache şeması ve indeksler yeni veri modeline göre gözden geçirilmeli. |

### Mevcut uygulamadaki önemli demo işaretleri

- `useLiveMatches.ts` maç dakikasını ve skorları rastgele ilerletiyor.
- `MatchTracker.tsx` istatistikleri ve olayları maç skoruna göre yapay olarak üretiyor.
- `MatchList.tsx` demo veri etiketi gösteriyor.
- Mevcut canlı skor Edge Function ESPN'den skor çekebiliyor; ancak bu, Mackolik entegrasyonu veya tam kapsamlı canlı maç verisi değildir.
- Projede maç istatistikleri, oranlar, skorlar ve olaylar için tek bir üretim veri sözleşmesi henüz kurulmuş kabul edilmemelidir.

**Kural:** Gerçek veri alınamadığında sahte skor/istatistik gösterilmemeli. Arayüz “Veri geçici olarak alınamıyor” veya “Son güncelleme: …” durumunu göstermeli.

## 3. Veri sağlayıcı stratejisi

### 3.1 Mackolik

Mackolik ile önce resmi ticari API/veri lisansı ve kullanım şartları hakkında yazılı teyit alınmalı. Şu sorular yanıtlanmadan üretim entegrasyonu yapılmamalı:

1. API veya veri akışı için resmi erişim sağlanıyor mu?
2. Canlı skor, olay, istatistik, kadro ve fikstür alanlarından hangileri lisans kapsamında?
3. Güncelleme gecikmesi ve SLA nedir?
4. İstek kotası, eşzamanlı bağlantı ve aylık ücret nedir?
5. Verinin bahis ürünü içinde gösterilmesine izin var mı?
6. Veriyi cache'leme, arşivleme ve yeniden dağıtma hakkı var mı?
7. Logo, takım adı, lig adı ve görsellerin kullanım şartları nelerd?
8. Sağlayıcı kesintisinde kullanılabilecek yedek kaynak var mı?

Mackolik'in web sitesinde kullanılan dahili/halka açık görünen endpoint'ler, resmi ticari API sözleşmesi yerine kabul edilmemelidir. Yetkisiz scraping, proxy ile erişim kısıtını aşma veya sözleşmeye aykırı veri toplama yapılmamalıdır.

### 3.2 Alternatif sağlayıcı

Mackolik'ten uygun ticari erişim alınamazsa canlı spor verisi lisanslayan başka bir sağlayıcı seçilmeli. Sağlayıcı seçiminde şu kriterler puanlanmalı:

- Türkiye ligleri ve hedeflenen spor dallarının kapsamı
- Canlı olay ve istatistik derinliği
- Gecikme ve doğruluk
- API dokümantasyonu ve sandbox
- WebSocket/webhook desteği
- Kota, fiyat ve SLA
- Ticari gösterim ve arşivleme hakları

Sağlayıcı adı ve endpoint'leri kodun içine sabitlenmemeli. Sağlayıcı değişimi adapter üzerinden yapılmalı.

## 4. Önerilen mimari

```text
Yetkili Spor Veri Sağlayıcısı
          |
          v
Supabase Edge Function / Backend Worker
          |
          v
Provider Adapter + Normalizer
          |
          +------> Veri doğrulama / event eşleştirme
          |
          v
PostgreSQL (maçlar, olaylar, istatistikler)
          |
          +------> Redis veya uygun cache katmanı (yük durumuna göre)
          |
          v
Realtime yayın katmanı (Supabase Realtime / WebSocket / SSE)
          |
          v
React Query / merkezi client store
          |
          +------> MatchList
          +------> LiveTicker
          +------> MatchTracker
          +------> Favori maçlar / bildirimler
```

### Temel prensipler

- Sağlayıcı API anahtarı yalnızca backend secret/environment değişkeninde tutulmalı.
- Tarayıcıdan doğrudan Mackolik veya başka sağlayıcıya istek atılmamalı.
- Bütün UI bileşenleri aynı normalize edilmiş maç modelini kullanmalı.
- Sağlayıcıya özgü kısa alan adları frontend'e sızmamalı.
- Aynı maçın farklı kaynaklardaki ID'leri `provider_event_id` ve dahili `event_id` ile eşleştirilmeli.
- Tekrarlanan event'ler idempotent işlenmeli.
- Her veri kaydında `provider`, `updated_at`, `received_at`, `sequence/version` ve mümkünse `source_timestamp` tutulmalı.
- Sağlayıcı verisi gecikmişse arayüzde güncellik bilgisi görünmeli.
- Gerçek veri ile demo verisi birbirinden kesin biçimde ayrılmalı.

## 5. Veri alma ve gerçek zamanlı güncelleme

### 5.1 Tercih sırası

1. Sağlayıcı WebSocket veya push stream sunuyorsa backend'de kalıcı bağlantı kur.
2. Sağlayıcı webhook sunuyorsa imza doğrulaması yaparak event'leri al.
3. Yalnız REST sunuyorsa backend polling uygula.
4. Polling aralığı sağlayıcı sözleşmesine, maç durumuna ve kota limitlerine göre belirlenmeli. Sabit ve kontrolsüz sık istek atılmamalı.

### 5.2 Önerilen polling politikası

Bunlar sağlayıcı sözleşmesiyle uyarlanacak başlangıç önerileridir; garanti edilmiş veri gecikmesi değildir.

| Maç durumu | Yenileme yaklaşımı |
|---|---|
| Canlı | Sağlayıcının izin verdiği en uygun aralık; örnek hedef 5–15 saniye |
| Başlamasına yakın | Örnek 30–60 saniye |
| Uzak fikstür | Örnek 5–15 dakika |
| Maç sonu | Sonuç doğrulama ve olay tamamlanma kontrolü |
| Geçmiş maç | Gereksiz polling yok; arşivden oku |

429 yanıtında `Retry-After`/rate-limit başlıklarına uyulmalı. Geçici 5xx ve ağ hatalarında exponential backoff + jitter kullanılmalı. Aynı anda birden fazla worker aynı kaynağı gereksiz yere çekmemeli; distributed lock veya tekil job mekanizması düşünülmeli.

### 5.3 Canlı akış

Backend, sağlayıcıdan gelen değişikliği normalize edip veritabanına yazmalı; ardından istemcilere sadece değişen event veya gerekli snapshot iletilmeli.

Örnek event:

```json
{
  "type": "match.score.updated",
  "eventId": "internal-event-123",
  "provider": "licensed-provider",
  "score": { "home": 1, "away": 0 },
  "status": "LIVE",
  "minute": 67,
  "sourceTimestamp": "2026-11-01T15:24:10Z",
  "receivedAt": "2026-11-01T15:24:11Z",
  "version": 184
}
```

Bu örnek şemadır; gerçek sağlayıcı cevabı değildir.

İstemci ilk açılışta REST ile güncel snapshot almalı, ardından Realtime kanalına bağlanmalı. Bağlantı koparsa yeniden bağlanmalı ve son sürümden sonra kaçırılan değişiklikleri REST üzerinden tamamlamalı.

## 6. Önerilen veritabanı modeli

Mevcut Supabase şeması incelenerek migration hazırlanmalı; aşağıdaki tablolar doğrudan körlemesine oluşturulmamalı.

### `sports_events`

- `id` — dahili UUID
- `provider`
- `provider_event_id`
- `sport`
- `competition_id`
- `season`
- `home_team_id`
- `away_team_id`
- `scheduled_at`
- `status` — `SCHEDULED`, `LIVE`, `HALFTIME`, `FINISHED`, `POSTPONED`, `CANCELLED`, `SUSPENDED`
- `home_score`
- `away_score`
- `period`
- `clock`
- `source_updated_at`
- `received_at`
- `version`

Unique constraint: `(provider, provider_event_id)`.

### `sports_event_incidents`

- `id`
- `event_id`
- `provider_incident_id`
- `type` — gol, kart, değişiklik, penaltı vb.
- `team_id`
- `player_id`
- `minute`
- `added_time`
- `description`
- `source_timestamp`
- `created_at`

Aynı sağlayıcı olayı iki kez işlenmemeli.

### `sports_event_statistics`

- `event_id`
- `stat_key`
- `home_value`
- `away_value`
- `source_updated_at`

### `sports_teams`, `sports_competitions`, `sports_players`

Takım, lig ve oyuncu kimliklerini normalize etmek için.

### `sports_event_snapshots`

Skor ve durum geçmişini saklamak için. Saklama süresi ve arşivleme maliyeti belirlenmeli.

### Veri güvenliği

- Kullanıcıların sağlayıcı ham tablolarına doğrudan yazma yetkisi olmamalı.
- RLS politikaları tablo bazında tanımlanmalı.
- Service-role key yalnız backend'de bulunmalı.
- Secret'lar Git'e veya frontend `.env` değişkenlerine konulmamalı.
- Loglarda API anahtarı, kullanıcı token'ı veya hassas ödeme verisi tutulmamalı.

## 7. Frontend değişiklikleri

### `useLiveMatches.ts`

Mevcut simülasyon hook'u üretimden çıkarılmalı. Yerine:

- İlk snapshot'ı backend endpoint'inden al.
- Realtime aboneliğini başlat.
- Gelen event'leri merkezi cache/store içinde işle.
- `version` eskiyse event'i yok say.
- Bağlantı koptuğunda yeniden bağlan.
- Veri eskiyse stale etiketi göster.
- Demo modu yalnız `development` ortamında açık olsun.

### `MatchList.tsx`

- Gerçek fikstür ve canlı maçlar gösterilmeli.
- Canlı maçlar, sağlayıcıdan gelen durum bilgisine göre sıralanmalı.
- Maç bulunamadı, yükleniyor, veri gecikmiş ve sağlayıcı hatası durumları tasarlanmalı.
- Oranlar ayrı odds feed'den geliyorsa kaynağı ve güncelliği yönetilmeli.

### `LiveTicker.tsx`

Maç listesiyle aynı store'u kullanmalı. Ayrı API polling yapmamalı.

### `MatchTracker.tsx`

`buildDemoData()` kaldırılmalı. Gerçek veri varsa gösterilmeli; alan yoksa “Bu maç için istatistik mevcut değil” yazılmalı. Olay akışı dakika ve zaman sırasına göre gösterilmeli.

### `src/data/sports.ts`

Üretim maç kataloğu olarak kullanılmamalı. Yalnız mock fixture/test datası olarak tutulmalı.

## 8. API sözleşmesi

Frontend'in sağlayıcıdan bağımsız kullanacağı backend endpoint örnekleri:

| Endpoint | Amaç |
|---|---|
| `GET /api/sports/events?date=YYYY-MM-DD` | Günlük maçlar |
| `GET /api/sports/events/live` | Canlı maçlar |
| `GET /api/sports/events/:id` | Maç detay snapshot'ı |
| `GET /api/sports/events/:id/incidents` | Olay akışı |
| `GET /api/sports/events/:id/statistics` | Maç istatistikleri |
| `GET /api/sports/competitions/:id/standings` | Puan durumu |
| `GET /api/sports/teams/:id` | Takım profili |
| `GET /api/health/sports-feed` | Sağlayıcı bağlantı ve veri güncelliği |

Bu endpoint'ler öneridir; mevcut Supabase Edge Function yapısına uygun şekilde uygulanabilir. Her endpoint sayfalama, hata sözleşmesi ve cache politikası içermeli.

## 9. Güvenilirlik ve operasyon

- Sağlayıcı health check ve gecikme metriği.
- Son başarılı veri çekim zamanı.
- Kaynak bazlı hata oranı ve 429 sayısı.
- Event sayısı ve eksik veri metriği.
- Tekrarlanan/çelişen skor tespiti.
- Sağlayıcı kesintisinde son snapshot'ı stale olarak gösterme.
- Skor değişiminde event geçmişini saklama.
- Manuel düzeltme gerekiyorsa yetkili admin işlemi, audit log ve gerekçe zorunlu olmalı.
- Maç sonucu/olay düzeltmeleri kupon veya finansal kayıtları otomatik ve denetimsiz değiştirmemeli; ayrı, denetlenebilir sonuçlandırma iş akışı kullanılmalı.

**Çok önemli:** Canlı skor sağlayıcısından gelen skor tek başına bahis kuponu sonuçlandırmak için yeterli kabul edilmemeli. Bahis sonuçlandırma kuralları, resmi/kontratlı sonuç kaynağı, itiraz ve düzeltme süreçleri ayrı ele alınmalı.

## 10. Test ve kabul kriterleri

### Fonksiyonel testler

- Maç fikstürde görünür.
- Başlama zamanı geldiğinde durum doğru şekilde canlıya geçer.
- Skor değişimi tüm bağlı bileşenlere aynı event üzerinden ulaşır.
- Gol, kart, değişiklik gibi olaylar doğru sırada görünür.
- Devre arası, uzatma, maç sonu ve ertelenme durumları doğru gösterilir.
- Realtime bağlantısı kopup geldiğinde UI tutarlı hale gelir.
- Sağlayıcı bir alanı vermiyorsa sahte veri üretilmez.
- Aynı event iki kere geldiğinde çift gol/çift olay oluşmaz.
- Saat dilimi ve yaz/kış saati dönüşümleri test edilir.

### Teknik testler

- Unit test: provider adapter ve normalizer.
- Integration test: Edge Function → DB → Realtime.
- Load test: aynı anda çok sayıda bağlı kullanıcı.
- Failure test: timeout, 429, 500, bozuk JSON, eksik alan.
- Security test: API key frontend bundle içinde bulunmamalı.
- Build/lint/typecheck başarılı olmalı.

### Örnek kabul hedefleri

Bunlar ürün hedefidir, sağlayıcı garantisi değildir:

- Sağlayıcı event'i alındıktan sonra istemciye iletim p95 hedefi: 2 saniye altı.
- Canlı maç verisi güncellik hedefi: sağlayıcı SLA'sı ve yayın gecikmesiyle uyumlu.
- Veri kaybı: event ID/version/idempotency ile önlenmeli.
- Arayüzde sahte canlı skor: sıfır.
- Sağlayıcı kesintisinde kullanıcıya açık stale/error durumu.

## 11. Uygulama aşamaları

### Faz 0 — Yetki ve sağlayıcı doğrulaması

- Mackolik'ten resmi API/lisans teyidi al.
- Veri alanlarını, fiyatı, SLA'yı ve kullanım haklarını yazılı netleştir.
- Alternatif sağlayıcıları aynı kriterlerle karşılaştır.
- API sandbox ve test anahtarı edin.

**Çıktı:** Onaylı sağlayıcı, dokümantasyon, kapsam ve maliyet.

### Faz 1 — Veri katmanı

- Provider adapter interface oluştur.
- Normalized event modelini yaz.
- DB migration ve indeksleri hazırla.
- Secret ve RLS politikalarını kur.
- Provider health check ekle.

**Çıktı:** Backend'den normalize edilmiş gerçek maç listesi.

### Faz 2 — Canlı güncelleme

- WebSocket/webhook veya kontrollü polling.
- Cache ve idempotent event işleme.
- Supabase Realtime yayınları.
- Reconnect ve stale data davranışı.

**Çıktı:** Gerçek zamanlı güncellenen merkezi maç deposu.

### Faz 3 — Arayüz bağlantısı

- `useLiveMatches.ts` simülasyonunu kaldır.
- `MatchList`, `LiveTicker`, `MatchTracker` bileşenlerini bağla.
- Demo etiketlerini yalnız demo ortamında göster.
- Loading/error/stale/empty durumlarını ekle.

**Çıktı:** Mevcut tasarım korunarak gerçek veri kullanan maç merkezi.

### Faz 4 — Doğrulama ve yayın

- Test senaryolarını tamamla.
- Gerçek maç sırasında sağlayıcı verisini karşılaştır.
- Performans ve güvenlik testlerini tamamla.
- Önce staging, sonra gerekli izinler ve operasyon kontrolleri tamamlandıktan sonra production.

**Çıktı:** İzlenebilir ve hata durumunda güvenli davranan canlı spor veri sistemi.

---

# 12. Mevcut projeye eklenebilecek 10 ürün özelliği

Aşağıdaki liste, incelenen mevcut ZIP'teki işlevlerle karşılaştırılarak hazırlanmıştır. Bunlar mevcutta hiç bulunmayan veya yalnız demo/eksik düzeyde bulunan özelliklerdir. Diğer sitelerdeki her özelliğin aynı şekilde sunulduğu iddia edilmemektedir.

## 1. Bet Builder — Aynı maçta özel bahis oluşturucu

Kullanıcı tek maç içinde birden fazla tahmini birleştirebilmeli.

Örnek: maç sonucu + toplam gol + oyuncu şutu.

- Aynı maç içindeki seçimleri birleştirme.
- Birbiriyle ilişkili marketleri kontrol etme.
- Korelasyon hesaba katılmadan oran çarpımı yapılmamalı.
- Yalnız yetkili odds/risk motoru onayladığında kupona eklenmeli.

**Öncelik:** Yüksek.  
**Bağımlılık:** Market sağlayıcısı ve korelasyon fiyatlama motoru.

## 2. Cash Out — Kuponu maç bitmeden kapatma

Kullanıcı açık kuponu maç devam ederken uygun bir teklif üzerinden kapatabilmeli.

- Güncel cash-out teklifi.
- Teklifin son geçerlilik zamanı.
- Teklif değişirse yeniden onay.
- Sunucu tarafında atomik işlem.
- Aynı kuponun iki kez kapatılmasını önleme.
- Sağlayıcı/market uygun değilse açıkça devre dışı gösterme.

**Öncelik:** Yüksek.  
**Not:** Kodda cash-out ile ilgili callback isimleri bulunduğundan, önce mevcut akışın gerçekten çalışıp çalışmadığı denetlenmeli; sıfırdan ikinci bir cash-out sistemi yazılmamalı.

## 3. Gelişmiş maç merkezi

Mevcut MatchTracker'ın gerçek verilerle genişletilmiş sürümü.

- Gerçek olay zaman çizelgesi.
- İlk 11 ve yedekler.
- Diziliş ve oyuncu pozisyonları.
- Oyuncu değişiklikleri.
- Takım karşılaştırması.
- Şut haritası ve xG (sağlayıcı destekliyorsa).
- Maçın önemli anları.

**Öncelik:** Yüksek.  
**Bağımlılık:** İstatistik ve kadro lisansı.

## 4. Oyuncu bahisleri (Player Props)

Takım sonucunun ötesinde oyuncu performans marketleri.

- Oyuncunun gol atması.
- Asist.
- Şut ve isabetli şut.
- Kart görmesi.
- Basketbolda sayı, ribaund, asist.

Market kapsamı spor dalına ve sağlayıcıya göre değişmeli.

**Öncelik:** Orta-yüksek.  
**Bağımlılık:** Oyuncu verisi, odds feed ve risk kuralları.

## 5. Akıllı maç ve oran bildirimleri

Kullanıcı takip ettiği maç veya markette değişiklik olduğunda bildirim alabilmeli.

- Maç başladı.
- Gol oldu.
- Devre arası / maç sonu.
- Favori takımın maçı.
- Takip edilen marketin oranı değişti.
- Maç sonucu/olay düzeltildi.

Bildirim tercihleri kullanıcı tarafından yönetilmeli; gereksiz bildirim gönderilmemeli.

**Öncelik:** Orta-yüksek.

## 6. Oran hareketleri ve market geçmişi

Sadece güncel oranı değil, izin verilen veri kapsamı içinde geçmiş değişimi de göstermek.

- Açılış oranı.
- Güncel oran.
- Önceki oran.
- Oran yükseliş/düşüş göstergesi.
- Marketin askıya alınma durumu.
- Değişim zaman çizelgesi.

**Öncelik:** Orta-yüksek.  
**Bağımlılık:** Lisanslı odds geçmişi.

## 7. Gelişmiş kupon geçmişi ve analiz ekranı

Kullanıcı geçmiş işlemlerini anlaşılır biçimde inceleyebilmeli.

- Açık, kazanan, kaybeden, iptal ve iade kuponları.
- Kupon detayında seçim bazlı sonuç.
- İşlem zamanı ve tutar.
- Filtreleme ve tarih aralığı.
- Hesap hareketleriyle tutarlı kayıt.
- Dışa aktarılabilir hesap ekstresi.

**Öncelik:** Yüksek.  
**Not:** Mevcut bahis geçmişi altyapısı incelenerek genişletilmeli; finansal kayıtlar değiştirilemez audit mantığıyla tutulmalı.

## 8. Canlı yayın / maç izleme bağlantıları

Yayın hakkı bulunan maçlarda lisanslı yayın veya resmi yayıncıya yönlendirme.

- Maç sayfasında yayın mevcut durumu.
- Ülke/bölge yayın hakları kontrolü.
- Mobil uyumlu video oynatıcı veya yetkili yayıncı bağlantısı.
- Yayın yoksa sahte oynatıcı göstermeme.

**Öncelik:** Orta.  
**Bağımlılık:** Yayın lisansı ve coğrafi haklar.

## 9. Kişiselleştirilebilir ana sayfa ve favoriler

Mevcut favori sistemi localStorage düzeyinden kullanıcı hesabına taşınmalı.

- Favori takım ve ligler.
- Favori maçlar.
- Kullanıcının seçtiği spor dalları.
- Son görüntülenen maçlar.
- Kişisel maç listesi.
- Giriş yapılan cihazlar arasında senkronizasyon.

**Öncelik:** Orta.

## 10. Sorumlu oyun merkezi ve hesap kontrolleri

Mevcut `ResponsibleGambling.tsx` bileşeni daha kapsamlı hale getirilmeli.

- Kullanıcının belirlediği yatırma/harcama limitleri.
- Günlük/haftalık/aylık limitler.
- Oturum süresi hatırlatmaları.
- Geçici mola ve kendini dışlama seçenekleri.
- Hesap hareketlerini kolay görüntüleme.
- Limit değişikliklerinde güvenli bekleme ve denetim.
- Kullanıcıya baskı yapan veya kaybı telafi etmeye teşvik eden bildirimlerden kaçınma.

**Öncelik:** Kritik.  
**Not:** Uygulanacak kontroller ilgili mevzuat ve lisans koşullarıyla uyumlu olmalı.

---

## 13. Öncelik sıralaması

| Sıra | İş | Neden |
|---:|---|---|
| 1 | Yetkili gerçek veri entegrasyonu | Demo skorlar kaldırılmadan ürün güvenilir olmaz. |
| 2 | Gerçek maç merkezi | Kullanıcıya doğrulanabilir maç bilgisi sunar. |
| 3 | Kupon geçmişi ve hesap hareketleri | İşlem şeffaflığı ve denetim. |
| 4 | Cash Out akışının denetlenmesi/tamamlanması | Mevcut callback'ler var; gerçek davranış doğrulanmalı. |
| 5 | Bet Builder | İleri seviye market ve fiyatlama gerektirir. |
| 6 | Favori ve bildirim sistemi | Kullanıcı deneyimini geliştirir. |
| 7 | Oran geçmişi | Lisanslı odds verisi gerektirir. |
| 8 | Oyuncu marketleri | Derin veri ve risk motoru gerektirir. |
| 9 | Yayın entegrasyonu | Yayın hakları ve maliyet gerektirir. |
| 10 | Sorumlu oyun kontrollerinin genişletilmesi | Güvenlik ve uyumluluk açısından zorunlu ürün alanı. |

## 14. Yazılımcı için kesin uygulama talimatları

1. Önce mevcut kodu ve Supabase migration'larını incele; çalışan işlevleri silme.
2. Tasarımı ve mevcut component yapısını gereksiz yere yeniden yazma.
3. İlk PR yalnız veri sağlayıcı adapter'ı, normalize veri modeli ve testleri içersin.
4. Gerçek API erişimi/lisansı doğrulanmadan Mackolik endpoint'ini üretim kaynağı yapma.
5. Frontend'e sağlayıcı API anahtarı koyma.
6. `Math.random()` ile gerçek maç skoru, dakika, istatistik veya olay üretimini production'dan kaldır.
7. Sağlayıcıda olmayan veriyi uydurma; “veri yok” durumunu doğru göster.
8. `MatchList`, `LiveTicker` ve `MatchTracker` tek merkezi veri kaynağını kullansın.
9. Bahis oranı ve spor skoru kaynaklarını birbirinden ayır.
10. Skor akışı ile kupon sonuçlandırma/ödeme akışını birbirinden ayır; finansal işlemlerde mevcut güvenlik ve atomiklik kontrollerini koru.
11. Her aşamada `npm run typecheck`, `npm run lint` ve `npm run build` çalıştır.
12. Değişiklikleri küçük PR'lara böl; her PR için test ve değişiklik özeti sun.

## 15. Tamamlanma tanımı

İş ancak aşağıdaki maddeler sağlandığında tamamlanmış sayılır:

- Gerçek sağlayıcıdan maç verisi alınıyor.
- Demo simülasyonu production'da çalışmıyor.
- Maç listesi, canlı şerit ve maç merkezi aynı veriyi gösteriyor.
- Olaylar ve istatistikler yalnızca kaynakta varsa gösteriliyor.
- Sağlayıcı kesintisinde son verinin eski olduğu kullanıcıya bildiriliyor.
- API anahtarları backend dışında bulunmuyor.
- Duplicate event ve bağlantı kopması testleri geçiyor.
- Yetkili veri kullanım hakkı ve ilgili ürün/operasyon izinleri doğrulanmış.
- Build, lint, typecheck ve entegrasyon testleri başarılı.

---

**Son not:** Önce gerçek ve lisanslı veri akışını kurun. Ardından ürün özelliklerini ekleyin. Sahte skorlarla çalışan bir maç merkezine daha fazla görsel özellik eklemek yerine, doğru veri ve güvenilir işlem altyapısı kurmak öncelikli olmalıdır.
