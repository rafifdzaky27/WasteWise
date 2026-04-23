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

  // Fetch real stats
  const { data: deposits } = await supabase
    .from("waste_deposits")
    .select("weight_kg")
    .eq("user_id", user?.id);

  const totalWeight = deposits?.reduce((sum, d) => sum + Number(d.weight_kg), 0) || 0;

  const { count: voucherCount } = await supabase
    .from("voucher_redemptions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user?.id);

  const { count: orderCount } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("buyer_id", user?.id);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
          Welcome back,{" "}
          <span className="font-serif italic text-primary">
            {profile?.full_name || "User"}
          </span>
        </h1>
        <p className="text-muted mt-1 text-sm">
          Here&apos;s your environmental impact overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {[
          { label: "Total Points", value: profile?.total_points || 0, icon: "⭐", color: "bg-yellow-bg border-yellow-border", href: "/rewards" },
          { label: "Waste Deposited", value: `${totalWeight} kg`, icon: "♻️", color: "bg-accent-green border-accent-green-border", href: "/deposit" },
          { label: "Vouchers Earned", value: voucherCount || 0, icon: "🎁", color: "bg-purple-bg border-purple-border", href: "/rewards" },
          { label: "Orders Placed", value: orderCount || 0, icon: "📦", color: "bg-blue-bg border-blue-border", href: "/orders" },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`${stat.color} border rounded-2xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-xl sm:text-2xl">{stat.icon}</span>
            </div>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-[10px] sm:text-xs font-medium text-muted uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <Link href="/deposit" className="bg-gradient-to-br from-primary-dark to-primary rounded-2xl p-5 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <span className="text-2xl mb-2 block">♻️</span>
          <h3 className="font-semibold mb-1">New Deposit</h3>
          <p className="text-xs opacity-80">Submit waste and earn points</p>
        </Link>
        <Link href="/rewards" className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-5 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <span className="text-2xl mb-2 block">🎁</span>
          <h3 className="font-semibold mb-1">Redeem Rewards</h3>
          <p className="text-xs opacity-80">Exchange points for vouchers</p>
        </Link>
        {profile?.role === "admin" && (
          <Link href="/admin/deposits" className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <span className="text-2xl mb-2 block">📷</span>
            <h3 className="font-semibold mb-1">Verify Deposits</h3>
            <p className="text-xs opacity-80">Scan QR codes to verify</p>
          </Link>
        )}
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/60 border border-stone-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-2">🌡️ BioBin Status</h3>
          <p className="text-sm text-muted">Real-time composting sensor data will appear here once Phase 3 is implemented.</p>
        </div>
        <div className="bg-white/60 border border-stone-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-2">📊 Impact Logger</h3>
          <p className="text-sm text-muted">Track your personal contribution to landfill reduction. Coming in Phase 4.</p>
        </div>
      </div>
    </div>
  );
}
