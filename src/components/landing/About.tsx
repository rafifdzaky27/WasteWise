"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-6 pt-32 pb-16"
    >
      <div className="text-center mb-16 reveal">
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground">
          Tentang{" "}
          <span className="font-serif italic text-primary">WasteWise</span>
        </h2>
        <p className="mt-4 text-base text-muted max-w-2xl mx-auto leading-relaxed">
          Platform pengelolaan sampah berbasis komunitas yang dirancang untuk mendukung pencapaian tujuan pembangunan berkelanjutan (SDGs) dan program Asta Cita demi kemajuan desa-desa di Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* SDGs Section */}
        <div className="reveal animate-delay-100 bg-white/60 border border-stone-border rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-blue-bg flex items-center justify-center mb-6 border border-blue-border">
            <span className="text-2xl">🌍</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">SDGs (Tujuan Pembangunan Berkelanjutan)</h3>
          <p className="text-stone-dark leading-relaxed mb-6">
            WasteWise secara langsung mendukung beberapa poin krusial dalam 17 Tujuan Pembangunan Berkelanjutan (SDGs) yang dicanangkan oleh PBB:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-green-status-text text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">SDG 11: Kota dan Komunitas yang Berkelanjutan</strong>
                <span className="text-xs text-muted">Mewujudkan desa yang bersih dan pengelolaan limbah yang aman.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-green-status-text text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">SDG 12: Konsumsi dan Produksi yang Bertanggung Jawab</strong>
                <span className="text-xs text-muted">Mendorong pengurangan, daur ulang, dan penggunaan kembali sampah.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-green-status-text text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">SDG 13: Penanganan Perubahan Iklim</strong>
                <span className="text-xs text-muted">Mengurangi emisi gas rumah kaca dengan mencegah sampah organik ke TPA.</span>
              </div>
            </li>
          </ul>
        </div>

        {/* Asta Cita Section */}
        <div className="reveal animate-delay-200 bg-white/60 border border-stone-border rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="w-14 h-14 rounded-2xl bg-yellow-bg flex items-center justify-center mb-6 border border-yellow-border">
            <span className="text-2xl">🇮🇩</span>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Mendukung Program Asta Cita</h3>
          <p className="text-stone-dark leading-relaxed mb-6">
            Kami berkomitmen mendukung misi Asta Cita untuk mewujudkan Indonesia Emas, khususnya pada aspek pembangunan dari desa:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-amber-800 text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">Pembangunan dari Desa dan dari Bawah</strong>
                <span className="text-xs text-muted">Memberdayakan BUMDes dan masyarakat desa dalam mengelola ekosistem secara mandiri.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-amber-800 text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">Kemandirian Ekonomi</strong>
                <span className="text-xs text-muted">Mengubah limbah menjadi produk bernilai jual tinggi seperti pupuk kompos dan produk daur ulang.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <span className="text-amber-800 text-xs font-bold">✓</span>
              </div>
              <div>
                <strong className="text-foreground text-sm block">Ekonomi Hijau</strong>
                <span className="text-xs text-muted">Menerapkan konsep sirkular ekonomi yang berpihak pada pelestarian alam dan kesejahteraan sosial.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
