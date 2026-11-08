# BC Nails

1. `.env` dosyasını düzenleyin (WhatsApp, konum, site adresi, adres, sosyal medya).
2. `python3 build.py` çalıştırın (ek paket gerekmez). Hatalı değer varsa neyin yanlış olduğunu söyler.
3. `dist/` klasörünü yayınlayın (Vercel/Netlify/Cloudflare Pages). Güvenlik başlıkları `vercel.json` ve `_headers` içinde hazır.
4. Telefonda hızlı önizleme: `out/BC-Nails-tek-dosya.html`

Kaynak dosyalar `src/` içinde. `dist/` ve `out/` her derlemede yeniden üretilir, elle düzenlemeyin.
`.env` git'e eklenmez (`.gitignore`). Gizli anahtar/şifre yazmayın; telefon ve konum zaten herkese açık bilgidir.
