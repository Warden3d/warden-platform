import { sendCustomerRequestEmail } from "../src/lib/email/customer-confirmation";

const result = await sendCustomerRequestEmail({
  firstName: "Brian",
  reference: "WDN-2026-999999",
  lines: [
    {
      entityId: "prod-007",
      entityType: "product" as const,
      name: "Wasteland Command Post",
      sku: "WDN-LIC-WS-001",
      quantity: 1,
      configuration: [
        { capabilityId: "finish", optionId: "color", label: "Color" },
      ],
      unitPrice: 54.99,
      lineSubtotal: 54.99,
      slug: "wasteland-command-post",
    },
  ],
  productSubtotal: 54.99,
  notes: "Prueba final R043B",
  recipientEmail: "geonauter@gmail.com",
});

console.log(JSON.stringify(result, null, 2));