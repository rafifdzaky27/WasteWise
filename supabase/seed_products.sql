-- Membersihkan SEMUA data marketplace agar kembali ke 0 (Pesanan, Item, dan Produk)
TRUNCATE TABLE orders CASCADE;
TRUNCATE TABLE products CASCADE;

-- Insert Produk Baru (Hanya Kompos Padat & Nutrisi Cair)
INSERT INTO products (name, description, price_rp, stock_qty, category, image_url, is_active)
VALUES 
(
  'Kompos Padat Organik BioBin - 1 Kg', 
  'Pupuk kompos padat organik hasil olahan sampah rumah tangga. Sangat baik untuk memperbaiki struktur tanah dan memberikan nutrisi alami bagi tanaman hias maupun sayuran pekarangan.', 
  15000, 
  50, 
  'compost', 
  '', 
  true
),
(
  'Kompos Super Premium - Karung 5 Kg', 
  'Kompos padat kualitas premium dalam kemasan ekonomis 5 kg. Cocok untuk kebun skala menengah dan pertanian urban. Kaya akan unsur hara makro dan mikro.', 
  65000, 
  25, 
  'compost', 
  '', 
  true
),
(
  'POC (Pupuk Organik Cair) Lindi - 500 ml', 
  'Nutrisi cair alami dari ekstrak lindi murni hasil fermentasi BioBin. Mempercepat pertumbuhan tunas, daun, dan akar. Cukup campurkan dengan air sebelum disiramkan.', 
  25000, 
  40, 
  'liquid', 
  '', 
  true
),
(
  'Nutrisi Cair Super Konsentrat - 1 Liter', 
  'Ekstrak nutrisi cair pekat untuk hasil panen yang lebih maksimal. Diformulasikan khusus untuk menjaga daya tahan tanaman terhadap hama dan penyakit secara organik.', 
  45000, 
  30, 
  'liquid', 
  '', 
  true
);
