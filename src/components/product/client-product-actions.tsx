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
            className="h-9 w-full text-sm"
          />
        </div>
      </div>
    </div>
  );
}
