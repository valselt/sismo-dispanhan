<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />

<h1 align="center">📊 Sistem Monitoring DISPANHAN</h1>

<p>Aplikasi Berbasis Website Untuk Melakukan Monitoring terhadap Kestabilan dan Stabilisasi Pangan Di Jawa Tengah dengan mengimplementasikan Machine Learning ke Dalamnya.</p>

<div align="center">
  <img src="https://img.shields.io/badge/Docker-%232496ED?style=for-the-badge&logo=docker&logoColor=white">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white">
  <img src="https://img.shields.io/badge/CSS-%23663399?style=for-the-badge&logo=css&logoColor=white">
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black">
  <img src="https://img.shields.io/badge/PHP-%23777BB4?style=for-the-badge&logo=php&logoColor=white">
  <img src="https://img.shields.io/badge/phpmyadmin-%233BABC3?style=for-the-badge&logo=phpmyadmin&logoColor=white">
  <img src="https://img.shields.io/badge/MYSQL-%234479A1?style=for-the-badge&logo=mysql&logoColor=white">
  <img src="https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54">
  <img src="https://img.shields.io/badge/Flask-%233BABC3?style=for-the-badge&logo=flask&logoColor=white">
  
  <img src="https://img.shields.io/badge/ollama-%23000000?style=for-the-badge&logo=ollama&logoColor=white">
  
</div>

<p>Berikut adalah preview dari Aplikasi Web SISMO-DSIPANHAN</p>
<figure>
  <img src="https://i.postimg.cc/zDWRtHYC/tampilan1.png" alt="Tampilan Dashboard Aplikasi SISMO-DISPANHAN"/>
  <figcaption>Gambar 1: Tampilan Halaman Dashboard SISMO-DISPANHAN.</figcaption>
</figure>
<figure>
  <img src="https://i.postimg.cc/26LBfVbf/tampilan2.png" alt="Cloropeth Map Jawa Tengah"/>
  <figcaption>Gambar 2: Map Cloropeth menggunakan <a href="https://leafletjs.com/">Leaflet.js</a> dan <a href="https://github.com/eppofahmi/geojson-indonesia/blob/master/kota/all_kabkota_ind.geojson">/geojson Kabupaten/Kota Di Indonesia</a> .</figcaption>
</figure>
<figure>
  <img src="https://i.postimg.cc/Gtk8HVx7/tampilan3.png" alt="Sistem Account Center"/>
  <figcaption>Gambar 3: Sistem Account Center</figcaption>
</figure>
<figure>
  <img src="https://i.postimg.cc/m2s10ZT0/tampilan4.png" alt="Tampilan Account Center"/>
  <figcaption>Gambar 4: Tampilan Account Center</figcaption>
</figure>
<figure>
  <img src="https://i.postimg.cc/RhrJC4KJ/tampilan5.png" alt="Sistem Analisa Harga"/>
  <figcaption>Gambar 5: Analisa Harga dengan <a href="https://facebook.github.io/prophet/">Prophet</a></figcaption>
</figure>



<hr/>

<h2 style="vertical-align: middle;">
  <img src="https://i.postimg.cc/5yZ1S74h/downloading.png"/>
  Installasi
</h2>

<ol>
  <li>
    <strong>Download & Install Docker Dekstop</strong><br/><br/>
    <a href="https://www.docker.com/products/docker-desktop/">
      <img src="https://i.postimg.cc/vZmNGz0w/docker-download.png" alt="Docker Dekstop" style="height: 2.5em; vertical-align: middle;">
    </a>
    <br/>
    <br/>
  </li>
  <li>
    <strong>Git Pull Project ini</strong>
    <br/>
  </li>
  <li>
    Buka <strong>Terminal</strong>, lalu cd ke direktori anda melakukan Git Pull.<br/>
    <pre><code>cd ../{nama-direktori-anda}</code></pre>
    <br/>
  </li>
  <li>Setelah Terminal berada di direktori anda, jalankan kode ini<br/>
    <pre><code>docker-compose up -d</code></pre>
    <br/>
  </li>
  <li>Tunggu sampai progress pembuatan Container selesai pada Terminal, lalu <strong>Buka Docker Dekstop</strong>
  <br/>
  </li>
  <li>Pergi Ke <code>Container</code> -> <code>{nama-direktori-anda}</code> -> <code>ollama</code> -> <code>Logs</code>.<br/>
  Tunggu hingga Ollama selesai men-download Model yang anda inginkan<br/>
  </li>
</ol>

