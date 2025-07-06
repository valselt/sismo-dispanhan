document.addEventListener('DOMContentLoaded', () => {
    // Referensi ke semua elemen yang dibutuhkan
    const tombolTambah = document.querySelector('.tombol-tabel-add');
    const formContainer = document.getElementById('form-tambah-data');
    const formInput = document.getElementById('form-input-harga');
    const selectTanggal = document.getElementById('tanggal');
    const selectTahun = document.getElementById('tahun');
    const tabelContainer = document.querySelector('.tabel-analisis-harga');
    const rowsPerPageSelector = document.getElementById('rows-per-page');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageNumberDisplay = document.getElementById('page-number');
    const tableInfoDisplay = document.getElementById('tabel-info');

    let currentPage = 1;
    let rowsPerPage = 25;

    // --- MENGISI DROPDOWN SECARA OTOMATIS ---
    for (let i = 1; i <= 31; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectTanggal.appendChild(option);
    }
    for (let i = 2023; i <= 2030; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        selectTahun.appendChild(option);
    }

    // --- FUNGSI-FUNGSI AKSI (EDIT & DELETE) ---
    // Dipindahkan ke dalam agar bisa akses currentPage & rowsPerPage

    async function editRow(rowData) {
        document.getElementById('id_analisis_edit').value = rowData.id_analisis;
        document.getElementById('tingkat').value = rowData.tingkat;
        document.getElementById('tanggal').value = rowData.tanggal;
        document.getElementById('bulan').value = rowData.bulan;
        document.getElementById('tahun').value = rowData.tahun;
        document.getElementById('jenis').value = rowData.jenis;
        document.getElementById('harga').value = rowData.harga;
        document.querySelector('#form-input-harga button[type="submit"]').textContent = 'Update Data';
        formContainer.style.display = 'block';
        formContainer.scrollIntoView({ behavior: 'smooth' });
    }

    async function deleteRow(id) {
        if (confirm(`Apakah Anda yakin ingin menghapus baris dengan ID: ${id}?`)) {
            try {
                const formData = new FormData();
                formData.append('id_analisis', id);
                const response = await fetch('../php/hapus-data-harga.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.status === 'success') {
                    alert(result.message);
                    // PANGGILAN INI SEKARANG AKAN BEKERJA KARENA VARIABEL TERDEFINISI
                    fetchDataAndBuildTable(currentPage, rowsPerPage);
                } else {
                    alert('Error: ' + result.message);
                }
            } catch (error) {
                console.error('Error saat menghapus data:', error);
                alert('Terjadi kesalahan koneksi saat menghapus.');
            }
        }
    }


    // --- EVENT LISTENER ---
    tombolTambah.addEventListener('click', () => {
        formInput.reset();
        document.getElementById('id_analisis_edit').value = '';
        document.querySelector('#form-input-harga button[type="submit"]').textContent = 'Tambahkan';
        const isHidden = formContainer.style.display === 'none';
        formContainer.style.display = isHidden ? 'block' : 'none';
    });

    formInput.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(formInput);
        const idToEdit = formData.get('id_analisis_edit');
        const url = idToEdit ? '../php/update-data-harga.php' : '../php/tambah-data-harga.php';
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData
            });
            const result = await response.json();
            if (result.status === 'success') {
                alert(result.message);
                formInput.reset();
                document.getElementById('id_analisis_edit').value = '';
                document.querySelector('#form-input-harga button[type="submit"]').textContent = 'Tambahkan';
                formContainer.style.display = 'none';
                fetchDataAndBuildTable(currentPage, rowsPerPage);
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error saat mengirim form:', error);
            alert('Terjadi kesalahan. Silakan coba lagi.');
        }
    });

    // --- FUNGSI UTAMA TABEL & PAGINATION ---
    async function fetchDataAndBuildTable(page = 1, rows = 25) {
        try {
            const response = await fetch(`../php/tabel-analisis-harga.php?page=${page}&rows=${rows}`);
            if (!response.ok) throw new Error('Network response was not ok.');
            const result = await response.json();
            const { data, pagination } = result;

            tabelContainer.innerHTML = '';
            if (data.length === 0) {
                tabelContainer.innerHTML = '<p>Tidak ada data untuk ditampilkan.</p>';
                updatePagination({ ...pagination, totalRows: 0, totalPages: 1, currentPage: 1 });
                return;
            }

            const table = document.createElement('table');
            table.className = 'tabel-data';
            table.innerHTML = `
                <thead>
                    <tr>
                        <th>Aksi</th>
                        <th>Tingkat</th>
                        <th>Tanggal</th>
                        <th>Bulan</th>
                        <th>Tahun</th>
                        <th>Jenis</th>
                        <th>Harga</th>
                    </tr>
                </thead>
                <tbody></tbody>
            `;
            const tbody = table.querySelector('tbody');
            data.forEach(row => {
                const tr = document.createElement('tr');
                // Simpan data di elemen untuk event delegation
                tr.dataset.rowData = JSON.stringify(row);
                tr.innerHTML = `
                    <td>
                        <button class="btn-aksi btn-edit" title="Edit">
                            <span class="material-symbols-outlined">edit</span>
                        </button>
                        <button class="btn-aksi btn-delete" title="Delete">
                            <span class="material-symbols-outlined">delete</span>
                        </button>
                    </td>
                    <td>${row.tingkat}</td>
                    <td>${row.tanggal}</td>
                    <td>${row.bulan}</td>
                    <td>${row.tahun}</td>
                    <td>${row.jenis}</td>
                    <td>${row.harga}</td>
                `;
                tbody.appendChild(tr);
            });
            tabelContainer.appendChild(table);
            updatePagination(pagination);
        } catch (error) {
            console.error('Fetch error:', error);
            tabelContainer.innerHTML = '<p>Gagal memuat data. Silakan coba lagi nanti.</p>';
        }
    }
    
    // Event Delegation untuk tombol Aksi
    tabelContainer.addEventListener('click', (event) => {
        const target = event.target.closest('button.btn-aksi');
        if (!target) return;

        const rowElement = target.closest('tr');
        const rowData = JSON.parse(rowElement.dataset.rowData);

        if (target.classList.contains('btn-edit')) {
            editRow(rowData);
        } else if (target.classList.contains('btn-delete')) {
            deleteRow(rowData.id_analisis);
        }
    });

    function updatePagination(pagination) {
        currentPage = pagination.currentPage;
        pageNumberDisplay.textContent = `Halaman ${pagination.currentPage} dari ${pagination.totalPages}`;
        tableInfoDisplay.textContent = `(Total ${pagination.totalRows} baris)`;
        prevButton.disabled = pagination.currentPage === 1;
        nextButton.disabled = pagination.currentPage === pagination.totalPages || pagination.totalRows === 0;
    }

    rowsPerPageSelector.addEventListener('change', () => {
        rowsPerPage = parseInt(rowsPerPageSelector.value, 10);
        fetchDataAndBuildTable(1, rowsPerPage);
    });
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) fetchDataAndBuildTable(currentPage - 1, rowsPerPage);
    });
    nextButton.addEventListener('click', () => {
        const totalPages = parseInt(pageNumberDisplay.textContent.split(' dari ')[1], 10);
        if (currentPage < totalPages) fetchDataAndBuildTable(currentPage + 1, rowsPerPage);
    });

    fetchDataAndBuildTable(currentPage, rowsPerPage);
});