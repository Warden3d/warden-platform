"use server";

import {
  setProductStatus as updateStatus,
  removeProduct as deleteProd,
} from "@/lib/data/admin";
import type { ProductStatus } from "@/types/warden";
import { revalidatePath } from "next/cache";

export async function setProductStatus(
  id: string,
  status: string
): Promise<{ status: ProductStatus } | null> {
  const result = await updateStatus(id, status as ProductStatus);
  if (result) {
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
  return result ? { status: result.status } : null;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const result = await deleteProd(id);
  if (result) {
    revalidatePath("/admin/products");
    revalidatePath("/");
  }
  return result;
}
