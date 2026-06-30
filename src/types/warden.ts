// ─────────────────────────────────────────────────
// Entity types for WARDEN catalog
// ─────────────────────────────────────────────────

// ─── Status & constants ──────────────────────────

export const PRODUCT_STATUSES = ["active", "hidden", "retired"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const DROP_STATUSES = ["upcoming", "live", "ended"] as const;
export type DropStatus = (typeof DROP_STATUSES)[number];

// ─── Collection ──────────────────────────────────

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string;
}

// ─── Category ────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
}

// ─── CompatibilitySystem ─────────────────────────

export interface CompatibilitySystem {
  id: string;
  slug: string;
  name: string;
  description: string;
}

// ─── License ─────────────────────────────────────

export interface License {
  id: string;
  name: string;
  description: string;
  website?: string;
  logoUrl?: string;
}

// ─── ProductImage ────────────────────────────────

export const IMAGE_VIEW_TYPES = [
  "main",
  "left",
  "right",
  "top",
  "rear",
  "contextual",
  "other",
] as const;
export type ImageViewType = (typeof IMAGE_VIEW_TYPES)[number];

export const IMAGE_VIEW_LABELS: Record<ImageViewType, string> = {
  main: "Principal",
  left: "Izquierda",
  right: "Derecha",
  top: "Superior",
  rear: "Trasera",
  contextual: "Contextual",
  other: "Otra",
};

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  viewType: ImageViewType;
}

// ─── Dimensions ──────────────────────────────────

export interface Dimensions {
  height: number;
  width: number;
  depth: number;
}

// ─── ProductSpecs ────────────────────────────────

export interface ProductSpec {
  id: string;
  productId: string;
  specKey: string;
  specValue: string;
  sortOrder: number;
}

// ─── ProductHighlight ────────────────────────────

export const PRODUCT_HIGHLIGHT_TYPES = [
  "scale",
  "material",
  "compatibility",
  "assembly",
  "printing",
  "terrain",
  "contents",
  "dimensions",
  "quality",
] as const;

export type ProductHighlightType = (typeof PRODUCT_HIGHLIGHT_TYPES)[number];

export interface ProductHighlight {
  type: ProductHighlightType;
  label: string;
}

// ─── Product ─────────────────────────────────────

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortDescription: string;
  description: string;
  collectionId: string;
  categoryId: string;
  compatibilityId: string;
  scale: string;
  material: string;
  dimensions: Dimensions;
  price: number;
  gameFeatures: string[];
  highlights?: ProductHighlight[];
  images: ProductImage[];
  status: ProductStatus;
  featured: boolean;

  internalCode: string;
  associatedLicenseId: string | null;
  designerName?: string;
  weight: number;
  volume: number;
  printTime: number;
  version: string;
  relatedProductIds: string[];
  relatedBundleIds: string[];
  relatedDropIds: string[];

  specs: ProductSpec[];
}

// ─── Bundle ──────────────────────────────────────

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  theme: string | null;
  price: number;
  discountLabel: string | null;
  productIds: string[];
  images: ProductImage[];
  status: ProductStatus;
  featured: boolean;
}

// ─── Drop ────────────────────────────────────────

export interface Drop {
  id: string;
  slug: string;
  name: string;
  description: string;
  theme: string | null;
  startsAt: string;
  endsAt: string | null;
  status: DropStatus;
  thumbnailUrl: string;
  productIds: string[];
}

// ─── SelectionItem ───────────────────────────────

export interface SelectionItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  productSlug?: string;
  productImage?: string;
}

// ─── SupportRequest ─────────────────────────────

export interface SupportRequest {
  id: string;
  name: string;
  email: string;
  orderNumber: string | null;
  subject: string;
  message: string;
  createdAt: string;
  status: "open" | "in-progress" | "resolved" | "closed";
}

// ─── ContactRequest ─────────────────────────────

export interface ContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

// ─── Shared UI types ─────────────────────────────

export type NavLink = {
  label: string;
  href: string;
  i18nKey?: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};
