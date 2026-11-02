<?php include 'header2.php'; $satinalan=$kbilgi["id"]; $alan=$kbilgi["id"];?>
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
<button onclick="window.location='profilim';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-cog"></i>Bilgilerim</button>
<button onclick="window.location='siparislerim';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-shopping-cart"></i>Siparişlerim</button>
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

<h1>Siparişlerim</h1>
<hr>

<style>
.ornek{
width: 900px;

}
.sola-kaydir{
float:left;
border-radius:10px;
}
 
  .aktif{
background-color: #20b85f;
border-radius: 100px;
width:9px;
height:9px;
}


 .beklemede{
background-color: #EC173A;
border-radius: 100px;
width:9px;
height:9px;
}

 </style>

<?php $uruncek  =$vt->query("select * from satilanurunler where satinalan='$alan' order by id desc")->fetchAll(PDO::FETCH_ASSOC); foreach ($uruncek as $urunc) {?>												
<div style="padding:10px;" class="site-header-signed-in-group-user">
<div class="ornek">
<img src="<?php echo $urunc["kapak"]; ?>" class="sola-kaydir" style="height:70px;">


 <a href="#">
<div class="site-header-signed-in-group-user-store-name"> &nbsp;&nbsp; <?php echo $urunc["urunad"]; ?></div>
<div class="site-header-signed-in-group-user-balance" id="user-balance"> &nbsp;&nbsp;  Ödenen <?php echo $urunc["fiyat"]; ?>₺ </div> </a>
<br>
<div class="site-header-signed-in-group-user-store-name"> &nbsp;&nbsp;  EPİN : <?php echo $urunc["epin"]; ?></div>

</div>

<?php if ($urunc["durum"]==1) {echo '<div class="aktif"></div>';}

 elseif ($urunc["durum"]==0) {echo '<div class="beklemede"></div>';} ?>
 <button onclick="fireSweet<?php echo $urunc["id"]; ?>()" style="font-size:8px; padding:8px; background-color:#202020; color:white; border-radius:8px; border-color:#202020; border:0px; float:right;">DEĞERLENDİR</button>

</div><br>

  <script>

    function fireSweet<?php echo $urunc["id"]; ?>() {
        Swal.fire(
            '<font style="margin-top:5px; font-size:14px; color:white;">Ürünü Değerlendir</font>',
            '<?php


      /* Kullanıcı Ayarları Güncelle */
      if (isset($_POST["ayarguncel"])) {
		$id         =$_POST["kid"];
		$degerlendirme       =$_POST["degerlendirme"];
   
        $ayarguncelle= $vt->prepare("update satilanurunler set degerlendirme=? where id=?");
        $ayarguncelle->execute(array($degerlendirme,$id));
        if ($ayarguncelle) {
          echo '<META HTTP-EQUIV="Refresh" content="2;"><strong style="color:#00e184;">Başarılı!</strong> <span style="color:white">Ürün değerlendirilmiştir teşekkürler</font><br>';
        }else{
          header("Location:../index.php?e=no");
        }
      }
	  
	  
	  
?><br><form class="needs-validation" action="" method="post" novalidate> <input type="hidden" value="<?php echo $urunc["id"]; ?>" name="kid" value=""><textarea class="form-control" value="Ürün değerlendirme yapılmamış" style="background-color:#0b0d11; font-size:11px; color:white;" name="degerlendirme" type="text"><?php echo $urunc["degerlendirme"];?></textarea><br><button class="btn btn-primary" style="background-color:#040507; color:white; width:100%;" type="submit" name="ayarguncel">Değerlendir</button>',
            ''
        )
    }

  </script>
<? } ?>






</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>