"use client";

import type { Product, Category, CompatibilitySystem, Collection, License, ProductType } from "@/types/warden";
import { useCatalogFilters, type CatalogFilters as CatalogFiltersState } from "@/hooks/use-catalog-filters";
import { SearchBar } from "@/components/catalog/search-bar";
import { ResultsCounter } from "@/components/catalog/results-counter";
import { EmptyState } from "@/components/catalog/empty-state";
import { CatalogFilters as FilterPanel } from "@/components/catalog/catalog-filters";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { ProductGrid } from "@/components/catalog/product-grid";
import { useMemo, useCallback } from "react";
import { SlidersHorizontal } from "lucide-react";

interface CatalogViewProps {
  products: Product[];
  categories: Category[];
  compatibilitySystems: CompatibilitySystem[];
  collections: Collection[];
  licenses: License[];
  productTypes: ProductType[];
  initialFilters?: Partial<CatalogFiltersState>;
  title: string;
  description?: string;
}

export function CatalogView({
  products,
  categories,
  compatibilitySystems,
  collections,
  licenses,
  productTypes,
  initialFilters,
  title,
  description,
}: CatalogViewProps) {
  const {
    filters,
    priceBounds,
    setSearch,
    setCategoryId,
    setTypeId,
    setCompatibilityId,
    setCollectionId,
    setPriceRange,
    clearFilters,
    hasActiveFilters,
    filteredProducts,
  } = useCatalogFilters(products, initialFilters);

  // Procedence resolver
  const colMap = useMemo(() => new Map(collections.map((c) => [c.id, c.name])), [collections]);
  const licMap = useMemo(() => new Map(licenses.map((l) => [l.id, l.name])), [licenses]);

  const getProcedence = useCallback(
    (product: Product): string | undefined => {
      // Licensed product → use license name
      if (product.associatedLicenseId) {
        const lic = licMap.get(product.associatedLicenseId);
        if (lic) return lic;
      }
      // Otherwise → use collection name
      const col = colMap.get(product.collectionId);
      return col;
    },
    [colMap, licMap]
  );
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1">
          <SearchBar value={filters.search} onChange={setSearch} />
        </div>
          <div className="flex items-center gap-3">
          <ResultsCounter total={products.length} filtered={filteredProducts.length} />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <SlidersHorizontal className="size-3.5" />
            <span className="hidden sm:inline">Filtros</span>
          </div>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
        <aside className="order-2 lg:order-1">
          <div className="lg:sticky lg:top-24">
            <FilterPanel
              categories={categories}
              compatibilitySystems={compatibilitySystems}
              collections={collections}
              productTypes={productTypes}
              activeCategoryId={filters.categoryId}
              activeTypeId={filters.typeId}
              activeCompatibilityId={filters.compatibilityId}
              activeCollectionId={filters.collectionId}
              activePriceMin={filters.priceMin}
              activePriceMax={filters.priceMax}
              priceBounds={priceBounds}
              onCategoryChange={setCategoryId}
              onTypeChange={setTypeId}
              onCompatibilityChange={setCompatibilityId}
              onCollectionChange={setCollectionId}
              onPriceChange={setPriceRange}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* Product grid */}
        <main className="order-1 lg:order-2 min-h-[300px]">
          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} procedence={getProcedence(product)} />
              ))}
            </ProductGrid>
          ) : (
            <EmptyState
              title="Ningún resultado coincide con tus criterios"
              description="Prueba a limpiar algunos filtros o ajustar tu búsqueda para encontrar lo que buscas."
            />
          )}
        </main>
      </div>
    </div>
  );
}