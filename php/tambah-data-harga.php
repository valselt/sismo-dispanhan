<?php
header('Content-Type: application/json');
require_once 'koneksi.php'; // Pastikan path ini benar

// Pastikan request adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit();
}

// Ambil data dari form
$tingkat = $_POST['tingkat'] ?? '';
$tanggal = $_POST['tanggal'] ?? '';
$bulan = $_POST['bulan'] ?? '';
$tahun = $_POST['tahun'] ?? '';
$jenis = $_POST['jenis'] ?? '';
$harga = $_POST['harga'] ?? '';

// Validasi sederhana
if (empty($tingkat) || empty($tanggal) || empty($bulan) || empty($tahun) || empty($jenis) || empty($harga)) {
    echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi.']);
    exit();
}

// Siapkan dan eksekusi query untuk memasukkan data
try {
    $stmt = $conn->prepare("INSERT INTO tbl_analisis_harga (tingkat, tanggal, bulan, tahun, jenis, harga) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sisisi", $tingkat, $tanggal, $bulan, $tahun, $jenis, $harga);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil ditambahkan.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menyimpan data ke database.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}

$conn->close();
?>