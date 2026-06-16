"use client";

import { cn } from "@/lib/utils";
import { useSelection } from "@/hooks/use-selection";
import { Package } from "lucide-react";

export function SelectionSummary({ className }: { className?: string }) {
  const { items, itemCount } = useSelection();

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div
      className={cn(
        "border border-border bg-warden-surface p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Package className="size-4 text-warden-blue" />
        <span className="text-eyebrow">Selection Summary</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Products</span>
        <span className="text-data tabular-nums text-foreground">
          {itemCount}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Orientative Subtotal</span>
        <span className="text-data tabular-nums text-foreground">
          ${subtotal.toFixed(2)}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
        This is an orientative price. The final quote will be confirmed after
        reviewing your request.
      </p>
    </div>
  );
}
