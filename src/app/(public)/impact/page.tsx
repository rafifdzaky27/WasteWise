"use client";

import { useEffect, useState } from "react";
import ImpactCounter from "../../../components/impact/ImpactCounter";
import ImpactChart from "../../../components/impact/ImpactChart";

interface ImpactData {
  totalWaste: number;
  organicWaste: number;
  recyclableWaste: number;
  co2Avoided: number;
  compostProduced: number;
  activeUsers: number;
  totalDeposits: number;
  landfillReduction: number;
  currentMonthWeight: number;
  monthlyTarget: number;
  dailyTrend: any[];
}

export default function ImpactPage() {
  const [data, setData] = useState<ImpactData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImpactData() {
      try {
        const res = await fetch("/api/impact");
        if (res.ok) {
          setData(await res.json());
        }
      } catch (error) {
        console.error("Failed to load impact data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImpactData();
  }, []);

  if (loading || !data) {
    return (
      <div className="w-full max-w-[1152px] mx-auto px-6 py-32 animate-pulse">
        <div className="h-12 bg-stone-light rounded-xl w-1/3 mb-6 mx-auto" />
        <div className="h-6 bg-stone-light rounded w-1/2 mb-16 mx-auto" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-stone-light rounded-3xl" />
          ))}
        </div>
        <div className="h-96 bg-stone-light rounded-3xl" />
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen bg-stone-50 overflow-hidden">
      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-20 px-6 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100/50 via-stone-50 to-stone-50 pointer-events-none" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-xs font-semibold tracking-[2.4px] uppercase text-primary mb-6 animate-fade-in">
            Laporan Transparansi
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-medium tracking-tight text-foreground mb-6 animate-fade-in-up">
            Dampak <span className="font-serif italic text-primary">Kolektif</span> Kita
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto leading-relaxed animate-fade-in-up animate-delay-200">
            Melihat lebih dekat bagaimana kontribusi kecil setiap warga
            menghasilkan perubahan besar bagi lingkungan desa kita.
          </p>
        </div>
      </section>

      {/* Main Stats Grid */}
      <section className="relative z-20 w-full max-w-[1152px] mx-auto px-6 pb-20 -mt-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <ImpactCounter
            end={data.totalWaste}
            suffix=" kg"
            decimals={1}
            label="Sampah Terkelola"
            icon="♻️"
            color="bg-white"
          />
          <ImpactCounter
            end={data.co2Avoided}
            suffix=" kg"
            decimals={1}
            label="Emisi CO₂ Dihindari"
            icon="☁️"
            color="bg-accent-green border-accent-green-border"
          />
          <ImpactCounter
            end={data.compostProduced}
            suffix=" kg"
            decimals={1}
            label="Kompos Dihasilkan"
            icon="🌱"
            color="bg-yellow-bg border-yellow-border"
          />
          <ImpactCounter
            end={data.activeUsers}
            label="Warga Berpartisipasi"
            icon="👥"
            color="bg-blue-bg border-blue-border"
          />
        </div>
      </section>

      {/* Target Progress & Chart */}
      <section className="w-full max-w-[1152px] mx-auto px-6 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="lg:col-span-1 glass-card rounded-3xl p-8 border border-stone-border shadow-sm flex flex-col justify-center">
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Target Bulanan
              </h3>
              <p className="text-sm text-muted">
                Pengurangan sampah TPA bulan ini.
              </p>
            </div>

            <div className="relative w-48 h-48 mx-auto mb-6">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#016630"
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 45}`}
                  strokeDashoffset={`${2 * Math.PI * 45 * (1 - data.landfillReduction / 100)}`}
                  className="transition-all duration-1500 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-primary">
                  {data.landfillReduction}%
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted mt-1">
                  Tercapai
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                {data.currentMonthWeight} kg / {data.monthlyTarget} kg
              </p>
              <p className="text-xs text-muted mt-1">
                Terkumpul di bulan ini
              </p>
            </div>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2">
            <ImpactChart data={data.dailyTrend} />
          </div>
        </div>
      </section>
    </main>
  );
}
