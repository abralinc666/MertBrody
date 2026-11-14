// =====================================================================
//  BöcekAdam — basit kural tabanlı sohbet beyni (DEMO)
//  İleride buraya gerçek bir yapay zekâ API'si bağlanabilir:
//  getReply() fonksiyonunu async yapıp fetch() ile sunucuna istek atman yeterli.
// =====================================================================

// Türkçe karakterleri sadeleştirip küçük harfe çevir (eşleştirme kolaylığı için)
function normalize(str) {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i").replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// action: karakterin yapacağı hareket → "wave" | "dance" | "laugh" | "nod" | "point" | "shy" | null
const RULES = [
  {
    keys: ["selam", "merhaba", "slm", "mrb", "hey", "naber", "selamun", "hello", "hi"],
    replies: [
      "Selaaam kral! Yayına hoş geldin, otur bi çay iç 😎",
      "Oo kimler gelmiş! Hoş geldin kanka 👋",
      "Merhaba merhaba! Böcek abin burada, sen nasılsın?",
    ],
    action: "wave",
  },
  {
    keys: ["nasilsin", "iyi misin", "ne haber", "napiyorsun", "ne yapiyorsun"],
    replies: [
      "Bomba gibiyim! Koltuğum rahat, chat'im kalabalık, daha ne isterim 🔥",
      "Valla yayındayım, sizinle takılıyorum. Sen nasılsın asıl?",
      "Antenlerim tam çekiyor, keyfim yerinde 📡😄",
    ],
    action: "nod",
  },
  {
    keys: ["kac yas", "yasin kac", "yasindasin", "dogum"],
    replies: [
      "Böcek yılıyla 3, insan yılıyla 25 falan 😏 Ama ruhum hep genç kral!",
      "Yaş sadece bir sayı kanka, önemli olan anten uzunluğu 📡",
    ],
    action: "laugh",
  },
  {
    keys: ["adin ne", "kimsin", "sen kim", "ismin"],
    replies: [
      "Ben BöcekAdam! Mahallenin en havalı böceği, chat'in kralı 👑",
      "BöcekAdam diyorlar bana. Altın kolye, şapka ters, tarz belli 😎",
    ],
    action: "point",
  },
  {
    keys: ["dans", "oyna", "kopur", "salla"],
    replies: [
      "Müzik açın müzik! İzleyin şimdi bu hareketleri 🕺🪲",
      "Koltukta dans mı? Tabii ki, ben her yerde oynarım! 💃",
    ],
    action: "dance",
  },
  {
    keys: ["fikra", "saka", "komik", "guldur"],
    replies: [
      "Böceğin biri bilgisayara girmiş… programcılar hâlâ beni arıyor 🐛😂",
      "Neden böcekler hiç kart oynamaz? Çünkü masada hep 'bug' çıkıyor! 😂",
      "Temel'le bir böcek asansöre binmiş… neyse, sonunu ben de unuttum 😅",
    ],
    action: "laugh",
  },
  {
    keys: ["gul", "hediye", "aslan", "gonderdim", "bagis"],
    replies: [
      "Ooo çok teşekkürler kral! Hediye hedefimize az kaldı 🎁🌹",
      "Eyvallah kanka, kalbime dokundun 💜 Saatlik sıralamada uçuyoruz!",
    ],
    action: "shy",
  },
  {
    keys: ["seviyorum", "seni sev", "kalp", "tatli", "super", "efsane", "harika"],
    replies: [
      "Ben de sizi çok seviyorum, siz olmasanız bu koltuk boş kalırdı 💜",
      "Aaa utandırma beni şimdi 🥹 Efsane olan sizsiniz!",
    ],
    action: "shy",
  },
  {
    keys: ["takip", "abone", "follow"],
    replies: [
      "Takip etmeyen kalmasın! Yukarıdaki pembe butona bas, böcek ailesine katıl 🪲",
      "Takip edenlere selam olsun, etmeyenlere de… yakında edecekler 😏",
    ],
    action: "point",
  },
  {
    keys: ["sarki", "muzik", "soyle"],
    replies: [
      "La la laaa… Sesim biraz cızırtılı ama içimden geliyor 🎤",
      "Bugün mikrofon bende, ama şarkıyı chat söylesin! 🎶",
    ],
    action: "dance",
  },
  {
    keys: ["ne yersin", "yemek", "ac misin", "aciktin"],
    replies: [
      "Mutfakta ne bulursam 😅 Şaka şaka, ben bir döner insanıyım… pardon, döner böceğiyim 🌯",
    ],
    action: "laugh",
  },
  {
    keys: ["gorusuruz", "bay", "hosca kal", "gidiyorum", "iyi geceler"],
    replies: [
      "Görüşürüz kral! Yine bekleriz, kapı her zaman açık 👋",
      "Hoşça kal kanka, kendine iyi bak! 💜",
    ],
    action: "wave",
  },
  {
    keys: ["kral", "abi", "kanka", "reis"],
    replies: [
      "Söyle kralım, dinliyorum 👂",
      "Buyur kanka, chat senin 😎",
    ],
    action: "nod",
  },
];

const FALLBACK = [
  "Hmm, antenlerim tam çekmedi galiba 📡 Bir daha söyler misin?",
  "Vay be, bunu hiç düşünmemiştim! Anlat bakalım biraz daha 🤔",
  "Kral bunu chat'e soralım, ne diyorsunuz millet? 😄",
  "Ben bir böceğim, her şeyi bilemem ama seninle sohbet güzel 😎",
];

export function getReply(text) {
  const n = " " + normalize(text) + " ";
  for (const rule of RULES) {
    if (rule.keys.some((k) => n.includes(" " + k))) {
      return { text: pick(rule.replies), action: rule.action };
    }
  }
  if (n.trim().endsWith("?") || text.trim().endsWith("?")) {
    return { text: pick(["Güzel soru kral! Cevabı bir sonraki yayında 😏", "Onu ben de merak ediyorum açıkçası 🤔"]), action: "nod" };
  }
  return { text: pick(FALLBACK), action: "nod" };
}

export const WELCOME = "Selam millet! Ben BöcekAdam 🪲 Aşağıdan bana bir şeyler yaz, sohbet edelim!";
