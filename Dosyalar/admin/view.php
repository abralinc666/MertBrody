<?php include 'admin-header.php';$id=$_GET["id"];
$tickett=$vt->query("select * from tickets where id='$id' ")->fetch();
$ticketsor=$vt->query("select * from tickets_replies where ticketid='$id'")->fetchAll(PDO::FETCH_ASSOC);
$userid=$kbilgi["id"];?>
<?php include 'admin-menu.php';?>			



            <div class="main-content">

                <div class="page-content">
                    <div class="container-fluid">

                        <!-- end page title -->


			
						
		  <div class="row">
		  
		  
		  
                        <div class="col-xl-12">
                            <div class="card">
                                <div class="card-header">
                                    <h4 class="card-title">Destek</h4>
                                </div>
                              
<section class="bg-csp2 uk-section uk-section-default">
	<div class="uk-container">



		  <div class="row">
	

						<div class="table-responsive">


			<?php foreach ($ticketsor as $ticketcek) {  ?>
			   <?php if ($ticketcek["userid"]==$userid) {echo '';}else{} ?>							

				  

<table class="table">
<tbody>
<tr>


<td class="bg-font" style="font-size:12px; "><?php if ($ticketcek["userid"]==$userid) {echo ''; echo $kbilgi["username"];}
                     else{
                       $kullaniciID = $ticketcek["userid"];
                       $kullanicibul  = $vt->query("select * from uyeler where id='$kullaniciID' ")->fetch();
                       ?>

   <b><?php echo $kullanicibul["username"]; ?></b><font style="font-size:11px; color:#35aeff;"> <b>[MÜŞTERİ]</b></font> <?php } ?>


<font style="font-size:11px;">: <?php echo $ticketcek["comment"]; ?></font>


</td>


</tr>
</tbody>
</table>


 <?php } ?>
</div>
								</div>
							</div>
				
   
            <div class="card-body">
                <div class="tab-content" id="myTabContent">
                    <div class="tab-pane fade show active" id="generalUpdate" role="tabpanel" aria-labelledby="general_tab">
						<form action="" method="post">
		
                      
<?php



      if (isset($_POST["ticketcevapver"])) {
        $id=$_POST["tic"];
        $uid=$_POST["uid"];
        $message=$_POST["message"];
        $active=1;
        $date=date("d.m.Y h:i");
          $ticketcevapver = $vt-> prepare("insert into tickets_replies set ticketid=?, userid=?, comment=?, date=?");
          $ticketcevapver -> execute(array($id,$uid,$message,$date));
            if ($ticketcevapver) {
                $ticketguncelle = $vt->query("update tickets set active='$active' where id='$id' ");
            echo '<META HTTP-EQUIV="Refresh" content="1;"><div class="alert alert-success" style="width:100%;" role="alert">Yeni mesaj gönderildi</div>';
            }else{
              header("Location:../ticket.php?id=$id&drm=no");
            }
      }
	  
	  
	  ?>
				      <input type="hidden" name="tic" value="<?php echo $id ?>">
                       <input type="hidden" name="uid" value="<?php echo $userid ?>">
                            

					
                            <div class="form-group">
                                <label>Yeni Mesajınız</label>
                                <div class="input-group input-group-merge">
                                    <textarea type="text" class="bg-input bg-font form-control" required name="message"></textarea>
                                </div>
                            </div>

<br>
                          
                            <div class="d-flex justify-content-start align-items-center">
                               <button type="submit" name="ticketcevapver" style="width:100%; font-size:10px;" class="btn btn-primary">Mesajı Gönder</button>
                            </div>
                        </form>
                    </div>
					
					
				
 
                   
                </div>
            </div>
      								   
	      </div>
	    </div>
	  </main>
	  
	  
	  






    
            </div>
        </section>
		
                            </div>
                        </div>




				      </div>
		
						
						
						
						
						
						
                    </div>
                </div>









<?php include 'admin-footer.php';  ?>
				

