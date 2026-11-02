<?php include 'header.php'; 

$id=$_GET["id"];
$blog=$vt->query("select * from blog where id='$id' ")->fetch();
$blogsor=$vt->query("select * from blog_yorumlar where ticketid='$id' order by id desc")->fetchAll(PDO::FETCH_ASSOC);


		 
		  if ($blog["userid"]==$userid) {echo $kbilgi["username"];}
                     else{
                       $kullaniciID = $blog["userid"];
                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
					 }
					 
					
					 
					   
?>
<?php include 'menu.php'; ?>
<link rel="stylesheet" media="screen" href="<? echo $sites["site_link"];?>/epin/kategori.css" />
<link rel="stylesheet" media="screen" href="<? echo $sites["site_link"];?>/epin/blogdetay.css" />



<section class="container blogs">
<div class="blogs">
<div class="blog-left-column">
<div class="blog-header">
<div class="blog-header-left-column">
<picture><source srcset="<?php echo $sites["site_link"];?>/resim/buser.png" type="image/webp">
<source srcset="<?php echo $sites["site_link"];?>/resim/buser.png" type="image/jpeg"><img src="<?php echo $sites["site_link"];?>/resim/transparent-1px.png" loading="lazy"></picture>
<a class="offline" rel="nofollow" href=""><?php echo $kullanicibul["username"]; ?></a>
<small>@yazar</small>
</div>
<div class="blog-header-center-column valorant-haberleri">
<picture class="blog-detail-image"><source srcset="<?php echo $sites["site_link"];?>/<?php echo $blog["kapak"] ?>" type="image/webp">
<source srcset="<?php echo $sites["site_link"];?>/<?php echo $blog["kapak"] ?>" type="image/jpeg"><img src="<?php echo $sites["site_link"];?>/resim/transparent-1px.png" width="720" height="316" loading="lazy"></picture>
</div>
<div class="blog-header-right-column">
<svg height="32" width="32" viewBox="0 0 80 80">
<text x="50%" y="20%" dominant-baseline="central" text-anchor="middle" width="80" height="80" font-size="0.75rem">Blog</text>
<text x="50%" y="52%" dominant-baseline="central" text-anchor="middle" width="80" height="80" font-weight="bold" font-size="1.25rem"> <?php echo $blog["id"] ?></text>
</svg>
</div>
<div class="blog-header-full-column">
<h1>
<?php echo $blog["baslik"] ?>
</h1>
</div>
</div>
<div class="blog-content">
<p><?php echo $blog["icerik"] ?></p>
</div>
<div class="blog-left-column-footer">
<div class="blog-author">
<picture><source srcset="<?php echo $sites["site_link"];?>/resim/buser.png" type="image/webp"><source srcset="<?php echo $sites["site_link"];?>/resim/buser.png" type="image/jpeg">
<img src="<?php echo $sites["site_link"];?>/resim/transparent-1px.png" loading="lazy"></picture>
<div>
<a class="offline" rel="nofollow" href="#"><?php echo $kullanicibul["username"]; ?></a>
<small>@yazar</small>
</div>
</div>
<div class="blog-date">
<?php echo $blog["date"] ?> 
tarihinde yazıldı.
</div>

<div class="blog-share">
<?php echo $blog["baslik"] ?>
</div>


</div>


</div>


<section>
<br>
<header>
<h2>YORUMLAR</h2>
</header>
<div class="section-content fix-height">
<div class="faqs-list" id="faqs-list">



<?php

	  
	  

      if ($_GET["yorumsil"]=="ok") {
        $id =$_GET["id"];
		  $sorgu = $vt->prepare("SELECT * FROM blog WHERE id= ?");
  $sorgu->bindParam(1, $id, PDO::PARAM_STR);
  $sorgu->execute();
  $cikti = $sorgu->fetch(PDO::FETCH_ASSOC);
  $ticketid = $cikti["ticketid"];
          $yorumsil=$vt->prepare("delete from blog_yorumlar where id=?");
          $yorumsil->execute(array($id));
          if ($yorumsil) {
		    header('Location:'.$sites["site_link"].'/index.php');
          }else{
		    header('Location:'.$sites["site_link"].'/index.php');
          }
      }
	  


	  ?>



