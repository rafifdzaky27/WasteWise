import { createClient } from "../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * GET /api/products
 * Public: list active products
 * Admin: list all products (including inactive)
 */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });

  // Non-admin only sees active products
  if (!user) {
    query = query.eq("is_active", true);
  } else {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      query = query.eq("is_active", true);
    }
  }

  const { data, error } = await query;
  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}

/**
 * POST /api/products
 * Admin only: create a new product
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

  if (profile?.role !== "admin") {
    return Response.json({ error: "Hanya admin yang bisa menambah produk" }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, price_rp, stock_qty, category, image_url } = body;

  if (!name || !price_rp || !category) {
    return Response.json({ error: "Nama, harga, dan kategori wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name,
      description: description || "",
      price_rp,
      stock_qty: stock_qty || 0,
      category,
      image_url: image_url || "",
      is_active: true,
    })
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data, { status: 201 });
}

/**
 * PATCH /api/products
 * Admin only: update a product
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
    return Response.json({ error: "Hanya admin yang bisa mengubah produk" }, { status: 403 });
  }

  const body = await request.json();
  const { id, ...updates } = body;

  if (!id) {
    return Response.json({ error: "ID produk wajib diisi" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
  return Response.json(data);
}
