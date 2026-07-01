"use client";

import { cn } from "@/lib/utils";
import { useSelection } from "@/hooks/use-selection";
import { Plus } from "lucide-react";

export function AddToSelectionButton({
  productId,
  productName,
  unitPrice,
  productSlug,
  productImage,
  size = "default",
  fullWidth = false,
  quantity = 1,
  configKey,
  configLabel,
  className,
}: {
  productId: string;
  productName: string;
  unitPrice: number;
  productSlug?: string;
  productImage?: string;
  size?: "default" | "sm";
  fullWidth?: boolean;
  quantity?: number;
  configKey?: string;
  configLabel?: string;
  className?: string;
}) {
  const { addItem } = useSelection();

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        addItem({
          productId,
          productName,
          unitPrice,
          quantity,
          configKey,
          configLabel,
          productSlug,
          productImage,
        });
      }}
      aria-label={`Añadir ${productName} a Mi Selección`}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-150 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon bg-warden-blue text-warden-carbon hover:bg-warden-blue/90",
        size === "default"
          ? "h-10 px-6 text-sm tracking-wide"
          : "h-7 px-3 text-xs tracking-wider uppercase",
        fullWidth && "w-full",
        className
      )}
    >
      <Plus className={size === "default" ? "size-4" : "size-3"} />
      {size === "default" ? "Añadir" : "Añadir"}
    </button>
  );
}
