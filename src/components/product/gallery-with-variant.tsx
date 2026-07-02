"use client";

import { useProductConfig } from "@/contexts/product-config";
import { ProductGallery } from "@/components/catalog/product-gallery";
import type { ProductImage } from "@/types/warden";

interface GalleryWithVariantProps {
  images: ProductImage[];
  productName: string;
}

export function GalleryWithVariant({
  images,
  productName,
}: GalleryWithVariantProps) {
  const { selectedVariant } = useProductConfig();

  // Show variant-specific images when the product declares imageIndices.
  // Otherwise fall back to all product images.
  let variantImages: ProductImage[] = images;

  const indices = selectedVariant?.imageIndices;
  if (indices != null && indices.length > 0) {
    variantImages = indices
      .map((idx) => images[idx])
      .filter((img): img is ProductImage => img != null);
  }

  return (
    <ProductGallery
      key={selectedVariant?.name ?? "default"}
      images={variantImages}
      productName={productName}
    />
  );
}
