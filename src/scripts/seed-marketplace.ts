import { config } from "dotenv";
config({ path: ".env.local" });

const products = [
  {
    name: "Kompos Organik Premium (1kg)",
    description: "Pupuk kompos organik hasil fermentasi sampah organik warga desa. Kaya akan unsur hara makro dan mikro, sangat cocok untuk menyuburkan tanaman hias dan sayuran di pekarangan Anda. Bebas bau dan aman untuk lingkungan.",
    price_rp: 15000,
    stock_qty: 120,
    category: "compost",
    image_url: "https://images.unsplash.com/photo-1598902469671-5509a24d5e21?q=80&w=800&auto=format&fit=crop",
    is_active: true
  },
  {
    name: "Pupuk Kompos Curah (5kg)",
    description: "Paket hemat pupuk kompos untuk lahan pertanian yang lebih luas. Diproses menggunakan sistem BioCompose dengan pemantauan suhu dan kelembapan yang ketat sehingga menghasilkan kompos kualitas terbaik.",
    price_rp: 65000,
    stock_qty: 45,
    category: "compost",
    image_url: "https://images.unsplash.com/photo-1628189851480-1a76fbd14371?q=80&w=800&auto=format&fit=crop",
    is_active: true
  },
  {
    name: "Pupuk Cair Organik (POC) 500ml",
    description: "Nutrisi cair ekstrak dari proses pengomposan. Membantu mempercepat pertumbuhan akar dan daun. Cara pakai: campurkan 1 tutup botol dengan 1 liter air, semprotkan pada daun atau siram ke akar.",
    price_rp: 25000,
    stock_qty: 80,
    category: "liquid",
    image_url: "https://images.unsplash.com/photo-1615810243400-58c0678ebc64?q=80&w=800&auto=format&fit=crop",
    is_active: true
  },
  {
    name: "Paket Benih Sayur Rumahan",
    description: "Kumpulan benih sayuran mudah tanam untuk pekarangan: bayam, kangkung, sawi, dan tomat. Tingkat perkecambahan tinggi (>85%). Cocok dipadukan dengan kompos organik dari WasteWise.",
    price_rp: 12000,
    stock_qty: 200,
    category: "seeds",
    image_url: "https://images.unsplash.com/photo-1595804369234-a103c80ff5ee?q=80&w=800&auto=format&fit=crop",
    is_active: true
  },
  {
    name: "Briket Biomassa (1kg)",
    description: "Bahan bakar alternatif ramah lingkungan hasil daur ulang limbah organik kering. Menghasilkan panas yang stabil, tahan lama, dan tidak menghasilkan asap hitam pekat.",
    price_rp: 18000,
    stock_qty: 60,
    category: "briquettes",
    image_url: "https://images.unsplash.com/photo-1601618680197-09d6b2c45815?q=80&w=800&auto=format&fit=crop",
    is_active: true
  },
  {
    name: "Kompos Cair Lindi (1 Liter)",
    description: "Air lindi hasil filtrasi dari BioBin yang telah melalui proses pematangan. Sangat kuat, wajib diencerkan 1:20 sebelum digunakan. Cocok untuk tanaman buah-buahan.",
    price_rp: 35000,
    stock_qty: 25,
    category: "liquid",
    image_url: "https://images.unsplash.com/photo-1628189851480-1a76fbd14371?q=80&w=800&auto=format&fit=crop",
    is_active: true
  }
];

console.log("=== SEEDER MARKETPLACE (SUPABASE SQL) ===\n");
console.log("-- Karena tabel 'products' dikunci oleh RLS (hanya admin yang bisa insert),");
console.log("-- silahkan COPY kode SQL di bawah ini dan PASTE ke Supabase Dashboard (menu SQL Editor).\n");

console.log("INSERT INTO public.products (name, description, price_rp, stock_qty, category, image_url, is_active) VALUES");

const values = products.map((p, index) => {
  const isLast = index === products.length - 1;
  return `  ('${p.name}', '${p.description}', ${p.price_rp}, ${p.stock_qty}, '${p.category}', '${p.image_url}', ${p.is_active})${isLast ? ';' : ','}`;
});

console.log(values.join("\n"));
console.log("\n=========================================");

