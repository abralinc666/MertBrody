<?php
if(!isset($_SESSION)){session_start();}
require_once("baglan.php");
$status = $_POST["status"];
$invoiceId = $_POST["platform_order_id"];
$transactionId = $_POST["payment_id"];
$installment = $_POST["installment"];
$signature = $_POST["signature"];

$data = $_POST["random_nr"] . $_POST["platform_order_id"] . $_POST["total_order_value"] . $_POST["currency"];
$signature = base64_decode($signature);
$expected = hash_hmac('SHA256', $data, "9ab030f924d43c5b0be168eaf52d88c1", true);


if ($signature == $expected) {
  $status = strtolower($status);
  if ($status == "success") {
	
	$get_order = $db->query("SELECT * FROM shopierOrder WHERE orderNo = '".$invoiceId."'")->fetch(PDO::FETCH_ASSOC);
	$update_order = $db->query("UPDATE shopierOrder SET status = 1 WHERE orderNo = '".$invoiceId."'");
	$old_balance = $db->query("SELECT id,bakiye FROM uyeler WHERE id = '".$get_order["user_id"]."'")->fetch(PDO::FETCH_ASSOC);
	$old_balance = $old_balance["bakiye"] + $get_order["amount"]; 
	if($db->query("UPDATE uyeler SET bakiye = '{$old_balance}' WHERE id = '".$get_order["user_id"]."'"))
		echo '<script>alert("Kredi Yükleme İşleminiz Başarılı. Lütfen Tekrar Giriş Yapınız..")</script>
	<meta http-equiv="refresh" content="0;URL=/profilim">
	';
	else
		echo "<script>alert('Yükleme İşlemi Başarısız')</script>";
	
  } else {
    echo "hata";
  }
}
else
	echo "Bad Hash";