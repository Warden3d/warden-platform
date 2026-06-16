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
          onClick={onClear}
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
        >
          <X className="size-3" />
          Clear filters
        </button>
      )}

      {/* Category */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Category
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={cn(
                "px-2.5 py-1 text-xs border rounded-sm transition-colors",
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
          Compatibility
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {compatibilitySystems.map((comp) => (
            <button
              key={comp.id}
              onClick={() => onCompatibilityChange(comp.id)}
              className={cn(
                "transition-opacity",
                activeCompatibilityId && activeCompatibilityId !== comp.id
                  ? "opacity-30 hover:opacity-60"
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
          Collection
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onCollectionChange(col.id)}
              className={cn(
                "px-2.5 py-1 text-xs border rounded-sm transition-colors",
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
