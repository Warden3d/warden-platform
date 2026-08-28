"use client";

import { useMemo, useState, useCallback, useDeferredValue } from "react";
import type { Product, License, CompatibilitySystem } from "@/types/warden";

export interface CatalogFilters {
  search: string;
  categoryId: string | null;
  typeId: string | null;
  compatibilityId: string | null;
  collectionId: string | null;
  originId: string | null;
  priceMin: number | null;
  priceMax: number | null;
}

export type CatalogSort =
  | "default"
  | "name-asc"
  | "name-desc"
  | "price-asc"
  | "price-desc";

const EMPTY_FILTERS: CatalogFilters = {
  search: "",
  categoryId: null,
  typeId: null,
  compatibilityId: null,
  collectionId: null,
  originId: null,
  priceMin: null,
  priceMax: null,
};

/**
 * Normalize text for search: lowercase, trimmed, diacritics removed.
 * "Escenografía" → "escenografia"
 */
export function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Label used for products without a license/designer (WARDEN originals). */
export const WARDEN_ORIGIN_LABEL = "WARDEN Original";

/**
 * Resolve the designer/license origin of a product from real data:
 * designerName > license name > WARDEN Original.
 */
export function resolveOrigin(
  product: Product,
  licenses: License[],
): string {
  if (product.designerName) return product.designerName;
  if (product.associatedLicenseId) {
    const lic = licenses.find((l) => l.id === product.associatedLicenseId);
    if (lic) return lic.name;
  }
  return WARDEN_ORIGIN_LABEL;
}

export function useCatalogFilters(
  products: Product[],
  options?: {
    licenses?: License[];
    compatibilitySystems?: CompatibilitySystem[];
    initialFilters?: Partial<CatalogFilters>;
  }
) {
  const { licenses = [], compatibilitySystems = [], initialFilters } = options ?? {};

  const [filters, setFilters] = useState<CatalogFilters>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });
  const [sort, setSort] = useState<CatalogSort>("default");

  // Stable price bounds from the full product set
  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price).filter((p) => p > 0);
    if (prices.length === 0) return { min: 0, max: 100 };
    return {
      min: Math.floor(Math.min(...prices) * 100) / 100,
      max: Math.ceil(Math.max(...prices) * 100) / 100,
    };
  }, [products]);

  // Origin options derived from real product data (only with products)
  const originOptions = useMemo(() => {
    const origins = new Set(products.map((p) => resolveOrigin(p, licenses)));
    return Array.from(origins).sort((a, b) => a.localeCompare(b, "es"));
  }, [products, licenses]);

  // Filter option sets: only values that have at least one product
  const availableCategories = useMemo(() => {
    const ids = new Set(products.map((p) => p.categoryId).filter(Boolean));
    return ids;
  }, [products]);
  const availableTypes = useMemo(() => {
    const ids = new Set(products.map((p) => p.typeId).filter(Boolean));
    return ids;
  }, [products]);
  const availableCompatibilities = useMemo(() => {
    const ids = new Set(products.map((p) => p.compatibilityId).filter(Boolean));
    return ids;
  }, [products]);
  const availableCollections = useMemo(() => {
    const ids = new Set(products.map((p) => p.collectionId).filter(Boolean));
    return ids;
  }, [products]);

  const compatNameMap = useMemo(
    () => new Map(compatibilitySystems.map((c) => [c.id, c.name])),
    [compatibilitySystems]
  );

  const deferredSearch = useDeferredValue(filters.search);

  const setSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }));
  }, []);

  const setCategoryId = useCallback((categoryId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      categoryId: prev.categoryId === categoryId ? null : categoryId,
    }));
  }, []);

  const setTypeId = useCallback((typeId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      typeId: prev.typeId === typeId ? null : typeId,
    }));
  }, []);

  const setCompatibilityId = useCallback((compatibilityId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      compatibilityId:
        prev.compatibilityId === compatibilityId ? null : compatibilityId,
    }));
  }, []);

  const setCollectionId = useCallback((collectionId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      collectionId:
        prev.collectionId === collectionId ? null : collectionId,
    }));
  }, []);

  const setOriginId = useCallback((originId: string | null) => {
    setFilters((prev) => ({
      ...prev,
      originId: prev.originId === originId ? null : originId,
    }));
  }, []);

  const setPriceRange = useCallback((min: number | null, max: number | null) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS, ...initialFilters });
  }, [initialFilters]);

  const hasActiveFilters =
    deferredSearch.length > 0 ||
    filters.categoryId !== null ||
    filters.typeId !== null ||
    filters.compatibilityId !== null ||
    filters.collectionId !== null ||
    filters.originId !== null ||
    (filters.priceMin !== null && filters.priceMin > priceBounds.min) ||
    (filters.priceMax !== null && filters.priceMax < priceBounds.max);

  const filteredProducts = useMemo(() => {
    let result = products;

    if (deferredSearch.trim()) {
      const q = normalizeSearch(deferredSearch);
      result = result.filter((p) => {
        const licenseName = p.associatedLicenseId
          ? (licenses.find((l) => l.id === p.associatedLicenseId)?.name ?? "")
          : "";
        const compatName = compatNameMap.get(p.compatibilityId) ?? "";
        const haystack = normalizeSearch(
          [
            p.name,
            p.shortDescription,
            p.internalCode,
            p.designerName ?? "",
            licenseName,
            compatName,
          ].join(" ")
        );
        return haystack.includes(q);
      });
    }

    if (filters.categoryId) {
      result = result.filter((p) => p.categoryId === filters.categoryId);
    }

    if (filters.typeId) {
      result = result.filter((p) => p.typeId === filters.typeId);
    }

    if (filters.compatibilityId) {
      result = result.filter(
        (p) => p.compatibilityId === filters.compatibilityId
      );
    }

    if (filters.collectionId) {
      result = result.filter((p) => p.collectionId === filters.collectionId);
    }

    if (filters.originId) {
      result = result.filter(
        (p) => resolveOrigin(p, licenses) === filters.originId
      );
    }

    if (filters.priceMin !== null) {
      result = result.filter((p) => p.price >= filters.priceMin!);
    }

    if (filters.priceMax !== null) {
      result = result.filter((p) => p.price <= filters.priceMax!);
    }

    return result;
  }, [products, deferredSearch, filters, licenses, compatNameMap]);

  // Effective base price used by cards initially (first variant price)
  const effectivePrice = useCallback((p: Product): number => {
    const firstVariant = p.variants?.[0];
    return firstVariant?.price ?? p.price;
  }, []);

  const sortedProducts = useMemo(() => {
    const result = [...filteredProducts];
    switch (sort) {
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name, "es"));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name, "es"));
        break;
      case "price-asc":
        result.sort((a, b) => effectivePrice(a) - effectivePrice(b));
        break;
      case "price-desc":
        result.sort((a, b) => effectivePrice(b) - effectivePrice(a));
        break;
      default:
        break; // keep catalog order
    }
    return result;
  }, [filteredProducts, sort, effectivePrice]);

  return {
    filters,
    sort,
    setSort,
    priceBounds,
    deferredSearch,
    originOptions,
    availableCategories,
    availableTypes,
    availableCompatibilities,
    availableCollections,
    setSearch,
    setCategoryId,
    setTypeId,
    setCompatibilityId,
    setCollectionId,
    setOriginId,
    setPriceRange,
    clearFilters,
    hasActiveFilters,
    filteredProducts: sortedProducts,
  };
}
