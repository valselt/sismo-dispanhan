<?php
session_start();
include 'koneksi.php'; // Pastikan koneksi.php sudah tersedia dan berfungsi

header('Content-Type: application/json');

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

$current_username = $_SESSION['username'];

// Ambil data dari POST
$old_password = $_POST['old_password'] ?? '';
$new_password = $_POST['new_password'] ?? '';

// --- Validasi Data Server-Side (Penting!) ---
if (empty($old_password) || empty($new_password)) {
    echo json_encode(['status' => 'error', 'message' => 'Password lama dan password baru harus diisi.']);
    exit();
}

// Tambahkan validasi panjang atau kompleksitas password baru jika diperlukan
if (strlen($new_password) < 6) { // Contoh: minimal 6 karakter
    echo json_encode(['status' => 'error', 'message' => 'Password baru minimal 6 karakter.']);
    exit();
}

try {
    // 1. Ambil password hash lama dari database
    $stmt = $conn->prepare("SELECT password FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $current_username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        $stmt->close();
        $conn->close();
        exit();
    }

    $user = $result->fetch_assoc();
    $hashed_old_password_db = $user['password'];
    $stmt->close();

    // 2. Verifikasi password lama yang dimasukkan pengguna dengan hash di database
    if (!password_verify($old_password, $hashed_old_password_db)) {
        echo json_encode(['status' => 'error', 'message' => 'Password lama salah.']);
        $conn->close();
        exit();
    }

    // 3. Hash password baru
    $hashed_new_password = password_hash($new_password, PASSWORD_DEFAULT);

    // 4. Perbarui password di database
    $update_stmt = $conn->prepare("UPDATE tbl_users SET password = ? WHERE username = ?");
    $update_stmt->bind_param("ss", $hashed_new_password, $current_username);

    if ($update_stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Password berhasil diubah.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal mengubah password: ' . $update_stmt->error]);
    }

    $update_stmt->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>