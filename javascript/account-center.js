// account-center.js
let userData = null;
const DEFAULT_PROFILE_PIC = 'https://www.nicepng.com/png/detail/73-730154_open-default-profile-picture-png.png';

async function loadUserData() {
    const roleElement = document.querySelector('#container-role .info-right p');
    const usernameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(1) .info-right p');
    const fullnameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(2) .info-right p');
    const emailElement = document.querySelector('.container-biodata .container-info-acc:nth-child(3) .info-right p');
    const numberElement = document.querySelector('.container-biodata .container-info-acc:nth-child(4) .info-right p');
    const passwordElement = document.querySelector('.container-biodata .container-info-acc:nth-child(5) .info-right p');
    const profileImageDisplay = document.getElementById('profileImageDisplay');
    const usernameDisplayName = document.getElementById('usernameDisplayName');

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

            if (profileImageDisplay) {
                if (userData.path_pp && userData.path_pp !== '0') {
                    profileImageDisplay.src = '../../' + userData.path_pp;
                } else {
                    profileImageDisplay.src = DEFAULT_PROFILE_PIC;
                }
            }
            if (usernameDisplayName) {
                usernameDisplayName.textContent = userData.username;
            }

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
    // Panggil loadUserData() di awal
    await loadUserData();

    // Referensi elemen popup edit profil
    const editProfileButton = document.getElementById('editProfileButton');
    const overlay = document.getElementById('overlay');
    const editProfilePopup = document.getElementById('editProfilePopup');
    const closePopupButton = document.getElementById('closePopupButton');
    const saveProfileButton = document.getElementById('saveProfileButton');
    const editUsernameInput = document.getElementById('editUsername');
    const editFullnameInput = document.getElementById('editFullname');
    const editEmailInput = document.getElementById('editEmail');
    const editNumberInput = document.getElementById('editNumber');

    // --- Referensi elemen popup UBAH PASSWORD BARU ---
    const changePasswordButton = document.getElementById('changePasswordButton');
    const passwordOverlay = document.getElementById('passwordOverlay');
    const changePasswordPopup = document.getElementById('changePasswordPopup');
    const closePasswordPopupButton = document.getElementById('closePasswordPopupButton');
    const saveNewPasswordButton = document.getElementById('saveNewPasswordButton');

    const oldPasswordInput = document.getElementById('oldPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

    // --- FUNGSI UNTUK POPUP EDIT PROFIL ---
    function showEditProfilePopup() {
        overlay.style.display = 'block';
        editProfilePopup.style.display = 'flex';

        if (userData) {
            editUsernameInput.value = userData.username;
            editFullnameInput.value = userData.fullname;
            editEmailInput.value = userData.email;
            editNumberInput.value = userData.number;
        }
    }

    function hideEditProfilePopup() {
        overlay.style.display = 'none';
        editProfilePopup.style.display = 'none';
    }

    // --- FUNGSI UNTUK POPUP UBAH PASSWORD ---
    function showChangePasswordPopup() {
        passwordOverlay.style.display = 'block';
        changePasswordPopup.style.display = 'flex';
        oldPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmNewPasswordInput.value = '';

        resetPasswordInputStyling(newPasswordInput);
        resetPasswordInputStyling(confirmNewPasswordInput);
    }

    function hideChangePasswordPopup() {
        passwordOverlay.style.display = 'none';
        changePasswordPopup.style.display = 'none';
        resetPasswordInputStyling(newPasswordInput);
        resetPasswordInputStyling(confirmNewPasswordInput);
    }

    function resetPasswordInputStyling(inputElement) {
        inputElement.style.backgroundColor = '';
        inputElement.style.color = '';
        inputElement.style.borderColor = '';
        inputElement.style.boxShadow = '';
        inputElement.classList.remove('password-mismatch-focus');
    }

    function validateNewPasswords() {
        const newPass = newPasswordInput.value;
        const confirmNewPass = confirmNewPasswordInput.value;

        if (confirmNewPass.length > 0) {
            if (newPass === confirmNewPass) {
                resetPasswordInputStyling(confirmNewPasswordInput);
                return true;
            } else {
                confirmNewPasswordInput.style.backgroundColor = '#B71C1C';
                confirmNewPasswordInput.style.color = 'white';
                confirmNewPasswordInput.style.borderColor = 'red';
                confirmNewPasswordInput.style.boxShadow = '0 1px 1px rgba(255, 0, 0, .075), 0 0 8px rgba(255, 0, 0, .2)';
                confirmNewPasswordInput.classList.add('password-mismatch-focus');
                return false;
            }
        } else {
            resetPasswordInputStyling(confirmNewPasswordInput);
            return false;
        }
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
                    hideEditProfilePopup();
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

    // --- Event Listeners untuk popup Ubah Password ---
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

    newPasswordInput.addEventListener('input', validateNewPasswords);
    confirmNewPasswordInput.addEventListener('input', validateNewPasswords);

    if (saveNewPasswordButton) {
        saveNewPasswordButton.addEventListener('click', async () => {
            const oldPassword = oldPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            if (!oldPassword || !newPassword || !confirmNewPassword) {
                alert('Semua field password harus diisi.');
                return;
            }

            if (!validateNewPasswords()) {
                alert('Password baru dan konfirmasi password tidak cocok.');
                return;
            }

            if (newPassword.length < 6) {
                alert('Password baru minimal 6 karakter.');
                return;
            }

            const formData = new FormData();
            formData.append('old_password', oldPassword);
            formData.append('new_password', newPassword);

            try {
                const response = await fetch('../../php/update_password.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message);
                    hideChangePasswordPopup();
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