"use client";

import type { Category, CompatibilitySystem, Collection, ProductType, Product } from "@/types/warden";
import { cn } from "@/lib/utils";
import { TechnicalBadge } from "@/components/catalog/technical-badge";
import { X } from "lucide-react";
import { useMemo } from "react";

interface CatalogFiltersProps {
  categories: Category[];
  compatibilitySystems: CompatibilitySystem[];
  collections: Collection[];
  productTypes: ProductType[];
  products: Product[];
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

export function CatalogFilters({
  categories,
  compatibilitySystems,
  collections,
  productTypes,
  products,
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
  // Types valid for the currently selected category
  const availableTypes = useMemo(() => {
    if (!activeCategoryId) return [];
    return productTypes.filter((t) => t.categoryId === activeCategoryId);
  }, [productTypes, activeCategoryId]);

  // Count products per type within the active category
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    let scope = products;
    if (activeCategoryId) {
      scope = scope.filter((p) => p.categoryId === activeCategoryId);
    }
    for (const p of scope) {
      if (p.typeId) {
        counts[p.typeId] = (counts[p.typeId] ?? 0) + 1;
      }
    }
    return counts;
  }, [products, activeCategoryId]);

  const categoryHasTypes = activeCategoryId && availableTypes.length > 0;

  return (
    <div className="space-y-5">
      {/* 1. Categorías */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
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

      {/* 2. Sistema de juego */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
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

      {/* 3. Colección */}
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

      {/* 4. Tipo (dependiente de Categoría) */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Tipo
        </legend>
        {!activeCategoryId ? (
          <p className="text-[11px] text-muted-foreground/50 italic">
            Selecciona una categoría
          </p>
        ) : categoryHasTypes ? (
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrar por tipo">
            {availableTypes.map((t) => {
              const count = typeCounts[t.id] ?? 0;
              return (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => onTypeChange(t.id)}
                  aria-pressed={activeTypeId === t.id}
                  disabled={count === 0}
                  className={cn(
                    "px-2.5 py-1 text-xs border rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
                    activeTypeId === t.id
                      ? "border-warden-blue/40 bg-warden-blue/10 text-warden-blue"
                      : count === 0
                        ? "border-border/30 text-muted-foreground/30 cursor-not-allowed"
                        : "border-border text-muted-foreground hover:border-warden-blue/20 hover:text-foreground"
                  )}
                >
                  {t.name}
                  <span className="ml-1 text-[10px] opacity-60">({count})</span>
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-[11px] text-muted-foreground/50 italic">
            Esta categoría no utiliza tipologías
          </p>
        )}
      </fieldset>

      {/* 5. Precio (arquitectura futura) */}
      <fieldset>
        <legend className="text-spec-label text-muted-foreground mb-2.5">
          Precio
        </legend>
      </fieldset>

      {/* 6. Reset Filters */}
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
    </div>
  );
}