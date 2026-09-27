"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Product, Category, CompatibilitySystem, Collection, License, ProductType } from "@/types/warden";
import { useCatalogFilters, type CatalogFilters as CatalogFiltersState, type CatalogSort } from "@/hooks/use-catalog-filters";
import { SearchBar } from "@/components/catalog/search-bar";
import { ResultsCounter } from "@/components/catalog/results-counter";
import { EmptyState } from "@/components/catalog/empty-state";
import { CatalogFilters as FilterPanel } from "@/components/catalog/catalog-filters";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { ProductGrid } from "@/components/catalog/product-grid";
import { useMemo, useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { SlidersHorizontal, ArrowUpDown, ChevronRight, LayoutGrid, Box, Rocket } from "lucide-react";

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

const SORT_OPTIONS: { value: CatalogSort; labelKey: string }[] = [
  { value: "default", labelKey: "sortDefault" },
  { value: "name-asc", labelKey: "sortNameAsc" },
  { value: "name-desc", labelKey: "sortNameDesc" },
  { value: "price-asc", labelKey: "sortPriceAsc" },
  { value: "price-desc", labelKey: "sortPriceDesc" },
];

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
  const t = useTranslations("catalog");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const {
    filters,
    sort,
    setSort,
    priceBounds,
    setSearch,
    setCategoryId,
    setTypeId,
    setCompatibilityId,
    setCollectionId,
    setOriginId,
    setPriceRange,
    clearFilters,
    hasActiveFilters,
    filteredProducts,
    originOptions,
    availableCategories,
    availableTypes,
    availableCompatibilities,
    availableCollections,
  } = useCatalogFilters(products, { licenses, compatibilitySystems, initialFilters });

  // Only show filter options that have at least one product
  const visibleCategories = useMemo(
    () => categories.filter((c) => availableCategories.has(c.id)),
    [categories, availableCategories]
  );
  const visibleCompatibilities = useMemo(
    () => compatibilitySystems.filter((c) => availableCompatibilities.has(c.id)),
    [compatibilitySystems, availableCompatibilities]
  );
  const visibleCollections = useMemo(
    () => collections.filter((c) => availableCollections.has(c.id)),
    [collections, availableCollections]
  );
  const visibleTypes = useMemo(
    () => productTypes.filter((t) => availableTypes.has(t.id)),
    [productTypes, availableTypes]
  );

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
      <div className="flex flex-col gap-3 mb-6 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="min-w-0 flex-1 sm:min-w-64">
          <SearchBar value={filters.search} onChange={setSearch} />
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ResultsCounter total={products.length} filtered={filteredProducts.length} />
          {/* Sort selector */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="size-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            <label htmlFor="catalog-sort" className="sr-only">
              {t("sortLabel")}
            </label>
            <select
              id="catalog-sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as CatalogSort)}
              className="h-9 rounded-sm border border-border bg-warden-surface px-2 text-xs text-foreground focus:outline-none focus:border-warden-blue/50 focus:ring-1 focus:ring-warden-blue/20 transition-colors cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} className="bg-warden-carbon">
                  {t(opt.labelKey)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="catalog-sidebar"
            onClick={() => setFiltersOpen((open) => !open)}
            className="inline-flex min-h-11 items-center gap-2 rounded-sm border border-border px-3 text-xs text-foreground transition-colors hover:border-warden-blue/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 lg:hidden"
          >
            <SlidersHorizontal className="size-3.5" aria-hidden="true" />
            {filtersOpen ? t("hideFilters") : t("filters")}
            {hasActiveFilters && <span className="size-1.5 rounded-full bg-warden-blue" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Filters + Grid */}
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        {/* Sidebar filters */}
        <aside
          id="catalog-sidebar"
          aria-label={t("filters")}
          className={cn("min-w-0 lg:block", filtersOpen ? "block" : "hidden")}
        >
          <div className="space-y-6">
            <nav aria-label={t("exploreCatalog")} className="border-b border-border pb-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t("exploreCatalog")}
              </p>
              <ul className="space-y-1">
                <li>
                  <span aria-current="page" className="flex min-h-11 items-center gap-2.5 rounded-sm bg-warden-blue/10 px-3 text-sm font-medium text-foreground">
                    <LayoutGrid className="size-4 text-warden-blue" aria-hidden="true" />
                    {t("title")}
                  </span>
                </li>
                {[
                  { href: "/bundles", label: t("quickAccessBundles"), Icon: Box },
                  { href: "/drops", label: t("quickAccessDrops"), Icon: Rocket },
                ].map(({ href, label, Icon }) => (
                  <li key={href}>
                    <Link href={href} className="flex min-h-11 items-center gap-2.5 rounded-sm px-3 text-sm text-muted-foreground transition-colors hover:bg-warden-surface hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50">
                      <Icon className="size-4" aria-hidden="true" />
                      {label}
                      <ChevronRight className="ml-auto size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <FilterPanel
              categories={visibleCategories}
              compatibilitySystems={visibleCompatibilities}
              collections={visibleCollections}
              productTypes={visibleTypes}
              origins={originOptions}
              activeCategoryId={filters.categoryId}
              activeTypeId={filters.typeId}
              activeCompatibilityId={filters.compatibilityId}
              activeCollectionId={filters.collectionId}
              activeOriginId={filters.originId}
              activePriceMin={filters.priceMin}
              activePriceMax={filters.priceMax}
              priceBounds={priceBounds}
              onCategoryChange={setCategoryId}
              onTypeChange={setTypeId}
              onCompatibilityChange={setCompatibilityId}
              onCollectionChange={setCollectionId}
              onOriginChange={setOriginId}
              onPriceChange={setPriceRange}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="min-w-0 min-h-[300px]">
          {filteredProducts.length > 0 ? (
            <ProductGrid>
              {filteredProducts.map((product) => (
                <CatalogProductCard key={product.id} product={product} procedence={getProcedence(product)} />
              ))}
            </ProductGrid>
          ) : (
            <EmptyState
              title={t("emptyTitle")}
              description={t("emptyDesc")}
            />
          )}
        </div>
      </div>
    </div>
  );
}
