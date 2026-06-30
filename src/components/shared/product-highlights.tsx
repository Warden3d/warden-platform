import type { ProductHighlight, ProductHighlightType } from "@/types/warden";
import {
  Ruler,
  Box,
  Crosshair,
  Wrench,
  Printer,
  Mountain,
  Package,
  Maximize2,
  Award,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ── Internal mapping: domain type → lucide-react icon ──
// The data model never depends on the icon library.
// This mapping is the single source of truth for the relationship.

const HIGHLIGHT_ICON: Record<
  ProductHighlightType,
  React.ComponentType<{ className?: string }>
> = {
  scale: Ruler,
  material: Box,
  compatibility: Crosshair,
  assembly: Wrench,
  printing: Printer,
  terrain: Mountain,
  contents: Package,
  dimensions: Maximize2,
  quality: Award,
};

const HIGHLIGHT_LABEL_FALLBACK: Partial<Record<ProductHighlightType, string>> = {
  scale: "Escala",
  material: "Material",
  compatibility: "Compatibilidad",
  assembly: "Montaje",
  printing: "Impresión",
  terrain: "Terreno",
  contents: "Contenido",
  dimensions: "Dimensiones",
  quality: "Calidad",
};

// ── Props ──

interface ProductHighlightsProps {
  highlights: ProductHighlight[];
  className?: string;
}

// ── Component ──

export function ProductHighlights({
  highlights,
  className,
}: ProductHighlightsProps) {
  if (highlights.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 lg:grid-cols-4",
        className
      )}
    >
      {highlights.map((h, idx) => {
        const Icon = HIGHLIGHT_ICON[h.type];
        return (
          <div
            key={idx}
            className="flex flex-col items-center gap-2 rounded-sm border border-border bg-warden-surface p-3 text-center"
          >
            <Icon className="size-5 text-warden-blue shrink-0" />
            <span className="text-[11px] text-foreground/80 leading-tight font-medium">
              {h.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
