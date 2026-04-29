"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import type { PointTransaction, VoucherRedemption } from "../../../lib/types";
import { VOUCHER_OPTIONS } from "../../../lib/types";

// Import local product images for voucher display
import productCompost from "../../../assets/images/product-compost.png";
import productSeeds from "../../../assets/images/product-seeds.png";
import productBriquettes from "../../../assets/images/product-briquettes.png";

const voucherImages: Record<string, any> = {
  lpg: productBriquettes,
  marketplace_credit: productSeeds,
};

export default function RewardsPage() {
  const [points, setPoints] = useState(0);
  const [transactions, setTransactions] = useState<PointTransaction[]>([]);
  const [vouchers, setVouchers] = useState<VoucherRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchData() {
    const res = await fetch("/api/rewards");
    if (res.ok) {
      const data = await res.json();
      setPoints(data.total_points);
      setTransactions(data.transactions);
      setVouchers(data.vouchers);
    }
    setLoading(false);
  }

  useEffect(() => { fetchData(); }, []);

  async function handleRedeem(voucherType: string) {
    setError(""); setSuccess(""); setRedeeming(voucherType);
    const res = await fetch("/api/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voucher_type: voucherType }) });
    if (!res.ok) { const data = await res.json(); setError(data.error || "Gagal"); setRedeeming(null); return; }
    const option = VOUCHER_OPTIONS.find((v) => v.type === voucherType);
    setSuccess(`Berhasil menukar ${option?.label}! 🎉`); setRedeeming(null); fetchData();
  }

  if (loading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-12 bg-stone-light rounded w-2/3" />
      <div className="h-6 bg-stone-light rounded w-1/3" />
      <div className="grid grid-cols-2 gap-6"><div className="h-64 bg-stone-light rounded-2xl" /><div className="h-64 bg-stone-light rounded-2xl" /></div>
    </div>
  );

  return (
    <div className="animate-fade-in">
      {/* Editorial Header + Balance */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-12">
        <div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-tight">
            Pustaka Hadiah{" "}
            <span className="font-serif italic text-primary">Sirkular</span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-lg leading-relaxed">
            Tukarkan poin lingkungan Anda dengan hadiah pilihan yang berkelanjutan. Setiap poin mencerminkan dampak nyata.
          </p>
        </div>
        {/* Balance Badge */}
        <div className="bg-accent-green border border-accent-green-border rounded-2xl px-6 py-5 text-center shrink-0">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[2px]">Saldo Tersedia</p>
          <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight mt-1">{points}</p>
          <p className="text-sm font-serif italic text-muted mt-1">Poin</p>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-6">{error}</div>}
      {success && <div className="bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3 mb-6">{success}</div>}

      {/* Bento Grid for Vouchers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
        {VOUCHER_OPTIONS.map((option, i) => {
          const canAfford = points >= option.cost;
          const img = voucherImages[option.type];
          const isFeatured = i === 0;

          return (
            <div
              key={option.type}
              className={`${isFeatured ? "sm:col-span-2 sm:grid sm:grid-cols-5" : ""} bg-white border border-stone-border rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300`}
            >
              {/* Image */}
              <div className={`relative ${isFeatured ? "sm:col-span-3 aspect-[16/10] sm:aspect-auto" : "aspect-[4/3]"} bg-stone-light overflow-hidden`}>
                {img && (
                  <Image
                    src={img}
                    alt={option.label}
                    fill
                    className="object-cover"
                    sizes={isFeatured ? "(max-width: 640px) 100vw, 60vw" : "(max-width: 640px) 100vw, 50vw"}
                  />
                )}
                {isFeatured && (
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-foreground">
                    Esensial
                  </span>
                )}
                {isFeatured && (
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-2xl font-medium text-white">{option.label}</h3>
                    <p className="text-sm text-white/70 mt-1">{option.description}</p>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className={`p-6 ${isFeatured ? "sm:col-span-2 flex flex-col justify-center" : ""}`}>
                {!isFeatured && (
                  <>
                    <h3 className="text-lg font-medium text-foreground mb-1">{option.label}</h3>
                    <p className="text-sm text-muted mb-4">{option.description}</p>
                  </>
                )}
                <button
                  onClick={() => handleRedeem(option.type)}
                  disabled={!canAfford || redeeming === option.type}
                  className={`w-full text-sm font-medium py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                    canAfford
                      ? "bg-primary-dark text-white hover:bg-primary-darker"
                      : "bg-stone-light text-muted-light border border-stone-border cursor-not-allowed"
                  }`}
                >
                  {redeeming === option.type ? (
                    <>
                      <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      Menukar...
                    </>
                  ) : canAfford ? (
                    <>
                      Tukar dengan {option.cost} Poin
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </>
                  ) : (
                    `Butuh ${option.cost - points} poin lagi`
                  )}
                </button>
              </div>
            </div>
          );
        })}

        {/* Value of Circularity Info Card */}
        <div className="sm:col-span-2 bg-accent-green/30 border border-accent-green-border rounded-2xl p-8 flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nilai <span className="font-serif italic">Sirkularitas</span>
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              Setiap item di perpustakaan kami dipilih dengan cermat untuk memastikan hadiah Anda melanjutkan siklus keberlanjutan. Poin Anda mencerminkan dampak nyata terhadap sumber daya yang dilestarikan.
            </p>
          </div>
        </div>
      </div>

      {/* Voucher History */}
      {vouchers.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-medium text-foreground">
              Voucher <span className="font-serif italic">Ditebus</span>
            </h2>
          </div>
          <div className="space-y-0">
            {vouchers.map((v) => (
              <div key={v.id} className="flex items-center justify-between py-4 border-b border-stone-border last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent-green flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{v.voucher_type === "lpg" ? "Voucher LPG" : "Kredit Marketplace"}</p>
                    <p className="text-xs text-muted">{new Date(v.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                  v.status === "approved" ? "bg-accent-green text-green-status-text" : v.status === "claimed" ? "bg-blue-bg text-blue-700" : "bg-yellow-bg text-amber-700"
                }`}>{v.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Point Transaction History */}
      {transactions.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-medium text-foreground">
              Riwayat <span className="font-serif italic">Poin</span>
            </h2>
          </div>
          <div className="space-y-0">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-4 border-b border-stone-border last:border-b-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.type === "earned" ? "bg-accent-green" : "bg-red-50"}`}>
                    {tx.type === "earned" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7" /></svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{tx.description}</p>
                    <p className="text-xs text-muted">{new Date(tx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "earned" ? "text-primary" : "text-red-500"}`}>
                  {tx.type === "earned" ? "+" : ""}{tx.amount}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
