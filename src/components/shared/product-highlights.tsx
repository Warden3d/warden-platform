import type { ProductSpec } from "@/types/warden";
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

// ── Internal mapping: spec key → lucide-react icon ──
const SPEC_ICON: Record<string, React.ComponentType<{ className?: string }>> = {
  scale: Ruler,
  material: Box,
  content: Package,
  pieces: Package,
  finish: Wrench,
  weight: Box,
  compatibility: Crosshair,
  assembly: Wrench,
  printing: Printer,
  terrain: Mountain,
  dimensions: Maximize2,
  quality: Award,
};

// ── Props ──

interface ProductHighlightsProps {
  specs: ProductSpec[];
  className?: string;
}

// ── Component ──

export function ProductHighlights({
  specs,
  className,
}: ProductHighlightsProps) {
  if (specs.length === 0) return null;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-3 lg:grid-cols-4",
        className
      )}
    >
      {specs.map((s) => {
        const Icon = SPEC_ICON[s.key] ?? Package;
        return (
          <div
            key={s.id}
            className="flex flex-col items-center gap-2 rounded-sm border border-border bg-warden-surface p-3 text-center"
          >
            <Icon className="size-5 text-warden-blue shrink-0" />
            <span className="text-[11px] text-foreground/80 leading-tight font-medium">
              {s.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}