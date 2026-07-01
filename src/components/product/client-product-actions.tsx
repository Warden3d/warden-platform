"use client";

import { useState } from "react";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { useProductConfig } from "@/contexts/product-config";

interface ClientProductActionsProps {
  productId: string;
  productName: string;
  unitPrice: number;
  productSlug?: string;
  productImage?: string;
}

export function ClientProductActions({
  productId,
  productName,
  unitPrice,
  productSlug,
  productImage,
}: ClientProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const { selectedVariant, variants } = useProductConfig();

  // Build config info from active variant
  const hasVariants = variants.length > 1;
  const configKey = hasVariants ? selectedVariant?.name?.toLowerCase() : undefined;
  const configLabel = hasVariants && selectedVariant
    ? `Acabado: ${selectedVariant.name}`
    : undefined;

  return (
    <div className="grid grid-cols-2 gap-6">
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <div className="flex items-end justify-end">
        <div className="w-48">
          <AddToSelectionButton
            productId={productId}
            productName={productName}
            unitPrice={selectedVariant?.price ?? unitPrice}
            productSlug={productSlug}
            productImage={productImage}
            quantity={quantity}
            configKey={configKey}
            configLabel={configLabel}
            className="h-9 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}
