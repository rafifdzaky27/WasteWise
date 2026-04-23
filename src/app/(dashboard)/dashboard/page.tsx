import { createClient } from "@/lib/supabase/server";

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

  return (
    <div className="max-w-5xl mx-auto">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Welcome back,{" "}
          <span className="font-serif italic text-primary">
            {profile?.full_name || "User"}
          </span>
        </h1>
        <p className="text-muted mt-1">
          Here&apos;s your environmental impact overview.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: "Total Points",
            value: profile?.total_points || 0,
            icon: "⭐",
            color: "bg-yellow-bg border-yellow-border",
          },
          {
            label: "Waste Deposited",
            value: "0 kg",
            icon: "♻️",
            color: "bg-accent-green border-accent-green-border",
          },
          {
            label: "Vouchers Earned",
            value: 0,
            icon: "🎁",
            color: "bg-purple-bg border-purple-border",
          },
          {
            label: "Orders Placed",
            value: 0,
            icon: "📦",
            color: "bg-blue-bg border-blue-border",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`${stat.color} border rounded-2xl p-5`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs font-medium text-muted uppercase tracking-wider mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Coming Soon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/60 border border-stone-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-2">
            🌡️ BioBin Status
          </h3>
          <p className="text-sm text-muted">
            Real-time composting sensor data will appear here once Phase 3 is
            implemented.
          </p>
        </div>
        <div className="bg-white/60 border border-stone-border rounded-2xl p-6">
          <h3 className="font-semibold text-foreground mb-2">
            📊 Impact Logger
          </h3>
          <p className="text-sm text-muted">
            Track your personal contribution to landfill reduction. Coming in
            Phase 5.
          </p>
        </div>
      </div>
    </div>
  );
}
