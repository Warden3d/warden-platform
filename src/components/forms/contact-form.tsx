"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, ChevronRight, Loader } from "lucide-react";

import {
  contactSchema,
  CONTACT_SUBJECTS,
  type ContactFormValues,
} from "@/lib/schemas/contact";
import { submitContact } from "@/lib/actions/submit-contact";
import { WardenButton } from "@/components/ui/warden-button";
import { cn } from "@/lib/utils";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-xs text-red-400/80 mt-1">{message}</p>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setStatus("submitting");
    try {
      const result = await submitContact(data);
      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="border border-warden-green/30 bg-warden-green/5 p-8 text-center">
        <div className="size-12 mx-auto mb-4 rounded-full bg-warden-green/10 flex items-center justify-center">
          <Check className="size-6 text-warden-green" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Mensaje enviado
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Hemos recibido tu mensaje. Te responderemos en un plazo máximo de dos
          días hábiles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="name"
            className="text-spec-label text-muted-foreground"
          >
            Nombre
          </label>
          <input
            id="name"
            {...register("name")}
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              errors.name
                ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                : "border-input"
            )}
            placeholder="Tu nombre"
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="text-spec-label text-muted-foreground"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              errors.email
                ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                : "border-input"
            )}
            placeholder="tucorreo@ejemplo.com"
          />
          <FieldError message={errors.email?.message} />
        </div>
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="subject"
          className="text-spec-label text-muted-foreground"
        >
          Motivo
        </label>
        <select
          id="subject"
          {...register("subject")}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 appearance-none cursor-pointer",
            errors.subject
              ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
              : "border-input"
          )}
        >
          <option value="" className="bg-warden-carbon">
            Selecciona un motivo
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-warden-carbon">
              {s}
            </option>
          ))}
        </select>
        <FieldError message={errors.subject?.message} />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="message"
          className="text-spec-label text-muted-foreground"
        >
          Mensaje
        </label>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            errors.message
              ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
              : "border-input"
          )}
          placeholder="Describe tu consulta en detalle..."
        />
        <FieldError message={errors.message?.message} />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-400/80">
          No se pudo enviar el mensaje. Inténtalo de nuevo.
        </p>
      )}

      <WardenButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader className="size-4 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            Enviar mensaje
            <ChevronRight className="size-4" />
          </>
        )}
      </WardenButton>
    </form>
  );
}
