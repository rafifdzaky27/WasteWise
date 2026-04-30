"use client";

import { useState, useEffect } from "react";

interface VoucherRedemption {
  id: string;
  user_id: string;
  points_spent: number;
  voucher_type: string;
  status: string;
  created_at: string;
  profiles?: { full_name: string } | null;
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<VoucherRedemption[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "claimed">("all");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // Verify by code state
  const [verifyCode, setVerifyCode] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifiedVoucher, setVerifiedVoucher] = useState<VoucherRedemption | null>(null);

  useEffect(() => {
    async function fetchVouchers() {
      const res = await fetch("/api/vouchers/admin");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setVouchers(data);
      }
      setLoading(false);
    }
    fetchVouchers();
  }, []);

  async function handleClaim(voucherId: string) {
    setClaiming(voucherId);
    setMsg(null);
    try {
      const res = await fetch("/api/vouchers/claim", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voucher_id: voucherId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else {
        setVouchers((prev) =>
          prev.map((v) => (v.id === voucherId ? { ...v, status: "claimed" } : v))
        );
        setMsg({ type: "success", text: "Voucher berhasil ditandai sudah ditukar!" });
        // Clear verified voucher if it was the one claimed
        if (verifiedVoucher?.id === voucherId) {
          setVerifiedVoucher({ ...verifiedVoucher, status: "claimed" });
        }
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan" });
    }
    setClaiming(null);
  }

  async function handleVerifyCode() {
    if (!verifyCode.trim()) return;
    setVerifying(true);
    setMsg(null);
    setVerifiedVoucher(null);
    try {
      const res = await fetch("/api/vouchers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: verifyCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else {
        setVerifiedVoucher(data);
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan saat memverifikasi" });
    }
    setVerifying(false);
  }

  const filtered = vouchers.filter((v) => {
    if (filter === "pending") return v.status === "pending";
    if (filter === "claimed") return v.status === "claimed";
    return true;
  });

  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Penukaran <span className="font-serif italic text-primary">Voucher</span>
        </h1>
        <p className="text-muted text-sm mt-1">Kelola penukaran voucher LPG dari warga.</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-accent-green border border-accent-green-border text-green-status-text" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Verify by Code Section */}
      <div className="bg-white border border-stone-border rounded-2xl p-5 mb-6 shadow-sm">
        <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="m15 3 6 6-9 9H6v-6L15 3z" />
          </svg>
          Verifikasi Kode Voucher
        </h2>
        <div className="flex gap-2">
          <input
            value={verifyCode}
            onChange={(e) => setVerifyCode(e.target.value.toUpperCase())}
            placeholder="Masukkan kode voucher (min. 4 karakter)"
            className="flex-1 px-4 py-2.5 rounded-xl border border-stone-border bg-white text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase"
            onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()}
          />
          <button
            onClick={handleVerifyCode}
            disabled={verifying || verifyCode.trim().length < 4}
            className="bg-primary-dark text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {verifying ? "Mencari..." : "Verifikasi"}
          </button>
        </div>

        {/* Verified Voucher Result */}
        {verifiedVoucher && (
          <div className="mt-4 bg-stone-light/50 border border-stone-border rounded-2xl p-5">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Nama Warga</span>
                <span className="font-medium text-foreground">{verifiedVoucher.profiles?.full_name || "Warga"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Jenis Voucher</span>
                <span className="font-medium text-foreground">
                  {verifiedVoucher.voucher_type === "lpg" ? "Voucher LPG 3kg" : "Kredit Marketplace"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Poin Dipakai</span>
                <span className="font-bold text-primary">{verifiedVoucher.points_spent} poin</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Tanggal</span>
                <span className="font-medium text-foreground">
                  {new Date(verifiedVoucher.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Kode</span>
                <span className="font-mono font-bold text-foreground text-xs bg-yellow-bg px-2 py-1 rounded">
                  #{verifiedVoucher.id.slice(0, 8).toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-muted">Status</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${verifiedVoucher.status === "claimed" ? "bg-accent-green text-green-status-text border border-accent-green-border" : "bg-yellow-bg text-amber-700 border border-yellow-border"}`}>
                  {verifiedVoucher.status === "claimed" ? "Sudah Ditukar" : "Menunggu"}
                </span>
              </div>
            </div>
            {verifiedVoucher.status === "pending" && (
              <button
                onClick={() => handleClaim(verifiedVoucher.id)}
                disabled={claiming === verifiedVoucher.id}
                className="w-full mt-4 bg-primary-dark text-white font-medium py-3 rounded-xl hover:bg-primary-darker transition-colors disabled:opacity-50"
              >
                {claiming === verifiedVoucher.id ? "Memproses..." : "Tandai Sudah Ditukar"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-yellow-bg border border-yellow-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{vouchers.filter((v) => v.status === "pending").length}</p>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-1">Menunggu Ditukar</p>
        </div>
        <div className="bg-accent-green border border-accent-green-border rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-foreground">{vouchers.filter((v) => v.status === "claimed").length}</p>
          <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-1">Sudah Ditukar</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 bg-stone-light rounded-lg p-0.5 mb-6">
        {([
          { key: "all", label: "Semua" },
          { key: "pending", label: "Menunggu" },
          { key: "claimed", label: "Sudah Ditukar" },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1); }}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all ${filter === f.key ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Voucher List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-border rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-stone-light rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted">Tidak ada penukaran voucher ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paginated.map((v) => (
            <div key={v.id} className="bg-white border border-stone-border rounded-xl p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-yellow-bg border border-yellow-border flex items-center justify-center text-lg shrink-0">
                  ⛽
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {v.profiles?.full_name || "Warga"}
                  </p>
                  <p className="text-[11px] text-muted">
                    {v.voucher_type === "lpg" ? "Voucher LPG 3kg" : "Kredit Marketplace"} · {v.points_spent} poin · {new Date(v.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                  </p>
                  <p className="text-[10px] text-muted font-mono mt-0.5">Kode: #{v.id.slice(0, 8).toUpperCase()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-2">
                {v.status === "pending" ? (
                  <button
                    onClick={() => handleClaim(v.id)}
                    disabled={claiming === v.id}
                    className="text-xs font-medium px-4 py-2 rounded-xl bg-primary-dark text-white hover:bg-primary-darker transition-colors disabled:opacity-50"
                  >
                    {claiming === v.id ? "Memproses..." : "Tandai Ditukar"}
                  </button>
                ) : (
                  <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-accent-green text-green-status-text border border-accent-green-border">
                    Sudah Ditukar
                  </span>
                )}
              </div>
            </div>
          ))}

          {filtered.length > page * ITEMS_PER_PAGE && (
            <div className="pt-4 text-center">
              <button
                onClick={() => setPage((p) => p + 1)}
                className="text-xs font-medium text-muted hover:text-primary transition-colors py-2 px-4 rounded-lg hover:bg-stone-light"
              >
                Muat lebih banyak ↓
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
