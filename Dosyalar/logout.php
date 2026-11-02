<?php
include 'baglan.php';
unset($_SESSION["mail"]);
unset($_SESSION["pass"]);
setcookie("kadipin",false);
setcookie("ksifrepin",false);
unset($_COOKIE["kadipin"]);
unset($_COOKIE["ksifrepin"]);header("Location:index.php")
 ?>