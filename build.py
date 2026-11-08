#!/usr/bin/env python3
"""BC Nails derleyici: .env -> doğrulama -> dist/ (yayın) + out/ (tek dosya). Kullanım: python3 build.py"""
import base64, datetime, hashlib, html, json, os, re, shutil, sys
from pathlib import Path
R = Path(__file__).resolve().parent; S = R/"src"; D = R/"dist"; O = R/"out"

def load_env():
    e = {}
    f = R/".env"
    if not f.exists(): sys.exit("HATA: .env bulunamadı (.env.example dosyasını kopyalayıp .env yapın)")
    for ln in f.read_text(encoding="utf8").splitlines():
        ln = ln.strip()
        if not ln or ln.startswith("#") or "=" not in ln: continue
        k, v = ln.split("=", 1); v = v.strip()
        if len(v) > 1 and v[0] == v[-1] and v[0] in "\"'": v = v[1:-1]
        e[k.strip()] = v
    return {**e, **{k: os.environ[k] for k in e if k in os.environ}}
E = load_env()
def err(m): sys.exit("HATA (.env): " + m)
def get(k, d=""): return E.get(k, d).strip()
def url(k, hosts=None, req=False):
    v = get(k)
    if not v:
        if req: err(f"{k} boş olamaz")
        return ""
    m = re.fullmatch(r"https://([a-z0-9.-]+)(/[^\s\"'<>]*)?", v, re.I)
    if not m: err(f"{k} geçerli bir https:// adresi olmalı")
    if hosts and m.group(1).lower() not in hosts: err(f"{k} izinli alan adlarından biri olmalı: {', '.join(sorted(hosts))}")
    return v
GH = {"maps.app.goo.gl", "goo.gl", "www.google.com", "google.com", "maps.google.com", "www.google.com.tr", "g.co"}
V = {}
V["WHATSAPP_NUMBER"] = get("WHATSAPP_NUMBER")
if not re.fullmatch(r"\d{10,15}", V["WHATSAPP_NUMBER"]): err("WHATSAPP_NUMBER sadece rakam olmalı (10-15 hane), örn: 905375264464")
V["PHONE_NUMBER"] = get("PHONE_NUMBER") or V["WHATSAPP_NUMBER"]
if not re.fullmatch(r"\d{10,15}", V["PHONE_NUMBER"]): err("PHONE_NUMBER sadece rakam olmalı")
p = V["PHONE_NUMBER"]
V["PHONE_DISPLAY"] = f"0{p[2:5]} {p[5:8]} {p[8:10]} {p[10:12]}" if p.startswith("90") and len(p) == 12 else "+" + p
V["MAP_URL"] = url("MAP_URL", GH, True)
V["MAP_EMBED"] = url("MAP_EMBED", {"www.google.com"})
if V["MAP_EMBED"] and not V["MAP_EMBED"].startswith("https://www.google.com/maps/embed"): err("MAP_EMBED, https://www.google.com/maps/embed ile başlamalı")
SITE = url("SITE_URL", None, True).rstrip("/")
V["INSTAGRAM"] = url("INSTAGRAM", {"www.instagram.com", "instagram.com"}); V["TIKTOK"] = url("TIKTOK", {"www.tiktok.com", "tiktok.com"}); V["YOUTUBE"] = url("YOUTUBE", {"www.youtube.com", "youtube.com", "youtu.be"})
NAME = get("BUSINESS_NAME", "BC Nails")[:80]
V["CAMPAIGN"] = get("CAMPAIGN", "")[:140]
oh = re.fullmatch(r"(\d\d:\d\d)-(\d\d:\d\d)", get("OPENING_HOURS", "10:00-20:00"))
if not oh: err("OPENING_HOURS biçimi 10:00-20:00 olmalı")
for k in ("GEO_LAT", "GEO_LNG"):
    if get(k):
        try: float(get(k))
        except ValueError: err(f"{k} sayı olmalı")

idx = (S/"index.html").read_text(encoding="utf8")
title = html.unescape(re.search(r"<title>(.*?)</title>", idx).group(1)); desc = html.unescape(re.search(r'name="description" content="(.*?)"', idx).group(1))
svcs = [(html.unescape(n), int(pr)) for n, pr in re.findall(r'<button class="svc"[^>]*>.*?<b>(.*?)</b><small>(\d+) ₺', idx, re.S)]
faqs = [(html.unescape(q), html.unescape(a)) for q, a in re.findall(r"<summary>(.*?)</summary><p>(.*?)</p>", idx, re.S)]
ld = {"@context": "https://schema.org", "@type": "NailSalon", "@id": SITE + "/#salon", "name": NAME, "url": SITE + "/", "image": [SITE + "/img/og.jpg"],
      "telephone": "+" + V["PHONE_NUMBER"], "priceRange": "₺₺", "hasMap": V["MAP_URL"], "description": desc,
      "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], "opens": oh.group(1), "closes": oh.group(2)}],
      "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Hizmetler", "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": n}, "priceSpecification": {"@type": "PriceSpecification", "minPrice": pr, "priceCurrency": "TRY"}} for n, pr in svcs]}}
