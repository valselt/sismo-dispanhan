<?php
header('Content-Type: application/json');
require_once 'koneksi.php';

// Ambil data JSON mentah dari permintaan
$input = json_decode(file_get_contents('php://input'), true);
$action = $input['action'] ?? '';

// --- FUNGSI 1: MENGAMBIL DATA DARI MYSQL ---
if ($action === 'get_data_for_ai') {
    $sql = "SELECT tahun, tanaman, tipe, satuan, bulan, daerah, total FROM tbl_prognosa WHERE 1=1";
    $params = [];
    $types = "";

    if (!empty($input['tipe'])) {
        $sql .= " AND tipe = ?";
        $params[] = $input['tipe'];
        $types .= "s";
    }
    if (!empty($input['tanaman'])) {
        $sql .= " AND tanaman = ?";
        $params[] = $input['tanaman'];
        $types .= "s";
    }
    if (!empty($input['bulan'])) {
        $sql .= " AND bulan = ?";
        $params[] = $input['bulan'];
        $types .= "s";
    }
    if (!empty($input['tahun'])) {
        $sql .= " AND tahun = ?";
        $params[] = $input['tahun'];
        $types .= "i";
    }

    $stmt = $conn->prepare($sql);
    if ($types) {
        $stmt->bind_param($types, ...$params);
    }
    $stmt->execute();
    $result = $stmt->get_result();
    $data = $result->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode($data);
    exit;
}

// --- FUNGSI 2: MENGIRIM PROMPT KE OLLAMA ---
if ($action === 'get_ai_summary') {
    // === BAGIAN YANG DIPERBARUI SESUAI "OLLAMA LIST" ANDA ===
    $modelMap = [
        'phi-4-mini-reasoning' => 'phi4-mini-reasoning:3.8b',
        'mistrallite' => 'mistrallite:7b',
        'nemotron-mini' => 'nemotron-mini:4b',
        'granite-3-3' => 'granite3.3:2b',
        'gemma-3' => 'gemma3:4b',
        'qwen-3' => 'qwen3:4b',
        'llama-3-2' => 'llama3.2:3b',
        'deepseek-r1' => 'deepseek-r1:1.5b',
        'gemma-3n' => 'gemma3n:e2b'
    ];
    // =======================================================

    $selectedModel = $input['model'] ?? '';
    $ollamaModel = $modelMap[$selectedModel] ?? 'llama3.2:3b'; // Default ke salah satu model yang ada

    $dataFromDb = $input['data'] ?? [];
    if (empty($dataFromDb)) {
        echo json_encode(['error' => 'Tidak ada data untuk dianalisis.']);
        exit;
    }

    $prompt = "Anda Merupakan Seorang Data Scientist. Anda diberikan data tabular dengan kolom berikut: Tahun, Tanaman, Tipe, Satuan, Bulan, Daerah, dan Total. Data ini disajikan dalam format baris per baris.\n\n";
    $count = 1;
    foreach ($dataFromDb as $row) {
        $prompt .= "Data Ke-{$count} :{" . implode(',', $row) . "}\n";
        $count++;
    }
    $prompt .= "\nBerdasarkan data di atas, analisis secara internal untuk mengidentifikasi temuan utama, tren, atau pola. Kemudian, **sajikan hanya kesimpulan akhir Anda dalam satu atau beberapa paragraf yang komprehensif sebagaimana Data Scientist bekerja. Jangan tampilkan langkah-langkah pemikiran, penalaran, atau proses analisis Anda.** Gunakan Bahasa Indonesia yang lugas dan mudah dimengerti. Maksmimal 3 Paragraf";
    
    $ollamaPayload = json_encode([
        'model' => $ollamaModel,
        'prompt' => $prompt,
        'stream' => false
    ]);

    $ch = curl_init('http://localhost:11434/api/generate');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $ollamaPayload);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type:application/json']);
    
    $response = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpcode >= 400) {
        // Teruskan pesan error dari Ollama jika ada
        echo $response;
        exit;
    }
    
    echo $response;
    exit;
}

echo json_encode(['error' => 'Aksi tidak valid.']);
?>