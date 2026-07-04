"use server";

import { productFormSchema, type ProductFormValues } from "@/lib/schemas/product";
import { createProduct as createProd, updateProduct as updateProd } from "@/lib/data/admin";
import { uploadProductImage, deleteProductImage, urlToStoragePath } from "@/lib/supabase/storage";
import type { ProductImage, ImageViewType } from "@/types/warden";
import { revalidatePath } from "next/cache";

export type ProductFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  productId?: string;
};

export type UploadableImage = {
  id?: string;
  url?: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  viewType: ImageViewType;
  file?: File;
  _existingId?: string;
};

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function parseIds(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Uploads pending files to Supabase Storage and builds the final
 * ProductImage array for the DB. Existing images (with url and id) are kept.
 */
async function processImages(
  productId: string,
  rawImages: UploadableImage[]
): Promise<Omit<ProductImage, "id" | "productId">[]> {
  const results: Omit<ProductImage, "id" | "productId">[] = [];

  for (let i = 0; i < rawImages.length; i++) {
    const img = rawImages[i];

    // If the image already has a URL (existing DB record or blob URL from pending),
    // we only upload if it has a File attached.
    if (img.file) {
      const ext = img.file.name.split(".").pop() ?? "jpg";
      const filePath = `products/${productId}/${i + 1}_${img.viewType}.${ext}`;
      const buffer = Buffer.from(await img.file.arrayBuffer());

      const result = await uploadProductImage(
        filePath,
        buffer,
        img.file.type || "image/jpeg"
      );

      if (result) {
        results.push({
          url: result.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder ?? i + 1,
          viewType: img.viewType ?? "main",
        });
      }
    } else if (img.url) {
      // Existing image — keep the URL as-is
      results.push({
        url: img.url,
        alt: img.alt,
        isPrimary: img.isPrimary,
        sortOrder: img.sortOrder ?? i + 1,
        viewType: img.viewType ?? "main",
      });
    }
  }

  return results;
}

export async function createProduct(
  data: ProductFormValues
): Promise<ProductFormResult> {
  const parsed = productFormSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const d = parsed.data;
  const gameFeatures = parseFeatures(d.gameFeatures ?? "");

  // For create, images are handled after product is created (we need the ID)
  const result = await createProd({
    name: d.name,
    slug: d.slug,
    shortDescription: d.shortDescription,
    description: d.description,
    collectionId: d.collectionId,
    categoryId: d.categoryId,
    compatibilityId: d.compatibilityId,
    scale: d.scale,
    material: d.material,
    dimensions: { height: d.height, width: d.width, depth: d.depth },
    price: d.price,
    gameFeatures,
    status: d.status,
    featured: d.featured ?? false,
    internalCode: d.internalCode,
    associatedLicenseId: d.associatedLicenseId ?? null,
    weight: d.weight,
    volume: d.volume,
    printTime: d.printTime,
    version: d.version,
    relatedProductIds: parseIds(d.relatedProductIds ?? ""),
    relatedBundleIds: parseIds(d.relatedBundleIds ?? ""),
    relatedDropIds: parseIds(d.relatedDropIds ?? ""),
    typeId: d.typeId ?? "",
    images: [],
    specs: [],
  });

  if (!result) {
    return { success: false, message: "Error al crear el producto." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, productId: result.id };
}

export async function updateProduct(
  id: string,
  data: ProductFormValues,
  images?: UploadableImage[]
): Promise<ProductFormResult> {
  const parsed = productFormSchema.safeParse(data);
  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  const d = parsed.data;
  const gameFeatures = parseFeatures(d.gameFeatures ?? "");

  // Process images if provided
  let processedImages: Omit<ProductImage, "id" | "productId">[] | undefined;
  if (images && images.length > 0) {
    processedImages = await processImages(id, images);
  }

  const result = await updateProd(id, {
    name: d.name,
    slug: d.slug,
    shortDescription: d.shortDescription,
    description: d.description,
    collectionId: d.collectionId,
    categoryId: d.categoryId,
    compatibilityId: d.compatibilityId,
    scale: d.scale,
    material: d.material,
    dimensions: { height: d.height, width: d.width, depth: d.depth },
    price: d.price,
    gameFeatures,
    status: d.status,
    featured: d.featured ?? false,
    internalCode: d.internalCode,
    associatedLicenseId: d.associatedLicenseId ?? null,
    weight: d.weight,
    volume: d.volume,
    printTime: d.printTime,
    version: d.version,
    relatedProductIds: parseIds(d.relatedProductIds ?? ""),
    relatedBundleIds: parseIds(d.relatedBundleIds ?? ""),
    relatedDropIds: parseIds(d.relatedDropIds ?? ""),
    typeId: d.typeId ?? "",
    images: processedImages,
    specs: [],
  });

  if (!result) {
    return { success: false, message: "Error al actualizar el producto." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { success: true, productId: result.id };
}

/**
 * Deletes an image from Supabase Storage and returns success.
 * Should be called before removing the DB record.
 */
export async function removeImageFromStorage(
  url: string
): Promise<boolean> {
  const path = urlToStoragePath(url);
  if (!path) return true; // Not a Supabase storage URL, nothing to delete
  return deleteProductImage(path);
}
