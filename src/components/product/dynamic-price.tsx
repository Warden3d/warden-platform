"use client";

import { useProductConfig } from "@/contexts/product-config";

export function DynamicPrice() {
  const { selectedVariant } = useProductConfig();
  const price = selectedVariant?.price ?? 0;

  return (
    <div className="text-right">
      <span className="text-2xl font-bold text-foreground tracking-tight">
        {price.toFixed(2).replace(".", ",")} €
      </span>
      <p className="text-xs text-muted-foreground mt-1">
        Impuestos no incluidos
      </p>
    </div>
  );
}
