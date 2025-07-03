// account-center.js
let userData = null;

async function loadUserData() {
    const roleElement = document.querySelector('#container-role .info-right p');
    const usernameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(1) .info-right p');
    const fullnameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(2) .info-right p');
    const emailElement = document.querySelector('.container-biodata .container-info-acc:nth-child(3) .info-right p');
    const numberElement = document.querySelector('.container-biodata .container-info-acc:nth-child(4) .info-right p');
    const passwordElement = document.querySelector('.container-biodata .container-info-acc:nth-child(5) .info-right p');

    try {
        const response = await fetch('../../php/account-center.php', {
            method: 'GET'
        });
        const data = await response.json();

        if (data.status === 'success') {
            userData = data.data;
            if (roleElement) roleElement.textContent = userData.role;
            if (usernameElement) usernameElement.textContent = userData.username;
            if (fullnameElement) fullnameElement.textContent = userData.fullname;
            if (emailElement) emailElement.textContent = userData.email;
            if (numberElement) numberElement.textContent = userData.number;
            if (passwordElement) passwordElement.textContent = userData.password_display;
        } else {
            console.error('Failed to load user data:', data.message);
            alert('Error loading user data: ' + data.message);
            if (data.message === 'User not logged in.') {
                window.location.href = '../login.html';
            }
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        alert('An error occurred while fetching user data.');
    }
}


document.addEventListener('DOMContentLoaded', async () => {
    await loadUserData();

    // Referensi elemen popup edit profil
    const editProfileButton = document.getElementById('editProfileButton');
    const overlay = document.getElementById('overlay'); // Overlay untuk edit profil
    const editProfilePopup = document.getElementById('editProfilePopup');
    const closePopupButton = document.getElementById('closePopupButton');
    const saveProfileButton = document.getElementById('saveProfileButton');
    const editUsernameInput = document.getElementById('editUsername');
    const editFullnameInput = document.getElementById('editFullname');
    const editEmailInput = document.getElementById('editEmail');
    const editNumberInput = document.getElementById('editNumber');

    // --- Referensi elemen popup UBAH PASSWORD BARU ---
    const changePasswordButton = document.getElementById('changePasswordButton'); // Tombol "Ubah Password"
    const passwordOverlay = document.getElementById('passwordOverlay'); // Overlay untuk popup password
    const changePasswordPopup = document.getElementById('changePasswordPopup');
    const closePasswordPopupButton = document.getElementById('closePasswordPopupButton'); // Tombol X popup password
    const saveNewPasswordButton = document.getElementById('saveNewPasswordButton'); // Tombol Simpan Password Baru

    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');


    // Fungsi untuk menampilkan popup Edit Profil
    function showEditProfilePopup() {
        overlay.style.display = 'block'; // Gunakan overlay utama
        editProfilePopup.style.display = 'flex';

        if (userData) {
            editUsernameInput.value = userData.username;
            editFullnameInput.value = userData.fullname;
            editEmailInput.value = userData.email;
            editNumberInput.value = userData.number;
        }
    }

    // Fungsi untuk menyembunyikan popup Edit Profil
    function hideEditProfilePopup() {
        overlay.style.display = 'none';
        editProfilePopup.style.display = 'none';
    }

    // Fungsi untuk menampilkan popup Ubah Password
    function showChangePasswordPopup() {
        passwordOverlay.style.display = 'block'; // Gunakan overlay password
        changePasswordPopup.style.display = 'flex';
        // Kosongkan field setiap kali popup dibuka
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';
    }

    // Fungsi untuk menyembunyikan popup Ubah Password
    function hideChangePasswordPopup() {
        passwordOverlay.style.display = 'none';
        changePasswordPopup.style.display = 'none';
    }


    // --- Event Listeners untuk popup Edit Profil ---
    if (editProfileButton) {
        editProfileButton.addEventListener('click', showEditProfilePopup);
    }
    if (closePopupButton) {
        closePopupButton.addEventListener('click', hideEditProfilePopup);
    }
    if (overlay) {
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                hideEditProfilePopup();
            }
        });
    }

    // Logika simpan profil (sudah ada)
    if (saveProfileButton) {
        saveProfileButton.addEventListener('click', async () => {
            const newUsername = editUsernameInput.value;
            const newFullname = editFullnameInput.value;
            const newEmail = editEmailInput.value;
            const newNumber = editNumberInput.value;

            const formData = new FormData();
            formData.append('username', newUsername);
            formData.append('fullname', newFullname);
            formData.append('email', newEmail);
            formData.append('number', newNumber);

            try {
                const response = await fetch('../../php/update_profile.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message);
                    hideEditProfilePopup(); // Sembunyikan popup edit profil
                    await loadUserData();
                } else {
                    alert('Gagal memperbarui profil: ' + data.message);
                }
            } catch (error) {
                console.error('Error saving profile:', error);
                alert('Terjadi kesalahan saat menyimpan profil. Silakan coba lagi.');
            }
        });
    }

    // --- Event Listeners untuk popup Ubah Password BARU ---
    if (changePasswordButton) {
        changePasswordButton.addEventListener('click', showChangePasswordPopup);
    }

    if (closePasswordPopupButton) {
        closePasswordPopupButton.addEventListener('click', hideChangePasswordPopup);
    }

    if (passwordOverlay) {
        passwordOverlay.addEventListener('click', (event) => {
            if (event.target === passwordOverlay) {
                hideChangePasswordPopup();
            }
        });
    }

    // LOGIKA SIMPAN PASSWORD BARU (AKAN MENGIRIM KE update_password.php)
    if (saveNewPasswordButton) {
        saveNewPasswordButton.addEventListener('click', async () => {
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            // --- Validasi Client-Side ---
            if (!oldPassword || !newPassword || !confirmNewPassword) {
                alert('Semua field password harus diisi.');
                return;
            }
            if (newPassword !== confirmNewPassword) {
                alert('Password baru dan konfirmasi password tidak cocok.');
                return;
            }
            if (newPassword.length < 6) { // Contoh: minimum 6 karakter
                alert('Password baru minimal 6 karakter.');
                return;
            }
            // Tambahkan validasi kompleksitas password jika diinginkan

            const formData = new FormData();
            formData.append('old_password', oldPassword);
            formData.append('new_password', newPassword);

            try {
                const response = await fetch('../../php/update_password.php', { // Panggil script PHP baru
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message);
                    hideChangePasswordPopup(); // Sembunyikan popup password
                    // Tidak perlu loadUserData() karena password tidak ditampilkan
                } else {
                    alert('Gagal mengubah password: ' + data.message);
                }
            } catch (error) {
                console.error('Error changing password:', error);
                alert('Terjadi kesalahan saat mengubah password. Silakan coba lagi.');
            }
        });
    }

});