<?php include 'header2.php' ; $id=$_GET["id"];
$tickett=$vt->query("select * from tickets where id='$id' ")->fetch();
$ticketsor=$vt->query("select * from tickets_replies where ticketid='$id' order by id asc")->fetchAll(PDO::FETCH_ASSOC);
$userid=$kbilgi["id"];

if ($tickett["userid"]==$userid) {

?>
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
<button onclick="window.location='siparislerim';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-shopping-cart"></i>Siparişlerim</button>
<button onclick="window.location='yukle';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-money-bill"></i>Bakiye Yükle</button>
<button onclick="window.location='kupon';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-key"></i>Kupon Kodu</button>
<button onclick="window.location='oyunlar';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-play"></i>Tüm Oyunlar</button>
<button onclick="window.location='yorumlarim';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-comments"></i>Yorumlarım</button>
<button onclick="window.location='yuklemelerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-credit-card"></i>Yüklemelerim</button>
<button onclick="window.location='destek-olustur';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plus"></i>Destek Oluştur</button>
<button onclick="window.location='destek';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-ticket"></i>Destek Taleplerim</button>
<button onclick="window.location='odeme-bildir';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-bell"></i>Ödeme Bildirimleri</button>
<button onclick="window.location='etf';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-plane"></i>Havale/ETF</button>
<button onclick="window.location='logout';" class="btn btn-dark user-panel-menu-button"><i style="margin-top:8px; font-size:30px;" class="fad fa-power-off"></i>Çıkış Yap</button>

</div><div class="user-panel-body">

<div class="settings"><div style="padding:30px;" class="settings-box">

<h1>DESTEK</h1>
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

<?php foreach ($ticketsor as $ticketcek) {  ?>
			   <?php if ($ticketcek["userid"]==$userid) {echo '';}else{} ?>							
											
<div style="padding:10px;" class="site-header-signed-in-group-user">
<div class="ornek">
<img src="<?php echo $urunc["kapak"]; ?>" class="sola-kaydir" style="height:70px;">


 <a href="#">
<div class="site-header-signed-in-group-user-store-name"><?php if ($ticketcek["userid"]==$userid) {echo ''; echo $kbilgi["username"];}
                     else{
                       $kullaniciID = $ticketcek["userid"];
                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
                       ?>
   <b><?php echo $kullanicibul["username"]; ?></b><font style="font-size:11px; color:#35aeff;"> <b>[MÜŞTERİ]</b></font> <?php } ?></div>
<div class="site-header-signed-in-group-user-balance" id="user-balance"><font style="font-size:11px;"><?php echo $ticketcek["comment"]; ?></font> </div> </a>

</div>
</div><br>
<? } ?>



        <div class="bg-csp4 card shadow">
            <div class="card-body">
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="generalUpdate" role="tabpanel" aria-labelledby="general_tab">
                      	<form action="" method="post">
<?php



      if (isset($_POST["ticketcevapver"])) {
        $id=$_POST["tic"];
        $uid=$_POST["uid"];
        $message=$_POST["message"];
        $active=1;
        $date=date("d.m.Y h:i");
          $ticketcevapver = $vt-> prepare("insert into tickets_replies set ticketid=?, userid=?, comment=?, date=?");
          $ticketcevapver -> execute(array($id,$uid,$message,$date));
            if ($ticketcevapver) {
                $ticketguncelle = $vt->query("update tickets set active='$active' where id='$id' ");
            echo '<META HTTP-EQUIV="Refresh" content="1;"><div class="alert alert-success" style="width:100%;" role="alert">Yeni mesaj gönderildi</div>';
            }else{
              header("Location:../ticket.php?id=$id&drm=no");
            }
      }
	  
	  
	  ?>
				      <input type="hidden" name="tic" value="<?php echo $id ?>">
                       <input type="hidden" name="uid" value="<?php echo $userid ?>">
                            

					
                            <div class="form-group">
                                <label>Yeni Mesajınız</label>
                                <div class="input-group input-group-merge">
                                    <textarea type="text" class="bg-input bg-font form-control" required name="message"></textarea>
                                </div>
                            </div>

                          
                            <div class="d-flex justify-content-start align-items-center">
                               <button type="submit" name="ticketcevapver" style="width:100%; font-size:10px;" class="bg-btn bg-font btn btn-primary">Mesajı Gönder</button>
                            </div>
                        </form>
                    </div>
					
					
				
 
                   
                </div>
            </div>
        </div>


</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; } ?>