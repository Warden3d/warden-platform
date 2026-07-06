"use client";

import type { Category, CompatibilitySystem, Collection, ProductType } from "@/types/warden";
import { cn } from "@/lib/utils";
import { TechnicalBadge } from "@/components/catalog/technical-badge";
import { X } from "lucide-react";

interface CatalogFiltersProps {
  categories: Category[];
  compatibilitySystems: CompatibilitySystem[];
  collections: Collection[];
  productTypes: ProductType[];
  activeCategoryId: string | null;
  activeTypeId: string | null;
  activeCompatibilityId: string | null;
  activeCollectionId: string | null;
  onCategoryChange: (id: string | null) => void;
  onTypeChange: (id: string | null) => void;
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

const FILTER_BUTTON =
  "px-3 py-1.5 text-[13px] border rounded-sm transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon";

const FILTER_SELECTED =
  "border-warden-blue/50 bg-warden-blue/12 text-warden-blue shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]";

const FILTER_DEFAULT =
  "border-border text-foreground/70 hover:border-warden-blue/30 hover:text-foreground hover:bg-warden-elevated/40";

export function CatalogFilters({
  categories,
  compatibilitySystems,
  collections,
  productTypes,
  activeCategoryId,
  activeTypeId,
  activeCompatibilityId,
  activeCollectionId,
  onCategoryChange,
  onTypeChange,
  onCompatibilityChange,
  onCollectionChange,
  onClear,
  hasActiveFilters,
}: CatalogFiltersProps) {
  return (
    <div className="space-y-6">
      {/* 1. Categorías */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Categorías
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por categoría">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={activeCategoryId === cat.id}
              className={cn(
                FILTER_BUTTON,
                activeCategoryId === cat.id ? FILTER_SELECTED : FILTER_DEFAULT
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 2. Sistema de juego */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Sistema de juego
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por sistema de juego">
          {compatibilitySystems.map((comp) => (
            <button
              type="button"
              key={comp.id}
              onClick={() => onCompatibilityChange(comp.id)}
              aria-pressed={activeCompatibilityId === comp.id}
              className={cn(
                "rounded-sm transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
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

      {/* 3. Colección */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
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
                FILTER_BUTTON,
                activeCollectionId === col.id ? FILTER_SELECTED : FILTER_DEFAULT
              )}
            >
              {col.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 4. Tipo */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Tipo
        </legend>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo">
          {productTypes.map((t) => (
            <button
              type="button"
              key={t.id}
              onClick={() => onTypeChange(t.id)}
              aria-pressed={activeTypeId === t.id}
              className={cn(
                FILTER_BUTTON,
                activeTypeId === t.id ? FILTER_SELECTED : FILTER_DEFAULT
              )}
            >
              {t.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* 5. Precio (arquitectura futura) */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Precio
        </legend>
      </fieldset>

      {/* 6. Reset Filters */}
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="size-3.5" />
          Limpiar filtros
        </button>
      )}
    </div>
  );
}