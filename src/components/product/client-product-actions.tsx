"use client";

import { useState, useMemo } from "react";
import { QuantitySelector } from "@/components/shared/quantity-selector";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { useProductConfig } from "@/contexts/product-config";
import type { ProductConfigurationItem } from "@/types/warden";

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
  const { selectedVariant } = useProductConfig();

  // Generate generic configuration array matching the catalog card pattern.
  // NOTE (R052A): capabilityId is fixed to "finish" — acceptable for V1 (only
  // real configurable capabilities are finishes). Revisit when Size, Scale,
  // Material, Variant or Content capabilities are introduced.
  const configuration = useMemo((): ProductConfigurationItem[] | undefined => {
    if (!selectedVariant) return undefined;
    return [
      {
        capabilityId: "finish",
        optionId: selectedVariant.name.toLowerCase().replace(/\s+/g, "-"),
        label: selectedVariant.name,
      },
    ];
  }, [selectedVariant]);

  return (
    <div className="grid grid-cols-2 gap-6">
      <QuantitySelector value={quantity} onChange={setQuantity} />
      <div className="flex items-end justify-end">
        <div className="w-48">
          <AddToSelectionButton
            entityId={productId}
            entityType="product"
            name={productName}
            unitPrice={selectedVariant?.price ?? unitPrice}
            slug={productSlug}
            image={productImage}
            quantity={quantity}
            configuration={configuration}
            className="h-9 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}