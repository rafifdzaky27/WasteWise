import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface OrderItem {
  id: string;
  quantity: number;
  unit_price_rp: number;
  products: { name: string; category: string } | null;
}

interface Order {
  id: string;
  total_price_rp: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-bg text-amber-700 border-yellow-border" },
  confirmed: { label: "Dikonfirmasi", color: "bg-blue-bg text-blue-700 border-blue-border" },
  shipped: { label: "Dikirim", color: "bg-purple-bg text-purple-700 border-purple-border" },
  completed: { label: "Selesai", color: "bg-accent-green text-green-status-text border-accent-green-border" },
};

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let orders: Order[] = [];

  if (user) {
    const { data } = await supabase
      .from("orders")
      .select(`
        id, total_price_rp, status, created_at,
        order_items ( id, quantity, unit_price_rp, products ( name, category ) )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (data) orders = data as any;
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Riwayat <span className="font-serif italic text-primary">Pesanan</span>
        </h1>
        <p className="text-muted mt-1 text-sm">Pantau status pesanan Anda dari marketplace.</p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="w-20 h-20 bg-stone-light rounded-full flex items-center justify-center text-4xl mb-6">📦</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Belum ada pesanan</h2>
          <p className="text-muted text-sm mb-6">Anda belum pernah memesan produk dari marketplace.</p>
          <Link href="/marketplace" className="bg-primary-dark text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors">Mulai Belanja</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const s = statusMap[order.status] || statusMap.pending;
            const d = new Date(order.created_at);
            return (
              <div key={order.id} className="bg-white border border-stone-border rounded-2xl p-5 sm:p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-muted font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-muted mt-0.5">{d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${s.color}`}>{s.label}</span>
                </div>
                <div className="space-y-2 mb-4">
                  {order.order_items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{item.products?.name || "Produk"} × {item.quantity}</span>
                      <span className="text-muted font-medium">Rp {(item.unit_price_rp * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-stone-border">
                  <span className="text-sm font-medium text-muted">Total Tagihan</span>
                  <span className="text-base font-bold text-foreground">Rp {order.total_price_rp.toLocaleString("id-ID")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
