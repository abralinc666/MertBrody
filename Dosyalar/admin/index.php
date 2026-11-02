<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Anasayfa</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->

                        <div class="row">
                           
					<?php
 $uye= $vt->query("select * from uyeler");
 $uye = $uye->rowCount();
 
  $musteri= $vt->query("select * from satilanurunler");
 $musteri = $musteri->rowCount();
 
  
  $urunler= $vt->query("select * from urun");
 $urunler = $urunler->rowCount();
 
 
  $yorumlar= $vt->query("select * from yorumlar");
 $yorumlar = $yorumlar->rowCount();
 



 ?>

						   <div class="col-xl-3 col-md-6">
                                <div class="card card-h-100">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <span class="text-muted mb-5 lh-1 d-block text-truncate">Toplam Kullanıcı</span>
                                                <h4 class="mb-3">
                                                   <?php  echo $uye; ?>  Adet
                                                </h4>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
        
                           						   <div class="col-xl-3 col-md-6">
                                <div class="card card-h-100">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <span class="text-muted mb-5 lh-1 d-block text-truncate">Toplam Sipariş</span>

                                                <h4 class="mb-3">
                                                  <?php  echo $musteri; ?>  Adet
                                                </h4>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
        
                                                       						   <div class="col-xl-3 col-md-6">
                                <div class="card card-h-100">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <span class="text-muted mb-5 lh-1 d-block text-truncate">Toplam Ürün</span>
                                                <h4 class="mb-3">
                                                  <?php  echo $urunler; ?> Adet
                                                </h4>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>
							
							
							
        
                                                      						   <div class="col-xl-3 col-md-6">
                                <div class="card card-h-100">
                                    <div class="card-body">
                                        <div class="row align-items-center">
                                            <div class="col-6">
                                                <span class="text-muted mb-5 lh-1 d-block text-truncate">Toplam Yorumlar</span>
                                                <h4 class="mb-3">
                                                  <?php  echo $yorumlar; ?> Yorum
                                                </h4>
                                            </div>
                                        </div> 
                                    </div>
                                </div>
                            </div>

							
                        </div><!-- end row-->

                      




						
						
						
		  <div class="row">
		  
		  
		  
		  
		  






		  
		  
                        <div class="col-xl-6">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Son 10 Kullanıcı</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Adı Soyadı</th>
                                                    <th>E-Mail Adresi</th>
                                                    <th>Kredisi</th>
													<th>Düzenle</th>
                                                </tr>
                                            </thead>
											
											
                                            <tbody>
											
<?php $uye  = $vt->query("select * from uyeler ORDER by id DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC); foreach ($uye as $uye) {  ?>
	
                                                <tr>
                                                    <th scope="row"><?php echo $uye["id"] ?></th>
                                                    <td><?php echo $uye["username"] ?></td>
                                                    <td><?php echo $uye["email"] ?></td>
                                                    <td><?php echo $uye["bakiye"] ?> TL</td>
													<td>
	<a href="kullanici-duzenle.php?id=<?php echo $uye["id"] ?>" style="border-radius:6px;  font-size:10px;" class="btn btn-info">Düzenle</a>
													</td>
                                                </tr>
												
								

  <script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>





<?php } ?>

                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>





					            <div class="col-xl-6">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Son 10 Kredi Yüklemeleri									<a href="https://www.shopier.com/m/orders.php" target="_blank"><span style="border-radius:6px; float:right; font-size:10px;" class="btn btn-info">SANAL POST</span> </a>									</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
   
                                                    <th>Yükleyen</th>
                                                    <th>Miktarı</th>
                                                    <th> </th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
											 
 
	<?php $shopierOrder  = $vt->query("select * from shopierOrder Order By id DESC LIMIT 10")->fetchAll(PDO::FETCH_ASSOC); foreach ($shopierOrder as $shopierOrder) {  ?>
	
	<?php 		  if ($shopierOrder["user_id"]==$user_id) {}
                     else{
                       $kullaniciID = $shopierOrder["user_id"];
                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
					 }
					 ?>
					 
                                                <tr>
                                                    <td><?php echo $kullanicibul["username"]; ?></td>
                                                    <td> <?php echo $shopierOrder["amount"];?> TL </td>
                                                    <td><?php if ($shopierOrder["status"]==1) {echo '<span style="border-radius:6px;  font-size:10px;" class="btn btn-success">Yükleme Başarılı</span>';}

 elseif ($shopierOrder["status"]==0) {echo '<span style="border-radius:6px;  font-size:10px;" class="btn btn-info">Kredi Yüklenmedi</span>';} ?></td>
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
				

