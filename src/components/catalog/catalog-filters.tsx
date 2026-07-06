"use client";

import { useMemo } from "react";
import type { Category, CompatibilitySystem, Collection, ProductType } from "@/types/warden";
import { cn } from "@/lib/utils";
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

// ── Shared button geometry ──

const BTN =
  "w-full px-2 py-2.5 text-[12px] leading-snug text-center border rounded-sm transition-all duration-150 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 " +
  "focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon";

const BTN_SELECTED =
  "border-warden-blue/50 bg-warden-blue/12 text-warden-blue font-medium " +
  "shadow-[inset_0_0_0_1px_rgba(59,130,246,0.15)]";

const BTN_DEFAULT =
  "border-border text-foreground/70 hover:border-warden-blue/30 hover:text-foreground hover:bg-warden-elevated/40";

const GRID = "grid grid-cols-2 gap-1.5";

// ── Component ──

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
  // Group typologies by category for the Tipo section
  const groupedTypes = useMemo(() => {
    const catName = new Map(categories.map((c) => [c.id, c.name]));
    const catOrder = categories.map((c) => c.id);
    const result: { categoryId: string; categoryName: string; types: ProductType[] }[] = [];

    for (const catId of catOrder) {
      const types = productTypes
        .filter((t) => t.categoryId === catId)
        .sort((a, b) => a.name.localeCompare(b.name, "es"));
      if (types.length > 0) {
        result.push({
          categoryId: catId,
          categoryName: catName.get(catId) ?? catId,
          types,
        });
      }
    }
    return result;
  }, [productTypes, categories]);

  return (
    <div className="space-y-6">
      {/* ── Sidebar header ── */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground/90 tracking-wider uppercase">
          Filtros
        </span>
        <button
          type="button"
          onClick={onClear}
          disabled={!hasActiveFilters}
          className={cn(
            "inline-flex items-center gap-1 text-xs rounded-sm transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50",
            hasActiveFilters
              ? "text-muted-foreground hover:text-foreground"
              : "text-muted-foreground/40 cursor-not-allowed",
          )}
        >
          <X className="size-3" />
          Limpiar
        </button>
      </div>

      {/* ── 1. Categorías ── */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Categorías
        </legend>
        <div className={GRID} role="group" aria-label="Filtrar por categoría">
          {categories.map((cat) => (
            <button
              type="button"
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              aria-pressed={activeCategoryId === cat.id}
              className={cn(BTN, activeCategoryId === cat.id ? BTN_SELECTED : BTN_DEFAULT)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ── 2. Sistema de juego ── */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Sistema de juego
        </legend>
        <div className={GRID} role="group" aria-label="Filtrar por sistema de juego">
          {compatibilitySystems.map((comp) => (
            <button
              type="button"
              key={comp.id}
              onClick={() => onCompatibilityChange(comp.id)}
              aria-pressed={activeCompatibilityId === comp.id}
              className={cn(BTN, activeCompatibilityId === comp.id ? BTN_SELECTED : BTN_DEFAULT)}
            >
              {comp.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ── 3. Colección ── */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Colección
        </legend>
        <div className={GRID} role="group" aria-label="Filtrar por colección">
          {collections.map((col) => (
            <button
              type="button"
              key={col.id}
              onClick={() => onCollectionChange(col.id)}
              aria-pressed={activeCollectionId === col.id}
              className={cn(BTN, activeCollectionId === col.id ? BTN_SELECTED : BTN_DEFAULT)}
            >
              {col.name}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ── 4. Tipo (tipologías agrupadas por categoría) ── */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Tipo
        </legend>
        <div className="space-y-4">
          {groupedTypes.map((group) => (
            <div key={group.categoryId}>
              <h4 className="text-[11px] font-medium text-muted-foreground/70 tracking-wider mb-2 uppercase">
                {group.categoryName}
              </h4>
              <div className={GRID} role="group" aria-label={`Filtrar por tipo: ${group.categoryName}`}>
                {group.types.map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => onTypeChange(t.id)}
                    aria-pressed={activeTypeId === t.id}
                    className={cn(BTN, activeTypeId === t.id ? BTN_SELECTED : BTN_DEFAULT)}
                  >
                    {t.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </fieldset>

      {/* ── 5. Precio (arquitectura futura) ── */}
      <fieldset>
        <legend className="text-[13px] font-semibold text-foreground/90 tracking-wider mb-3 uppercase">
          Precio
        </legend>
      </fieldset>
    </div>
  );
}