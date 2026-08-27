/**
 * Customer request confirmation email template.
 * Server-side only. Uses the base sendEmail() from this module.
 */
import { sendEmail } from "./index";
import type { RequestLine, ProductConfigurationItem } from "@/types/warden";

// ─── Helpers ──────────────────────────────────────────────────────

function formatPrice(amount: number): string {
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

function formatConfig(config?: ProductConfigurationItem[]): string {
  if (!config || config.length === 0) return "";
  return config
    .map((c) => (c.capabilityId === "finish" ? "Acabado" : c.capabilityId) + ": " + c.label)
    .join(" · ");
}

// ─── HTML template ────────────────────────────────────────────────

function buildHtml(
  firstName: string,
  reference: string,
  lines: RequestLine[],
  productSubtotal: number,
  notes?: string,
): string {
  const linesHtml = lines
    .map(
      (line) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
          <strong>${line.name}</strong>
          ${line.configuration ? `<br><span style="font-size: 12px; color: #6b7280;">${formatConfig(line.configuration)}</span>` : ""}
        </td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: center;">${line.quantity}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(line.unitPrice)}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatPrice(line.lineSubtotal)}</td>
      </tr>`,
    )
    .join("\n");

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin: 0; padding: 0; background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background: #ffffff; border-radius: 8px; overflow: hidden;">
          <tr>
            <td style="padding: 32px 40px; background: #1a1d23;">
              <h1 style="margin: 0; font-size: 24px; font-weight: 600; color: #ffffff;">WARDEN</h1>
              <p style="margin: 4px 0 0; font-size: 13px; color: #9ca3af;">Precision equipment for tabletop wargames</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="margin: 0 0 8px; font-size: 18px; color: #111827;">Solicitud recibida</h2>
              <p style="margin: 0 0 4px; font-size: 14px; color: #374151;">Hola <strong>${firstName}</strong>,</p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #374151;">Hemos recibido correctamente tu solicitud de presupuesto.</p>

              <table style="background: #f3f4f6; border-radius: 6px; padding: 12px 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; color: #6b7280; padding-right: 8px;">Referencia</td>
                  <td style="font-size: 14px; font-weight: 600; color: #111827; letter-spacing: 0.5px;">${reference}</td>
                </tr>
              </table>

              <h3 style="margin: 0 0 12px; font-size: 14px; color: #111827; font-weight: 600;">Productos solicitados</h3>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #374151;">
                <thead>
                  <tr>
                    <th align="left" style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280;">Producto</th>
                    <th align="center" style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280;">Cant.</th>
                    <th align="right" style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280;">Precio</th>
                    <th align="right" style="padding: 8px 0; border-bottom: 2px solid #e5e7eb; font-weight: 600; color: #6b7280;">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  ${linesHtml}
                </tbody>
              </table>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 16px; font-size: 14px; color: #374151;">
                <tr>
                  <td style="padding: 4px 0;"><strong>Subtotal de productos</strong></td>
                  <td align="right"><strong>${formatPrice(productSubtotal)}</strong></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Gastos de envío</td>
                  <td align="right" style="color: #6b7280;">Pendientes de calcular</td>
                </tr>
              </table>

              ${notes ? `<p style="margin: 16px 0 0; font-size: 13px; color: #6b7280;"><strong>Observaciones:</strong><br>${notes}</p>` : ""}

              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">

              <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Revisaremos tu solicitud y nos pondremos en contacto contigo para confirmar disponibilidad, gastos de envío y presupuesto definitivo.
              </p>
              <p style="margin: 4px 0 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                Este mensaje no implica ningún compromiso de compra.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 16px 40px; background: #f3f4f6; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #9ca3af;">WARDEN — wardenminis@gmail.com</p>
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
  firstName: string,
  reference: string,
  lines: RequestLine[],
  productSubtotal: number,
  notes?: string,
): string {
  const linesText = lines
    .map((line) => {
      const config = line.configuration ? ` (${formatConfig(line.configuration)})` : "";
      return `  ${line.name}${config}
  Cantidad: ${line.quantity}
  Precio unitario: ${formatPrice(line.unitPrice)}
  Subtotal: ${formatPrice(line.lineSubtotal)}`;
    })
    .join("\n\n");

  return [
    `Hola ${firstName},`,
    "",
    "Hemos recibido correctamente tu solicitud de presupuesto.",
    "",
    `Referencia: ${reference}`,
    "",
    "Productos solicitados:",
    "",
    linesText,
    "",
    `Subtotal de productos: ${formatPrice(productSubtotal)}`,
    "Gastos de envío: Pendientes de calcular",
    notes ? `\nObservaciones:\n${notes}` : "",
    "",
    "Revisaremos tu solicitud y nos pondremos en contacto contigo para confirmar disponibilidad, gastos de envío y presupuesto definitivo.",
    "",
    "Gracias,",
    "WARDEN",
  ]
    .filter(Boolean)
    .join("\n");
}

// ─── Public API ───────────────────────────────────────────────────

export interface SendCustomerRequestEmailInput {
  firstName: string;
  reference: string;
  lines: RequestLine[];
  productSubtotal: number;
  notes?: string;
  recipientEmail: string;
}

/**
 * Send a confirmation email to the customer after a successful request.
 */
export async function sendCustomerRequestEmail(
  input: SendCustomerRequestEmailInput,
) {
  const subject = `WARDEN — Solicitud recibida ${input.reference}`;
  const text = buildText(
    input.firstName,
    input.reference,
    input.lines,
    input.productSubtotal,
    input.notes,
  );
  const html = buildHtml(
    input.firstName,
    input.reference,
    input.lines,
    input.productSubtotal,
    input.notes,
  );

  return sendEmail({
    to: input.recipientEmail,
    subject,
    text,
    html,
  });
}