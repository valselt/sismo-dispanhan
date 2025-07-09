# 📊 Sistem Monitoring DISPANHAN

Aplikasi Berbasis Website Untuk Melakukan Monitoring terhadap Kestabilan dan Stabilisasi Pangan Di Jawa Tengah dengan mengimplementasikan Machine Learning ke Dalamnya.

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

## ✨ Pratinjau Aplikasi

Berikut adalah preview dari Aplikasi Web SISMO-DSIPANHAN.

![Tampilan Dashboard Aplikasi SISMO-DISPANHAN](https://i.postimg.cc/zDWRtHYC/tampilan1.png)
*Gambar 1: Tampilan Halaman Dashboard SISMO-DISPANHAN.*

![Cloropeth Map Jawa Tengah](https://i.postimg.cc/26LBfVbf/tampilan2.png)
*Gambar 2: Map Cloropeth menggunakan [Leaflet.js](https://leafletjs.com/) dan [data GeoJSON Kabupaten/Kota di Indonesia](https://github.com/eppofahmi/geojson-indonesia/blob/master/kota/all_kabkota_ind.geojson) .*

![Sistem Account Center](https://i.postimg.cc/Gtk8HVx7/tampilan3.png)
*Gambar 3: Sistem Account Center.*

![Tampilan Account Center](https://i.postimg.cc/m2s10ZT0/tampilan4.png)
*Gambar 4: Tampilan Account Center.*

![Sistem Analisa Harga](https://i.postimg.cc/RhrJC4KJ/tampilan5.png)
*Gambar 5: Analisa Harga dengan [Prophet](https://facebook.github.io/prophet/).*

---

## 🚀 Instalasi

1.  **Download & Install Docker Desktop**  
    <a href="https://www.docker.com/products/docker-desktop/">
      <img src="https://i.postimg.cc/vZmNGz0w/docker-download.png" alt="Docker Desktop" style="height: 40px;">
    </a>
2.  **Clone Repositori Ini**  
    Buka terminal (Git Bash, Command Prompt, atau PowerShell) dan jalankan perintah berikut:
    ```bash
    git clone https://ALAMAT_URL_REPOSITORI_ANDA.git
    ```

3.  **Masuk Ke Direktori anda melalui terminal dengan menggunakan `cd`**  
    ```bash
    cd C:\{nama direktori anda}
    ```

4.  **Jalankan Docker Compose**  
    Perintah ini akan membangun dan menjalankan semua layanan yang dibutuhkan secara otomatis.
    ```bash
    docker-compose up -d
    ```
    > **Catatan:** Saat pertama kali dijalankan, proses ini mungkin akan memakan waktu beberapa menit karena perlu mengunduh *image* Docker dan model LLM dari Ollama.   
    *Cek Docker Dekstop -> Container -> {nama direktori anda} -> ollama -> Logs, dan tunggu hingga selesai*.

## ⚡ Cara Menjalankan

### Docker  
1. Buka Terminal
2. Masuk Ke Direktori anda melalui terminal dengan menggunakan `cd` 
3. Ketik Perintah ini ketika Ingin menjalankan Container Docker  
    ```bash
    docker-compose up -d
    ```
    Dan Ketika Ingin Stop Container Docker

    ```bash
    docker-compose down
    ```

### Website   
Pastikan Semua Kontainer Telah Berjalan dengan Sempurna seperti pada Contoh Dibawah Ini.
![Docker Sudah Berjalan dengan Baik](https://i.postimg.cc/GmzMGBmR/docker-run-screenshot.png)


1. Jalankan ini di browser untuk menjalankan index.html/Daashboard Utama
    ```bash
    http://localhost/
    ```

2. Jalankan ini di browser untuk menjalankan phpMyAdmin
    ```bash
    http://localhost:8080/
    ```

## 👤 Akun Admin

**Username** : admin-dispanhan  
**Password** : admin12345