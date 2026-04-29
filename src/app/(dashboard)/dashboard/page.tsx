import { createClient } from "../../../lib/supabase/server";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const userRole = profile?.role || "warga";
  const isWarga = userRole === "warga";
  const isPetani = userRole === "petani";
  const isAdmin = userRole === "admin";

  // Fetch real stats
  const { data: deposits } = await supabase
    .from("waste_deposits")
    .select("weight_kg, waste_type, created_at, verified_by")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  const totalWeight = deposits?.reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
  const organicWeight = deposits?.filter(d => d.waste_type === "organic").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
  const recyclableWeight = deposits?.filter(d => d.waste_type === "recyclable").reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;
  const co2Avoided = Math.round(((organicWeight * 0.5) + (recyclableWeight * 1.2)) * 10) / 10;

  const { count: voucherCount } = await supabase
    .from("voucher_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", user?.id);

  // Recent deposits for the ledger (last 5)
  const recentDeposits = (deposits || []).slice(0, 5);

  return (
    <div className="animate-fade-in">
      {/* Editorial Header */}
      <div className="mb-4">
        <p className="text-xs font-semibold tracking-[2.4px] uppercase text-primary mb-4">
          Ringkasan Pribadi
        </p>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight text-foreground leading-tight">
          {isWarga && (
            <>Dampak <span className="font-serif italic text-primary">Anda</span> pada Bumi</>
          )}
          {isPetani && (
            <>Aktivitas <span className="font-serif italic text-primary">Belanja</span> Anda</>
          )}
          {isAdmin && (
            <>Operasional <span className="font-serif italic text-primary">BUMDes</span></>
          )}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-muted max-w-xl leading-relaxed">
          {isWarga && "Melihat kontribusi lingkungan yang telah Anda hasilkan melalui pengelolaan sampah cerdas."}
          {isPetani && "Catatan lengkap aktivitas belanja dan pesanan Anda di marketplace."}
          {isAdmin && "Pantau dan kelola seluruh operasional pengelolaan sampah desa."}
        </p>
      </div>

      {/* Stats Grid — glass card style with SVG icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-12 mb-16">
        {isWarga && (
          <>
            <Link href="/deposit" className="group bg-white border border-stone-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77" />
                  <circle cx="7.5" cy="11.5" r="1" fill="#016630" stroke="none" />
                  <circle cx="12" cy="7.5" r="1" fill="#016630" stroke="none" />
                  <circle cx="16.5" cy="11.5" r="1" fill="#016630" stroke="none" />
                </svg>
              </div>
              <p className="text-sm text-muted mb-1">
                Sampah <span className="font-serif italic">Terkelola</span>
              </p>
              <p className="text-xs text-muted-light mb-3">Total sampah yang diselamatkan dari TPA</p>
              <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
                {totalWeight}<span className="text-xl font-medium text-muted ml-2">kg</span>
              </p>
            </Link>
            <Link href="/impact" className="group bg-accent-green border border-accent-green-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 22L12 2l10 20H2z" />
                  <path d="M12 9v4" />
                  <circle cx="12" cy="17" r="0.5" fill="#016630" stroke="none" />
                </svg>
              </div>
              <p className="text-sm text-muted mb-1">
                Karbon <span className="font-serif italic">Dihindari</span>
              </p>
              <p className="text-xs text-muted-light mb-3">Estimasi pengurangan emisi CO₂e</p>
              <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
                {co2Avoided}<span className="text-xl font-medium text-muted ml-2">kg</span>
              </p>
            </Link>
            <Link href="/rewards" className="group bg-white border border-stone-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="text-sm text-muted mb-1">
                Kontribusi <span className="font-serif italic">Komunitas</span>
              </p>
              <p className="text-xs text-muted-light mb-3">Voucher dan hadiah yang diperoleh</p>
              <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
                {voucherCount || 0}<span className="text-xl font-medium text-muted ml-2">voucher</span>
              </p>
            </Link>
          </>
        )}
        {isPetani && (
          <>
            <Link href="/orders" className="group bg-white border border-stone-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h4l3 3v5a2 2 0 0 1-2 2h-1" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
                </svg>
              </div>
              <p className="text-sm text-muted mb-1">Pesanan <span className="font-serif italic">Aktif</span></p>
              <p className="text-xs text-muted-light mb-3">Total pesanan yang dibuat</p>
              <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">
                {orderCount || 0}<span className="text-xl font-medium text-muted ml-2">pesanan</span>
              </p>
            </Link>
            <Link href="/marketplace" className="group bg-accent-green border border-accent-green-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300 sm:col-span-2 flex flex-col justify-center">
              <h3 className="text-xl font-medium text-foreground mb-2">Jelajahi <span className="font-serif italic text-primary">Marketplace</span></h3>
              <p className="text-sm text-muted mb-4">Temukan produk daur ulang berkualitas dari desa.</p>
              <span className="text-sm font-medium text-primary">Mulai Belanja →</span>
            </Link>
          </>
        )}
        {isAdmin && (
          <>
            <Link href="/deposit" className="group bg-white border border-stone-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77" /></svg>
              </div>
              <p className="text-sm text-muted mb-1">Sampah <span className="font-serif italic">Terdata</span></p>
              <p className="text-xs text-muted-light mb-3">Total berat tercatat</p>
              <p className="text-4xl sm:text-5xl font-medium text-foreground tracking-tight">{totalWeight}<span className="text-xl font-medium text-muted ml-2">kg</span></p>
            </Link>
            <Link href="/admin/deposits" className="group bg-accent-green border border-accent-green-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-medium text-foreground mb-2">Verifikasi <span className="font-serif italic text-primary">Setoran</span></h3>
              <p className="text-sm text-muted">Pindai QR untuk memverifikasi setoran warga.</p>
            </Link>
            <Link href="/biobin" className="group bg-white border border-stone-border rounded-2xl p-6 sm:p-8 hover:shadow-md transition-all duration-300">
              <h3 className="text-xl font-medium text-foreground mb-2">Monitor <span className="font-serif italic text-primary">BioCompose</span></h3>
              <p className="text-sm text-muted">Pantau sensor pengomposan real-time.</p>
            </Link>
          </>
        )}
      </div>

      {/* Personal Impact Ledger — Warga only */}
      {isWarga && (
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-primary rounded-full" />
            <h2 className="text-xl sm:text-2xl font-medium text-foreground">
              Catatan Dampak <span className="font-serif italic">Pribadi</span>
            </h2>
          </div>

          {recentDeposits.length === 0 ? (
            <div className="bg-white/60 border border-stone-border rounded-2xl p-8 text-center">
              <p className="text-muted text-sm">Belum ada catatan. <Link href="/deposit" className="text-primary font-medium hover:underline">Mulai setor sampah</Link> untuk memulai.</p>
            </div>
          ) : (
            <div className="space-y-0">
              {recentDeposits.map((deposit, i) => (
                <div key={i} className="flex items-center justify-between py-5 border-b border-stone-border last:border-b-0 group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${deposit.waste_type === "organic" ? "bg-accent-green" : "bg-blue-bg"}`}>
                      {deposit.waste_type === "organic" ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#016630" strokeWidth="2"><path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9" /></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9" /><path d="M21 3v6h-6" /></svg>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {deposit.waste_type === "organic" ? "Setor Sampah Organik" : "Setor Daur Ulang"}
                      </p>
                      <p className="text-xs text-muted mt-0.5">
                        BUMDes Desa • {new Date(deposit.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">+ {Number(deposit.weight_kg)} kg</p>
                    <p className="text-xs text-muted mt-0.5">
                      {deposit.verified_by ? "Terverifikasi" : "Menunggu"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {recentDeposits.length > 0 && (
            <div className="mt-6">
              <Link href="/deposit" className="text-sm font-serif italic text-primary hover:underline">
                Lihat Arsip Lengkap →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
