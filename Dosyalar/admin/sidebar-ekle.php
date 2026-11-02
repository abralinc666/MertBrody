<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Sidebar Ekle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Lütfen yeni ekliyeceğiniz sidebar resimi yükleyiniz</h4><br>
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
        $handle->file_new_name_body = 'galeri'.substr(base64_encode(uniqid(true)), 0, 5);
        $handle->allowed = array('image/*');
        $handle->image_text_direction = 'v'; 
        $handle->image_text_color = '#fa6534';
        $handle->image_watermark = "../resim/watermark.png";
        $handle->Process("../resim/");
?>

				
  <form method="POST" class="d-flex flex-column mb-4" action="">
<div class="mb-3 mx-auto position-relative" id="singleImageUploadExample">

</div>

							
<input name="resim" type="hidden" class="form-control" value="<?php echo $siteAdresi . '../resim/'.$handle->file_dst_name.'' ?>"></input>

											
											
											       <div class="mb-4">
                                                <label class="form-label" for="default-input">Yönlendirilecek Sayfa Linki</label>
                                                <input class="form-control" type="text" name="sayfa" id="default-input" placeholder="Örnek; sayfa/valorant/1 , https://sitelink.com/sayfa/valorant/1">
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
		  
		  $sayfa        =$_POST['sayfa'];
          $resim        =$_POST['resim'];

          $ekle= $vt->prepare("insert into sidebar set sayfa=?, resim=?");
          $ekle->execute(array($sayfa,$resim));
          if ($ekle) {
           echo '<META HTTP-EQUIV="Refresh" content="3;"><div class="alert alert-success" style="width:100%;" role="alert">Yeni Sidebar Eklenildi</div>';
          }else{
            header("Location:");
          }
      }
	  ?>
	  
	  





<br>
													
													
													
													
														    <button class="btn btn-primary" style="font-size:11px; width:100%;" name="ekle"  type="submit">
                                    Ekle

                                </button>	 </form>	


<br><br>
													
                            
								 
                                            </div>

						    </div>
						
						
						    </div>    </div>  


<div class="row">




	
	
                        <div class="col-xl-12">
						
						<?php

	  

      if ($_GET["sil"]=="ok") {
        $id=$_GET["id"];
          $sil=$vt->prepare("delete from sidebar where id=?");
          $sil->execute(array($id));
          if ($sil) {
             echo '<META HTTP-EQUIV="Refresh" content="2;sidebar-ekle.php"><div class="alert alert-danger" style="width:100%;" role="alert">Sidebar Başarıyla Silindi</div>';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Sidebar</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Resim</th>
                                                    <th>Bağlantı Linki</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
 <?php $sidebar  =$vt->query("select * from sidebar Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($sidebar as $sidebar) {?>
	
	
                                                <tr>
                                                    <th scope="row"><?php echo $sidebar["id"];?></th>
                                                    <td><img style="height:70px; border-radius:8px;" src="../<?php echo $sidebar["resim"];?>"></td>
                                                    <td><?php echo $sidebar["sayfa"];?></td>
                                                    <td><a style="float:right; font-size:13px;" class="btn btn-danger" href="?id=<?php echo $sidebar["id"] ?>&sil=ok">
			<font color="white">Sil</font>
			</a></td>
                                                </tr>
												
												<?php } ?>
												
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                
                            </div>
           
                        </div>
						
						
						
						
						

							</div>
						
						
                    </div>
                </div>









 <?php include 'admin-footer.php'; } ?>
				

