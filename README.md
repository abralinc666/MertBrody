# BrodyBet

Statik HTML/CSS/JS demo. Gerçek para yok — sanal kredi.

## Canlı
- Site: `index.html`
- Admin: `admin.html` — şifre: **`brodyadmin`**

## Deploy (Vercel)
1. Repo’yu GitHub’a push et
2. [vercel.com](https://vercel.com) → Import Project → bu repo
3. Framework preset: **Other** / static — Build Command boş, Output: `.`
4. Deploy

Yerelde: `index.html`’i tarayıcıda aç veya `npx serve .`

## Yapı
```
index.html      public SPA
admin.html      CMS panel
css/            stil
js/data.js      katalog (oyun, bonus, spor…)
js/cms.js       admin overrides (localStorage)
js/api.js       tarayıcı “backend”
js/app.js       UI, canlı maç simülasyonu (saat/skor/oran), Swiper
js/admin.js     yönetim
assets/         brand (logo.svg, mark.svg, ikonlar), bonuses, games, providers
```

## Not
CDN: GSAP, Swiper, Google Fonts. Veri `localStorage`’da (`bw_db_v1`, `bw_cms_v1`, `bw_session`).

## v2 notları
- Yeni marka: `assets/brand/logo.svg` (mark + yazı, vektör) ve `assets/brand/mark.svg` (favicon/uygulama ikonu).
- Tasarım sistemi `css/style.css` başındaki değişkenlerde (`--ac`, `--s1`… ). Font: Inter + Inter Tight.
- Canlı maçlarda süre her saniye, oranlar birkaç saniyede bir, skor rastgele güncellenir (yalnızca istemci simülasyonu).
- `bw_cms_v1` şema 2: eski oturumlardaki katalog görsel yolları otomatik güncellenir.
- Sağlayıcı kutularının zemin rengi `data.js` içindeki `tile` alanından gelir (`dark`, `light` veya `#hex`).
