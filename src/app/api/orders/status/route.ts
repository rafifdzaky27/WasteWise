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

  const validStatuses = ["confirmed", "shipped", "completed", "rejected"];
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

  const transitions: Record<string, string[]> = {
    pending: ["confirmed", "rejected"],
    confirmed: ["shipped"],
    shipped: ["completed"],
  };

  if (!transitions[order.status]?.includes(status)) {
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

  // If rejected, restore product stock
  if (status === "rejected") {
    // Fetch order items to restore stock
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("product_id, quantity")
      .eq("order_id", order_id);

    if (orderItems) {
      for (const item of orderItems) {
        // Try RPC first, fallback to direct increment
        const { error: rpcError } = await supabase.rpc('increment_stock', {
          p_product_id: item.product_id,
          p_quantity: item.quantity,
        });
        if (rpcError) {
          // Fallback: direct update
          const { data: product } = await supabase
            .from("products")
            .select("stock_qty")
            .eq("id", item.product_id)
            .single();
          if (product) {
            await supabase
              .from("products")
              .update({ stock_qty: product.stock_qty + item.quantity })
              .eq("id", item.product_id);
          }
        }
      }
    }
  }

  return Response.json(updated);
}
