<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>				




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Siteye Dosya Yükle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


 


<div class="row">




	
	
                        <div class="col-xl-12">

	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Dosya Yükle</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                      
									  
									   
<!--index.php-->
<html>
<body>
   <form name="yukleme" method="post" action="dosya-yukle.php" enctype="multipart/form-data">
     
       
          Dosya Seçiniz:
            <input type="file" name="dosya">
        
    
	<br>	<br>
           <input type="submit" style="width:100%;" name="yukle" value="Yükle">
       
   
   </form>
 
<?php
function turkce($metin){
   $aranan=array("ç","Ç","ğ","Ğ","ı","İ","ö","Ö","ş","Ş","ü","Ü"," ");
   $yerine=array("c","c","g","g","i","i","o","o","s","s","u","u","_");
   return str_replace($aranan,$yerine,$metin);
}
 
if($_POST){
   $gecici_ad=$_FILES["dosya"]["tmp_name"];
   $kalici_yol_ad="../resim/yuklenen/".turkce($_FILES["dosya"]["name"]);
 
   if ($_FILES["dosya"]["error"]) // hata oluştu ise
      echo "<font color='green'>Hata : ",$_FILES["dosya"]["error"],"</font>";
   else{
      if (file_exists($kalici_yol_ad)) // yüklenen dosya upload dizininde varsa
         echo "<font color='red'>Yazdığınız ad ile bir dosya zaten kayıtlıdır.</font>";
      else{
         if (move_uploaded_file($gecici_ad,$kalici_yol_ad)) // eğer dosya kaydedilirse
            echo "<font color='green'>Dosya başarı ile yüklendi.</font>";
         else
             echo "<font color='red'>Dosya yükleme başarısız.</font>";
      }
   }
}
?> <br><br> Yüklenen Dosya : <?php echo $_FILES["dosya"]["name"] ?>
</body>
</html>
									  
									  
									  
                                    </div>
                                </div>
                
                            </div>
           
                        </div>
						
				
						

							</div>
						
						
                    </div>
                </div>









 <?php include 'admin-footer.php'; } ?>
				

