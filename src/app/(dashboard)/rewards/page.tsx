import { createClient } from "../../../lib/supabase/server";
import RewardsClient from "../../../components/rewards/RewardsClient";

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div className="text-muted text-center py-20">Unauthorized</div>;
  }

  // 🚀 Fetch all data in PARALLEL on the server
  const [profileRes, pointsRes, vouchersRes] = await Promise.all([
    supabase.from("profiles").select("total_points").eq("id", user.id).single(),
    supabase
      .from("point_transactions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
    supabase
      .from("voucher_redemptions")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <RewardsClient
      initialPoints={profileRes.data?.total_points || 0}
      initialTransactions={pointsRes.data || []}
      initialVouchers={vouchersRes.data || []}
    />
  );
}
