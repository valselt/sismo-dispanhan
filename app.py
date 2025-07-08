import io
import base64
import pandas as pd
import numpy as np
import itertools
from flask import Flask, request, jsonify, render_template
from prophet import Prophet
import matplotlib.pyplot as plt
from sqlalchemy import create_engine
from datetime import datetime
import logging
from flask_cors import CORS

# ==============================================================================
# KONFIGURASI FLASK SESUAI STRUKTUR FOLDER ANDA
# ==============================================================================
# Ini adalah baris kunci yang disesuaikan:
# - template_folder='html' --> Mencari file HTML di folder `html`
# - static_folder='.'      --> Mencari file statis (css, js, images) dari folder root
app = Flask(__name__, template_folder='html', static_folder='.', static_url_path='')
CORS(app)

# Konfigurasi logging
logging.getLogger('prophet').setLevel(logging.ERROR)
logging.getLogger('cmdstanpy').setLevel(logging.ERROR)
plt.style.use('seaborn-v0_8-whitegrid')

# ==============================================================================
# FUNGSI INTI UNTUK ANALISIS PROPHET
# ==============================================================================
def run_prophet_analysis(jenis_pangan, tingkat, tahun_awal, tahun_akhir, jumlah_hari_prediksi, model_pilihan):
    # 1. MEMUAT DATA DARI DATABASE
    db_host = 'db'
    db_user = 'admin-dispanhan'
    db_password = 'admin12345'
    db_name = 'db_dispanhan'
    engine = create_engine(f"mysql+mysqlconnector://{db_user}:{db_password}@{db_host}/{db_name}")
    
    query = f"""
        SELECT tahun, bulan, tanggal, harga 
        FROM tbl_analisis_harga 
        WHERE jenis = '{jenis_pangan}' AND tingkat = '{tingkat}'
    """
    df = pd.read_sql(query, engine)
    
    if df.empty:
        raise ValueError("Tidak ada data ditemukan untuk kriteria yang dipilih.")

    # 2. PROSES DATA
    bulan_map = {'januari': 1, 'februari': 2, 'maret': 3, 'april': 4, 'mei': 5, 'juni': 6, 'juli': 7, 'agustus': 8, 'september': 9, 'oktober': 10, 'november': 11, 'desember': 12}
    df['bulan'] = df['bulan'].astype(str).str.lower().map(bulan_map)
    df['ds'] = pd.to_datetime(df[['tahun', 'bulan', 'tanggal']].rename(columns={'tahun': 'year', 'bulan': 'month', 'tanggal': 'day'}))
    df_filtered = df[(df['ds'].dt.year >= int(tahun_awal)) & (df['ds'].dt.year <= int(tahun_akhir))].copy()
    df_filtered = df_filtered.rename(columns={'harga': 'y'})
    df_filtered['y'] = pd.to_numeric(df_filtered['y'], errors='coerce')
    df_filtered.dropna(subset=['y'], inplace=True)
    df_filtered = df_filtered.sort_values(by='ds').reset_index(drop=True)[['ds', 'y']]

    if df_filtered.empty:
        raise ValueError("Tidak ada data pada rentang tahun yang dipilih.")
    
    # 3. PELATIHAN MODEL & PREDIKSI
    model = Prophet()
    model.add_country_holidays(country_name='ID')
    model.fit(df_filtered)
    future = model.make_future_dataframe(periods=int(jumlah_hari_prediksi))
    forecast = model.predict(future)

    # 4. BUAT PLOT DAN UBAH MENJADI GAMBAR BASE64
    # Plot 1: Prediksi utama
    fig1 = model.plot(forecast, figsize=(10, 6))
    ax1 = fig1.gca()
    ax1.set_title(f"Prediksi Harga '{jenis_pangan.replace('_', ' ').title()}' - Tingkat '{tingkat}'", size=16)
    ax1.set_xlabel("Tanggal")
    ax1.set_ylabel("Harga")
    ax1.axvline(df_filtered['ds'].max(), color='red', linestyle='--', lw=2, label='Awal Prediksi')
    ax1.legend()
    plt.tight_layout()
    
    buf1 = io.BytesIO()
    fig1.savefig(buf1, format='png')
    buf1.seek(0)
    plot1_base64 = base64.b64encode(buf1.getvalue()).decode('utf-8')
    plt.close(fig1)

    # Plot 2: Komponen
    fig2 = model.plot_components(forecast, figsize=(10, 8))
    plt.tight_layout()

    buf2 = io.BytesIO()
    fig2.savefig(buf2, format='png')
    buf2.seek(0)
    plot2_base64 = base64.b64encode(buf2.getvalue()).decode('utf-8')
    plt.close(fig2)
    
    return plot1_base64, plot2_base64

# ==============================================================================
# ROUTE / ENDPOINT UNTUK APLIKASI WEB
# ==============================================================================
@app.route('/')
def home():
    # Karena template_folder='html', kita panggil nama filenya langsung
    return render_template('harga.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        plot1, plot2 = run_prophet_analysis(
            jenis_pangan=data.get('jenis'),
            tingkat=data.get('tingkat'),
            tahun_awal=data.get('tahun_awal'),
            tahun_akhir=data.get('tahun_akhir'),
            jumlah_hari_prediksi=data.get('hari_prediksi'),
            model_pilihan=data.get('model')
        )
        return jsonify({'status': 'success', 'plot1': plot1, 'plot2': plot2})
    except Exception as e:
        app.logger.error(f"An error occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)})

if __name__ == '__main__':
    app.run(debug=True)