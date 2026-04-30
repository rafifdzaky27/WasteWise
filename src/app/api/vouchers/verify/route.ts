import { createClient } from "../../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * POST /api/vouchers/verify
 * Admin only: verify a voucher by its code (first 8 chars of ID)
 * Body: { code: string }
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
    return Response.json({ error: "Hanya admin yang bisa memverifikasi voucher" }, { status: 403 });
  }

  const body = await request.json();
  const { code } = body;

  if (!code || code.length < 4) {
    return Response.json({ error: "Kode voucher minimal 4 karakter" }, { status: 400 });
  }

  // Search by ID prefix (the code shown to user is first 8 chars of UUID)
  const searchCode = code.replace(/^#/, "").toLowerCase();

  // Fetch all voucher redemptions and match by ID prefix
  const { data: vouchers, error: vError } = await supabase
    .from("voucher_redemptions")
    .select("*")
    .order("created_at", { ascending: false });

  if (vError) {
    return Response.json({ error: vError.message }, { status: 500 });
  }

  // Find voucher where ID starts with the search code
  const found = vouchers?.find((v: any) =>
    v.id.toLowerCase().startsWith(searchCode)
  );

  if (!found) {
    return Response.json({ error: "Voucher dengan kode tersebut tidak ditemukan" }, { status: 404 });
  }

  // Fetch the profile of the voucher owner
  const { data: ownerProfile } = await supabase
    .from("profiles")
    .select("full_name, email")
    .eq("id", found.user_id)
    .single();

  return Response.json({
    ...found,
    profiles: ownerProfile || { full_name: "Warga", email: "" },
  });
}
