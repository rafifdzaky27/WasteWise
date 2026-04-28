"use client";

import { useEffect, useRef } from "react";

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
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                fill="white"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">SDGs (Tujuan Pembangunan Berkelanjutan)</h3>
          <p className="text-stone-dark leading-relaxed mb-6">
            WasteWise secara langsung mendukung beberapa poin krusial dalam 17 Tujuan Pembangunan Berkelanjutan (SDGs) yang dicanangkan oleh PBB:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#006045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong className="text-foreground text-sm block">SDG 11: Kota dan Komunitas yang Berkelanjutan</strong>
                <span className="text-xs text-muted">Mewujudkan desa yang bersih dan pengelolaan limbah yang aman.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#006045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong className="text-foreground text-sm block">SDG 12: Konsumsi dan Produksi yang Bertanggung Jawab</strong>
                <span className="text-xs text-muted">Mendorong pengurangan, daur ulang, dan penggunaan kembali sampah.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-accent-green flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#006045" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
          <div className="w-14 h-14 rounded-2xl bg-amber-500 flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="white"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-semibold text-foreground mb-4">Mendukung Program Asta Cita</h3>
          <p className="text-stone-dark leading-relaxed mb-6">
            Kami berkomitmen mendukung misi Asta Cita untuk mewujudkan Indonesia Emas, khususnya pada aspek pembangunan dari desa:
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong className="text-foreground text-sm block">Pembangunan dari Desa dan dari Bawah</strong>
                <span className="text-xs text-muted">Memberdayakan BUMDes dan masyarakat desa dalam mengelola ekosistem secara mandiri.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <strong className="text-foreground text-sm block">Kemandirian Ekonomi</strong>
                <span className="text-xs text-muted">Mengubah limbah menjadi produk bernilai jual tinggi seperti pupuk kompos dan produk daur ulang.</span>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-yellow-border flex items-center justify-center mt-0.5 shrink-0">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M10 3L4.5 8.5L2 6" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
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
