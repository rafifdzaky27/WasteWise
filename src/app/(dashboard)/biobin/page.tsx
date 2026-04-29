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
  const [isSimulating, setIsSimulating] = useState(false);

  const { readings, latestReading, isConnected, error, isLoading } =
    useSensorData(selectedId);

  const [isAdmin, setIsAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBinName, setNewBinName] = useState("");
  const [newBinLocation, setNewBinLocation] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");

  // Fetch list of BioBin units and role
  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
        setIsAdmin(profile?.role === "admin");
      }

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

    fetchData();
  }, []);

  async function handleAddBioBin() {
    if (!newBinName.trim()) return;
    setAdding(true);
    setAddError("");
    const supabase = createClient();
    const { data, error } = await supabase.from("biobin_units").insert({
      name: newBinName.trim(),
      location: newBinLocation.trim() || "Desa",
      status: "active",
    }).select().single();
    if (error) {
      console.error("Add BioBin error:", error);
      setAddError(error.message || "Gagal menambahkan unit. Periksa koneksi atau hak akses.");
      setAdding(false);
      return;
    }
    if (data) {
      setBiobins(prev => [...prev, data]);
      setSelectedId(data.id);
      setShowAddModal(false);
      setNewBinName("");
      setNewBinLocation("");
    }
    setAdding(false);
  }

  // IoT Simulator Effect
  useEffect(() => {
    if (!isSimulating || !selectedId) return;

    let baseTemp = 58.0;
    let baseHumid = 60.0;
    let baseMethane = 120.0;
    let baseAmmonia = 15.0;

    const interval = setInterval(async () => {
      // Generate slight random variations
      const temp = baseTemp + (Math.random() * 4 - 2);
      const humid = baseHumid + (Math.random() * 6 - 3);
      const methane = Math.max(0, baseMethane + (Math.random() * 20 - 10));
      const ammonia = Math.max(0, baseAmmonia + (Math.random() * 5 - 2));

      try {
        await fetch("/api/sensors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            biobin_id: selectedId,
            temperature: parseFloat(temp.toFixed(2)),
            humidity: parseFloat(humid.toFixed(2)),
            methane_level: parseFloat(methane.toFixed(2)),
            ammonia_level: parseFloat(ammonia.toFixed(2)),
          }),
        });
      } catch (err) {
        console.error("IoT Simulator failed to push data:", err);
      }
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [isSimulating, selectedId]);

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
          Belum ada unit BioCompose yang terdaftar. {isAdmin ? "Tambahkan unit pertama Anda." : "Hubungi admin untuk menambahkan unit BioCompose ke sistem."}
        </p>
        {isAdmin ? (
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-dark text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-primary-darker transition-colors"
          >
            + Tambah Unit BioCompose
          </button>
        ) : (
          <div className="px-4 py-2 rounded-xl bg-yellow-bg border border-yellow-border text-sm text-amber-700">
            💡 Tip: Admin dapat menambahkan unit BioCompose melalui halaman ini
          </div>
        )}

        {/* Add BioBin Modal (also available in empty state) */}
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
              <h3 className="text-lg font-medium text-foreground mb-4">Tambah Unit BioCompose</h3>
              {addError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2 mb-3">{addError}</div>
              )}
              <input
                type="text"
                value={newBinName}
                onChange={(e) => setNewBinName(e.target.value)}
                placeholder="Nama unit, cth: BioBin Desa Maju"
                className="w-full bg-stone-light/50 border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
                autoFocus
              />
              <input
                type="text"
                value={newBinLocation}
                onChange={(e) => setNewBinLocation(e.target.value)}
                placeholder="Lokasi, cth: RT 03 / Balai Desa"
                className="w-full bg-stone-light/50 border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => { setShowAddModal(false); setAddError(""); }}
                  className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                  disabled={adding}
                >
                  Batal
                </button>
                <button
                  onClick={handleAddBioBin}
                  disabled={!newBinName.trim() || adding}
                  className="bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-darker transition-colors disabled:opacity-50"
                >
                  {adding ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          BioCompose <span className="font-serif italic text-primary">IoT Tracking</span>
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-lg">
          Monitoring suhu, kelembapan, dan gas secara real-time untuk
          pengomposan optimal.
        </p>
      </div>

      {/* BioCompose Selector (if multiple units) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 animate-fade-in animate-delay-100">
        <div className="flex gap-3 overflow-x-auto pb-2">
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
          {isAdmin && (
            <button
              onClick={() => setShowAddModal(true)}
              className="flex-shrink-0 px-5 py-3 rounded-xl border border-dashed border-stone-border text-sm font-medium bg-stone-50 text-muted hover:text-primary hover:border-primary/50 transition-colors flex items-center gap-2"
            >
              + Tambah Unit
            </button>
          )}
        </div>

        {/* IoT Simulator Toggle for Vercel Demo */}
        {selectedId && (
          <button
            onClick={() => setIsSimulating(!isSimulating)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
              isSimulating
                ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                : "bg-stone-800 text-white border-stone-900 hover:bg-stone-900"
            }`}
          >
            {isSimulating ? (
              <>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Hentikan Simulasi IoT
              </>
            ) : (
              <>
                <span>▶️</span> Mulai Simulasi IoT (Demo)
              </>
            )}
          </button>
        )}
      </div>

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

      {/* Add BioBin Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            <h3 className="text-lg font-medium text-foreground mb-4">Tambah Unit BioCompose</h3>
            {addError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-3 py-2 mb-3">{addError}</div>
            )}
            <input
              type="text"
              value={newBinName}
              onChange={(e) => setNewBinName(e.target.value)}
              placeholder="Nama unit, cth: BioBin RT 03"
              className="w-full bg-stone-light/50 border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
              autoFocus
            />
            <input
              type="text"
              value={newBinLocation}
              onChange={(e) => setNewBinLocation(e.target.value)}
              placeholder="Lokasi, cth: RT 03 / Balai Desa"
              className="w-full bg-stone-light/50 border border-stone-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setShowAddModal(false); setAddError(""); }}
                className="px-4 py-2 text-sm font-medium text-muted hover:text-foreground transition-colors"
                disabled={adding}
              >
                Batal
              </button>
              <button
                onClick={handleAddBioBin}
                disabled={!newBinName.trim() || adding}
                className="bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-primary-darker transition-colors disabled:opacity-50"
              >
                {adding ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
