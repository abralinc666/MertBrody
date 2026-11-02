<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			
	
<?php

$id=$_GET["id"];
$uyesorgu=$vt->query("select * from uyeler where id='$id' ")->fetch();
?>



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Kullanıcı Düzenle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


<?php 

	  
	 
      if ($_GET["usersil"]=="ok") {
        $id =$_GET["id"];
          $usersil=$vt->prepare("delete from uyeler where id=?");
          $usersil->execute(array($id));
          if ($usersil) {
               echo '
			            <META HTTP-EQUIV="Refresh" content="3;URL=a-uyeler.php"/>  <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Kullanıcı başarıyla silindi
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
        $email  =$_POST["email"];
		$username  	 =$_POST["username"];
	    $pass  =$_POST["pass"];
		$yetki  =$_POST["yetki"];
		$bakiye  	 =$_POST["bakiye"];
              $uyeguncel=$vt->prepare("update uyeler set email=?, username=?, pass=?, yetki=?, bakiye=? where id=? ");
              $uyeguncel->execute(array($email,$username,$pass,$yetki,$bakiye,$id));
              if ($uyeguncel) {
               echo '
			              <META HTTP-EQUIV="Refresh" content="2;">   <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Kullanıcı başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '    <META HTTP-EQUIV="Refresh" content="3;">   <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Kullanıcı düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }else{
        $id     =$_POST["id"];
        $email  =$_POST["email"];
		$username  	 =$_POST["username"];
	    $pass  =$_POST["pass"];
		$yetki  =$_POST["yetki"];
		$bakiye  	 =$_POST["bakiye"];
              $uyeguncel=$vt->prepare("update uyeler set email=?, username=?, pass=?, yetki=?, bakiye=? where id=? ");
              $uyeguncel->execute(array($email,$username,$pass,$yetki,$bakiye,$id));
              if ($uyeguncel) {
               echo '
			              <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Kullanıcı başarıyla düzenlendi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
			   ';
              }else{
               echo '  <META HTTP-EQUIV="Refresh" content="3;">     <div class="alert alert-warning alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-warning label-icon"></i><strong>Uyarı</strong> - Kullanıcı düzenlenmedi
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>';
              }
        }
      }
	  
	  
	  
?>
     <form class="needs-validation" action="" method="post" novalidate>
                                          
<input type="hidden"  name="id" value="<?php echo $uyesorgu["id"]; ?>">
     
	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Kullanıcı Düzenle 			
										
										<a style="float:right;" class="btn btn-danger" href="?id=<?php echo $uyesorgu["id"] ?>&usersil=ok">
			<font color="white">Kayıdı Sil</font>
			</a></h4>

                                        <p class="card-title-desc">
										Kullanıcı bilgilerini düzenleyebilirsiniz</p>
										
			
                                    </div>
                                    <div class="card-body">
                                     <div class="row">
                                                <div class="col-md-12">
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Adı Soyadı</label>
                             <input type="text" class="form-control" id="validationCustom01" name="username" value="<?php echo $uyesorgu["username"];?>">
                                                 
                                                    </div>
                                                </div>
                                                 <div class="col-md-12">
												 
                                                       
                                                    <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Mail Adresi</label>
                             <input type="text" class="form-control" id="validationCustom01" name="email" value="<?php echo $uyesorgu["email"];?>">
                                                 
                                                    </div>
                                              
											  
											  
											     <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Kullanıcı Şifresi</label>
                             <input type="text" class="form-control" id="validationCustom01" name="pass" value="<?php echo $uyesorgu["pass"];?>">
                                                 
                                                    </div>
                                                
												
												
															  
											     <div class="mb-3">
                                                        <label class="form-label" for="validationCustom01">Hesap Kredisi</label>
                             <input type="text" class="form-control" id="validationCustom01" name="bakiye" value="<?php echo $uyesorgu["bakiye"];?>">
                                                 
                                                    </div>
												
												
											
  <div class="col-md-12">
                                                        <div class="form-group mb-3">
                                                            <label class="form-label">Site Yetkisi</label>
                                                            <select name="yetki" required class="form-control form-select">
															<option value="<?php echo $uyesorgu["yetki"];?>">Seçili Olan <?php echo $uyesorgu["yetki"];?></option>
																<option value="2">2 Site Yetkilisi</option>
																<option value="1">1 Normal Kullanıcı</option>
																<option value="0">0 Giriş Yasaklı</option>
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
				

