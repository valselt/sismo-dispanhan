// account-center.js
document.addEventListener('DOMContentLoaded', async () => {
    const roleElement = document.querySelector('#container-role .info-right p');

    // Sesuaikan nth-child sesuai urutan baru
    const usernameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(1) .info-right p'); // Posisi 1
    const fullnameElement = document.querySelector('.container-biodata .container-info-acc:nth-child(2) .info-right p'); // Posisi 2
    const emailElement = document.querySelector('.container-biodata .container-info-acc:nth-child(3) .info-right p');    // Posisi 3 (BARU)
    const numberElement = document.querySelector('.container-biodata .container-info-acc:nth-child(4) .info-right p');   // Posisi 4 (BARU)
    const passwordElement = document.querySelector('.container-biodata .container-info-acc:nth-child(5) .info-right p'); // Posisi 5 (Sebelumnya 3)


    try {
        const response = await fetch('../../php/account-center.php', {
            method: 'GET'
        });

        const data = await response.json();

        if (data.status === 'success') {
            if (roleElement) roleElement.textContent = data.data.role;
            if (usernameElement) usernameElement.textContent = data.data.username;
            if (fullnameElement) fullnameElement.textContent = data.data.fullname;
            if (emailElement) emailElement.textContent = data.data.email;     // Set data email
            if (numberElement) numberElement.textContent = data.data.number;   // Set data nomor telepon
            if (passwordElement) passwordElement.textContent = data.data.password_display;
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
});