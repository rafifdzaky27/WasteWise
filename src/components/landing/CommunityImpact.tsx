"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import communityImpactImg from "../../assets/images/community-impact.png";

function AnimatedCounter({
  end,
  suffix,
  duration = 2000,
}: {
  end: number;
  suffix: string;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const startTime = performance.now();
          const animate = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * end));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref}>
      {count}
      <span className="text-2xl font-medium text-muted ml-1">{suffix}</span>
    </span>
  );
}

export default function CommunityImpact() {
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
      id="impact"
      ref={sectionRef}
      className="w-full max-w-[1152px] mx-auto px-6 py-16"
    >
      <div className="relative glass-card rounded-[48px] border border-white/40 shadow-md overflow-hidden min-h-[630px] flex flex-col lg:flex-row items-center">
        {/* Left Content */}
        <div className="flex-1 p-10 md:p-16 reveal">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-medium text-foreground tracking-tight leading-tight">
            Menjaga
          </h2>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif italic text-primary tracking-tight leading-tight">
            Jejak Komunitas Kita
          </h2>

          <p className="mt-6 text-lg text-[#57534d] max-w-md leading-relaxed">
            Analitik langsung dari upaya kolektif kita untuk mengurangi
            ketergantungan pada TPA dan memulihkan kesehatan tanah di wilayah kita.
          </p>

          {/* Stats */}
          <div className="flex gap-12 mt-12">
            <div>
              <p className="text-5xl font-medium text-foreground tracking-tight">
                <AnimatedCounter end={58} suffix="%" />
              </p>
              <p className="mt-2 text-xs font-semibold text-muted uppercase tracking-widest leading-4">
                Pengurangan
                <br />
                TPA
              </p>
            </div>
            <div>
              <p className="text-5xl font-medium text-foreground tracking-tight">
                <AnimatedCounter end={540} suffix="kg" />
              </p>
              <p className="mt-2 text-xs font-semibold text-muted uppercase tracking-widest leading-4">
                Kompos
                <br />
                Dihasilkan
              </p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 p-6 md:p-10 reveal animate-delay-200">
          <div className="relative w-full max-w-[463px] aspect-square rounded-3xl overflow-hidden shadow-xl">
            <Image
              src={communityImpactImg}
              alt="Community garden composting"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 463px"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

            {/* Live Tracker Badge */}
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between px-4 py-4 rounded-2xl border border-white/20 glass">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-green-dot animate-pulse-dot" />
                <span className="text-sm font-medium text-white">
                  Pelacak Dampak Real-time
                </span>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
              >
                <path
                  d="M7 5L12 10L7 15"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
