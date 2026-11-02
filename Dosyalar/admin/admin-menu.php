
<!doctype html>
<html lang="tr">

    <head>
        <meta charset="utf-8" />
        <title>Site Kontrol Paneli</title>
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


        <div id="layout-wrapper">

            
            <header id="page-topbar">
                <div class="navbar-header">
                    <div class="d-flex">
                        <!-- LOGO -->
                        <div class="navbar-brand-box">
                            <a href="" class="logo logo-dark">
                         <br>
                              <center>  <span class="logo-lg">
                                  <b> KONTROL PANELİ</b>
                                </span></center>
                            </a>

                  
                        </div>

                        <button type="button" class="btn btn-sm px-3 font-size-16 header-item" id="vertical-menu-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>
                        </button>

                       
                    </div>
					
                    <div class="d-flex">


     
                        
						
				

                        <div class="dropdown d-inline-block">
                            <button type="button" class="btn header-item bg-soft-light border-start border-end" id="page-header-user-dropdown"
                            data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                         
                                <span class="d-none d-xl-inline-block ms-1 fw-medium"><?php echo $kbilgi["username"];?></span>
                            </button>
                            <div class="dropdown-menu dropdown-menu-end">
                     <a class="dropdown-item" href="../index.php"><i class="font-size-16 align-middle me-1"></i> Siteyi Göster</a>
                                <a class="dropdown-item" href="../logout.php"><i class="font-size-16 align-middle me-1"></i> Çıkış Yap</a>
                            </div>
                        </div>

                    </div>
                </div>
            </header>

            <!-- ========== Left Sidebar Start ========== -->
            <div class="vertical-menu">

                <div data-simplebar class="h-100">

                    <!--- Sidemenu -->
                    <div id="sidebar-menu">
                        <!-- Left Menu Start -->
                        <ul class="metismenu list-unstyled" id="side-menu">
                            <li class="menu-title" data-key="t-menu">Menu</li>

                            <li>
                                <a href="index.php">
                                    <i data-feather="home"></i>
                                    <span data-key="t-dashboard">Anasayfa</span>
                                </a>
                            </li>

                            <li>
                                <a href="javascript: void(0);">
                                    <i data-feather="grid"></i>
                                    <span data-key="t-apps">Blog <span style="float:right;">  <i data-feather="plus"></i></span></span>
                                </a>
                                <ul class="sub-menu" aria-expanded="false">
                                    <li>
                                        <a href="yazi-ekle.php">
                                            <span data-key="t-calendar">Yazı Ekle</span>
                                        </a>
                                    </li>
        
		
                                    <li>
                                        <a href="yazilar.php">
                                            <span data-key="t-chat">Bloglar</span>
                                        </a>
                                    </li>


									
									
                                </ul>
                            </li>
							
							

							
							

                            <li>
                                <a href="javascript: void(0);">
                                    <i data-feather="box"></i>
                                    <span data-key="t-ui-elements">Ürün İşlemleri <span style="float:right;">  <i data-feather="plus"></i></span></span>
                                </a>
                                <ul class="sub-menu" aria-expanded="false">
									<li><a href="a-urunekle.php" data-key="t-lightbox">Ürün Ekle</a></li>
                                    <li><a href="a-urunler.php" data-key="t-range-slider">Ürünler</a></li>
                                </ul>
                            </li>
							

					
							

                            <li>
                                <a href="javascript: void(0);">
                                    <i data-feather="book"></i>
                                    <span data-key="t-ui-elements">Kategori İşlemleri <span style="float:right;">  <i data-feather="plus"></i></span></span>
                                </a>
                                <ul class="sub-menu" aria-expanded="false">
									<li><a href="kategori-ekle.php" data-key="t-lightbox">Kategori Ekle</a></li>
                                    <li><a href="kategoriler.php" data-key="t-range-slider">Kategoriler</a></li>
                                </ul>
                            </li>
							
							
					       <li>
                                <a href="a-siparisler.php">
                                    <i data-feather="tag"></i>
                                    <span data-key="t-horizontal">Siparişler</span>
                                </a>
                            </li>
   
   

     <li>
                                <a href="a-uyeler.php">
                                    <i data-feather="user"></i>
                                    <span data-key="t-horizontal">Kullanıcı Listesi</span>
                                </a>
                            </li>
							
	
			
     <li>
                                <a href="destek.php">
                                    <i data-feather="edit"></i>
                                    <span data-key="t-horizontal">Destek Talep</span>
                                </a>
                            </li>
							
							
			
     <li>
                                <a href="bildirimler.php">
                                    <i data-feather="bell"></i>
                                    <span data-key="t-horizontal">Ödeme Bildirimleri</span>
                                </a>
                            </li>
							

							

						   
						         <li>
                                <a href="a-ayarlar.php">
                                    <i data-feather="settings"></i>
                                    <span data-key="t-horizontal">Genel Ayarlar</span>
                                </a>
                            </li>	



        <li>
                                <a href="sidebar-ekle.php">
                                    <i data-feather="map"></i>
                                    <span data-key="t-horizontal">Sidebar Ayarlar</span>
                                </a>
                            </li>	


			

						   
						         <li>
                                <a href="kupon.php">
                                    <i data-feather="key"></i>
                                    <span data-key="t-horizontal">Kupon Oluştur</span>
                                </a>
                            </li>	


							
							
							
							
							     <li>
                                <a href="b-yorumlar.php">
                                    <i data-feather="send"></i>
                                    <span data-key="t-horizontal">Blog Yorumları</span>
                                </a>
                            </li>
							


							       <li>
                                <a href="dosya-yukle.php">
                                    <i data-feather="upload"></i>
                                    <span data-key="t-horizontal">Dosya Yükle</span>
                                </a>
                            </li>
      
	
						   
					           <li>
                                <a href="banka.php">
                                    <i data-feather="list"></i>
                                    <span data-key="t-horizontal">Banka Bilgileri</span>
                                </a>
                            </li>	   
						   
						   
	
							
							
							

           <li>
                                <a href="a-yuklemeler.php">
                                    <i data-feather="circle"></i>
                                    <span data-key="t-horizontal">Yüklemeler</span>
                                </a>
                            </li>
							
                

                          

                        </ul>

                       
                    </div>
                    <!-- Sidebar -->
                </div>
            </div>
            <!-- Left Sidebar End -->
