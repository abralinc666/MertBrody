<?php include 'header.php'; ?>
<?php include 'menu.php'; ?>


<link rel="stylesheet" media="screen" href="epin/urun.css" />



<style>


.b-wrapper{
    display:flex;
    align-items:center;
    min-height: 650px;
    background-color: #212630;
    box-shadow: 0px 3px 10px rgba(0,0,0,.2);
} 
.b-min-height{
    height: 650px;
	width:30%;
    background: #101318;    
}

.b-title{
    padding:100px 0px 0px;
}
.b-title h1{
    color:#fff;
    font-weight:600;
}
.b-title p{
    color: #e7e7e7;
    margin:30px 0px 40px;
}
.b-title button{
    letter-spacing: 0.4px;
    padding: 15px 85px;
    border-radius: 36px;
    border: 1.5px solid #fff;
    background: transparent;
    color: #fff;
    text-transform: uppercase;
}
.b-title button:focus{
    outline:none;
}
.b-form{
    width:60%;
    margin:auto;
}
.b-form-title h1{
    color: #969aa3;

}
.b-form-title i{
    width: 50px;
    height: 50px;
    border: 1px solid #ddd;
    border-radius: 36px;
    line-height: 46px;
    font-size: 20px;
    margin: 13px 5px;
    color:#333;
    cursor:pointer;
}
.b-subtext{
    color: #b4b2b2;
    font-size: 14px;
}
.b-form .form-control{
    font-size:14px;
    height: 50px;
    padding-left: 45px;
    background: #edf9fe;
    border-color: #edf9fe;
    color: #333;
}
.b-form .form-control:focus{
    outline:none;
    box-shadow:none;
} 
.form-group{
    position: relative;
}
.b-font{

    top: 18px;
    left: 18px;
    z-index: 10;
    color: #6b6b6b;
    font-size:13px;
}    
.b-form button{
    letter-spacing: 0.4px;
    padding: 15px 85px;
    border-radius: 36px;
    border: 1.5px solid #fff;
    background: #00bdaa;
    color: #fff;
    text-transform: uppercase;
    margin-top:25px;
}
.b-form button:focus{
    outline:none;
}
.b-form .b-forgot{
    border-bottom: 1px solid #e8e4e4;
    padding-bottom: 10px;
    color: #7e7e7e;
    font-size: 14px;
    font-weight: 600;
    cursor:pointer;
    display:none;
}

</style>


<section class="container">


    <div class="row align-items-center justify-content-center">
        <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 b-height">
            <div style="border-radius:6px;" class="row b-wrapper"> 
			
			
                <div style="border-radius:6px;" class="col-xs-12 col-sm-5 col-md-5 col-lg-5 b-min-height">
           
		   
		  
                 <center>   <br><br>   <br><br> <img style="height:180px;" src="<? echo $sites["site_link"];?>resim/loginresim.png"><br><br>
				 
 <?php if ($kbilgi["yetki"]==1) { ?>	  <br>                         
					   <h1 class="user_title"><? echo $kbilgi["username"];?></h1>

<center>
 <button onclick="window.location='<? echo $sites["site_link"];?>profilim';" style="margin-top:15px;  border:0px; padding:10px; background-color:#e11e29; border-color:#e11e29; color:white; border-radius:5px; font-size:12px; width:50%;" type="button">Profilin</button>
</center>	<? } ?>	

 <?php if ($kbilgi["yetki"]==2) { ?>	<br>                       
					   <h1 class="user_title"><? echo $kbilgi["username"];?></h1>

<center>
 <button onclick="window.location='<? echo $sites["site_link"];?>profilim';" style="margin-top:15px;  border:0px; padding:10px; background-color:#e11e29; border-color:#e11e29; color:white; border-radius:5px; font-size:12px; width:50%;" type="button">Profilin</button>
</center>	<? } ?>	
				 
 <?php if ($kbilgi["yetki"]==0) { ?>	                       
					  <h1 class="user_title"><?php echo $sites["site_baslik"];?></h1>
                        <p class="user_subTitle">Hesabınız Yoksa </br> ücretsiz kayıt oluşturabilirsiniz</p>

<center>
 <button onclick="window.location='<? echo $sites["site_link"];?>uyelik-olustur.php';" style="margin-top:15px;  border:0px; padding:10px; background-color:#e11e29; border-color:#e11e29; color:white; border-radius:5px; font-size:12px; width:50%;" type="button">Kayıt Oluştur</button>
</center>	<? } ?>	

						   
		   </center>
                    
                </div>
                
				
				 	
	
	
					 	
	
					 	
             			  

                    <div class="b-form text-center">
