<?php
session_start(); // Memulai sesi

include 'koneksi.php'; // Sertakan file koneksi database Anda

header('Content-Type: application/json'); // Mengatur header agar respon berupa JSON

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // 1. Setel semua nilai 'is_login' menjadi 0 untuk semua baris di tbl_users
    $update_stmt = $conn->prepare("UPDATE tbl_users SET is_login = 0");
    
    if ($update_stmt->execute()) {
        // 2. Hancurkan sesi PHP yang aktif
        session_unset();   // Menghapus semua variabel sesi
        session_destroy(); // Menghancurkan sesi

        echo json_encode(['status' => 'success', 'message' => 'Logout Berhasil!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengatur ulang status login di database.']);
    }
    $update_stmt->close(); // Tutup statement
    $conn->close(); // Tutup koneksi database
} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid.']);
}
?>