sa = [V[k] for k in ("INSTAGRAM", "TIKTOK", "YOUTUBE") if V[k]]
if sa: ld["sameAs"] = sa
if get("ADDRESS_STREET") or get("ADDRESS_CITY"):
    ld["address"] = {"@type": "PostalAddress", "addressCountry": "TR", **{a: get(k)[:120] for a, k in (("streetAddress", "ADDRESS_STREET"), ("addressLocality", "ADDRESS_CITY"), ("addressRegion", "ADDRESS_REGION"), ("postalCode", "ADDRESS_ZIP")) if get(k)}}
if get("GEO_LAT") and get("GEO_LNG"): ld["geo"] = {"@type": "GeoCoordinates", "latitude": float(get("GEO_LAT")), "longitude": float(get("GEO_LNG"))}
faq = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}
jd = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")
e = lambda s: html.escape(s, quote=True)
HEAD = f'''<meta http-equiv="Content-Security-Policy" content="@@CSP@@">
<meta name="referrer" content="strict-origin-when-cross-origin">
<meta name="robots" content="index,follow,max-image-preview:large">
<link rel="canonical" href="{e(SITE)}/">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3E💅%3C/text%3E%3C/svg%3E">
<meta property="og:type" content="website"><meta property="og:site_name" content="{e(NAME)}"><meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(desc)}"><meta property="og:url" content="{e(SITE)}/"><meta property="og:image" content="{e(SITE)}/img/og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="tr_TR">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{e(title)}"><meta name="twitter:description" content="{e(desc)}"><meta name="twitter:image" content="{e(SITE)}/img/og.jpg">
<script type="application/ld+json">{jd(ld)}</script>
<script type="application/ld+json">{jd(faq)}</script>'''

def fill(t):
    def r(m):
        k = m.group(2)
        if m.group(1) == "raw:": return HEAD
        v = V[k]
        return jd(v) if m.group(1) == "js:" else e(v)
    return re.sub(r"\{\{(raw:|js:)?([A-Z_]+)\}\}", r, t)
def csp(script, style, header=False):
    fr = f"frame-src {V['MAP_EMBED'].split('/maps')[0]};" if V["MAP_EMBED"] else "frame-src 'none';"
    c = f"default-src 'none'; script-src {script}; style-src {style} https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data:; connect-src 'none'; {fr} base-uri 'none'; form-action 'none'; object-src 'none'"
    return c + ("; frame-ancestors 'none'; upgrade-insecure-requests" if header else "")
sha = lambda s: "'sha256-" + base64.b64encode(hashlib.sha256(s.encode("utf8")).digest()).decode() + "'"

page = fill(idx); js = fill((S/"script.js").read_text(encoding="utf8")); css = (S/"style.css").read_text(encoding="utf8")
assert "{{" not in page and "{{" not in js
for d in (D, O):
    shutil.rmtree(d, ignore_errors=True); d.mkdir()
# --- dist (yayın klasörü) ---
(D/"index.html").write_text(page.replace("@@CSP@@", csp("'self'", "'self'")), encoding="utf8")
(D/"style.css").write_text(css, encoding="utf8"); (D/"script.js").write_text(js, encoding="utf8"); shutil.copytree(S/"img", D/"img")
today = datetime.date.today().isoformat()
(D/"sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>{e(SITE)}/</loc><lastmod>{today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url></urlset>\n', encoding="utf8")
(D/"robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {SITE}/sitemap.xml\n", encoding="utf8")
H = [("Content-Security-Policy", csp("'self'", "'self'", True)), ("Strict-Transport-Security", "max-age=63072000; includeSubDomains"), ("X-Content-Type-Options", "nosniff"), ("X-Frame-Options", "DENY"),
     ("Referrer-Policy", "strict-origin-when-cross-origin"), ("Permissions-Policy", "geolocation=(), camera=(), microphone=(), payment=(), usb=()"), ("Cross-Origin-Opener-Policy", "same-origin")]
(D/"vercel.json").write_text(json.dumps({"headers": [{"source": "/(.*)", "headers": [{"key": k, "value": v} for k, v in H]}, {"source": "/img/(.*)", "headers": [{"key": "Cache-Control", "value": "public, max-age=604800"}]}]}, indent=2), encoding="utf8")
(D/"_headers").write_text("/*\n" + "".join(f"  {k}: {v}\n" for k, v in H) + "/img/*\n  Cache-Control: public, max-age=604800\n", encoding="utf8")
# --- out: tek dosya (CSP hash'li) ---
one = page.replace('<link rel="preload" as="image" href="img/n2.webp" fetchpriority="high">\n', "")
one = re.sub(r'(?<=["\'])(img/[\w\-]+\.webp)(?=["\'])', lambda m: "data:image/webp;base64," + base64.b64encode((S/m.group(1)).read_bytes()).decode(), one)
cs, jsb = "\n" + css + "\n", "\n" + js + "\n"
one = one.replace('<link rel="stylesheet" href="style.css">', "<style>" + cs + "</style>").replace('<script src="script.js" defer></script>', "<script>" + jsb + "</script>")
one = one.replace("@@CSP@@", csp(sha(jsb), sha(cs)))
(O/"BC-Nails-tek-dosya.html").write_text(one, encoding="utf8")
print(f"Tamam ✔  dist/ (yayın) ve out/BC-Nails-tek-dosya.html hazır | WhatsApp: +{V['WHATSAPP_NUMBER']} | Site: {SITE}")
if not (get("ADDRESS_STREET") or get("ADDRESS_CITY")): print("Not: ADDRESS_* boş; yerel SEO için .env içine adres ekleyin.")
