<?php
session_start();
include 'koneksi.php'; // Sertakan file koneksi database Anda

header('Content-Type: application/json');

// Pastikan pengguna sudah login
if (!isset($_SESSION['username'])) {
    echo json_encode(['status' => 'error', 'message' => 'Unauthorized access. User not logged in.']);
    exit();
}

$current_username = $_SESSION['username'];
$target_directory = "../images/user/"; // Folder tempat menyimpan gambar

// Pastikan direktori ada dan bisa ditulis
if (!is_dir($target_directory)) {
    mkdir($target_directory, 0755, true);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['profilePicture'])) {
    $file = $_FILES['profilePicture'];

    // Validasi file
    $allowed_types = ['image/jpeg', 'image/png'];
    $max_file_size = 5 * 1024 * 1024; // 5 MB

    if (!in_array($file['type'], $allowed_types)) {
        echo json_encode(['status' => 'error', 'message' => 'Format file tidak didukung. Hanya JPG dan PNG yang diizinkan.']);
        exit();
    }

    if ($file['size'] > $max_file_size) {
        echo json_encode(['status' => 'error', 'message' => 'Ukuran file terlalu besar. Maksimal 5 MB.']);
        exit();
    }

    if ($file['error'] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Terjadi kesalahan saat mengunggah file. Kode error: ' . $file['error']]);
        exit();
    }

    // Tentukan ekstensi file
    $image_info = getimagesize($file['tmp_name']);
    $extension = image_type_to_extension($image_info[2], false); // Mengambil ekstensi tanpa titik

    // Nama file unik (username.jpg/png)
    $file_name = $current_username . '.' . $extension;
    $target_file = $target_directory . $file_name;

    try {
        // Ambil path_pp lama dari database untuk potensi penghapusan
        $stmt_select_old_pp = $conn->prepare("SELECT path_pp FROM tbl_users WHERE username = ?");
        $stmt_select_old_pp->bind_param("s", $current_username);
        $stmt_select_old_pp->execute();
        $result_old_pp = $stmt_select_old_pp->get_result();
        $old_pp_row = $result_old_pp->fetch_assoc();
        $old_path_pp = $old_pp_row['path_pp'];
        $stmt_select_old_pp->close();

        // Pindahkan file yang diunggah
        if (move_uploaded_file($file['tmp_name'], $target_file)) {
            $relative_path_in_db = 'images/user/' . $file_name; // Path relatif untuk disimpan di DB

            // Perbarui path_pp di database
            $stmt_update_pp = $conn->prepare("UPDATE tbl_users SET path_pp = ? WHERE username = ?");
            $stmt_update_pp->bind_param("ss", $relative_path_in_db, $current_username);

            if ($stmt_update_pp->execute()) {
                // Hapus file lama jika ada dan berbeda dari yang baru
                if ($old_path_pp !== '0' && $old_path_pp !== $relative_path_in_db) {
                    $old_full_path = "../" . $old_path_pp;
                    if (file_exists($old_full_path)) {
                        unlink($old_full_path);
                    }
                }
                echo json_encode(['status' => 'success', 'message' => 'Foto profil berhasil diunggah dan diperbarui.']);
            } else {
                // Jika update DB gagal, hapus file yang baru saja diunggah
                if (file_exists($target_file)) {
                    unlink($target_file);
                }
                echo json_encode(['status' => 'error', 'message' => 'Gagal memperbarui database: ' . $stmt_update_pp->error]);
            }
            $stmt_update_pp->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal memindahkan file ke direktori tujuan.']);
        }
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['delete_photo'])) {
    // --- Logika untuk DELETE PHOTO PROFILE ---
    try {
        // Ambil path_pp dari database
        $stmt_select_pp = $conn->prepare("SELECT path_pp FROM tbl_users WHERE username = ?");
        $stmt_select_pp->bind_param("s", $current_username);
        $stmt_select_pp->execute();
        $result_pp = $stmt_select_pp->get_result();
        $pp_row = $result_pp->fetch_assoc();
        $current_path_pp = $pp_row['path_pp'];
        $stmt_select_pp->close();

        // Jika ada foto profil yang disimpan (bukan default '0')
        if ($current_path_pp !== '0') {
            $full_path_to_delete = "../" . $current_path_pp;
            if (file_exists($full_path_to_delete)) {
                unlink($full_path_to_delete); // Hapus file dari sistem
            }
        }

        // Set path_pp di database kembali ke '0'
        $stmt_update_to_default = $conn->prepare("UPDATE tbl_users SET path_pp = '0' WHERE username = ?");
        $stmt_update_to_default->bind_param("s", $current_username);

        if ($stmt_update_to_default->execute()) {
            echo json_encode(['status' => 'success', 'message' => 'Foto profil berhasil dihapus dan direset ke default.']);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Gagal mereset path foto profil di database: ' . $stmt_update_to_default->error]);
        }
        $stmt_update_to_default->close();
    } catch (mysqli_sql_exception $e) {
        echo json_encode(['status' => 'error', 'message' => 'Database error: ' . $e->getMessage()]);
    } finally {
        $conn->close();
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Metode request tidak valid atau data tidak lengkap.']);
}
?>