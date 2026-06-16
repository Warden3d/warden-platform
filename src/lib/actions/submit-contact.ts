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

  await createContactRequest({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  return { success: true, message: "Mensaje recibido correctamente." };
}
