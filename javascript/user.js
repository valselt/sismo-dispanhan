document.addEventListener('DOMContentLoaded', async () => {
    const userStatusLink = document.getElementById('userStatusLink');
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');
    const personIcon = userStatusLink ? userStatusLink.querySelector('.material-symbols-outlined') : null;
    const accountCenterBox = document.getElementById('accountCenterBox');
    const logoutButton = document.getElementById('logoutButton');
    const navbar = document.getElementById('navbar'); // Dapatkan referensi navbar

    // State variable untuk melacak apakah event listener aktif
    let listenersActive = false;

    // Sembunyikan kotak account center saat inisialisasi
    if (accountCenterBox) {
        accountCenterBox.style.display = 'none';
        accountCenterBox.classList.remove('is-active'); // Pastikan tidak aktif secara default
    }

    // Fungsi untuk mengatur posisi kotak Account Center
    function positionAccountCenterBox() {
        if (userStatusLink && accountCenterBox && navbar) {
            const linkRect = userStatusLink.getBoundingClientRect(); // Dapatkan posisi dan ukuran link
            const navbarRect = navbar.getBoundingClientRect(); // Dapatkan posisi navbar

            const offsetRight = 15; // Sesuaikan nilai ini. Nilai positif akan menggeser kotak ke kanan.
                               // Nilai negatif akan menggeser kotak ke kiri.

        accountCenterBox.style.left = `${linkRect.right - accountCenterBox.offsetWidth + offsetRight}px`;
            
        }
    }

    // --- Named Event Handlers (Fungsi-fungsi event listener) ---
    function handleUserStatusLinkClick(event) {
        event.preventDefault(); // Mencegah navigasi default link '#'
        event.stopPropagation(); // Mencegah klik menyebar ke listener dokumen

        // Toggle class 'is-active' untuk menampilkan/menyembunyikan kotak
        const isActive = accountCenterBox.classList.toggle('is-active');
        
        if (isActive) {
            accountCenterBox.style.display = 'flex'; // Pastikan display:flex saat aktif
            positionAccountCenterBox(); // Atur posisi saat ditampilkan
        } else {
            // Setelah menyembunyikan, set display ke none untuk memastikan tidak ada klik yang lewat
            // Gunakan setTimeout agar transisi selesai sebelum display: none
            setTimeout(() => {
                if (!accountCenterBox.classList.contains('is-active')) {
                    accountCenterBox.style.display = 'none';
                }
            }, 300); // Durasi match transisi CSS (0.3s)
        }
    }

    function handleDocumentClick(event) {
        // Jika kotak aktif DAN klik di luar link dan di luar kotak
        if (accountCenterBox.classList.contains('is-active') &&
            !userStatusLink.contains(event.target) &&
            !accountCenterBox.contains(event.target)) {
            accountCenterBox.classList.remove('is-active');
            setTimeout(() => {
                if (!accountCenterBox.classList.contains('is-active')) {
                    accountCenterBox.style.display = 'none';
                }
            }, 300); // Durasi match transisi CSS
        }
    }

    async function handleLogoutButtonClick() {
        try {
            const logoutResponse = await fetch('php/logout_all.php', { // Panggil script logout
                method: 'POST'
            });
            const logoutData = await logoutResponse.json();

            if (logoutData.status === 'success') {
                alert(logoutData.message);
                window.location.href = 'index.html'; 
            } else {
                alert('Logout failed: ' + logoutData.message);
            }
        } catch (logoutError) {
            console.error('Error selama logout:', logoutError);
            alert('Terjadi error selama logout. Mohon coba lagi.');
        }
    }
    // --- Akhir Named Event Handlers ---


    if (userStatusLink && loggedInUsernameSpan && personIcon && accountCenterBox && logoutButton && navbar) {
        console.log('DOM elements for user status and logout found. Attempting to fetch user status.');

        try {
            const response = await fetch('php/user.php');
            const data = await response.json();

            if (data.username) {
                // Pengguna sedang login
                loggedInUsernameSpan.textContent = data.username;
                loggedInUsernameSpan.style.display = 'inline-block';
                personIcon.style.display = 'inline-block';
                userStatusLink.href = '#';
                userStatusLink.setAttribute('aria-label', `Logged in as ${data.username}`);

                positionAccountCenterBox(); // Atur posisi awal kotak

                // Tambahkan event listener HANYA jika pengguna login dan belum aktif
                if (!listenersActive) {
                    userStatusLink.addEventListener('click', handleUserStatusLinkClick);
                    document.addEventListener('click', handleDocumentClick);
                    logoutButton.addEventListener('click', handleLogoutButtonClick);
                    window.addEventListener('resize', positionAccountCenterBox); // Atur ulang posisi saat resize
                    window.addEventListener('scroll', positionAccountCenterBox); // Atur ulang posisi saat scroll
                    listenersActive = true;
                }

            } else {
                // Pengguna tidak login
                loggedInUsernameSpan.textContent = '';
                loggedInUsernameSpan.style.display = 'none';
                personIcon.style.display = 'inline-block';
                userStatusLink.href = 'login.html';
                userStatusLink.setAttribute('aria-label', 'Login');

                // Pastikan kotak account center tersembunyi dan listener dihapus jika tidak login
                accountCenterBox.classList.remove('is-active');
                accountCenterBox.style.display = 'none';
                if (listenersActive) { // Hapus listener jika sebelumnya aktif
                    userStatusLink.removeEventListener('click', handleUserStatusLinkClick);
                    document.removeEventListener('click', handleDocumentClick);
                    logoutButton.removeEventListener('click', handleLogoutButtonClick);
                    window.removeEventListener('resize', positionAccountCenterBox);
                    window.removeEventListener('scroll', positionAccountCenterBox);
                    listenersActive = false;
                }
            }
        } catch (error) {
            console.error('Error fetching user status:', error);
            // Penanganan error, sembunyikan box dan hapus listener
            loggedInUsernameSpan.textContent = '';
            loggedInUsernameSpan.style.display = 'none';
            personIcon.style.display = 'inline-block';
            userStatusLink.href = 'login.html';
            accountCenterBox.classList.remove('is-active');
            accountCenterBox.style.display = 'none';
            if (listenersActive) { // Hapus listener jika sebelumnya aktif
                userStatusLink.removeEventListener('click', handleUserStatusLinkClick);
                document.removeEventListener('click', handleDocumentClick);
                logoutButton.removeEventListener('click', handleLogoutButtonClick);
                window.removeEventListener('resize', positionAccountCenterBox);
                window.removeEventListener('scroll', positionAccountCenterBox);
                listenersActive = false;
            }
        }
    } else {
        console.warn('One or more DOM elements (userStatusLink, loggedInUsernameSpan, personIcon, accountCenterBox, logoutButton, navbar) not found. Ensure all IDs are correct.');
    }
});