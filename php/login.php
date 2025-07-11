<?php

session_start();
include 'koneksi.php'; // Include your database connection

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'Username dan Password harus diisi.']);
        exit();
    }

    $stmt = $conn->prepare("SELECT username, password, acc_verif FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        // Verify password
        if (password_verify($password, $user['password'])) {
            // --- NEW CODE START ---

            // 1. Reset all is_login values to 0 for all users
            $reset_all_stmt = $conn->prepare("UPDATE tbl_users SET is_login = 0");
            $reset_all_stmt->execute();
            $reset_all_stmt->close();

            // --- NEW CODE END ---

            $_SESSION['username'] = $user['username'];

            if ($user['acc_verif'] == 0) {
                echo json_encode(['status' => 'redirect_to_auth', 'message' => 'Akun JACKMIA anda belum ter-authorized. Mengalihkan anda ke Halaman Authorization...']);
            } else {
                // Update is_login to 1 for the currently logging in user
                $update_stmt = $conn->prepare("UPDATE tbl_users SET is_login = 1 WHERE username = ?");
                $update_stmt->bind_param("s", $username);
                $update_stmt->execute();
                $update_stmt->close(); // Close the statement here
                echo json_encode(['status' => 'success', 'message' => 'Login berhasil. Mengalihkan anda ke Halaman Utama...']);
            }
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Username atau Password Salah.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Akun dengan username ' . $username . ' tidak ditemukan.']);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

?>