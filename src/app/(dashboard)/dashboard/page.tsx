import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";

import Image from "next/image";
import productCompost from "@/assets/images/product-compost.png";
import productLiquid from "@/assets/images/product-liquid.png";

export const revalidate = 0;

const categoryImages: Record<string, any> = {
  compost: productCompost,
  liquid: productLiquid,
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Read cached role from cookie (set by proxy) — avoids extra DB call
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const cachedRole = cookieStore.get("x-user-role")?.value;

  // Only fetch profile if we don't have cached role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, total_points")
    .eq("id", user?.id)
    .single();

  const userRole = cachedRole || profile?.role || "warga";
  const isWarga = userRole === "warga";
  const isPetani = userRole === "petani";
  const isAdmin = userRole === "admin";

  // Build queries (NOT awaited yet — just builders)
  let depositsQuery = supabase.from("waste_deposits").select("weight_kg, waste_type, created_at, points_earned");
  let vouchersQuery = supabase.from("voucher_redemptions").select("id", { count: "exact" });
  let ordersQuery = supabase.from("orders").select("id, total_price_rp, status, created_at", { count: "exact" });
  let productsQuery = supabase.from("products").select("*").eq("is_active", true).order("created_at", { ascending: false }).limit(3);

  if (!isAdmin) {
    depositsQuery = depositsQuery.eq("user_id", user?.id);
    vouchersQuery = vouchersQuery.eq("user_id", user?.id);
    ordersQuery = ordersQuery.eq("buyer_id", user?.id);
  }

  // 🚀 Execute ALL queries in PARALLEL — biggest perf win
  const [depositsResult, vouchersResult, ordersResult, productsResult] = await Promise.all([
    depositsQuery.order("created_at", { ascending: false }),
    vouchersQuery,
    ordersQuery,
    productsQuery,
  ]);

  const deposits = depositsResult.data;
  const voucherCount = vouchersResult.count;
  const orders = ordersResult.data;
  const orderCount = ordersResult.count;
  const newestProducts = productsResult.data;

  // Global / User Stats
  const totalWeightRaw = deposits?.reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
  const totalWeight = Math.round(totalWeightRaw * 10) / 10;
  const totalDeposits = deposits?.length || 0;

  const organicWeight = Math.round((deposits?.filter(d => d.waste_type === "organic").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0) * 10) / 10;
  const recyclableWeight = Math.round((deposits?.filter(d => d.waste_type === "recyclable").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0) * 10) / 10;

  const totalPoints = deposits?.reduce((sum, d) => sum + Number(d.points_earned), 0) || 0;
  const totalRevenue = orders?.reduce((sum, o) => sum + Number(o.total_price_rp), 0) || 0;

  // Chart Percentages (only organic + recyclable, no "other")
  const totalCategorized = organicWeight + recyclableWeight || 1;
  const orgPct = Math.round((organicWeight / totalCategorized) * 100);
  const recPct = Math.round((recyclableWeight / totalCategorized) * 100);

  return (
    <div className="animate-fade-in">
      {/* Editorial Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          {isWarga && <>Dampak <span className="font-serif italic text-primary">Anda</span> pada Bumi</>}
          {isPetani && <>Aktivitas <span className="font-serif italic text-primary">Belanja</span> Anda</>}
          {isAdmin && <>Operasional <span className="font-serif italic text-primary">BUMDes</span></>}
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted max-w-xl leading-relaxed">
          {isWarga && "Melihat kontribusi lingkungan yang telah Anda hasilkan melalui pengelolaan sampah cerdas."}
          {isPetani && "Catatan lengkap aktivitas belanja dan pesanan Anda di marketplace."}
          {isAdmin && "Pantau dan kelola seluruh operasional pengelolaan sampah desa secara real-time."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Stat Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hero Stat Box */}
          <div className="bg-white border border-stone-border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div>
              <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-2">
                {isPetani ? "Total Belanja" : "Total Sampah Terkumpul"}
              </p>
              {isPetani ? (
                <h2 className="text-5xl sm:text-7xl font-medium text-foreground tracking-tighter">
                  Rp {totalRevenue.toLocaleString("id-ID")}
                </h2>
              ) : (
                <h2 className="text-5xl sm:text-7xl font-medium text-foreground tracking-tighter">
                  {totalWeight}<span className="text-2xl text-muted font-normal ml-2">kg</span>
                </h2>
              )}
            </div>

            <div className="mt-8 pt-8 border-t border-stone-border/50 grid grid-cols-2 gap-4">
              {!isPetani && (
                <>
                  <div>
                    <p className="text-xs text-muted mb-1">Total Setoran Masuk</p>
                    <p className="text-2xl font-medium text-primary">{totalDeposits} <span className="text-sm">setoran</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">{isAdmin ? "Total Poin Dikeluarkan" : "Total Poin Anda"}</p>
                    <p className="text-2xl font-medium text-amber-500">{totalPoints.toLocaleString("id-ID")} <span className="text-sm">pts</span></p>
                  </div>
                </>
              )}
              {isPetani && (
                <>
                  <div>
                    <p className="text-xs text-muted mb-1">Jumlah Pesanan</p>
                    <p className="text-2xl font-medium text-primary">{orderCount || 0} <span className="text-sm">pesanan</span></p>
                  </div>
                  <div>
                    <p className="text-xs text-muted mb-1">Status Terakhir</p>
                    <p className="text-2xl font-medium text-amber-500">{orders && orders.length > 0 ? (orders[0] as any).status === "completed" ? "Selesai" : "Diproses" : "—"}</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Composition Bar Chart — only for Warga & Admin (not Petani) */}
          {!isPetani && (
            <div className="bg-white border border-stone-border rounded-3xl p-8">
              <h3 className="text-lg font-medium text-foreground mb-6">Komposisi Sampah</h3>

              {/* Visual Bar — only 2 categories */}
              <div className="w-full h-8 flex rounded-full overflow-hidden mb-6 bg-stone-light">
                <div style={{ width: `${orgPct}%` }} className="h-full bg-accent-green transition-all duration-1000 ease-out" />
                <div style={{ width: `${recPct}%` }} className="h-full bg-blue-400 transition-all duration-1000 ease-out border-l border-white/20" />
              </div>

              {/* Legend — 2 columns only */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-accent-green" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Organik</p>
                  </div>
                  <p className="text-lg font-medium">{organicWeight} kg <span className="text-sm text-muted">({orgPct}%)</span></p>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-400" />
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">Daur Ulang</p>
                  </div>
                  <p className="text-lg font-medium">{recyclableWeight} kg <span className="text-sm text-muted">({recPct}%)</span></p>
                </div>
              </div>
            </div>
          )}

          {/* Petani: Recent Orders instead of composition */}
          {isPetani && orders && orders.length > 0 && (
            <div className="bg-white border border-stone-border rounded-3xl p-8">
              <h3 className="text-lg font-medium text-foreground mb-6">Pesanan Terakhir</h3>
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: any) => {
                  const statusLabels: Record<string, string> = {
                    pending: "Diproses",
                    confirmed: "Dikonfirmasi",
                    shipped: "Siap Ambil",
                    completed: "Selesai",
                  };
                  return (
                    <div key={order.id} className="flex items-center justify-between py-3 border-b border-stone-border/50 last:border-b-0">
                      <div>
                        <p className="text-sm font-medium text-foreground">Order #{order.id.slice(0, 8).toUpperCase()}</p>
                        <p className="text-xs text-muted">{new Date(order.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">Rp {Number(order.total_price_rp).toLocaleString("id-ID")}</p>
                        <p className="text-xs text-muted">{statusLabels[order.status] || order.status}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Side Column (Activity & Secondary Stats) */}
        <div className="space-y-6">
          {/* Revenue / Marketplace Stat */}
          {isAdmin && (
            <div className="bg-primary-dark text-white rounded-3xl p-8 shadow-xl">
              <p className="text-[10px] font-bold text-white/60 uppercase tracking-[2px] mb-2">
                Total Pendapatan Marketplace
              </p>
              <h3 className="text-3xl font-medium tracking-tight mb-4">
                Rp {totalRevenue.toLocaleString("id-ID")}
              </h3>
              <div className="flex justify-between items-center text-sm border-t border-white/20 pt-4">
                <span className="text-white/80">Total Pesanan</span>
                <span className="font-bold">{orderCount || 0} Transaksi</span>
              </div>
            </div>
          )}

          {/* Vouchers Redeemed */}
          {(isAdmin || isWarga) && (
            <div className="bg-white border border-stone-border rounded-3xl p-8">
              <div className="w-12 h-12 bg-yellow-bg border border-yellow-border text-yellow-700 rounded-full flex items-center justify-center mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
              </div>
              <p className="text-xs font-bold text-muted uppercase tracking-[2px] mb-1">Tukar Poin</p>
              <p className="text-2xl font-medium text-foreground">{voucherCount || 0} <span className="text-sm font-normal text-muted">Voucher</span></p>
            </div>
          )}

          {/* Newest Products (Petani) or Secondary Stats */}
          {isPetani && (
            <div className="bg-white border border-stone-border rounded-3xl p-8">
              <h3 className="text-lg font-medium text-foreground mb-6">Produk Terbaru</h3>
              <div className="space-y-4">
                {newestProducts && newestProducts.length > 0 ? (
                  newestProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-4 group">
                      <div className="w-12 h-12 bg-stone-light rounded-xl overflow-hidden flex-shrink-0">
                        {categoryImages[product.category] || product.image_url ? (
                          <Image src={categoryImages[product.category] || product.image_url} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-muted-light">
                            📦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-muted truncate">
                          {product.category || "General"} • Rp {Number(product.price_rp).toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Belum ada produk.</p>
                )}
                <Link href="/marketplace" className="block text-center text-xs font-bold text-primary uppercase tracking-widest pt-4 hover:opacity-70 transition-opacity">
                  Lihat Semua Produk
                </Link>
              </div>
            </div>
          )}

          {/* Quick Action */}
          {isAdmin && (
            <Link href="/admin/deposits" className="block bg-stone-light/50 border border-stone-border hover:border-primary/50 transition-colors rounded-3xl p-6 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Lihat Antrean Verifikasi
                  </p>
                  <p className="text-xs text-muted mt-1">Lanjutkan aktivitas Anda</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-stone-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </div>
            </Link>
          )}
          {isWarga && (
            <Link href="/deposit" className="block bg-stone-light/50 border border-stone-border hover:border-primary/50 transition-colors rounded-3xl p-6 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Setor Sampah Baru
                  </p>
                  <p className="text-xs text-muted mt-1">Lanjutkan aktivitas Anda</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-stone-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </div>
            </Link>
          )}
          {isPetani && (
            <Link href="/marketplace" className="block bg-stone-light/50 border border-stone-border hover:border-primary/50 transition-colors rounded-3xl p-6 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                    Belanja di Marketplace
                  </p>
                  <p className="text-xs text-muted mt-1">Lanjutkan aktivitas Anda</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white border border-stone-border flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                </div>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
