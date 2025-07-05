// VARIABEL GLOBAL BARU: Untuk menyimpan model AI yang dipilih
let selectedAiModel = null;

document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.custom-dropdown-wrapper');
    if (!wrapper) return;

    const button = wrapper.querySelector('.custom-dropdown-button');
    const panel = wrapper.querySelector('.custom-dropdown-panel');
    const items = wrapper.querySelectorAll('.custom-dropdown-item');
    const selectedContentContainer = document.getElementById('selected-item-content');

    // Saat tombol dropdown diklik
    button.addEventListener('click', function(event) {
        event.stopPropagation();
        panel.classList.toggle('show');
    });

    // Saat salah satu item pilihan diklik
    items.forEach(function(item) {
        item.addEventListener('click', function(e) {
            e.preventDefault();

            // Mengambil konten HTML dari item yang dipilih
            const newContentHTML = item.querySelector('.ai-dropdown-things').innerHTML;
            
            // Mengambil value dari atribut data-value
            const value = item.getAttribute('data-value');

            // --- PERUBAHAN UTAMA ADA DI SINI ---
            // Menyimpan model yang dipilih ke dalam variabel global
            selectedAiModel = value;
            
            // Memberi tahu di console bahwa model sudah tersimpan
            console.log("Model AI yang dipilih:", selectedAiModel);

            // Menampilkan konten HTML ke dalam tombol
            selectedContentContainer.innerHTML = newContentHTML;
            
            // Sembunyikan panel setelah memilih
            panel.classList.remove('show');
        });
    });

    // Jika pengguna mengklik di luar area dropdown, tutup panelnya
    window.addEventListener('click', function() {
        if (panel.classList.contains('show')) {
            panel.classList.remove('show');
        }
    });
});