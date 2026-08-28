/**
 * Confirmation email sent to the Community Support applicant after the
 * request has been persisted successfully.
 * Reuses the shared sendEmail() transporter from ./index.
 * NOTE: intentionally no response-time commitment in the copy — the page
 * states "5 días hábiles" but the email avoids it pending PO confirmation.
 */
import { sendEmail } from "./index";
import { supportTypeLabels } from "@/lib/schemas/community-support";
import type { SendEmailResult } from "./index";

export interface SendCommunitySupportConfirmationInput {
  entityName: string;
  contactName: string;
  supportTypes: string[];
  recipientEmail: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function labelForSupport(code: string): string {
  const t = code as keyof typeof supportTypeLabels;
  return supportTypeLabels[t] ?? code;
}

function buildHtml(input: SendCommunitySupportConfirmationInput): string {
  const supportList = input.supportTypes
    .map(
      (code) =>
        `<li style="margin: 2px 0; font-size: 14px; color: #374151;">${escapeHtml(labelForSupport(code))}</li>`,
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
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">Solicitud de Community Support recibida</h2>
              <p style="margin: 0 0 16px; font-size: 14px; color: #374151;">
                Hola <strong>${escapeHtml(input.contactName)}</strong>,
              </p>
              <p style="margin: 0 0 16px; font-size: 14px; color: #374151; line-height: 1.6;">
                Hemos recibido tu solicitud de Community Support para
                <strong>${escapeHtml(input.entityName)}</strong>. Queda
                pendiente de revisión por nuestro equipo.
              </p>
              <h3 style="margin: 0 0 8px; font-size: 14px; color: #111827; font-weight: 600;">Tipos de apoyo solicitados</h3>
              <ul style="margin: 0 0 16px; padding-left: 20px;">
                ${supportList}
              </ul>
              <p style="margin: 0 0 16px; font-size: 14px; color: #374151; line-height: 1.6;">
                Ten en cuenta que el envío de esta solicitud <strong>no implica
                aceptación ni concesión del apoyo</strong>. La concesión es
                discrecional y depende de los recursos disponibles en cada
                momento.
              </p>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6;">
                Te contactaremos desde WARDEN cuando tu solicitud haya sido
                revisada.
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

function buildText(input: SendCommunitySupportConfirmationInput): string {
  return [
    `Hola ${input.contactName},`,
    "",
    `Hemos recibido tu solicitud de Community Support para ${input.entityName}. Queda pendiente de revisión por nuestro equipo.`,
    "",
    "Tipos de apoyo solicitados:",
    ...input.supportTypes.map((code) => `- ${labelForSupport(code)}`),
    "",
    "Ten en cuenta que el envío de esta solicitud no implica aceptación ni concesión del apoyo. La concesión es discrecional y depende de los recursos disponibles en cada momento.",
    "",
    "Te contactaremos desde WARDEN cuando tu solicitud haya sido revisada.",
    "",
    "Gracias,",
    "WARDEN",
  ].join("\n");
}

/**
 * Send a confirmation to the Community Support applicant.
 * Independent channel from the internal WARDEN notification.
 */
export async function sendCommunitySupportConfirmation(
  input: SendCommunitySupportConfirmationInput,
): Promise<SendEmailResult> {
  return sendEmail({
    to: input.recipientEmail,
    subject: "WARDEN — Solicitud de Community Support recibida",
    text: buildText(input),
    html: buildHtml(input),
  });
}
