<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php'; $sites  = $vt->query("select * from siteayar")->fetchAll(PDO::FETCH_ASSOC); foreach ($sites as $sites) ?>			




            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Genel Ayarlar</h4>
                                </div>
                            </div>
                        </div>
                        <!-- end page title -->





	  

                        <div class="row">
						
						

  <form method="POST" class="d-flex flex-column mb-4" action="">
  
  
  
                            <div class="col-12">
													
<?php


	  


      if (isset($_POST["siteayar"])) {
        if ($_POST["siteayar"]=="") {
          $site_baslik     =$_POST["site_baslik"];
		  $site_link     =$_POST["site_link"];
		  $site_isimi     =$_POST["site_isimi"];
              $siteayar=$vt->prepare("update siteayar set site_baslik=?, site_link=?, site_isimi=?");
              $siteayar->execute(array($site_baslik,$site_link,$site_isimi));
              if ($siteayar) {
             echo '<META HTTP-EQUIV="Refresh" content="1;"><div class="alert alert-success" style="width:100%;" role="alert">Site Ayarları Düzenlendi</div>';
              }else{
               echo '<META HTTP-EQUIV="Refresh" content="1;">';
              }
        }
      }

?>
                                <div class="card">
                                    <div class="card-header">
                                        <h4 class="card-title">Site Ayarları</h4>
                       
                                    </div>
                 
									
									
									
									
							
                                    <div class="card-body p-4">

                                        <div class="row">
                                            <div class="col-lg-12">
                                                <div>
												
												    <div class="mb-3">
                                                        <label for="example-text-input" class="form-label">Site Başlık</label>
                                                        <input class="form-control" type="text" name="site_baslik" value="<?php echo $sites["site_baslik"]; ?>">
                                                    </div> 
													
													
													
                                                    <div class="mb-3">
                                                        <label for="example-text-input" class="form-label">Site İsimi</label>
                                                        <input class="form-control" type="text" name="site_isimi" value="<?php echo $sites["site_isimi"]; ?>">
                                                    </div> 
													
													
													     <div class="mb-3">
                                                        <label for="example-text-input" class="form-label">Site Link (Lütfen kurulu olan site link sabit kalsın)</label>
                                                        <input class="form-control" type="text" name="site_link" value="<?php echo $sites["site_link"]; ?>">
                                                    </div> 
				
													    
                                                </div>
                                            </div>

                                  
                                        </div>
										
										
 <button class="btn btn-primary" style="font-size:14px; width:100%;" name="siteayar"  type="submit">
               Kaydet

                                </button>
										
                                    </div>
									
									
                                </div>
                            </div>
                        </div>
            
						
						
						
						
						
						
                    </div>
                </div>









<?php include 'admin-footer.php'; } ?>
				

