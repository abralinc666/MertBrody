<?php include 'header.php'; ?>
<?php $id=$_GET["id"]; $kategori=$vt->query("select * from kategori where id='$id' ")->fetch();?>
<?php $sayfabaglantisi=$kategori["baglanti"]; ?>
<?php include 'menu.php'; ?>


	<link rel="stylesheet" media="screen" href="<? echo $sites["site_link"];?>/epin/list.css" />


		
<section class="container">
<div class="goldbar-container">

<?php $urun  = $vt->query("select * from urun WHERE kat='$sayfabaglantisi' ")->fetchAll(PDO::FETCH_ASSOC); foreach ($urun as $urun) {  ?>
<div class="goldbar-row" >
<a class="goldbar-row-image" href="<? echo $sites["site_link"];?>detay/<?=seo($urun["urunad"]).'/'.$urun["id"]?>">
<img src="<? echo $sites["site_link"];?>/<? echo $urun["resim"];?>" alt="<? echo $urun["urunad"];?>" loading="lazy">
</a> <a class="goldbar-row-name" href="<? echo $sites["site_link"];?>detay/<?=seo($urun["urunad"]).'/'.$urun["id"]?>">
<? echo $urun["urunad"];?>
<small><? echo $urun["urunad"];?> satin al</small>
</a> <div class="goldbar-row-price">
<label>Fiyatı</label>
<div data-unit-price="<? echo $urun["fiyat"];?>"><? echo $urun["fiyat"];?> ₺</div>
</div>
<a href="<? echo $sites["site_link"];?>detay/<?=seo($urun["urunad"]).'/'.$urun["id"]?>"><button class="btn btn-jungle" type="submit">Satın Al</button></a>
 </div>
<? } ?>
 
 
 
  </div>
</section>
		
	

<?php include 'footer.php'; ?>