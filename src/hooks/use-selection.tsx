"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export interface SelectionItem {
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  productSlug?: string;
  productImage?: string;
  configKey?: string;
  configLabel?: string;
}

interface SelectionContextValue {
  items: SelectionItem[];
  addItem: (item: SelectionItem) => void;
  removeItem: (productId: string, configKey?: string) => void;
  updateQuantity: (productId: string, quantity: number, configKey?: string) => void;
  isSelected: (productId: string, configKey?: string) => boolean;
  clearAll: () => void;
  itemCount: number;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const STORAGE_KEY = "warden-selection";

let cachedItems: SelectionItem[] = [];
let listeners: (() => void)[] = [];
let isInitialized = false;

function initStorage() {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cachedItems = parsed;
      }
    }
  } catch {
    // ignore corrupt data
  }
}

function saveToStorage(items: SelectionItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Storage full or unavailable
  }
}

function emitChange() {
  for (const listener of listeners) {
    listener();
  }
}

function subscribe(callback: () => void) {
  initStorage();
  listeners = [...listeners, callback];
  return () => {
    listeners = listeners.filter((l) => l !== callback);
  };
}

function getSnapshot(): SelectionItem[] {
  return cachedItems;
}

function getServerSnapshot(): SelectionItem[] {
  return [];
}

/** Build a composite key from productId + optional configKey */
function itemMatch(a: SelectionItem, b: { productId: string; configKey?: string }) {
  return a.productId === b.productId && (a.configKey ?? "") === (b.configKey ?? "");
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: SelectionItem) => {
    const current = getSnapshot();
    const existing = current.find((i) => itemMatch(i, item));
    if (existing) {
      cachedItems = current.map((i) =>
        itemMatch(i, item)
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      cachedItems = [...current, item];
    }
    saveToStorage(cachedItems);
    emitChange();
  }, []);

  const removeItem = useCallback(
    (productId: string, configKey?: string) => {
      cachedItems = getSnapshot().filter(
        (i) => !itemMatch(i, { productId, configKey })
      );
      saveToStorage(cachedItems);
      emitChange();
    },
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number, configKey?: string) => {
      const current = getSnapshot();
      if (quantity <= 0) {
        cachedItems = current.filter(
          (i) => !itemMatch(i, { productId, configKey })
        );
      } else {
        cachedItems = current.map((i) =>
          itemMatch(i, { productId, configKey }) ? { ...i, quantity } : i
        );
      }
      saveToStorage(cachedItems);
      emitChange();
    },
    []
  );

  const isSelected = useCallback(
    (productId: string, configKey?: string) =>
      items.some((i) => itemMatch(i, { productId, configKey })),
    [items]
  );

  const clearAll = useCallback(() => {
    cachedItems = [];
    saveToStorage(cachedItems);
    emitChange();
  }, []);

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <SelectionContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, isSelected, clearAll, itemCount }}
    >
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelection() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error("useSelection must be used inside <SelectionProvider>");
  }
  return ctx;
}
