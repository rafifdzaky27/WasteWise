"use client";

import { useState, useEffect } from "react";

import type { PointTransaction, VoucherRedemption } from "../../../lib/types";
import { VOUCHER_OPTIONS } from "../../../lib/types";

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
    if (!res.ok) { const data = await res.json(); setError(data.error || "Failed"); setRedeeming(null); return; }
    const option = VOUCHER_OPTIONS.find((v) => v.type === voucherType);
    setSuccess(`Redeemed ${option?.label}! 🎉`); setRedeeming(null); fetchData();
  }

  if (loading) return <div className="max-w-5xl mx-auto pb-20 md:pb-0 animate-pulse space-y-4"><div className="h-8 bg-stone-light rounded w-48" /><div className="h-32 bg-stone-light rounded-2xl" /></div>;

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">My <span className="font-serif italic text-primary">Rewards</span></h1>
        <p className="text-muted text-sm mt-1">Redeem your eco-points for valuable vouchers.</p>
      </div>

      {/* Points Balance */}
      <div className="relative bg-gradient-to-br from-primary-dark via-primary to-green-status rounded-3xl p-6 sm:p-8 text-white mb-6 shadow-xl overflow-hidden">
        <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full" />
        <p className="text-sm font-medium opacity-80 relative z-10">Total Points Balance</p>
        <p className="text-5xl sm:text-6xl font-bold mt-2 relative z-10">{points}<span className="text-2xl ml-2">⭐</span></p>
        <p className="text-xs opacity-60 mt-2 relative z-10">Earn more by depositing waste</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>}
      {success && <div className="bg-accent-green border border-accent-green-border text-green-status-text text-sm rounded-xl px-4 py-3 mb-4">{success}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Vouchers */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Redeem Vouchers</h2>
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
                  <div className="flex justify-between text-xs mb-1"><span className="text-muted">{points}/{option.cost} pts</span><span className="font-medium text-primary">{Math.round(progress)}%</span></div>
                  <div className="h-2 bg-stone-light rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-green-status rounded-full transition-all duration-700" style={{ width: `${progress}%` }} /></div>
                </div>
                <button onClick={() => handleRedeem(option.type)} disabled={!canAfford || redeeming === option.type} className={`w-full text-sm font-medium py-2.5 rounded-xl transition-all duration-300 ${canAfford ? "bg-primary-dark text-white hover:bg-primary-darker shadow-md" : "bg-stone-light text-muted-light cursor-not-allowed"}`}>
                  {redeeming === option.type ? "Redeeming..." : canAfford ? `Redeem (${option.cost} pts)` : `Need ${option.cost - points} more pts`}
                </button>
              </div>
            );
          })}
          {vouchers.length > 0 && (
            <div><h3 className="text-sm font-semibold text-foreground mb-3">Redeemed Vouchers</h3>
              <div className="space-y-2">{vouchers.map((v) => (
                <div key={v.id} className="bg-white/60 border border-stone-border rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="text-base">{v.voucher_type === "lpg" ? "⛽" : "🛍️"}</span>
                    <div><p className="text-xs font-medium text-foreground capitalize">{v.voucher_type === "lpg" ? "Voucher LPG" : "Kredit Marketplace"}</p><p className="text-[10px] text-muted">{new Date(v.created_at).toLocaleDateString("id-ID")}</p></div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${v.status === "approved" ? "bg-accent-green text-green-status-text" : v.status === "claimed" ? "bg-blue-bg text-blue-700" : "bg-yellow-bg text-amber-700"}`}>{v.status}</span>
                </div>
              ))}</div>
            </div>
          )}
        </div>

        {/* Right: Point History */}
        <div className="lg:col-span-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">Point History</h2>
          {transactions.length === 0 ? (
            <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 mx-auto bg-yellow-bg rounded-full flex items-center justify-center text-3xl mb-4">⭐</div>
              <h3 className="font-semibold text-foreground mb-1">No transactions yet</h3>
              <p className="text-sm text-muted">Start depositing waste to earn your first points!</p>
            </div>
          ) : (
            <div className="space-y-2">{transactions.map((tx) => (
              <div key={tx.id} className="bg-white border border-stone-border rounded-xl p-3.5 flex items-center justify-between hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${tx.type === "earned" ? "bg-accent-green text-green-status-text" : "bg-red-50 text-red-600"}`}>{tx.type === "earned" ? "↑" : "↓"}</div>
                  <div><p className="text-sm font-medium text-foreground">{tx.description}</p><p className="text-[11px] text-muted">{new Date(tx.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p></div>
                </div>
                <span className={`text-sm font-bold ${tx.type === "earned" ? "text-primary" : "text-red-500"}`}>{tx.type === "earned" ? "+" : ""}{tx.amount} ⭐</span>
              </div>
            ))}</div>
          )}
        </div>
      </div>
    </div>
  );
}
