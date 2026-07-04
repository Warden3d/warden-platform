// ============================================================================
// WARDEN Data Access Layer
// ============================================================================
// Hybrid layer: uses Supabase when configured, falls back to local mock data.
// All functions return the same types as @/data/warden-catalog.ts
// ============================================================================

import type {
  Product,
  Collection,
  Category,
  CompatibilitySystem,
  License,
  ProductImage,
  ProductSpec,
  Bundle,
  Drop,
  ProductType,
} from "@/types/warden";

// ── Mock data (fallback) — read from mutable in-memory store ─────────────────
import {
  getProducts as getStoreProducts,
  getCollections as getStoreCollections,
  getCategories as getStoreCategories,
  getCompatibilitySystems as getStoreCompatibilitySystems,
  getProductTypes as getStoreProductTypes,
  getLicenses as getStoreLicenses,
  getBundles as getStoreBundles,
  getDrops as getStoreDrops,
} from "@/lib/data/store";

// ── Supabase row types (snake_case DB columns) ──────────────────────────────

interface ProductRow {
  id: string;
  slug: string;
  name: string;
  short_description: string;
  description: string;
  collection_id: string | null;
  category_id: string | null;
  type_id: string | null;
  compatibility_id: string | null;
  scale: string;
  material: string;
  height: number;
  width: number;
  depth: number;
  price: number;
  game_features: string[];
  status: "active" | "hidden" | "retired";
  featured: boolean;
  internal_code: string;
  associated_license_id: string | null;
  weight: number;
  volume: number;
  print_time: number;
  version: string;
  related_product_ids: string[];
  related_bundle_ids: string[];
  related_drop_ids: string[];
  created_at: string;
  updated_at: string;
}

interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
  view_type: string;
}

interface ProductSpecRow {
  id: string;
  product_id: string;
  spec_key: string;
  spec_value: string;
  sort_order: number;
}

interface CollectionRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnail_url: string;
}

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  description: string;
}

interface CompatibilitySystemRow {
  id: string;
  slug: string;
  name: string;
  description: string;
}

interface LicenseRow {
  id: string;
  name: string;
  description: string;
  website: string | null;
  logo_url: string | null;
}

interface BundleRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  theme: string | null;
  price: number;
  discount_label: string | null;
  status: "active" | "hidden" | "retired";
  featured: boolean;
}

interface BundleItemRow {
  id: string;
  bundle_id: string;
  product_id: string;
}

interface BundleImageRow {
  id: string;
  bundle_id: string;
  url: string;
  alt: string;
  is_primary: boolean;
  sort_order: number;
  view_type: string;
}

interface DropRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  theme: string | null;
  starts_at: string;
  ends_at: string | null;
  status: "upcoming" | "live" | "ended";
  thumbnail_url: string;
}

interface DropItemRow {
  id: string;
  drop_id: string;
  product_id: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

function mapProductRow(
  row: ProductRow,
  images: ProductImage[],
  specs: ProductSpec[]
): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description,
    description: row.description,
    collectionId: row.collection_id ?? "",
    categoryId: row.category_id ?? "",
    typeId: row.type_id ?? "",
    compatibilityId: row.compatibility_id ?? "",
    scale: row.scale,
    material: row.material,
    dimensions: {
      height: row.height,
      width: row.width,
      depth: row.depth,
    },
    price: row.price,
    gameFeatures: row.game_features ?? [],
    images,
    status: row.status,
    featured: row.featured,
    internalCode: row.internal_code,
    associatedLicenseId: row.associated_license_id,
    weight: row.weight,
    volume: row.volume,
    printTime: row.print_time,
    version: row.version,
    relatedProductIds: row.related_product_ids ?? [],
    relatedBundleIds: row.related_bundle_ids ?? [],
    relatedDropIds: row.related_drop_ids ?? [],
    specs,
  };
}

