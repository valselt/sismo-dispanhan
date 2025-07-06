document.addEventListener('DOMContentLoaded', async () => {
    // =========================================================================
    // === BAGIAN 1: KODE ASLI ANDA (TIDAK DIUBAH SAMA SEKALI) ===
    // =========================================================================
    const userStatusLink = document.getElementById('userStatusLink');
    const loggedInUsernameSpan = document.getElementById('loggedInUsername');
    const verifiedIcon = document.getElementById('verified-icon'); 
    const personIcon = userStatusLink ? userStatusLink.querySelector('.material-symbols-outlined') : null;
    const accountCenterBox = document.getElementById('accountCenterBox');
    const logoutButton = document.getElementById('logoutButton');
    const navbar = document.getElementById('navbar');
    const userRoleDisplay = document.getElementById('userRoleDisplay');

    let listenersActive = false;

    if (accountCenterBox) {
        accountCenterBox.style.display = 'none';
        accountCenterBox.classList.remove('is-active');
    }

    if (verifiedIcon) {
        verifiedIcon.style.display = 'none';
    }

    function positionAccountCenterBox() {
        if (userStatusLink && accountCenterBox && navbar) {
            const linkRect = userStatusLink.getBoundingClientRect();
            const navbarRect = navbar.getBoundingClientRect();
            const offsetRight = 15;
            accountCenterBox.style.left = `${linkRect.right - accountCenterBox.offsetWidth + offsetRight}px`;
        }
    }

    function handleUserStatusLinkClick(event) {
        event.preventDefault();
        event.stopPropagation();
        const isActive = accountCenterBox.classList.toggle('is-active');
        if (isActive) {
            accountCenterBox.style.display = 'flex';
            positionAccountCenterBox();
        } else {
            setTimeout(() => {
                if (!accountCenterBox.classList.contains('is-active')) {
                    accountCenterBox.style.display = 'none';
                }
            }, 300);
        }
    }

    function handleDocumentClick(event) {
        if (accountCenterBox && userStatusLink && accountCenterBox.classList.contains('is-active') &&
            !userStatusLink.contains(event.target) &&
            !accountCenterBox.contains(event.target)) {
            accountCenterBox.classList.remove('is-active');
            setTimeout(() => {
                if (!accountCenterBox.classList.contains('is-active')) {
                    accountCenterBox.style.display = 'none';
                }
            }, 300);
        }
    }

    async function handleLogoutButtonClick() {
        try {
            const logoutResponse = await fetch('php/logout_all.php', {
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

    if (userStatusLink && loggedInUsernameSpan && personIcon && accountCenterBox && logoutButton && navbar && userRoleDisplay && verifiedIcon) {
        console.log('DOM elements for user status and logout found. Attempting to fetch user status.');
        try {
            const response = await fetch('php/user.php');
            const data = await response.json();
            if (data.username) {
                loggedInUsernameSpan.textContent = data.username;
                loggedInUsernameSpan.style.display = 'inline-block';
                personIcon.style.display = 'inline-block';
                userStatusLink.href = '#';
                userStatusLink.setAttribute('aria-label', `Logged in as ${data.username}`);
                if (data.role === 1) {
                    verifiedIcon.style.display = 'inline-block';
                    userRoleDisplay.textContent = 'Admin';
                } else if (data.role === 0) {
                    verifiedIcon.style.display = 'none';
                    userRoleDisplay.textContent = 'User';
                } else {
                    verifiedIcon.style.display = 'none';
                    userRoleDisplay.textContent = 'Tidak Dikenal';
                }
                positionAccountCenterBox();
                if (!listenersActive) {
                    userStatusLink.addEventListener('click', handleUserStatusLinkClick);
                    document.addEventListener('click', handleDocumentClick);
                    logoutButton.addEventListener('click', handleLogoutButtonClick);
                    window.addEventListener('resize', positionAccountCenterBox);
                    window.addEventListener('scroll', positionAccountCenterBox);
                    listenersActive = true;
                }
            } else {
                loggedInUsernameSpan.textContent = '';
                loggedInUsernameSpan.style.display = 'none';
                personIcon.style.display = 'inline-block';
                userStatusLink.href = 'login.html';
                userStatusLink.setAttribute('aria-label', 'Login');
                userRoleDisplay.textContent = '';
                verifiedIcon.style.display = 'none';
                accountCenterBox.classList.remove('is-active');
                accountCenterBox.style.display = 'none';
                if (listenersActive) {
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
            loggedInUsernameSpan.textContent = '';
            loggedInUsernameSpan.style.display = 'none';
            personIcon.style.display = 'inline-block';
            userStatusLink.href = 'login.html';
            accountCenterBox.classList.remove('is-active');
            accountCenterBox.style.display = 'none';
            userRoleDisplay.textContent = '';
            verifiedIcon.style.display = 'none';
            if (listenersActive) {
                userStatusLink.removeEventListener('click', handleUserStatusLinkClick);
                document.removeEventListener('click', handleDocumentClick);
                logoutButton.removeEventListener('click', handleLogoutButtonClick);
                window.removeEventListener('resize', positionAccountCenterBox);
                window.removeEventListener('scroll', positionAccountCenterBox);
                listenersActive = false;
            }
        }
    } else {
        console.warn('One or more DOM elements (userStatusLink, etc) not found. Main user script block skipped.');
    }

    // =========================================================================
    // === BAGIAN 2: [TRIK] Blok Kode Tambahan KHUSUS Untuk Overlay ===
    // =========================================================================
    // Blok ini akan berjalan secara independen dari blok di atas.
    
    const roleOverlayElement = document.getElementById('role-overlay');
    
    // Hanya jalankan jika halaman ini memiliki elemen overlay
    if (roleOverlayElement) {
        try {
            // Kita fetch ulang data user di sini khusus untuk overlay
            // Path relatif ini penting untuk halaman di dalam folder /html
            const response = await fetch('../php/user.php');
            const data = await response.json();

            if (data.role == 1) { // Admin
                roleOverlayElement.classList.add('is-hidden');
            } else { // User, tidak login, atau role lainnya
                roleOverlayElement.classList.remove('is-hidden');
            }
        } catch (error) {
            console.error('Error handling overlay visibility:', error);
            // Jika terjadi error, pastikan overlay tetap muncul untuk keamanan
            roleOverlayElement.classList.remove('is-hidden');
        }
    }
});