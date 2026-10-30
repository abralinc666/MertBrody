/* EPİN PRO - Veri, Katalog, SEO İçerikleri ve Sabitler (data.js) */
window.EPIN_DATA = {
  CATS: [
    ["all", "Tüm Oyunlar", "#8B3DFF", "▦"],
    ["steam", "Steam", "#1b2838", "S"],
    ["ps", "PlayStation", "#0070d1", "PS"],
    ["xbox", "Xbox", "#107c10", "X"],
    ["nintendo", "Nintendo", "#e60012", "N"],
    ["riot", "Riot Games", "#d13639", "R"],
    ["epic", "Epic Games", "#2a2a2a", "E"],
    ["pubg", "PUBG Mobile", "#c98a1a", "P"],
    ["valorant", "Valorant", "#ff4655", "V"],
    ["ml", "Mobile Legends", "#4f46e5", "M"],
    ["zula", "Zula", "#334155", "Z"],
    ["gplay", "Google Play", "#0f9d58", "▶"],
    ["app", "App Store", "#1a8cff", "A"]
  ],
  PRODUCTS: [
    {id:"p1", slug:"steam-100-tl-cuzdan-kodu", cat:"steam", name:"Steam Cüzdan Kodu", variant:"100 TL", price:11290, old:12500, stock:42, tag:"En Çok Satan", sold:980, rating:4.9, reviews:142, region:"🇹🇷 TR Hesap", delivery:"key", g:"linear-gradient(135deg,#0b1830,#1b3a6b)", lbl:"STEAM", desc:"Steam Türkiye mağazasında geçerli 100 TL bakiye kodu. Anında dijital teslimat."},
    {id:"p2", slug:"psn-50-tl-hediye-karti", cat:"ps", name:"PlayStation Network Card", variant:"50 TL", price:56490, stock:18, sold:640, rating:4.8, reviews:84, region:"🇹🇷 TR Mağaza", delivery:"key", g:"linear-gradient(135deg,#0a3b9c,#1d6fe0)", lbl:"PlayStation", desc:"PlayStation Store Türkiye hesaplarında oyun, eklenti ve PS Plus alışverişlerinde geçerlidir."},
    {id:"p3", slug:"xbox-100-tl-gift-card", cat:"xbox", name:"Xbox Gift Card", variant:"100 TL", price:109990, old:119990, stock:25, sold:720, rating:4.9, reviews:96, region:"🇹🇷 TR Bölgesi", delivery:"key", g:"linear-gradient(135deg,#0d6b0d,#1fa51f)", lbl:"XBOX", desc:"Xbox Series X|S, Xbox One ve Windows Microsoft Store üzerinde geçerli hediye kartı."},
    {id:"p4", slug:"pubg-mobile-600-uc", cat:"pubg", name:"PUBG Mobile UC", variant:"600 + 60 UC", price:44990, stock:60, tag:"ID Yükleme", sold:810, rating:5.0, reviews:215, region:"🌍 Global ID", delivery:"topup", topupLabel:"PUBG Mobile Oyuncu ID (Karakter ID)", g:"linear-gradient(135deg,#3a2a14,#c98a1a)", lbl:"PUBG", desc:"Şifrenizi vermenize gerek kalmadan yalnızca Oyuncu ID numaranızla hesabınıza anında UC yüklenir."},
    {id:"p5", slug:"riot-points-1250-rp", cat:"riot", name:"League of Legends RP", variant:"1250 RP", price:69990, stock:15, sold:500, rating:4.8, reviews:67, region:"🇹🇷 TR Sunucu", delivery:"key", g:"linear-gradient(135deg,#2a0a14,#a11a2f)", lbl:"RIOT RP", desc:"League of Legends ve TFT Türkiye sunucusunda geçerli Riot Pin kodu."},
    {id:"p6", slug:"valorant-1000-vp", cat:"valorant", name:"Valorant Points", variant:"1000 VP", price:49990, old:54990, stock:30, tag:"Popüler", sold:430, rating:4.9, reviews:188, region:"🇹🇷 TR Sunucu", delivery:"key", g:"linear-gradient(135deg,#3b0a16,#ff4655)", lbl:"VP", desc:"Valorant Türkiye sunucusu hesaplarında Savaş Bileti ve kaplama satın almak için anında teslim VP kodu."},
    {id:"p7", slug:"nintendo-eshop-25-usd", cat:"nintendo", name:"Nintendo eShop Kartı", variant:"25 USD", price:84990, stock:12, sold:210, rating:4.7, reviews:39, region:"🇺🇸 ABD Bölgesi", delivery:"key", g:"linear-gradient(135deg,#7a0a10,#e60012)", lbl:"NINTENDO", desc:"ABD (US) bölgesi seçili Nintendo Switch hesaplarında geçerli 25$ bakiye kartı."},
    {id:"p8", slug:"epic-games-500-tl-hediye-karti", cat:"epic", name:"Epic Games Hediye Kartı", variant:"500 TL", price:49900, stock:9, sold:150, rating:4.8, reviews:44, region:"🇹🇷 TR Hesap", delivery:"key", g:"linear-gradient(135deg,#111,#3a3a3a)", lbl:"EPIC", desc:"Epic Games Store ve Fortnite alışverişlerinde kullanılabilen bakiye kodu."},
    {id:"p9", slug:"mobile-legends-500-elmas", cat:"ml", name:"Mobile Legends Diamonds", variant:"500 Elmas", price:39990, stock:35, tag:"ID Yükleme", sold:300, rating:4.9, reviews:91, region:"🌍 Global ID", delivery:"topup", topupLabel:"MLBB Kullanıcı ID ve Sunucu No (Örn: 12345678 (1234))", g:"linear-gradient(135deg,#1e1b4b,#4f46e5)", lbl:"M.LEGENDS", desc:"Oyuncu ID ve Sunucu numaranıza doğrudan otomatik elmas yüklemesi yapılır."},
    {id:"p10", slug:"zula-1000-altin", cat:"zula", name:"Zula Altın", variant:"1000 ZA", price:19990, old:22990, stock:50, sold:260, rating:4.7, reviews:52, region:"🇹🇷 TR Sunucu", delivery:"key", g:"linear-gradient(135deg,#1e293b,#475569)", lbl:"ZULA", desc:"Zula Türkiye sunucusunda hemen aktif edilebilir e-pin kodu."},
    {id:"p11", slug:"google-play-250-tl-kodu", cat:"gplay", name:"Google Play Hediye Kodu", variant:"250 TL", price:25990, stock:40, sold:590, rating:4.9, reviews:130, region:"🇹🇷 TR Mağaza", delivery:"key", g:"linear-gradient(135deg,#064e3b,#0f9d58)", lbl:"GOOGLE PLAY", desc:"Android uygulama, oyun içi satın alma ve aboneliklerde geçerli resmi Google Play kodu."},
    {id:"p12", slug:"app-store-200-tl-hediye-karti", cat:"app", name:"App Store & iTunes Kartı", variant:"200 TL", price:20990, stock:22, sold:470, rating:4.9, reviews:110, region:"🇹🇷 TR Apple ID", delivery:"key", g:"linear-gradient(135deg,#0c2a5e,#1a8cff)", lbl:"APP STORE", desc:"iCloud+, Apple Music, App Store oyun ve uygulamalarında geçerli Türkiye bakiye kodu."}
  ],
  BRANDS: [
    ["steam","Steam","#1b2838","S"],["ps","PlayStation","#0070d1","PS"],["xbox","Xbox","#107c10","X"],
    ["nintendo","Nintendo","#e60012","N"],["riot","Riot Games","#d13639","R"],["epic","Epic Games","#2a2a2a","E"],
    ["gplay","Google Play","#0f9d58","▶"],["app","App Store","#1a8cff","A"],["all","Tüm Markalar","#334155","▦"]
  ],
  SLIDES: [
    {e:"Hızlı • Güvenli • 7/24 Otomatik Teslimat", h:"Tüm Oyunlar İçin<br><em>E-PİN</em> ve <em>ID Yükleme</em>", p:"Dijital kodlarınızı saniyeler içinde Kod Kasanızdan alın veya Oyuncu ID'nize anında bakiye yükletin.", b:"Alışverişe Başla", bg:"linear-gradient(120deg,#0a1030,#3b1a8f 60%,#ff4655)", art:["STEAM","PLAYSTATION","XBOX","PUBG","VALORANT"], cat:"all"},
    {e:"Haftanın Fırsatı", h:"Steam Cüzdan<br>Kodlarında <em>%10</em>", p:"Türkiye bölgesi garantili Steam kodlarında indirim ve %1 nakit bonus puan fırsatı.", b:"Fırsatları Gör", bg:"linear-gradient(120deg,#08101f,#1b3a6b)", art:["STEAM"], cat:"steam"},
    {e:"Hoş Geldin Kampanyası", h:"İlk Siparişe Özel<br><em>HOSGELDIN5</em> Kuponu", p:"Sepette HOSGELDIN5 kupon kodunu kullanın, anında %5 ekstra indirim kazanın.", b:"Hemen Kullan", bg:"linear-gradient(120deg,#05140a,#0d6b0d)", art:["%5 KUPON"], cat:"all"}
  ],
  CAMPS: [
    ["STEAM","CÜZDAN KODLARINDA","%10 İNDİRİM","linear-gradient(120deg,#0b1830,#1b3a6b)","steam",""],
    ["PlayStation Store","KARTLARINDA","ÖZEL FİYATLAR","linear-gradient(120deg,#0a3b9c,#1d6fe0)","ps",""],
    ["PUBG & MLBB","OYUNCU ID'YE","ANINDA YÜKLEME","linear-gradient(120deg,#0d6b0d,#14401a)","pubg","gr"]
  ],
  COUPONS: {
    "HOSGELDIN5": { rate: 5, desc: "Yeni Üye %5 İndirimi" },
    "EPIN10": { rate: 10, desc: "Özel Kampanya %10 İndirimi" }
  },
  TICKER: [
    ["Ahmet K.", "Valorant 1000 VP", "1 dk önce", "🇹🇷 TR"],
    ["Mert Y.", "PUBG Mobile 600 UC (ID Yükleme)", "2 dk önce", "⚡ Anında"],
    ["Zeynep A.", "Steam 100 TL Cüzdan Kodu", "4 dk önce", "🇹🇷 TR"],
    ["Burak T.", "Google Play 250 TL Kodu", "6 dk önce", "⭐ 5.0"],
    ["Caner D.", "Mobile Legends 500 Elmas", "9 dk önce", "⚡ Anında"]
  ],
  REVIEWS: [
    {u:"Emre S.", r:5, d:"Saniyesinde Kod Kasama düştü, Steam'de sorunsuz aktif ettim.", t:"Bugün"},
    {u:"Kaan B.", r:5, d:"PUBG ID'mi girdim, 1 dakika içinde UC hesabıma yüklendi. Güvenilir.", t:"Dün"},
    {u:"Selin M.", r:5, d:"Cüzdan bakiyesiyle tek tıkla aldım, HOSGELDIN5 kuponu da çalıştı.", t:"3 gün önce"}
  ],
  SEO_TEXT: {
    all: {
      title: "EPİN – Dijital Oyun Kodları, E-Pin ve Oyuncu ID Yükleme Merkezi",
      desc: "Türkiye'nin hızlı ve güvenli e-pin platformu. Steam, Valorant VP, PUBG Mobile UC, PlayStation ve Google Play kodlarında 7/24 anında teslimat, bölge garantisi ve her alışverişte %1 Bonus Puan avantajı.",
      faqs: [
        ["Satın aldığım E-Pin kodu nereye gelir?", "Ödemeniz onaylandığı anda kodunuz 'Hesabım > Siparişlerim' ekranındaki Dijital Kod Kasası'na maskeli olarak teslim edilir. 'Kodu Göster' butonuna tıklayarak anında kopyalayabilirsiniz."],
        ["Oyuncu ID (Top-Up) yüklemesi nasıl çalışır?", "PUBG Mobile UC ve Mobile Legends Elmas gibi ürünlerde hesap şifreniz istenmez. Sepete eklerken girdiğiniz Oyuncu ID'nize otomatik olarak bakiye aktarılır."],
        ["İndirim kuponu ve Bonus Puan nasıl kullanılır?", "Sepet çekmecesinde 'HOSGELDIN5' kuponunu girerek %5 indirim alabilirsiniz. Ayrıca tamamlanan her sipariş tutarının %1'i Cüzdan Bakiyenize otomatik eklenir."]
      ]
    },
    steam: {
      title: "Steam Cüzdan Kodu Satın Al – Anında Teslimat & TR Garantili",
      desc: "Steam Cüzdan Kodu ile kredi kartı bilgisi paylaşmadan Steam Türkiye mağazasındaki binlerce oyunu güvenle satın alın. Kodlarınız 7/24 saniyeler içinde teslim edilir.",
      faqs: [
        ["Steam Cüzdan Kodu nasıl aktif edilir?", "Steam uygulamasını açın > Sağ üstten hesap adınıza tıklayın > 'Cüzdan Kodu veya Hediye Kartı Kullan' seçeneğine kodunuzu yapıştırın."],
        ["Bu kodlar hangi bölgede geçerlidir?", "Sitemizdeki tüm Steam cüzdan kodları Türkiye (TL/MENA-USD) hesaplarında %100 çalışma garantilidir."]
      ]
    },
    valorant: {
      title: "Valorant Points (VP) Satın Al – En Ucuz VP Fiyatları",
      desc: "Valorant Türkiye sunucusunda geçerli Valorant Points (VP) kodları anında Kod Kasanızda! Gece Pazarı, Savaş Bileti ve yeni kaplama paketlerini hemen açın.",
      faqs: [
        ["Valorant VP kodu nereye girilir?", "Valorant oyun içi mağazasına girin > Sağ üstteki Valorant simgesine tıklayın > 'Riot Pin ve Kodlar' kutucuğuna sitemizden aldığınız kodu yapıştırın."]
      ]
    },
    pubg: {
      title: "PUBG Mobile UC Satın Al – ID İle Anında UC Yükleme",
      desc: "PUBG Mobile Unknown Cash (UC) paketlerini şifre vermeden yalnızca Oyuncu ID'niz ile 7/24 güvenli ve hızlı şekilde hesabınıza yükleyin.",
      faqs: [
        ["PUBG Mobile Karakter ID numaramı nereden bulabilirim?", "Oyun içinde sol üstteki profil resminize tıkladığınızda avatarınızın hemen üstünde yer alan 9-11 haneli rakam sizin Oyuncu ID'nizdir."]
      ]
    }
  },
  PAY: {
    iban: {bank:"Ziraat Bankası / Örnek E-Pin A.Ş.", holder:"EPİN DİJİTAL OYUN HİZMETLERİ A.Ş.", no:"TR44 0001 0020 3040 5060 7080 90"},
    crypto: {coin:"USDT", net:"TRC20", addr:"TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE", rate:4000}
  }
};
