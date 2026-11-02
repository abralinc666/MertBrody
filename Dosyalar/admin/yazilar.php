<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			
			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Yazılar</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


 


<div class="row">




	
	
                        <div class="col-xl-12">
						
						<?php

	  

      if ($_GET["blogsil"]=="ok") {
        $id=$_GET["id"];
          $blogsil=$vt->prepare("delete from blog where id=?");
          $blogsil->execute(array($id));
          if ($blogsil) {
             echo '<META HTTP-EQUIV="Refresh" content="2;a-yazilar.php"><div class="alert alert-danger" style="width:100%;" role="alert">Yazı Başarıyla Silindi</div>';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Yazılar</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Başlık</th>
                                                    <th>Tarih</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
 <?php $blog  =$vt->query("select * from blog Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($blog as $blog) {?>
	
	
                                                <tr>
                                                    <th scope="row"><?php echo $blog["id"];?></th>
                                                    <td><?php echo $blog["baslik"];?></td>
                                                    <td><?php echo $blog["date"];?></td>
                                                    <td>
			<span style="float:right;">	

<a style=" font-size:13px;" class="btn btn-info" href="yazi-duzenle.php?id=<?php echo $blog["id"] ?>">
			<font color="white">Düzenle</font>
			</a>
			
<a style=" font-size:13px;" class="btn btn-danger" href="?id=<?php echo $blog["id"] ?>&blogsil=ok">
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
				

