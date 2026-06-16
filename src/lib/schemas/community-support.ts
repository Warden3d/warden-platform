import { z } from "zod";

export const APPLICANT_TYPES = [
  "asociacion",
  "club",
  "organizador",
  "comunidad",
  "iniciativa",
] as const;

export const SUPPORT_TYPES = [
  "material-promocional",
  "premios",
  "escenografia",
  "elementos-juego",
  "asesoramiento",
  "difusion",
] as const;

export const supportTypeLabels: Record<(typeof SUPPORT_TYPES)[number], string> = {
  "material-promocional": "Material promocional",
  premios: "Premios para torneos",
  escenografia: "Escenografía",
  "elementos-juego": "Elementos de juego",
  asesoramiento: "Asesoramiento",
  difusion: "Difusión puntual",
};

export const applicantTypeLabels: Record<
  (typeof APPLICANT_TYPES)[number],
  string
> = {
  asociacion: "Asociación",
  club: "Club de juego",
  organizador: "Organizador de eventos",
  comunidad: "Comunidad de juego",
  iniciativa: "Iniciativa comunitaria",
};

export const communitySupportSchema = z.object({
  entityType: z.enum(APPLICANT_TYPES, {
    message: "Selecciona un tipo de entidad",
  }),
  entityName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(200, "El nombre no puede exceder 200 caracteres"),
  contactName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),
  description: z
    .string()
    .min(30, "Describe tu entidad en al menos 30 caracteres")
    .max(3000, "La descripción no puede exceder 3000 caracteres"),
  supportTypes: z
    .array(z.enum(SUPPORT_TYPES))
    .min(1, "Selecciona al menos un tipo de apoyo"),
  details: z
    .string()
    .min(20, "Explica tu solicitud en al menos 20 caracteres")
    .max(5000, "Los detalles no pueden exceder 5000 caracteres"),
  acceptedTerms: z.literal(true, {
    message:
      "Debes confirmar que has leído y aceptas las condiciones",
  }),
});

export type CommunitySupportFormValues = z.output<typeof communitySupportSchema>;
