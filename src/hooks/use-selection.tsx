"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { SelectionItem, EntityType } from "@/types/warden";

export type { SelectionItem, EntityType };

interface SelectionContextValue {
  items: SelectionItem[];
  addItem: (item: Omit<SelectionItem, "id">) => void;
  removeItem: (entityId: string, entityType: EntityType) => void;
  updateQuantity: (entityId: string, entityType: EntityType, quantity: number) => void;
  isSelected: (entityId: string, entityType: EntityType) => boolean;
  clearAll: () => void;
  itemCount: number;
}

const SelectionContext = createContext<SelectionContextValue | null>(null);

const STORAGE_KEY = "warden-selection";

let cachedItems: SelectionItem[] = [];
let listeners: (() => void)[] = [];
let isInitialized = false;
let idCounter = Date.now();

function initStorage() {
  if (isInitialized || typeof window === "undefined") return;
  isInitialized = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Migrate legacy items (old shape had productId instead of entityId)
        cachedItems = parsed.map((item: Record<string, unknown>) => {
          if ((item as Record<string, unknown>).productId && !(item as Record<string, unknown>).entityId) {
            return {
              id: ((item as Record<string, unknown>).id as string) ?? `legacy-${Date.now()}`,
              entityId: (item as Record<string, unknown>).productId as string,
              entityType: "product" as EntityType,
              name: (item as Record<string, unknown>).productName as string,
              quantity: (item as Record<string, unknown>).quantity as number,
              unitPrice: (item as Record<string, unknown>).unitPrice as number,
              slug: (item as Record<string, unknown>).productSlug as string | undefined,
              image: (item as Record<string, unknown>).productImage as string | undefined,
            } satisfies SelectionItem;
          }
          return item as unknown as SelectionItem;
        });
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

function itemMatch(a: SelectionItem, b: { entityId: string; entityType: EntityType }) {
  return a.entityId === b.entityId && a.entityType === b.entityType;
}

export function SelectionProvider({ children }: { children: ReactNode }) {
  const items = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const addItem = useCallback((item: Omit<SelectionItem, "id">) => {
    const current = getSnapshot();
    const id = `sel-${++idCounter}`;
    const existing = current.find((i) => itemMatch(i, item));
    if (existing) {
      cachedItems = current.map((i) =>
        itemMatch(i, item)
          ? { ...i, quantity: i.quantity + item.quantity }
          : i
      );
    } else {
      cachedItems = [...current, { ...item, id }];
    }
    saveToStorage(cachedItems);
    emitChange();
  }, []);

  const removeItem = useCallback(
    (entityId: string, entityType: EntityType) => {
      cachedItems = getSnapshot().filter(
        (i) => !itemMatch(i, { entityId, entityType })
      );
      saveToStorage(cachedItems);
      emitChange();
    },
    []
  );

  const updateQuantity = useCallback(
    (entityId: string, entityType: EntityType, quantity: number) => {
      const current = getSnapshot();
      if (quantity <= 0) {
        cachedItems = current.filter(
          (i) => !itemMatch(i, { entityId, entityType })
        );
      } else {
        cachedItems = current.map((i) =>
          itemMatch(i, { entityId, entityType }) ? { ...i, quantity } : i
        );
      }
      saveToStorage(cachedItems);
      emitChange();
    },
    []
  );

  const isSelected = useCallback(
    (entityId: string, entityType: EntityType) =>
      items.some((i) => itemMatch(i, { entityId, entityType })),
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