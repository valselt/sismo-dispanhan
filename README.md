<h1>📊 Sistem Monitoring DISPANHAN</h1>

<p>Panduan lengkap <strong>step-by-step</strong> untuk menjalankan Sistem Monitoring DISPANHAN berbasis <strong>PHP, MySQL, dan Flask (Python)</strong>.</p>

<hr/>

<h2>🧰 Persiapan Awal</h2>

<h3>🔧 Inisialisasi MySQL</h3>
<ol>
  <li><strong>Download & Install XAMPP</strong><br/>
    <a href="https://www.apachefriends.org/download.html" target="_blank">https://www.apachefriends.org/download.html</a>
  </li>
  <li><strong>Letakkan Folder Direktori Website</strong><br/>
    Salin folder proyek Anda ke:<br/>
    <code>../xampp/htdocs/{nama-direktori-anda}</code>
  </li>
  <li><strong>Jalankan Apache & MySQL</strong> melalui XAMPP Control Panel.</li>
  <li><strong>Impor Database</strong><br/>
    Buka <code>http://localhost/phpmyadmin</code><br/>
    Buat database baru (misal: <code>db_dispanhan</code>)<br/>
    Import file SQL dari:<br/>
    <a href="https://github.com/valselt/sismo-dispanhan/blob/main/data/db_dispanhan.sql" target="_blank">db_dispanhan.sql</a>
  </li>
</ol>

<h3>🐍 Inisialisasi Environment Python</h3>
<ol>
  <li><strong>Download & Install Anaconda</strong><br/>
    <a href="https://www.anaconda.com/download" target="_blank">https://www.anaconda.com/download</a>
  </li>
  <li><strong>Buat Virtual Environment</strong><br/>
    <code>conda create -n dispanhan-env python=3.11 -y</code>
  </li>
  <li><strong>Aktifkan Environment</strong><br/>
    <code>conda activate dispanhan-env</code>
  </li>
  <li><strong>Install CmdStanPy</strong><br/>
    <code>pip install cmdstanpy</code>
  </li>
  <li><strong>Install CmdStan</strong> (diperlukan oleh Prophet)<br/>
    <pre><code>python
&gt;&gt;&gt; import cmdstanpy
&gt;&gt;&gt; cmdstanpy.install_cmdstan(compiler=True)
&gt;&gt;&gt; exit()</code></pre>
  </li>
  <li><strong>Install Library Tambahan</strong><br/>
    <code>pip install prophet</code><br/>
    <code>pip install mysql-connector-python sqlalchemy</code><br/>
    <code>pip install flask flask-cors</code>
  </li>
</ol>

<hr/>

<h2>🚀 Menjalankan Sistem</h2>

<h3>⚙️ Menyalakan Server Flask (Backend)</h3>
<pre><code>conda activate dispanhan-env
cd path/ke/folder-backend
python -m flask run</code></pre>
<p>Flask akan berjalan di <code>http://127.0.0.1:5000</code> secara default.</p>

<h3>🌐 Menjalankan Website (Frontend PHP)</h3>
<ol>
  <li>Buka <strong>XAMPP</strong>, aktifkan <strong>Apache</strong> dan <strong>MySQL</strong></li>
  <li>Akses website dari browser:<br/>
    <code>http://localhost/{nama-direktori-anda}/</code>
  </li>
  <li>Untuk fitur prediksi di <code>harga.html</code>, pastikan server Flask sudah <strong>aktif</strong>.</li>
</ol>

<hr/>

<h2>📝 Catatan</h2>
<ul>
  <li>Gunakan <strong>Google Chrome</strong> atau browser modern lainnya untuk performa terbaik.</li>
  <li>Jika terdapat error, periksa:
    <ul>
      <li>Apakah <code>Flask</code> sudah dijalankan?</li>
      <li>Apakah database <code>db_dispanhan</code> sudah diimpor dengan benar?</li>
      <li>Apakah environment <code>conda</code> sudah diaktifkan?</li>
    </ul>
  </li>
</ul>

<hr/>

<h2>📂 Struktur Folder Utama</h2>

<pre><code>📦{FOLDER}
 ┣ 📂css
 ┃ ┣ 📜gen-ai.css
 ┃ ┣ 📜style-account-center.css
 ┃ ┣ 📜style-analisis.css
 ┃ ┣ 📜style-dropdown.css
 ┃ ┣ 📜style-lr.css
 ┃ ┣ 📜style.css
 ┃ ┗ 📜_config.css
 ┣ 📂data
 ┃ ┣ 📜all_kab_kot_indo.geojson
 ┃ ┣ 📜db_dispanhan.sql
 ┃ ┣ 📜prognosa.csv
 ┃ ┗ 📜prophet_env.yml
 ┣ 📂html
 ┃ ┣ 📂user
 ┃ ┃ ┗ 📜accountcenter.html
 ┃ ┣ 📜about.html
 ┃ ┗ 📜harga.html
 ┣ 📂icon
 ┃ ┗ 📜logojackmia.png
 ┣ 📂images
 ┃ ┣ 📂user
 ┃ ┃ ┣ 📜bocilpendek1234567890.png
 ┃ ┃ ┣ 📜givenpendamping12345.png
 ┃ ┃ ┗ 📜ivanaldorino.png
 ┃ ┣ 📜grid1.JPG
 ┃ ┣ 📜grid2.JPG
 ┃ ┣ 📜grid3.JPG
 ┃ ┣ 📜grid4.png
 ┃ ┣ 📜grid5.JPG
 ┃ ┣ 📜grid6.JPG
 ┃ ┣ 📜grid7.JPG
 ┃ ┣ 📜grid8.JPG
 ┃ ┗ 📜grid9.jpg
 ┣ 📂javascript
 ┃ ┣ 📜account-center.js
 ┃ ┣ 📜analisis-harga.js
 ┃ ┣ 📜auth.js
 ┃ ┣ 📜data.js
 ┃ ┣ 📜dropdown.js
 ┃ ┣ 📜gen-ai.js
 ┃ ┣ 📜lr.js
 ┃ ┣ 📜main.js
 ┃ ┣ 📜photoprofile.js
 ┃ ┣ 📜tabel-analisis-harga.js
 ┃ ┗ 📜user.js
 ┣ 📂php
 ┃ ┣ 📜account-center.php
 ┃ ┣ 📜auth.php
 ┃ ┣ 📜data.php
 ┃ ┣ 📜delete_account.php
 ┃ ┣ 📜gen-ai.php
 ┃ ┣ 📜hapus-data-harga.php
 ┃ ┣ 📜koneksi.php
 ┃ ┣ 📜login.php
 ┃ ┣ 📜logout_all.php
 ┃ ┣ 📜photoprofile.php
 ┃ ┣ 📜register.php
 ┃ ┣ 📜tabel-analisis-harga.php
 ┃ ┣ 📜tambah-data-harga.php
 ┃ ┣ 📜update-data-harga.php
 ┃ ┣ 📜update_password.php
 ┃ ┣ 📜update_profile.php
 ┃ ┗ 📜user.php
 ┣ 📂python
 ┃ ┣ 📜lstm.ipynb
 ┃ ┣ 📜prophet-mysql.ipynb
 ┃ ┗ 📜sarima.ipynb
 ┣ 📂__pycache__
 ┃ ┗ 📜app.cpython-311.pyc
 ┣ 📜app.py
 ┣ 📜auth.html
 ┣ 📜index.html
 ┣ 📜login.html
 ┣ 📜register.html
 ┗ 📜sumber.txt
</code></pre>
