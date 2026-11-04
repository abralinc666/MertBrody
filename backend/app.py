# -*- coding: utf-8 -*-
"""LovelyTG - Telegram hesabına giriş yapıp gerçek verileri gösteren yerel panel."""
import asyncio, functools, hmac, os, sys, threading, time
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from telethon import TelegramClient
from telethon.errors import (FloodWaitError, PasswordHashInvalidError, PhoneCodeExpiredError,
                             PhoneCodeInvalidError, PhoneNumberInvalidError, SessionPasswordNeededError)

load_dotenv()
if not os.getenv("TG_API_ID") or not os.getenv("TG_API_HASH"):
    sys.exit(".env dosyasında TG_API_ID ve TG_API_HASH eksik (my.telegram.org'dan al).")
API_ID, API_HASH = int(os.environ["TG_API_ID"]), os.environ["TG_API_HASH"]
os.makedirs("data", exist_ok=True)

# Telethon tek bir arka plan olay döngüsünde çalışır
loop = asyncio.new_event_loop()
threading.Thread(target=loop.run_forever, daemon=True).start()
def run(coro, t=120):
    return asyncio.run_coroutine_threadsafe(coro, loop).result(t)

async def _init():
    c = TelegramClient("data/session", API_ID, API_HASH)
    await c.connect()
    return c
client = run(_init())
pending, cache = {}, {"t": 0, "v": None}
app = Flask(__name__)
ACCESS_KEY = os.getenv("ACCESS_KEY", "")
if len(ACCESS_KEY) < 16:
    sys.exit(".env dosyasında en az 16 karakterlik ACCESS_KEY olmalı.")
ORIGINS = {o.strip().rstrip("/") for o in os.getenv("ALLOWED_ORIGINS", "").split(",") if o.strip()}

@app.before_request
def guard():
    if request.method == "OPTIONS":
        return "", 204
    if request.path.startswith("/api/") and not hmac.compare_digest(
            request.headers.get("X-Access-Key", "").encode(), ACCESS_KEY.encode()):
        return jsonify(error="Erişim anahtarı hatalı."), 403

@app.after_request
def cors(r):
    o = request.headers.get("Origin", "")
    if o in ORIGINS:
        r.headers.update({"Access-Control-Allow-Origin": o, "Vary": "Origin",
                          "Access-Control-Allow-Headers": "Content-Type, X-Access-Key",
                          "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                          "Access-Control-Allow-Private-Network": "true"})
    return r

ERR = {PhoneCodeInvalidError: "Kod hatalı.", PhoneCodeExpiredError: "Kodun süresi doldu, yeniden iste.",
       PasswordHashInvalidError: "Şifre hatalı.", PhoneNumberInvalidError: "Telefon numarası geçersiz."}
def api(f):
    @functools.wraps(f)
    def w(*a, **k):
        try:
            return f(*a, **k)
        except FloodWaitError as e:
            return jsonify(error=f"Telegram {e.seconds} sn beklemeni istiyor."), 429
        except tuple(ERR) as e:
            return jsonify(error=ERR[type(e)]), 400
        except Exception as e:
            return jsonify(error=f"Beklenmeyen hata: {e}"), 500
    return w

def authed():
    return run(client.is_user_authorized())

@app.get("/api/status")
@api
def status():
    return jsonify(authorized=authed())

@app.post("/api/login/send")
@api
def send():
    phone = (request.json.get("phone") or "").strip().replace(" ", "")
    r = run(client.send_code_request(phone))
    pending.update(phone=phone, hash=r.phone_code_hash)
    return jsonify(ok=True)

@app.post("/api/login/verify")
@api
def verify():
    d = request.json
    try:
        if d.get("password"):
            run(client.sign_in(password=d["password"]))
        else:
            run(client.sign_in(pending["phone"], (d.get("code") or "").strip(), phone_code_hash=pending["hash"]))
    except SessionPasswordNeededError:
        return jsonify(need_password=True)
    cache["v"] = None
    return jsonify(ok=True)

@app.post("/api/logout")
@api
def logout():
    global client
    run(client.log_out())
    client = run(_init())
    cache["v"] = None
    return jsonify(ok=True)

async def collect():
    me = await client.get_me()
    start = (datetime.now(timezone.utc) - timedelta(days=6)).replace(hour=0, minute=0, second=0, microsecond=0)
    dialogs = await client.get_dialogs(limit=300)
    groups, channels, users, unread, recent = [], 0, 0, 0, []
    for d in dialogs:
        unread += d.unread_count
        if d.is_group:
            groups.append(dict(name=d.name, members=getattr(d.entity, "participants_count", None) or 0, unread=d.unread_count))
        elif d.is_channel:
            channels += 1
        else:
            users += 1
    for d in dialogs[:8]:
        m = d.message
        recent.append(dict(title=d.name, text=((m.message or "[medya]")[:70] if m else ""),
                           date=m.date.isoformat() if m else None, out=bool(m and m.out)))
    sent, recv = [0] * 7, [0] * 7
    for d in dialogs[:12]:
        async for m in client.iter_messages(d, limit=300):
            if m.date < start:
                break
            i = (m.date - start).days
            if 0 <= i < 7:
                (sent if m.out else recv)[i] += 1
    groups.sort(key=lambda g: -g["members"])
    ph = me.phone or ""
    return dict(
        me=dict(name=" ".join(filter(None, [me.first_name, me.last_name])) or "Kullanıcı",
                username=me.username, phone=("+" + ph[:3] + "*****" + ph[-2:]) if len(ph) > 6 else ""),
        totals=dict(chats=len(dialogs), groups=len(groups), channels=channels, users=users,
                    unread=unread, members=sum(g["members"] for g in groups)),
        sent=sent, recv=recv, labels=[(start + timedelta(days=i)).strftime("%d.%m") for i in range(7)],
        groups=groups, recent=recent)

@app.get("/api/dashboard")
@api
def dashboard():
    if not authed():
        return jsonify(error="Oturum yok"), 401
    if request.args.get("refresh") or not cache["v"] or time.time() - cache["t"] > 120:
        cache.update(v=run(collect(), 180), t=time.time())
    return jsonify(cache["v"])

if __name__ == "__main__":
    # Yalnızca bu cihazdan erişilir; internete açma (oturum hesabının tamamına erişim verir).
    app.run(host="127.0.0.1", port=5000, threaded=True)
