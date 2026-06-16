"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Check, ChevronRight, Loader } from "lucide-react";

import {
  communitySupportSchema,
  APPLICANT_TYPES,
  SUPPORT_TYPES,
  supportTypeLabels,
  applicantTypeLabels,
  type CommunitySupportFormValues,
} from "@/lib/schemas/community-support";
import { submitCommunitySupport } from "@/lib/actions/submit-community-support";
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

export function CommunitySupportForm() {
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CommunitySupportFormValues>({
    resolver: zodResolver(communitySupportSchema),
  });

  const onSubmit = async (data: CommunitySupportFormValues) => {
    setStatus("submitting");
    try {
      const result = await submitCommunitySupport(data);
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
          Solicitud enviada
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          Hemos recibido tu solicitud. Revisaremos la información y te
          responderemos en un plazo máximo de cinco días hábiles.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Entity type */}
      <FormField
        id="entityType"
        label="Tipo de entidad"
        required
        error={errors.entityType?.message}
      >
        <select
          id="entityType"
          {...register("entityType")}
          className={cn(
            "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20 appearance-none cursor-pointer",
            errors.entityType
              ? "border-destructive focus-visible:border-destructive"
              : "border-input"
          )}
        >
          <option value="" className="bg-warden-carbon">
            Selecciona una opción
          </option>
          {APPLICANT_TYPES.map((t) => (
            <option key={t} value={t} className="bg-warden-carbon">
              {applicantTypeLabels[t]}
            </option>
          ))}
        </select>
      </FormField>

      {/* Entity name + contact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="entityName"
          label="Nombre de la entidad"
          required
          error={errors.entityName?.message}
        >
          <input
            id="entityName"
            {...register("entityName")}
            className={cn(
              "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
              errors.entityName
                ? "border-destructive focus-visible:border-destructive"
                : "border-input"
            )}
            placeholder="Nombre de la asociación, club, etc."
          />
        </FormField>
        <FormField
          id="contactName"
          label="Persona de contacto"
          required
          error={errors.contactName?.message}
        >
          <input
            id="contactName"
            {...register("contactName")}
            className={cn(
              "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
              errors.contactName
                ? "border-destructive focus-visible:border-destructive"
                : "border-input"
            )}
            placeholder="Nombre y apellidos"
          />
        </FormField>
      </div>

      {/* Email */}
      <FormField
        id="email"
        label="Email de contacto"
        required
        error={errors.email?.message}
      >
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

      {/* Description */}
      <FormField
        id="description"
        label="Describe tu entidad"
        required
        error={errors.description?.message}
      >
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-sm border bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
            errors.description
              ? "border-destructive focus-visible:border-destructive"
              : "border-input"
          )}
          placeholder="Cuéntanos quiénes sois, qué hacéis y a qué comunidad pertenecéis..."
        />
      </FormField>

      {/* Support types */}
      <div className="space-y-2">
        <span className="text-spec-label text-muted-foreground block">
          ¿Qué tipo de apoyo solicitas?
        </span>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUPPORT_TYPES.map((type) => (
            <label
              key={type}
              className="flex items-start gap-3 border border-border bg-warden-surface p-3 cursor-pointer hover:border-warden-blue/20 transition-colors has-[:checked]:border-warden-blue/40 has-[:checked]:bg-warden-blue/5"
            >
              <input
                type="checkbox"
                value={type}
                {...register("supportTypes")}
                className="mt-0.5 size-4 accent-warden-blue"
              />
              <span className="text-sm text-muted-foreground leading-snug">
                {supportTypeLabels[type]}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.supportTypes?.message} />
      </div>

      {/* Details */}
      <FormField
        id="details"
        label="Detalles de la solicitud"
        required
        error={errors.details?.message}
      >
        <textarea
          id="details"
          rows={5}
          {...register("details")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-sm border bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
            errors.details
              ? "border-destructive focus-visible:border-destructive"
              : "border-input"
          )}
          placeholder="Explica qué necesitas, para qué evento o actividad, y cómo el apoyo de WARDEN ayudaría..."
        />
      </FormField>

      {/* Accepted terms */}
      <div className="space-y-1">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            {...register("acceptedTerms")}
            className="mt-0.5 size-4 accent-warden-blue"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            Confirmo que he leído y acepto las condiciones del programa
            Community Support. Entiendo que la concesión de apoyo es
            discrecional y depende de los recursos disponibles en cada
            momento.
          </span>
        </label>
        <FieldError message={errors.acceptedTerms?.message} />
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">
          No se pudo enviar la solicitud. Inténtalo de nuevo.
        </p>
      )}

      <WardenButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader className="size-4 animate-spin" />
            Enviando solicitud...
          </>
        ) : (
          <>
            Enviar solicitud
            <ChevronRight className="size-4" />
          </>
        )}
      </WardenButton>
    </form>
  );
}
