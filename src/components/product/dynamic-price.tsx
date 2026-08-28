"use client";

import { useProductConfig } from "@/contexts/product-config";
import { formatPriceEUR } from "@/lib/utils";

export function DynamicPrice({ basePrice }: { basePrice: number }) {
  const { selectedVariant } = useProductConfig();
  // Variant price when one is selected; otherwise the product base price.
  // A valid product without variants must never show 0,00 €.
  const price = selectedVariant?.price ?? basePrice;

  return (
    <div className="text-right">
      <span className="text-2xl font-bold text-foreground tracking-tight">
        {formatPriceEUR(price)}
      </span>
      <p className="text-xs text-muted-foreground mt-1">
        Impuestos no incluidos
      </p>
    </div>
  );
}
