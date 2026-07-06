"use client";

import { useMemo, useState, useCallback, useDeferredValue } from "react";
import type { Product } from "@/types/warden";

export interface CatalogFilters {
  search: string;
  categoryId: string | null;
  typeId: string | null;
  compatibilityId: string | null;
  collectionId: string | null;
}

const EMPTY_FILTERS: CatalogFilters = {
  search: "",
  categoryId: null,
  typeId: null,
  compatibilityId: null,
  collectionId: null,
};

export function useCatalogFilters(
  products: Product[],
  initialFilters?: Partial<CatalogFilters>
) {
  const [filters, setFilters] = useState<CatalogFilters>({
    ...EMPTY_FILTERS,
    ...initialFilters,
  });

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

  const clearFilters = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS, ...initialFilters });
  }, [initialFilters]);

  const hasActiveFilters =
    deferredSearch.length > 0 ||
    filters.categoryId !== null ||
    filters.typeId !== null ||
    filters.compatibilityId !== null ||
    filters.collectionId !== null;

  const filteredProducts = useMemo(() => {
    let result = products;

    if (deferredSearch.trim()) {
      const q = deferredSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.internalCode.toLowerCase().includes(q)
      );
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

    return result;
  }, [products, deferredSearch, filters]);

  return {
    filters,
    deferredSearch,
    setSearch,
    setCategoryId,
    setTypeId,
    setCompatibilityId,
    setCollectionId,
    clearFilters,
    hasActiveFilters,
    filteredProducts,
  };
}