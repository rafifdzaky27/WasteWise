"use client";

import { useState } from "react";
import type { PointTransaction, VoucherRedemption } from "../../lib/types";
import { VOUCHER_OPTIONS } from "../../lib/types";

interface RewardsClientProps {
  initialPoints: number;
  initialTransactions: PointTransaction[];
  initialVouchers: VoucherRedemption[];
}

export default function RewardsClient({
  initialPoints,
  initialTransactions,
  initialVouchers,
}: RewardsClientProps) {
  const [points, setPoints] = useState(initialPoints);
  const [transactions, setTransactions] = useState<PointTransaction[]>(initialTransactions);
  const [vouchers, setVouchers] = useState<VoucherRedemption[]>(initialVouchers);
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showBill, setShowBill] = useState<VoucherRedemption | null>(null);
  const [txPage, setTxPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  async function fetchData() {
    const res = await fetch("/api/rewards");
    if (res.ok) {
      const data = await res.json();
      setPoints(data.total_points);
      setTransactions(data.transactions);
      setVouchers(data.vouchers);
    }
  }

  async function handleRedeem(voucherType: string) {
    setError(""); setSuccess(""); setRedeeming(voucherType);
    const res = await fetch("/api/vouchers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ voucher_type: voucherType }) });
    if (!res.ok) { const data = await res.json(); setError(data.error || "Gagal menukar"); setRedeeming(null); return; }
    const voucher = await res.json();
    const option = VOUCHER_OPTIONS.find((v) => v.type === voucherType);
    setSuccess(`Berhasil menukar ${option?.label}! 🎉`);
    setRedeeming(null);
    // Show the bill/receipt
    setShowBill(voucher);
    fetchData();
  }

  return (
    <>
      {/* Bill/Receipt Modal */}
      {showBill && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full animate-fade-in-up shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-foreground">Bukti Penukaran</h2>
              <button
                onClick={() => setShowBill(null)}
                className="w-8 h-8 rounded-full bg-stone-light flex items-center justify-center text-muted hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>
            
            <div className="bg-stone-light/50 border border-stone-border rounded-2xl p-5 space-y-4">
              {/* Receipt Header */}
              <div className="text-center pb-4 border-b border-dashed border-stone-border">
                <p className="text-[10px] font-bold text-muted uppercase tracking-[2px]">WasteWise</p>
                <p className="text-xs text-muted mt-1">Bukti Penukaran Voucher</p>
              </div>

              {/* Receipt Details */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Jenis Voucher</span>
                  <span className="font-medium text-foreground">
                    {showBill.voucher_type === "lpg" ? "Voucher LPG 3kg" : "Kredit Marketplace"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Poin Dipakai</span>
                  <span className="font-bold text-primary">{showBill.points_spent} pts</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Tanggal</span>
                  <span className="font-medium text-foreground">
                    {new Date(showBill.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted">Kode</span>
                  <span className="font-mono font-bold text-foreground text-xs bg-yellow-bg px-2 py-1 rounded">
                    #{showBill.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-dashed border-stone-border text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-yellow-bg text-amber-700 border border-yellow-border">
                  Menunggu Penukaran
                </span>
                <p className="text-[10px] text-muted mt-3 leading-relaxed">
                  Tunjukkan bukti ini kepada Admin BUMDes untuk menukar voucher Anda.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowBill(null)}
              className="w-full mt-4 bg-primary-dark text-white font-medium py-3 rounded-xl hover:bg-primary-darker transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto pb-20 md:pb-0">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">Hadiah <span className="font-serif italic text-primary">Anda</span></h1>
          <p className="text-muted text-sm mt-1">Tukarkan poin eco Anda dengan voucher bernilai.</p>
        </div>

        {/* Points Balance */}
        <div className="relative bg-gradient-to-br from-primary-dark via-primary to-green-status rounded-3xl p-6 sm:p-8 text-white mb-6 shadow-xl overflow-hidden">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
          <p className="text-sm font-medium opacity-80 relative z-10">Total Saldo Poin</p>
          <p className="text-5xl sm:text-6xl font-bold mt-2 relative z-10">{points}<span className="text-2xl ml-2">⭐</span></p>
          <p className="text-xs opacity-60 mt-2 relative z-10">Setor sampah untuk mendapatkan lebih banyak poin</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
        {success && <div className="bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Vouchers */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Tukar Voucher</h2>
            {VOUCHER_OPTIONS.map((option) => {
              const canAfford = points >= option.cost;
              const progress = Math.min((points / option.cost) * 100, 100);
              return (
                <div key={option.type} className="bg-white border border-stone-border rounded-2xl p-5 shadow-sm">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-bg flex items-center justify-center text-xl shrink-0">{option.type === "lpg" ? "⛽" : "🛍️"}</div>
                    <div><h3 className="font-semibold text-foreground text-sm">{option.label}</h3><p className="text-xs text-muted mt-0.5">{option.description}</p></div>
                  </div>
                  <div className="mb-3">
                    <div className="flex justify-between text-xs mb-1"><span className="text-muted">{points}/{option.cost} poin</span><span className="font-medium text-primary">{Math.round(progress)}%</span></div>
                    <div className="h-2 bg-stone-light rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-green-status rounded-full transition-all duration-700" style={{ width: `${progress}%` }} /></div>
                  </div>
                  <button onClick={() => handleRedeem(option.type)} disabled={!canAfford || redeeming === option.type} className={`w-full text-sm font-medium py-2.5 rounded-xl transition-all duration-300 ${canAfford ? "bg-primary-dark text-white hover:bg-primary-darker shadow-md" : "bg-stone-light text-muted-light cursor-not-allowed"}`}>
                    {redeeming === option.type ? "Memproses..." : canAfford ? `Tukar (${option.cost} poin)` : `Butuh ${option.cost - points} poin lagi`}
                  </button>
                </div>
              );
            })}
            {vouchers.length > 0 && (
              <div><h3 className="text-sm font-semibold text-foreground mb-3">Voucher Ditukar</h3>
                <div className="space-y-2">{vouchers.map((v) => (
                  <div
                    key={v.id}
                    className="bg-white/60 border border-stone-border rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-stone-light/50 transition-colors"
                    onClick={() => setShowBill(v)}
                  >
                    <div className="flex items-center gap-2"><span className="text-base">{v.voucher_type === "lpg" ? "⛽" : "🛍️"}</span>
                      <div><p className="text-xs font-medium text-foreground capitalize">{v.voucher_type === "lpg" ? "Voucher LPG" : "Kredit Marketplace"}</p><p className="text-[10px] text-muted">{new Date(v.created_at).toLocaleDateString("id-ID")}</p></div>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v.status === "claimed" ? "bg-accent-green text-green-status-text" : "bg-yellow-bg text-amber-700"}`}>{v.status === "claimed" ? "Ditukar" : "Menunggu"}</span>
                  </div>
                ))}</div>
              </div>
            )}
          </div>

          {/* Right: Point History */}
          <div className="lg:col-span-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">Riwayat Poin</h2>
            {transactions.length === 0 ? (
              <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
                <div className="w-16 h-16 mx-auto bg-yellow-bg rounded-full flex items-center justify-center text-3xl mb-4">⭐</div>
                <h3 className="font-semibold text-foreground mb-1">Belum ada transaksi</h3>
                <p className="text-sm text-muted">Mulai setor sampah untuk mendapatkan poin pertama Anda!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {transactions.slice(0, txPage * ITEMS_PER_PAGE).map((tx) => (
                  <div key={tx.id} className="bg-white border border-stone-border rounded-xl p-3.5 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tx.type === "earned" ? "bg-accent-green text-green-status-text" : "bg-red-50 text-red-600"}`}>{tx.type === "earned" ? "↑" : "↓"}</div>
                      <div><p className="text-sm font-medium text-foreground">{tx.description}</p><p className="text-[11px] text-muted">{new Date(tx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
                    </div>
                    <span className={`text-sm font-bold ${tx.type === "earned" ? "text-primary" : "text-red-500"}`}>{tx.type === "earned" ? "+" : ""}{tx.amount} ⭐</span>
                  </div>
                ))}
                
                {transactions.length > txPage * ITEMS_PER_PAGE && (
                  <div className="pt-4 text-center">
                    <button
                      onClick={() => setTxPage((p) => p + 1)}
                      className="text-xs font-medium text-muted hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-stone-light"
                    >
                      Muat lebih banyak ↓
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
