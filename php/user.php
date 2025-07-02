<?php
session_start();
include 'koneksi.php'; // Your database connection

header('Content-Type: application/json');

$response = ['username' => null];

// Check if a username is set in the session
if (isset($_SESSION['username'])) {
    $session_username = $_SESSION['username'];

    // Prepare a statement to select the user's username and is_login status
    $stmt = $conn->prepare("SELECT username, is_login FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $session_username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if ($user['is_login'] == 1) {
            $response['username'] = $user['username'];
        } else {
            session_unset();
            session_destroy();
        }
    } else {
        session_unset();
        session_destroy();
    }
    $stmt->close();
} else {
    // If no session, try to find any user with is_login = 1
    $stmt = $conn->prepare("SELECT username FROM tbl_users WHERE is_login = 1 LIMIT 1");
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $response['username'] = $user['username'];
        $_SESSION['username'] = $user['username']; // Also set session if found
    }
    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>