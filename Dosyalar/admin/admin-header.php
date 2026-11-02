<?php
 include'../baglan.php' ;
 if (isset($_SESSION["mail"])) {
 $mail  = $_SESSION["mail"];
 $kbilgi= $vt->query("select * from uyeler where email='$mail'")->fetch();
 if ($kbilgi["yetki"]>0) { 
 
 }  else if($kbilgi["yetki"]==0){ header("Location:../logout.php"); } } elseif(!isset($_SESSION["mail"])){header("Location:admin-login.php");} 
	
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
