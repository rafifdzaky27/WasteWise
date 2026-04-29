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

const statusMap: Record<string, { label: string; icon: string; color: string }> = {
  pending: { label: "Diproses", icon: "◷", color: "text-amber-600" },
  confirmed: { label: "Dikonfirmasi", icon: "◉", color: "text-blue-600" },
  shipped: { label: "Siap Ambil di BUMDes", icon: "◎", color: "text-purple-600" },
  completed: { label: "Ditebus", icon: "✓", color: "text-green-status-text" },
};

const categoryLabels: Record<string, string> = {
  compost: "Marketplace",
  liquid: "Marketplace",
  seeds: "Resource",
  briquettes: "Reward",
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const sp = await searchParams;
  const page = Number(sp?.page || 1);
  const ITEMS_PER_PAGE = 10;

  let orders: Order[] = [];
  let totalCount = 0;

  if (user) {
    const { count } = await supabase.from("orders").select("*", { count: "exact", head: true }).eq("buyer_id", user.id);
    totalCount = count || 0;

    const { data } = await supabase
      .from("orders")
      .select(`
        id, total_price_rp, status, created_at,
        order_items ( id, quantity, unit_price_rp, products ( name, category ) )
      `)
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false })
      .limit(page * ITEMS_PER_PAGE);
    
    if (data) orders = data as any;
  }

  return (
    <div className="animate-fade-in">
      {/* Editorial Header */}
      <div className="mb-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Pesanan <span className="font-serif italic text-primary">& Aktivitas</span> Anda
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-lg leading-relaxed">
          Catatan lengkap akuisisi marketplace dan penukaran reward Anda. Dipelihara untuk kejelasan.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
          <div className="w-16 h-16 bg-stone-light rounded-full flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
            </svg>
          </div>
          <h2 className="text-xl font-medium text-foreground mb-2">Belum ada pesanan</h2>
          <p className="text-muted text-sm mb-6">Anda belum pernah memesan produk dari marketplace.</p>
          <Link href="/marketplace" className="bg-primary-dark text-white px-6 py-3 rounded-xl font-medium text-sm hover:bg-primary-darker transition-colors flex items-center gap-2">
            Mulai Belanja
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </Link>
        </div>
      ) : (
        <div className="space-y-0">
          {orders.map((order) => {
            const s = statusMap[order.status] || statusMap.pending;
            const d = new Date(order.created_at);
            const firstItem = order.order_items[0];
            const itemName = firstItem?.products?.name || "Produk";
            const category = firstItem?.products?.category || "compost";
            const badge = categoryLabels[category] || "Marketplace";

            return (
              <div key={order.id} className="flex items-center gap-4 sm:gap-6 py-6 border-b border-stone-border last:border-b-0">
                {/* Icon */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                  order.status === "completed" ? "bg-stone-light" : "bg-accent-green border border-accent-green-border"
                }`}>
                  {order.status === "completed" ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-base font-medium text-foreground">{itemName}</h3>
                    {order.order_items.length > 1 && (
                      <span className="text-xs text-muted">+{order.order_items.length - 1} lainnya</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-accent-green text-green-status-text border border-accent-green-border">
                      {badge}
                    </span>
                    <span className="text-xs text-muted">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                    <span className="text-xs text-muted">
                      {d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>

                {/* Price + Status */}
                <div className="text-right shrink-0">
                  <p className="text-sm font-medium text-foreground">
                    Rp {order.total_price_rp.toLocaleString("id-ID")}
                  </p>
                  <p className={`text-xs mt-1 ${s.color} font-medium`}>
                    {s.icon} {s.label}
                  </p>
                </div>
              </div>
            );
          })}

          {totalCount > page * ITEMS_PER_PAGE && (
            <div className="pt-8 text-center">
              <Link
                href={`/orders?page=${page + 1}`}
                className="text-sm font-serif italic text-muted hover:text-primary transition-colors inline-block px-4 py-2"
              >
                Muat catatan lama ↓
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
