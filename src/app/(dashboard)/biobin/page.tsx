"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../lib/supabase/client";
import { useSensorData } from "../../../lib/hooks/useSensorData";
import SensorChart from "../../../components/dashboard/SensorChart";
import BioBinStatus from "../../../components/dashboard/BioBinStatus";
import HarvestPrediction from "../../../components/dashboard/HarvestPrediction";
import type { BioBinUnit } from "../../../lib/types";

export default function BioBinPage() {
  const [biobins, setBiobins] = useState<BioBinUnit[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loadingBiobins, setLoadingBiobins] = useState(true);

  const { readings, latestReading, isConnected, error, isLoading } =
    useSensorData(selectedId);

  // Fetch list of BioBin units
  useEffect(() => {
    async function fetchBiobins() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("biobin_units")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Failed to fetch BioBin units:", error);
      } else if (data && data.length > 0) {
        setBiobins(data);
        setSelectedId(data[0].id);
      }
      setLoadingBiobins(false);
    }

    fetchBiobins();
  }, []);

  const selectedBiobin = biobins.find((b) => b.id === selectedId);

  // Loading state
  if (loadingBiobins) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="h-8 w-64 bg-stone-lighter rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-96 bg-stone-lighter rounded animate-pulse" />
        </div>
        <div className="grid gap-6">
          <div className="h-48 bg-stone-lighter rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-72 bg-stone-lighter rounded-2xl animate-pulse" />
            <div className="h-72 bg-stone-lighter rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Empty state — no BioBin units
  if (biobins.length === 0) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-20 h-20 bg-stone-light rounded-full flex items-center justify-center text-4xl mb-6">
          🌡️
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
          BioCompose IoT Dashboard
        </h1>
        <p className="text-muted max-w-md mb-6">
          Belum ada unit BioCompose yang terdaftar. Hubungi admin untuk menambahkan
          unit BioCompose ke sistem.
        </p>
        <div className="px-4 py-2 rounded-xl bg-yellow-bg border border-yellow-border text-sm text-amber-700">
          💡 Tip: Admin dapat menambahkan unit BioCompose melalui Supabase Dashboard
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1">
          🌡️ BioCompose IoT Dashboard
        </h1>
        <p className="text-sm text-muted">
          Monitoring suhu, kelembapan, dan gas secara real-time untuk
          pengomposan optimal.
        </p>
      </div>

      {/* BioCompose Selector (if multiple units) */}
      {biobins.length > 1 && (
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2 animate-fade-in animate-delay-100">
          {biobins.map((b) => (
            <button
              key={b.id}
              onClick={() => setSelectedId(b.id)}
              className={`flex-shrink-0 px-5 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                b.id === selectedId
                  ? "bg-primary text-white border-primary shadow-md"
                  : "bg-white/60 text-foreground border-stone-border hover:bg-accent-green hover:border-accent-green-border"
              }`}
            >
              <span className="mr-2">🌱</span>
              {b.name}
            </button>
          ))}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
          <span>⚠️</span>
          {error}
        </div>
      )}

      {/* BioCompose Status Card */}
      {selectedBiobin && (
        <div className="mb-6 animate-fade-in animate-delay-200">
          <BioBinStatus
            biobin={selectedBiobin}
            latestReading={latestReading}
            isConnected={isConnected}
          />
        </div>
      )}

      {/* Loading indicator for chart data */}
      {isLoading && (
        <div className="mb-6 flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-muted">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm">Memuat data sensor...</span>
          </div>
        </div>
      )}

      {/* Sensor Charts Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 animate-fade-in animate-delay-300">
          <SensorChart
            readings={readings}
            dataKey="temperature"
            label="Suhu Kompos"
            unit="°C"
            color="#ef4444"
            gradientId="tempGrad"
          />
          <SensorChart
            readings={readings}
            dataKey="humidity"
            label="Kelembapan"
            unit="%"
            color="#3b82f6"
            gradientId="humidGrad"
          />
          <SensorChart
            readings={readings}
            dataKey="methane_level"
            label="Gas Metana (CH₄)"
            unit=" ppm"
            color="#f59e0b"
            gradientId="methaneGrad"
          />
          <SensorChart
            readings={readings}
            dataKey="ammonia_level"
            label="Gas Amonia (NH₃)"
            unit=" ppm"
            color="#8b5cf6"
            gradientId="ammoniaGrad"
          />
        </div>
      )}

      {/* Harvest Prediction */}
      {selectedId && !isLoading && (
        <div className="animate-fade-in animate-delay-400">
          <HarvestPrediction biobinId={selectedId} />
        </div>
      )}
    </div>
  );
}
