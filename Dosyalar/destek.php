<?php include 'header2.php';  $id=$kbilgi["id"];
$ticketsor  = $vt->query("select * from tickets where userid='$id' order by id desc ")->fetchAll(PDO::FETCH_ASSOC);?>
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

<h1>Desteklerim</h1>
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

<?php
                  foreach ($ticketsor as $ticketcek) {  ?>											
<div style="padding:10px;" class="site-header-signed-in-group-user">
<div class="ornek">


 <a href="view.php?id=<?php echo $ticketcek["id"] ?>">
<div class="site-header-signed-in-group-user-store-name"> <?php echo $ticketcek["subject"] ?></div> 
<div class="site-header-signed-in-group-user-balance" id="user-balance"><?php echo $ticketcek["date"] ?> </div> 

<?php if ($ticketcek["active"]==1) {echo '<span style="background-color:orange; padding:3px; border-radius:2px; font-size:10px;">Durumu : Beklemede</span>';}
 elseif ($ticketcek["active"]==0) {echo '<span style="background-color:#18be7e; padding:3px; border-radius:2px; font-size:10px;">Durumu : Cevaplandı</span>';} ?>
</a>
</div>


 

</div><br>
<? } ?>






</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>