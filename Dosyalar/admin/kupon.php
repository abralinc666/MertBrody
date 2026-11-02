<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Kupon Oluştur</h4>


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




											
											     
														
														
											
											

	       <div class="mb-4">
                                                <label class="form-label" for="default-input">Kupon Miktarı</label>
                                                <input class="form-control" type="text" name="bakiye_miktari" id="default-input" placeholder="Kupon Miktarı">
                                            </div>



	       <div class="mb-4">
                                                <label class="form-label" for="default-input">Kod</label>
                                                <input class="form-control" type="text" name="kod" id="default-input" placeholder="Kod">
                                            </div>

 
							  
</div>





  <?php 
      if (isset($_POST['ekle'])) {
		  
		  $kod        =$_POST['kod'];
		  $bakiye_miktari        =$_POST['bakiye_miktari'];

          $ekle= $vt->prepare("insert into kupon set kod=?, bakiye_miktari=?");
          $ekle->execute(array($kod,$bakiye_miktari));
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

	  

      if ($_GET["kuponsil"]=="ok") {
        $id=$_GET["id"];
          $kuponsil=$vt->prepare("delete from kupon where id=?");
          $kuponsil->execute(array($id));
          if ($kuponsil) {
             echo '
			  <div class="card-body">
                                        <div class="alert alert-success alert-dismissible alert-label-icon label-arrow fade show" role="alert">
                                            <i class="fa fa-check label-icon"></i><strong>Başarılı</strong> - Kupon silinmiştir
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
                                                    <th>Kupon Kodu</th>
                                                    <th>Bakiye Miktarı</th>
													 <th>Durum</th>
												   <th>Düzenle</th>
                                                </tr>
                                            </thead>
											
											
                                            <tbody>
											
<?php $kupon  = $vt->query("select * from kupon ORDER by id")->fetchAll(PDO::FETCH_ASSOC); foreach ($kupon as $kupon) {  ?>
	
                                                <tr>
                                                    <th scope="row"><?php echo $kupon["id"] ?></th>
                                                    <td><?php echo $kupon["kod"] ?></td>
                                                    <td><?php echo $kupon["bakiye_miktari"] ?></td>
													      <td><?php if ($kupon["durumu"]==1) {echo '<span style="border-radius:6px;  font-size:10px;" class="btn btn-success">Kupon Kullanılmıştır</span>';}

 elseif ($kupon["durumu"]==0) {echo '<span style="border-radius:6px;  font-size:10px;" class="btn btn-info">Kupon Kullanılmadı</span>';} ?></td>
													<td>
					<a href="?id=<?php echo $banka["id"] ?>&kuponsil=ok" style="border-radius:6px;  font-size:10px;" class="btn btn-danger">Sil</a>
						
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
				

