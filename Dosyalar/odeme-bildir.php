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
<button onclick="window.location='profilim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-cog"></i>Bilgilerim</button>
<button onclick="window.location='siparislerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-shopping-cart"></i>Siparişlerim</button>
<button onclick="window.location='yukle';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-money-bill"></i>Bakiye Yükle</button>
<button onclick="window.location='kupon';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-key"></i>Kupon Kodu</button>
<button onclick="window.location='oyunlar';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-play"></i>Tüm Oyunlar</button>
<button onclick="window.location='yorumlarim';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-comments"></i>Yorumlarım</button>
<button onclick="window.location='yuklemelerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-credit-card"></i>Yüklemelerim</button>
<button onclick="window.location='destek-olustur';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plus"></i>Destek Oluştur</button>
<button onclick="window.location='destek';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-ticket"></i>Destek Taleplerim</button>
<button onclick="window.location='odeme-bildir';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-bell"></i>Ödeme Bildirimleri</button>
<button onclick="window.location='etf';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plane"></i>Havale/ETF</button>
<button onclick="window.location='logout';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-power-off"></i>Çıkış Yap</button>

</div><div class="user-panel-body">

<div class="settings"><div style="padding:30px;" class="settings-box">

<h1>Ödeme Bildirimi</h1>
<hr>

  <?php 
      if (isset($_POST['ekle'])) {
		   $kullanici        =$kbilgi['email'];
		  $banka        =$_POST['banka'];
          $adsoyad        =$_POST['adsoyad'];
		  $tutar        =$_POST['tutar'];
          $tarih        =$_POST['tarih'];
		  $aciklama        =$_POST['aciklama'];

          $ekle= $vt->prepare("insert into odemebildir set kullanici=?, banka=?, adsoyad=?, tutar=?, tarih=?, aciklama=?");
          $ekle->execute(array($kullanici,$banka,$adsoyad,$tutar,$tarih,$aciklama));
          if ($ekle) {
           echo '<META HTTP-EQUIV="Refresh" content="3;"><div class="alert alert-success" style="width:100%;" role="alert">Ödeme Bildirimi Gönderildi</div>';
          }else{
            header("Location:");
          }
      }
	  ?>
	  
	  
	   <form method="POST" class="d-flex flex-column mb-4" action=""> 
	  
<font style="font-size:12px;">Banka Adı</font><br><br>
<input type="text" style="font-size:12px;" name="banka" required placeholder="Banka Adı">

<br>

<font style="font-size:12px;">Adı Soyadı</font><br><br>
<input type="text" style="font-size:12px;" name="adsoyad" required placeholder="Gönderim Adı Soyadı">

<br>


<font style="font-size:12px;">Gönderim Toplam Tutar</font><br><br>
<input type="text" style="font-size:12px;" name="tutar" required placeholder="Gönderim Toplam Tutar">

<br>

<font style="font-size:12px;">Tarih</font><br><br>
<input type="date" style="font-size:12px;" name="tarih" required placeholder="">

<br>

<font style="font-size:12px;">EK Açıklama</font><br><br>
<input type="text" style="font-size:12px;" name="aciklama" placeholder="">


<hr>

<button name="ekle" style="padding:8px; background-color:#202020; color:white; border-radius:0 border-color:#202020; width:100%; border:0px;">GÖNDER</button>

</form>

</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>