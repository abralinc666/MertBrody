# Hazır arka uç (şimdilik kullanılmıyor)

Supabase hesabınız olduğunda burası kullanılabilir. Uygulama şu an `src/services/api.ts` içindeki
demo arka uçla çalışıyor; kurallar (oran doğrulama, cashout, sonuçlandırma, limitler) bu SQL ile aynıdır.

İçerik:
- `supabase/migrations/*` — tablolar, RLS ve güvenli RPC'ler (son dosya: güvenlik düzeltmeleri)
- `supabase/functions/live-scores` — ESPN skor önbelleği
- `supabase/functions/bet-settlement` — service_role ile korunan sonuçlandırma

Geçiş adımları (özet):
1. Yeni proje oluştur, `supabase/` klasörünü proje köküne taşı, `supabase db push` + `supabase functions deploy`.
2. `npm i @supabase/supabase-js`, `.env` içine `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekle.
3. `src/services/api.ts` içindeki `api` nesnesini aynı metot imzalarıyla Supabase çağrılarına (`rpc('place_bet_slip')` vb.) bağla.
   Arayüz yalnızca bu nesneye bağlıdır.
4. `bet-settlement` fonksiyonunu dakikada bir service_role anahtarıyla çağıran zamanlayıcı kur.
