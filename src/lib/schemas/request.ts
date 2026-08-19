import { z } from "zod";

// ─── RequestClient schema ─────────────────────────

export const requestClientSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  lastName: z
    .string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(150, "Los apellidos no pueden exceder 150 caracteres"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),
  country: z
    .string()
    .min(2, "El país es obligatorio")
    .max(100, "País demasiado largo"),
  postalCode: z
    .string()
    .min(2, "El código postal es obligatorio")
    .max(20, "Código postal demasiado largo"),
  city: z
    .string()
    .min(2, "La localidad es obligatoria")
    .max(150, "Localidad demasiado larga"),
  phone: z.string().max(30, "Teléfono demasiado largo").optional().or(z.literal("")),
  company: z.string().max(200, "Empresa demasiado larga").optional().or(z.literal("")),
  region: z.string().max(150, "Región demasiado larga").optional().or(z.literal("")),
  notes: z.string().max(5000, "Las observaciones no pueden exceder 5000 caracteres").optional().or(z.literal("")),
});

export type RequestClientValues = z.output<typeof requestClientSchema>;

// ─── Configuration item schema ────────────────────

export const requestConfigurationItemSchema = z.object({
  capabilityId: z.string().min(1),
  optionId: z.string().min(1),
  label: z.string().min(1),
});

// ─── RequestLine schema ───────────────────────────

export const requestLineSchema = z.object({
  entityId: z.string().min(1, "Falta el identificador de entidad"),
  entityType: z.enum(["product", "bundle", "drop"]),
  name: z.string().min(1, "Falta el nombre del producto"),
  sku: z.string().optional().default(""),
  quantity: z.number().int().min(1, "La cantidad debe ser al menos 1"),
  configuration: z.array(requestConfigurationItemSchema).optional(),
  unitPrice: z.number().min(0, "El precio unitario no puede ser negativo"),
  lineSubtotal: z.number().min(0),
  slug: z.string().optional(),
  image: z.string().optional(),
});

export type RequestLineValues = z.output<typeof requestLineSchema>;

// ─── Full Request schema ──────────────────────────

export const requestSchema = z.object({
  client: requestClientSchema,
  lines: z
    .array(requestLineSchema)
    .min(1, "La solicitud debe contener al menos un producto"),
});

export type RequestFormValues = z.output<typeof requestSchema>;