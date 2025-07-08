<h1 align="center">📊 Sistem Monitoring DISPANHAN</h1>

<p align="center">Panduan lengkap <strong>step-by-step</strong> untuk menjalankan Sistem Monitoring DISPANHAN berbasis <strong>PHP, MySQL, dan Flask (Python) Menggunakan Docker</strong>.</p>


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

<hr/>

<h2><img src="https://skillicons.dev/icons?i=docker" alt="Docker Icon" style="height: 1.5em; vertical-align: middle; margin-right: 8px;"> Persiapan Awal</h2>

<ol>
  <li>
    <strong>Download & Install Docker Dekstop</strong><br/>
    <a href="https://www.docker.com/products/docker-desktop/">
      <img src="https://i.postimg.cc/vZmNGz0w/docker-download.png" alt="Docker Dekstop" style="height: 2.5em; vertical-align: middle;">
    </a>
  </li>
  <li>
    <strong>Git Pull Project ini</strong>
  </li>
  <li>
    Buka <strong>Terminal</strong>, lalu cd ke direktori anda melakukan Git Pull.<br/>
    <pre><code>cd ../{nama-direktori-anda}</code></pre>
  </li>
  <li>Setelah Terminal berada di direktori anda, jalankan kode ini<br/>
    <pre><code>docker-compose up -d</code></pre>
  </li>
  <li>Tunggu sampai progress pembuatan Container selesai pada Terminal, lalu <strong>Buka Docker Dekstop</strong>
  </li>
  <li>Pergi Ke <code>Container</code> -> <code>{nama-direktori-anda}</code> -> <code>ollama</code> -> <code>Logs</code>.<br/>
  Tunggu hingga Ollama selesai men-download Model yang anda inginkan
  </li>
</ol>

