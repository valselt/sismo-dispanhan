document.addEventListener("DOMContentLoaded", function () {
  let map;
  let geojsonLayer;
  let allData = []; // Variabel untuk menyimpan semua data dari database
  let geojsonJateng = []; // Variabel untuk menyimpan data GeoJSON Jawa Tengah

  // Fungsi untuk membersihkan dan menstandarkan string
  function cleanValue(val) {
    if (!val) return "";
    return val.toLowerCase().replace(/\s+/g, "");
  }

  // --- FUNGSI DARI KODE LAMA ANDA, UNTUK KECOCOKAN ---
  // Fungsi ini dibuat agar 'updateIndicators' bisa berjalan persis seperti kode lama
  function getDropdownValues(returnObj = false) {
    const tipe = cleanValue(document.getElementById("dropdown-tipe").value);
    const tanaman = cleanValue(document.getElementById("dropdown-tanaman").value);
    const bulan = cleanValue(document.getElementById("dropdown-bulan").value);
    const tahun = cleanValue(document.getElementById("dropdown-tahun").value);
    // Kita hanya butuh mengembalikan objek agar sama dengan `(true)`
    return { tipe, tanaman, bulan, tahun };
  }

  // Mengambil semua data (database dan geojson) terlebih dahulu
  function prefetchData() {
    Promise.all([
      fetch("php/data.php").then((res) => res.json()),
      fetch("data/all_kab_kot_indo.geojson").then((res) => res.json()),
    ])
      .then(([dbData, allGeojson]) => {
        if (dbData.error) {
          throw new Error("Server error: " + dbData.error);
        }
        allData = dbData;

        geojsonJateng = allGeojson.features.filter((f) => {
          const prov = (f.properties.prov_name || "").toLowerCase();
          return prov.includes("jawa tengah");
        });

        if (geojsonJateng.length === 0) {
            console.error("Tidak ada fitur GeoJSON untuk Jawa Tengah yang ditemukan.");
        }

        initializeMap();
        setupEventListeners();
        updateMap();
      })
      .catch((error) => {
        console.error("Gagal mengambil data awal:", error);
        document.getElementById("map").innerHTML =
          "<p style='color:red; text-align:center;'>Gagal memuat data. Silakan coba lagi nanti.</p>";
      });
  }

  function initializeMap() {
    map = L.map("map").setView([-7.150975, 110.140259], 8);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
  }

  function getColor(tipe, value, isDataAvailable) {
    if (!isDataAvailable) return "#808080";
    if (value === 0) return "#4B0082";

    const thresholds = {
      luastanam: [4146.45, 1177.74, 65.5, 0],
      luaspanen: [3000, 1821.54, 247.36, 0],
      produksi: [1260.0, 145.0, 4.48, 0],
    };
    const t = thresholds[tipe] || thresholds.produksi;
    
    return value > t[0] ? "#0000FF"
         : value > t[1] ? "#008000"
         : value > t[2] ? "#FFA500"
         : value > t[3] ? "#FF0000"
         : "#4B0082";
  }

  // --- INI ADALAH FUNGSI YANG SAMA PERSIS DENGAN PERMINTAAN ANDA ---
  function updateIndicators() {
    const values = getDropdownValues(true); // Get the selected values

    // Set the ranges for each dropdown value
    let ranges = {
      luastanam: {
        "Level 1": "0.0",
        "Level 2": "0.0 - 65.5",
        "Level 3": "65.5 - 1177.74",
        "Level 4": "1177.74 - 4146.45",
        "Level 5": "≥ 4146.45",
      },
      luaspanen: {
        "Level 1": "0.0",
        "Level 2": "0.0 - 247.36",
        "Level 3": "247.36 - 1821.54",
        "Level 4": "1821.54 - 3000",
        "Level 5": "≥ 3000",
      },
      produksi: {
        "Level 1": "0.0",
        "Level 2": "0.0 - 4.48",
        "Level 3": "4.48 - 145.0",
        "Level 4": "145.0 - 1260.0",
        "Level 5": "≥ 1260.0",
      },
    };

    // Get the corresponding range based on selected tipe
    const selectedTipe = values.tipe;
    const rangesForTipe = ranges[selectedTipe] || {};

    // Update the <p> elements with the corresponding values
    document.getElementById("level1-tulisan").innerText =
      rangesForTipe["Level 1"] || "Level 1";
    document.getElementById("level2-tulisan").innerText =
      rangesForTipe["Level 2"] || "Level 2";
    document.getElementById("level3-tulisan").innerText =
      rangesForTipe["Level 3"] || "Level 3";
    document.getElementById("level4-tulisan").innerText =
      rangesForTipe["Level 4"] || "Level 4";
    document.getElementById("level5-tulisan").innerText =
      rangesForTipe["Level 5"] || "Level 5";
  }

  function updateMap() {
    if (geojsonLayer) {
      map.removeLayer(geojsonLayer);
    }

    // Panggil fungsi indicators agar selalu update
    updateIndicators();

    const filters = getDropdownValues(true); // Gunakan fungsi yang sama

    geojsonLayer = L.geoJson(
      { type: "FeatureCollection", features: geojsonJateng },
      {
        style: function (feature) {
          const daerahNama = cleanValue(feature.properties.name);
          
          const match = allData.find(
            (d) =>
              cleanValue(d.daerah) === daerahNama &&
              cleanValue(d.tipe) === filters.tipe &&
              cleanValue(d.tanaman) === filters.tanaman &&
              cleanValue(d.bulan) === filters.bulan &&
              d.tahun == filters.tahun
          );

          const total = match ? match.total : 0;
          const isDataAvailable = !!match;

          return {
            fillColor: getColor(filters.tipe, total, isDataAvailable),
            weight: 2,
            opacity: 1,
            color: "white",
            dashArray: "3",
            fillOpacity: 0.8,
          };
        },
        onEachFeature: function (feature, layer) {
          const daerahNama = feature.properties.name;
          layer.on({
                mouseover: function (e) {
                    const layer = e.target;
                    layer.setStyle({ weight: 4, color: '#666', fillOpacity: 1 });
                    
                    const currentFilters = getDropdownValues(true);
                    const match = allData.find(d => cleanValue(d.daerah) === cleanValue(daerahNama) && cleanValue(d.tipe) === currentFilters.tipe && cleanValue(d.tanaman) === currentFilters.tanaman && cleanValue(d.bulan) === currentFilters.bulan && d.tahun == currentFilters.tahun);
                    const total = match ? match.total.toLocaleString("id-ID") : "Data tidak tersedia";

                    layer.bindPopup(`<b>${daerahNama}</b><br/>Total: ${total}`).openPopup();
                },
                mouseout: function (e) {
                    geojsonLayer.resetStyle(e.target);
                    e.target.closePopup();
                }
            });
        },
      }
    ).addTo(map);
  }

  function setupEventListeners() {
    document.getElementById("dropdown-tipe").addEventListener("change", updateMap);
    document.getElementById("dropdown-tanaman").addEventListener("change", updateMap);
    document.getElementById("dropdown-bulan").addEventListener("change", updateMap);
    document.getElementById("dropdown-tahun").addEventListener("change", updateMap);
  }

  // Mulai proses dengan mengambil semua data yang diperlukan
  prefetchData();
});