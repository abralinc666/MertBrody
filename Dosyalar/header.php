<?php
ob_start();
include'baglan.php' ;
if (isset($_SESSION["mail"])){
$mail  = $_SESSION["mail"];
$kbilgi= $vt->query("select * from uyeler where email='$mail'")->fetch(); if ($kbilgi["yetki"]>0) { 
}else if($kbilgi["yetki"]==0){ header("Location:logout.php"); } } elseif(!isset($_SESSION["mail"])) ;
$sites  = $vt->query("select * from siteayar")->fetchAll(PDO::FETCH_ASSOC); foreach ($sites as $sites) 

if(isset($_COOKIE["kadipin"]) && isset($_COOKIE["ksifrepin"])){
    // Kullanıcının cookie'lerinden e-posta ve şifre bilgilerini al
    $email = $_COOKIE["kadipin"];
    $pass = $_COOKIE["ksifrepin"];
    // Veritabanında e-posta ve şifre bilgilerinin doğruluğunu kontrol et
    $kullanicivarmi= $vt->prepare("select * from uyeler where email=? && pass=?");
    $kullanicivarmi->execute(array($email,$pass));
    $row= $kullanicivarmi->rowCount();
    if ($row>0) { 
        // Bilgiler doğruysa, kullanıcıyı otomatik olarak giriş yap
        $_SESSION["mail"]=$email;
        $_SESSION["pass"]=$pass;
		
    }
}
?>

<?php
function seo($s) {
	$tr = array('ş','Ş','ı','I','İ','ğ','Ğ','ü','Ü','ö','Ö','Ç','ç','(',')','/',' ',',','?');
	$eng = array('s','s','i','i','i','g','g','u','u','o','o','c','c','','','-','-','','');
	$s = str_replace($tr,$eng,$s);
	$s = strtolower($s);
	$s = preg_replace('/&amp;amp;amp;amp;amp;amp;amp;amp;amp;.+?;/', '', $s);
	$s = preg_replace('/\s+/', '-', $s);
	$s = preg_replace('|-+|', '-', $s);
	$s = preg_replace('/#/', '', $s);
	$s = str_replace('.', '', $s);
	$s = trim($s, '-');
	return $s;
} 

?>

<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title><?php echo $sites["site_isimi"];?></title>
<meta name="description" content="Türkiyenin en ucuz Epin, Cd Key, Oyun Parası, CS:GO Skin &amp; Key, Gold Bar, İndirimli Steam Oyunlarını, hızlı ve güvenilir teslimat garantisiyle satın alabilirsiniz 7/24 Müşteri Desteği ile tüm oyun ihtiyaçlarınız ve sorularınız için daima hizmetinizde!" />
<meta name="robots" content="index, follow" />
<meta property="og:type" content="website" />
<meta property="og:description" content="Türkiyenin en ucuz Epin, Cd Key, Oyun Parası, CS:GO Skin &amp; Key, Gold Bar, İndirimli Steam Oyunlarını güvencesiyle, hızlı ve güvenilir teslimat garantisiyle satın alabilirsiniz. 7/24 Müşteri Desteği ile tüm oyun ihtiyaçlarınız ve sorularınız için daima hizmetinizde!" />
<link rel="preconnect" href="https://www.google-analytics.com">
<link rel="preconnect" href="https://connect.facebook.net">
<link rel="preconnect" href="https://fonts.gstatic.com">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="<? echo $sites["site_link"];?>/epin/styles.css" />
<link type="text/css" rel="stylesheet" href="<? echo $sites["site_link"];?>/epin/all.css" />
  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>
</head>
