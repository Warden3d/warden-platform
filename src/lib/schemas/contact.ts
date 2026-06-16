import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "Consulta general",
  "Community Support",
  "Dealer Program",
  "Licencias y colaboraciones",
  "Otros",
] as const;

export const contactSchema = z.object({
  name: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder 100 caracteres"),
  email: z
    .string()
    .min(1, "El email es obligatorio")
    .email("Introduce un email válido"),
  subject: z.enum(CONTACT_SUBJECTS, {
    message: "Selecciona un motivo",
  }),
  message: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(5000, "El mensaje no puede exceder 5000 caracteres"),
});

export type ContactFormValues = z.output<typeof contactSchema>;
