"use client";

import { cn } from "@/lib/utils";
import { useSelection } from "@/hooks/use-selection";
import { Plus } from "lucide-react";
import type { EntityType } from "@/types/warden";

export function AddToSelectionButton({
  entityId,
  entityType = "product",
  name,
  unitPrice,
  slug,
  image,
  size = "default",
  fullWidth = false,
  quantity = 1,
  className,
}: {
  entityId: string;
  entityType?: EntityType;
  name: string;
  unitPrice: number;
  slug?: string;
  image?: string;
  size?: "default" | "sm";
  fullWidth?: boolean;
  quantity?: number;
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
          entityId,
          entityType,
          name,
          unitPrice,
          quantity,
          slug,
          image,
        });
      }}
      aria-label={`Añadir ${name} a Mi Selección`}
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