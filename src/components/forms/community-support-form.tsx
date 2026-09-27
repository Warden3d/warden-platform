"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronRight, Loader } from "lucide-react";

import {
  communitySupportSchema,
  APPLICANT_TYPES,
  SUPPORT_TYPES,
  type CommunitySupportFormValues,
} from "@/lib/schemas/community-support";
import { submitCommunitySupport } from "@/lib/actions/submit-community-support";
import { WardenButton } from "@/components/ui/warden-button";
import { cn } from "@/lib/utils";

// Los valores del schema son códigos estables; aquí solo se mapean a las claves
// de traducción (el mapa de etiquetas del schema se mantiene intacto porque lo
// usan los emails).
const APPLICANT_TYPE_KEYS: Record<(typeof APPLICANT_TYPES)[number], string> = {
  asociacion: "asociacion",
  club: "club",
  organizador: "organizador",
  comunidad: "comunidad",
  iniciativa: "iniciativa",
};

const SUPPORT_TYPE_KEYS: Record<(typeof SUPPORT_TYPES)[number], string> = {
  "material-promocional": "materialPromocional",
  premios: "premios",
  escenografia: "escenografia",
  "elementos-juego": "elementosJuego",
  asesoramiento: "asesoramiento",
  difusion: "difusion",
};

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
  const t = useTranslations("communitySupport");
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

  // Honeypot value is read directly from the hidden field at submit time.
  const onSubmit = async (data: CommunitySupportFormValues) => {
    if (status === "submitting") return; // guard against double submit
    const website =
      typeof document !== "undefined"
        ? String(
            (document.getElementById("website") as HTMLInputElement | null)
              ?.value ?? "",
          )
        : "";
    setStatus("submitting");
    try {
      const result = await submitCommunitySupport({ ...data, website });
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
          {t("form.success.title")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {t("form.success.body")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot anti-spam — hidden from humans, ignored by screen readers */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{t("form.honeypot")}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      {/* Entity type */}
      <FormField
        id="entityType"
        label={t("form.entityType")}
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
            {t("form.entityTypePlaceholder")}
          </option>
          {APPLICANT_TYPES.map((type) => (
            <option key={type} value={type} className="bg-warden-carbon">
              {t(`applicant.${APPLICANT_TYPE_KEYS[type]}`)}
            </option>
          ))}
        </select>
      </FormField>

      {/* Entity name + contact */}
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="entityName"
          label={t("form.entityName")}
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
            placeholder={t("form.entityNamePlaceholder")}
          />
        </FormField>
        <FormField
          id="contactName"
          label={t("form.contactName")}
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
            placeholder={t("form.contactNamePlaceholder")}
          />
        </FormField>
      </div>

      {/* Email */}
      <FormField
        id="email"
        label={t("form.email")}
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
          placeholder={t("form.emailPlaceholder")}
        />
      </FormField>

      {/* Description */}
      <FormField
        id="description"
        label={t("form.description")}
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
          placeholder={t("form.descriptionPlaceholder")}
        />
      </FormField>

      {/* Support types */}
      <div className="space-y-2">
        <span className="text-spec-label text-muted-foreground block">
          {t("form.supportTypes")}
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
                {t(`support.${SUPPORT_TYPE_KEYS[type]}.title`)}
              </span>
            </label>
          ))}
        </div>
        <FieldError message={errors.supportTypes?.message} />
      </div>

      {/* Details */}
      <FormField
        id="details"
        label={t("form.details")}
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
          placeholder={t("form.detailsPlaceholder")}
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
            {t("form.acceptedTerms")}
          </span>
        </label>
        <FieldError message={errors.acceptedTerms?.message} />
      </div>

      {status === "error" && (
        <p className="text-xs text-destructive">
          {t("form.error")}
        </p>
      )}

      <WardenButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader className="size-4 animate-spin" />
            {t("form.submitting")}
          </>
        ) : (
          <>
            {t("form.submit")}
            <ChevronRight className="size-4" />
          </>
        )}
      </WardenButton>
    </form>
  );
}
