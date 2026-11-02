<body data-status="false" data-id="AsBveh8KgeiEjr96e9G9zhg" data-page="">


<section class="site-header">
<div class="container">


<div class="site-header-side left">
<a href="<? echo $sites["site_link"];?>anasayfa">
<picture>
<img width="100" height="30" src="https://epin.co.id/wp-content/uploads/2019/07/epin-logo-light@2x.png" />
</picture>
</a>
</div>


<div class="site-header-center">
    <form method="post" action="<? echo $sites["site_link"];?>bulunan.php">
      <input type="text" name="search" placeholder="Oyun Ara..." required>
    </form>

</div>


<div class="site-header-side right">


 <?php if ($kbilgi["yetki"]==1) {?>		
<div style="padding:10px;" class="site-header-signed-in-group-user">
<a href="<? echo $sites["site_link"];?>profilim">
<img src="<? echo $sites["site_link"];?>resim/sag.png" class="site-header-signed-in-group-user-avatar" alt="Store_7093595" loading="lazy">
</a> <a href="<? echo $sites["site_link"];?>profilim">
<div class="site-header-signed-in-group-user-store-name"> <? echo $kbilgi["username"];?></div>
<div class="site-header-signed-in-group-user-balance" id="user-balance"> <? echo $kbilgi["bakiye"];?> ₺</div>
</a>

 <a class="btn site-header-signed-in-group-user-messages" href="<? echo $sites["site_link"];?>destek">
<svg class="icon">
<use xlink:href="#gs-icon-layout-messages"></use>
</svg>
</a>

<a class="btn site-header-signed-in-group-user-notifications" href="<? echo $sites["site_link"];?>siparislerim">
<svg class="icon">
<use xlink:href="#gs-icon-layout-heart"></use>
</svg>
</a>
</div>
 <? } ?>
 
 
  <?php if ($kbilgi["yetki"]==2) {?>		
<div style="padding:10px;" class="site-header-signed-in-group-user">
<a href="<? echo $sites["site_link"];?>/profilim">
<img src="<? echo $sites["site_link"];?>/resim/sag.png" class="site-header-signed-in-group-user-avatar" alt="Store_7093595" loading="lazy">
</a> <a href="<? echo $sites["site_link"];?>profilim">
<div class="site-header-signed-in-group-user-store-name"> <? echo $kbilgi["username"];?></div>
<div class="site-header-signed-in-group-user-balance" id="user-balance"> <? echo $kbilgi["bakiye"];?> ₺</div>
</a>

 <a class="btn site-header-signed-in-group-user-messages" href="<? echo $sites["site_link"];?>destek">
<svg class="icon">
<use xlink:href="#gs-icon-layout-messages"></use>
</svg>
</a>

<a class="btn site-header-signed-in-group-user-notifications" href="<? echo $sites["site_link"];?>siparislerim">
<svg class="icon">
<use xlink:href="#gs-icon-layout-heart"></use>
</svg>
</a>
</div>
 <? } ?>
 
 
 <?php if ($kbilgi["yetki"]==0) {?>		
<a class="btn btn-blue" href="<? echo $sites["site_link"];?>giris-yap">
<svg class="icon">
<use xlink:href="#gs-icon-layout-user"></use>
</svg>
Giriş/Kayıt
</a> 
 <? } ?>
 
 
 </div>


</div>
</section>





<section class="container">
<nav class="top-navigation">
<a class="games" href="<? echo $sites["site_link"];?>anasayfa">ANASAYFA</a>
<a href="<? echo $sites["site_link"];?>blog">BLOG</a>
<a href="<? echo $sites["site_link"];?>tum-oyunlar">OYUNLAR</a>
<?php $kategori  = $vt->query("select * from kategori ORDER by id LIMIT 4")->fetchAll(PDO::FETCH_ASSOC); foreach ($kategori as $kategori) {  ?>
<a href="<? echo $sites["site_link"];?>sayfa/<?=seo($kategori["baglanti"]).'/'.$kategori["id"]?>"><span style="text-transform: uppercase;"><? echo $kategori["oyunadi"];?></span></a>
<? } ?>
<a class="payment" rel="nofollow" href="<? echo $sites["site_link"];?>/yukle">BAKİYE YÜKLE</a>
</nav>
</section>
