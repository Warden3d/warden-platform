"use client";

import { useMemo } from "react";
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

  // Filter images to only those relevant to the selected variant.
  // When no imageIndices declared, show all images.
  const variantImages = useMemo(() => {
    if (
      selectedVariant?.imageIndices != null &&
      selectedVariant.imageIndices.length > 0
    ) {
      return selectedVariant.imageIndices
        .map((idx) => images[idx])
        .filter(Boolean) as ProductImage[];
    }
    return images;
  }, [selectedVariant?.imageIndices, images]);

  return (
    <ProductGallery
      key={selectedVariant?.name ?? "default"}
      images={variantImages}
      productName={productName}
    />
  );
}
