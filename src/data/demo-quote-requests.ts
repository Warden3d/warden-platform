import type { Request } from "@/types/warden";

/** Illustrative only. Never persisted or emailed; used without Supabase. */
export const demoQuoteRequests: Request[] = [{
  id: "demo-request", reference: "DEMO-000001",
  createdAt: "2026-09-27T10:00:00Z", updatedAt: "2026-09-27T10:00:00Z",
  locale: "es", currency: "EUR", status: "received",
  client: {
    firstName: "Cliente", lastName: "de ejemplo", email: "cliente@example.invalid",
    country: "España", postalCode: "28001", city: "Madrid",
    notes: "Solicitud ficticia para comprobar el panel. No corresponde a un pedido real.",
  },
  lines: [{
    entityId: "demo-product", entityType: "product", name: "Set de ejemplo",
    sku: "DEMO-SET", quantity: 2, unitPrice: 25, lineSubtotal: 50,
    configuration: [{ capabilityId: "finish", optionId: "unpainted", label: "Sin pintar" }],
  }, {
    entityId: "demo-bundle", entityType: "bundle", name: "Bundle de ejemplo",
    sku: "DEMO-BUNDLE", quantity: 1, unitPrice: 80, lineSubtotal: 80,
  }, {
    entityId: "demo-drop", entityType: "drop", name: "Drop de ejemplo",
    sku: "DEMO-DROP", quantity: 1, unitPrice: 100, lineSubtotal: 100,
  }],
  productSubtotal: 230, shippingStatus: "pending_calculation", shippingCost: null,
  customerEmailStatus: "pending", internalEmailStatus: "failed", emailSendAttempts: 1,
  quoteReference: null, erpnextReference: null,
}];
