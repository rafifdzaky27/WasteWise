<p align="center">
  <img src="src/assets/images/wastewise_logo.png" alt="WasteWise Logo" width="80" />
</p>

<h1 align="center">WasteWise</h1>

<p align="center">
  <strong>Mengubah Sampah Menjadi Berkah</strong>
  <br />
  <em>Integrasi Dasbor Web Berbasis IoT dan Niaga Elektronik sebagai Akselerator Ekonomi Sirkular untuk Kemandirian BUMDes menuju Desa Cerdas Berkelanjutan</em>
</p>

<p align="center">
  <a href="https://wastewise-id.vercel.app">🌐 Live Demo</a> &nbsp;·&nbsp;
  <a href="#-akun-demo-untuk-juri">🔑 Akun Demo</a> &nbsp;·&nbsp;
  <a href="#-arsitektur-sistem">🏗️ Arsitektur</a> &nbsp;·&nbsp;
  <a href="#-menjalankan-secara-lokal">⚡ Setup Lokal</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19.2-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Storage-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind%20CSS-4.x-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Deploy-Vercel-000?logo=vercel" alt="Vercel" />
</p>

---

## 📌 Ringkasan Proyek

**WasteWise** adalah platform web terintegrasi yang dirancang untuk memberdayakan Badan Usaha Milik Desa (BUMDes) dalam mengelola sampah desa secara berkelanjutan. Dengan mengombinasikan pemantauan komposter cerdas (*IoT BioBin*), sistem penghargaan (*reward*) berbasis poin, dan *marketplace* produk sirkular, WasteWise menutup siklus ekonomi sirkular (*closing the loop*) — dari sampah organik rumah tangga menjadi produk bernilai ekonomi.

### 🌱 Masalah yang Diselesaikan

| Masalah | Solusi WasteWise |
|---------|-----------------|
| Sampah organik desa hanya berakhir di TPA | Sistem setoran terverifikasi + pengomposan via BioBin |
| Warga tidak termotivasi memilah sampah | Insentif poin → voucer LPG 3 kg |
| BUMDes sulit memantau proses pengomposan | Dasbor sensor IoT (suhu, kelembapan, metana) waktu nyata |
| Hasil kompos tidak terdistribusi | *Marketplace* e-commerce terintegrasi |
| Tidak ada data dampak lingkungan yang terukur | *Impact Logger* dengan kalkulasi CO₂ otomatis |

---

## 🔑 Akun Demo untuk Juri

