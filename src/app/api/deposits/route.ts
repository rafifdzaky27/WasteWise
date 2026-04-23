import { createClient } from "../../../lib/supabase/server";
import { POINT_RATES } from "../../../lib/types";
import { NextRequest } from "next/server";

/**
 * GET /api/deposits
 * Warga: own deposits. Admin: all deposits (with profile join).
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    // Admin sees all deposits with user info
    const { data, error } = await supabase
      .from("waste_deposits")
      .select("*, profiles!waste_deposits_user_id_fkey(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("API /deposits GET Error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json(data);
  }

  // Warga sees own deposits
  const { data, error } = await supabase
    .from("waste_deposits")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

/**
 * POST /api/deposits
 * Create a new waste deposit. Points are auto-calculated and awarded.
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
  const { weight_kg, waste_type } = body;

  // Validate
  if (!weight_kg || !waste_type) {
    return Response.json(
      { error: "weight_kg and waste_type are required" },
      { status: 400 }
    );
  }

  if (!["organic", "recyclable"].includes(waste_type)) {
    return Response.json({ error: "Invalid waste_type" }, { status: 400 });
  }

  if (weight_kg <= 0 || weight_kg > 500) {
    return Response.json(
      { error: "weight_kg must be between 0.01 and 500" },
      { status: 400 }
    );
  }

  // Calculate points
  const rate = POINT_RATES[waste_type as keyof typeof POINT_RATES];
  const points_earned = Math.round(weight_kg * rate);

  // Generate a unique QR code reference
  const qr_code = `wastewise:deposit:${crypto.randomUUID()}`;

  // Insert deposit
  const { data: deposit, error: depositError } = await supabase
    .from("waste_deposits")
    .insert({
      user_id: user.id,
      weight_kg,
      waste_type,
      qr_code,
      points_earned,
    })
    .select()
    .single();

  if (depositError) {
    return Response.json({ error: depositError.message }, { status: 500 });
  }

  // Insert point transaction
  await supabase.from("point_transactions").insert({
    user_id: user.id,
    amount: points_earned,
    type: "earned",
    reference_id: deposit.id,
    description: `Deposit ${weight_kg}kg ${waste_type} waste`,
  });

  // Update total_points on profile
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("total_points")
    .eq("id", user.id)
    .single();

  await supabase
    .from("profiles")
    .update({
      total_points: (currentProfile?.total_points || 0) + points_earned,
    })
    .eq("id", user.id);

  return Response.json(deposit, { status: 201 });
}
