# Betwin (demo – sanal kredi)

Bağımlılıksız Node.js backend + frontend. Kurulum gerekmez.

    npm start          # veya: node server/server.js
    http://localhost:3000

Node 18+ gerekir. Veriler `server/data/db.json` dosyasında tutulur (silersen sıfırlanır).
GSAP ve yazı tipi CDN'den yüklenir (internet gerekir). PORT ve TOKEN_SECRET ortam değişkenleriyle ayarlanır.

## API
Kimlik: `Authorization: Bearer <token>`
- POST /api/auth/guest · /register · /login   GET /api/me
- GET /api/providers?q= · /api/providers/:id · /api/games?category=&provider=&q=&new=1
- POST /api/games/:id/launch (demo)
- GET /api/favorites · POST|DELETE /api/favorites/:gameId
- GET /api/wallet · /api/wallet/transactions · POST /api/wallet/deposit {amount}
- GET /api/promotions · POST /api/promotions/:id/claim
- GET /api/notifications · POST /api/notifications/read

Tutarlar kuruş (cent) cinsinden saklanır. Şifreler scrypt ile hashlenir, oturum imzalı token'dır, giriş/kayıt uç noktalarında hız sınırı vardır.
Bu proje yalnızca sanal kredi kullanır; gerçek para, ödeme ve sağlayıcı entegrasyonu içermez.