> **Silakan gunakan akun berikut untuk mencoba seluruh fitur WasteWise pada [wastewise-id.vercel.app](https://wastewise-id.vercel.app)**

| Peran | Email | Kata Sandi | Akses |
|-------|-------|------------|-------|
| 🛡️ **Admin** (BUMDes) | `pradipta@gmail.com` | `admin123` | Dasbor operasional, verifikasi setoran, kelola produk, pesanan masuk, penukaran voucer, pemantauan BioBin |
| 👤 **Warga** | `rafif@gmail.com` | `warga123` | Setor sampah, lihat poin & voucer, belanja marketplace, riwayat pesanan |
| 🌾 **Petani** | `sahal@gmail.com` | `pembeli123` | Belanja marketplace, riwayat pesanan |

### 🗺️ Skenario Uji Coba yang Disarankan

<details>
<summary><strong>Skenario 1 — Alur Setoran Sampah & Poin (Warga → Admin)</strong></summary>

1. Masuk sebagai **Warga** (`rafif@gmail.com`)
2. Buka menu **Setor Sampah** → masukkan berat dan jenis sampah → submit
3. Sistem menghasilkan **QR Code** unik
4. Buka tab baru → masuk sebagai **Admin** (`dipta@gmail.com`)
5. Buka menu **Verifikasi Setoran** → pindai QR atau cari setoran
6. Klik **Verifikasi** → poin otomatis dikreditkan ke akun warga
7. Kembali ke akun warga → cek saldo poin yang bertambah
</details>

<details>
<summary><strong>Skenario 2 — Penukaran Voucer LPG (Warga)</strong></summary>

1. Masuk sebagai **Warga** (`rafif@gmail.com`)
2. Buka menu **Hadiah** → pilih **Voucer LPG 3 kg** (500 poin)
3. Sistem memvalidasi saldo → voucer diterbitkan dengan kode unik
4. Masuk sebagai **Admin** → buka **Penukaran Voucher**
5. Verifikasi kode voucer → tandai sebagai "Diklaim"
</details>

<details>
<summary><strong>Skenario 3 — Pembelian di Marketplace (Warga/Petani)</strong></summary>

1. Masuk sebagai **Warga** atau **Petani**
2. Buka menu **Marketplace** → tambahkan produk ke keranjang
3. Klik **Checkout** → pilih metode pengiriman (Ambil Sendiri / Kirim ke Rumah)
4. Pilih metode pembayaran (Transfer Bank → unggah bukti transfer)
5. Masuk sebagai **Admin** → buka **Pesanan Masuk**
6. Lihat detail pesanan → verifikasi bukti transfer → ubah status
</details>

<details>
<summary><strong>Skenario 4 — Pemantauan BioBin & Prediksi Panen (Admin)</strong></summary>

1. Masuk sebagai **Admin** (`dipta@gmail.com`)
2. Buka menu **BioCompose** → lihat data sensor waktu nyata
3. Grafik menampilkan tren suhu, kelembapan, metana, dan amonia
4. Sistem menghitung prediksi panen berdasarkan akumulasi hari fermentasi (≥ 21 hari pada 50-65°C)
</details>

---

## 🏗️ Arsitektur Sistem

```
┌──────────────────────────────────────────────────────────┐
│                    LAPISAN KLIEN                         │
│  ┌─────────────────┐         ┌──────────────────────┐    │
│  │  Peramban Web   │         │  Perangkat IoT       │    │
│  │  (Warga/Admin/  │         │  (Wemos D1 Mini +    │    │
│  │   Petani)       │         │   DHT22, MQ-4, MQ-2) │    │
│  └────────┬────────┘         └──────────┬───────────┘    │
└───────────┼──────────────────────────────┼───────────────┘
            │ HTTPS                        │ HTTP POST
            ▼                              ▼
┌──────────────────────────────────────────────────────────┐
│              LAPISAN APLIKASI (Vercel)                   │
│  ┌─────────────────────────────────────────────────┐     │
│  │          Next.js 16 App Router                  │     │
│  │  ┌──────────────┐  ┌─────────────────────────┐  │     │
│  │  │ Server       │  │ API Routes              │  │     │
│  │  │ Components   │  │ /api/deposits           │  │     │
│  │  │ (SSR + ISR)  │  │ /api/sensors            │  │     │
│  │  │              │  │ /api/orders             │  │     │
│  │  │              │  │ /api/vouchers           │  │     │
│  │  │              │  │ /api/impact             │  │     │
│  │  │              │  │ /api/products           │  │     │
│  │  └──────────────┘  └─────────────────────────┘  │     │
│  └─────────────────────────────────────────────────┘     │
└──────────────────────────┬───────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────┐
│              LAPISAN DATA (Supabase)                     │
│  ┌──────────────┐ ┌──────────┐ ┌───────────────────────┐ │
│  │ PostgreSQL   │ │ Auth     │ │ Storage               │ │
│  │ (10 Tabel +  │ │ (Sesi &  │ │ (Gambar Produk &      │ │
│  │  RLS)        │ │  Peran)  │ │  Bukti Transfer)      │ │
│  └──────────────┘ └──────────┘ └───────────────────────┘ │
└──────────────────────────────────────────────────────────┘
```

### Tumpukan Teknologi (*Tech Stack*)

| Lapisan | Teknologi | Kegunaan |
|---------|-----------|----------|
| *Frontend* | Next.js 16, React 19, TypeScript | Antarmuka pengguna responsif dengan *Server Components* |
| *Styling* | Tailwind CSS 4, CSS *custom properties* | Sistem desain *Glassmorphism* yang konsisten |
| *State Management* | Zustand | Manajemen keranjang belanja sisi klien |
| *Grafik* | Recharts | Visualisasi data sensor dan tren dampak |
| *Backend* | Next.js API Routes (*serverless*) | 22 *endpoint* RESTful |
| *Basis Data* | Supabase PostgreSQL + RLS | Keamanan data berlapis di level baris |
| *Autentikasi* | Supabase Auth | Manajemen sesi dan peran pengguna |
| *Penyimpanan* | Supabase Storage | Gambar produk dan bukti transfer |
| *QR Code* | `qrcode` + `html5-qrcode` | Pembuatan dan pemindaian kode QR |
| *IoT* | Wemos D1 Mini (ESP8266) | Pengiriman data sensor via HTTP |
| *Deployment* | Vercel | *Serverless* dengan *edge network* global |

---

## 📂 Struktur Proyek

```
src/
├── app/
│   ├── (auth)/              # Halaman masuk & registrasi
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/         # Area terautentikasi
│   │   ├── admin/           # Panel admin BUMDes
│   │   │   ├── deposits/    # Verifikasi setoran QR
│   │   │   ├── orders/      # Pesanan masuk
│   │   │   ├── products/    # Kelola produk (CRUD)
│   │   │   └── vouchers/    # Penukaran voucer
│   │   ├── biobin/          # Pemantauan sensor IoT
│   │   ├── dashboard/       # Beranda dasbor
│   │   ├── deposit/         # Setor sampah warga
│   │   ├── marketplace/     # Belanja produk sirkular
│   │   ├── orders/          # Riwayat pesanan
│   │   └── rewards/         # Poin & voucer warga
│   ├── (public)/            # Halaman publik (tanpa login)
│   │   ├── about/           # Tentang tim
│   │   └── impact/          # Dasbor dampak lingkungan
│   └── api/                 # 22 API endpoint serverless
│       ├── deposits/        # CRUD setoran + verifikasi
│       ├── impact/          # Agregasi dampak lingkungan
│       ├── orders/          # Pesanan + status update
│       ├── points/          # Riwayat transaksi poin
│       ├── products/        # CRUD katalog produk
│       ├── rewards/         # Ringkasan reward
│       ├── sensors/         # Data sensor + prediksi panen
│       ├── upload/          # Upload gambar
│       └── vouchers/        # Penukaran + verifikasi voucer
├── assets/images/           # Aset gambar statis
├── components/              # Komponen React termodulasi
├── lib/                     # Utilitas, tipe, dan konfigurasi
└── stores/                  # Zustand state management
```

---

## 🔄 Alur Ekonomi Sirkular

```
  ┌─────────┐        ┌──────────┐        ┌──────────┐
  │  WARGA  │──(1)──▶│  BUMDes  │──(3)──▶│  BioBin  │
  │ Memilah │ Setor  │ Verifi-  │ Proses │ Fermenta-│
  │ Sampah  │ Sampah │ kasi QR  │ Kompos │ si 21+hr │
  └────┬────┘        └────┬─────┘        └────┬─────┘
       │                  │                    │
       │              (2) │ Poin               │ (4) Panen
       │                  ▼                    ▼
  ┌────▼────┐        ┌──────────┐        ┌──────────┐
  │  TUKAR  │◀───────│   POIN   │        │ PRODUK   │
  │ Voucer  │  500   │  10/kg   │        │ Kompos & │
  │ LPG 3kg │  poin  │ organik  │        │ POC      │
  └─────────┘        │  15/kg   │        └────┬─────┘
                     │ daur     │             │
                     │ ulang    │         (5) │ Jual di
                     └──────────┘             │ Marketplace
                                              ▼
                                         ┌──────────┐
                                         │ PEMBELI  │
                                         │ (Warga / │
                                         │  Petani) │
                                         └──────────┘
```

---

## 📊 Perhitungan Dampak Lingkungan

WasteWise menggunakan formula kuantitatif untuk menghitung dampak ekologis:

| Metrik | Rumus | Sumber Acuan |
|--------|-------|-------------|
| Emisi CO₂ Terhindarkan (Organik) | `berat_organik × 0,5 kg CO₂e` | IPCC Guidelines for National GHG Inventories |
| Emisi CO₂ Terhindarkan (Daur Ulang) | `berat_daur_ulang × 1,2 kg CO₂e` | EPA WARM Model |
| Kompos yang Dihasilkan | `berat_organik × 0,4` | Rasio konversi aerobik (40%) |
| Reduksi ke TPA | `(berat_bulan_ini / target_1000kg) × 100%` | Target operasional BUMDes |

---

## ⚡ Menjalankan Secara Lokal

### Prasyarat

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- Akun **Supabase** (untuk basis data dan autentikasi)

### Langkah Instalasi

```bash
# 1. Clone repositori
git clone https://github.com/ImpactCrafters/WasteWise.git
cd WasteWise

# 2. Install dependensi
npm install

# 3. Salin file environment
cp .env.example .env.local

# 4. Isi variabel environment di .env.local
#    NEXT_PUBLIC_SUPABASE_URL=<url_supabase_anda>
#    NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key_anda>
#    SUPABASE_SERVICE_ROLE_KEY=<service_role_key_anda>

# 5. Jalankan server pengembangan
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di peramban Anda.

### Skrip Tambahan

```bash
# Simulasi data sensor IoT (untuk demo tanpa hardware)
npm run mock-iot

# Seed data produk marketplace
npm run seed:marketplace
```

---

## 🗃️ Skema Basis Data (ERD)

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│   profiles   │     │  waste_deposits  │     │  point_transactions  │
├──────────────┤     ├──────────────────┤     ├──────────────────────┤
│ id (PK)      │◄──┐ │ id (PK)          │     │ id (PK)              │
│ email        │   ├─│ user_id (FK)     │  ┌──│ user_id (FK)         │
│ full_name    │   │ │ weight_kg        │  │  │ amount               │
│ role         │   │ │ waste_type       │  │  │ type                 │
│ total_points │   │ │ qr_code          │  │  │ reference_id (FK)    │
│ created_at   │   │ │ points_earned    │  │  │ description          │
└──────────────┘   │ │ verified_by (FK)─┘  │  │ created_at           │
       ▲           │ │ created_at       │  │  └──────────────────────┘
       │           │ └──────────────────┘  │
       │           │                       │
       │           │ ┌──────────────────┐  │  ┌──────────────────┐
       │           ├─│voucher_redemptns │  │  │   biobin_units   │
       │           │ ├──────────────────┤  │  ├──────────────────┤
       │           │ │ id (PK)          │  │  │ id (PK)          │
       │           │ │ user_id (FK)  ───┘  │  │ name             │
       │           │ │ points_spent     │  │  │ location         │
       │           │ │ voucher_type     │  │  │ status           │
       │           │ │ status           │  │  │ last_reading_at  │
       │           │ │ created_at       │  │  └────────┬─────────┘
       │           │ └──────────────────┘  │           │
       │           │                       │           ▼
       │           │ ┌──────────────────┐  │  ┌──────────────────┐
       │           │ │     orders       │  │  │ sensor_readings  │
       │           │ ├──────────────────┤  │  ├──────────────────┤
       │           └─│ buyer_id (FK)    │  │  │ id (PK)          │
       │             │ id (PK)          │  │  │ biobin_id (FK)   │
       │             │ total_price_rp   │  │  │ temperature      │
       │             │ status           │  │  │ humidity         │
       │             │ delivery_method  │  │  │ methane_level    │
       │             │ payment_method   │  │  │ ammonia_level    │
       │             │ shipping_cost    │  │  │ recorded_at      │
       │             │ payment_proof    │  │  └──────────────────┘
       │             │ created_at       │  │
       │             └───────┬──────────┘  │  ┌──────────────────┐
       │                     │             │  │  harvest_events  │
       │                     ▼             │  ├──────────────────┤
       │             ┌──────────────────┐  │  │ id (PK)          │
       │             │   order_items    │  │  │ biobin_id (FK)   │
       │             ├──────────────────┤  │  │ compost_weight   │
       │             │ id (PK)          │  │  │ fermentation_days│
       │             │ order_id (FK)    │  │  │ status           │
       │             │ product_id (FK)──┼──┘  │ predicted_at     │
       │             │ quantity         │     │ harvested_at     │
       │             │ unit_price_rp    │     └──────────────────┘
       │             └──────────────────┘
       │
       │             ┌──────────────────┐
       │             │    products      │
       │             ├──────────────────┤
       │             │ id (PK)          │
       │             │ name             │
       │             │ description      │
       │             │ image_url        │
       │             │ price_rp         │
       │             │ stock_qty        │
       │             │ category         │
       │             │ harvest_id (FK)  │
       │             │ is_active        │
       │             │ created_at       │
       └─────────────┴──────────────────┘
```

---

## 📡 Integrasi IoT (BioBin)

Perangkat IoT mengirim data sensor ke *endpoint* publik tanpa autentikasi:

```bash
# Contoh request dari ESP8266 / Wemos D1 Mini
curl -X POST https://wastewise-id.vercel.app/api/sensors \
  -H "Content-Type: application/json" \
  -d '{
    "biobin_id": "<uuid-biobin>",
    "temperature": 55.2,
    "humidity": 68.5,
    "methane_level": 12.3,
    "ammonia_level": 4.1
  }'
```

### Algoritma Prediksi Panen

```
1. Ambil data sensor 30 hari terakhir
2. Hitung rata-rata suhu harian
3. Hitung hari berturut-turut dengan suhu rata-rata 50-65°C
4. Jika ≥ 21 hari → Status: "Siap Panen" 🟢
5. Jika < 21 hari → Estimasi sisa hari fermentasi 🟡
```

---

## 👥 Tim ImpactCrafters

<table>
  <tr>
    <td align="center"><strong>Pradipta Muhtadin</strong><br />Project Manager<br /><sub>1202220327</sub></td>
    <td align="center"><strong>Rafif Dzaky Daniswara</strong><br />Frontend Developer<br /><sub>1202223211</sub></td>
    <td align="center"><strong>Sahal Fajri</strong><br />Backend Developer<br /><sub>1202223364</sub></td>
  </tr>
</table>

---

## 📜 Lisensi

Proyek ini dikembangkan untuk kompetisi **I/O Festival 2026** — kategori *Web Development*.

---

<p align="center">
  <em>Dibuat dengan 💚 oleh Tim ImpactCrafters — Telkom University</em>
</p>
