import { createClient } from "../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * GET /api/orders
 * Petani: list own orders with items
 * Admin: list all orders
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

  let query = supabase
    .from("orders")
    .select("*, order_items(*, products(name, category))")
    .order("created_at", { ascending: false });

  if (profile?.role !== "admin") {
    query = query.eq("buyer_id", user.id);
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

/**
 * POST /api/orders
 * Petani only: create an order (checkout)
 * Body: { items: [{ product_id, quantity }] }
 */
export async function POST(request: NextRequest) {
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

  if (profile?.role !== "petani") {
    return Response.json({ error: "Hanya petani yang bisa membuat pesanan" }, { status: 403 });
  }

  const body = await request.json();
  const { items } = body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: "Keranjang kosong" }, { status: 400 });
  }

  // Fetch product prices and validate stock
  const productIds = items.map((item: { product_id: string }) => item.product_id);
  const { data: products, error: productError } = await supabase
    .from("products")
    .select("id, name, price_rp, stock_qty, is_active")
    .in("id", productIds);

  if (productError || !products) {
    return Response.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }

  // Validate stock
  for (const item of items) {
    const product = products.find((p) => p.id === item.product_id);
    if (!product) {
      return Response.json({ error: `Produk tidak ditemukan` }, { status: 400 });
    }
    if (!product.is_active) {
      return Response.json({ error: `${product.name} tidak tersedia` }, { status: 400 });
    }
    if (product.stock_qty < item.quantity) {
      return Response.json({ error: `Stok ${product.name} tidak cukup (tersedia: ${product.stock_qty})` }, { status: 400 });
    }
  }

  // Calculate total
  let totalPrice = 0;
  const orderItems = items.map((item: { product_id: string; quantity: number }) => {
    const product = products.find((p) => p.id === item.product_id)!;
    totalPrice += product.price_rp * item.quantity;
    return {
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_rp: product.price_rp,
    };
  });

  // Create order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      buyer_id: user.id,
      total_price_rp: totalPrice,
      status: "pending",
    })
    .select()
    .single();

  if (orderError || !order) {
    return Response.json({ error: "Gagal membuat pesanan" }, { status: 500 });
  }

  // Create order items
  const itemsWithOrder = orderItems.map((item: { product_id: string; quantity: number; unit_price_rp: number }) => ({
    ...item,
    order_id: order.id,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(itemsWithOrder);

  if (itemsError) {
    return Response.json({ error: "Gagal menyimpan item pesanan" }, { status: 500 });
  }

  // Reduce stock atomically to prevent race conditions
  for (const item of items) {
    const { error: stockError } = await supabase.rpc('decrement_stock', {
      p_product_id: item.product_id,
      p_quantity: item.quantity,
    });
    // Fallback: if RPC doesn't exist, use direct update with filter
    if (stockError) {
      const product = products.find((p) => p.id === item.product_id)!;
      await supabase
        .from("products")
        .update({ stock_qty: Math.max(0, product.stock_qty - item.quantity) })
        .eq("id", item.product_id)
        .gte("stock_qty", item.quantity);
    }
  }

  return Response.json(order, { status: 201 });
}
