"use client";

import { useState, useEffect } from "react";
import QRScanner from "../../../../components/dashboard/QRScanner";
import { parseQRPayload } from "../../../../lib/qr";
import type { DepositWithProfile } from "../../../../lib/types";

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [scanning, setScanning] = useState(false);
  const [scannedDeposit, setScannedDeposit] = useState<DepositWithProfile | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "verified">("all");

  async function fetchDeposits() {
    const res = await fetch("/api/deposits");
    if (res.ok) setDeposits(await res.json());
    setLoading(false);
  }

  useEffect(() => { fetchDeposits(); }, []);

  async function handleScan(decodedText: string) {
    setError(""); setSuccess(""); setScanning(false);
    // Verify via API
    const res = await fetch("/api/deposits/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ qr_code: decodedText }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error || "Verification failed"); return; }
    setScannedDeposit(data);
    setSuccess("Deposit found! Review details below.");
  }

  async function confirmVerify() {
    if (!scannedDeposit) return;
    setSuccess(`Deposit verified successfully! ${scannedDeposit.profiles?.full_name} earned ${scannedDeposit.points_earned} points ⭐`);
    setScannedDeposit(null);
    fetchDeposits();
  }

  const filtered = deposits.filter((d) => {
    if (filter === "pending") return !d.verified_by;
    if (filter === "verified") return !!d.verified_by;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Deposit <span className="font-serif italic text-primary">Verification</span></h1>
        <p className="text-muted text-sm mt-1">Scan warga QR codes to verify waste deposits.</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Scanner */}
        <div className="lg:col-span-2 space-y-4">
          {scanning ? (
            <div className="bg-white border border-stone-border rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-foreground">Scanning...</h2>
                <button onClick={() => setScanning(false)} className="text-xs text-muted hover:text-foreground">Cancel</button>
              </div>
              <QRScanner onScan={handleScan} onError={(e) => setError(e)} />
            </div>
          ) : scannedDeposit ? (
            <div className="bg-white border border-stone-border rounded-2xl p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground mb-4">Deposit Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-muted">Warga</span><span className="font-medium text-foreground">{scannedDeposit.profiles?.full_name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Email</span><span className="font-medium text-foreground">{scannedDeposit.profiles?.email}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Type</span><span className="font-medium text-foreground capitalize flex items-center gap-1">{scannedDeposit.waste_type === "organic" ? "🌿" : "♻️"} {scannedDeposit.waste_type}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Weight</span><span className="font-medium text-foreground">{scannedDeposit.weight_kg} kg</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Points</span><span className="font-bold text-primary">+{scannedDeposit.points_earned} ⭐</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted">Status</span><span className="text-green-status-text font-bold">✓ Verified</span></div>
              </div>
              <button onClick={confirmVerify} className="w-full mt-4 bg-primary-dark text-white font-medium py-3 rounded-xl hover:bg-primary-darker transition-colors shadow-lg">Done</button>
            </div>
          ) : (
            <div className="bg-white border border-stone-border rounded-2xl p-6 shadow-sm text-center">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center text-3xl mb-4">📷</div>
              <h2 className="text-lg font-semibold text-foreground mb-2">Scan QR Code</h2>
              <p className="text-sm text-muted mb-4">Point your camera at a warga&apos;s deposit QR code to verify their waste submission.</p>
              <button onClick={() => { setScanning(true); setError(""); setSuccess(""); }} className="bg-primary-dark text-white text-sm font-medium px-6 py-3 rounded-xl hover:bg-primary-darker transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                Open Scanner
              </button>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-yellow-bg border border-yellow-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{deposits.filter(d => !d.verified_by).length}</p>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-1">Pending</p>
            </div>
            <div className="bg-accent-green border border-accent-green-border rounded-2xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{deposits.filter(d => d.verified_by).length}</p>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-1">Verified</p>
            </div>
          </div>
        </div>

        {/* Right: Deposits Table */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">All Deposits</h2>
            <div className="flex gap-1 bg-stone-light rounded-lg p-0.5">
              {(["all", "pending", "verified"] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`text-xs font-medium px-3 py-1.5 rounded-md capitalize transition-all ${filter === f ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"}`}>{f}</button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="bg-white border border-stone-border rounded-2xl p-4 animate-pulse"><div className="h-4 bg-stone-light rounded w-1/3" /></div>)}</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center"><p className="text-sm text-muted">No deposits found.</p></div>
          ) : (
            <div className="space-y-2">{filtered.map((d) => (
              <div key={d.id} className="bg-white border border-stone-border rounded-xl p-3.5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${d.waste_type === "organic" ? "bg-accent-green" : "bg-blue-bg"}`}>{d.waste_type === "organic" ? "🌿" : "♻️"}</div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{d.profiles?.full_name || "Unknown"}</p>
                    <p className="text-[11px] text-muted">{d.weight_kg}kg · {new Date(d.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}</p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <p className="text-xs font-bold text-primary">+{d.points_earned}</p>
                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full ${d.verified_by ? "bg-accent-green text-green-status-text" : "bg-yellow-bg text-amber-700"}`}>{d.verified_by ? "Verified" : "Pending"}</span>
                </div>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
