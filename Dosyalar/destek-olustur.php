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
<button onclick="window.location='destek-olustur';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-plus"></i>Destek Oluştur</button>
<button onclick="window.location='destek';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-ticket"></i>Destek Taleplerim</button>
<button onclick="window.location='odeme-bildir';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-bell"></i>Ödeme Bildirimleri</button>
<button onclick="window.location='etf';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plane"></i>Havale/ETF</button>
<button onclick="window.location='logout';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-power-off"></i>Çıkış Yap</button>

</div><div class="user-panel-body">

<div class="settings"><div style="padding:30px;" class="settings-box">

<h1>Destek Oluştur</h1>
<hr> <form method="POST" class="d-flex flex-column mb-4" action=""> 
	  
											<?php 
		

      if (isset($_POST["newticket"])) {
           $userid=$_POST["userid"];
        $subject=$_POST["subject"];
        $message=$_POST["message"];
        $date=date("d.m.Y h:i");
        $active=1;
          $newtickets=$vt->prepare("insert into tickets set userid=?, message=?, subject=?, active=?, date=?");
          $newtickets->execute(array($userid,$message,$subject,$active,$date));
          $ticketid = $vt->lastInsertId();
            if ($newtickets) {
                $tck=$vt->prepare("insert into tickets_replies set ticketid=?, userid=?, comment=?, date=?");
                $tck->execute(array($ticketid,$userid,$message,$date));
 echo '<META HTTP-EQUIV="Refresh" content="1;destek"><div class="alert alert-success" style="width:100%; font-size:11px;" role="alert"><i class="ci-check"></i> Ticket başarıyla gönderildi</div>';
            }else{
              header("Location:../help.php?d=no");
            }
      }

?>	
	  
	    <input type="hidden" style="width:100%" name="userid" value="<?php echo $kbilgi["id"]; ?>">
	  
<font style="font-size:12px;">Destek Başlık</font><br><br>
<input type="text" style="font-size:12px;" name="subject" required placeholder="Destek Başlık">

<br>

<textarea type="text" name="message" class="bg-input bg-font form-control" style="font-size:12px;" required placeholder="Destek Yazınız"></textarea>

<hr>

<button name="newticket" style="padding:8px; background-color:#202020; color:white; border-radius:0 border-color:#202020; width:100%; border:0px;">GÖNDER</button>

</form>

</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>