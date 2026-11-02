<?php include 'header.php'; ?>
<?php $id=$_GET["id"]; $urun=$vt->query("select * from urun where id='$id' ")->fetch();



$satilanurunler  = $vt->query("select * from satilanurunler")->fetchAll(PDO::FETCH_ASSOC); foreach ($satilanurunler as $satilanurunler) 



?>
<?php include 'menu.php'; ?>

<link rel="stylesheet" media="screen" href="<? echo $sites["site_link"];?>epin/detay.css" />
<section class="container">


<?php 


      if (isset($_POST["satinal"])) {
        $id=$_POST["uid"];
        $uyeid=$_POST["uyeid"];
		$satinalan=$kbilgi["id"];
		$satinalan2=$kbilgi["username"];
        $fiyat=$urun["fiyat"];
		$urunad=$urun["urunad"];
		$urunid=$urun["id"];
		$date=date("Y-m-d h:i:sa");
		$durum=0;
		$kapak=$urun["resim"];
        $bakiye=$kbilgi["bakiye"];
        $ybakiye=$bakiye-$fiyat;
          if ($bakiye>=$fiyat) {
            $bakiyeguncele  =  $vt->query("update uyeler set bakiye='$ybakiye' where id='$uyeid' ");
            $satinal=$vt->prepare("insert into satilanurunler set satinalan=?, satinalan2=?, fiyat=?, urunad=?, date=?, durum=?, kapak=?, urunid=?");
            $satinal->execute(array($satinalan,$satinalan2,$fiyat,$urunad,$date,$durum,$kapak,$urunid));
            if ($satinal) {
              echo'<font style="float:left; background-color:#101318; padding:17px; color:#0bca47; border-color:#101318; border-radius:5px; font-size:12px; width:100%;">Ürün Başarıyla satın alınmıştır ürünlerim bölümünü inceleyebilirsiniz</font><br><br><br><br>' ;
            }
          }else{
            echo' <META HTTP-EQUIV="Refresh" content="7;URL="><font style="float:left; background-color:#101318; padding:17px;  border-color:#101318; border-radius:5px; font-size:12px; width:100%;">Yeterli Bakiyeniz yoktur lütfen bakiye yükleyip tekrar deneyiniz <b>Güncel bakiyeniz '.$kbilgi["bakiye"].' ₺</b></font><br><br><br><br>' ;
          }
      }
	  
	  
	  
	  ?>
	  
	  
	  
	  
	  
	  
<div class="product-detail">
<div class="product-detail-image">
<picture><source srcset="<? echo $sites["site_link"];?><?php echo $urun["resim"];?>" type="image/webp">
<source srcset="<? echo $sites["site_link"];?><?php echo $urun["resim"];?>" type="image/jpeg">
<img src="<? echo $sites["site_link"];?>transparent-1px.png" width="525" height="420" alt="<?php echo $urun["urunad"];?>" loading="lazy"></picture>
<div class="instant-delivery">
Hemen Teslim
</div>
</div>
<div class="product-detail-info">
<h1><?php echo $urun["urunad"];?></h1> <br>
<h3>Ürün Açıklaması:</h3>
<div class="product-detail-info-desc"><?php echo $urun["aciklama"];?>
</div>

</div>
<div class="product-detail-store">
<div class="product-detail-store-top">
<img src="<? echo $sites["site_link"];?>resim/user.png" width="80" height="80" loading="lazy">
<h2>
<a href="#"><? echo $sites["site_baslik"];?></a>
</h2>
<div class="rank-bar">
<div class="rank-bar-container">
<div class="rank-bar-container-fill" data-rank="100.0" style="width: 0%;"></div>
</div>
<div class="rank-bar-text">%100</div>
</div>
<a rel="nofollow" href="#">
Mağaza Yorumları (5000+)
</a> 


					<?php
 $toplamurun= $vt->query("select * from urun");
 $toplamurun = $toplamurun->rowCount();



 ?>
 
<a rel="nofollow" href="#">Mağazanın Toplam Ürünü (<?php  echo $toplamurun; ?>)</a>
</div>


