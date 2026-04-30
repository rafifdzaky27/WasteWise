"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import productCompost from "../../assets/images/product-compost.png";
import productLiquid from "../../assets/images/product-liquid.png";

interface Product {
  id: string;
  name: string;
  description: string;
  image_url: string;
  price_rp: number;
  category: string;
  stock_qty: number;
  is_active: boolean;
}

const categoryImages: Record<string, any> = {
  compost: productCompost,
  liquid: productLiquid,
};

export default function Marketplace() {
  const sectionRef = useRef<HTMLElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch real products from API
  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d) && d.length > 0) setProducts(d.slice(0, 4));
      })
      .finally(() => setLoaded(true));
  }, []);

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
  }, [loaded]);

  return (
    <section
      id="marketplace"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-5 sm:px-6 pt-20 sm:pt-32 pb-16"
    >
      {/* Header */}
      <div className="text-center mb-12 reveal">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-foreground">
          Pasar{" "}
          <span className="font-serif italic text-primary">Berkelanjutan</span>
        </h2>
        <p className="mt-4 text-base text-muted max-w-md mx-auto">
          Produk organik dari sampah desa yang diolah menjadi sumber daya bernilai.
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {products.length > 0
          ? products.map((product, i) => {
              const imgSrc = product.image_url || categoryImages[product.category];
              return (
                <div
                  key={product.id}
                  className={`reveal animate-delay-${(i + 1) * 100} bg-white/60 border border-stone-border rounded-2xl overflow-hidden group hover:shadow-lg transition-all duration-300`}
                >
                  <div className="relative aspect-square bg-stone-light overflow-hidden">
                    {imgSrc ? (
                      <Image
                        src={imgSrc}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        unoptimized={!!product.image_url}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d6d3d1" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
                      </div>
                    )}
                    {product.stock_qty <= 3 && product.stock_qty > 0 && (
                      <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                        TERLARIS
                      </span>
                    )}
                    {product.stock_qty === 0 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-white font-bold">Habis</span></div>
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
                      Rp {product.price_rp.toLocaleString("id-ID")}
                    </p>
                  </div>
                </div>
              );
            })
          : /* Skeleton loading */
            [1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`reveal animate-delay-${i * 100} bg-white/60 border border-stone-border rounded-2xl overflow-hidden`}
              >
                <div className="aspect-square bg-stone-light animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-stone-light rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-stone-light rounded w-full animate-pulse" />
                  <div className="h-4 bg-stone-light rounded w-1/2 animate-pulse mt-2" />
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
