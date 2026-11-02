<?php include 'header.php'; ?>
<?php $id=$_GET["id"]; $kategori=$vt->query("select * from kategori where id='$id' ")->fetch();?>
<?php $sayfabaglantisi=$kategori["baglanti"]; ?>
<?php include 'menu.php'; ?>


	<link rel="stylesheet" media="screen" href="<? echo $sites["site_link"];?>epin/list.css" />



		
<section class="container">
<div class="goldbar-container">

 <?php
    if (isset($_POST["search"])) {
      require "baglan.php";  if (count($results) > 0) { foreach ($results as $r) { ?>
	  
<div id="results">
<div class="goldbar-row" >	
<a class="goldbar-row-image" href="<? echo $sites["site_link"];?>detay/<?=seo($r["urunad"]).'/'.$r["id"]?>">
<img src="<? echo $sites["site_link"];?><? printf("%s", $r["resim"]);  ?>" alt="<? printf("%s", $r["urunad"]);  ?>" loading="lazy">
</a> <a class="goldbar-row-name" href="<? echo $sites["site_link"];?>detay/<?=seo($r["urunad"]).'/'.$r["id"]?>">
  
<? printf("%s", $r["urunad"]);  ?>
   
<small><? printf("%s", $r["urunad"]);  ?> satin al</small>
</a> <div class="goldbar-row-price">
<label>Fiyatı</label>
<div data-unit-price="<? printf("%s", $r["fiyat"]);  ?>"><? printf("%s", $r["fiyat"]);  ?> ₺</div>
</div>
<a href="<? echo $sites["site_link"];?>detay/<?=seo($r["urunad"]).'/'.$r["id"]?>"><button class="btn btn-jungle" type="submit">Satın Al</button></a>
 </div></div>
 <? } }} ?>
 
 
 
  </div>
</section>
		
	

<?php include 'footer.php'; ?>