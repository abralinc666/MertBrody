<?php include 'header.php'; ?>
<?php include 'menu.php'; ?>
<link rel="stylesheet" media="screen" href="epin/kategori.css" />
<link rel="stylesheet" media="screen" href="https://www.gamesatis.com/packs/css/styles/blog/index-93515abd.css" />













<section class="container blogs">
<div>



 <?php 
 


$blog  =$vt->query("select * from blog Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($blog as $blog) {
	


	?>

<div class="blog-left-column-item valorant-haberleri">
<a class="blog-left-column-item-image" href="oku/<?=seo($blog["baslik"]).'/'.$blog["id"]?>">
<picture class="blog-image"><source srcset="<? echo $sites["site_link"];?>/<?php echo $blog["kapak"];?>" type="image/webp">
<source srcset="<?php echo $blog["kapak"];?>" type="image/jpeg">
<img src="<? echo $sites["site_link"];?>/resim/transparent-1px.png" width="292" height="128" loading="lazy"></picture>
</a> <div class="blog-left-column-item-header">
<h2>
<a href="oku/<?=seo($blog["baslik"]).'/'.$blog["id"]?>">
<?php echo $blog["baslik"];?>
</a> </h2>
<div class="blog-left-column-item-header-info">
</div>
</div>

<div class="blog-left-column-item-footer">
<span class="blog-left-column-item-footer-date">
<svg class="icon">
<use xlink:href="#gs-icon-blogs-calendar"></use>
</svg>
<?php echo $blog["date"];?>
</span>
<span class="blog-left-column-item-footer-author">
Yazar:
<a rel="nofollow" href="">
<picture class="author-image"><source srcset="<? echo $sites["site_link"];?>/resim/sag.png" type="image/webp">
<source srcset="<? echo $sites["site_link"];?>/resim/sag.png" type="image/jpeg"><img src="<? echo $sites["site_link"];?>/resim/transparent-1px.png" loading="lazy"></picture>
<? echo $sites["site_baslik"];?>
</a> </span>
<a class="blog-left-column-item-footer-link" href="oku/<?=seo($blog["baslik"]).'/'.$blog["id"]?>">
Habere Git
<svg class="icon">
<use xlink:href="#gs-icon-blogs-journal-link"></use>
</svg>
</a> </div>
</div>

    </div>

 <?php } ?>
	


</section>


















<?php include 'footer.php'; ?>