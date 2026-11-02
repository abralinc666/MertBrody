<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			









            <div class="main-content">



                <div class="page-content">

                    <div class="container-fluid">



                        <!-- start page title -->

                        <div class="row">

                            <div class="col-12">

                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">

                                    <h4 class="mb-sm-0 font-size-18">Kredi Yüklemeleri</h4>





                                </div>

                            </div>

                        </div>

                        <!-- end page title -->




                      









					
						<?php



	  



      if ($_GET["sil"]=="ok") {

        $id=$_GET["id"];

          $sil=$vt->prepare("delete from shopierOrder where id=?");

          $sil->execute(array($id));

          if ($sil) {

             echo '<META HTTP-EQUIV="Refresh" content="2;a-yuklemeler.php"><div class="alert alert-danger" style="width:100%;" role="alert">Kayıt Başarıyla Silindi</div>';

          }else{

            header("Location:no");

          }

      }

	  

	  ?>



	

						

						

		  <div class="row">

		  

		  







					            <div class="col-xl-12">

                            <div class="card">

                                <div class="card-header">

                                    <h4 class="card-title">Kredi Yüklemeleri</h4>

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

											

											 

 

	<?php $shopierOrder  = $vt->query("select * from shopierOrder Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($shopierOrder as $shopierOrder) {  ?>

	

	<?php 		  if ($shopierOrder["user_id"]==$user_id) {}

                     else{

                       $kullaniciID = $shopierOrder["user_id"];

                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();

					 }

					 ?>

					 

                                                <tr>

                                                    <td><?php echo $kullanicibul["username"]; ?></td>

                                                    <td> <?php echo $shopierOrder["amount"];?> TL </td>

                                                    <td>
													
													<a style="border-radius:6px;  font-size:10px;" class="btn btn-danger" href="?id=<?php echo $shopierOrder["id"] ?>&sil=ok">

			<font color="white">Sil</font>

			</a>
			
			
													<?php if ($shopierOrder["status"]==1) {echo '<span style="border-radius:6px;  font-size:10px;" class="btn btn-success">Yükleme Başarılı</span>';}



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

				



