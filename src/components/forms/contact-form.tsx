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
  return <p className="text-xs text-destructive mt-1">{message}</p>;
}

function FormField({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-spec-label text-muted-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      <FieldError message={error} />
    </div>
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

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
        <FormField id="name" label="Nombre" required error={errors.name?.message}>
          <input
            id="name"
            {...register("name")}
            className={cn(
              "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
              errors.name
                ? "border-destructive focus-visible:border-destructive"
                : "border-input"
            )}
            placeholder="Tu nombre"
          />
        </FormField>
        <FormField id="email" label="Email" required error={errors.email?.message}>
          <input
            id="email"
            type="email"
            {...register("email")}
            className={cn(
              "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
              errors.email
                ? "border-destructive focus-visible:border-destructive"
                : "border-input"
            )}
            placeholder="tucorreo@ejemplo.com"
          />
        </FormField>
      </div>

      <FormField id="subject" label="Motivo" required error={errors.subject?.message}>
        <select
          id="subject"
          {...register("subject")}
          className={cn(
            "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20 appearance-none cursor-pointer",
            errors.subject
              ? "border-destructive focus-visible:border-destructive"
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
      </FormField>

      <FormField id="message" label="Mensaje" required error={errors.message?.message}>
        <textarea
          id="message"
          rows={6}
          {...register("message")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-sm border bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
            errors.message
              ? "border-destructive focus-visible:border-destructive"
              : "border-input"
          )}
          placeholder="Describe tu consulta en detalle..."
        />
      </FormField>

      {status === "error" && (
        <p className="text-xs text-destructive">
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
