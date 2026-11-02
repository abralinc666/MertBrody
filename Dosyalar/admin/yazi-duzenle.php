<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			
		
<?php

$id=$_GET["id"];
$blogsorgu=$vt->query("select * from blog where id='$id' ")->fetch();
?>



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Yazıyı Düzenle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


<?php 

	  
	 
      if ($_GET["blogsil"]=="ok") {
        $id =$_GET["id"];
          $blogsil=$vt->prepare("delete from blog where id=?");
          $blogsil->execute(array($id));
          if ($blogsil) {
               echo '
			            <META HTTP-EQUIV="Refresh" content="3;URL=a-sozcukler.php"/>  <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Yazı başarıyla silindi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '   ';
          }
      }
	  
	  
	  ?>

<?php


      if (isset($_POST["guncelle"])) {
        if ($_POST["uyepass"]=="") {
        $id     =$_POST["id"];
        $baslik    =$_POST["baslik"];
		$icerik  	   =$_POST["icerik"];
		$kapak  	   =$_POST["kapak"];
              $uyeguncel=$vt->prepare("update blog set baslik=?, icerik=?, kapak=? where id=? ");
              $uyeguncel->execute(array($baslik,$icerik,$kapak,$id));
              if ($uyeguncel) {
               echo '
			              <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Yazı başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '    <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Yazı düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }else{
        $id     =$_POST["id"];
        $baslik    =$_POST["baslik"];
		$icerik  	   =$_POST["icerik"];
		$kapak  	   =$_POST["kapak"];
              $uyeguncel=$vt->prepare("update blog set baslik=?, icerik=?, kapak=? where id=? ");
              $uyeguncel->execute(array($baslik,$icerik,$kapak,$id));
              if ($uyeguncel) {
               echo '
			              <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Yazı başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '  <META HTTP-EQUIV="Refresh" content="3;">     <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Yazı düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }
      }
	  
	  
	  
?>
     <form class="needs-validation" action="" method="post" novalidate>
                                          
<input type="hidden"  name="id" value="<?php echo $blogsorgu["id"]; ?>">
     
	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Yazı Düzenle 			
										
										<a style="float:right;" class="btn btn-danger" href="?id=<?php echo $blogsorgu["id"] ?>&blogsil=ok">
			<font color="white">Yazıyı Sil</font>
			</a></h4>

                                        <p class="card-title-desc">
										Toplantı alanına eklediğiniz bilgileri düzenleyebilirsiniz</p>
										
			
                                    </div>
                                    <div class="card-body">
                                     <div class="row">
                                                <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Yazı Başlık</label>
                             <input type="text" class="form-control" id="validationCustom01" name="baslik" value="<?php echo $blogsorgu["baslik"];?>">
                                                 
                                                    </div>
                                                </div>
												
												      <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Yazı Resim Link</label>
                             <input type="text" class="form-control" id="validationCustom01" name="kapak" value="<?php echo $blogsorgu["kapak"];?>">
                                                 
                                                    </div>
                                                </div>
												
												
                                                 <div class="col-md-12">
												 
												 
												 

       <div class="mb-12">
 <label class="form-label" for="default-input">Yazı İçeriği</label>
<textarea class="form-control" type="text" style="height:200px;" name="icerik" placeholder="Yazı Yazarı"><?php echo $blogsorgu["icerik"];?></textarea>
                                            </div>
											
											
<br>
                                              
                                                
<button class="btn btn-primary" style="width:100%;" type="submit" name="guncelle">Düzenle</button>
     
												</div>
													
                            
								 
                                            </div>

						    </div>
						
						
						    </div>    </div>    </div>
						
						
                    </div>
                </div>









<?php include 'admin-footer.php'; } ?>
				

