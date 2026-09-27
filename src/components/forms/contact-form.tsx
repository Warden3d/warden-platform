"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronRight, Loader } from "lucide-react";

import {
  contactSchema,
  CONTACT_SUBJECTS,
  type ContactFormValues,
} from "@/lib/schemas/contact";
import { submitContact } from "@/lib/actions/submit-contact";
import { WardenButton } from "@/components/ui/warden-button";
import { cn } from "@/lib/utils";

/**
 * Display labels for the subject selector only. The option VALUES come from
 * CONTACT_SUBJECTS and are submitted and stored verbatim, so they must never
 * change — only the visible label is localised here.
 * Brand terms ("Community Support", "Dealer Program") have no entry and are
 * rendered as-is in both locales.
 */
const SUBJECT_LABELS: Record<string, string> = {
  "Consulta general": "subjects.general",
  "Licencias y colaboraciones": "subjects.licensing",
  "Otros": "subjects.other",
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

export function ContactForm() {
  const t = useTranslations("contact");
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

  // Honeypot value is read directly from the hidden field at submit time.
  const onSubmit = async (data: ContactFormValues) => {
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
      const result = await submitContact({ ...data, website });
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
          {t("successTitle")}
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
          {t("successBody")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Honeypot anti-spam — hidden from humans, ignored by screen readers */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{t("honeypotLabel")}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="name" label={t("name")} required error={errors.name?.message}>
          <input
            id="name"
            {...register("name")}
            className={cn(
              "h-9 w-full min-w-0 rounded-sm border bg-transparent px-3 py-1 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-warden-blue/50 focus-visible:ring-1 focus-visible:ring-warden-blue/20",
              errors.name
                ? "border-destructive focus-visible:border-destructive"
                : "border-input"
            )}
            placeholder={t("namePlaceholder")}
          />
        </FormField>
        <FormField id="email" label={t("emailLabel")} required error={errors.email?.message}>
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
            placeholder={t("emailPlaceholder")}
          />
        </FormField>
      </div>

      <FormField id="subject" label={t("subject")} required error={errors.subject?.message}>
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
            {t("subjectPlaceholder")}
          </option>
          {CONTACT_SUBJECTS.map((s) => (
            <option key={s} value={s} className="bg-warden-carbon">
              {SUBJECT_LABELS[s] ? t(SUBJECT_LABELS[s]) : s}
            </option>
          ))}
        </select>
      </FormField>

      <FormField id="message" label={t("message")} required error={errors.message?.message}>
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
          placeholder={t("messagePlaceholder")}
        />
      </FormField>

      {status === "error" && (
        <p className="text-xs text-destructive">{t("error")}</p>
      )}

      <WardenButton type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <Loader className="size-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            {t("submit")}
            <ChevronRight className="size-4" />
          </>
        )}
      </WardenButton>
    </form>
  );
}
