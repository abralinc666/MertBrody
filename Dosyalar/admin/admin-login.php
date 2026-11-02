<?php
 include '../baglan.php' ;
?>

<!doctype html>
<html lang="tr">

    <head>
        <meta charset="utf-8" />
        <title>Kontrol Paneli</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link href="../epin/admin/vs.css" rel="stylesheet" type="text/css" />
        <link rel="stylesheet" href="../epin/admin/pre.css" type="text/css" />
        <link href="../epin/admin/bootstrap.css" id="bootstrap-style" rel="stylesheet" type="text/css" />
        <link href="../epin/admin/icon.css" rel="stylesheet" type="text/css" />
		<link href="../epin/admin/all.css" rel="stylesheet" type="text/css" />
        <link href="../epin/admin/app.css" id="app-style" rel="stylesheet" type="text/css" />
		<link href="../epin/admin/font-awesome-4.1.0/css/font-awesome.min.css" rel="stylesheet" type="text/css">
    </head>











 <body>

    <!-- <body data-layout="horizontal"> -->
        <div class="auth-page">
            <div class="container-fluid p-0">
                <div class="row g-0">
                    <div class="col-xxl-3 col-lg-4 col-md-5">
                        <div class="auth-full-page-content d-flex p-sm-5 p-4">
                            <div class="w-100">
                                <div class="d-flex flex-column h-100">
                              
                                    <div class="auth-content my-auto">
                                   <div class="mb-4 mb-md-5 text-center">
                                   <img src="../resim/logosiyah.png" alt="" height="58">
                                     
                                    </div>
									
									
										   <?php
					
					     /* Giriş Yap */
      if (isset($_POST["loginol"])) {
        $email  =$_POST["mail"];
        $pass   =$_POST["pass"];
          $kullanicivarmi= $vt->prepare("select * from uyeler where email=? && pass=?");
          $kullanicivarmi->execute(array($email,$pass));
          $row= $kullanicivarmi->rowCount();
          if ($row>0) {
            $_SESSION["mail"]=$email;
            $_SESSION["pass"]=$pass;
            echo'<META HTTP-EQUIV="Refresh" content="2;URL=index.php">
<button type="button" style="border:0px; padding:6px; border-radius:6px; background-color:#31b577; color:white; font-size:14px; width:100%;">Bilgileriniz doğru giriş yapılıyor</button><br><br>';
          }else{
           echo'<button type="button" style="border:0px; padding:6px; border-radius:6px; color:white; background-color:orange; font-size:14px; width:100%;">Bilgiler yanlış tekrar deneyiniz</button><br><br>';
          }
      }
	  
	   ?>   
	   
	   
	   
                                        <form action="" class="form-horizontal" method="post">
                                            <div class="mb-3">
                                                <label class="form-label">E-Mail Adresiniz</label>
                                                <input type="text" class="form-control" name="mail" placeholder="E-Mail Adresiniz">
                                            </div>
                                            <div class="mb-3">
                                                <div class="d-flex align-items-start">
                                                    <div class="flex-grow-1">
                                                        <label class="form-label">Şifreniz</label>
                                                    </div>
                                                   
                                                </div>
                                                
                                                <div class="input-group auth-pass-inputgroup">
                                                    <input type="password" class="form-control" name="pass" placeholder="Şifreniz">
                                               </div>
                                            </div>
                                            <div class="row mb-4">
                                        
                                                
                                            </div>
                                            <div class="mb-3">
                                                <button class="btn btn-primary w-100 waves-effect waves-light" name="loginol" type="submit">Giriş Yap</button>
                                            </div>
                                        </form>

                                       <br><br><br>
                               
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                        <!-- end auth full page content -->
                    </div>
                    <!-- end col -->
                    <div class="col-xxl-9 col-lg-8 col-md-7">
                        <div class="auth-bg pt-md-5 p-4 d-flex">
                            <div class="bg-overlay bg-primary"></div>
                            <ul class="bg-bubbles">
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                                <li></li>
                            </ul>
                            <!-- end bubble effect -->
                            <div class="row justify-content-center align-items-center">
                                <div class="col-xl-12">
                                
                                   <center><font style="font-size:19px; color:white;"><b>Web Sitesi - Site Kontrol Paneli</b></font><br>
								   
								   <font style="font-size:16px; color:white;">Bu alan sadece Yetkili Personel içindir &nbsp;</font>
								   
								   </center>
                              
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- end col -->
                </div>
                <!-- end row -->
            </div>
            <!-- end container fluid -->
        </div>
		
		
		
        <!-- Right bar overlay-->
        <div class="rightbar-overlay"></div>

        <!-- JAVASCRIPT -->
        <script src="../epin/admin/v.js"></script>
        <script src="../epin/admin/bot.js"></script>
        <script src="../epin/admin/met.js"></script>
        <script src="../epin/admin/simple.js"></script>
        <script src="../epin/admin/waves.js"></script>
        <script src="../epin/admin/feat.js"></script>
        <!-- pace js -->
        <script src="../epin/admin/pace.js"></script>

        <!-- apexcharts -->
        <script src="../epin/admin/apex.js"></script>

        <!-- Plugins js-->
        <script src="../epin/admin/query.js"></script>
        <script src="../epin/admin/qus.js"></script>
        <!-- dashboard init -->
        <script src="../epin/admin/dashboard.js"></script>

        <script src="../epin/admin/app.js"></script>

    </body>

</html>