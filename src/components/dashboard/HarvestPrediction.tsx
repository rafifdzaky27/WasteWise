"use client";

import { useEffect, useState, useCallback } from "react";

interface PredictionData {
  status: "predicted" | "ready" | "no_data";
  fermentation_days: number;
  days_remaining: number;
  predicted_harvest_date: string | null;
  total_days_tracked: number;
}

interface HarvestPredictionProps {
  biobinId: string;
}

export default function HarvestPrediction({
  biobinId,
}: HarvestPredictionProps) {
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrediction = useCallback(async () => {
    try {
      const res = await fetch(`/api/sensors/predict?biobin_id=${biobinId}`);
      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
      }
    } catch {
      // Silently fail — prediction is supplementary
    } finally {
      setIsLoading(false);
    }
  }, [biobinId]);

  useEffect(() => {
    fetchPrediction();
    // Refresh prediction every 60 seconds
    const interval = setInterval(fetchPrediction, 60000);
    return () => clearInterval(interval);
  }, [fetchPrediction]);

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl border border-stone-border p-6 animate-pulse">
        <div className="h-5 w-40 bg-stone-lighter rounded mb-4" />
        <div className="h-4 w-full bg-stone-lighter rounded mb-2" />
        <div className="h-20 w-full bg-stone-lighter rounded" />
      </div>
    );
  }

  if (!prediction || prediction.status === "no_data") {
    return (
      <div className="glass-card rounded-2xl border border-stone-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
          🌱 Prediksi Compose
        </h3>
        <p className="text-sm text-muted">
          Belum ada data sensor yang cukup untuk memprediksi waktu compose.
        </p>
      </div>
    );
  }

  const THRESHOLD = 21;
  const progress = Math.min(
    (prediction.fermentation_days / THRESHOLD) * 100,
    100
  );

  return (
    <div className="glass-card rounded-2xl border border-stone-border p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
          🌱 Prediksi Compose
        </h3>
        {prediction.status === "ready" ? (
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-accent-green text-green-status-text">
            ✅ Siap Compose!
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-yellow-bg text-amber-700">
            ⏳ Fermentasi
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-muted mb-1.5">
          <span>Hari fermentasi</span>
          <span className="font-semibold text-foreground">
            {prediction.fermentation_days} / {THRESHOLD} hari
          </span>
        </div>
        <div className="w-full h-3 bg-stone-light rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${progress}%`,
              background:
                prediction.status === "ready"
                  ? "linear-gradient(90deg, #05df72, #00bc7d)"
                  : "linear-gradient(90deg, #f59e0b, #ef4444)",
            }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white/50 rounded-xl p-3 border border-stone-border">
          <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
            Hari Tersisa
          </p>
          <p className="text-xl font-bold text-foreground mt-1">
            {prediction.days_remaining}
            <span className="text-xs font-normal text-muted ml-1">hari</span>
          </p>
        </div>
        <div className="bg-white/50 rounded-xl p-3 border border-stone-border">
          <p className="text-[10px] uppercase tracking-wider text-muted font-medium">
            Hari Terlacak
          </p>
          <p className="text-xl font-bold text-foreground mt-1">
            {prediction.total_days_tracked}
            <span className="text-xs font-normal text-muted ml-1">hari</span>
          </p>
        </div>
      </div>

      {prediction.predicted_harvest_date && (
        <p className="text-xs text-muted mt-3 text-center">
          📅 Estimasi compose:{" "}
          <span className="font-medium text-foreground">
            {new Date(prediction.predicted_harvest_date).toLocaleDateString(
              "id-ID",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </span>
        </p>
      )}
    </div>
  );
}
