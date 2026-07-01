"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Minus, Plus } from "lucide-react";

// ── Props ──

interface QuantitySelectorProps {
  value?: number;
  onChange?: (value: number) => void;
  className?: string;
}

// ── Component ──

export function QuantitySelector({
  value: controlledValue,
  onChange,
  className,
}: QuantitySelectorProps) {
  const [internalQty, setInternalQty] = useState(1);
  const qty = controlledValue ?? internalQty;

  const setQty = useCallback(
    (v: number) => {
      const clamped = Math.max(1, v);
      if (onChange) onChange(clamped);
      else setInternalQty(clamped);
    },
    [onChange]
  );

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-spec-label text-muted-foreground uppercase tracking-wider">
        Cantidad
      </span>
      <div className="flex items-center gap-0">
        <button
          type="button"
          onClick={() => setQty(qty - 1)}
          className="flex h-9 w-9 items-center justify-center border border-border bg-warden-surface text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors rounded-l-sm"
          aria-label="Reducir cantidad"
        >
          <Minus className="size-3.5" />
        </button>
        <span className="flex h-9 w-9 items-center justify-center border-y border-border bg-warden-surface text-sm font-medium text-foreground tabular-nums">
          {qty}
        </span>
        <button
          type="button"
          onClick={() => setQty(qty + 1)}
          className="flex h-9 w-9 items-center justify-center border border-border bg-warden-surface text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors rounded-r-sm"
          aria-label="Aumentar cantidad"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