<?php foreach ($blogsor as $yorumcek) {  ?>
			   <?php if ($yorumcek["userid"]==$userid) {echo '';}else{} ?>							

				   <?php if ($yorumcek["userid"]==$userid) {echo $kbilgi["username"];}
                     else{
                       $kullaniciID = $yorumcek["userid"];
                       $kullanicibul2  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
                     }  ?>
			
<div class="faqs-list-item">
<h3 class="faqs-list-item-header"><?php echo $kullanicibul2["username"]; ?> <?php if ($kbilgi["yetki"]==2) {?>
<p class="memberlist-item_username-usertitle" style="float:right; margin-top:-5px;">
<a href="?id=<?php echo $yorumcek["id"] ?>&yorumsil=ok" style="font-size:11px;">Yorumu Sil</a>
</p> <?php } ?></h3>
<div class="faqs-list-item-body"><p> <?php echo $yorumcek["comment"]; ?></p>
</div>
</div>

<?php } ?>


</div>
</div>
</section>
</div>





 <?php if ($kbilgi["yetki"]==0) {?>	
								
																	<div class="mt-5 py-4 border-top border-bottom">
									<div class="alert alert-warning mb-0"><i class="fe fe-bell"></i> Yorum atabilmek için giriş yapmanız gerekmektedir.</div>										</div>
 <?php } ?>
		






<?php if ($kbilgi["yetki"]==1) {
      if (isset($_POST["yorumyap"])) {
        $id=$_POST["tic"];
        $uid=$_POST["uid"];
        $comment=$_POST["comment"];
        $active=1;
          $yorumyap = $vt-> prepare("insert into blog_yorumlar set ticketid=?, userid=?, comment=?");
          $yorumyap -> execute(array($id,$uid,$comment));
            if ($yorumyap) {
                $ticketguncelle = $vt->query("update blog set active='$active' where id='$id' ");
            echo '<META HTTP-EQUIV="Refresh" content="0;">';
            }else{
              header("Location:../ticket.php?id=$id&drm=no");
            }
      }
	  ?>
	  
	  
	  <form action="" method="post">
				      <input type="hidden" name="tic" value="<?php echo $id ?>">
                       <input type="hidden" name="uid" value="<?php echo $kbilgi["id"] ?>">
                            

					
                            <div class="form-group">
                                <label>Yeni Yorum</label>
                                <div class="input-group input-group-merge">
                                    <textarea type="text" class="form-control" required name="comment"></textarea>
                                </div>
                            </div>

                          <br>
						  
                            <div class="d-flex justify-content-start align-items-center">
                               <button type="submit" name="yorumyap" style="background-color:#111318; color:White; border-radius:6px; width:100%; font-size:10px;" class="btn btn-primary">Mesajı Gönder</button>
                            </div>
							
							
                        </form>
						
 <?php } ?>



 

<?php if ($kbilgi["yetki"]==2) {
      if (isset($_POST["yorumyap"])) {
        $id=$_POST["tic"];
        $uid=$_POST["uid"];
        $comment=$_POST["comment"];
        $active=1;
          $yorumyap = $vt-> prepare("insert into blog_yorumlar set ticketid=?, userid=?, comment=?");
          $yorumyap -> execute(array($id,$uid,$comment));
            if ($yorumyap) {
                $ticketguncelle = $vt->query("update blog set active='$active' where id='$id' ");
            echo '<META HTTP-EQUIV="Refresh" content="0;">';
            }else{
              header("Location:../ticket.php?id=$id&drm=no");
            }
      }
	  ?>
	  
	  
	  <form action="" method="post">
				      <input type="hidden" name="tic" value="<?php echo $id ?>">
                       <input type="hidden" name="uid" value="<?php echo $kbilgi["id"] ?>">
                            

					
                            <div class="form-group">
                                <label>Yeni Yorum</label>
                                <div class="input-group input-group-merge">
                                    <textarea type="text" class="form-control" required name="comment"></textarea>
                                </div>
                            </div>

                          <br>
						  
                            <div class="d-flex justify-content-start align-items-center">
                               <button type="submit" name="yorumyap" style="background-color:#111318; color:White; border-radius:6px; width:100%; font-size:10px;" class="btn btn-primary">Mesajı Gönder</button>
                            </div>
							
							
                        </form>
						
 <?php } ?>
 
 
 
 
</section>





























<?php include 'footer.php'; ?>