import { createClient } from "../../../lib/supabase/server";
import { VOUCHER_OPTIONS } from "../../../lib/types";
import { NextRequest } from "next/server";

/**
 * GET /api/vouchers
 * Fetch the current user's voucher redemptions.
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("voucher_redemptions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

/**
 * POST /api/vouchers
 * Redeem points for a voucher.
 * Body: { voucher_type: "lpg" | "marketplace" }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { voucher_type } = body;

  // Validate voucher type
  const option = VOUCHER_OPTIONS.find((v) => v.type === voucher_type);
  if (!option) {
    return Response.json({ error: "Invalid voucher_type" }, { status: 400 });
  }

  // Check user's balance
  const { data: profile } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", user.id)
    .single();

  if (!profile || profile.total_points < option.cost) {
    return Response.json(
      {
        error: "Insufficient points",
        required: option.cost,
        current: profile?.total_points || 0,
      },
      { status: 400 }
    );
  }

  // Insert voucher redemption
  const { data: voucher, error: voucherError } = await supabase
    .from("voucher_redemptions")
    .insert({
      user_id: user.id,
      points_spent: option.cost,
      voucher_type,
    })
    .select()
    .single();

  if (voucherError) {
    return Response.json({ error: voucherError.message }, { status: 500 });
  }

  // Insert point transaction (redeemed)
  await supabase.from("point_transactions").insert({
    user_id: user.id,
    amount: -option.cost,
    type: "redeemed",
    reference_id: voucher.id,
    description: `Redeemed ${option.label}`,
  });

  // Deduct points from profile
  await supabase
    .from("profiles")
    .update({ total_points: profile.total_points - option.cost })
    .eq("id", user.id);

  return Response.json(voucher, { status: 201 });
}
