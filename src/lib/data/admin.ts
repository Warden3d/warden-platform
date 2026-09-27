/**
 * WARDEN Admin Data Layer
 *
 * Admin-only data operations.
 * Uses Supabase when configured, falls back to in-memory store.
 * Never exposes internal fields to public API.
 */

import type {
  Product,
  ProductImage,
  ProductSpec,
} from "@/types/warden";
import {
  getProducts as getStoreProducts,
  getProductById as getStoreProductById,
  createProduct as createStoreProduct,
  updateProduct as updateStoreProduct,
  deleteProduct as deleteStoreProduct,
  updateProductStatus as updateStoreProductStatus,
  getContactRequests as getStoreContactRequests,
  getCommunitySupportRequests as getStoreCommunitySupportRequests,
  getCollections as getStoreCollections,
  getCategories as getStoreCategories,
  getCompatibilitySystems as getStoreCompatibilitySystems,
  getLicenses as getStoreLicenses,
} from "./store";

import { requireAdmin } from "@/lib/auth";
import { demoQuoteRequests } from "@/data/demo-quote-requests";
import { mapRequestRecord, type RequestRecord } from "./request-records";

// ── Helpers ─────────────────────────────────────────────────────────────

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

// ── Products: Read ─────────────────────────────────────────────────────

export async function getAllProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return getStoreProducts();

  // Supabase: load ALL products regardless of status
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").order("name");
  if (error || !data) return [];
  return data as unknown as Product[];
}

export async function getAdminProductById(id: string): Promise<Product | undefined> {
  if (!isSupabaseConfigured()) return getStoreProductById(id);

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
  if (error || !data) return undefined;
  return data as unknown as Product;
}

// ── Products: Mutations ───────────────────────────────────────────────

export type CreateProductInput = Omit<Product, "id" | "images" | "specs"> & {
  images?: Omit<ProductImage, "id" | "productId">[];
  specs?: Omit<ProductSpec, "id" | "productId">[];
};

export async function createProduct(data: CreateProductInput): Promise<Product | null> {
  if (!isSupabaseConfigured()) return createStoreProduct(data);

  // Supabase: insert product + images + specs in a transaction
  // TODO: Implement Supabase transaction for product creation
  // See docs/WARDEN_IMPLEMENTATION_PLAN.md Phase 5
  console.warn("Supabase product creation not yet implemented. Using store fallback.");
  return createStoreProduct(data);
}

export type UpdateProductInput = Partial<Omit<Product, "id" | "images" | "specs">> & {
  images?: Omit<ProductImage, "id" | "productId">[];
  specs?: Omit<ProductSpec, "id" | "productId">[];
};

export async function updateProduct(
  id: string,
  data: UpdateProductInput
): Promise<Product | null> {
  if (!isSupabaseConfigured()) return updateStoreProduct(id, data) ?? null;

  // TODO: Implement Supabase product update
  console.warn("Supabase product update not yet implemented. Using store fallback.");
  return updateStoreProduct(id, data) ?? null;
}

export async function removeProduct(id: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return deleteStoreProduct(id);

  // TODO: Implement Supabase product deletion
  console.warn("Supabase product deletion not yet implemented. Using store fallback.");
  return deleteStoreProduct(id);
}

export async function setProductStatus(
  id: string,
  status: Product["status"]
): Promise<Product | null> {
  if (!isSupabaseConfigured()) return updateStoreProductStatus(id, status) ?? null;

  // TODO: Implement Supabase status update
  console.warn("Supabase status update not yet implemented. Using store fallback.");
  return updateStoreProductStatus(id, status) ?? null;
}

// ── Reference Data ────────────────────────────────────────────────────

export async function getCollections() {
  if (!isSupabaseConfigured()) return getStoreCollections();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("collections").select("*");
  return data ?? [];
}

export async function getCategories() {
  if (!isSupabaseConfigured()) return getStoreCategories();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*");
  return data ?? [];
}

export async function getCompatibilitySystems() {
  if (!isSupabaseConfigured()) return getStoreCompatibilitySystems();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("compatibility_systems").select("*");
  return data ?? [];
}

export async function getLicenses() {
  if (!isSupabaseConfigured()) return getStoreLicenses();
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data } = await supabase.from("licenses").select("*");
  return data ?? [];
}

// ── Requests ──────────────────────────────────────────────────────────

export async function getQuoteRequests() {
  if (!isSupabaseConfigured()) return demoQuoteRequests;
  await requireAdmin();

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("requests")
    .select("*, request_lines(*)")
    .order("created_at", { ascending: false });
  if (error) throw new Error("No se pudieron cargar las solicitudes de presupuesto.");
  return (data ?? []).map((row) => mapRequestRecord(row as RequestRecord));
}

export async function getContactRequests() {
  if (!isSupabaseConfigured()) return getStoreContactRequests();
  await requireAdmin();

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("No se pudieron cargar los mensajes de contacto.");
  return (data ?? []).map((row) => ({
    id: row.id as string, name: row.name as string, email: row.email as string,
    subject: row.subject as string, message: row.message as string,
    createdAt: row.created_at as string,
    // This table has no workflow status; do not label every record as new.
    status: "received",
  }));
}

export async function getCommunitySupportRequests() {
  if (!isSupabaseConfigured()) return getStoreCommunitySupportRequests();
  await requireAdmin();

  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("community_support_requests")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error("No se pudieron cargar las solicitudes de Community Support.");
  return (data ?? []).map((row) => ({
    id: row.id as string, entityType: row.entity_type as string,
    entityName: row.entity_name as string, contactName: row.contact_name as string,
    email: row.email as string, description: row.description as string,
    supportTypes: (row.support_types ?? []) as string[], details: row.details as string,
    createdAt: row.created_at as string, status: row.status as string,
  }));
}
