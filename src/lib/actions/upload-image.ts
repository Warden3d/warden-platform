"use server";

import { uploadProductImage } from "@/lib/supabase/storage";

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

/**
 * Uploads a single image file to Supabase Storage.
 * Called from client components when files are selected/dropped.
 * Returns the public URL or null on failure.
 */
export async function uploadImageFile(
  formData: FormData
): Promise<{ url: string; path: string } | null> {
  const file = formData.get("file") as File | null;
  const productId = formData.get("productId") as string | null;
  const index = formData.get("index") as string | null;

  if (!file) return null;

  // Mock mode: return a mock URL (blob URLs from client are used instead)
  if (!isSupabaseConfigured()) {
    const ext = file.name.split(".").pop() ?? "jpg";
    void ext; // Used for future path generation
    return {
      url: `/images/products/${productId ?? "temp"}/${index ?? "0"}_${file.name.replace(/\s+/g, "_")}`,
      path: `products/${productId ?? "temp"}/${index ?? "0"}_${file.name.replace(/\s+/g, "_")}`,
    };
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const folder = productId || "temp";
  const idx = index ?? String(Date.now());
  const filePath = `products/${folder}/${idx}_${ext}_${file.name.replace(/\s+/g, "_")}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  return uploadProductImage(filePath, buffer, file.type || "image/jpeg");
}
