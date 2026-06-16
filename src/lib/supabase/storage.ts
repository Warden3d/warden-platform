/**
 * Supabase Storage utility for WARDEN product images.
 *
 * All operations target the 'product-images' bucket.
 * Service role client is used for uploads/deletes (admin-only server actions).
 * Public URLs are generated via Supabase's getPublicUrl for CDN delivery.
 */

import { createServiceClient } from "./server";

const BUCKET = "product-images";

/**
 * Returns the public URL for a stored file path within the product-images bucket.
 * Does NOT verify the file exists — just builds the URL.
 */
export function getPublicUrl(path: string): string {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`;
  return url;
}

/**
 * Uploads a file to Supabase Storage.
 * @param filePath - path within bucket (e.g. "products/prod-001/main.jpg")
 * @param file - Buffer or File to upload
 * @param contentType - MIME type of the file
 * @returns the public URL of the uploaded file, or null on error
 */
export async function uploadProductImage(
  filePath: string,
  file: Buffer | File,
  contentType: string
): Promise<{ url: string; path: string } | null> {
  const supabase = await createServiceClient();

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .upload(filePath, file, {
      contentType,
      upsert: true,
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    return null;
  }

  return {
    url: getPublicUrl(data.path),
    path: data.path,
  };
}

/**
 * Deletes a single file from Supabase Storage.
 * @param path - the full path within the bucket (e.g. "products/prod-001/main.jpg")
 */
export async function deleteProductImage(path: string): Promise<boolean> {
  const supabase = await createServiceClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([path]);

  if (error) {
    console.error("Supabase storage delete error:", error);
    return false;
  }

  return true;
}

/**
 * Deletes multiple files from Supabase Storage.
 * @param paths - array of full paths within the bucket
 */
export async function deleteProductImages(paths: string[]): Promise<boolean> {
  if (paths.length === 0) return true;

  const supabase = await createServiceClient();

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove(paths);

  if (error) {
    console.error("Supabase storage bulk delete error:", error);
    return false;
  }

  return true;
}

/**
 * Extracts the storage path from a full Supabase public URL.
 * Example: "https://xxx.supabase.co/storage/v1/object/public/product-images/products/prod-001/main.jpg"
 *       -> "products/prod-001/main.jpg"
 */
export function urlToStoragePath(url: string): string | null {
  const prefix = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(prefix);
  if (idx === -1) return null;
  return url.slice(idx + prefix.length);
}