</div>
<div class="product-detail-meta four">
<div>
<div>Ürün No</div>
<h3>#100<?php echo $urun["id"];?></h3>
</div>
<div>
<div>Görülme</div>
<h3>
5000+
</h3>
</div>
<div>
<div>Kategorisi</div>
<h3><?php echo $urun["kat"];?></h3>
</div>
<div>
<div>Stok</div>
<h3>
  <?php if ($urun["stok"]==1) {echo '<font style="color:#ff3636;">STOKTA YOK</font>';}

 elseif ($urun["stok"]==0) {echo '<font style="color:#0bca47;">STOKTA VAR</font>';} ?>
</h3>
</div>
</div>
<form class="product-detail-purchase" action="" method="post">

<input type="hidden" value="<?php echo $kbilgi["id"]; ?>" name="uid" value="">
<input type="hidden" value="<?php echo $kbilgi["id"]; ?>" name="uyeid" value="">	

<div class="product-detail-purchase-top">
<div>ÜRÜN TUTARI
<div class="selling-price">
<? echo $urun["fiyat"];?> ₺
</div>
</div>
</div>

<?php if ($kbilgi["yetki"]==1) {?>	
<?php if ($urun["stok"]==1) {echo '<button type="submit" style="width:100%; border-color:#ff3636; background-color:#ff3636;" class="btn">STOKTA YOK</button>';}

elseif ($urun["stok"]==0) {echo '<button type="submit" name="satinal" style="width:100%;" class="btn btn-jungle">Satın Al</button>';} ?>
 <? } ?>
 
<?php if ($kbilgi["yetki"]==2) {?>	
<?php if ($urun["stok"]==1) {echo '<button type="submit" style="width:100%; border-color:#ff3636; background-color:#ff3636;" class="btn">STOKTA YOK</button>';}

elseif ($urun["stok"]==0) {echo '<button type="submit" name="satinal" style="width:100%;" class="btn btn-jungle">Satın Al</button>';} ?>
 <? } ?>
 
 
 <?php if ($kbilgi["yetki"]==0) {?>	
<a href="<? echo $sites["site_link"];?>giris-yap" style="width:100%; border-color:#1291d8; background-color:#1291d8;" class="btn">GİRİŞ YAPINIZ</a>
 <? } ?>

</form> </div>
</section>

						  
  







<section class="container">
<header>
<h2>Bunlar da ilginizi çekebilir</h2>
</header>
<div class="grid-6">



<?php $ilginizicekicek  = $vt->query("select * from urun ORDER by RAND() LIMIT 6")->fetchAll(PDO::FETCH_ASSOC); foreach ($ilginizicekicek as $ilginizicekicek) {  ?>
<a class="product  <?php if ($ilginizicekicek["avantaj"]==1) {echo 'sponsored';} elseif ($ilginizicekicek["avantaj"]==0) {echo '';} ?>" href="<? echo $sites["site_link"];?>detay/<?=seo($ilginizicekicek["urunad"]).'/'.$ilginizicekicek["id"]?>"> 
<picture class="product-image"><source srcset="<? echo $sites["site_link"];?><? echo $ilginizicekicek["resim"];?>" type="image/webp">
<source srcset="<? echo $sites["site_link"];?><? echo $ilginizicekicek["resim"];?>" type="image/jpeg">
<img src="<? echo $sites["site_link"];?>resim/transparent-1px.png" width="250" height="200" alt="<? echo $ilginizicekicek["urunad"];?>" loading="lazy"></picture><label>
<span><? echo $ilginizicekicek["kat"];?></span></label>
<h2><? echo $ilginizicekicek["urunad"];?></h2>
<div class="original-price">
</div>
<div class="selling-price">
<? echo $ilginizicekicek["fiyat"];?> ₺
</div>
</a>
<?php } ?>

</div>
</section>

   
   
   
   <section class="container">
<div class="section-content">
<h2>Satın Alımlar / Yorumları</h2>
</div>
</section>




   
   <section id="product-detail-comments">
   
 
   <? $alan=$urun["id"]; ?>


<?php  $cek  =$vt->query("select * from satilanurunler where urunid='$alan' order by id desc")->fetchAll(PDO::FETCH_ASSOC); foreach ($cek as $cek) {?>	

	




<section class="container comment">
<header>
<h2><?php echo $cek["satinalan2"]; ?> <small><?php echo $cek["date"] ?></small></h2>
</header>
<div class="section-content">
<?php echo $cek["degerlendirme"] ?>
</div>
</section>
<?php } ?>  




</section>

	

<?php include 'footer.php'; ?>