<?php
session_start();
include 'koneksi.php'; // Your database connection

header('Content-Type: application/json');

// Initialize response with null values for username and role
$response = ['username' => null, 'role' => null];

// Check if a username is set in the session
if (isset($_SESSION['username'])) {
    $session_username = $_SESSION['username'];

    // Prepare a statement to select the user's username, is_login, AND role status
    $stmt = $conn->prepare("SELECT username, is_login, role FROM tbl_users WHERE username = ?");
    $stmt->bind_param("s", $session_username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        if ($user['is_login'] == 1) {
            $response['username'] = $user['username'];
            $response['role'] = $user['role']; // Add the role to the response
        } else {
            // If is_login is not 1, destroy session
            session_unset();
            session_destroy();
        }
    } else {
        // If username not found, destroy session
        session_unset();
        session_destroy();
    }
    $stmt->close();
} else {
    // If no session, try to find any user with is_login = 1
    // This part should ideally also fetch the role if you want to handle
    // a scenario where a user is found already logged in without a prior session.
    // However, given the primary use case (checking the current session),
    // we'll focus on adding role to the session-based check.
    
    // For consistency, let's also fetch role here if you expect this path to be hit frequently.
    // If you only rely on sessions after initial login, this part might be less critical for 'role'.
    $stmt = $conn->prepare("SELECT username, role FROM tbl_users WHERE is_login = 1 LIMIT 1"); // Added 'role'
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();
        $response['username'] = $user['username'];
        $response['role'] = $user['role']; // Add the role to the response
        $_SESSION['username'] = $user['username']; // Also set session if found
        $_SESSION['role'] = $user['role']; // Also set role in session
    }
    $stmt->close();
}

$conn->close();
echo json_encode($response);
?>