function mapImageRow(row: ProductImageRow): ProductImage {
  return {
    id: row.id,
    productId: row.product_id,
    url: row.url,
    alt: row.alt,
    isPrimary: row.is_primary,
    sortOrder: row.sort_order,
    viewType: (row.view_type ?? "main") as ProductImage["viewType"],
  };
}

function mapSpecRow(row: ProductSpecRow): ProductSpec {
  return {
    id: row.id,
    productId: row.product_id,
    specKey: row.spec_key,
    specValue: row.spec_value,
    sortOrder: row.sort_order,
  };
}

function mapCollectionRow(row: CollectionRow): Collection {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    thumbnailUrl: row.thumbnail_url,
  };
}

function mapCategoryRow(row: CategoryRow): Category {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
  };
}

function mapCompatibilitySystemRow(row: CompatibilitySystemRow): CompatibilitySystem {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
  };
}

function mapLicenseRow(row: LicenseRow): License {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    website: row.website ?? undefined,
    logoUrl: row.logo_url ?? undefined,
  };
}

function mapBundleRow(
  row: BundleRow,
  images: ProductImage[],
  productIds: string[]
): Bundle {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    theme: row.theme,
    price: row.price,
    discountLabel: row.discount_label,
    productIds,
    images,
    status: row.status,
    featured: row.featured,
  };
}

function mapDropRow(row: DropRow, productIds: string[]): Drop {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    description: row.description,
    theme: row.theme,
    startsAt: row.starts_at,
    endsAt: row.ends_at,
    status: row.status,
    thumbnailUrl: row.thumbnail_url,
    productIds,
  };
}

// ── Internal: load all products with images & specs from Supabase ──────────

async function loadProductsFromSupabase(
  filter?: {
    status?: string;
    featured?: boolean;
    ids?: string[];
    collectionId?: string;
    categoryId?: string;
  }
): Promise<Product[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase.from("products").select("*");

  if (filter?.status) {
    query = query.eq("status", filter.status);
  }
  if (filter?.featured !== undefined) {
    query = query.eq("featured", filter.featured);
  }
  if (filter?.ids && filter.ids.length > 0) {
    query = query.in("id", filter.ids);
  }
  if (filter?.collectionId) {
    query = query.eq("collection_id", filter.collectionId);
  }
  if (filter?.categoryId) {
    query = query.eq("category_id", filter.categoryId);
  }

  const { data: rows, error } = await query;

  if (error || !rows) {
    console.error("Supabase products query error:", error);
    return [];
  }

  const productRows = rows as ProductRow[];
  const productIds = productRows.map((r) => r.id);

  // Fetch images in parallel
  const [imagesRes, specsRes] = await Promise.all([
    supabase.from("product_images").select("*").in("product_id", productIds).order("sort_order"),
    supabase.from("product_specs").select("*").in("product_id", productIds).order("sort_order"),
  ]);

  const imageRows = (imagesRes.data ?? []) as ProductImageRow[];
  const specRows = (specsRes.data ?? []) as ProductSpecRow[];

  const imagesByProduct = new Map<string, ProductImage[]>();
  for (const img of imageRows) {
    const list = imagesByProduct.get(img.product_id) ?? [];
    list.push(mapImageRow(img));
    imagesByProduct.set(img.product_id, list);
  }

  const specsByProduct = new Map<string, ProductSpec[]>();
  for (const spec of specRows) {
    const list = specsByProduct.get(spec.product_id) ?? [];
    list.push(mapSpecRow(spec));
    specsByProduct.set(spec.product_id, list);
  }

  return productRows.map((row) =>
    mapProductRow(
      row,
      imagesByProduct.get(row.id) ?? [],
      specsByProduct.get(row.id) ?? []
    )
  );
}

// ── Internal: load all bundles from Supabase ──────────────────────────────

