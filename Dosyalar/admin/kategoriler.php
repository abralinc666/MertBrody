<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Kategoriler</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


	  


<div class="row">




	
	
                        <div class="col-xl-12">
						
						<?php

	  

      if ($_GET["katsil"]=="ok") {
        $id=$_GET["id"];
          $katsil=$vt->prepare("delete from kategori where id=?");
          $katsil->execute(array($id));
          if ($katsil) {
             echo '<META HTTP-EQUIV="Refresh" content="2;kategoriler.php"><div class="alert alert-danger" style="width:100%;" role="alert">Kategori Başarıyla Silindi</div>';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Kategoriler</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
													<th>#</th>
                                                    <th>Kategori Adı</th>
													<th>Bağlantı Linki</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
 <?php $kategori  =$vt->query("select * from kategori Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($kategori as $kategori) {?>
	
	
                                                <tr>
                                                    <td><img src="../<?php echo $kategori["resim"];?>" style="border-radius:8px; height:80px;"></td>
													<td><?php echo $kategori["oyunadi"];?></td>
													<td><?php echo $kategori["baglanti"];?></td>
                                                    <td><a style="float:right; font-size:13px;" class="btn btn-danger" href="?id=<?php echo $kategori["id"] ?>&katsil=ok">
			<font color="white">Sil</font>
			</a></td>
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
				

