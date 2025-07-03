<?php
session_start();
include 'koneksi.php'; // Sertakan file koneksi database Anda

header('Content-Type: application/json'); // Mengatur header agar respon berupa JSON

// Pastikan pengguna sudah login
if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access. User not logged in.']);
    exit();
}

// Pastikan metode permintaan adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit();
}

$username_to_delete = $_SESSION['username']; // Ambil username dari sesi

try {
    // Mulai transaksi untuk memastikan konsistensi data
    $conn->begin_transaction();

    // Hapus pengguna dari tbl_users
    $stmt = $conn->prepare("DELETE FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $username_to_delete);

    if ($stmt->execute()) {
        if ($stmt->affected_rows > 0) {
            // Jika penghapusan berhasil, hancurkan sesi PHP yang aktif
            session_unset();   // Menghapus semua variabel sesi
            session_destroy(); // Menghancurkan sesi

            // Commit transaksi
            $conn->commit();
            echo json_encode(['status' => 'success', 'message' => 'Akun berhasil dihapus.']);
        } else {
            // Jika 0 baris terpengaruh, kemungkinan username tidak ditemukan (walaupun harusnya ada karena dari sesi)
            $conn->rollback(); // Batalkan transaksi
            echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus akun: Akun tidak ditemukan.']);
        }
    } else {
        // Jika query gagal dieksekusi
        $conn->rollback(); // Batalkan transaksi
        echo json_encode(['status' => 'error', 'message' => 'Gagal menghapus akun: ' . $stmt->error]);
    }

    $stmt->close();
} catch (mysqli_sql_exception $e) {
    // Tangani exception database
    $conn->rollback(); // Batalkan transaksi
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn->close(); // Tutup koneksi database
}
?>