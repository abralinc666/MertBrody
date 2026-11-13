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
js/app.js       UI + GSAP/Swiper
js/admin.js     yönetim
assets/         brand, bonuses, games, providers
```

## Not
CDN: GSAP, Swiper, Google Fonts. Veri `localStorage`’da (`bw_db_v1`, `bw_cms_v1`, `bw_session`).
