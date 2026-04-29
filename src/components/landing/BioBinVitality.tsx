"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "../../lib/supabase/client";

// Icon components extracted to constants
const TempIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M15 13V5C15 3.34 13.66 2 12 2S9 3.34 9 5V13C6.79 14.66 6.34 17.79 8 20C9.66 22.21 12.79 22.66 15 21C17.21 19.34 17.66 16.21 16 14C15.72 13.62 15.38 13.28 15 13ZM12 4C12.55 4 13 4.45 13 5V8H11V5C11 4.45 11.45 4 12 4Z" fill="#016630"/></svg>;
const HumidIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2C6 12 4 15.54 4 18C4 22 7.58 22 12 22C16.42 22 20 22 20 18C20 15.54 18 12 12 2ZM7 18C7 15.83 8.56 13.21 12 8.38C15.44 13.21 17 15.83 17 18C17 19.64 16.21 20 12 20C7.79 20 7 19.64 7 18Z" fill="#3B82F6"/></svg>;
const HealthIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2L1 21H23L12 2ZM12 6L19.53 19H4.47L12 6ZM11 10V14H13V10H11ZM11 16V18H13V16H11Z" fill="#F59E0B"/></svg>;
const TimeIcon = <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M11.99 2C6.47 2 2 6.48 2 12C2 17.52 6.47 22 11.99 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 11.99 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20ZM12.5 7H11V13L16.25 16.15L17 14.92L12.5 12.25V7Z" fill="#A855F7"/></svg>;

const fallbackMetrics = [
  { value: "54°C", label: "Suhu", iconBg: "bg-accent-green", iconBorder: "border-accent-green-border", icon: TempIcon },
  { value: "62%", label: "Kelembapan", iconBg: "bg-blue-bg", iconBorder: "border-blue-border", icon: HumidIcon },
  { value: "Sehat", label: "Kondisi", iconBg: "bg-yellow-bg", iconBorder: "border-yellow-border", icon: HealthIcon },
  { value: "4 Hari", label: "Menuju Compose", iconBg: "bg-purple-bg", iconBorder: "border-purple-border", icon: TimeIcon },
];

export default function BioBinVitality() {
  const sectionRef = useRef<HTMLElement>(null);
  const [dbMetrics, setDbMetrics] = useState<any[]>([]);

  useEffect(() => {
    const fetchBioBin = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("biobin_units").select("*").limit(1).single();
      if (data) {
        setDbMetrics([
          { value: `${data.temperature_c}°C`, label: "Suhu", iconBg: "bg-accent-green", iconBorder: "border-accent-green-border", icon: TempIcon },
          { value: `${data.humidity_percent}%`, label: "Kelembapan", iconBg: "bg-blue-bg", iconBorder: "border-blue-border", icon: HumidIcon },
          { value: data.status === "active" ? "Sehat" : data.status, label: "Kondisi", iconBg: "bg-yellow-bg", iconBorder: "border-yellow-border", icon: HealthIcon },
          { value: "4 Hari", label: "Menuju Compose", iconBg: "bg-purple-bg", iconBorder: "border-purple-border", icon: TimeIcon },
        ]);
      }
    };
    fetchBioBin();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const displayMetrics = dbMetrics.length > 0 ? dbMetrics : fallbackMetrics;

  return (
    <section
      id="vitality"
      ref={sectionRef}
      className="w-full max-w-[1000px] mx-auto px-6 py-16"
    >
      <div className="bg-white/40 border border-white/40 rounded-[48px] shadow-md overflow-hidden p-8 sm:p-12 reveal">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-foreground">
            BioCompose{" "}
            <span className="font-serif italic text-[#096]">Vitality</span>
          </h2>
          <p className="mt-4 text-base text-muted max-w-md mx-auto">
            Memantau kesehatan sistem pencernaan organik desa kita
            secara real-time.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {displayMetrics.map((metric, i) => (
            <div
              key={metric.label}
              className={`reveal animate-delay-${(i + 1) * 100} flex flex-col items-center text-center`}
            >
              <div
                className={`w-16 h-16 rounded-full ${metric.iconBg} border ${metric.iconBorder} shadow-md flex items-center justify-center mb-5`}
              >
                {metric.icon}
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {metric.value}
              </p>
              <p className="mt-1 text-xs font-medium text-muted-light uppercase tracking-widest">
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Status Badge */}
        <div className="flex justify-center reveal animate-delay-500">
          <div className="inline-flex items-center gap-3 bg-accent-green border border-accent-green-border rounded-full px-6 py-2">
            <span className="w-2 h-2 rounded-full bg-green-status animate-pulse-dot" />
            <span className="text-xs font-semibold text-green-status-text uppercase tracking-widest">
              Status Sistem: Pengomposan Optimal
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
