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