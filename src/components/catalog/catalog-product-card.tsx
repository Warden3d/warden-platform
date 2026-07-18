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
          entityId={product.id}
          entityType="product"
          name={product.name}
          unitPrice={product.price}
          slug={product.slug}
          image={primaryImage?.url}
          size="sm"
        />
      }
    />
  );
}