<?php include 'header2.php'; ?>
<?php include 'menu.php'; ?>


<link rel="stylesheet" media="screen" href="epin/user.css" />
<link rel="stylesheet" media="screen" href="epin/row.css" />


<section class="container">
<div><div class="user-panel-wrapper">

<div class="user-panel-menu">

<div class="user-panel-menu-top">
<div class="user-panel-menu-top-user-info">
<img src="resim/avatar-0.jpg" width="60" height="60">
<strong class="user-panel-menu-top-user-info-username"><? echo $kbilgi["username"];?></strong>
<div class="user-panel-menu-top-user-info-balance"><? echo $kbilgi["bakiye"];?> ₺</div>
<a href="logout" class="user-panel-menu-top-user-info-exit">ÇIKIŞ YAP</a></div>

</div>
<button onclick="window.location='profilim';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-cog"></i>Bilgilerim</button>
<button onclick="window.location='siparislerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-shopping-cart"></i>Siparişlerim</button>
<button onclick="window.location='yukle';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-money-bill"></i>Bakiye Yükle</button>
<button onclick="window.location='kupon';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-key"></i>Kupon Kodu</button>
<button onclick="window.location='oyunlar';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-play"></i>Tüm Oyunlar</button>
<button onclick="window.location='yorumlarim';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-comments"></i>Yorumlarım</button>
<button onclick="window.location='yuklemelerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-credit-card"></i>Yüklemelerim</button>
<button onclick="window.location='destek-olustur';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plus"></i>Destek Oluştur</button>
<button onclick="window.location='destek';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-ticket"></i>Destek Taleplerim</button>
<button onclick="window.location='odeme-bildir';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-bell"></i>Ödeme Bildirimleri</button>
<button onclick="window.location='etf';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plane"></i>Havale/ETF</button>
<button onclick="window.location='logout';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-power-off"></i>Çıkış Yap</button>

</div><div class="user-panel-body">

<div class="settings"><div style="padding:30px;" class="settings-box">

<h1>Bilgilerim</h1>
<hr>
<font style="font-size:12px;">Adınız Soyadınız</font><br><br>
<input type="text" style="font-size:12px;" disabled value="<? echo $kbilgi["username"];?>"><button onclick="fireSweetAdsoyad()" style="padding:8px; background-color:#202020; color:white; border-radius:0 border-color:#202020; border:0px; float:right;">DÜZENLE</button>

  <script>

    function fireSweetAdsoyad() {
        Swal.fire(
            '<font style="margin-top:5px; font-size:14px; color:white;">Adını Soyadını Düzenle</font>',
            '<?php


      /* Kullanıcı Ayarları Güncelle */
      if (isset($_POST["ayarguncel"])) {
		$id         =$_POST["kid"];
		$username       =$_POST["username"];
   
        $ayarguncelle= $vt->prepare("update uyeler set username=? where id=?");
        $ayarguncelle->execute(array($username,$id));
        if ($ayarguncelle) {
          echo '<META HTTP-EQUIV="Refresh" content="2;"><strong style="color:#00e184;">Başarılı!</strong> <span style="color:white">Şifreniz değiştirilmiştir</font><br>';
        }else{
          header("Location:../index.php?e=no");
        }
      }
	  
	  
	  
?><br><form class="needs-validation" action="" method="post" novalidate> <input type="hidden" value="<?php echo $kbilgi["id"]; ?>" name="kid" value=""><input class="form-control" value="<?php echo $kbilgi["username"];?>" style="background-color:#0b0d11; color:white;" name="username" type="text"><br><button class="btn btn-primary" style="background-color:#040507; color:white; width:100%;" type="submit" name="ayarguncel">Kaydet</button>',
            ''
        )
    }

  </script>
<br>

<font style="font-size:12px;">E-Mail Adresi</font><br><br>
<input type="text" style="font-size:12px;" disabled value="<? echo $kbilgi["email"];?>">

<br>

<font style="font-size:12px;">Telefon Numaranız</font><br><br>
<input type="text" style="font-size:12px;" disabled value="<? echo $kbilgi["telefon"];?>">

<hr>



</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>