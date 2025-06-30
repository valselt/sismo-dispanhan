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

["dropdown-tipe", "dropdown-tanaman", "dropdown-bulan", "dropdown-tahun"]
  .forEach(id => {
    document.getElementById(id).addEventListener("change", updateMap);
  });

window.addEventListener("scroll", handleNavbarShrink);
