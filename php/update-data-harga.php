<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit();
}

// Ambil semua data dari form, termasuk ID
$id = $_POST['id_analisis_edit'] ?? null;
$tingkat = $_POST['tingkat'] ?? '';
$tanggal = $_POST['tanggal'] ?? '';
$bulan = $_POST['bulan'] ?? '';
$tahun = $_POST['tahun'] ?? '';
$jenis = $_POST['jenis'] ?? '';
$harga = $_POST['harga'] ?? '';

if (!$id || empty($tingkat) || empty($tanggal) || empty($bulan) || empty($tahun) || empty($jenis) || empty($harga)) {
    echo json_encode(['status' => 'error', 'message' => 'Semua field harus diisi.']);
    exit();
}

// Gunakan prepared statement untuk UPDATE
try {
    $stmt = $conn->prepare(
        "UPDATE tbl_analisis_harga 
         SET tingkat = ?, tanggal = ?, bulan = ?, tahun = ?, jenis = ?, harga = ? 
         WHERE id_analisis = ?"
    );
    $stmt->bind_param("sisissi", $tingkat, $tanggal, $bulan, $tahun, $jenis, $harga, $id);

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil diperbarui.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui data.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}

$conn->close();
?>