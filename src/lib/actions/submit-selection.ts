"use server";

import { createSelectionRequest } from "@/lib/data";

export type SelectionFormResult = {
  success: boolean;
  errors?: Record<string, string[]>;
  message?: string;
};

export async function submitSelection(
  formData: FormData
): Promise<SelectionFormResult> {
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const country = (formData.get("country") as string)?.trim();
  const queryType = (formData.get("queryType") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();
  const selectionsRaw = (formData.get("selections") as string)?.trim();

  const errors: Record<string, string[]> = {};

  if (!name || name.length < 2) errors.name = ["Name is required (min 2 chars)."];
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = ["Enter a valid email."];
  if (!country) errors.country = ["Country is required."];
  if (!queryType) errors.queryType = ["Select a query type."];
  if (!message || message.length < 5) errors.message = ["Message is required."];

  let selections: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }> = [];

  try {
    selections = selectionsRaw ? JSON.parse(selectionsRaw) : [];
  } catch {
    errors.selections = ["Invalid selection data."];
  }

  if (selections.length === 0) {
    errors.selections = ["Selection cannot be empty."];
  }

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  const inserted = await createSelectionRequest({
    name,
    email,
    country,
    queryType,
    message,
    selections,
  });

  if (!inserted) {
    return {
      success: false,
      message: "Error al enviar la solicitud. Inténtalo de nuevo.",
    };
  }

  return { success: true, message: "Solicitud enviada correctamente." };
}
