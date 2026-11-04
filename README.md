# LovelyTG

- `frontend/` -> Vercel (Root Directory: frontend, Framework: Other, build yok)
- `backend/`  -> Termux

## Termux
pkg update && pkg install python git nano -y
git clone https://github.com/KULLANICI/REPO && cd REPO/backend
pip install -r requirements.txt
cp .env.example .env && nano .env
termux-wake-lock
python app.py

## Bağlantı
Vercel sayfasını aynı telefonda aç: Backend adresi http://127.0.0.1:5000
Başka cihazdan erişmek için: pkg install cloudflared; cloudflared tunnel --url http://127.0.0.1:5000
(verdiği https adresini Backend adresi olarak gir; ACCESS_KEY'i kimseyle paylaşma)

.env ve data/ klasörünü GitHub'a yükleme.
