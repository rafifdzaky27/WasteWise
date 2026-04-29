"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
import DepositCard from "../../../components/dashboard/DepositCard";
import QRDisplay from "../../../components/dashboard/QRDisplay";
import type { WasteDeposit, WasteType } from "../../../lib/types";

export default function DepositPage() {
  const [deposits, setDeposits] = useState<WasteDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [wasteType, setWasteType] = useState<WasteType>("organic");
  const [weightKg, setWeightKg] = useState("");
  const [showQR, setShowQR] = useState<WasteDeposit | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchDeposits() {
    const res = await fetch("/api/deposits");
    if (res.ok) {
      const data = await res.json();
      setDeposits(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchDeposits();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    const weight = parseFloat(weightKg);
    if (isNaN(weight) || weight <= 0) {
      setError("Masukkan berat yang valid");
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/deposits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ weight_kg: weight, waste_type: wasteType }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Gagal membuat setoran");
      setSubmitting(false);
      return;
    }

    const deposit = await res.json();
    setSuccess(`Setoran berhasil! Anda mendapatkan ${deposit.points_earned} poin ⭐`);
    setWeightKg("");
    setShowQR(deposit);
    fetchDeposits();
    setSubmitting(false);
  }

  // Get user profile for header
  const supabase = createClient();
  const [totalPoints, setTotalPoints] = useState(0);
  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("total_points")
          .eq("id", user.id)
          .single();
        if (data) setTotalPoints(data.total_points);
      }
    }
    getProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success]);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Setor{" "}
          <span className="font-serif italic text-primary">Sampah</span>
        </h1>
        <p className="text-muted text-sm mt-1">
          Setorkan sampah Anda dan dapatkan poin reward.
        </p>
      </div>

      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl p-6 max-w-sm w-full animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">
                QR Setoran Anda
              </h2>
              <button
                onClick={() => setShowQR(null)}
                aria-label="Tutup QR code"
                className="w-8 h-8 rounded-full bg-stone-light flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            <QRDisplay
              qrCode={showQR.qr_code}
              wasteType={showQR.waste_type}
              weightKg={showQR.weight_kg}
              pointsEarned={showQR.points_earned}
              depositId={showQR.id}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: New Deposit Form */}
        <div className="lg:col-span-2">
          {/* Points Card */}
          <div className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-5 text-white mb-4 shadow-lg">
            <p className="text-sm opacity-80">Poin Anda</p>
            <p className="text-3xl font-bold mt-1">{totalPoints} ⭐</p>
          </div>

          <div className="bg-white border border-stone-border rounded-2xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Setor Baru
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Waste Type Selector */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Jenis Sampah
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(["organic", "recyclable"] as WasteType[]).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setWasteType(type)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                        wasteType === type
                          ? "border-primary bg-accent-green shadow-md"
                          : "border-stone-border bg-white hover:border-primary/30"
                      }`}
                    >
                      <span className="text-2xl">
                        {type === "organic" ? "🌿" : "♻️"}
                      </span>
                      <span className="text-sm font-medium capitalize">
                        {type === "organic" ? "Organik" : "Daur Ulang"}
                      </span>
                      <span className="text-[10px] text-muted">
                        {type === "organic" ? "10 poin/kg" : "15 poin/kg"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Weight Input */}
              <div>
                <label
                  htmlFor="weight"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Berat (kg)
                </label>
                <div className="relative">
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="500"
                    value={weightKg}
                    onChange={(e) => setWeightKg(e.target.value)}
                    placeholder="cth. 2.5"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-stone-border bg-white text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted font-medium">
                    kg
                  </span>
                </div>
              </div>

              {/* Points Preview */}
              {weightKg && parseFloat(weightKg) > 0 && (
                <div className="bg-accent-green border border-accent-green-border rounded-xl p-3 text-center">
                  <p className="text-xs text-muted mb-1">
                    Estimasi Poin
                  </p>
                  <p className="text-2xl font-bold text-primary">
                    +
                    {Math.round(
                      parseFloat(weightKg) *
                        (wasteType === "organic" ? 10 : 15)
                    )}{" "}
                    ⭐
                  </p>
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {success && (
                <div className="bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-primary-dark text-white font-medium py-3.5 rounded-xl hover:bg-primary-darker transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="opacity-25"
                      />
                      <path
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        className="opacity-75"
                      />
                    </svg>
                    Membuat Setoran...
                  </span>
                ) : (
                  "Kirim Setoran"
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Deposit History */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">
              Riwayat Setoran
            </h2>
            <span className="text-xs font-medium text-muted bg-stone-light px-2.5 py-1 rounded-full">
              {deposits.length} data
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-border rounded-2xl p-4 animate-pulse"
                >
                  <div className="flex gap-3">
                    <div className="w-10 h-10 bg-stone-light rounded-xl" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-stone-light rounded w-1/3" />
                      <div className="h-3 bg-stone-light rounded w-1/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : deposits.length === 0 ? (
            <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-accent-green rounded-full flex items-center justify-center text-3xl mb-4">
                ♻️
              </div>
              <h3 className="font-semibold text-foreground mb-1">
                Belum ada setoran
              </h3>
              <p className="text-sm text-muted">
                Kirim setoran sampah pertama Anda untuk mulai mengumpulkan poin!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {deposits.map((deposit) => (
                <DepositCard
                  key={deposit.id}
                  wasteType={deposit.waste_type}
                  weightKg={deposit.weight_kg}
                  pointsEarned={deposit.points_earned}
                  verified={!!deposit.verified_by}
                  createdAt={deposit.created_at}
                  onShowQR={
                    !deposit.verified_by
                      ? () => setShowQR(deposit)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
