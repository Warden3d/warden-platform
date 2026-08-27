"use server";

import { requestSchema } from "@/lib/schemas/request";
import {
  transformSelectionToRequestLines,
  createRequest,
  getActiveProducts,
  getBundles,
  getDrops,
} from "@/lib/data";
import type { SelectionItem, EntityType, ProductConfigurationItem } from "@/types/warden";

export type SelectionFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
  reference?: string;
  emailStatus?: string;
};

interface RawSelectionItem {
  entityId: string;
  entityType: string;
  name: string;
  quantity: number;
  unitPrice: number;
  slug?: string;
  image?: string;
  configuration?: ProductConfigurationItem[];
}

export async function submitSelection(
  formData: FormData
): Promise<SelectionFormResult> {
  // ── 1. Extract client fields ───────────────────────────────────
  const firstName = (formData.get("firstName") as string)?.trim() ?? "";
  const lastName = (formData.get("lastName") as string)?.trim() ?? "";
  const email = (formData.get("email") as string)?.trim() ?? "";
  const country = (formData.get("country") as string)?.trim() ?? "";
  const postalCode = (formData.get("postalCode") as string)?.trim() ?? "";
  const city = (formData.get("city") as string)?.trim() ?? "";
  const phone = (formData.get("phone") as string)?.trim() ?? "";
  const company = (formData.get("company") as string)?.trim() ?? "";
  const region = (formData.get("region") as string)?.trim() ?? "";
  const notes = (formData.get("notes") as string)?.trim() ?? "";
  const idempotencyKey = (formData.get("idempotencyKey") as string)?.trim() ?? crypto.randomUUID();

  const selectionsRaw = (formData.get("selections") as string)?.trim();

  // ── 2. Parse selections ───────────────────────────────────────
  let rawItems: RawSelectionItem[] = [];
  try {
    rawItems = selectionsRaw ? JSON.parse(selectionsRaw) : [];
  } catch {
    return {
      success: false,
      errors: { selections: ["Los datos de selección no son válidos."] },
    };
  }

  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    return {
      success: false,
      errors: { selections: ["La selección no puede estar vacía."] },
    };
  }

  // ── 3. Map raw items to typed SelectionItem[] ──────────────────
  const selectionItems: SelectionItem[] = rawItems.map((r, i) => ({
    id: `tmp-${i}`,
    entityId: r.entityId,
    entityType: r.entityType as EntityType,
    name: r.name,
    quantity: r.quantity,
    unitPrice: r.unitPrice,
    slug: r.slug,
    image: r.image,
    configuration: r.configuration,
  }));

  // ── 4. Transform to RequestLine[] ──────────────────────────────
  const [products, bundles, drops] = await Promise.all([
    getActiveProducts(),
    getBundles(),
    getDrops(),
  ]);

  const lines = transformSelectionToRequestLines(
    selectionItems,
    products,
    bundles,
    drops,
  );

  // ── 5. Validate via Zod schema ────────────────────────────────
  const parseResult = requestSchema.safeParse({
    client: {
      firstName,
      lastName,
      email,
      country,
      postalCode,
      city,
      phone: phone || undefined,
      company: company || undefined,
      region: region || undefined,
      notes: notes || undefined,
    },
    lines,
  });

  if (!parseResult.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parseResult.error.issues) {
      const path = issue.path.join(".");
      if (!fieldErrors[path]) fieldErrors[path] = [];
      fieldErrors[path].push(issue.message);
    }
    return { success: false, errors: fieldErrors };
  }

  const { client, lines: validatedLines } = parseResult.data;

  // ── 6. Build the full Request object ──────────────────────────
  const productSubtotal = validatedLines.reduce(
    (sum, line) => sum + line.lineSubtotal,
    0,
  );

  // Resolve locale from the request headers (server-side)
  const headersList = await import("next/headers");
  const headers = await headersList.headers();
  const acceptLanguage = headers.get("accept-language") ?? "en";
  const locale = acceptLanguage.split(",")[0]?.split("-")[0] ?? "en";

  const request = {
    id: undefined,
    reference: null,
    idempotencyKey,
    createdAt: new Date().toISOString(),
    locale,
    currency: "EUR",
    status: "received" as const,
    client,
    lines: validatedLines,
    productSubtotal,
    shippingStatus: "pending_calculation" as const,
    shippingCost: null,
    customerEmailStatus: "pending" as const,
    internalEmailStatus: "pending" as const,
    emailSendAttempts: 0,
    updatedAt: new Date().toISOString(),
    internalNotes: undefined,
    quoteReference: null,
    erpnextReference: null,
  };

  // ── 7. Store (no-op for now) ──────────────────────────────────
  const result = await createRequest(request);

  if (!result.success) {
    return {
      success: false,
      message: result.message ?? "Error al enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  return { success: true, message: result.message, reference: result.reference, emailStatus: result.emailStatus };
}