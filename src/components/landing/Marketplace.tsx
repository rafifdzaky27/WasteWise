"use client";

import { useEffect, useRef } from "react";
import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import productCompost from "../../assets/images/product-compost.png";
import productLiquid from "../../assets/images/product-liquid.png";
import productSeeds from "../../assets/images/product-seeds.png";
import productBriquettes from "../../assets/images/product-briquettes.png";

interface DisplayProduct {
  name: string;
  price: string;
  description: string;
  image: StaticImageData;
  badge: string | null;
}

const displayProducts: DisplayProduct[] = [
  {
    name: "Kompos Premium Eco-Zip 2kg",
    price: "Rp 15.000",
    description: "Nutrisi organik kaya untuk kebun rumah Anda.",
    image: productCompost,
    badge: "TERLARIS",
  },
  {
    name: "Campuran Nutrisi Cair",
    price: "Rp 25.000",
    description: "Penguat tanaman terkonsentrasi untuk tanaman pot.",
    image: productLiquid,
    badge: null,
  },
  {
    name: "Paket Benih Unggul",
    price: "Rp 45.000",
    description: "Paket lengkap benih unggulan musiman.",
    image: productSeeds,
    badge: null,
  },
  {
    name: "Briket Sampah",
    price: "Rp 10.000",
    description: "Bahan bakar masak ramah lingkungan dari limbah daur ulang.",
    image: productBriquettes,
    badge: null,
  },
];

export default function Marketplace() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
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

  return (
    <section
      id="marketplace"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-5 sm:px-6 pt-20 sm:pt-32 pb-16"
    >
      {/* Header */}
      <div className="text-center mb-12 reveal">
        <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
          Pasar{" "}
          <span className="font-serif italic text-primary">Berkelanjutan</span>
        </h2>
        <p className="mt-4 text-base text-muted max-w-md mx-auto">
          Produk organik dari sampah desa yang diolah menjadi sumber daya bernilai.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {displayProducts.map((product, i) => (
          <div
            key={product.name}
            className={`reveal animate-delay-${(i + 1) * 100} bg-white/60 border border-stone-border rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300`}
          >
            <div className="relative aspect-square bg-stone-light overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                  {product.badge}
                </span>
              )}
            </div>
            <div className="p-4">
              <p className="text-sm font-semibold text-foreground line-clamp-1">
                {product.name}
              </p>
              <p className="text-[11px] text-muted mt-1 line-clamp-2 leading-relaxed">
                {product.description}
              </p>
              <p className="text-sm font-bold text-primary mt-3">
                {product.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center reveal animate-delay-500">
        <Link
          href="/marketplace"
          className="inline-flex items-center gap-2 bg-primary-dark text-white px-8 py-3 rounded-full text-sm font-medium hover:bg-primary-darker transition-colors shadow-lg"
        >
          Jelajahi Marketplace
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M6 3L11 8L6 13"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
