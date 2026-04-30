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
  delivery_method?: string;
  payment_method?: string;
  shipping_cost?: number;
  payment_proof_url?: string;
  order_items: OrderItem[];
  profiles?: { full_name: string; email: string } | null;
}

const statusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Menunggu Verifikasi", color: "text-amber-700", bg: "bg-yellow-bg border-yellow-border" },
  confirmed: { label: "Dikonfirmasi", color: "text-blue-700", bg: "bg-blue-bg border-blue-border" },
  shipped: { label: "Siap Ambil", color: "text-purple-700", bg: "bg-purple-bg border-purple-border" },
  completed: { label: "Selesai", color: "text-green-status-text", bg: "bg-accent-green border-accent-green-border" },
  rejected: { label: "Ditolak", color: "text-red-700", bg: "bg-red-50 border-red-200" },
};

const nextAction: Record<string, { label: string; nextStatus: string }> = {
  pending: { label: "Verifikasi Pembayaran", nextStatus: "confirmed" },
  confirmed: { label: "Tandai Siap Ambil", nextStatus: "shipped" },
  shipped: { label: "Selesai", nextStatus: "completed" },
};

const deliveryLabels: Record<string, string> = {
  pickup: "Ambil Sendiri",
  delivery: "Kirim ke Rumah",
};

const paymentLabels: Record<string, string> = {
  cod: "Bayar di Tempat",
  transfer: "Transfer Bank",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "confirmed" | "shipped" | "completed" | "rejected">("all");
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [page, setPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
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
        setMsg({ type: "success", text: status === "rejected" ? "Pesanan ditolak." : "Status pesanan berhasil diperbarui!" });
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
          { key: "rejected", label: "Ditolak" },
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
      <div className="grid grid-cols-5 gap-3 mb-6">
        {(["pending", "confirmed", "shipped", "completed", "rejected"] as const).map((s) => {
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
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id} className="bg-white border border-stone-border rounded-2xl overflow-hidden hover:shadow-sm transition-shadow">
                {/* Header Row (clickable) */}
                <button
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  className="w-full text-left p-5"
                >
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
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-primary whitespace-nowrap">
                        Rp {order.total_price_rp.toLocaleString("id-ID")}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        {new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points={isExpanded ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} /></svg>
                    {isExpanded ? "Tutup detail" : "Lihat detail"}
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 border-t border-stone-border animate-fade-in">
                    {/* Order Items */}
                    <div className="mt-4 mb-4">
                      <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">Item Pesanan</p>
                      <div className="bg-stone-light/50 rounded-xl p-3 space-y-2">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.products?.name || "Produk"} <span className="text-muted">×{item.quantity}</span></span>
                            <span className="font-medium">Rp {(item.unit_price_rp * item.quantity).toLocaleString("id-ID")}</span>
                          </div>
                        ))}
                        {(order.shipping_cost || 0) > 0 && (
                          <div className="flex justify-between text-sm text-muted">
                            <span>Ongkos Kirim</span>
                            <span className="font-medium text-foreground">Rp {(order.shipping_cost || 0).toLocaleString("id-ID")}</span>
                          </div>
                        )}
                        <div className="border-t border-stone-border pt-2 mt-2 flex justify-between font-bold text-sm">
                          <span>Total</span>
                          <span className="text-primary">Rp {order.total_price_rp.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-stone-light/50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Pengiriman</p>
                        <p className="text-sm font-medium text-foreground">{deliveryLabels[order.delivery_method || "pickup"] || order.delivery_method}</p>
                      </div>
                      <div className="bg-stone-light/50 rounded-xl p-3">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Pembayaran</p>
                        <p className="text-sm font-medium text-foreground">{paymentLabels[order.payment_method || "cod"] || order.payment_method}</p>
                      </div>
                    </div>

                    {/* Payment Proof */}
                    {order.payment_proof_url && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">Bukti Transfer</p>
                        <a href={order.payment_proof_url} target="_blank" rel="noopener noreferrer" className="block">
                          <img src={order.payment_proof_url} alt="Bukti transfer" className="w-full max-w-xs h-48 object-cover rounded-xl border border-stone-border hover:opacity-90 transition-opacity" />
                        </a>
                      </div>
                    )}

                    {/* Buyer Info */}
                    {order.profiles && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">Pembeli</p>
                        <div className="bg-stone-light/50 rounded-xl p-3">
                          <p className="text-sm font-medium text-foreground">{order.profiles.full_name}</p>
                          <p className="text-xs text-muted">{order.profiles.email}</p>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      {action && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, action.nextStatus)}
                          disabled={updating === order.id}
                          className="text-xs font-medium px-4 py-2 rounded-xl bg-primary-dark text-white hover:bg-primary-darker transition-colors disabled:opacity-50"
                        >
                          {updating === order.id ? "Memproses..." : action.label}
                        </button>
                      )}
                      {order.status === "pending" && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, "rejected")}
                          disabled={updating === order.id}
                          className="text-xs font-medium px-4 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                        >
                          {updating === order.id ? "Memproses..." : "Tolak Pesanan"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
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
