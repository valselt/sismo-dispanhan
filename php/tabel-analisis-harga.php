<?php
header('Content-Type: application/json');
require_once 'koneksi.php'; // Pastikan path ini benar

// Ambil parameter dari request JavaScript
$page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
$rowsPerPage = isset($_GET['rows']) ? (int)$_GET['rows'] : 25;
$offset = ($page - 1) * $rowsPerPage;

// 1. Hitung total baris untuk pagination
$totalRowsResult = $conn->query("SELECT COUNT(*) as total FROM tbl_analisis_harga");
$totalRows = $totalRowsResult->fetch_assoc()['total'];
$totalPages = ceil($totalRows / $rowsPerPage);

// 2. Ambil data untuk halaman saat ini
$stmt = $conn->prepare("SELECT id_analisis, tingkat, tanggal, bulan, tahun, jenis, harga FROM tbl_analisis_harga LIMIT ? OFFSET ?");
$stmt->bind_param("ii", $rowsPerPage, $offset);
$stmt->execute();
$result = $stmt->get_result();
$data = $result->fetch_all(MYSQLI_ASSOC);

// 3. Kirim semua informasi yang dibutuhkan sebagai JSON
echo json_encode([
    'data' => $data,
    'pagination' => [
        'currentPage' => $page,
        'totalPages' => $totalPages,
        'totalRows' => $totalRows,
        'rowsPerPage' => $rowsPerPage
    ]
]);

$stmt->close();
$conn->close();
?>