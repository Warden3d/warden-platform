"use client";

import type { Product } from "@/types/warden";
import { useSelection } from "@/hooks/use-selection";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowUpRight, Check } from "lucide-react";

export function AddProductsToSelection({
  products,
  label = "Añadir a Mi Selección",
  disabledLabel = "Añadido a Mi Selección",
}: {
  products: Product[];
  label?: string;
  disabledLabel?: string;
}) {
  const { addItem, isSelected } = useSelection();

  const allSelected = products.length > 0 && products.every((p) => isSelected(p.id));

  return (
    <WardenButton
      variant="ochre"
      onClick={() => {
        for (const product of products) {
          if (!isSelected(product.id)) {
            const primaryImage = product.images.find((img) => img.isPrimary);
            addItem({
              productId: product.id,
              productName: product.name,
              unitPrice: product.price,
              quantity: 1,
              productSlug: product.slug,
              productImage: primaryImage?.url,
            });
          }
        }
      }}
      disabled={allSelected}
      aria-label="Añadir todos los productos del bundle a Mi Selección"
    >
      {allSelected ? (
        <>
          <Check className="size-4" />
          {disabledLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowUpRight className="size-4" />
        </>
      )}
    </WardenButton>
  );
}
