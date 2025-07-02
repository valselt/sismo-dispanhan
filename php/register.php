<?php

session_start();
include 'koneksi.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $fullname = $_POST['fullname'] ?? '';
    $username = $_POST['username'] ?? '';
    $email = $_POST['email'] ?? '';
    $number = $_POST['number'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($fullname) || empty($username) || empty($email) || empty($number) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit();
    }

    // Hash the password
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // Check if username or email already exists
    $check_stmt = $conn->prepare("SELECT username FROM tbl_users WHERE username = ? OR email = ?");
    $check_stmt->bind_param("ss", $username, $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        echo json_encode(['status' => 'error', 'message' => 'Username or Email already exists.']);
        $check_stmt->close();
        $conn->close();
        exit();
    }
    $check_stmt->close();

    // Insert new user with acc_verif = 0 and is_login = 0
    $insert_stmt = $conn->prepare("INSERT INTO tbl_users (fullname, username, email, number, password, is_login, acc_verif) VALUES (?, ?, ?, ?, ?, 0, 0)");
    $insert_stmt->bind_param("sssss", $fullname, $username, $email, $number, $hashed_password);

    if ($insert_stmt->execute()) {
        $_SESSION['register_username'] = $username; // Store username in session for auth.html
        echo json_encode(['status' => 'success', 'message' => 'Registration successful. Redirecting to authorization.']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Registration failed. Please try again.']);
    }

    $insert_stmt->close();
    $conn->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

?>