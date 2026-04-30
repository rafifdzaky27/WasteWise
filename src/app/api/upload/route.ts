import { createClient } from "../../../lib/supabase/server";
import { NextRequest } from "next/server";

/**
 * POST /api/upload
 * Admin only: upload a product image to Supabase Storage
 * Accepts multipart/form-data with a "file" field
 * Returns: { url: string } — the public URL of the uploaded image
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
      { error: "Hanya admin yang bisa mengunggah gambar" },
      { status: 403 }
    );
  }

  // Parse multipart form data
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return Response.json({ error: "File wajib diunggah" }, { status: 400 });
  }

  // Validate file type
  const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return Response.json(
      { error: "Format file tidak didukung. Gunakan PNG, JPG, atau WebP." },
      { status: 400 }
    );
  }

  // Validate file size (max 2MB)
  const MAX_SIZE = 2 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Ukuran file maksimal 2MB" },
      { status: 400 }
    );
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const filename = `${timestamp}-${random}.${ext}`;

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return Response.json(
      { error: `Gagal mengunggah: ${uploadError.message}` },
      { status: 500 }
    );
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(filename);

  return Response.json(
    { url: publicUrlData.publicUrl },
    { status: 201 }
  );
}
