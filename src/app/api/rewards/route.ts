import { createClient } from "../../../lib/supabase/server";

/**
 * GET /api/rewards
 * Fetch the user's total points, point transactions, and voucher redemptions in one go.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch everything in parallel
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

  return Response.json({
    total_points: profileRes.data?.total_points || 0,
    transactions: pointsRes.data || [],
    vouchers: vouchersRes.data || [],
  });
}
