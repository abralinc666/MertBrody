<?php include 'header2.php'; ?>
<?php include 'menu.php'; ?>

<?php
$id=$_GET["id"];
if(isset($_POST['payment'])){
	include 'shopierAPI.php'; 
	$shopier = new Shopier('c4a09f52e6937c777cec8db243be18c4', '9ab030f924d43c5b0be168eaf52d88c1');
	$orderNo = uniqid();
	$shopier->setBuyer([ 
	'id' => $orderNo,
	'paket' => 'Bakiye', 
	'first_name' => $kbilgi['username'], 'last_name' => $kbilgi['adsoyad'], 'email' => $kbilgi['email'], 'phone' => $_POST['phoneNumber'], 'paket' => $_POST['product_name']]); 
	$shopier->setOrderBilling([
	'billing_address' => 'istanbul',
	'billing_city' => 'İstanbul',
	'billing_country' => 'Türkiye',
	'billing_postcode' => '34000',
	]);
	$shopier->setOrderShipping([
	'shipping_address' => 'İSTANBUL', 
	'shipping_city' => 'İstanbul',
	'shipping_country' => 'Türkiye',
	'shipping_postcode' => '34000', 
	]);
	
	$_SESSION["price"] = $_POST['amount'];
	$query = $vt->prepare("INSERT INTO shopierOrder SET
	orderNo = ?,
	user_id = ?,
	amount = ?,
	status = ?
	");
	$insert = $query->execute(array(
		 $orderNo, $kbilgi['id'], $_POST['amount'], 0
	));
	
	if($insert){ 
		die($shopier->run($orderNo, $_POST['amount'], 'https://siteyazilim.com.tr/shopierNotify.php'));
	}
}

?>
	

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
<button onclick="window.location='siparislerim';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-shopping-cart"></i>Siparişlerim</button>
<button onclick="window.location='yukle';" class="btn btn-dark user-panel-menu-button "><i style="margin-top:8px; font-size:30px;" class="fad fa-money-bill"></i>Bakiye Yükle</button>
<button onclick="window.location='kupon';" class="btn btn-dark user-panel-menu-button active"><i style="margin-top:8px; font-size:30px;" class="fad fa-key"></i>Kupon Kodu</button>
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

  <form action="" class="contact-form form-validate" novalidate="novalidate" method="post">
 

<?
					if($_POST["couponUse"]){
						$coupon = $_POST["coupon"];
						if($coupon == "")
						{
							
							$results = '<div class="alert alert-danger">
              <strong>Hata!</strong> <span>Lütfen kupon kodu girin!</span>
            </div>';
							
						}else{
							
							$v = $vt->prepare("select * from kupon where kod=?");
                    $v->execute(array($coupon));
                    $z = $v->fetch(PDO::FETCH_ASSOC);
                    $x = $v->rowCount();
					$userMoney = $kbilgi["bakiye"] + $z["bakiye_miktari"];
					$kuponid = $z["id"];
					if($coupon != $z["kod"]){
						$results = '<div class="alert alert-danger">
              <strong>Hata!</strong> <span>Böyle bir kupon kodu bulunmuyor!</span>
            </div>';
					}else{
					if($z["durumu"] == 1){
						
						$results = '<div class="alert alert-danger">
              <strong>Hata!</strong> <span>Bu kupon kodu daha önce kullanıldı!</span>
            </div>';
					}else{
						if($x){
							 $action = $vt->prepare("update uyeler set
                bakiye=?
                where id=?
                ");
				$update = $action->execute(array($userMoney,$kbilgi["id"]));
				if($update){
					
					 $couponUp = $vt->prepare("update kupon set
                durumu=?
                where id=?
                ");
				$durum = 1;
				$useCoup = $couponUp->execute(array($durum,$kuponid));
				if($useCoup){
					
					$results = '<div class="alert alert-success">
              <strong>Başarılı!</strong> <span>Kupon kodu kullanıldı, bakiye hesabınıza tanımlandı!</span>
            </div>';
					
				}
				}else{
			
					$results = '<div class="alert alert-danger">
              <strong>Hata!</strong> <span>Bir hata oluştu!</span>
            </div>';
				
				}
						}
						}
						}
						}
					}
					?>
                  
	  
	  
	   <input type="hidden" value="<?php echo $kbilgi["id"]; ?>" name="kid" value="">

<?=$results?>



<h1>Kupon Kodu</h1>
<hr>
<font style="font-size:12px;">Kupon Kodu</font><br><br>
<input type="text" name="coupon" style="font-size:12px;" placeholder="Kupon Kodu">

 <br>


<button value="couponUse" name="couponUse" style="padding:8px; background-color:#202020; color:white; border-radius:0 border-color:#202020; width:100%; border:0px;">ONAYLA</button>

</form>

</div></div>



</div></div></div>
</section>





















<?php include 'footer.php'; ?>