async function loadBundlesFromSupabase(
  filter?: { status?: string; featured?: boolean }
): Promise<Bundle[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  let query = supabase.from("bundles").select("*");

  if (filter?.status) {
    query = query.eq("status", filter.status);
  }
  if (filter?.featured !== undefined) {
    query = query.eq("featured", filter.featured);
  }

  const { data: bundleRows, error } = await query;
  if (error || !bundleRows) {
    console.error("Supabase bundles query error:", error);
    return [];
  }

  const bundles = bundleRows as BundleRow[];
  const bundleIds = bundles.map((b) => b.id);

  // Fetch bundle_items and bundle_images in parallel
  const [itemsRes, imagesRes] = await Promise.all([
    supabase.from("bundle_items").select("*").in("bundle_id", bundleIds).order("sort_order"),
    supabase.from("bundle_images").select("*").in("bundle_id", bundleIds).order("sort_order"),
  ]);

  const itemRows = (itemsRes.data ?? []) as BundleItemRow[];
  const imageRows = (imagesRes.data ?? []) as BundleImageRow[];

  const productIdsByBundle = new Map<string, string[]>();
  for (const item of itemRows) {
    const list = productIdsByBundle.get(item.bundle_id) ?? [];
    list.push(item.product_id);
    productIdsByBundle.set(item.bundle_id, list);
  }

  const imagesByBundle = new Map<string, ProductImage[]>();
  for (const img of imageRows) {
    const list = imagesByBundle.get(img.bundle_id) ?? [];
    list.push({
      id: img.id,
      productId: img.bundle_id,
      url: img.url,
      alt: img.alt,
      isPrimary: img.is_primary,
      sortOrder: img.sort_order,
      viewType: (img.view_type ?? "main") as ProductImage["viewType"],
    });
    imagesByBundle.set(img.bundle_id, list);
  }

  return bundles.map((row) =>
    mapBundleRow(
      row,
      imagesByBundle.get(row.id) ?? [],
      productIdsByBundle.get(row.id) ?? []
    )
  );
}

// ── Internal: load all drops from Supabase ─────────────────────────────────

async function loadDropsFromSupabase(): Promise<Drop[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: dropRows, error } = await supabase
    .from("drops")
    .select("*")
    .order("starts_at", { ascending: true });

  if (error || !dropRows) {
    console.error("Supabase drops query error:", error);
    return [];
  }

  const drops = dropRows as DropRow[];
  const dropIds = drops.map((d) => d.id);

  const { data: itemRows } = await supabase
    .from("drop_items")
    .select("*")
    .in("drop_id", dropIds)
    .order("sort_order");

  const items = (itemRows ?? []) as DropItemRow[];

  const productIdsByDrop = new Map<string, string[]>();
  for (const item of items) {
    const list = productIdsByDrop.get(item.drop_id) ?? [];
    list.push(item.product_id);
    productIdsByDrop.set(item.drop_id, list);
  }

  return drops.map((row) =>
    mapDropRow(row, productIdsByDrop.get(row.id) ?? [])
  );
}

// ── Internal: load reference data from Supabase ───────────────────────────

async function loadCollectionsFromSupabase(): Promise<Collection[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("collections").select("*");
  if (error || !data) return [];
  return (data as CollectionRow[]).map(mapCollectionRow);
}

async function loadCategoriesFromSupabase(): Promise<Category[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("categories").select("*");
  if (error || !data) return [];
  return (data as CategoryRow[]).map(mapCategoryRow);
}

async function loadCompatibilitySystemsFromSupabase(): Promise<CompatibilitySystem[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("compatibility_systems").select("*");
  if (error || !data) return [];
  return (data as CompatibilitySystemRow[]).map(mapCompatibilitySystemRow);
}

async function loadLicensesFromSupabase(): Promise<License[]> {
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("licenses").select("*");
  if (error || !data) return [];
  return (data as LicenseRow[]).map(mapLicenseRow);
}

// ============================================================================
// PUBLIC API — mirror of @/data/warden-catalog.ts helpers
// ============================================================================

export async function getCollections(): Promise<Collection[]> {
  if (!isSupabaseConfigured()) return getStoreCollections();
  return loadCollectionsFromSupabase();
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return getStoreCategories();
  return loadCategoriesFromSupabase();
}

