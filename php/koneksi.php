<?php

// Di Docker Compose, 'db' adalah nama host untuk layanan database MySQL
$dbHost = "db"; // <-- UBAH DARI "localhost" MENJADI "db"
$dbUser = "admin-dispanhan"; // <-- SESUAIKAN DENGAN MYSQL_USER di docker-compose.yml
$dbPass = "admin12345"; // <-- SESUAIKAN DENGAN MYSQL_PASSWORD di docker-compose.yml
$dbName = "db_dispanhan";

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    die("Koneksi-nya Gagal dengan kode :" . $conn->connect_error);
}
// Hapus baris echo "Koneksi Lancar Jaya!" jika masih ada.
?>