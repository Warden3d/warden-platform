"use client";

import {
  createContext,
  useContext,
  useCallback,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type { SelectionItem, EntityType, ProductConfigurationItem } from "@/types/warden";

export type { SelectionItem, EntityType, ProductConfigurationItem };

interface SelectionContextValue {
  items: SelectionItem[];
  addItem: (item: Omit<SelectionItem, "id">) => void;
  removeItem: (entityId: string, entityType: EntityType, configuration?: ProductConfigurationItem[]) => void;
  updateQuantity: (entityId: string, entityType: EntityType, quantity: number, configuration?: ProductConfigurationItem[]) => void;
  isSelected: (entityId: string, entityType: EntityType, configuration?: ProductConfigurationItem[]) => boolean;
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

// Stable empty snapshot for SSR — useSyncExternalStore requires a stable
// reference from getServerSnapshot(); a fresh `[]` on each call can cause
// repeated re-renders ("should be cached to avoid an infinite loop").
const EMPTY_SELECTION: SelectionItem[] = [];

function getServerSnapshot(): SelectionItem[] {
  return EMPTY_SELECTION;
}

/**
 * Deterministic configuration comparison.
 * Two configurations are equal when they have the same capabilityId + optionId
 * pairs regardless of array order.
 */
function configsEqual(
  a?: ProductConfigurationItem[],
  b?: ProductConfigurationItem[],
): boolean {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort((x, y) => x.capabilityId.localeCompare(y.capabilityId));
  const sortedB = [...b].sort((x, y) => x.capabilityId.localeCompare(y.capabilityId));

  return sortedA.every(
    (item, i) =>
      item.capabilityId === sortedB[i].capabilityId &&
      item.optionId === sortedB[i].optionId,
  );
}

function itemMatch(
  a: SelectionItem,
  b: {
    entityId: string;
    entityType: EntityType;
    configuration?: ProductConfigurationItem[];
  },
) {
  return (
    a.entityId === b.entityId &&
    a.entityType === b.entityType &&
    configsEqual(a.configuration, b.configuration)
  );
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
          : i,
      );
    } else {
      cachedItems = [...current, { ...item, id }];
    }
    saveToStorage(cachedItems);
    emitChange();
  }, []);

  const removeItem = useCallback(
    (entityId: string, entityType: EntityType, configuration?: ProductConfigurationItem[]) => {
      cachedItems = getSnapshot().filter(
        (i) => !itemMatch(i, { entityId, entityType, configuration }),
      );
      saveToStorage(cachedItems);
      emitChange();
    },
    [],
  );

  const updateQuantity = useCallback(
    (entityId: string, entityType: EntityType, quantity: number, configuration?: ProductConfigurationItem[]) => {
      const current = getSnapshot();
      if (quantity <= 0) {
        cachedItems = current.filter(
          (i) => !itemMatch(i, { entityId, entityType, configuration }),
        );
      } else {
        cachedItems = current.map((i) =>
          itemMatch(i, { entityId, entityType, configuration })
            ? { ...i, quantity }
            : i,
        );
      }
      saveToStorage(cachedItems);
      emitChange();
    },
    [],
  );

  const isSelected = useCallback(
    (entityId: string, entityType: EntityType, configuration?: ProductConfigurationItem[]) =>
      items.some((i) => itemMatch(i, { entityId, entityType, configuration })),
    [items],
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