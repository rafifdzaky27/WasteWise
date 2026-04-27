"use client";

import type { BioBinUnit, SensorReading } from "../../lib/types";

interface BioBinStatusProps {
  biobin: BioBinUnit;
  latestReading: SensorReading | null;
  isConnected: boolean;
}

function getStatusStyle(status: string) {
  switch (status) {
    case "active":
      return {
        bg: "bg-accent-green",
        text: "text-green-status-text",
        label: "Aktif",
      };
    case "maintenance":
      return {
        bg: "bg-yellow-bg",
        text: "text-amber-700",
        label: "Maintenance",
      };
    case "harvesting":
      return {
        bg: "bg-purple-bg",
        text: "text-purple-700",
        label: "Panen",
      };
    default:
      return {
        bg: "bg-stone-light",
        text: "text-muted",
        label: status,
      };
  }
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Belum ada data";
  const now = new Date();
  const then = new Date(dateStr);
  const diffMs = now.getTime() - then.getTime();
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 10) return "Baru saja";
  if (diffSec < 60) return `${diffSec} detik lalu`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} menit lalu`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} jam lalu`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay} hari lalu`;
}

interface MetricCardProps {
  icon: string;
  label: string;
  value: string;
  unit: string;
  color: string;
}

function MetricCard({ icon, label, value, unit, color }: MetricCardProps) {
  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-xl border border-stone-border p-4 flex flex-col items-center gap-1 transition-all duration-200 hover:shadow-md hover:border-accent-green-border">
      <span className="text-xl">{icon}</span>
      <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
        {label}
      </p>
      <p className="text-lg font-bold" style={{ color }}>
        {value}
        <span className="text-xs font-normal text-muted ml-0.5">{unit}</span>
      </p>
    </div>
  );
}

export default function BioBinStatus({
  biobin,
  latestReading,
  isConnected,
}: BioBinStatusProps) {
  const statusStyle = getStatusStyle(biobin.status);

  return (
    <div className="glass-card rounded-2xl border border-stone-border p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent-green rounded-xl flex items-center justify-center text-2xl shadow-sm">
            🌱
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {biobin.name}
            </h2>
            <p className="text-xs text-muted flex items-center gap-1.5">
              📍 {biobin.location || "Lokasi tidak tersedia"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold ${statusStyle.bg} ${statusStyle.text}`}
          >
            {statusStyle.label}
          </span>
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected
                  ? "bg-green-dot animate-pulse-dot"
                  : "bg-muted-light"
              }`}
            />
            <span className="text-[10px] text-muted">
              {isConnected ? "Live" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Metric Grid */}
      {latestReading ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <MetricCard
              icon="🌡️"
              label="Suhu"
              value={Number(latestReading.temperature).toFixed(1)}
              unit="°C"
              color="#ef4444"
            />
            <MetricCard
              icon="💧"
              label="Kelembapan"
              value={Number(latestReading.humidity).toFixed(1)}
              unit="%"
              color="#3b82f6"
            />
            <MetricCard
              icon="🔥"
              label="Metana"
              value={Number(latestReading.methane_level).toFixed(0)}
              unit="ppm"
              color="#f59e0b"
            />
            <MetricCard
              icon="🧪"
              label="Amonia"
              value={Number(latestReading.ammonia_level).toFixed(0)}
              unit="ppm"
              color="#8b5cf6"
            />
          </div>
          <p className="text-[11px] text-muted text-right">
            Terakhir diperbarui: {timeAgo(latestReading.recorded_at)}
          </p>
        </>
      ) : (
        <div className="flex items-center justify-center py-8 text-muted text-sm">
          <span className="mr-2">📡</span>
          Menunggu data sensor pertama...
        </div>
      )}
    </div>
  );
}
