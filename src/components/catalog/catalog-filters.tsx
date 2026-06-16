"use client";

import type { Category, CompatibilitySystem, Collection } from "@/types/warden";
import { cn } from "@/lib/utils";
import { TechnicalBadge } from "@/components/catalog/technical-badge";
import { X } from "lucide-react";

interface CatalogFiltersProps {
  categories: Category[];
  compatibilitySystems: CompatibilitySystem[];
  collections: Collection[];
  activeCategoryId: string | null;
  activeCompatibilityId: string | null;
  activeCollectionId: string | null;
  onCategoryChange: (id: string | null) => void;
  onCompatibilityChange: (id: string | null) => void;
  onCollectionChange: (id: string | null) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
}

const compatVariant: Record<string, "ochre" | "blue" | "green"> = {
  "comp-battletech-classic": "ochre",
  "comp-alpha-strike": "blue",
  "comp-aerotech": "green",
};

export function CatalogFilters({
  categories,
  compatibilitySystems,
  collections,
  activeCategoryId,
  activeCompatibilityId,
  activeCollectionId,
  onCategoryChange,
  onCompatibilityChange,
  onCollectionChange,
  onClear,
  hasActiveFilters,
}: CatalogFiltersProps) {
  return (
    <div className="space-y-5">
      {/* Clear all */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <X className="size-3" />
          Limpiar filtros
        </button>
      )}

      {/* Category */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Categoría
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por categoría">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={activeCategoryId === cat.id}
              className={cn(
                "px-2.5 py-1 text-xs border rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
                activeCategoryId === cat.id
                  ? "border-warden-blue/40 bg-warden-blue/10 text-warden-blue"
                  : "border-border text-muted-foreground hover:border-warden-blue/20 hover:text-foreground"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Compatibility */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Compatibilidad
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por compatibilidad">
          {compatibilitySystems.map((comp) => (
            <button
              type="button"
              key={comp.id}
              onClick={() => onCompatibilityChange(comp.id)}
              aria-pressed={activeCompatibilityId === comp.id}
              className={cn(
                "rounded-sm transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
                activeCompatibilityId && activeCompatibilityId !== comp.id
                  ? "opacity-40 hover:opacity-70"
                  : "opacity-100"
              )}
            >
              <TechnicalBadge
                variant={compatVariant[comp.id] ?? "neutral"}
                className={cn(
                  activeCompatibilityId === comp.id &&
                    "ring-1 ring-warden-blue/40"
                )}
              >
                {comp.name}
              </TechnicalBadge>
            </button>
          ))}
        </div>
      </fieldset>

      {/* Collection */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Colección
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por colección">
          {collections.map((col) => (
            <button
              type="button"
              key={col.id}
              onClick={() => onCollectionChange(col.id)}
              aria-pressed={activeCollectionId === col.id}
              className={cn(
                "px-2.5 py-1 text-xs border rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
                activeCollectionId === col.id
                  ? "border-warden-blue/40 bg-warden-blue/10 text-warden-blue"
                  : "border-border text-muted-foreground hover:border-warden-blue/20 hover:text-foreground"
              )}
            >
              {col.name}
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
