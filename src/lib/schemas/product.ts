import { z } from "zod";
import { PRODUCT_STATUSES } from "@/types/warden";

export const productFormSchema = z.object({
  // ── Public fields ──────────────────────────
  name: z.string().min(2, "Mínimo 2 caracteres").max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Formato: palabras en minúsculas separadas por guiones"),
  shortDescription: z.string().min(5, "Mínimo 5 caracteres").max(500),
  description: z.string().min(10, "Mínimo 10 caracteres").max(10000),
  collectionId: z.string().min(1, "Selecciona una colección"),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  typeId: z.string().optional(),
  compatibilityId: z.string().min(1, "Selecciona un sistema"),
  scale: z.string().min(1).max(50),
  material: z.string().min(1).max(200),
  height: z.coerce.number().min(0, "Debe ser ≥ 0"),
  width: z.coerce.number().min(0, "Debe ser ≥ 0"),
  depth: z.coerce.number().min(0, "Debe ser ≥ 0"),
  price: z.coerce.number().min(0, "Debe ser ≥ 0"),
  gameFeatures: z.string().optional(),
  status: z.enum(PRODUCT_STATUSES),
  featured: z.coerce.boolean().optional(),

  // ── Internal fields ────────────────────────
  internalCode: z.string().min(1, "Obligatorio").max(100),
  associatedLicenseId: z.string().optional().nullable(),
  weight: z.coerce.number().min(0, "Debe ser ≥ 0"),
  volume: z.coerce.number().min(0, "Debe ser ≥ 0"),
  printTime: z.coerce.number().min(0, "Debe ser ≥ 0"),
  version: z.string().min(1).max(50),
  relatedProductIds: z.string().optional(),
  relatedBundleIds: z.string().optional(),
  relatedDropIds: z.string().optional(),
});

export type ProductFormValues = z.output<typeof productFormSchema>;
