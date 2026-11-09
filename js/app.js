(function(){
var D=[
{i:'🧠',t:'Yapay Zekâ Komuta Merkezi',s:'Sohbet kutusu değil, uygulamanın tamamını yöneten bir asistan.',l:['Doğal dille görev planlama: “Yarın 09.00’da seçtiğim gruplara günaydın mesajı planla”','Son 7 gündeki grup hareketlerini analiz etme','Yanıtlanmamış mesajları bulma','Haftanın en aktif gruplarını gösterme','Gelen mesajlara göre cevap taslakları oluşturma','Son işlemlerdeki hataları inceleyip çözüm önerme'],n:'<b>Önce hazırlar, sonra sorar.</b> Yapay zekâ işlemi hazırlar, önizleme sunar ve gönderim gibi önemli eylemler için onayınızı alır.'},
{i:'🔀',t:'Otomasyon Stüdyosu',s:'Kod yazmadan, görsel akışlarla otomasyon oluşturun.',l:['Günlük, haftalık ve özel takvim','Birden fazla tetikleyici','Koşullu işlemler','Otomasyon kopyalama','Hazır otomasyon şablonları','Hata durumunda durdurma ve bildirim','Her otomasyon için ayrı işlem geçmişi'],f:['Her sabah 09.00','Seçilen grupları kontrol et','Hedef ve izin kontrolü','AI mesaj taslağı hazırla','Kullanıcı onayı ile planla']},
{i:'👤',t:'Çoklu Hesap Merkezi',s:'Tüm Telegram hesaplarınız tek ekranda.',l:['Tüm hesapları tek ekranda görüntüleme','Hesap bazında bağlantı ve oturum durumu','Hesaplara özel etiketler ve gruplar','Hesap bazında otomasyon geçmişi','Oturum süresi ve güvenlik uyarıları','Oturum yedekleme ve geri yükleme','Hesaplar arasında hızlı geçiş','Hesap bazında yetki ve işlem izinleri'],n:'<b>Her hesabın sınırı korunur.</b> Hesaplar birbirinin yerine gönderim yapan bir havuza dönüşmez; her hesap kendi güvenlik ve kullanım sınırlarında çalışır.'},
{i:'📥',t:'Akıllı Gelen Kutusu',s:'Telegram’ı sadece otomasyonla değil, gerçek bir iletişim merkezi olarak yönetin.',l:['Gelen mesajları tek merkezde toplama','Okundu, okunmadı ve yanıt bekliyor filtreleri','Mesajları kategorilere ayırma','Kişilere etiket ekleme','AI cevap önerileri','Hazır cevap kütüphanesi','Önemli konuşmaları sabitleme','Konuşma notları','Mesaj arşivi']},
{i:'📊',t:'Analiz ve İstatistik Laboratuvarı',s:'7, 30 ve 90 günlük analizlerin ötesinde derin içgörü.',l:['Saatlik ve günlük aktivite haritası','En aktif sohbetler','Gelen ve giden mesaj karşılaştırması','En çok kullanılan kelimeler','Grup bazında aktivite değişimi','Yanıt süresi analizi','Haftalık otomatik rapor','CSV, JSON ve PDF dışa aktarma','AI destekli rapor özeti']},
{i:'🛡',t:'Güvenlik ve Kontrol Merkezi',s:'Güvenilirlik, LovelyTG’nin en güçlü yanı.',l:['Aktif oturumların görüntülenmesi','Bilinmeyen cihaz uyarıları','Panel PIN ve güçlü kimlik doğrulama','Şifreli yedekleme','İşlem denetim kayıtları','Otomasyonların acil durdurulması','Gönderim kotaları','FloodWait ve hata yönetimi','Belirsiz gönderimlerin otomatik tekrar edilmemesi'],n:'<b>ACİL DURDURMA:</b> Tüm sistemi tek tuşla durdurun.'},
{i:'✍️',t:'İçerik Stüdyosu',s:'İçeriği tek merkezden hazırlayın ve yönetin.',l:['Mesaj şablonları','Değişkenli metin oluşturma','AI ile metin iyileştirme','Görsel ve video arşivi','Taslak kaydetme','Yayın takvimi','Gönderim öncesi önizleme','Onay bekleyen içerikler','İçerik performansı raporları']},
{i:'📡',t:'Gerçek Zamanlı Olay Merkezi',s:'Sistemde olan her şey tek ekranda.',l:['Canlı işlem akışı','İşlem bazında detaylı hata raporu','Masaüstü ve mobil bildirimler','Filtrelenebilir loglar','Hatalı işlemler için inceleme ekranı'],f:['Hesap bağlantısı','Otomasyon','Mesaj yanıtı','Telegram bekleme sınırı','Yedekleme'],fl:'Takip edilen olaylar'},
{i:'🧩',t:'Modül Merkezi',s:'Her modül bağımsız çalışır; istediğinizi açın, istediğinizi kapatın.',l:['AI Asistanı','Akıllı Gelen Kutusu','Gelişmiş Analiz','İçerik Stüdyosu','Anket ve Form Yönetimi','RSS Takipçisi','Webhook Entegrasyonu','Yedekleme Yöneticisi','Topluluk Yönetimi'],n:'Eklenti ve entegrasyonlarla LovelyTG sizinle birlikte büyür.'},
{i:'📱',t:'Gelişmiş Mobil Deneyim',s:'Telefondan yönetim için tasarlandı.',l:['Mobil uygulama hissi veren PWA','Alt navigasyon çubuğu','Tek elle kullanım','Canlı bildirimler','Mobil otomasyon kontrolü','Hızlı işlem butonları','Çevrimdışı görüntülenebilen son raporlar','Mobil uyumlu grafikler']}
];
var T=document.getElementById('tabs'),P=document.getElementById('fpanel');
function show(k){
var d=D[k],h='<h3>'+d.t+'</h3><p class="sub">'+d.s+'</p><ul class="fl">'+d.l.map(function(x){return '<li>'+x+'</li>'}).join('')+'</ul>';
if(d.f)h+='<div class="note"><b>'+(d.fl||'Örnek akış')+'</b><div class="flow">'+d.f.map(function(x,j){return (j?'<em>→</em>':'')+'<span>'+x+'</span>'}).join('')+'</div></div>';
if(d.n)h+='<div class="note">'+d.n+'</div>';
P.innerHTML=h;
var b=T.children;for(var j=0;j<b.length;j++)b[j].setAttribute('aria-selected',j==k);
}
D.forEach(function(d,k){var b=document.createElement('button');b.className='tab';b.setAttribute('role','tab');b.innerHTML='<i>'+d.i+'</i>'+d.t;b.onclick=function(){show(k)};T.appendChild(b)});
show(0);
})();
(function(){
var L=[{n:'1 Aylık Lisans',m:1,p:817.16},{n:'3 Aylık Lisans',m:3,p:2050.62},{n:'6 Aylık Lisans',m:6,p:3386.86,b:'Popüler'},{n:'1 Yıllık Lisans',m:12,p:5648.19,b:'%42 Tasarruf'}];
var f=function(x){return x.toLocaleString('tr-TR',{minimumFractionDigits:2,maximumFractionDigits:2})+'₺'};
var O=document.getElementById('opts'),sel=2;
function show(){var d=L[sel],pm=d.p/d.m,s=Math.round((1-pm/L[0].p)*100);
document.getElementById('pTotal').textContent=f(d.p);
document.getElementById('pMonth').textContent=d.m>1?f(pm)+'/ay':'Aylık ödeme';
document.getElementById('pSave').textContent=d.m>1?'(%'+s+' tasarruf)':'';
var c=O.children;for(var i=0;i<c.length;i++)c[i].setAttribute('aria-checked',i==sel);
document.getElementById('buy').href='https://t.me/MertBrody?text='+encodeURIComponent('Merhaba, LovelyTG '+d.n+' ('+f(d.p)+') satın almak istiyorum.');}
L.forEach(function(d,i){var b=document.createElement('button');b.className='opt';b.setAttribute('role','radio');
b.innerHTML=(d.b?'<em>'+d.b+'</em>':'')+'<b>'+d.n+'</b><span>'+f(d.p)+'</span>';b.onclick=function(){sel=i;show()};O.appendChild(b)});
show();})();
