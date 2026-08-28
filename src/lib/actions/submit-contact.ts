"use server";

import { contactSchema } from "@/lib/schemas/contact";
import { createContactRequest } from "@/lib/data";

export type ContactFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContact(
  data: unknown
): Promise<ContactFormResult> {
  // ── Honeypot ─────────────────────────────────────────────────────
  // If a bot fills the hidden field, answer success without persisting
  // (no special message that would reveal the mechanism).
  const raw = (data ?? {}) as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { success: true, message: "Mensaje recibido correctamente." };
  }

  // ── Server-side validation ───────────────────────────────────────
  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    const errors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = [];
      errors[key].push(issue.message);
    }
    return { success: false, errors };
  }

  // ── Persist ──────────────────────────────────────────────────────
  // Never report success when persistence failed — no fake success.
  const persisted = await createContactRequest({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (!persisted) {
    return {
      success: false,
      message: "No se pudo enviar el mensaje. Inténtalo de nuevo.",
    };
  }

  // ── Internal email to WARDEN (only after successful persistence) ─
  // A failed email never invalidates the stored request.
  try {
    const { sendContactNotification } = await import(
      "@/lib/email/contact-notification"
    );
    const emailResult = await sendContactNotification({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
    });
    if (!emailResult.success) {
      console.error(
        "Contact internal email failed:",
        emailResult.status,
        emailResult.message
      );
    }
  } catch (err) {
    console.error("Contact internal email error:", err);
  }

  return { success: true, message: "Mensaje recibido correctamente." };
}
