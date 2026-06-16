"use client";

import { cn } from "@/lib/utils";
import { useSelection } from "@/hooks/use-selection";
import { Plus, Check } from "lucide-react";

export function AddToSelectionButton({
  productId,
  productName,
  unitPrice,
  productSlug,
  productImage,
  size = "default",
}: {
  productId: string;
  productName: string;
  unitPrice: number;
  productSlug?: string;
  productImage?: string;
  size?: "default" | "sm";
}) {
  const { addItem, removeItem, isSelected } = useSelection();
  const selected = isSelected(productId);

  return (
    <button
      onClick={() => {
        if (selected) {
          removeItem(productId);
        } else {
          addItem({
            productId,
            productName,
            unitPrice,
            quantity: 1,
            productSlug,
            productImage,
          });
        }
      }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-150 active:translate-y-px",
        size === "default"
          ? "h-10 px-6 text-sm tracking-wide"
          : "h-7 px-3 text-xs tracking-wider uppercase",
        selected
          ? "bg-warden-blue/15 text-warden-blue border border-warden-blue/30"
          : "bg-warden-blue text-warden-carbon hover:bg-warden-blue/90"
      )}
    >
      {selected ? (
        <>
          <Check className={size === "default" ? "size-4" : "size-3"} />
          {size === "default" ? "Added to Selection" : "Added"}
        </>
      ) : (
        <>
          <Plus className={size === "default" ? "size-4" : "size-3"} />
          {size === "default" ? "Add to Selection" : "Select"}
        </>
      )}
    </button>
  );
}
