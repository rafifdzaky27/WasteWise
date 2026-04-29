"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "../../lib/supabase/client";
import productCompost from "../../assets/images/product-compost.png";
import productLiquid from "../../assets/images/product-liquid.png";
import productSeeds from "../../assets/images/product-seeds.png";
import productBriquettes from "../../assets/images/product-briquettes.png";

const fallbackProducts = [
  {
    name: "Kompos Premium Eco-Zip 2kg",
    price: "Rp 15rb",
    description: "Nutrisi organik kaya untuk kebun rumah Anda.",
    image: productCompost,
    badge: "TERLARIS",
  },
  {
    name: "Campuran Nutrisi Cair",
    price: "Rp 25rb",
    description: "Penguat tanaman terkonsentrasi untuk tanaman pot.",
    image: productLiquid,
    badge: null,
  },
  {
    name: "Paket Benih Unggul",
    price: "Rp 45rb",
    description: "Paket lengkap benih unggulan musiman.",
    image: productSeeds,
    badge: null,
  },
  {
    name: "Briket Sampah",
    price: "Rp 10rb",
    description: "Bahan bakar masak ramah lingkungan dari limbah daur ulang.",
    image: productBriquettes,
    badge: null,
  },
];

export default function Marketplace() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dbProducts, setDbProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").limit(4);
      if (data && data.length > 0) setDbProducts(data);
    };
    fetchProducts();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayProducts = dbProducts.length > 0 
    ? dbProducts.map(p => ({
        name: p.name,
        price: `Rp ${(p.price_rp / 1000)}rb`,
        description: p.description,
        image: p.image_url || productCompost,
        badge: p.stock_qty < 10 ? "TERBATAS" : null,
      }))
    : fallbackProducts;

  return (
    <section
      id="marketplace"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-5 sm:px-6 pt-20 sm:pt-32 pb-16"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-16 gap-6 reveal">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground">
            Pasar{" "}
            <span className="font-serif italic text-primary">Berkelanjutan</span>
          </h2>
          <p className="mt-4 text-base text-muted max-w-md">
            Tukarkan poin reward Anda dengan sumber daya organik berkualitas
            tinggi yang diproduksi langsung di desa.
          </p>
        </div>
        <Link href="/marketplace" className="flex items-center gap-1 text-base font-medium text-primary hover:gap-2 transition-all duration-300 shrink-0">
          Lihat semua produk
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 3L11 8L6 13"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map((product, i) => (
          <div
            key={product.name}
            className={`reveal animate-delay-${(i + 1) * 100} group bg-white border border-stone-light rounded-[32px] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden`}
          >
            {/* Image */}
            <div className="relative m-4 rounded-2xl overflow-hidden aspect-[4/5]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-primary-dark text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="px-6 pb-6">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-lg font-semibold text-foreground leading-snug">
                  {product.name}
                </h3>
                <span className="text-base font-medium text-primary whitespace-nowrap">
                  {product.price}
                </span>
              </div>
              <p className="text-sm text-muted leading-relaxed mb-5">
                {product.description}
              </p>
              <Link href="/marketplace" className="w-full flex items-center justify-center gap-2 bg-primary-dark text-white text-base font-medium py-3.5 rounded-2xl hover:bg-primary-darker transition-colors duration-300">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59L5.25 14.04C5.09 14.32 5 14.65 5 15C5 16.1 5.9 17 7 17H19V15H7.42C7.28 15 7.17 14.89 7.17 14.75L7.2 14.63L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C20.96 5.34 21 5.17 21 5C21 4.45 20.55 4 20 4H5.21L4.27 2H1Z"
                    fill="white"
                  />
                </svg>
                Lihat di Marketplace
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
