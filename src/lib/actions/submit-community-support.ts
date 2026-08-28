"use server";

import { communitySupportSchema } from "@/lib/schemas/community-support";
import { createCommunitySupportRequest } from "@/lib/data";

export type CommunitySupportFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitCommunitySupport(
  data: unknown
): Promise<CommunitySupportFormResult> {
  // ── Honeypot ─────────────────────────────────────────────────────
  // If a bot fills the hidden field, answer success without persisting
  // (no special message that would reveal the mechanism).
  const raw = (data ?? {}) as Record<string, unknown>;
  if (typeof raw.website === "string" && raw.website.length > 0) {
    return { success: true, message: "Solicitud enviada correctamente." };
  }

  // ── Server-side validation ───────────────────────────────────────
  const parsed = communitySupportSchema.safeParse(data);

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
  const persisted = await createCommunitySupportRequest({
    entityType: parsed.data.entityType,
    entityName: parsed.data.entityName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    description: parsed.data.description,
    supportTypes: parsed.data.supportTypes,
    details: parsed.data.details,
    acceptedTerms: parsed.data.acceptedTerms,
  });

  if (!persisted) {
    return {
      success: false,
      message: "No se pudo enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  // ── Internal email to WARDEN (only after successful persistence) ─
  // A failed email never invalidates the stored request.
  try {
    const { sendCommunitySupportNotification } = await import(
      "@/lib/email/community-support-notification"
    );
    const emailResult = await sendCommunitySupportNotification({
      entityType: parsed.data.entityType,
      entityName: parsed.data.entityName,
      contactName: parsed.data.contactName,
      email: parsed.data.email,
      description: parsed.data.description,
      supportTypes: parsed.data.supportTypes,
      details: parsed.data.details,
      status: "open",
    });
    if (!emailResult.success) {
      console.error(
        "Community Support internal email failed:",
        emailResult.status,
        emailResult.message
      );
    }
  } catch (err) {
    console.error("Community Support internal email error:", err);
  }

  return { success: true, message: "Solicitud enviada correctamente." };
}
