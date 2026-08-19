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
// Canonical model for all product specifications.
// Every view (PDP, Product Card, Bundles, Drops, API)
// reads from this single source and filters by `visibility`.

export interface ProductSpec {
  id: string;
  productId: string;
  key: string;               // semantic identifier, e.g. "content", "material"
  label: string;             // human-readable label, e.g. "Contenido", "Material"
  value: string;             // display value, e.g. "12 marcadores", "Latón macizo"
  visibility: SpecVisibility[];  // where this spec appears
  sortOrder: number;
}

export type SpecVisibility = "card" | "pdp" | "contents" | "bundle" | "drop" | "api";

// ─── Request Types (WARDEN Web V1 contract) ──────

export const REQUEST_STATUSES = ["received", "in_review", "quoted", "closed"] as const;
export type RequestStatus = (typeof REQUEST_STATUSES)[number];

export const EMAIL_STATUSES = ["pending", "sent", "failed"] as const;
export type EmailStatus = (typeof EMAIL_STATUSES)[number];

export type ShippingStatus =
  | "pending_calculation"
  | "calculated"
  | "free"
  | "not_applicable";

export interface RequestClient {
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  postalCode: string;
  city: string;
  phone?: string;
  company?: string;
  region?: string;
  /** Client's free-text notes / observations */
  notes?: string;
}

export interface RequestLine {
  entityId: string;
  entityType: EntityType;
  name: string;
  /** Internal SKU / reference code from the entity */
  sku: string;
  quantity: number;
  configuration?: ProductConfigurationItem[];
  /** Unit price at submission time */
  unitPrice: number;
  /** unitPrice × quantity */
  lineSubtotal: number;
  slug?: string;
  image?: string;
}

export interface Request {
  // ── Identification ──
  /** DB id — assigned by Supabase on insert */
  id?: string;
  /** Human-readable reference: WDN-YYYY-NNNNNN — null until sequence generated */
  reference: string | null;

  // ── General data ──
  /** Server-generated ISO timestamp */
  createdAt: string;
  /** Locale at submission time (e.g. "es", "en") */
  locale: string;
  /** Currency — always "EUR" for V1 */
  currency: string;
  /** Current status — starts at "received" */
  status: RequestStatus;

  // ── Client ──
  client: RequestClient;

  // ── Lines ──
  lines: RequestLine[];

  // ── Financial ──
  /** Sum of all lineSubtotal */
  productSubtotal: number;
  /** Shipping: pending until calculated */
  shippingStatus: ShippingStatus;
  /** null = pending / not yet calculated; number when resolved */
  shippingCost: number | null;

  // ── Email tracking ──
  customerEmailStatus: EmailStatus;
  internalEmailStatus: EmailStatus;
  emailSendAttempts: number;

  // ── Internal management ──
  /** Server-side update timestamp */
  updatedAt: string;
  /** Internal notes — never exposed to client */
  internalNotes?: string;
  /** Future link to a quote/presupuesto */
  quoteReference: string | null;
  /** Future ERPNext integration reference */
  erpnextReference: string | null;
}

// ─── ProductType ─────────────────────────────────

export interface ProductType {
  id: string;
  categoryId: string;
  name: string;
}

// ─── ProductVariant ──────────────────────────────

export interface ProductVariant {
  name: string;
  price: number;
  swatchColor?: string;
  imageIndices?: number[];
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
  typeId: string;
  compatibilityId: string;
  scale: string;
  material: string;
  dimensions: Dimensions;
  price: number;
  gameFeatures: string[];
  variants?: ProductVariant[];
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
  specs: ProductSpec[];
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

export type EntityType = "product" | "bundle" | "drop";

/**
 * A single capability selection (e.g. finish=color).
 * Generic — works with present and future capabilities.
 */
export interface ProductConfigurationItem {
  /** Stable capability identifier, e.g. "finish" */
  capabilityId: string;
  /** Stable option identifier, e.g. "color", "monocromo" */
  optionId: string;
  /** Human-readable label for display, e.g. "Color", "Monocromo" */
  label: string;
}

export interface SelectionItem {
  id: string;
  entityId: string;
  entityType: EntityType;
  name: string;
  quantity: number;
  unitPrice: number;
  slug?: string;
  image?: string;
  /**
   * Generic configuration array.
   * Undefined = legacy item (pre-R036B).
   * Empty array = explicitly no configuration.
   */
  configuration?: ProductConfigurationItem[];
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
