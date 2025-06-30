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
    buttons.forEach(btn => btn.classList.add("shrink"));
    texts.forEach(text => text.classList.add("shrink"));
  } else {
    navbar.classList.remove("shrink");
    containerNavbar.classList.remove("shrink");
    buttons.forEach(btn => btn.classList.remove("shrink"));
    texts.forEach(text => text.classList.remove("shrink"));
  }
}

function cleanValue(val) {
  if (!val) return '';
  return val.toLowerCase().replace(/\s+/g, '');
}

function getDropdownValues(returnObj = false) {
  const tipe = cleanValue(document.getElementById("dropdown-tipe").value);
  const tanaman = cleanValue(document.getElementById("dropdown-tanaman").value);
  const bulan = cleanValue(document.getElementById("dropdown-bulan").value);
  const tahun = cleanValue(document.getElementById("dropdown-tahun").value);
  if (!returnObj) {
    console.log(`Pilihan: Tipe=${tipe}, Tanaman=${tanaman}, Bulan=${bulan}, Tahun=${tahun}`);
  }
  return { tipe, tanaman, bulan, tahun };
}

// Inisialisasi peta
let map = L.map('map').setView([-7.150975, 110.140259], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

let geojsonLayer;
let csvData = [];

// Load data bersamaan
Promise.all([
  fetch('prognosa.csv').then(res => res.text()),
  fetch('all_kab_kot_indo.geojson').then(res => res.json())
]).then(([csvText, geojson]) => {
  csvData = Papa.parse(csvText, { header: true }).data;

  const jateng = geojson.features.filter(f => {
    const prov = (f.properties.prov_name || f.properties.provinsi || '').toLowerCase();
    return prov.includes('jawa tengah');
  });

  console.log('Fitur Jateng ditemukan:', jateng.length);
  console.log('Contoh properties:', jateng[0]?.properties);

  geojsonLayer = L.geoJson({ type: "FeatureCollection", features: jateng }, {
    style: styleFeature,
    onEachFeature: onEachFeature
  }).addTo(map);
});

// Style fitur
function styleFeature(feature) {
  const dropdown = getDropdownValues(true);
  const daerah = cleanValue(feature.properties.name);

  const match = csvData.find(d =>
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
    color: 'white',
    fillOpacity: 0.7
  };
}

function getColor(tipe, value) {
  if (tipe === "luastanam") {
    if (value === 0) return 'blue';
    if (value <= 65.5) return 'green';
    if (value <= 1177.74) return 'orange';
    if (value <= 4146.45) return 'red';
    return 'purple';
  }
  if (tipe === "luaspanen") {
    if (value === 0) return 'blue';
    if (value <= 247.36) return 'green';
    if (value <= 1821.54) return 'orange';
    if (value <= 3000) return 'red';
    return 'purple';
  }
  if (tipe === "produksi") {
    if (value === 0) return 'blue';
    if (value <= 4.48) return 'green';
    if (value <= 145.0) return 'orange';
    if (value <= 1260.0) return 'red';
    return 'purple';
  }
  return 'gray';
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: e => {
      const layer = e.target;
      layer.setStyle({ weight: 3, color: '#666' });
    },
    mouseout: e => {
      geojsonLayer.resetStyle(e.target);
    }
  });
  layer.bindPopup(feature.properties.name || 'Daerah');
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
      'Biru': '0.0',
      'Hijau': '0.0 – 65.5',
      'Orange': '65.5 – 1177.74',
      'Merah': '1177.74 – 4146.45',
      'Ungu': '4146.45 – 37646.0'
    },
    luaspanen: {
      'Biru': '0.0',
      'Hijau': '0.0 – 247.36',
      'Orange': '247.36 – 1821.54',
      'Merah': '1821.54 – 3000',
      'Ungu': '3000'
    },
    produksi: {
      'Biru': '0.0',
      'Hijau': '0.0 – 4.48',
      'Orange': '4.48 – 145.0',
      'Merah': '145.0 – 1260.0',
      'Ungu': '1260.0'
    }
  };

  // Get the corresponding range based on selected tipe
  const selectedTipe = values.tipe;
  const rangesForTipe = ranges[selectedTipe] || {};

  // Update the <p> elements with the corresponding values
  document.getElementById('biru-tulisan').innerText = rangesForTipe['Biru'] || 'Biru';
  document.getElementById('hijau-tulisan').innerText = rangesForTipe['Hijau'] || 'Hijau';
  document.getElementById('orange-tulisan').innerText = rangesForTipe['Orange'] || 'Orange';
  document.getElementById('merah-tulisan').innerText = rangesForTipe['Merah'] || 'Merah';
  document.getElementById('ungu-tulisan').innerText = rangesForTipe['Ungu'] || 'Ungu';
}


// RUN FUNCTION OF THE ABOVE
function fusionDropdown(){
  updateMap();
  updateIndicators();      
}

["dropdown-tipe", "dropdown-tanaman", "dropdown-bulan", "dropdown-tahun"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", fusionDropdown);
  });

window.addEventListener("scroll", handleNavbarShrink);
