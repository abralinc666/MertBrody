<?php include 'header.php';?>
<?php include 'menu.php'; ?>

<link rel="stylesheet" media="screen" href="epin/user.css" />
<link rel="stylesheet" media="screen" href="epin/row.css" />
<link rel="stylesheet" media="screen" href="epin/bank.css" />

<section class="container"><div class="payment-grid">





<button onclick="window.location='yukle';" class="btn btn-dark">Kredi/Banka Kartı</button>


<button class="btn btn-dark active">Havale/EFT</button>
</div> <br>

<div class="payment-grid-list">

<?php $banka  =$vt->query("select * from banka Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($banka as $banka) {?>
<?php if ($banka["gorunum"]==0) {echo ' 
<div class="payment-grid-list-item"><header><img src="'.$banka["bank"].'">
</header><div class="payment-grid-list-item-body" style="max-height: 207px;">
<div class="payment-grid-list-item-body-wrapper">
<div class="payment-account-grid">
<label>Hesap Sahibi:</label><div>'.$banka["hesapsahibi"].'</div>
<label>Şube No:</label><div>'.$banka["sube"].'</div>
<label>Hesap No:</label><div>'.$banka["hesapno"].'</div>
<label>IBAN:</label><strong>TR '.$banka["iban"].'</strong></div>
</div></div></div>

';}
 elseif ($banka["gorunum"]==1) {echo '';} ?>	
 <? } ?>










</div>




</section>





















<?php include 'footer.php'; ?>