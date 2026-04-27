"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Setor Sampah",
    description:
      "Serahkan sampah organik dan daur ulang rumah tangga Anda ke pusat pengumpulan BUMDes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM12 17.5C9.24 17.5 7 15.26 7 12.5V7H9V12.5C9 14.16 10.34 15.5 12 15.5S15 14.16 15 12.5V7H17V12.5C17 15.26 14.76 17.5 12 17.5Z" fill="#016630" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Pengolahan Ramah Lingkungan",
    description:
      "Sampah Anda diubah menjadi pupuk organik dan kompos berkualitas tinggi oleh fasilitas lokal kami.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2C17.51 2 22 6.04 22 11C22 14.31 19.31 17 16 17H14.23C13.76 17 13.39 17.37 13.39 17.84C13.39 18.06 13.47 18.26 13.62 18.41C14.16 18.97 14.48 19.69 14.48 20.5C14.48 22 13.25 22 12 22ZM12 4C7.59 4 4 7.59 4 12S7.59 20 12 20C12.45 20 12.48 19.86 12.48 19.5C12.48 19.32 12.42 19.13 12.26 18.96L12.24 18.94C11.67 18.37 11.39 17.68 11.39 16.84C11.39 15.28 12.67 14 14.23 14H16C18.21 14 20 12.21 20 10C20 6.69 16.42 4 12 4Z" fill="#016630" />
        <circle cx="6.5" cy="11.5" r="1.5" fill="#016630" />
        <circle cx="9.5" cy="7.5" r="1.5" fill="#016630" />
        <circle cx="14.5" cy="7.5" r="1.5" fill="#016630" />
        <circle cx="17.5" cy="11.5" r="1.5" fill="#016630" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Dapatkan Voucher",
    description:
      "Terima voucher isi ulang LPG sebagai hadiah atas kontribusi Anda.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4ZM20 19H4V8H20V19ZM13 10H11V13H8V15H11V18H13V15H16V13H13V10Z" fill="#016630" />
      </svg>
    ),
  },
];

export default function CycleOfReward() {
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
      id="features"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-6 pt-32 pb-16"
    >
      {/* Heading */}
      <div className="text-center mb-16 reveal">
        <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-foreground">
          Siklus{" "}
          <span className="font-serif italic text-primary">Reward</span>
        </h2>
        <p className="mt-4 text-base text-muted max-w-lg mx-auto">
          Mengubah tanggung jawab lingkungan menjadi manfaat nyata bagi desa.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`reveal animate-delay-${(i + 1) * 100} group bg-white border border-stone-light rounded-3xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-500 overflow-hidden`}
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-accent-green flex items-center justify-center mb-10">
              {step.icon}
            </div>

            {/* Number */}
            <p className="text-5xl font-light text-stone-lighter tracking-tight mb-4">
              {step.number}
            </p>

            {/* Title */}
            <h3 className="text-xl font-medium text-foreground mb-3">
              {step.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-muted leading-relaxed max-w-[230px]">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
