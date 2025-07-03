<?php
session_start();
include 'koneksi.php';

header('Content-Type: application/json');

if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'User not logged in.']);
    exit();
}

$username = $_SESSION['username'];

try {
    // Tambahkan 'path_pp' ke SELECT statement
    $stmt = $conn->prepare("SELECT role, fullname, username, email, number, password, path_pp FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user_data = $result->fetch_assoc();

        $role_text = ($user_data['role'] == 1) ? 'Admin' : 'User Biasa';

        $response_data = [
            'status' => 'success',
            'data' => [
                'role' => $role_text,
                'fullname' => $user_data['fullname'],
                'username' => $user_data['username'],
                'email' => $user_data['email'],
                'number' => $user_data['number'],
                'password_display' => '********',
                'path_pp' => $user_data['path_pp'] // Tambahkan path_pp ke respons
            ]
        ];
        echo json_encode($response_data);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User data not found.']);
    }

    $stmt->close();
} catch (mysqli_sql_exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
} finally {
    $conn->close();
}
?>