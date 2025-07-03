// photoprofile.js
let cropper; // Variabel global untuk instance Cropper.js

// Asumsi loadUserData ada di global scope dari account-center.js
// Jika tidak, Anda perlu cara lain untuk memuat ulang data (misalnya refresh halaman)
// const loadUserData = window.loadUserData; // Contoh jika loadUserData diekspos secara global

document.addEventListener('DOMContentLoaded', () => {
    // Referensi DOM untuk popup Change Photo
    const changePhotoButton = document.getElementById('changePhotoButton');
    const changePhotoOverlay = document.getElementById('changePhotoOverlay');
    const changePhotoPopup = document.getElementById('changePhotoPopup');
    const closeChangePhotoPopupButton = document.getElementById('closeChangePhotoPopupButton');
    const dropArea = document.getElementById('dropArea');
    const photoInput = document.getElementById('photoInput');
    const selectPhotoButton = document.getElementById('selectPhotoButton');
    const imageForCropping = document.getElementById('imageForCropping'); // Ini adalah elemen <img> untuk Cropper.js
    const previewContainerDiv = document.querySelector('.image-preview-container'); // Div yang membungkus <img>
    const cropAndUploadButton = document.getElementById('cropAndUploadButton');
    const cancelCropButton = document.getElementById('cancelCropButton');

    // Referensi DOM untuk popup Delete Photo
    const deletePhotoButton = document.getElementById('deletePhotoButton');
    const deletePhotoOverlay = document.getElementById('deletePhotoOverlay');
    const deletePhotoPopup = document.getElementById('deletePhotoPopup');
    const closeDeletePhotoPopupButton = document.getElementById('closeDeletePhotoPopupButton');
    const cancelDeletePhotoConfirmButton = document.getElementById('cancelDeletePhotoConfirmButton');
    const confirmDeletePhotoButton = document.getElementById('confirmDeletePhotoButton');

    // --- Referensi DOM untuk popup HAPUS AKUN UTAMA (Dipindahkan ke sini) ---
    const deleteAccountButton = document.getElementById('deleteAccountButton');
    const deleteAccountOverlay = document.getElementById('deleteAccountOverlay');
    const deleteAccountPopup = document.getElementById('deleteAccountPopup');
    const closeDeleteAccountPopupButtonMain = document.getElementById('closeDeleteAccountPopupButton'); // Ubah ID ini agar tidak konflik
    const cancelDeleteAccountButtonMain = document.getElementById('cancelDeleteAccountButton');
    const confirmDeleteAccountButtonMain = document.getElementById('confirmDeleteAccountButton');


    // Fungsi untuk menampilkan/menyembunyikan popup Change Photo
    function showChangePhotoPopup() {
        changePhotoOverlay.style.display = 'flex';
        changePhotoPopup.style.display = 'flex';
        // Reset state popup setiap kali dibuka
        dropArea.style.display = 'flex'; // Tampilkan area drop
        previewContainerDiv.style.display = 'none'; // Sembunyikan container preview
        cropAndUploadButton.style.display = 'none'; // Sembunyikan tombol crop
        cancelCropButton.style.display = 'none'; // Sembunyikan tombol batal crop
        if (cropper) {
            cropper.destroy(); // Hancurkan instance cropper sebelumnya
            cropper = null;
        }
        imageForCropping.src = ''; // Bersihkan gambar
    }

    function hideChangePhotoPopup() {
        changePhotoOverlay.style.display = 'none';
        changePhotoPopup.style.display = 'none';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        imageForCropping.src = '';
        photoInput.value = ''; // Reset input file
    }

    // Fungsi untuk menampilkan/menyembunyikan popup Delete Photo
    function showDeletePhotoPopup() {
        deletePhotoOverlay.style.display = 'flex';
        deletePhotoPopup.style.display = 'flex';
    }

    function hideDeletePhotoPopup() {
        deletePhotoOverlay.style.display = 'none';
        deletePhotoPopup.style.display = 'none';
    }

    // --- FUNGSI UNTUK POPUP HAPUS AKUN UTAMA (Dipindahkan ke sini) ---
    function showDeleteAccountPopup() {
        deleteAccountOverlay.style.display = 'flex';
        deleteAccountPopup.style.display = 'flex';
    }

    function hideDeleteAccountPopup() {
        deleteAccountOverlay.style.display = 'none';
        deleteAccountPopup.style.display = 'none';
    }


    // Event Listeners untuk popup Change Photo
    if (changePhotoButton) {
        changePhotoButton.addEventListener('click', showChangePhotoPopup);
    }
    if (closeChangePhotoPopupButton) {
        closeChangePhotoPopupButton.addEventListener('click', hideChangePhotoPopup);
    }
    if (changePhotoOverlay) {
        changePhotoOverlay.addEventListener('click', (event) => {
            if (event.target === changePhotoOverlay) {
                hideChangePhotoPopup();
            }
        });
    }

    // Event Listener untuk tombol 'Pilih Foto'
    if (selectPhotoButton) {
        selectPhotoButton.addEventListener('click', () => {
            photoInput.click(); // Memicu klik pada input file tersembunyi
        });
    }

    // Event Listener untuk input file (saat file dipilih)
    if (photoInput) {
        photoInput.addEventListener('change', (event) => {
            const files = event.target.files;
            if (files && files.length > 0) {
                handleFiles(files);
            }
        });
    }

    // Drag and Drop functionality
    if (dropArea) {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        dropArea.addEventListener('drop', handleDrop, false);
    }

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function highlight() {
        dropArea.classList.add('highlight');
    }

    function unhighlight() {
        dropArea.classList.remove('highlight');
    }

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        const file = files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                imageForCropping.src = e.target.result;
                dropArea.style.display = 'none';
                previewContainerDiv.style.display = 'block';
                cropAndUploadButton.style.display = 'inline-flex';
                cancelCropButton.style.display = 'inline-flex';

                if (cropper) {
                    cropper.destroy();
                }
                cropper = new Cropper(imageForCropping, { // Menggunakan imageForCropping
                    aspectRatio: 1,
                    viewMode: 1,
                    autoCropArea: 0.8,
                    ready: function () {
                        // Tidak perlu listener tombol Batal di sini, sudah di luar
                    }
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('Harap pilih file gambar (JPG atau PNG).');
        }
    }

    // Event Listener untuk tombol Crop & Unggah
    if (cropAndUploadButton) {
        cropAndUploadButton.addEventListener('click', () => {
            if (cropper) {
                cropper.getCroppedCanvas({
                    width: 256,
                    height: 256,
                    imageSmoothingEnabled: true,
                    imageSmoothingQuality: 'high',
                }).toBlob(async (blob) => {
                    const formData = new FormData();
                    formData.append('profilePicture', blob, 'profile.png');

                    try {
                        const response = await fetch('../../php/photoprofile.php', {
                            method: 'POST',
                            body: formData,
                        });
                        const data = await response.json();

                        if (data.status === 'success') {
                            alert(data.message);
                            hideChangePhotoPopup();
                            // Panggil loadUserData dari account-center.js
                            if (typeof loadUserData === 'function') {
                                await loadUserData();
                            } else {
                                console.warn('loadUserData function not found. Please refresh the page manually.');
                                location.reload();
                            }
                        } else {
                            alert('Gagal mengunggah foto profil: ' + data.message);
                        }
                    } catch (error) {
                        console.error('Error uploading photo:', error);
                        alert('Terjadi kesalahan saat mengunggah foto profil. Silakan coba lagi.');
                    }
                }, 'image/png', 0.9);
            } else {
                alert('Tidak ada gambar untuk di-crop. Harap pilih foto terlebih dahulu.');
            }
        });
    }

    // Event Listener untuk tombol Batal Crop
    if (cancelCropButton) {
        cancelCropButton.addEventListener('click', () => {
            hideChangePhotoPopup();
        });
    }


    // --- Logika HAPUS FOTO PROFILE ---
    if (deletePhotoButton) {
        deletePhotoButton.addEventListener('click', showDeletePhotoPopup);
    }
    if (closeDeletePhotoPopupButton) {
        closeDeletePhotoPopupButton.addEventListener('click', hideDeletePhotoPopup);
    }
    if (deletePhotoOverlay) {
        deletePhotoOverlay.addEventListener('click', (event) => {
            if (event.target === deletePhotoOverlay) {
                hideDeletePhotoPopup();
            }
        });
    }
    if (cancelDeletePhotoConfirmButton) {
        cancelDeletePhotoConfirmButton.addEventListener('click', hideDeletePhotoPopup);
    }

    if (confirmDeletePhotoButton) {
        confirmDeletePhotoButton.addEventListener('click', async () => {
            try {
                const response = await fetch('../../php/photoprofile.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: 'delete_photo=true',
                });
                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message);
                    hideDeletePhotoPopup();
                    if (typeof loadUserData === 'function') {
                        await loadUserData();
                    } else {
                        console.warn('loadUserData function not found. Please refresh the page manually.');
                        location.reload();
                    }
                } else {
                    alert('Gagal menghapus foto profil: ' + data.message);
                    hideDeletePhotoPopup();
                }
            } catch (error) {
                console.error('Error deleting photo:', error);
                alert('Terjadi kesalahan saat menghapus foto profil. Silakan coba lagi.');
                hideDeletePhotoPopup();
            }
        });
    }

    // --- EVENT LISTENERS UNTUK POPUP HAPUS AKUN UTAMA (Dipindahkan ke sini) ---
    // Pastikan ID closeDeleteAccountPopupButtonMain dan cancelDeleteAccountButtonMain ada di HTML
    if (deleteAccountButton) {
        deleteAccountButton.addEventListener('click', showDeleteAccountPopup);
    }

    if (closeDeleteAccountPopupButtonMain) { // Gunakan ID yang sudah diubah
        closeDeleteAccountPopupButtonMain.addEventListener('click', hideDeleteAccountPopup);
    }

    if (cancelDeleteAccountButtonMain) { // Gunakan ID yang sudah diubah
        cancelDeleteAccountButtonMain.addEventListener('click', hideDeleteAccountPopup);
    }

    if (deleteAccountOverlay) {
        deleteAccountOverlay.addEventListener('click', (event) => {
            if (event.target === deleteAccountOverlay) {
                hideDeleteAccountPopup();
            }
        });
    }

    if (confirmDeleteAccountButtonMain) { // Gunakan ID yang sudah diubah
        confirmDeleteAccountButtonMain.addEventListener('click', async () => {
            try {
                const response = await fetch('../../php/delete_account.php', {
                    method: 'POST'
                });
                const data = await response.json();

                if (data.status === 'success') {
                    alert(data.message);
                    window.location.href = '../../index.html';
                } else {
                    alert('Gagal menghapus akun: ' + data.message);
                    hideDeleteAccountPopup();
                }
            } catch (error) {
                console.error('Error deleting account:', error);
                alert('Terjadi kesalahan saat menghapus akun. Silakan coba lagi.');
                hideDeleteAccountPopup();
            }
        });
    }
});