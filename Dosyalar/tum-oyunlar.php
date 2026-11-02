<?php include 'header.php'; ?>
<?php include 'menu.php'; ?>
<link rel="stylesheet" media="screen" href="epin/kategori.css" />




<section class="container">
<div class="grid-6">

<?php $kategori  = $vt->query("select * from kategori")->fetchAll(PDO::FETCH_ASSOC); foreach ($kategori as $kategori) {  ?>
<a class="category" href="sayfa/<?=seo($kategori["baglanti"]).'/'.$kategori["id"]?>">
<picture class="category-image"><source srcset="<? echo $kategori["resim"];?>" type="image/webp"><source srcset="<? echo $kategori["resim"];?>" type="image/jpeg">
<img src="https://images.gamesatis.com/assets/transparent-1px.png" width="250" height="340" alt="<? echo $kategori["oyunadi"];?>" loading="lazy"></picture>
<h2><? echo $kategori["oyunadi"];?></h2>
</a>
<? } ?>


</div>
</section>


















<?php include 'footer.php'; ?>