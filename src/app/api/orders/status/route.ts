import { createClient } from "../../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * PATCH /api/orders/status
 * Admin only: update order status
 * Body: { order_id: string, status: "confirmed" | "shipped" | "completed" }
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
    return Response.json({ error: "Hanya admin yang bisa mengubah status pesanan" }, { status: 403 });
  }

  const body = await request.json();
  const { order_id, status } = body;

  if (!order_id || !status) {
    return Response.json({ error: "order_id dan status wajib diisi" }, { status: 400 });
  }

  const validStatuses = ["confirmed", "shipped", "completed"];
  if (!validStatuses.includes(status)) {
    return Response.json({ error: "Status tidak valid" }, { status: 400 });
  }

  // Validate transition
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", order_id)
    .single();

  if (!order) {
    return Response.json({ error: "Pesanan tidak ditemukan" }, { status: 404 });
  }

  const transitions: Record<string, string> = {
    pending: "confirmed",
    confirmed: "shipped",
    shipped: "completed",
  };

  if (transitions[order.status] !== status) {
    return Response.json({
      error: `Tidak bisa mengubah dari "${order.status}" ke "${status}"`,
    }, { status: 400 });
  }

  const { data: updated, error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", order_id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(updated);
}
