"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { ProductVariant } from "@/types/warden";

// ── Context value ──

interface ProductConfigContextValue {
  variants: ProductVariant[];
  selectedIdx: number;
  selectedVariant: ProductVariant | null;
  selectVariant: (idx: number) => void;
}

const ProductConfigContext =
  createContext<ProductConfigContextValue | null>(null);

// ── Provider ──

export function ProductConfigProvider({
  variants,
  children,
}: {
  variants: ProductVariant[];
  children: ReactNode;
}) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const selectedVariant = variants[selectedIdx] ?? null;

  const selectVariant = useCallback((idx: number) => {
    setSelectedIdx(idx);
  }, []);

  return (
    <ProductConfigContext.Provider
      value={{ variants, selectedIdx, selectedVariant, selectVariant }}
    >
      {children}
    </ProductConfigContext.Provider>
  );
}

// ── Hook ──

export function useProductConfig() {
  const ctx = useContext(ProductConfigContext);
  if (!ctx)
    throw new Error("useProductConfig must be used inside <ProductConfigProvider>");
  return ctx;
}
