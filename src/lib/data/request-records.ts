import type { Request, RequestLine } from "@/types/warden";

/** Database snapshot: do not join against today's catalog or recalculate prices. */
export interface RequestRecord {
  id: string;
  reference: string | null;
  created_at: string;
  updated_at: string;
  locale: string;
  currency: string;
  status: Request["status"];
  first_name: string;
  last_name: string;
  email: string;
  country: string;
  postal_code: string;
  city: string;
  phone: string | null;
  company: string | null;
  region: string | null;
  notes: string | null;
  product_subtotal: number;
  shipping_status: Request["shippingStatus"];
  shipping_cost: number | null;
  customer_email_status: Request["customerEmailStatus"];
  internal_email_status: Request["internalEmailStatus"];
  email_send_attempts: number;
  internal_notes: string | null;
  quote_reference: string | null;
  erpnext_reference: string | null;
  request_lines: {
    entity_id: string;
    entity_type: RequestLine["entityType"];
    name: string;
    sku: string;
    quantity: number;
    configuration: RequestLine["configuration"] | null;
    unit_price: number;
    line_subtotal: number;
    slug: string | null;
    image: string | null;
  }[];
}

export function mapRequestRecord(row: RequestRecord): Request {
  return {
    id: row.id,
    reference: row.reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    locale: row.locale,
    currency: row.currency,
    status: row.status,
    client: {
      firstName: row.first_name, lastName: row.last_name,
      email: row.email, country: row.country,
      postalCode: row.postal_code, city: row.city,
      phone: row.phone ?? undefined, company: row.company ?? undefined,
      region: row.region ?? undefined, notes: row.notes ?? undefined,
    },
    lines: row.request_lines.map((line) => ({
      entityId: line.entity_id, entityType: line.entity_type,
      name: line.name, sku: line.sku, quantity: line.quantity,
      configuration: line.configuration ?? undefined,
      unitPrice: line.unit_price, lineSubtotal: line.line_subtotal,
      slug: line.slug ?? undefined, image: line.image ?? undefined,
    })),
    productSubtotal: row.product_subtotal,
    shippingStatus: row.shipping_status,
    shippingCost: row.shipping_cost,
    customerEmailStatus: row.customer_email_status,
    internalEmailStatus: row.internal_email_status,
    emailSendAttempts: row.email_send_attempts,
    internalNotes: row.internal_notes ?? undefined,
    quoteReference: row.quote_reference,
    erpnextReference: row.erpnext_reference,
  };
}
