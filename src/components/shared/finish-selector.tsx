"use client";

import { cn } from "@/lib/utils";
import { useProductConfig } from "@/contexts/product-config";

// ── Props ──

interface FinishSelectorProps {
  label?: string;
  className?: string;
}

// ── Component ──
// PCM States:
//   A (no variants)  → render nothing
//   B (1 variant)    → info text, no selector
//   C / D (2+ vars)  → interactive swatch selector

export function FinishSelector({
  label = "Acabado",
  className,
}: FinishSelectorProps) {
  const { variants, selectedIdx, selectVariant } = useProductConfig();

  // ── State A: no variants → nothing ──
  if (variants.length === 0) return null;

  // ── State B: single variant → info text ──
  if (variants.length === 1) {
    return (
      <div className={cn("flex flex-col gap-2", className)}>
        <span className="text-spec-label text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        <span className="text-sm text-foreground/80">{variants[0].name}</span>
      </div>
    );
  }

  // ── State C/D: multiple variants → interactive selector ──
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-spec-label text-muted-foreground uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-2">
        {variants.map((v, idx) => (
          <button
            key={v.name}
            type="button"
            onClick={() => selectVariant(idx)}
            aria-label={`${label}: ${v.name}`}
            className={cn(
              "flex items-center gap-1.5 rounded-sm border px-2.5 py-1.5 text-xs transition-all duration-150",
              idx === selectedIdx
                ? "border-warden-blue/60 bg-warden-blue/10 text-foreground"
                : "border-border text-muted-foreground hover:border-warden-blue/30 hover:text-foreground"
            )}
          >
            {v.swatchColor && (
              <span
                className="size-3.5 rounded-full shrink-0"
                style={{ backgroundColor: v.swatchColor }}
              />
            )}
            {v.name}
          </button>
        ))}
      </div>
    </div>
  );
}
