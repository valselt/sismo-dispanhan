<?php

// Set header ke JSON untuk memberitahu browser bahwa outputnya adalah JSON
header('Content-Type: application/json');

// Mengimpor file koneksi.php
// Variabel yang benar dari file ini adalah $conn
require_once 'koneksi.php';

// Cek apakah koneksi berhasil menggunakan variabel yang benar: $conn
if (!$conn) {
    // Jika koneksi gagal, kirim pesan error dalam format JSON
    echo json_encode(['error' => 'Koneksi database gagal: ' . mysqli_connect_error()]);
    exit(); // Hentikan eksekusi
}

// Query untuk mengambil semua data dari tabel prognosa
$sql = "SELECT id, tahun, jenis, tanaman, tipe, satuan, bulan, daerah, total FROM tbl_prognosa";

// Gunakan variabel yang benar: $conn
$result = mysqli_query($conn, $sql);

// Cek apakah query berhasil
if (!$result) {
    echo json_encode(['error' => 'Query gagal: ' . mysqli_error($conn)]);
    mysqli_close($conn); // Gunakan $conn
    exit();
}

// Proses hasil query menjadi array
$data = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Konversi 'total' menjadi tipe data float/number agar bisa dihitung di JS
    $row['total'] = (float)$row['total'];
    $data[] = $row;
}

// Tutup koneksi database menggunakan $conn
mysqli_close($conn);

// Cetak data dalam format JSON
echo json_encode($data);

?>