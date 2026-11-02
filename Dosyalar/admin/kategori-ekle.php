<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Kategori Ekle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Lütfen yeni ekliyeceğiniz kategoriye resimi yükleyiniz</h4><br>
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
                                                <label class="form-label" for="default-input">Kategori Adı</label>
                                                <input class="form-control" type="text" name="oyunadi" id="default-input" placeholder="Örnek; Valorant">
                                            </div>
											
											
											       <div class="mb-4">
                                                <label class="form-label" for="default-input">Bağlantı Giriniz</label>
                                                <input class="form-control" type="text" name="baglanti" id="default-input" placeholder="Örnek; valorant-vp">
                                            </div>

											
											
	
	
  <script src="https://cdn.tiny.cloud/1/gbipjo8m2j2ja1w27w16bbgcfs8c4mccl3c6y4fqyp8ygte6/tinymce/6/tinymce.min.js" referrerpolicy="origin"></script>

 



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
		  
		  $oyunadi        =$_POST['oyunadi'];
		  $baglanti        =$_POST['baglanti'];
          $resim        =$_POST['resim'];

          $ekle= $vt->prepare("insert into kategori set oyunadi=?, baglanti=?, resim=?");
          $ekle->execute(array($oyunadi,$baglanti,$resim));
          if ($ekle) {
           echo '<META HTTP-EQUIV="Refresh" content="3;"><div class="alert alert-success" style="width:100%;" role="alert">Yeni Kategori Eklenildi</div>';
          }else{
            header("Location:");
          }
      }
	  ?>
	  
	  
  
  <script>
    tinymce.init({
      selector: 'textarea',
      plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage tinycomments tableofcontents footnotes mergetags autocorrect',
      toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
      tinycomments_mode: 'embedded',
      tinycomments_author: 'Author name',
      mergetags_list: [
        { value: 'First.Name', title: 'First Name' },
        { value: 'Email', title: 'Email' },
      ]
    });
  </script>





<br>
													
													
													
													
														    <button class="btn btn-primary" style="font-size:11px; width:100%;" name="ekle"  type="submit">
                                    Ekle

                                </button>	 </form>	


<br><br>
													
                            
								 
                                            </div>

						    </div>
						
						
						    </div>    </div>  


						
						
                    </div>
                </div>









 <?php include 'admin-footer.php'; } ?>
				