export async function getProductTypes(): Promise<ProductType[]> {
  if (!isSupabaseConfigured()) return getStoreProductTypes();
  // TODO: fetch from Supabase
  return getStoreProductTypes();
}

export async function getCompatibilitySystems(): Promise<CompatibilitySystem[]> {
  if (!isSupabaseConfigured()) return getStoreCompatibilitySystems();
  return loadCompatibilitySystemsFromSupabase();
}

export async function getLicenses(): Promise<License[]> {
  if (!isSupabaseConfigured()) return getStoreLicenses();
  return loadLicensesFromSupabase();
}

export async function getProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return getStoreProducts();
  return loadProductsFromSupabase();
}

export async function getActiveProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured())     return getStoreProducts().filter((p) => p.status === "active");
  return loadProductsFromSupabase({ status: "active" });
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured())
    return getStoreProducts().find((p) => p.slug === slug);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !row) return undefined;

  const productRow = row as ProductRow;

  // Fetch images + specs for this single product
  const [imagesRes, specsRes] = await Promise.all([
    supabase.from("product_images").select("*").eq("product_id", productRow.id).order("sort_order"),
    supabase.from("product_specs").select("*").eq("product_id", productRow.id).order("sort_order"),
  ]);

  const images = ((imagesRes.data ?? []) as ProductImageRow[]).map(mapImageRow);
  const specs = ((specsRes.data ?? []) as ProductSpecRow[]).map(mapSpecRow);

  return mapProductRow(productRow, images, specs);
}

export async function getProductsByCollection(
  collectionSlug: string
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const col = getStoreCollections().find((c) => c.slug === collectionSlug);
    if (!col) return [];
    return getStoreProducts().filter((p) => p.collectionId === col.id);
  }

  const collections = await loadCollectionsFromSupabase();
  const col = collections.find((c) => c.slug === collectionSlug);
  if (!col) return [];
  return loadProductsFromSupabase({ collectionId: col.id });
}

export async function getProductsByCategory(
  categorySlug: string
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    const cat = getStoreCategories().find((c) => c.slug === categorySlug);
    if (!cat) return [];
    return getStoreProducts().filter((p) => p.categoryId === cat.id);
  }

  const cats = await loadCategoriesFromSupabase();
  const cat = cats.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return loadProductsFromSupabase({ categoryId: cat.id });
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured())
    return getStoreProducts().filter((p) => p.featured && p.status === "active");

  return loadProductsFromSupabase({ featured: true, status: "active" });
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (!isSupabaseConfigured())
    return getStoreProducts().filter((p) => ids.includes(p.id) && p.status === "active");

  if (ids.length === 0) return [];
  return loadProductsFromSupabase({ ids, status: "active" });
}

export async function getBundles(): Promise<Bundle[]> {
  if (!isSupabaseConfigured()) return getStoreBundles();
  return loadBundlesFromSupabase();
}

export async function getActiveBundles(): Promise<Bundle[]> {
  if (!isSupabaseConfigured())
    return getStoreBundles().filter((b) => b.status === "active");

  return loadBundlesFromSupabase({ status: "active" });
}

export async function getBundleBySlug(slug: string): Promise<Bundle | undefined> {
  if (!isSupabaseConfigured())
    return getStoreBundles().find((b) => b.slug === slug);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("bundles")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !row) return undefined;

  const bundleRow = row as BundleRow;

  const [itemsRes, imagesRes] = await Promise.all([
    supabase.from("bundle_items").select("*").eq("bundle_id", bundleRow.id).order("sort_order"),
    supabase.from("bundle_images").select("*").eq("bundle_id", bundleRow.id).order("sort_order"),
  ]);

  const productIds = ((itemsRes.data ?? []) as BundleItemRow[]).map(
    (i) => i.product_id
  );
  const images = ((imagesRes.data ?? []) as BundleImageRow[]).map((img) => ({
    id: img.id,
    productId: img.bundle_id,
    url: img.url,
    alt: img.alt,
    isPrimary: img.is_primary,
    sortOrder: img.sort_order,
    viewType: (img.view_type ?? "main") as ProductImage["viewType"],
  }));

  return mapBundleRow(bundleRow, images, productIds);
}

