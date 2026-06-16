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
  return (
    <p className="text-xs text-red-400/80 mt-1">{message}</p>
  );
}

export function CommunitySupportForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

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
      <div className="space-y-1.5">
        <label
          htmlFor="entityType"
          className="text-spec-label text-muted-foreground"
        >
          Tipo de entidad
        </label>
        <select
          id="entityType"
          {...register("entityType")}
          className={cn(
            "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30 appearance-none cursor-pointer",
            errors.entityType
              ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
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
        <FieldError message={errors.entityType?.message} />
      </div>

      {/* Entity name */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label
            htmlFor="entityName"
            className="text-spec-label text-muted-foreground"
          >
            Nombre de la entidad
          </label>
          <input
            id="entityName"
            {...register("entityName")}
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              errors.entityName
                ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                : "border-input"
            )}
            placeholder="Nombre de la asociación, club, etc."
          />
          <FieldError message={errors.entityName?.message} />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="contactName"
            className="text-spec-label text-muted-foreground"
          >
            Persona de contacto
          </label>
          <input
            id="contactName"
            {...register("contactName")}
            className={cn(
              "h-8 w-full min-w-0 rounded-lg border bg-transparent px-2.5 py-1 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
              errors.contactName
                ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
                : "border-input"
            )}
            placeholder="Nombre y apellidos"
          />
          <FieldError message={errors.contactName?.message} />
        </div>
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="text-spec-label text-muted-foreground"
        >
          Email de contacto
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

      {/* Description */}
      <div className="space-y-1.5">
        <label
          htmlFor="description"
          className="text-spec-label text-muted-foreground"
        >
          Describe tu entidad
        </label>
        <textarea
          id="description"
          rows={4}
          {...register("description")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            errors.description
              ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
              : "border-input"
          )}
          placeholder="Cuéntanos quiénes sois, qué hacéis y a qué comunidad pertenecéis..."
        />
        <FieldError message={errors.description?.message} />
      </div>

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
      <div className="space-y-1.5">
        <label
          htmlFor="details"
          className="text-spec-label text-muted-foreground"
        >
          Detalles de la solicitud
        </label>
        <textarea
          id="details"
          rows={5}
          {...register("details")}
          className={cn(
            "flex field-sizing-content min-h-16 w-full rounded-lg border bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm dark:bg-input/30",
            errors.details
              ? "border-red-400/50 focus-visible:border-red-400 focus-visible:ring-red-400/20"
              : "border-input"
          )}
          placeholder="Explica qué necesitas, para qué evento o actividad, y cómo el apoyo de WARDEN ayudaría..."
        />
        <FieldError message={errors.details?.message} />
      </div>

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
        <p className="text-xs text-red-400/80">
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
