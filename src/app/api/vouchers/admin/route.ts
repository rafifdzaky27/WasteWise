import { createClient } from "../../../../lib/supabase/server";

/**
 * GET /api/vouchers/admin
 * Admin only: fetch all voucher redemptions with user profiles.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // Fetch voucher redemptions
  const { data: vouchers, error: vError } = await supabase
    .from("voucher_redemptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (vError) return Response.json({ error: vError.message }, { status: 500 });
  if (!vouchers || vouchers.length === 0) return Response.json([]);

  // Fetch user profiles for all unique user_ids
  const userIds = [...new Set(vouchers.map((v: any) => v.user_id))];
  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .in("id", userIds);

  const profileMap: Record<string, any> = {};
  profiles?.forEach((p: any) => { profileMap[p.id] = p; });

  // Merge profiles into vouchers
  const result = vouchers.map((v: any) => ({
    ...v,
    profiles: profileMap[v.user_id] || { full_name: "Warga", email: "" },
  }));

  return Response.json(result);
}
