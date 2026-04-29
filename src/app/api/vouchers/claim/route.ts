import { createClient } from "../../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * PATCH /api/vouchers/claim
 * Admin only: mark a voucher as claimed
 * Body: { voucher_id: string }
 */
export async function PATCH(request: NextRequest) {
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
    return Response.json({ error: "Hanya admin yang bisa mengklaim voucher" }, { status: 403 });
  }

  const body = await request.json();
  const { voucher_id } = body;

  if (!voucher_id) {
    return Response.json({ error: "voucher_id wajib diisi" }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("voucher_redemptions")
    .update({ status: "claimed" })
    .eq("id", voucher_id)
    .eq("status", "pending")
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  if (!updated) {
    return Response.json({ error: "Voucher tidak ditemukan atau sudah diklaim" }, { status: 404 });
  }

  return Response.json(updated);
}
