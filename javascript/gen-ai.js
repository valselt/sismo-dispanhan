document.addEventListener('DOMContentLoaded', async () => {

    let userIsLoggedIn = false;
    try {
        const response = await fetch('php/user.php');
        const userData = await response.json();
        if (userData && userData.username) {
            userIsLoggedIn = true;
        }
    } catch (error) {
        console.error('Gagal memeriksa status login di gen-ai.js:', error);
        userIsLoggedIn = false;
    }

    // 1. Dapatkan referensi semua elemen yang akan dinonaktifkan
    const generateButton = document.getElementById('generate-ai-button');
    const actualAiResponseContainer = document.getElementById('actual-ai-response');
    const llmDisclaimer = document.getElementById('llm-disclaimer');
    const tipeDropdown = document.getElementById('dropdown-tipe');
    const tanamanDropdown = document.getElementById('dropdown-tanaman');
    const bulanDropdown = document.getElementById('dropdown-bulan');
    const tahunDropdown = document.getElementById('dropdown-tahun'); // Perbaikan
    const aiDropdownButton = document.querySelector('.custom-dropdown-button');

    const elementsToDisable = [
        generateButton,
        tipeDropdown,
        tanamanDropdown,
        bulanDropdown,
        tahunDropdown,
        aiDropdownButton
    ];

    // Initially hide the disclaimer
    llmDisclaimer.style.display = 'none';

    generateButton.addEventListener('click', async () => {

        if (!userIsLoggedIn) {
            alert('Login terlebih dahulu');
            return; // PENTING: Menghentikan eksekusi fungsi di sini
        }

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

        // Hide the disclaimer when a new generation starts
        llmDisclaimer.style.display = 'none';

        // --- BAGIAN YANG DIPERBARUI ---
        // 2. Nonaktifkan semua elemen
        elementsToDisable.forEach(el => el.disabled = true);
        console.log("UI dinonaktifkan selama proses.");
        // --- AKHIR BAGIAN ---

        actualAiResponseContainer.innerHTML = `
            <div class="loading-dots-container">
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
                <span class="loading-dot"></span>
            </div>
        `;

        try {
            console.log("Memulai proses pengambilan data dan AI...");

            // Get data from DB
            const dataResponse = await fetch('php/gen-ai.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'get_data_for_ai', ...filters })
            });
            const dataFromDb = await dataResponse.json();

            if (dataFromDb.length === 0) {
                actualAiResponseContainer.innerHTML = '<p class="text-bold">Data tidak ditemukan dengan filter yang dipilih.</p>';
                return;
            }

            // --- Mulai mengukur waktu respons AI ---
            const aiResponseStartTime = performance.now();
            console.log("Waktu mulai permintaan AI (ms):", aiResponseStartTime.toFixed(2));

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

            const aiResponseEndTime = performance.now();
            const aiResponseTimeMs = aiResponseEndTime - aiResponseStartTime; // Waktu dalam milidetik
            const aiResponseTimeSec = aiResponseTimeMs / 1000; // Konversi ke detik

            console.log("Waktu selesai respons AI (ms):", aiResponseEndTime.toFixed(2));
            console.log(`AI merespons dalam ${aiResponseTimeMs.toFixed(2)} ms atau ${aiResponseTimeSec.toFixed(2)} detik`); // Log dalam ms dan detik

            // --- Akhir pengukuran waktu respons AI ---

            if (aiData.error) {
                throw new Error(aiData.error);
            }

            actualAiResponseContainer.innerHTML = `<p class="text-bold">${aiData.response.replace(/\n/g, '<br>')}</p>`;

            // Show the disclaimer only after a successful AI response
            llmDisclaimer.style.display = 'block';

        } catch (error) {
            console.error("Terjadi kesalahan dalam proses:", error);
            actualAiResponseContainer.innerHTML = `<p class="text-bold">Terjadi kesalahan: ${error.message}</p>`;

        } finally {
            // --- BAGIAN YANG DIPERBARUI ---
            // 3. Aktifkan kembali semua elemen, apa pun hasilnya
            elementsToDisable.forEach(el => el.disabled = false);
            console.log("UI diaktifkan kembali.");
            // --- AKHIR BAGIAN ---
        }
    });
});