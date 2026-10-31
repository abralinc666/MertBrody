# RockstarBet – responsive düzeltmeler

Bu paket, sağlanan BetFury-main kaynaklarının mevcut tasarımını koruyarak yapılan responsive düzenlemeleri içerir.

## Yapılan değişiklikler
- Mobil, tablet ve masaüstü grid genişlikleri daha esnek hale getirildi.
- Maç satırlarında takım isimlerinin taşması engellendi; oran alanları dar ekranlara göre ölçeklendirildi.
- Mobil alt menü, kupon kısayolu ve modal katmanlarının z-index/safe-area yerleşimleri düzenlendi.
- Maç merkezi ve saha kapsayıcıları dar ekranlarda taşmayacak şekilde sınırlandırıldı.
- Yatay taşmayı azaltan kapsayıcı kuralları ve hareket azaltma tercihi eklendi.
- Supabase migration dosyalarındaki çift `.sql.sql` uzantıları `.sql` olarak düzeltildi.

## Kurulum
```bash
npm ci
npm run typecheck
npm run build
```

Supabase bağlantısı için kendi proje URL ve anon key değerlerinizi `.env` dosyasında tanımlayın. Gerçek para/bakiye işlemlerini canlıya almadan önce Supabase RLS politikalarını, RPC fonksiyonlarını ve yetkilendirmeyi ayrıca güvenlik denetiminden geçirin.

## Doğrulama notu
Bu çalışma ortamında `npm ci` bağımlılık kurulumu zaman aşımına uğradığı için TypeScript kontrolü ve Vite production build tamamlanamadı. Kaynak dosyalar düzenlendi; ancak paketi kendi ortamınızda yukarıdaki komutlarla doğrulayın.
