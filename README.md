# BöcekAdam — 3D Canlı Sohbet Demosu

Koltukta oturan 3D BöcekAdam karakteri + altta sohbet kutusu.
Three.js, HTML, CSS ve JavaScript ile yapıldı.

## Nasıl açılır?

Tarayıcılar 3D model dosyalarını (`.glb`) doğrudan çift tıklayarak açılan sayfada yüklemez,
bu yüzden küçük bir yerel sunucu gerekir:

- **Windows:** `baslat.bat` dosyasına çift tıkla
- **Mac / Linux:** klasörde terminal aç → `sh baslat.sh`

Sonra tarayıcıda **http://localhost:8000** adresine git.
(Python yüklü olmalı. Alternatif: VS Code "Live Server" eklentisi ya da `npx serve`.)

İnternet bağlantısı gerekir — Three.js CDN'den (jsdelivr) yüklenir.

## Dosyalar

```
index.html        → sayfa yapısı
css/style.css     → tasarım (neon canlı yayın teması)
js/main.js        → 3D sahne, oturma pozu, animasyonlar, sohbet arayüzü
js/chat.js        → karakterin cevapları (kural tabanlı demo)
models/bocek.glb  → karakter
models/koltuk.glb → koltuk
```

## Özellikler

- Karakter kemikleri kodla oturma pozuna getiriliyor (modelde oturma animasyonu yok)
- Nefes alma, fareyi kafasıyla takip etme, konuşurken kafa/kol hareketi
- Mesaja göre hareket: el sallama, dans, gülme, kafa sallama, utanma
- Başının üstünde konuşma balonu + tarayıcıda Türkçe ses varsa sesli okuma (🔊 ile kapatılır)
- Kalp gönderme, takip butonu, canlı izleyici sayacı

## Gerçek yapay zekâ bağlamak için

`js/chat.js` içindeki `getReply()` fonksiyonunu async yapıp bir sunucuya
(`fetch("/api/chat", ...)`) istek atacak şekilde değiştir. API anahtarını asla
tarayıcı koduna koyma; araya küçük bir backend koy.

## Pozu ayarlamak

`js/main.js` → `applySittingPose()` içindeki yön vektörlerini değiştirerek
kolların/bacakların duruşunu ince ayarlayabilirsin. Koltuk boyutu ve karakterin
oturduğu nokta `setupScene()` içinde (`buttOffset`, `hipsTargetZ`).
