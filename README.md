<h1>📊 Sistem Monitoring DISPANHAN</h1>

<p>Panduan lengkap <strong>step-by-step</strong> untuk menjalankan Sistem Monitoring DISPANHAN berbasis <strong>PHP, MySQL, dan Flask (Python) Menggunakan Docker</strong>.</p>

<hr/>

<h2><img src="https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" alt="Docker Icon" style="height: 1.5em; vertical-align: middle;"> Persiapan Awal</h2>

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
    <code>cd ../{nama-direktori-anda}</code>
  </li>
  <li>Setelah Terminal berada di direktori anda, jalankan kode ini<br/>
    <code>docker-compose up -d</code>
  </li>
  <li>Tunggu sampai progress pembuatan Container selesai pada Terminal, lalu <strong>Buka Docker Dekstop</strong>
  </li>
  <li>Pergi Ke Container -> {nama-direktori-anlda} -> ollama -> Logs.<br/>
  Tunggu hingga Ollama selesai men-download Model yang anda inginkan
  </li>
</ol>