export async function getDrops(): Promise<Drop[]> {
  if (!isSupabaseConfigured()) return getStoreDrops();
  return loadDropsFromSupabase();
}

export async function getActiveDrops(): Promise<Drop[]> {
  if (!isSupabaseConfigured())
    return getStoreDrops().filter((d) => d.status === "live");

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: rows, error } = await supabase
    .from("drops")
    .select("*")
    .eq("status", "live")
    .order("starts_at", { ascending: true });

  if (error || !rows) return [];

  const drops = rows as DropRow[];
  const dropIds = drops.map((d) => d.id);

  const { data: itemRows } = await supabase
    .from("drop_items")
    .select("*")
    .in("drop_id", dropIds)
    .order("sort_order");

  const items = (itemRows ?? []) as DropItemRow[];
  const productIdsByDrop = new Map<string, string[]>();
  for (const item of items) {
    const list = productIdsByDrop.get(item.drop_id) ?? [];
    list.push(item.product_id);
    productIdsByDrop.set(item.drop_id, list);
  }

  return drops.map((row) =>
    mapDropRow(row, productIdsByDrop.get(row.id) ?? [])
  );
}

export async function getDropBySlug(slug: string): Promise<Drop | undefined> {
  if (!isSupabaseConfigured())
    return getStoreDrops().find((d) => d.slug === slug);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { data: row, error } = await supabase
    .from("drops")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !row) return undefined;

  const dropRow = row as DropRow;

  const { data: itemRows } = await supabase
    .from("drop_items")
    .select("*")
    .eq("drop_id", dropRow.id)
    .order("sort_order");

  const productIds = ((itemRows ?? []) as DropItemRow[]).map(
    (i) => i.product_id
  );

  return mapDropRow(dropRow, productIds);
}

// ============================================================================
// MUTATIONS — insert into request tables
// ============================================================================

export interface SelectionRequestInput {
  name: string;
  email: string;
  country: string;
  queryType: string;
  message: string;
  selections: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export async function createSelectionRequest(
  data: SelectionRequestInput
): Promise<boolean> {
  if (!isSupabaseConfigured()) {
    // Fallback: no-op but return success so UI behaves the same
    return true;
  }

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.from("selection_requests").insert({
    name: data.name,
    email: data.email,
    country: data.country,
    query_type: data.queryType,
    message: data.message,
    selections: data.selections,
  });

  if (error) {
    console.error("Supabase insert selection_request error:", error);
    return false;
  }
  return true;
}

export interface ContactRequestInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function createContactRequest(
  data: ContactRequestInput
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.from("contact_requests").insert({
    name: data.name,
    email: data.email,
    subject: data.subject,
    message: data.message,
  });

  if (error) {
    console.error("Supabase insert contact_request error:", error);
    return false;
  }
  return true;
}

export interface CommunitySupportRequestInput {
  entityType: string;
  entityName: string;
  contactName: string;
  email: string;
  description: string;
  supportTypes: string[];
  details: string;
  acceptedTerms: boolean;
}

export async function createCommunitySupportRequest(
  data: CommunitySupportRequestInput
): Promise<boolean> {
  if (!isSupabaseConfigured()) return true;

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();

  const { error } = await supabase.from("community_support_requests").insert({
    entity_type: data.entityType,
    entity_name: data.entityName,
    contact_name: data.contactName,
    email: data.email,
    description: data.description,
    support_types: data.supportTypes,
    details: data.details,
    accepted_terms: data.acceptedTerms,
  });

  if (error) {
    console.error("Supabase insert community_support_request error:", error);
    return false;
  }
  return true;
}
