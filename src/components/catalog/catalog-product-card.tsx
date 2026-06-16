"use client";

import type { Product } from "@/types/warden";
import { ProductCard } from "@/components/catalog/product-card";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";

export function CatalogProductCard({ product }: { product: Product }) {
  const primaryImage = product.images.find((img) => img.isPrimary);

  return (
    <ProductCard
      product={product}
      variant="default"
      showImage
      showPrice
      actions={
        <AddToSelectionButton
          productId={product.id}
          productName={product.name}
          unitPrice={product.price}
          productSlug={product.slug}
          productImage={primaryImage?.url}
          size="sm"
        />
      }
    />
  );
}
