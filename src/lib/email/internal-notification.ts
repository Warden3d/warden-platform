/**
 * Internal WARDEN notification email for new requests.
 * Server-side only. Uses the base sendEmail() from this module.
 */
import { sendEmail } from "./index";
import type { RequestLine, RequestClient, ProductConfigurationItem } from "@/types/warden";

const INTERNAL_TO = process.env.WARDEN_EMAIL ?? "";

// ─── Helpers ──────────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

function formatConfig(config?: ProductConfigurationItem[]): string {
  if (!config || config.length === 0) return "—";
  return config
    .map((c) => (c.capabilityId === "finish" ? "Acabado" : c.capabilityId) + ": " + c.label)
    .join(" · ");
}

function formatDate(): string {
  const now = new Date();
  return now.toLocaleString("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

// ─── HTML template ────────────────────────────────────────────────

function buildHtml(
  reference: string,
  client: RequestClient,
  lines: RequestLine[],
  productSubtotal: number,
  notes?: string,
): string {
  const linesHtml = lines
    .map(
      (line) => `
      <tr>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 12px;">${line.name}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">${line.sku}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px;">${line.entityType}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #6b7280;">${formatConfig(line.configuration)}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 12px;">${line.quantity}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px;">${formatPrice(line.unitPrice)}</td>
        <td style="padding: 6px 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px;">${formatPrice(line.lineSubtotal)}</td>
      </tr>`,
    )
    .join("\n");

  const now = formatDate();

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="640" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 24px 32px; background: #1a1d23;">
              <h1 style="margin: 0; font-size: 20px; font-weight: 600; color: #ffffff;">Nueva solicitud de presupuesto</h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #9ca3af;">${reference} · ${now}</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 32px;">
              <table style="background: #f3f4f6; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px; width: 100%;">
                <tr>
                  <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 0 0 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Referencia</p>
                    <p style="margin: 0; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">${reference}</p>
                    <p style="margin: 4px 0 0; font-size: 11px; color: #6b7280;">Estado: <strong>received</strong></p>
                    <p style="margin: 2px 0 0; font-size: 11px; color: #6b7280;">Moneda: EUR</p>
                  </td>
                  <td style="width: 50%; vertical-align: top;">
                    <p style="margin: 0 0 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280;">Cliente</p>
                    <p style="margin: 0; font-size: 14px; font-weight: 600;">${client.firstName} ${client.lastName}</p>
                    <p style="margin: 2px 0; font-size: 13px; color: #2563eb;"><a href="mailto:${client.email}" style="color: #2563eb; text-decoration: none;">${client.email}</a></p>
                    ${client.phone ? `<p style="margin: 2px 0; font-size: 13px; color: #374151;">${client.phone}</p>` : ""}
                    ${client.company ? `<p style="margin: 2px 0; font-size: 13px; color: #374151;">${client.company}</p>` : ""}
                  </td>
                </tr>
              </table>

              <h3 style="margin: 0 0 8px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Dirección</h3>
              <p style="margin: 0; font-size: 13px; color: #374151;">
                ${client.city}, ${client.region ? `${client.region}, ` : ""}${client.country}
                ${client.postalCode ? ` · ${client.postalCode}` : ""}
              </p>

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">

              <h3 style="margin: 0 0 12px; font-size: 14px; font-weight: 600;">Productos solicitados</h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th align="left" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Producto</th>
                    <th align="left" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">SKU</th>
                    <th align="left" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Tipo</th>
                    <th align="left" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Config.</th>
                    <th align="center" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Cant.</th>
                    <th align="right" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Precio</th>
                    <th align="right" style="padding: 6px 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; border-bottom: 2px solid #e5e7eb;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${linesHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; font-size: 14px; color: #374151;">
                <tr>
                  <td style="padding: 4px 8px;"><strong>Subtotal de productos</strong></td>
                  <td align="right" style="padding: 4px 8px;"><strong>${formatPrice(productSubtotal)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 4px 8px; color: #6b7280;">Gastos de envío</td>
                  <td align="right" style="padding: 4px 8px; color: #6b7280;">Pendientes de calcular</td>
                </tr>
              </table>

              ${notes ? `<hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"><h3 style="margin: 0 0 4px; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Observaciones del cliente</h3><p style="margin: 0; font-size: 13px; color: #374151;">${notes}</p>` : ""}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Text template ────────────────────────────────────────────────

function buildText(
  reference: string,
  client: RequestClient,
  lines: RequestLine[],
  productSubtotal: number,
  notes?: string,
): string {
  const linesText = lines
    .map((line) => {
      const config = line.configuration ? ` (${formatConfig(line.configuration)})` : "";
      return `  ${line.name}${config}
  SKU: ${line.sku}
  Tipo: ${line.entityType}
  Cantidad: ${line.quantity}
  Precio: ${formatPrice(line.unitPrice)}
  Subtotal: ${formatPrice(line.lineSubtotal)}`;
    })
    .join("\n\n");

  const address = [client.city, client.region, client.country].filter(Boolean).join(", ");
  const addressFull = `${address}${client.postalCode ? ` · ${client.postalCode}` : ""}`;

  return [
    `=== NUEVA SOLICITUD DE PRESUPUESTO ===`,
    `Referencia: ${reference}`,
    `Fecha: ${formatDate()}`,
    `Estado: received`,
    `Moneda: EUR`,
    "",
    "--- CLIENTE ---",
    `Nombre: ${client.firstName} ${client.lastName}`,
    `Email: ${client.email}`,
    client.phone ? `Teléfono: ${client.phone}` : "",
    client.company ? `Empresa: ${client.company}` : "",
    `Dirección: ${addressFull}`,
    "",
    "--- PRODUCTOS SOLICITADOS ---",
    "",
    linesText,
    "",
    `Subtotal de productos: ${formatPrice(productSubtotal)}`,
    "Gastos de envío: Pendientes de calcular",
    notes ? `\n--- OBSERVACIONES ---\n${notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Public API ───────────────────────────────────────────────────

export interface SendInternalRequestEmailInput {
  reference: string;
  client: RequestClient;
  lines: RequestLine[];
  productSubtotal: number;
  notes?: string;
}

/**
 * Send an internal notification email to WARDEN staff
 * when a new quote request is created.
 * Reply-To is set to the customer's email for easy response.
 */
export async function sendInternalRequestEmail(
  input: SendInternalRequestEmailInput,
) {
  if (!INTERNAL_TO) {
    return { success: false, status: "EMAIL_NOT_CONFIGURED" as const, message: "WARDEN_EMAIL not configured." };
  }

  const subject = `WARDEN — Nueva solicitud ${input.reference} — ${input.client.firstName} ${input.client.lastName}`;
  const text = buildText(
    input.reference,
    input.client,
    input.lines,
    input.productSubtotal,
    input.notes,
  );
  const html = buildHtml(
    input.reference,
    input.client,
    input.lines,
    input.productSubtotal,
    input.notes,
  );

  return sendEmail({
    to: INTERNAL_TO,
    subject,
    text,
    html,
    replyTo: input.client.email,
  });
}