<?php

$dbHost = "localhost";
$dbUser = "root";
$dbPass = "";
$dbName = "db_dispanhan";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) { // Use connect_error for mysqli object
    die("Koneksi-nya Gagal dengan kode :" . $conn->connect_error);
}
// Remove the echo "Koneksi Lancar Jaya!"; line

?>