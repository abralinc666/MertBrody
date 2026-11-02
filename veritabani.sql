-- phpMyAdmin SQL Dump
-- version 4.9.11
-- https://www.phpmyadmin.net/
--
-- Anamakine: localhost:3306
-- Üretim Zamanı: 13 Ağu 2023, 15:02:08
-- Sunucu sürümü: 10.3.39-MariaDB
-- PHP Sürümü: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Veritabanı: `izmoxcom_epin2`
--

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `banka`
--

CREATE TABLE `banka` (
  `id` int(11) NOT NULL,
  `bank` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `gorunum` enum('0','1') CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `hesapsahibi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `sube` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `hesapno` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `iban` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `banka`
--

INSERT INTO `banka` (`id`, `bank`, `gorunum`, `hesapsahibi`, `sube`, `hesapno`, `iban`) VALUES
(1, 'resim/ziraat-bankasi.png', '0', 'ToyEpin', '0340', '--------------------', '-------------------------'),
(2, 'resim/garantibankasi.png', '0', 'ToyEpin', '0300', '---------', '---------------------------'),
(3, 'resim/akbank.png', '0', 'ToyEpin', '0303', '------------', '---------------------------');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `blog`
--

CREATE TABLE `blog` (
  `id` int(11) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `baslik` text NOT NULL,
  `icerik` text NOT NULL,
  `kapak` varchar(255) NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `blog`
--

INSERT INTO `blog` (`id`, `userid`, `baslik`, `icerik`, `kapak`, `date`) VALUES
(1, '1', 'Hayatta Kalma Oyunlarının Yeni Gözdesi', 'Hayatta kalma oyunlarının merakla beklenen yeni üyesi Undawn, Level Infinite ve LightSpeed Studios\'un geliştirdiği bir proje olarak karşımıza çıkıyor. Üstelik hem mobil hem de PC platformlarında, oyun severlerin beğenisine sunulmuş durumda. Bu yazımızda Undawn\'ın öne çıkan özelliklerine ve oynanış dinamiklerine göz atacağız.\r\n\r\n\r\n\r\nTürkçe ve Ücretsiz: Undawn’ın Genel Bakışı\r\nUndawn, hem mobil hem de PC üzerinden kullanıcılarla buluşan bir açık dünya hayatta kalma oyunu. Bu oyun, kapalı beta sürecine Türkiye\'nin de dahil olduğu birçok ülkeden geniş bir kullanıcı kitlesiyle başladı. 15 Haziran itibarıyla tamamen Türkçe ve ücretsiz olarak oynanabilen oyun, tüm dünya ile aynı anda Türkiye\'de de hizmete girdi.\r\n\r\n\r\nKıyamet Sonrası Zombi Dünyası: Undawn’ın Oyun Ortamı\r\n\r\nUndawn, battle royale türünün popüler örneği PUBG Mobile\'ı geliştiren Level Infinite ve LightSpeed Studios tarafından geliştirilmiş bir oyun. Unreal Engine kullanılarak hazırlanan bu oyun, zombilerin istila ettiği bir dünyada geçiyor ve PvP ile PvE deneyimlerini bir arada sunuyor.\r\n\r\nÖzelleştirme ve İnşa: Undawn’ın Dinamikleri\r\nUndawn oyuncuları, gerçekçi grafiklerle oluşturulan geniş bir evrende farklı arazi ve ekosistemler arasında hayatta kalmaya çalışacaklar. Oyunun en ilgi çekici özelliklerinden biri, oyunculara 1.000\'den fazla mobilya, eşya ve yapı türü içeren geniş bir inşa sistemi sunması. Bu sistem sayesinde oyuncular kendi evlerini ve hatta kendi medeniyetlerini inşa edebilirler.\r\n\r\n\r\n\r\nSavaş ve Strateji: Hayatta Kalma Savaşı\r\nOyun, aynı zamanda stratejik düşünmeyi de gerektiriyor. Oyuncular, zombi sürüsüne karşı kendilerini korumak için üslerini ihtiyaçlarına göre özelleştirecekler. Ayrıca buldukları kaynakları kullanarak cephaneliklerini oluşturan silahları, zırhları ve hayatta kalma teçhizatlarını üretebilecekler.\r\n\r\n\r\nUndawn: Kuzgunlar Sığınağı ve Ekipler\r\nOyuncular Kuzgunlar Sığınağı’nın birer üyesi olarak Palyaçolar, Kartallar, Baykuşlar ve Yağmacılar gibi çeşitli ekiplerle rekabet edecekler. Her ekip, kendi bölgesini korumak için farklı stratejiler kullanacak.\r\n\r\n\r\nUndawn’da Ünlü Bir İsim: Will Smith\r\nUndawn\'da, oyuncuların karşısına ünlü aktör Will Smith\'in canlandırdığı Trey Jones karakteri çıkıyor. Trey, oyundaki ana rehber karakteri olarak oyunculara hayatta kalma ve dünyayı yeniden inşa etme konusunda yardımcı olacak.\r\n\r\nOyun severler için kaçırılmaması gereken bir deneyim sunan Undawn, iOS ve Android için uygulama mağazalarından, PC için ise Steamve resmi web sitesinden ücretsiz olarak indirilebilir. İster mobil, ister PC üzerinden oynayın, Undawn\'ın heyecan verici dünyası sizleri bekliyor. Bu zombi dolu dünyada hayatta kalmaya ve yeni bir medeniyet kurmaya hazır mısınız?', '../resim/bilimsiMTY0Z.webp', '2023-08-13 02:43:16'),
(2, '1', 'Yeni Nesil Ücretsiz Çevrim İçi Aksiyon Oyunu Yaklaşıyor\r\n', 'PUBG Mobile\'ın yaratıcıları Level Infinite ve NExT Studios\'nun iş birliğiyle geliştirilen yeni çevrim içi aksiyon oyunu SYNCED\'in heyecanla beklenen ön kayıtları nihayet başladı. Gelecekten bir kesit sunan bu oyun, nano teknolojinin insanlık üzerindeki etkilerini ele alıyor. Aşağıda bu yepyeni oyunun öne çıkan özelliklerini ve ön kayıt sürecinin detaylarını bulacaksınız.\r\n\r\n\r\nTeknoloji ve Kıyamet: SYNCED\'in Öyküsü \r\n\r\nYakın bir gelecekte geçen SYNCED, nano teknolojinin medeniyetin temel taşı olduğu bir dünyayı konu alıyor. Ancak bu teknoloji, \"Çöküş\" adı verilen felaketle birlikte insanlığa düşman hale gelir. Oyuncular, nano makinelerin insanları tükettiği ve onları ölümcül yaratıklara dönüştürdüğü bu distopyada, \"Koşucu\" olarak adlandırılan karakterlerin rolünü üstleniyorlar.\r\n\r\nTakım Çalışması ve Strateji \r\n\r\nOyunun en ilgi çekici yanı, oyuncuların 3 kişilik takımlar oluşturup kooperatif bir deneyim yaşamalarıdır. Oyuncular, yendikleri Üstün Nanoları, kontrol edebilecekleri Yoldaş Nanolara dönüştürme yeteneğine sahip. Yüksek tempolu PvE ve PvP çatışmalarında bu Nanolar stratejik olarak kullanılabilecek silahlar haline geliyor. Oyunun ayrıca klasik looter shooter oyunlarından da ögeler içerdiği belirtiliyor.\r\n\r\n\r\nKarakter Gelişimi ve Ödüller \r\n\r\nSYNCED, oyuncuların karakterlerini geliştirmelerine olanak tanırken aynı zamanda güçlü silahlar ve modlar kilitleme şansı da sunuyor. Ön kayıt aşamasında belirli sayılara ulaşılması durumunda özel ödüller de mevcut:\r\n\r\nDerin Kesik Avatarı \r\n\r\nGeleceğin Şampiyonu Kartı (100 bin ön kayıt) \r\n\r\nKutup Kurdu MK18 Silah Görünümü (200 bin ön kayıt) \r\n\r\nIşıltı Nano Görünümü (400 bin ön kayıt) \r\n\r\nEvet! İfadesi (800 bin ön kayıt) \r\n\r\nGlory\'nin Yaban Arısı Görünümü (1 milyon 500 bin ön kayıt) \r\n\r\n\r\n\r\nÖn Kayıt ve Çıkış Tarihi \r\n\r\nSYNCED ön kayıtları; PC, PlayStation 5 ve Xbox Series X|S için başlamış durumda. Bu yazın sonlarında çıkması planlanan oyun, şimdiden büyük ilgi görüyor. Level Infinite, şu ana kadar 4 binin üzerinde kullanıcının ön kayıt yaptırdığını duyurdu.\r\n\r\nTeknolojinin geleceğe yönlendirdiği bir dünyada hayatta kalmak, düşmanları alt etmek ve strateji geliştirmek isteyenler için SYNCED, kaçırılmaması gereken bir oyun olarak göze çarpıyor.\r\n\r\n\r\nSYNCED\'in heyecan verici evrenine daha yakından bakabilmek için son gelişmeleri takip etmeyi unutmayın. ByNoGame Haberler sekmesinden oyun dünyasına dair tüm güncellemelere anında ulaşabilirsiniz. Herkese iyi oyunlar!', '../resim/bilimsiMTY0Z_1.webp', '2023-08-13 02:44:14'),
(3, '1', 'Escape from Tarkov Heyecan Verici Güncellemeler Yolda', 'Oyun dünyasının sevilen FPS (First Person Shooter) oyunlarından Escape from Tarkov, Battlestate Games tarafından geliştirilen ilgi çekici güncellemeleriyle oyunseverlerin karşısına çıkmaya hazırlanıyor. 2023 yılında gerçekleştirilecek yenilikler ve eklemeler, oyunun hayran kitlesini oldukça memnun edeceğe benziyor.\r\n\r\n\r\n\r\nYepyeni İçerikler ve Yenilikler\r\nEscape from Tarkov, bir dizi yeni içerik ve önemli güncellemeyle oyuncularını şaşırtacak. Bu yeniliklerin detayları Battlestate Games tarafından 2023 için yayımlanan yol haritasında yer alıyor. Oyuncuların bu yenilikleri ve geliştirmeleri Ağustos ayına kadar deneyimleyebileceği, ardından da oyunun sıfırlanacağı belirtildi.\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\nOyun Güncellemelerine Genel Bakış\r\n\r\nBattlestate Games, Escape from Tarkov\'a eklenecek olan yenilikler ve değişiklikler hakkında bilgi verdi. Yayınlanan listeye göre güncellemeyle gelecek bazı yenilikler şunlar olacak:\r\n\r\nRastgele konteyner görünümleri\r\n\r\nGelişmiş iyileşme sistemi\r\n\r\nTarkov\'un caddelerinin genişlemesi\r\n\r\nKaban adında yeni bir boss\r\n\r\nDengeleme çalışmaları\r\n\r\nYeni modlar ve silahlar: PKM, SVT, AVT, AK-12 ve keskin uçlu bir silah\r\n\r\n\r\n\r\nOyuncu Başarımları ve Yeni Özellikler\r\n\r\n2023 Ağustos ayında oyuncu başarımlarının sıfırlanacağı belirtilirken ardından geliştiricilerin test sürecinden geçireceği diğer değişikliklerin oyuna dahil olacağı duyuruldu. Bu değişiklikler arasında Tarkov sokaklarında BTR\'ler, sol omuzdan ateş etme, zıplama, başarımlar, yeni bir boss ve yeni silahlar yer alacak.\r\n\r\n\r\n\r\nGelecekteki Planlar ve Gelişmeler\r\n\r\nOyunun yaratıcıları, bu güncelleme dalgalarının ardından oyuncu başarımlarının Aralık ayında bir kez daha sıfırlanacağını belirtti. Ayrıca ilerleyen tarihlerde oyunun haritasına yeni konumların da ekleneceği açıklandı. Battlestate Games, ayrıca performans optimizasyonu, Unity motorunda bir güncelleme ve yeni bir eşleştirme sistemi üzerinde çalışmalarına devam ediyor.\r\n\r\nPC platformu için hazırlanan ve halihazırda kapalı beta sürecinde olan Escape from Tarkov, Battlestate Games\'in yıl içerisinde getireceği yenilikler ve geliştirmelerle oyuncularına heyecan verici bir deneyim sunmaya devam ediyor.\r\n', '../resim/bilimsiMTY0Z_2.webp', '2023-08-13 02:45:34'),
(641, '1', 'Counter Strike 2de Hızlı ve Bomba Gibi Güncellemeler', 'Valve, ikonik FPS oyunu Counter Strike 2\'nin geliştirilmesinde hızlanarak oyun dünyasının heyecanını doruğa çıkarıyor. İki büyük güncelleme alan beta oyun, son güncellemesiyle bombaları yeniden tasarladı.\r\n\r\n\r\n\r\nBombaların Değişimi: Görsel Bir Şölen!\r\nYeni büyük güncellemesiyle CS2, oyunculara bombalarını düşmanlarına fırlatmadan önce yakından inceleme fırsatı veriyor. Bu değişikliğin oyun deneyimine yeni bir derinlik katacağı ve strateji seçeneklerini çeşitlendireceği düşünülüyor. Bu yenilik, oyun topluluğunda büyük bir coşkuyla karşılandı.\r\n\r\n\r\nMirage Haritası Gidiyor, Yeni Arenalar Geliyor!\r\nOyuncuları bekleyen bir başka heyecanlı haber de Mirage haritasının yerini iki yeni arenanın alacak olması. Bu değişiklik, oyun deneyimini tazelemek ve oyunculara yeni stratejiler keşfetme fırsatı sunmak için tasarlandı.\r\n\r\nCounter Strike 2\'nin Kapalı Betadan Çıkışı Yakın!\r\nCounter Strike 2, bu yaz kapalı betadan çıkması bekleniyor ve Valve\'in CS2 için güncelleme sıklığını arttırdığını görüyoruz. Bu durum, oyunun resmi sürümünün hızlı bir şekilde çıkacağına dair güçlü bir işaret olarak kabul ediliyor.\r\n\r\n\r\n\r\nYeni Başlayanlar için Basitleştirilmiş Mod!\r\nYeni başlayanlar ve daha az kararlı oyuncular düşünülerek tanıtılan basitleştirilmiş mod, oyunun zorluk seviyesini ayarlamak isteyenler için ideal bir seçenek olacak.\r\n\r\n\r\nBüyük Güncellemeler Oyuncuların Beğenisine Sunuldu!\r\nGüncelleme, ses ve hareketle ilgili iyileştirmeleri, yeni ekipman simgeleri ve silah kontrolünün iyileştirilmesi gibi bir dizi değişiklik getiriyor. Ayrıca ikinci güncelleme de daha az değişiklik içerse de ses ve hareket üzerinde önemli iyileştirmeler ve otomatların yanıp sönen gölgelerinin ortadan kaldırılması gibi önemli değişiklikler içeriyor.\r\n\r\nCounter Strike 2\'nin son güncellemeleri, oyunculara zenginleştirilmiş bir oyun deneyimi sunuyor. Yeni bomba mekanikleri, haritalar ve ses/hareket iyileştirmeleri, Counter Strike 2\'nin kapalı betadan çıkmaya hazır olduğunun güçlü bir işareti olarak değerlendiriliyor! ', '../resim/bilimsiMTY0Z_3.webp', '2023-08-13 02:47:51');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `blog_yorumlar`
--

CREATE TABLE `blog_yorumlar` (
  `id` int(11) NOT NULL,
  `ticketid` int(11) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `comment` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `blog_yorumlar`
--

INSERT INTO `blog_yorumlar` (`id`, `ticketid`, `userid`, `comment`) VALUES
(648, 1, '1', 'Teşekkürler');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `oyunadi` varchar(25) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `baglanti` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `resim` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `kategori`
--

INSERT INTO `kategori` (`id`, `oyunadi`, `baglanti`, `resim`) VALUES
(1, 'Valorant', 'Valorant', 'resim/valorant.webp'),
(2, 'League of Legends', 'LeagueofLegends', 'resim/LeagueofLegends.webp'),
(3, 'Pubg Mobile', 'PubgMobile', 'resim/pubg.webp'),
(4, 'WolfTeam', 'Wolfteam', 'resim/Wolfteam.webp'),
(7, 'STEAM', 'STEAM', 'resim/STEAM.webp');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `kupon`
--

CREATE TABLE `kupon` (
  `id` int(11) NOT NULL,
  `kod` varchar(255) NOT NULL,
  `bakiye_miktari` decimal(20,2) NOT NULL,
  `durumu` int(11) NOT NULL DEFAULT 0
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `kupon`
--

INSERT INTO `kupon` (`id`, `kod`, `bakiye_miktari`, `durumu`) VALUES
(1, 'test', '100.00', 1),
(17, 'indirim50', '250.00', 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `odemebildir`
--

CREATE TABLE `odemebildir` (
  `id` int(11) NOT NULL,
  `banka` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `kullanici` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `adsoyad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `tutar` text CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `tarih` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `odemebildir`
--

INSERT INTO `odemebildir` (`id`, `banka`, `kullanici`, `adsoyad`, `tutar`, `tarih`, `aciklama`) VALUES
(4, 'Zıraat Bankası', 'test@hotmail.com', 'ad soyad', '79.95', '2023-01-30', 'Fış Kod : 2303');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `satilanurunler`
--

CREATE TABLE `satilanurunler` (
  `id` int(11) NOT NULL,
  `satinalan` varchar(255) NOT NULL,
  `satinalan2` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `epin` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `fiyat` varchar(255) NOT NULL,
  `urunad` varchar(255) NOT NULL,
  `date` datetime NOT NULL,
  `urunid` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `durum` varchar(2) NOT NULL DEFAULT '1',
  `kapak` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `degerlendirme` varchar(600) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `satilanurunler`
--

INSERT INTO `satilanurunler` (`id`, `satinalan`, `satinalan2`, `epin`, `fiyat`, `urunad`, `date`, `urunid`, `durum`, `kapak`, `degerlendirme`) VALUES
(470, '1', 'ToyEpin Test', 'ASDDAS-233232-SDASDA-12323', '200', 'Valorant 740 VP', '2022-12-11 12:37:46', '6', '1', 'resim/valo740.webp', ''),
(527, '1', 'ToyEpin', '', '14.25', 'League of Legends 200 RP', '2023-01-29 04:56:26', '13', '0', 'resim/lol200.webp', ''),
(528, '1', 'ToyEpin', '', '16.41', 'PUBG Mobile 60 UC', '2023-01-30 05:44:48', '7', '1', 'resim/pubg60.webp', 'Eyww başarılı :)'),
(529, '1', 'ToyEpin', '', '57.94', 'Valorant 740 VP', '2023-01-30 07:14:13', '2', '1', 'resim/valo740.webp', 'teşekkürler');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `shopierOrder`
--

CREATE TABLE `shopierOrder` (
  `id` int(11) NOT NULL,
  `orderNo` varchar(255) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` double NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `shopierOrder`
--

INSERT INTO `shopierOrder` (`id`, `orderNo`, `user_id`, `amount`, `status`) VALUES
(96, '63d515af09022', 1, 35, 1),
(94, '63d513ecf1f18', 1, 15, 0),
(98, '63d7fe8c8bfb1', 1, 0, 0),
(99, '64d8bdd168587', 1, 0, 0);

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `sidebar`
--

CREATE TABLE `sidebar` (
  `id` int(11) NOT NULL,
  `sayfa` varchar(355) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `resim` varchar(355) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `sidebar`
--

INSERT INTO `sidebar` (`id`, `sayfa`, `resim`) VALUES
(2, 'sayfa/valorant/1', 'resim/vv.jpg'),
(3, 'sayfa/wolfteam/4', 'resim/jae-hak-park-wt-popol-1-1.jpg'),
(4, 'sayfa/leagueoflegends/2', 'resim/2379005.jpg');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `siteayar`
--

CREATE TABLE `siteayar` (
  `id` int(11) NOT NULL,
  `site_link` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `site_baslik` text NOT NULL,
  `site_isimi` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `siteayar`
--

INSERT INTO `siteayar` (`id`, `site_link`, `site_baslik`, `site_isimi`) VALUES
(1, 'https://epin2.siteyazilim.com.tr/', 'EpinScripti', 'EpinScripti - Epin Hizmetleri - CS:GO,VALORANT,LOL,PUBG');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tickets`
--

CREATE TABLE `tickets` (
  `id` int(11) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `subject` text NOT NULL,
  `active` enum('1','0','3','5') NOT NULL DEFAULT '1',
  `date` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `tickets`
--

INSERT INTO `tickets` (`id`, `userid`, `message`, `subject`, `active`, `date`) VALUES
(658, '1', 'asddadfasafasd', 'TS3 Bss', '1', '30.01.2023 06:44');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `tickets_replies`
--

CREATE TABLE `tickets_replies` (
  `id` int(11) NOT NULL,
  `ticketid` int(11) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `date` varchar(255) NOT NULL,
  `perm` enum('1','2') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `tickets_replies`
--

INSERT INTO `tickets_replies` (`id`, `ticketid`, `userid`, `comment`, `date`, `perm`) VALUES
(765, 658, '1', 'asddadfasafasd', '30.01.2023 06:44', '1'),
(766, 658, '1', 'eyw', '30.01.2023 06:46', '1'),
(767, 658, '1', 'test', '30.01.2023 06:57', '1');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `urun`
--

CREATE TABLE `urun` (
  `id` int(11) NOT NULL,
  `urunad` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `aciklama` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `fiyat` decimal(20,2) NOT NULL,
  `resim` varchar(400) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `stok` enum('0','1') NOT NULL DEFAULT '0',
  `kat` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `avantaj` enum('0','1') NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Tablo döküm verisi `urun`
--

INSERT INTO `urun` (`id`, `urunad`, `aciklama`, `fiyat`, `resim`, `stok`, `kat`, `avantaj`) VALUES
(1, 'Valorant 115 VP', 'Sadece Türkiye sunucusunda geçerlidir', '13.94', 'resim/v1.webp', '0', 'Valorant', '0'),
(2, 'Valorant 925 VP', 'Sadece Türkiye sunucusunda geçerlidir', '57.94', 'resim/v2.webp', '0', 'Valorant', '1'),
(3, 'Valorant 1850 VP', 'Sadece Türkiye sunucusunda geçerlidir', '106.94', 'resim/v3.webp', '0', 'Valorant', '0'),
(4, 'Valorant 3400 VP', 'Sadece Türkiye sunucusunda geçerlidir', '207.94', 'resim/v4.webp', '0', 'Valorant', '0'),
(5, 'Valorant 5550 VP', 'Sadece Türkiye sunucusunda geçerlidir', '373.99', 'resim/v5.webp', '0', 'Valorant', '0'),
(7, 'PUBG Mobile 60 UC', 'Sadece Türkiye sunucusunda geçerlidir', '16.41', 'resim/pubg60.webp', '0', 'PubgMobile', '0'),
(8, 'PUBG Mobile 325 UC', 'Sadece Türkiye sunucusunda geçerlidir', '81.33', 'resim/pubg325.webp', '0', 'PubgMobile', '0'),
(9, 'PUBG Mobile 660 UC', 'Sadece Türkiye sunucusunda geçerlidir', '162.49', 'resim/pubg660.webp', '0', 'PubgMobile', '0'),
(10, 'PUBG Mobile 1.800 UC', 'Sadece Türkiye sunucusunda geçerlidir', '406.22', 'resim/pubg1800.webp', '0', 'PubgMobile', '0'),
(11, 'PUBG Mobile 3.850 UC', 'Sadece Türkiye sunucusunda geçerlidir', '803.16', 'resim/pubg3850.webp', '0', 'PubgMobile', '0'),
(12, 'PUBG Mobile 8.100 UC', 'Sadece Türkiye sunucusunda geçerlidir', '1609.66', 'resim/pubg8100.webp', '0', 'PubgMobile', '0'),
(13, 'League of Legends 200 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '14.25', 'resim/l1.webp', '0', 'LeagueofLegends', '0'),
(14, 'League of Legends 850 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '58.50', 'resim/l2.webp', '0', 'LeagueofLegends', '0'),
(15, 'League of Legends 1.600 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '105.95', 'resim/l3.webp', '0', 'LeagueofLegends', '0'),
(16, 'League of Legends 3.150 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '203.94', 'resim/l4.webp', '0', 'LeagueofLegends', '0'),
(17, 'League of Legends 5.800 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '366.75', 'resim/l5.webp', '0', 'LeagueofLegends', '0'),
(18, 'League of Legends 9.200 RP', 'Tüm League of Legends market alışverişlerinde kullan. League of Legends ucuz RP fiyatlarına sitemizden bakabilirsiniz', '585.00', 'resim/l6.webp', '0', 'LeagueofLegends', '0'),
(20, 'WolfTeam 1.000 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '3.15', 'resim/t1.webp', '0', 'Wolfteam', '0'),
(21, 'WolfTeam 1.875 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '5.70', 'resim/t2.webp', '0', 'Wolfteam', '0'),
(22, 'WolfTeam 3.850 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '11.40', 'resim/t3.webp', '0', 'Wolfteam', '0'),
(23, 'WolfTeam 5.000 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '14.50', 'resim/t4.webp', '0', 'Wolfteam', '0'),
(24, 'WolfTeam 8.000 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '22.70', 'resim/t5.webp', '0', 'Wolfteam', '0'),
(25, 'WolfTeam 12.250 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '34.00', 'resim/t6.webp', '0', 'Wolfteam', '0'),
(26, 'WolfTeam 21.250 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '56.70', 'resim/t7.webp', '0', 'Wolfteam', '0'),
(27, 'WolfTeam 35.000 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '90.94', 'resim/t8.webp', '0', 'Wolfteam', '0'),
(28, 'WolfTeam 45.000 Nakit', 'Sadece Türkiye sunucusunda geçerlidir', '114.00', 'resim/t8.webp', '0', 'Wolfteam', '0');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `uyeler`
--

CREATE TABLE `uyeler` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `pass` varchar(255) NOT NULL,
  `telefon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci NOT NULL,
  `yetki` enum('1','2') NOT NULL DEFAULT '1',
  `bakiye` decimal(20,2) NOT NULL DEFAULT 0.00,
  `tarih` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `uyeler`
--

INSERT INTO `uyeler` (`id`, `email`, `username`, `pass`, `telefon`, `yetki`, `bakiye`, `tarih`) VALUES
(1, 'admin@hotmail.com', 'administrator', 'admin@hotmail.com', '0555555555', '2', '1000.00', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Tablo için tablo yapısı `yorumlar`
--

CREATE TABLE `yorumlar` (
  `id` int(11) NOT NULL,
  `ticketid` int(11) NOT NULL,
  `userid` varchar(255) NOT NULL,
  `comment` text NOT NULL,
  `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Tablo döküm verisi `yorumlar`
--

INSERT INTO `yorumlar` (`id`, `ticketid`, `userid`, `comment`, `date`) VALUES
(657, 11, '1', 'Ürünü aldım sorunsuz pin kodum geldi :)', '2023-01-05 03:00:40'),
(658, 8, '1', 'Teşekkürler epin', '2023-01-05 02:59:55');

--
-- Dökümü yapılmış tablolar için indeksler
--

--
-- Tablo için indeksler `banka`
--
ALTER TABLE `banka`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `blog_yorumlar`
--
ALTER TABLE `blog_yorumlar`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `kupon`
--
ALTER TABLE `kupon`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `odemebildir`
--
ALTER TABLE `odemebildir`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `satilanurunler`
--
ALTER TABLE `satilanurunler`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `shopierOrder`
--
ALTER TABLE `shopierOrder`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `sidebar`
--
ALTER TABLE `sidebar`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `siteayar`
--
ALTER TABLE `siteayar`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `tickets_replies`
--
ALTER TABLE `tickets_replies`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `urun`
--
ALTER TABLE `urun`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `uyeler`
--
ALTER TABLE `uyeler`
  ADD PRIMARY KEY (`id`);

--
-- Tablo için indeksler `yorumlar`
--
ALTER TABLE `yorumlar`
  ADD PRIMARY KEY (`id`);

--
-- Dökümü yapılmış tablolar için AUTO_INCREMENT değeri
--

--
-- Tablo için AUTO_INCREMENT değeri `banka`
--
ALTER TABLE `banka`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `blog`
--
ALTER TABLE `blog`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=642;

--
-- Tablo için AUTO_INCREMENT değeri `blog_yorumlar`
--
ALTER TABLE `blog_yorumlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=652;

--
-- Tablo için AUTO_INCREMENT değeri `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Tablo için AUTO_INCREMENT değeri `kupon`
--
ALTER TABLE `kupon`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Tablo için AUTO_INCREMENT değeri `odemebildir`
--
ALTER TABLE `odemebildir`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `satilanurunler`
--
ALTER TABLE `satilanurunler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=530;

--
-- Tablo için AUTO_INCREMENT değeri `shopierOrder`
--
ALTER TABLE `shopierOrder`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=100;

--
-- Tablo için AUTO_INCREMENT değeri `sidebar`
--
ALTER TABLE `sidebar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Tablo için AUTO_INCREMENT değeri `siteayar`
--
ALTER TABLE `siteayar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Tablo için AUTO_INCREMENT değeri `tickets`
--
ALTER TABLE `tickets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=659;

--
-- Tablo için AUTO_INCREMENT değeri `tickets_replies`
--
ALTER TABLE `tickets_replies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=768;

--
-- Tablo için AUTO_INCREMENT değeri `urun`
--
ALTER TABLE `urun`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=609;

--
-- Tablo için AUTO_INCREMENT değeri `uyeler`
--
ALTER TABLE `uyeler`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=360;

--
-- Tablo için AUTO_INCREMENT değeri `yorumlar`
--
ALTER TABLE `yorumlar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=669;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
