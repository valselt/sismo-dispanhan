function handleNavbarShrink() {
  const navbar = document.getElementById("navbar");
  const container1 = document.querySelector(".container-1");
  const containerNavbar = document.querySelector(".container-navbar");
  const buttons = document.querySelectorAll(".button-navbar");
  const texts = document.querySelectorAll(".text-button-navbar");
  const container1Height = container1.offsetHeight;

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

function cleanValue(val) {
  if (!val) return "";
  return val.toLowerCase().replace(/\s+/g, "");
}

function getDropdownValues(returnObj = false) {
  const tipe = cleanValue(document.getElementById("dropdown-tipe").value);
  const tanaman = cleanValue(document.getElementById("dropdown-tanaman").value);
  const bulan = cleanValue(document.getElementById("dropdown-bulan").value);
  const tahun = cleanValue(document.getElementById("dropdown-tahun").value);
  if (!returnObj) {
    console.log(
      `Pilihan: Tipe=${tipe}, Tanaman=${tanaman}, Bulan=${bulan}, Tahun=${tahun}`
    );
  }
  return { tipe, tanaman, bulan, tahun };
}

// Inisialisasi peta
let map = L.map("map").setView([-7.150975, 110.140259], 8);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

let geojsonLayer;
let csvData = [];

// Load data bersamaan
Promise.all([
  fetch("prognosa.csv").then((res) => res.text()),
  fetch("all_kab_kot_indo.geojson").then((res) => res.json()),
]).then(([csvText, geojson]) => {
  csvData = Papa.parse(csvText, { header: true }).data;

  const jateng = geojson.features.filter((f) => {
    const prov = (
      f.properties.prov_name ||
      f.properties.provinsi ||
      ""
    ).toLowerCase();
    return prov.includes("jawa tengah");
  });

  console.log("Fitur Jateng ditemukan:", jateng.length);
  console.log("Contoh properties:", jateng[0]?.properties);

  geojsonLayer = L.geoJson(
    { type: "FeatureCollection", features: jateng },
    {
      style: styleFeature,
      onEachFeature: onEachFeature,
    }
  ).addTo(map);
});

// Style fitur
function styleFeature(feature) {
  const dropdown = getDropdownValues(true);
  const daerah = cleanValue(feature.properties.name);

  const match = csvData.find(
    (d) =>
      cleanValue(d.daerah) === daerah &&
      cleanValue(d.tipe) === dropdown.tipe &&
      cleanValue(d.tanaman) === dropdown.tanaman &&
      cleanValue(d.bulan) === dropdown.bulan &&
      cleanValue(d.tahun) === dropdown.tahun
  );

  const total = match ? parseFloat(match.total) : 0;
  console.log(`Cek ${feature.properties.name}: Total=${total}`);

  return {
    fillColor: getColor(dropdown.tipe, total),
    weight: 1,
    opacity: 1,
    color: "white",
    fillOpacity: 0.7,
  };
}

function getColor(tipe, value) {
  if (tipe === "luastanam") {
    if (value === 0) return "purple";
    if (value <= 65.5) return "red";
    if (value <= 1177.74) return "orange";
    if (value <= 4146.45) return "green";
    return "blue";
  }
  if (tipe === "luaspanen") {
    if (value === 0) return "purple";
    if (value <= 247.36) return "red";
    if (value <= 1821.54) return "orange";
    if (value <= 3000) return "green";
    return "blue";
  }
  if (tipe === "produksi") {
    if (value === 0) return "purple";
    if (value <= 4.48) return "red";
    if (value <= 145.0) return "orange";
    if (value <= 1260.0) return "green";
    return "blue";
  }
  return "gray";
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: (e) => {
      const layer = e.target;
      layer.setStyle({ weight: 3, color: "#666" });

      // Fetch Daerah name and corresponding total value
      const daerah = feature.properties.name;
      const dropdown = getDropdownValues(true);
      const match = csvData.find(
        (d) =>
          cleanValue(d.daerah) === cleanValue(daerah) &&
          cleanValue(d.tipe) === dropdown.tipe &&
          cleanValue(d.tanaman) === dropdown.tanaman &&
          cleanValue(d.bulan) === dropdown.bulan &&
          cleanValue(d.tahun) === dropdown.tahun
      );

      const total = match ? match.total : "Data not available"; // Default message if no match
      const tipe = dropdown.tipe || "Unknown"; // Menambahkan tipe jika tersedia

      // Map 'tipe' values to human-readable strings
      let tipeText = "";
      if (tipe === "luastanam") {
        tipeText = "Luas Tanam";
      } else if (tipe === "luaspanen") {
        tipeText = "Luas Panen";
      } else if (tipe === "produksi") {
        tipeText = "Produksi";
      } else {
        tipeText = "Unknown"; // For other values of 'tipe'
      }

      // Display the popup with Daerah, tipe (in human-readable form), and total value
      layer.bindPopup(
        `<strong>${daerah}</strong><br>Total ${tipeText}: ${total}`
      ).openPopup();  // Open the popup immediately
    },
    mouseout: (e) => {
      geojsonLayer.resetStyle(e.target);
      e.target.closePopup();  // Close the popup when mouse leaves
    },
  });
}


function updateMap() {
  if (geojsonLayer) {
    geojsonLayer.setStyle(styleFeature);
  }
}

function updateIndicators() {
  const values = getDropdownValues(true); // Get the selected values

  // Set the ranges for each dropdown value
  let ranges = {
    luastanam: {
      "Level 1": "0.0",
      "Level 2": "0.0 – 65.5",
      "Level 3": "65.5 – 1177.74",
      "Level 4": "1177.74 – 4146.45",
      "Level 5": "4146.45 – 37646.0",
    },
    luaspanen: {
      "Level 1": "0.0",
      "Level 2": "0.0 – 247.36",
      "Level 3": "247.36 – 1821.54",
      "Level 4": "1821.54 – 3000",
      "Level 5": "3000",
    },
    produksi: {
      "Level 1": "0.0",
      "Level 2": "0.0 – 4.48",
      "Level 3": "4.48 – 145.0",
      "Level 4": "145.0 – 1260.0",
      "Level 5": "1260.0",
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

// RUN FUNCTION OF THE ABOVE
function fusionDropdown() {
  updateMap();
  updateIndicators();
}

[
  "dropdown-tipe",
  "dropdown-tanaman",
  "dropdown-bulan",
  "dropdown-tahun",
].forEach((id) => {
  document.getElementById(id).addEventListener("change", fusionDropdown);
});

window.addEventListener("scroll", handleNavbarShrink);
