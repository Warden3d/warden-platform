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

  const startIndex =
    selectedVariant?.imageIndex != null
      ? Math.min(selectedVariant.imageIndex, images.length - 1)
      : 0;

  return (
    <ProductGallery
      key={selectedVariant?.name ?? "default"}
      images={images}
      productName={productName}
      defaultIndex={startIndex}
    />
  );
}
