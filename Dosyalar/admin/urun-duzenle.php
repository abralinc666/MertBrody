<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>	
<?php

$id=$_GET["id"];
$urunsorgu=$vt->query("select * from urun where id='$id' ")->fetch();
?>



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Ürünü Düzenle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


<?php 

	  
	 
      if ($_GET["urunsil"]=="ok") {
        $id =$_GET["id"];
          $urunsil=$vt->prepare("delete from urun where id=?");
          $urunsil->execute(array($id));
          if ($urunsil) {
               echo '
			            <META HTTP-EQUIV="Refresh" content="3;URL=a-urunler.php"/>  <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Ürün başarıyla silindi
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
        $urunad    =$_POST["urunad"];
		$aciklama  	   =$_POST["aciklama"];
		$fiyat  	   =$_POST["fiyat"];
		$resim  	   =$_POST["resim"];
		$stok  	   =$_POST["stok"];
		$avantaj  	   =$_POST["avantaj"];
		$kat  	   =$_POST["kat"];
              $urunguncelle=$vt->prepare("update urun set urunad=?, aciklama=?, fiyat=?, resim=?, stok=?, avantaj=?, kat=? where id=? ");
              $urunguncelle->execute(array($urunad,$aciklama,$fiyat,$resim,$stok,$avantaj,$kat,$id));
              if ($urunguncelle) {
               echo '
			              <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Ürün başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '    <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Ürün düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }else{
        $id     =$_POST["id"];
        $urunad    =$_POST["urunad"];
		$aciklama  	   =$_POST["aciklama"];
		$fiyat  	   =$_POST["fiyat"];
		$resim  	   =$_POST["resim"];
		$stok  	   =$_POST["stok"];
		$avantaj  	   =$_POST["avantaj"];
		$kat  	   =$_POST["kat"];
              $urunguncelle=$vt->prepare("update urun set urunad=?, aciklama=?, fiyat=?, resim=?, stok=?, avantaj=?, kat=? where id=? ");
              $urunguncelle->execute(array($urunad,$aciklama,$fiyat,$resim,$stok,$avantaj,$kat,$id));
              if ($urunguncelle) {
               echo '
			              <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Ürün başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '  <META HTTP-EQUIV="Refresh" content="3;">     <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Ürün düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }
      }
	  
	  
	  
?>
     <form class="needs-validation" action="" method="post" novalidate>
                                          
<input type="hidden"  name="id" value="<?php echo $urunsorgu["id"]; ?>">
     
	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Ürünü Düzenle 			
										
										<a style="float:right;" class="btn btn-danger" href="?id=<?php echo $urunsorgu["id"] ?>&urunsil=ok">
			<font color="white">Ürünü Sil</font>
			</a></h4>

                                        <p class="card-title-desc">
										Mağazada olan ürünü bu alandan düzenleyebilirsiniz</p>
										
			
                                    </div>
                                    <div class="card-body">
                                     <div class="row">
                                                <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Ürün Adı</label>
                             <input type="text" class="form-control" id="validationCustom01" name="urunad" value="<?php echo $urunsorgu["urunad"];?>">
                                                 
                                                    </div>
                                                </div>
												
												
												           <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Ürün Fiyatı</label>
                             <input type="text" class="form-control" id="validationCustom01" name="fiyat" value="<?php echo $urunsorgu["fiyat"];?>">
                                                 
                                                    </div>
                                                </div>
												
												
									<div class="form-group mb-3">
                    <label class="form-label">Avantajlı Ürün</label>
   <select name="avantaj" required class="form-control form-select">
	<option value="<?php echo $urunsorgu["avantaj"];?>">Şuanki durum : <?php echo $urunsorgu["avantaj"];?></option>
																<option value="0">0 - Değer Yok</option>
																<option value="1">1 - Avantajlı Ürün</option>
                                                            </select>
                                                        </div>
												
												
									<div class="form-group mb-3">
                    <label class="form-label">Stok Durumu</label>
   <select name="stok" required class="form-control form-select">
	<option value="<?php echo $urunsorgu["stok"];?>">Şuanki durum : <?php echo $urunsorgu["stok"];?></option>
																<option value="0">0 - Stokta Var</option>
																<option value="1">1 - Stokta Yok</option>
                                                            </select>
                                                        </div>
												
												
															           <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Resim Linki</label>
                             <input type="text" class="form-control" id="validationCustom01" name="resim" value="<?php echo $urunsorgu["resim"];?>">
                                                 
                                                    </div>
                                                </div>
												
												
                                                 <div class="col-md-12">
												 
												 
												 

       <div class="mb-12">
 <label class="form-label" for="default-input">Ürün İçeriği</label>
<textarea class="form-control" type="text" style="height:200px;" name="aciklama" placeholder="Açıklama"><?php echo $urunsorgu["aciklama"];?></textarea>
                                            </div>
											
											
											<br>
											
													
													
									<div class="form-group mb-3">
                    <label class="form-label">Ürün Kategorisi </label>
   <select name="kat" required class="form-control form-select">
	<option value="<?php echo $urunsorgu["kat"];?>">Şuanki durum : <?php echo $urunsorgu["kat"];?></option>
	 <?php $kategori  =$vt->query("select * from kategori Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($kategori as $kategori) {?>
	
																<option value="<? echo $kategori["baglanti"];?>"><? echo $kategori["oyunadi"];?></option>
	 <? } ?>
                                                            </select>
                                                        </div>
                                              
                                                
<button class="btn btn-primary" style="width:100%;" type="submit" name="guncelle">Düzenle</button>
     
												</div>
													
                            
								 
                                            </div>

						    </div>
						
						
						    </div>    </div>    </div>
						
						
                    </div>
                </div>









<?php include 'admin-footer.php'; } ?>
				

