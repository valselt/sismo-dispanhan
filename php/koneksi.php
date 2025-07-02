<?php

$dbHost = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "db_dispanhan";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if(!$conn){
    die("Koneksi-nya Gagal dengan kode :".mysqli_connect_error());
}
else{
    echo "Koneksi Lancar Jaya!";
}




