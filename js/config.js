/* YAYINA ALMADAN ÖNCE BU DOSYAYI DÜZENLEYİN.
   Fiyatlar örnektir. IBAN/cüzdan alanları bilerek boş bırakılmıştır.
   Gerçek ödeme doğrulaması ve lisans aktivasyonu için backend gerekir. */
window.LOVELYTG_CONFIG = {
  currency: "₺",
  bank: { name: "Banka / Hesap sahibi bilgisi eklenecek", iban: "TR00 0000 0000 0000 0000 0000 00" },
  crypto: { network: "USDT · TRC20", wallet: "Cüzdan adresinizi buraya ekleyin" },
  periods: {
    weekly: { label: "Haftalık", suffix: "/ 7 gün" },
    monthly: { label: "Aylık", suffix: "/ ay" },
    yearly: { label: "Yıllık", suffix: "/ yıl" }
  },
  plans: [
    { id:"starter", name:"Starter", tag:"BAŞLANGIÇ", description:"LovelyTG ile tanışmak isteyenler için.", featured:false,
      prices:{weekly:149,monthly:399,yearly:3990},
      features:["1 Telegram hesabı","3 aktif otomasyon","Temel zamanlayıcı","Son 7 gün işlem geçmişi","Temel destek"] },
    { id:"pro", name:"Pro", tag:"GELİŞMİŞ YÖNETİM", description:"Daha fazla kontrol ve düzen isteyenler için.", featured:true,
      prices:{weekly:299,monthly:799,yearly:7990},
      features:["5 Telegram hesabına kadar","15 aktif otomasyon","Gelişmiş zamanlama","30 gün işlem geçmişi","Analiz ve raporlar","Öncelikli destek"] },
    { id:"ultimate", name:"Ultimate", tag:"TAM KONTROL", description:"Platformun gelişmiş yeteneklerini isteyenlere.", featured:false,
      prices:{weekly:599,monthly:1499,yearly:14990},
      features:["10 Telegram hesabına kadar","Sınırsız otomasyon","Gelişmiş analiz araçları","90 gün işlem geçmişi","AI özellikleri (API gerektirir)","Öncelikli destek ve erken erişim"] }
  ]
};
