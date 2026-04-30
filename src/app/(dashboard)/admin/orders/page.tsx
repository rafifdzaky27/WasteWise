"use client";

import { useState, useEffect } from "react";

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_rp: number;
  products: { name: string; category: string } | null;
}

interface Order {
  id: string;
  buyer_id: string;
  total_price_rp: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
  profiles?: { full_name: string; email: string } | null;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Menunggu Verifikasi", color: "text-amber-700", bg: "bg-yellow-bg border-yellow-border" },
  confirmed: { label: "Dikonfirmasi", color: "text-blue-700", bg: "bg-blue-bg border-blue-border" },
  shipped: { label: "Siap Ambil", color: "text-purple-700", bg: "bg-purple-bg border-purple-border" },
  completed: { label: "Selesai", color: "text-green-status-text", bg: "bg-accent-green border-accent-green-border" },
};

const nextAction: Record<string, { label: string; nextStatus: string }> = {
  pending: { label: "Verifikasi Pembayaran", nextStatus: "confirmed" },
  confirmed: { label: "Tandai Siap Ambil", nextStatus: "shipped" },
  shipped: { label: "Selesai", nextStatus: "completed" },
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "shipped" | "completed">("all");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetch("/api/orders")
      .then((r) => r.json())
      .then((d) => { if (Array.isArray(d)) setOrders(d); })
      .finally(() => setLoading(false));
  }, []);

  async function handleUpdateStatus(orderId: string, status: string) {
    setUpdating(orderId);
    setMsg(null);
    try {
      const res = await fetch("/api/orders/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg({ type: "error", text: data.error });
      } else {
        setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
        setMsg({ type: "success", text: "Status pesanan berhasil diperbarui!" });
      }
    } catch {
      setMsg({ type: "error", text: "Terjadi kesalahan" });
    }
    setUpdating(null);
  }

  const filtered = orders.filter((o) => filter === "all" || o.status === filter);
  const paginated = filtered.slice(0, page * ITEMS_PER_PAGE);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Pesanan <span className="font-serif italic text-primary">Masuk</span>
        </h1>
        <p className="text-muted text-sm mt-1">Kelola dan verifikasi pesanan dari petani.</p>
      </div>

      {msg && (
        <div className={`mb-4 px-4 py-3 rounded-xl text-sm ${msg.type === "success" ? "bg-accent-green border border-accent-green-border text-green-status-text" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {msg.text}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-stone-light rounded-lg p-0.5 mb-6 overflow-x-auto">
        {([
          { key: "all", label: "Semua" },
          { key: "pending", label: "Menunggu" },
          { key: "confirmed", label: "Dikonfirmasi" },
          { key: "shipped", label: "Siap Ambil" },
          { key: "completed", label: "Selesai" },
        ] as const).map((f) => (
          <button
            key={f.key}
            onClick={() => { setFilter(f.key); setPage(1); }}
            className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all whitespace-nowrap ${
              filter === f.key ? "bg-white text-foreground shadow-sm" : "text-muted hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {(["pending", "confirmed", "shipped", "completed"] as const).map((s) => {
          const count = orders.filter((o) => o.status === s).length;
          const st = statusMap[s];
          return (
            <div key={s} className={`${st.bg} border rounded-2xl p-4 text-center`}>
              <p className="text-2xl font-bold text-foreground">{count}</p>
              <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mt-1">{st.label}</p>
            </div>
          );
        })}
      </div>

      {/* Orders List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border border-stone-border rounded-2xl p-5 animate-pulse">
              <div className="h-4 bg-stone-light rounded w-1/3 mb-2" />
              <div className="h-3 bg-stone-light rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
          <p className="text-sm text-muted">Tidak ada pesanan ditemukan.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {paginated.map((order) => {
            const s = statusMap[order.status] || statusMap.pending;
            const action = nextAction[order.status];
            const itemNames = order.order_items?.map((i) => i.products?.name || "Produk").join(", ") || "—";

            return (
              <div key={order.id} className="bg-white border border-stone-border rounded-2xl p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm font-semibold text-foreground">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </h3>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${s.bg} ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted truncate">{order.profiles?.full_name ? `👤 ${order.profiles.full_name} · ` : ""}{itemNames}</p>
                  </div>
                  <p className="text-sm font-bold text-primary whitespace-nowrap">
                    Rp {order.total_price_rp.toLocaleString("id-ID")}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted">
                    {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                  {action && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, action.nextStatus)}
                      disabled={updating === order.id}
                      className="text-xs font-medium px-4 py-2 rounded-xl bg-primary-dark text-white hover:bg-primary-darker transition-colors disabled:opacity-50"
                    >
                      {updating === order.id ? "Memproses..." : action.label}
                    </button>
                  )}
                </div>
              </div>
            );
          })}

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
