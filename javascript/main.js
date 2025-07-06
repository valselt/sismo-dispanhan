// -------------Navbar shrink effect on scroll----------------------

document.addEventListener("DOMContentLoaded", function () {
  // Fungsi ini hanya untuk efek navbar, tidak berhubungan dengan peta.
  function handleNavbarShrink() {
    const navbar = document.getElementById("navbar");
    if (!navbar) return; // Keluar jika navbar tidak ada di halaman

    const container1 = document.querySelector(".container-1");
    const containerNavbar = document.querySelector(".container-navbar");
    const buttons = document.querySelectorAll(".button-navbar");
    const texts = document.querySelectorAll(".text-button-navbar");
    const container1Height = container1 ? container1.offsetHeight : 300; // Default height if not found

    if (window.scrollY > container1Height - 100) {
      navbar.classList.add("shrink");
      containerNavbar.classList.add("shrink");
      buttons.forEach((btn) => btn.classList.add("shrink"));
      texts.forEach((text) => text.classList.add("shrink"));
    } else {
      navbar.classList.remove("shrink");
      containerNavbar.classList.remove("shrink");
      buttons.forEach((btn) => btn.classList.remove("shrink"));
      texts.forEach((text) => text.classList.remove("shrink"));
    }
  }

  // Tambahkan event listener untuk menjalankan fungsi di atas saat scroll
  window.addEventListener("scroll", handleNavbarShrink);
});


document.addEventListener('DOMContentLoaded', () => {
    
    // Variabel untuk menyimpan status login pengguna
    let userIsLoggedIn = false;

    // 1. Fungsi untuk memeriksa status login dari server
    async function checkLoginStatus() {
        try {
            // Menggunakan user.php yang sudah ada untuk mendapatkan data sesi
            const response = await fetch('php/user.php');
            const userData = await response.json();
            
            // Jika ada data username, berarti pengguna sudah login
            if (userData && userData.username) {
                userIsLoggedIn = true;
            }
        } catch (error) {
            console.error('Gagal memeriksa status login:', error);
            // Jika terjadi error, anggap pengguna belum login
            userIsLoggedIn = false;
        }
    }

    // 2. Fungsi yang akan dijalankan saat tombol/link diklik
    function handleProtectedClick(event) {
        // Periksa status login
        if (!userIsLoggedIn) {
            // Mencegah aksi default (misalnya, link tidak akan berpindah halaman)
            event.preventDefault(); 
            // Tampilkan peringatan
            alert('Login terlebih dahulu');
        }
        // Jika sudah login, tidak ada yang terjadi, dan aksi default tombol/link akan berjalan normal.
    }

    // 3. Jalankan pengecekan, lalu pasang event listener ke elemen-elemen terkait
    async function initializeAuthCheck() {
        // Tunggu hingga status login selesai diperiksa
        await checkLoginStatus();

        // Dapatkan referensi ke semua tombol yang ingin dilindungi
        const analisisHargaButton = document.querySelector('.button-harga');
        const analisisStokButton = document.querySelector('.button-stok');

        // Pasang event listener ke setiap elemen
        if (analisisHargaButton) {
            analisisHargaButton.addEventListener('click', handleProtectedClick);
        }
        if (analisisStokButton) {
            analisisStokButton.addEventListener('click', handleProtectedClick);
        }
    }

    // Panggil fungsi inisialisasi
    initializeAuthCheck();

});