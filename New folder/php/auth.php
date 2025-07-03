<?php

session_start();
include 'koneksi.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_SESSION['username'] ?? $_SESSION['register_username'] ?? '';

    if (empty($username)) {
        echo json_encode(['status' => 'error', 'message' => 'Tidak ada User dalam session ini yang ditemukan untuk dilakukan authorization.']);
        exit();
    }

    // Update acc_verif to 1 and is_login to 1 (for login flow) or keep is_login as 0 (for register flow)
    // We need to differentiate if this is coming from a login attempt or a fresh registration
    // If $_SESSION['username'] exists, it's a login attempt, so set is_login to 1
    // If only $_SESSION['register_username'] exists, it's a registration, so keep is_login as 0 for now.
    
    $is_login_status = isset($_SESSION['username']) ? 1 : 0;

    $update_stmt = $conn->prepare("UPDATE tbl_users SET acc_verif = 1, is_login = ? WHERE username = ?");
    $update_stmt->bind_param("is", $is_login_status, $username);

    if ($update_stmt->execute()) {
        if ($is_login_status === 1) {
            echo json_encode(['status' => 'success', 'message' => 'Authorization berhasil. Mengalihkan anda ke Halaman Utama...']);
            unset($_SESSION['register_username']); // Clear if it was from a registration flow
        } else {
            echo json_encode(['status' => 'success_register', 'message' => 'Authorization berhasil. Mengalihkan anda ke Halaman Login...']);
            unset($_SESSION['register_username']); // Clear the register username after successful auth
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Authorization Gagal.']);
    }

    $update_stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

?>