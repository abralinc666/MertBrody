<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>	



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Yeni Ürün Ekle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">ADIM-1 : Lütfen yeni ürün için resimini yükleyiniz</h4><br>
                                        <p class="card-title-desc">
								<form id="file-upload-form" action="" method="post" class="uploader" enctype="multipart/form-data">
	<div class="js-upload uk-placeholder uk-text-center">
    <span uk-icon="icon: cloud-upload"></span>
    <div uk-form-custom>
	 <label for="file-upload" id="file-drag"></label> 
        <input type="file" id="file-upload" name="image" accept="image/*" multiple>
        <span class="uk-link"></span>
    </div><br>
	<br>
	 <button type="submit" value="0" name="uploadF" style="width:100%; font-size:8px;" class="btn btn-info px-5">
           Resmi Yükle
        </button>
</div>


</form> </div>
                                    <div class="card-body">
                                        <form class="needs-validation" action="" method="post" novalidate>
                                            <div class="row">







<?php
$siteAdresi = '';
require 'class.upload.php';
if ( isset( $_POST[ 'uploadF' ] ) ) {
    $handle = new Upload($_FILES['image']);
    if ($handle->uploaded) {
        $handle->file_new_name_body = 'urun'.substr(base64_encode(uniqid(true)), 0, 5);
        $handle->allowed = array('image/*');
        $handle->image_text_direction = 'v'; 
        $handle->image_text_color = '#fa6534';
        $handle->image_watermark = "../resim/watermark.png";
        $handle->Process("../resim/");
?>

				
  <form method="POST" class="d-flex flex-column mb-4" action="">
<div class="mb-3 mx-auto position-relative" id="singleImageUploadExample">

</div>

  <h4 class="card-title">ADIM-2 : Lütfen ürün için gereklı alanları doldurunuz</h4>
								
<input name="resim" type="hidden" class="form-control" value="<?php echo $siteAdresi . '../resim/'.$handle->file_dst_name.'' ?>"></input>


                   <div class="col-md-12">
									<div class="form-group mb-3">
                    <label class="form-label">Ürün Kategorisi </label>
   <select name="kat" required class="form-control form-select">
	 <?php $kategori  =$vt->query("select * from kategori Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($kategori as $kategori) {?>
	
																<option value="<? echo $kategori["baglanti"];?>"><? echo $kategori["oyunadi"];?></option>
	 <? } ?>
                                                            </select>
                                                        </div>
														

       <div class="mb-4">
                                                <label class="form-label" for="default-input">Ürün Başlık</label>
                                                <input class="form-control" type="text" name="urunad" id="default-input" placeholder="Ürün Başlık">
                                            </div>
											

												
									<div class="form-group mb-3">
                    <label class="form-label">Avantajlı Ürün</label>
   <select name="avantaj" required class="form-control form-select">
																<option value="0">0 - Değer Yok</option>
																<option value="1">1 - Avantajlı Ürün</option>
                                                            </select>
                                                        </div>
												
												
									<div class="form-group mb-3">
                    <label class="form-label">Stok Durumu</label>
   <select name="stok" required class="form-control form-select">
																<option value="0">0 - Stokta Var</option>
																<option value="1">1 - Stokta Yok</option>
                                                            </select>
                                                        </div>
														
										

       <div class="mb-4">
                                                <label class="form-label" for="default-input">Ürün Fiyatı</label>
                                                <input class="form-control" type="text" name="fiyat" id="default-input" placeholder="Fiyat">
                                            </div>										
						

       <div class="mb-4">
 <label class="form-label" for="default-input">Ürün İçeriği</label>
<textarea class="form-control" type="text" style="height:200px;" name="aciklama" placeholder="Ürün İçeriği"></textarea>
                                            </div>

 



        <div id="file-upload-form" class="uploader">
            <label for="file-upload" id="file-drag"> <br> <br>
                <img style="height:150px;" id="file-image"
                     src="<?php echo $handle->file_dst_path . $handle->file_dst_name; ?>"
                     alt="Preview" class=""><br><br>
            </label>
        </div>
		



     

<?php
    }else{
        echo '
		<br><br>
		<div class="alert alert-danger" style="width:100%;" role="alert">Resim seçmediğiniz için yüklenilmedi lütfen tekrar deneyiniz</div>';
    }
}
?>



 
							  
</div>





  <?php 
      if (isset($_POST['ekle'])) {
        $urunad        =$_POST['urunad'];
		$aciklama        =$_POST['aciklama'];
		$fiyat        =$_POST['fiyat'];
		$resim        =$_POST['resim'];
		$stok        =$_POST['stok'];
		$kat        =$_POST['kat'];
		$avantaj        =$_POST['avantaj'];
		
          $ekle= $vt->prepare("insert into urun set urunad=?, aciklama=?, fiyat=?, resim=?, stok=?, kat=?, avantaj=?");
          $ekle->execute(array($urunad,$aciklama,$fiyat,$resim,$stok,$kat,$avantaj));
          if ($ekle) {
           echo '<META HTTP-EQUIV="Refresh" content="3;"><div class="alert alert-success" style="width:100%;" role="alert">Ürün Eklenildi</div>';
          }else{
            header("Location:");
          }
      }
	  ?>
	  
	  
  





<br>
													
													
													
													
														    <button class="btn btn-primary" style="font-size:11px; width:100%;" name="ekle"  type="submit">
                                    Ürünü Ekle

                                </button>	 </form>	


<br><br>
													
                            
								 
                                            </div>

						    </div>
						
						
						    </div>    </div>  


						
						
                    </div>
                </div>






 <?php include 'admin-footer.php'; } ?>
				

