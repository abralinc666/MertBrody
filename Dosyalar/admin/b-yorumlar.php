<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			









            <div class="main-content">



                <div class="page-content">

                    <div class="container-fluid">



                        <!-- start page title -->

                        <div class="row">

                            <div class="col-12">

                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">

                                    <h4 class="mb-sm-0 font-size-18">Yapılan Blog Yorumları</h4>





                                </div>

                            </div>

                        </div>

                        <!-- end page title -->




                      









					
						<?php



	  



      if ($_GET["sil"]=="ok") {

        $id=$_GET["id"];

          $sil=$vt->prepare("delete from blog_yorumlar where id=?");

          $sil->execute(array($id));

          if ($sil) {

             echo '<META HTTP-EQUIV="Refresh" content="2;b-yorumlar.php"><div class="alert alert-danger" style="width:100%;" role="alert">Kayıt Başarıyla Silindi</div>';

          }else{

            header("Location:no");

          }

      }

	  

	  ?>



	

						

						

		  <div class="row">

		  

		  







					            <div class="col-xl-12">

                            <div class="card">


                                <div class="card-body">

                                    <div class="table-responsive">

                                        <table class="table mb-0">



                                            <thead>

                                                <tr>

   

                                                    <th>Yorum</th>

                                                    <th>Değer</th>

                                                    <th> </th>

                                                </tr>

                                            </thead>

                                            <tbody>

											

											 

 

	<?php $yorumlar  = $vt->query("select * from blog_yorumlar Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($yorumlar as $yorumlar) {  ?>


					 

                                                <tr>

                                                    <td><small><b><i class="fa fa-pencil"></i> <?php
		  if ($yorumlar["userid"]==$userid) {echo $kbilgi["username"];}
                     else{
                       $kullaniciID = $yorumlar["userid"];
                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
					 }
					 
					 echo $kullanicibul["username"];
					 
					 ?></b></small>
					 
					 
                      <h6 style="font-size:11px;"><?php echo $yorumlar["comment"] ?></h6></td>

                                                   

                                                    <td>
													
													<a style="border-radius:6px;  font-size:10px;" class="btn btn-danger" href="?id=<?php echo $yorumlar["id"] ?>&sil=ok">

			<font color="white">Sil</font>

			</a>
			
			
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



















<?php include 'admin-footer.php'; } ?>

				



