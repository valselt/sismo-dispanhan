<?php
session_start();
include 'koneksi.php'; // Pastikan koneksi.php sudah tersedia dan berfungsi

header('Content-Type: application/json'); // Mengatur header respons ke JSON

// Pastikan hanya pengguna yang sudah login yang bisa mengakses ini
if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access. User not logged in.']);
    exit();
}

// Pastikan metode permintaan adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
    exit();
}

$current_username = $_SESSION['username']; // Username dari session untuk identifikasi pengguna yang sedang login

// Ambil data yang dikirim dari JavaScript
$new_username = $_POST['username'] ?? '';
$new_fullname = $_POST['fullname'] ?? '';
$new_email = $_POST['email'] ?? '';
$new_number = $_POST['number'] ?? '';

// --- Validasi Data (Penting!) ---
// Lakukan validasi dasar di sini. Anda bisa menambahkan validasi yang lebih kompleks.
if (empty($new_username) || empty($new_fullname) || empty($new_email) || empty($new_number)) {
    echo json_encode(['status' => 'error', 'message' => 'All fields must be filled.']);
    exit();
}

// Validasi format email
if (!filter_var($new_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 'error', 'message' => 'Invalid email format.']);
    exit();
}

// Validasi nomor telepon (opsional, bisa disesuaikan dengan format Indonesia)
// Contoh: hanya angka, panjang tertentu
if (!preg_match('/^[0-9]{10,15}$/', $new_number)) { // Contoh 10-15 digit angka
    echo json_encode(['status' => 'error', 'message' => 'Invalid phone number format.']);
    exit();
}

try {
    // Cek apakah username atau email baru sudah digunakan oleh pengguna lain (jika diubah)
    // Kecuali jika username atau email baru sama dengan username atau email lama dari pengguna yang sama
    $check_duplicate_stmt = $conn->prepare(
        "SELECT COUNT(*) FROM tbl_users WHERE (username = ? OR email = ?) AND username != ?"
    );
    $check_duplicate_stmt->bind_param("sss", $new_username, $new_email, $current_username);
    $check_duplicate_stmt->execute();
    $check_duplicate_result = $check_duplicate_stmt->get_result();
    $row = $check_duplicate_result->fetch_row();

    if ($row[0] > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username or Email already taken by another user.']);
        $check_duplicate_stmt->close();
        $conn->close();
        exit();
    }
    $check_duplicate_stmt->close();

    // Query untuk memperbarui data pengguna
    $stmt = $conn->prepare("UPDATE tbl_users SET username = ?, fullname = ?, email = ?, number = ? WHERE username = ?");
    $stmt->bind_param("sssss", $new_username, $new_fullname, $new_email, $new_number, $current_username);

    if ($stmt->execute()) {
        // Jika username berubah, perbarui juga username di session
        if ($new_username !== $current_username) {
            $_SESSION['username'] = $new_username;
        }
        echo json_encode(['status' => 'success', 'message' => 'Profil berhasil diperbarui.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui profil: ' . $stmt->error]);
    }

    $stmt->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>