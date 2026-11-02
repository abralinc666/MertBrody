<?php

if(!defined("include"))

$dbhost = "localhost";
$dbuser = "izmoxcom_epin2";
$dbpass = "izmoxcom_epin2";
$dbdata = "izmoxcom_epin2";



try {
  $vt= new PDO("mysql:host=$dbhost;dbname=$dbdata;charset=utf8","$dbuser","$dbpass");
} catch (PDOException $e) {
  echo $e->getMessage();
}

date_default_timezone_set('Europe/Istanbul');
session_start();


try {
	$db = new PDO("mysql:host=$dbhost;dbname=$dbdata", "$dbuser", "$dbpass", array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES \'UTF8\''));	 
} catch ( PDOException $e ){
	print $e->getMessage();
}


$pdo = new PDO("mysql:host=$dbhost;dbname=$dbdata;charset=utf8","$dbuser","$dbpass", [
  PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
  PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
]);

$stmt = $pdo->prepare("SELECT * FROM `urun` WHERE `urunad` LIKE ? OR `fiyat` LIKE ? OR `resim` LIKE ? OR `kat` LIKE ?");
$stmt->execute(["%".$_POST["search"]."%", "%".$_POST["search"]."%", "%".$_POST["search"]."%", "%".$_POST["search"]."%"]);
$results = $stmt->fetchAll();
if (isset($_POST["ajax"])) { echo json_encode($results); }

?>
