// javascript/analisis-harga.js

document.addEventListener('DOMContentLoaded', function () {
    const generateButton = document.getElementById('btn-generate-prediction');
    const wrapperHasil = document.querySelector('.inside-wrapper-1-4');
    const resultsContainer = document.querySelector('.container-hasil-analisis');

    generateButton.addEventListener('click', function (event) {
        event.preventDefault(); // Mencegah form submit default

        // Ambil semua value dari dropdown
        const jenis = document.getElementById('dropdown-jenis-start-analisis').value;
        const tingkat = document.getElementById('dropdown-tingkat-analisis').value;
        const tahun_awal = document.getElementById('dropdown-tahun-awal-analisis').value;
        const tahun_akhir = document.getElementById('dropdown-tahun-akhir-analisis').value;
        const hari_prediksi = document.getElementById('dropdown-forecasthari-analisis-harga').value;
        const model = document.getElementById('dropdown-model-analisis-harga').value;

        // ==============================================================================
        // -- BLOK VALIDASI BARU --
        // Cek apakah ada value yang kosong
        // ==============================================================================
        if (!jenis || !tingkat || !tahun_awal || !tahun_akhir || !hari_prediksi || !model) {
            alert('Mohon lengkapi semua pilihan sebelum melakukan analisis.');
            return; // Hentikan eksekusi fungsi jika ada yang kosong
        }
        wrapperHasil.style.display = 'flex';
        // Tampilkan status loading
        resultsContainer.innerHTML = '<div class="loading">Menganalisis data, mohon tunggu... ⏳</div>';
        
        // Buat objek formData setelah validasi berhasil
        const formData = {
            jenis: jenis,
            tingkat: tingkat,
            tahun_awal: tahun_awal,
            tahun_akhir: tahun_akhir,
            hari_prediksi: hari_prediksi,
            model: model,
        };

        // Kirim data ke server Flask menggunakan Fetch API
        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
        .then(response => response.json())
        .then(data => {
            // Hapus status loading
            resultsContainer.innerHTML = '';

            if (data.status === 'success') {
                // Jika sukses, buat elemen gambar dan tampilkan plot
                const img1 = document.createElement('img');
                img1.src = 'data:image/png;base64,' + data.plot1;
                img1.classList.add('hasil-plot');

                const img2 = document.createElement('img');
                img2.src = 'data:image/png;base64,' + data.plot2;
                img2.classList.add('hasil-plot');

                resultsContainer.appendChild(img1);
                resultsContainer.appendChild(img2);
            } else {
                // Jika error, tampilkan pesan error
                resultsContainer.innerHTML = `<div class="error">Terjadi Kesalahan: ${data.message}</div>`;
            }
        })
        .catch(error => {
            // Tangani error jaringan
            resultsContainer.innerHTML = `<div class="error">Gagal terhubung ke server. Error: ${error}</div>`;
            console.error('Error:', error);
        });
    });
});