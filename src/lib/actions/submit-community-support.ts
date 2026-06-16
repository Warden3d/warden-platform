"use server";

import { communitySupportSchema } from "@/lib/schemas/community-support";

export type CommunitySupportFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitCommunitySupport(
  data: unknown
): Promise<CommunitySupportFormResult> {
  await new Promise((r) => setTimeout(r, 1500));

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

  return { success: true, message: "Solicitud enviada correctamente." };
}
