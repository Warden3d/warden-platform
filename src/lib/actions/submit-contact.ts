"use server";

import { contactSchema } from "@/lib/schemas/contact";

export type ContactFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitContact(
  data: unknown
): Promise<ContactFormResult> {
  await new Promise((r) => setTimeout(r, 1200));

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

  return { success: true, message: "Mensaje recibido correctamente." };
}
