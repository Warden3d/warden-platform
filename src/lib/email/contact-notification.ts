/**
 * Internal notification email for contact form submissions.
 * Sent to WARDEN_EMAIL after a contact request is persisted successfully.
 * Reuses the shared sendEmail() transporter from ./index.
 */
import { sendEmail } from "./index";
import type { SendEmailResult } from "./index";

export interface SendContactNotificationInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

function formatTimestamp(): string {
  return new Date().toLocaleString("es-ES", {
    timeZone: "Europe/Madrid",
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildHtml(input: SendContactNotificationInput): string {
  const rows = [
    ["Nombre", input.name],
    ["Email", input.email],
    ["Motivo", input.subject],
    ["Fecha/hora", formatTimestamp()],
  ];

  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; width: 120px;">${label}</td>
        <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; font-size: 14px; color: #111827;">${escapeHtml(value)}</td>
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
              <h2 style="margin: 0 0 16px; font-size: 18px; color: #111827;">Nuevo mensaje de contacto</h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px; color: #374151;">
                ${rowsHtml}
              </table>
              <h3 style="margin: 24px 0 8px; font-size: 14px; color: #111827; font-weight: 600;">Mensaje</h3>
              <p style="margin: 0; font-size: 14px; color: #374151; line-height: 1.6; white-space: pre-wrap;">${escapeHtml(input.message)}</p>
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

/**
 * Notify WARDEN about a new contact form submission.
 * Reply-To is set to the visitor's email so replies reach them directly.
 */
export async function sendContactNotification(
  input: SendContactNotificationInput,
): Promise<SendEmailResult> {
  const subject = `WARDEN — Nuevo mensaje de contacto — ${input.subject}`;
  const text = [
    "Nuevo mensaje de contacto recibido en la web.",
    "",
    `Nombre: ${input.name}`,
    `Email: ${input.email}`,
    `Motivo: ${input.subject}`,
    `Fecha/hora: ${formatTimestamp()}`,
    "",
    "Mensaje:",
    input.message,
  ].join("\n");

  return sendEmail({
    to: process.env.WARDEN_EMAIL ?? "",
    replyTo: input.email,
    subject,
    text,
    html: buildHtml(input),
  });
}