<?php if ($kbilgi["yetki"]==1) { ?>	
   <div class="b-form-title">
                  <center>
<img style="height:140px;" src="<? echo $sites["site_link"];?>resim/logined.png"><br>
<b>Merhaba</b> <?php echo $kbilgi["username"];?><br><font style="font-size:12px;">Şuan giriş yapmış olarak gözüküyorsunuz</font>
</center>
	                          
					   </div>
<? } ?>
<?php if ($kbilgi["yetki"]==2) { ?>	
   <div class="b-form-title">
                  <center>
<img style="height:140px;" src="<? echo $sites["site_link"];?>resim/logined.png"><br>
<b>Merhaba</b> <?php echo $kbilgi["username"];?><br><font style="font-size:12px;">Şuan giriş yapmış olarak gözüküyorsunuz</font>
</center>
	                          
					   </div>
<? } ?>
					   

					<?php if ($kbilgi["yetki"]==0) { ?>	 
                        <div class="b-form-title">
                            <h1 class="form_title">Giriş Yap</h1>
                            <p class="b-subtext">Bilgilerinizi girerek giriş yapabilirsiniz</p>
	                          
					   </div>
				
			
			   <form action="" class="form-horizontal" method="post">
					  		   
					   	               		  
	   <?php
					
					     /* Giriş Yap */
      if (isset($_POST["loginol"])) {
        $email  =$_POST["mail"];
        $pass   =$_POST["pass"];
          $kullanicivarmi= $vt->prepare("select * from uyeler where email=? && pass=?");
          $kullanicivarmi->execute(array($email,$pass));
          $row= $kullanicivarmi->rowCount();
          if ($row>0) {
			  $login = intval($_POST['login']);
if($login ==1){
setcookie("kadipin",$email,time()+86400*30); setcookie("ksifrepin",$pass,time()+86400*30);
}
            $_SESSION["mail"]=$email;
            $_SESSION["pass"]=$pass;
            echo'<META HTTP-EQUIV="Refresh" content="2;URL=index.php"><font style="float:left; background-color:#26c76f; padding:6px;  border-color:#26c76f; border-radius:5px; font-size:12px; width:100%;">Bilgileriniz doğru giriş yapılıyor lütfen bekleyiniz</font><br><br>';
          }else{
           echo'<font style="float:left; background-color:#101318; padding:6px;  border-color:#101318; border-radius:5px; font-size:12px; width:100%;">Bilgileriniz yanlış lütfen tekrar deneyiniz</font><br><br>';
          }
      }
	  
	   ?>

                      
					
					  <input type="hidden" checked value="1" name="login">
					  
                          <input type="text" name="mail" placeholder="E-Mail Adresiniz" value="">
						  
						  <br>
						  
						  <input type="password" name="pass" placeholder="Şifreniz" value="">
                        
							
                            <button type="submit" style="float:left; background-color:#101318; border-color:#101318; border-radius:5px; font-size:12px; width:100%;" name="loginol">Giriş Yap</button>	
						
					
</form><? } ?>
                    </div>
             
		
	

            </div>
        </div>
    </div>
</section>






















<?php include 'footer.php'; ?>