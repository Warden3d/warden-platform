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

  await createCommunitySupportRequest({
    entityType: parsed.data.entityType,
    entityName: parsed.data.entityName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    description: parsed.data.description,
    supportTypes: parsed.data.supportTypes,
    details: parsed.data.details,
    acceptedTerms: parsed.data.acceptedTerms,
  });

  return { success: true, message: "Solicitud enviada correctamente." };
}
