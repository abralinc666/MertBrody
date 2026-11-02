<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			
		




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Ürünler</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


 


<div class="row">




	
	
                        <div class="col-xl-12">
						
						<?php

	  

      if ($_GET["urunsil"]=="ok") {
        $id=$_GET["id"];
          $urunsil=$vt->prepare("delete from urun where id=?");
          $urunsil->execute(array($id));
          if ($urunsil) {
             echo '<META HTTP-EQUIV="Refresh" content="2;a-urunler.php"><div class="alert alert-danger" style="width:100%;" role="alert">Ürün Başarıyla Silindi</div>';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Ürünler</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
													<th></th>
                                                    <th>Ürün Adı</th>
													<th>Ürün Fiyatı</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
 <?php $urun  =$vt->query("select * from urun Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($urun as $urun) {?>
	
	
                                                <tr>
                                                    <th scope="row"><?php echo $urun["id"];?></th>
													<td><img style="height:70px; border-radius:8px;" src="../<?php echo $urun["resim"];?>"></td>
                                                    <td><?php echo $urun["urunad"];?></td>
													  <td><?php echo $urun["fiyat"];?></td>
                                                    <td>
			<span style="float:right;">	

<a style=" font-size:13px;" class="btn btn-info" href="urun-duzenle.php?id=<?php echo $urun["id"] ?>">
			<font color="white">Düzenle</font>
			</a>
			
<a style=" font-size:13px;" class="btn btn-danger" href="?id=<?php echo $urun["id"] ?>&urunsil=ok">
			<font color="white">Sil</font>
			</a>
			
			</span>
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
				

