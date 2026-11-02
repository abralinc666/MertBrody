<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>

<?php include 'admin-menu.php';?>			

	

<?php



$id=$_GET["id"];

$bankasorgu=$vt->query("select * from banka where id='$id' ")->fetch();

?>







            <div class="main-content">



                <div class="page-content">

                    <div class="container-fluid">



                        <!-- start page title -->

                        <div class="row">

                            <div class="col-12">

                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">

                                    <h4 class="mb-sm-0 font-size-18">Banka Düzenle</h4>





                                </div>

                            </div>

                        </div>

                        <!-- end page title -->





<?php 



	  

	 

      if ($_GET["bankasil"]=="ok") {

        $id =$_GET["id"];

          $bankasil=$vt->prepare("delete from banka where id=?");

          $bankasil->execute(array($id));

          if ($bankasil) {

               echo '

			            <META HTTP-EQUIV="Refresh" content="3;URL=banka.php"/>  <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">

                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Banka başarıyla silindi

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

        $bank  =$_POST["bank"];

		$hesapsahibi  	 =$_POST["hesapsahibi"];

	    $sube  =$_POST["sube"];

		$hesapno  =$_POST["hesapno"];

		$iban  	 =$_POST["iban"];

              $uyeguncel=$vt->prepare("update banka set bank=?, hesapsahibi=?, sube=?, hesapno=?, iban=? where id=? ");

              $uyeguncel->execute(array($bank,$hesapsahibi,$sube,$hesapno,$iban,$id));

              if ($uyeguncel) {

               echo '

			              <META HTTP-EQUIV="Refresh" content="2;">   <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">

                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Banka başarıyla düzenlendi

                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                                        </div>

			   ';

              }else{

               echo '    <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">

                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Banka düzenlenmedi

                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                                        </div>';

              }

        }else{

        $id     =$_POST["id"];

        $bank  =$_POST["bank"];

		$hesapsahibi  	 =$_POST["hesapsahibi"];

	    $sube  =$_POST["sube"];

		$hesapno  =$_POST["hesapno"];

		$iban  	 =$_POST["iban"];

              $uyeguncel=$vt->prepare("update banka set bank=?, hesapsahibi=?, sube=?, hesapno=?, iban=? where id=? ");

              $uyeguncel->execute(array($bank,$hesapsahibi,$sube,$hesapno,$iban,$id));

              if ($uyeguncel) {

               echo '

			              <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">

                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Banka başarıyla düzenlendi

                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                                        </div>

			   ';

              }else{

               echo '  <META HTTP-EQUIV="Refresh" content="3;">     <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">

                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Banka düzenlenmedi

                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>

                                        </div>';

              }

        }

      }

	  

	  

	  

?>

     <form class="needs-validation" action="" method="post" novalidate>

                                          

<input type="hidden"  name="id" value="<?php echo $bankasorgu["id"]; ?>">

     

	  

	  



 <div class="row">

                            <div class="col-xl-12">

                                <div class="card">

                                    <div class="card-header">

                                        <h4 class="card-title">Banka Düzenle 			

										

										<a style="float:right;" class="btn btn-danger" href="?id=<?php echo $bankasorgu["id"] ?>&bankasil=ok">

			<font color="white">Kayıt Sil</font>

			</a></h4>



                                        <p class="card-title-desc">

										Banka bilgilerini düzenleyebilirsiniz</p>

										

			

                                    </div>

                                    <div class="card-body">

                                     <div class="row">

                                                <div class="col-md-12">

                                                    <div class="mb-3">

                                                        <label class="form-label" for="validationCustom01">Seçili Banka</label>

                             <input type="text" class="form-control" id="validationCustom01" name="bank" value="<?php echo $bankasorgu["bank"];?>">

                                                 

                                                    </div>

                                                </div>

                                                 <div class="col-md-12">

												 

                                                       

                                                    <div class="mb-3">

                                                        <label class="form-label" for="validationCustom01">Hesap Sahibi</label>

                             <input type="text" class="form-control" id="validationCustom01" name="hesapsahibi" value="<?php echo $bankasorgu["hesapsahibi"];?>">

                                                 

                                                    </div>

                                              

											  

											  

											     <div class="mb-3">

                                                        <label class="form-label" for="validationCustom01">Şube</label>

                             <input type="text" class="form-control" id="validationCustom01" name="sube" value="<?php echo $bankasorgu["sube"];?>">

                                                 

                                                    </div>

                                                

												

												

															  

											     <div class="mb-3">

                                                        <label class="form-label" for="validationCustom01">Hesap No</label>

                             <input type="text" class="form-control" id="validationCustom01" name="hesapno" value="<?php echo $bankasorgu["hesapno"];?>">

                                                 

                                                    </div>

												

											
								  

											     <div class="mb-3">

                                                        <label class="form-label" for="validationCustom01">İBAN</label>

                             <input type="text" class="form-control" id="validationCustom01" name="iban" value="<?php echo $bankasorgu["iban"];?>">

                                                 

                                                    </div>											

											

  <div class="col-md-12">
<button class="btn btn-primary" style="width:100%;" type="submit" name="guncelle">Düzenle</button>
												</div>

													

                            

								 

                                            </div>



						    </div>

						

						

						    </div>    </div>    </div>

						

						

                    </div>

                </div>



















<?php include 'admin-footer.php'; } ?>

				



