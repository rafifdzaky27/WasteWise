"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../lib/supabase/client";
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
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

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
    setSuccess(`Setoran berhasil! Anda mendapatkan ${deposit.points_earned} poin`);
    setWeightKg("");
    setShowQR(deposit);
    fetchDeposits();
    setSubmitting(false);
  }

  // Get user profile
  const supabase = createClient();
  const [totalPoints, setTotalPoints] = useState(0);
  const [monthlyWeight, setMonthlyWeight] = useState(0);
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

  // Calculate monthly weight
  useEffect(() => {
    const now = new Date();
    const thisMonth = deposits.filter(d => {
      const created = new Date(d.created_at);
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
    });
    setMonthlyWeight(Math.round(thisMonth.reduce((sum, d) => sum + Number(d.weight_kg), 0) * 10) / 10);
  }, [deposits]);

  const monthlyGoal = 50;
  const progressPercent = Math.min((monthlyWeight / monthlyGoal) * 100, 100);

  return (
    <>
      {/* QR Modal */}
      {showQR && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-background rounded-3xl p-6 max-w-sm w-full animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">QR Setoran Anda</h2>
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

      <div className="animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column — Editorial Content */}
        <div>
          {/* Editorial Heading */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-tight">
              Catat{" "}
              <span className="font-serif italic text-primary">Setoran</span>
            </h1>
            <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
              Timbang sampah yang sudah dipilah, masukkan berat, dan konfirmasi kontribusi Anda pada ekonomi sirkular.
            </p>
          </div>

          {/* Monthly Goal Card */}
          <div className="bg-white border border-stone-border rounded-2xl p-6 mb-4">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">Target Bulanan</p>
            <p className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              {monthlyWeight}<span className="text-lg font-medium text-muted ml-2">kg</span>
            </p>
            <div className="mt-4 h-1.5 bg-stone-light rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">{monthlyWeight} / {monthlyGoal} kg bulan ini</p>
          </div>

          {/* Total Points Card */}
          <div className="bg-white border border-stone-border rounded-2xl p-6">
            <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">Total Poin</p>
            <p className="text-3xl sm:text-4xl font-medium text-foreground tracking-tight">
              {totalPoints.toLocaleString("id-ID")}<span className="text-lg font-medium text-muted ml-2">pts</span>
            </p>
          </div>
        </div>

        {/* Right Column — Deposit Form (mimics QR scanner area from mockup) */}
        <div>
          <div className="bg-white border border-stone-border rounded-2xl overflow-hidden">
            {/* Waste Type Selector Header */}
            <div className="p-6 border-b border-stone-border">
              <p className="text-sm font-medium text-foreground mb-3">Jenis Sampah</p>
              <div className="grid grid-cols-2 gap-3">
                {(["organic", "recyclable"] as WasteType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setWasteType(type)}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                      wasteType === type
                        ? "border-primary bg-accent-green"
                        : "border-stone-border bg-white hover:border-primary/30"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${type === "organic" ? "bg-accent-green" : "bg-blue-bg"}`}>
                      {type === "organic" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v6h-6" /></svg>
                      )}
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {type === "organic" ? "Organik" : "Daur Ulang"}
                      </p>
                      <p className="text-[10px] text-muted">
                        {type === "organic" ? "10 poin/kg" : "15 poin/kg"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Weight Input — underline style */}
            <div className="p-6 border-b border-stone-border">
              <label htmlFor="weight" className="text-sm font-medium text-muted mb-3 block">
                Berat (kg)
              </label>
              <input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                max="500"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="0.0"
                required
                className="w-full text-3xl sm:text-4xl font-medium text-foreground bg-transparent border-b-2 border-stone-border pb-2 focus:border-primary focus:outline-none transition-colors placeholder:text-stone-lighter"
              />
            </div>

            {/* Points Preview (Always visible to avoid layout shift) */}
            <div className="px-6 py-4 bg-stone-light/50 flex items-center justify-between">
              <p className="text-sm text-muted">
                Poin <span className="font-serif italic">Didapat</span>
              </p>
              <p className="text-xl font-bold text-primary">
                +{weightKg && parseFloat(weightKg) > 0 ? Math.round(parseFloat(weightKg) * (wasteType === "organic" ? 10 : 15)) : 0}
              </p>
            </div>

            {/* Messages */}
            {error && (
              <div className="mx-6 my-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            {success && (
              <div className="mx-6 my-3 bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <div className="p-6">
              <button
                onClick={handleSubmit}
                disabled={submitting || !weightKg}
                className="w-full bg-primary-dark text-white font-medium py-4 rounded-xl hover:bg-primary-darker transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed text-base flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Membuat Setoran...
                  </>
                ) : (
                  <>
                    Konfirmasi Setoran
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>

      {/* Deposit History — Ledger style */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-primary rounded-full" />
          <h2 className="text-xl sm:text-2xl font-medium text-foreground">
            Riwayat <span className="font-serif italic">Setoran</span>
          </h2>
          <span className="text-xs font-medium text-muted bg-stone-light px-2.5 py-1 rounded-full ml-auto">
            {deposits.length} catatan
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="py-5 border-b border-stone-border animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 bg-stone-light rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-stone-light rounded w-1/3" />
                  <div className="h-3 bg-stone-light rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : deposits.length === 0 ? (
          <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
            <p className="text-muted text-sm">Belum ada catatan setoran. Mulai kontribusi pertama Anda di atas.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {deposits.slice(0, page * ITEMS_PER_PAGE).map((deposit) => (
              <div
                key={deposit.id}
                className="flex items-center justify-between py-5 border-b border-stone-border last:border-b-0 group cursor-pointer hover:bg-stone-light/30 -mx-4 px-4 rounded-xl transition-colors"
                onClick={!deposit.verified_by ? () => setShowQR(deposit) : undefined}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${deposit.waste_type === "organic" ? "bg-accent-green" : "bg-blue-bg"}`}>
                    {deposit.waste_type === "organic" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9" /></svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v6h-6" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {deposit.waste_type === "organic" ? "Sampah Organik" : "Daur Ulang"}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      BUMDes Desa • {new Date(deposit.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">+ {Number(deposit.weight_kg)} kg</p>
                  <p className="text-xs text-muted mt-0.5">
                    {deposit.verified_by ? (
                      <span className="text-green-status-text">✓ Terverifikasi</span>
                    ) : (
                      <span className="text-amber-600">Menunggu</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
            
            {deposits.length > page * ITEMS_PER_PAGE && (
              <div className="pt-6 pb-2 text-center">
                <button
                  onClick={() => setPage((p) => p + 1)}
                  className="text-sm font-serif italic text-muted hover:text-primary transition-colors"
                >
                  Muat lebih banyak ↓
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
