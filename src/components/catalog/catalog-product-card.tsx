"use client";

import type { Product } from "@/types/warden";
import { ProductCard } from "@/components/catalog/product-card";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";

export function CatalogProductCard({
  product,
  procedence,
}: {
  product: Product;
  procedence?: string;
}) {
  const primaryImage = product.images.find((img) => img.isPrimary);

  return (
    <ProductCard
      product={product}
      variant="default"
      showImage
      showPrice
      procedence={procedence}
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