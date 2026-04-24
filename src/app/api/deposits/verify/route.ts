import { createClient } from "../../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * POST /api/deposits/verify
 * Admin scans a QR code → verifies the deposit.
 * Body: { qr_code: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return Response.json(
      { error: "Only admins can verify deposits" },
      { status: 403 }
    );
  }

  const body = await request.json();
  const { qr_code } = body;

  if (!qr_code) {
    return Response.json({ error: "qr_code is required" }, { status: 400 });
  }

  // Find deposit by QR code
  const { data: deposit, error: findError } = await supabase
    .from("waste_deposits")
    .select("*, profiles!waste_deposits_user_id_fkey(full_name, email)")
    .eq("qr_code", qr_code)
    .single();

  if (findError || !deposit) {
    console.error("API /deposits/verify Error:", findError, "Deposit found:", !!deposit);
    return Response.json(
      { error: "Deposit not found for this QR code" },
      { status: 404 }
    );
  }

  if (deposit.verified_by) {
    return Response.json(
      { error: "Deposit already verified", deposit },
      { status: 409 }
    );
  }

  // Mark as verified
  const { data: updated, error: updateError } = await supabase
    .from("waste_deposits")
    .update({ verified_by: user.id })
    .eq("id", deposit.id)
    .select("*, profiles!waste_deposits_user_id_fkey(full_name, email)")
    .single();

  if (updateError) {
    return Response.json({ error: updateError.message }, { status: 500 });
  }

  // Insert point transaction
  await supabase.from("point_transactions").insert({
    user_id: deposit.user_id,
    amount: deposit.points_earned,
    type: "earned",
    reference_id: deposit.id,
    description: `Deposit ${deposit.weight_kg}kg ${deposit.waste_type} waste`,
  });

  // Update total_points on profile
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", deposit.user_id)
    .single();

  await supabase
    .from("profiles")
    .update({
      total_points: (currentProfile?.total_points || 0) + deposit.points_earned,
    })
    .eq("id", deposit.user_id);

  return Response.json(updated);
}
