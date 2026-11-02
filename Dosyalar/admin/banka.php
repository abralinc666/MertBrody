<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Banka Hesabı Ekle</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


	  
	  

 <div class="row">
                            <div class="col-xl-12">
                                <div class="card">

                                    <div class="card-body">
                                    
                                            <div class="row">





				
  <form method="POST" class="d-flex flex-column mb-4" action="">




											
											        <div class="form-group mb-3">
                                                            <label class="form-label">Banka Seçin</label>
                                                            <select name="bank" required class="form-control form-select">
<option value="resim/akbank.png">Akbank</option>
<option value="resim/ziraat-bankasi.png.png">Zıraat Bankası</option>
<option value="resim/yapikredi.png">YapıKredi</option>
<option value="resim/halkbank.png">Halk Bank</option>
<option value="resim/garantibankasi.png">Garanti Bank</option>
<option value="resim/isbankasi.png">İŞ Bankası</option>
<option value="resim/denizbank.png">Deniz Bank</option>
<option value="resim/vakifbank.png">Vakif Bank</option>
<option value="resim/qnb-finansbank.png">QNB Finans Bank</option>
<option value="resim/kuveyturk.png">KuveyTurk</option>
<option value="resim/pttbank.png">PTT Bank</option>
<option value="resim/paparabank.png">Papara</option>
                                                            </select>
                                                        </div>
														
														
														
											
											
											       <div class="mb-4">
                                                <label class="form-label" for="default-input">Banka Görünümü (Varsayılan 0)</label>
                                                <input class="form-control" type="text" name="gorunum" id="default-input" value="0">
                                            </div>

	
			
											       <div class="mb-4">
                                                <label class="form-label" for="default-input">Hesap Sahibi</label>
                                                <input class="form-control" type="text" name="hesapsahibi" id="default-input" placeholder="Hesap Sahibi">
                                            </div>

	       <div class="mb-4">
                                                <label class="form-label" for="default-input">Şube</label>
                                                <input class="form-control" type="text" name="sube" id="default-input" placeholder="Şube">
                                            </div>



	       <div class="mb-4">
                                                <label class="form-label" for="default-input">Hesap No</label>
                                                <input class="form-control" type="text" name="hesapno" id="default-input" placeholder="Hesap No">
                                            </div>



	       <div class="mb-4">
                                                <label class="form-label" for="default-input">İBAN</label>
                                                <input class="form-control" type="text" name="iban" id="default-input" placeholder="İBAN">
                                            </div>

 
							  
</div>





  <?php 
      if (isset($_POST['ekle'])) {
		  
		  $bank        =$_POST['bank'];
		  $gorunum        =$_POST['gorunum'];
          $hesapsahibi        =$_POST['hesapsahibi'];
		  $sube        =$_POST['sube'];
		  $hesapno        =$_POST['hesapno'];
          $iban        =$_POST['iban'];

          $ekle= $vt->prepare("insert into banka set bank=?, gorunum=?, hesapsahibi=?, sube=?, hesapno=?, iban=?");
          $ekle->execute(array($bank,$gorunum,$hesapsahibi,$sube,$hesapno,$iban));
          if ($ekle) {
           echo '<META HTTP-EQUIV="Refresh" content="3;"><div class="alert alert-success" style="width:100%;" role="alert">Yeni Banka Eklenildi</div>';
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


				
				
<?php

	  

      if ($_GET["banksil"]=="ok") {
        $id=$_GET["id"];
          $banksil=$vt->prepare("delete from banka where id=?");
          $banksil->execute(array($id));
          if ($banksil) {
             echo '
			  <div class="card-body">
                                        <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Banka Hesabı silinmiştir
                                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                        </div>
										';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  

	  
						
						
		  <div class="row">
		  
		  
		  
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Kayıtlı Bankalar</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Banka</th>
                                                    <th>Hesap Sahibi</th>
                                                    <th>İBAN</th>
												   <th>Düzenle</th>
                                                </tr>
                                            </thead>
											
											
                                            <tbody>
											
<?php $banka  = $vt->query("select * from banka ORDER by id")->fetchAll(PDO::FETCH_ASSOC); foreach ($banka as $banka) {  ?>
	
                                                <tr>
                                                    <th scope="row"><?php echo $banka["id"] ?></th>
                                                    <td><img src="../<?php echo $banka["bank"] ?>"></td>
                                                    <td><?php echo $banka["hesapsahibi"] ?></td>
                                                    <td><?php echo $banka["iban"] ?></td>
													<td>
						<a href="banka-duzenle.php?id=<?php echo $banka["id"] ?>" style="border-radius:6px;  font-size:10px;" class="btn btn-info">Düzenle</a>
						<a href="?id=<?php echo $banka["id"] ?>&banksil=ok" style="border-radius:6px;  font-size:10px;" class="btn btn-danger">Sil</a>
						
						</td>
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

		
						
                    </div>
                </div>









 <?php include 'admin-footer.php'; } ?>
				

