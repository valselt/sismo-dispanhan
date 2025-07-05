document.addEventListener('DOMContentLoaded', () => {
    // 1. Dapatkan referensi semua elemen yang akan dinonaktifkan
    const generateButton = document.getElementById('generate-ai-button');
    const responseContainer = document.getElementById('ai-response-container');
    const tipeDropdown = document.getElementById('dropdown-tipe');
    const tanamanDropdown = document.getElementById('dropdown-tanaman');
    const bulanDropdown = document.getElementById('dropdown-bulan');
    const tahunDropdown = document.getElementById('dropdown-tahun');
    const aiDropdownButton = document.querySelector('.custom-dropdown-button');

    const elementsToDisable = [
        generateButton,
        tipeDropdown,
        tanamanDropdown,
        bulanDropdown,
        tahunDropdown,
        aiDropdownButton
    ];

    generateButton.addEventListener('click', async () => {
        const filters = {
            tipe: tipeDropdown.value,
            tanaman: tanamanDropdown.value,
            bulan: bulanDropdown.value,
            tahun: tahunDropdown.value
        };

        if (!filters.tipe || !filters.tanaman || !filters.bulan || !filters.tahun) {
            alert('Harap lengkapi semua filter (Tipe, Tanaman, Bulan, dan Tahun) sebelum melanjutkan.');
            return;
        }
        
        if (!selectedAiModel) {
            alert('Silakan pilih model AI terlebih dahulu.');
            return;
        }

        // --- BAGIAN YANG DIPERBARUI ---
        // 2. Nonaktifkan semua elemen
        elementsToDisable.forEach(el => el.disabled = true);
        console.log("UI dinonaktifkan selama proses.");
        // --- AKHIR BAGIAN ---

        responseContainer.innerHTML = `
            <div class="loading-dots-container">
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
            </div>
        `;
        
        try {
            console.log("Memulai proses pengambilan data dan AI...");
            
            const dataResponse = await fetch('php/gen-ai.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_data_for_ai', ...filters })
            });
            const dataFromDb = await dataResponse.json();

            if (dataFromDb.length === 0) {
                responseContainer.innerHTML = '<p class="text-bold">Data tidak ditemukan dengan filter yang dipilih.</p>';
                return;
            }

            const aiResponse = await fetch('php/gen-ai.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    action: 'get_ai_summary',
                    model: selectedAiModel,
                    data: dataFromDb
                })
            });
            const aiData = await aiResponse.json();

            if (aiData.error) {
                throw new Error(aiData.error);
            }

            responseContainer.innerHTML = `<p class="text-bold">${aiData.response.replace(/\n/g, '<br>')}</p>`;

        } catch (error) {
            console.error("Terjadi kesalahan dalam proses:", error);
            responseContainer.innerHTML = `<p class="text-bold">Terjadi kesalahan: ${error.message}</p>`;
        
        } finally {
            // --- BAGIAN YANG DIPERBARUI ---
            // 3. Aktifkan kembali semua elemen, apa pun hasilnya
            elementsToDisable.forEach(el => el.disabled = false);
            console.log("UI diaktifkan kembali.");
            // --- AKHIR BAGIAN ---
        }
    });
});