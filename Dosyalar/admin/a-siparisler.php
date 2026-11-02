<?php include 'admin-header.php'; if($kbilgi["yetki"] == 2){ ?>
<?php include 'admin-menu.php';?>			

				
	<script src="https://cdn.jsdelivr.net/npm/sweetalert2@9"></script>



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- start page title -->
                        <div class="row">
                            <div class="col-12">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0 font-size-18">Satılan Ürünler</h4>


                                </div>
                            </div>
                        </div>
                        <!-- end page title -->


 


<div class="row">




	
	
                        <div class="col-xl-12">
						
						<?php

	  

      if ($_GET["sipsil"]=="ok") {
        $id=$_GET["id"];
          $sipsil=$vt->prepare("delete from satilanurunler where id=?");
          $sipsil->execute(array($id));
          if ($sipsil) {
             echo '<META HTTP-EQUIV="Refresh" content="2;a-siparisler.php"><div class="alert alert-danger" style="width:100%;" role="alert">Sipariş Başarıyla Silindi</div>';
          }else{
            header("Location:no");
          }
      }
	  
	  ?>
	  
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Satılan Ürünler</h4>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table mb-0">

                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Satın Alan</th>
                                                    <th>Ödediği Miktar</th>
													<th>Tarih</th>
													<th>Aldığı ürün</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
											
 <?php $satilanurunler  =$vt->query("select * from satilanurunler Order By id DESC")->fetchAll(PDO::FETCH_ASSOC); foreach ($satilanurunler as $satilanurunler) {?>
	
	
                                                <tr>
                                                    <th scope="row"><?php echo $satilanurunler["id"];?></th>
                                                    <td><?php echo $satilanurunler["satinalan2"];?></td>
                                                    <td><?php echo $satilanurunler["fiyat"];?></td>
													 <td><?php echo $satilanurunler["date"];?></td>
													<td><?php echo $satilanurunler["urunad"];?></td>
                                                    <td>
			<span style="float:right;">	

	
				<a onclick="fireSweetizin<?php echo $satilanurunler["id"] ?>()" class="btn btn-info">Siparişi Düzenle</a>
				<a onclick="fireSweetDegerlendirme<?php echo $satilanurunler["id"] ?>()" class="btn btn-success">Değerlendirmesi</a>


<a style=" font-size:13px;" class="btn btn-danger" href="?id=<?php echo $satilanurunler["id"] ?>&sipsil=ok">
			<font color="white">Sil</font>
			</a>
			
			</span>
			</td>
                                                </tr>
										


				
								    <script>

    function fireSweetizin<?php echo $satilanurunler["id"] ?>() {
        Swal.fire(
            '<img style="height:140px; border-radius:10px;" src="../<?php echo $satilanurunler["kapak"] ?>"><br>',
            '<?php $id=$_GET["id"];$uyesorgu=$vt->query("select * from satilanurunler where id='$id' ")->fetch();?><?php


      if (isset($_POST["guncelle"])) {
        if ($_POST["uyepass"]=="") {
        $id     =$_POST["id"];
		$fiyat  	 =$_POST["fiyat"];
		$urunad  	 =$_POST["urunad"];
		$epin  	 =$_POST["epin"];
		$durum  	 =$_POST["durum"];
              $uyeguncel=$vt->prepare("update satilanurunler set fiyat=?, urunad=?, epin=?, durum=? where id=? ");
              $uyeguncel->execute(array($fiyat,$urunad,$epin,$durum,$id));
              if ($uyeguncel) {
               echo '<META HTTP-EQUIV="Refresh" content="0;">   
			   ';
              }else{
               echo '<META HTTP-EQUIV="Refresh" content="0;">';
              }
        }else{
        $id     =$_POST["id"];
		$fiyat  	 =$_POST["fiyat"];
		$urunad  	 =$_POST["urunad"];
		$epin  	 =$_POST["epin"];
		$durum  	 =$_POST["durum"];
              $uyeguncel=$vt->prepare("update satilanurunler set fiyat=?, urunad=?, epin=?, durum=? where id=? ");
              $uyeguncel->execute(array($fiyat,$urunad,$epin,$durum,$id));
              if ($uyeguncel) {
               echo '
			             
			   ';
              }else{
               echo '<META HTTP-EQUIV="Refresh" content="0;">';
              }
        }
      }
	  
	  
	  
?><b><?php echo $satilanurunler["urunad"] ?></b><br><br><form class="needs-validation" action="" method="post" novalidate><input type="hidden"  name="id" value="<?php echo $satilanurunler["id"]; ?>"><br><font style="float:left; font-size:11px;"><i class="fa fa-user"></i> Ürün Adı</font><br><input class="form-control" value="<?php echo $satilanurunler["urunad"];?>" name="urunad" type="text"><br><font style="float:left; font-size:11px;"><i class="fa fa-envelope"></i> Ödenen Miktar</font><br><input class="form-control" value="<?php echo $satilanurunler["fiyat"];?>" name="fiyat" type="text"><br><font style="float:left; font-size:11px;"><i class="fa fa-key"></i> EPİN Kodu</font><br><input class="form-control" value="<?php echo $satilanurunler["epin"];?>" name="epin" type="text"><br><font style="float:left; font-size:11px;"><i class="fa fa-lock"></i> Ürün Durumu (0-Aktif Değil) - (1-Ürün Aktif)</font><br><input class="form-control" value="1" name="durum" type="text"><br><button class="btn btn-primary" style="width:100%;" type="submit" name="guncelle">Kaydet</button>',
            ''
        )
    }

  </script>
  
  
  
  
  
   <script>

    function fireSweetDegerlendirme<?php echo $satilanurunler["id"] ?>() {
        Swal.fire(
            '<img style="height:140px; border-radius:10px;" src="../<?php echo $satilanurunler["kapak"] ?>"><br>',
            '<?php $id=$_GET["id"];$uyesorgu=$vt->query("select * from satilanurunler where id='$id' ")->fetch();?><?php


      if (isset($_POST["deger"])) {
        if ($_POST["uyepass"]=="") {
        $id     =$_POST["id"];
		$degerlendirme  	 =$_POST["degerlendirme"];
              $uyeguncel=$vt->prepare("update satilanurunler set degerlendirme=? where id=? ");
              $uyeguncel->execute(array($degerlendirme,$id));
              if ($uyeguncel) {
               echo '<META HTTP-EQUIV="Refresh" content="0;">   
			   ';
              }else{
               echo '<META HTTP-EQUIV="Refresh" content="0;">';
              }
        }else{
        $id     =$_POST["id"];
		$degerlendirme  	 =$_POST["degerlendirme"];
              $uyeguncel=$vt->prepare("update satilanurunler set degerlendirme=? where id=? ");
              $uyeguncel->execute(array($degerlendirme,$id));
              if ($uyeguncel) {
               echo '
			             
			   ';
              }else{
               echo '<META HTTP-EQUIV="Refresh" content="0;">';
              }
        }
      }
	  
	  
	  
?><b><?php echo $satilanurunler["urunad"] ?></b><br><br><form class="needs-validation" action="" method="post" novalidate><input type="hidden"  name="id" value="<?php echo $satilanurunler["id"]; ?>"><br><font style="float:left; font-size:11px;"><i class="fa fa-user"></i> Değerlendirmesi</font><br><textarea class="form-control" value="" name="degerlendirme" type="text"><?php echo $satilanurunler["degerlendirme"];?></textarea><br><button class="btn btn-primary" style="width:100%;" type="submit" name="deger">Kaydet</button>',
            ''
        )
    }

  </script>


  
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
				

