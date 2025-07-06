<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

// Pastikan request adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
    exit();
}

// Ambil id dari request
$id = $_POST['id_analisis'] ?? null;

if (!$id) {
    echo json_encode(['status' => 'error', 'message' => 'ID tidak ditemukan.']);
    exit();
}

// Gunakan prepared statement untuk keamanan
try {
    $stmt = $conn->prepare("DELETE FROM tbl_analisis_harga WHERE id_analisis = ?");
    $stmt->bind_param("i", $id); // 'i' karena id_analisis adalah integer

    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Data berhasil dihapus.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus data.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan: ' . $e->getMessage()]);
}

$conn->close();
?>