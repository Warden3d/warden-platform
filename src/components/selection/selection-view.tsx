"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";

import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { SelectionSummary } from "@/components/shared/selection-summary";
import type { SelectionItem } from "@/types/warden";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WardenButton } from "@/components/ui/warden-button";
import {
  ChevronRight,
  Package,
  Trash2,
  Minus,
  Plus,
  CheckCircle,
} from "lucide-react";
import { useSelection } from "@/hooks/use-selection";
import { cn } from "@/lib/utils";
import { submitSelection } from "@/lib/actions/submit-selection";

const QUERY_TYPES = [
  { value: "quote", label: "Solicitud de presupuesto" },
  { value: "availability", label: "Consulta de disponibilidad" },
  { value: "custom", label: "Proyecto personalizado" },
  { value: "other", label: "Otro" },
] as const;

function ItemThumbnail({ item }: { item: SelectionItem }) {
  if (item.image) {
    return (
      <div className="relative shrink-0 size-16 bg-warden-carbon border border-border overflow-hidden">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
    );
  }

  const initials = item.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase() || "WARDEN";

  return (
    <div className="shrink-0 size-16 bg-warden-carbon border border-border flex items-center justify-center text-muted-foreground/40">
      <span className="text-[10px] font-mono tracking-widest">{initials.slice(0, 4)}</span>
    </div>
  );
}

export function SelectionView() {
  const { items, updateQuantity, removeItem, clearAll } = useSelection();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const country = (data.get("country") as string)?.trim();
    const queryType = (data.get("queryType") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name) errors.name = "El nombre es obligatorio";
    if (!email) errors.email = "El email es obligatorio";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Introduce un email válido";
    if (!country) errors.country = "El país / provincia es obligatorio";
    if (!queryType) errors.queryType = "Selecciona un tipo de consulta";
    if (!message) errors.message = "El mensaje es obligatorio";
    if (!accepted) errors.accepted = "Debes aceptar el aviso";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    const formData = new FormData();
    formData.set("name", name);
    formData.set("email", email);
    formData.set("country", country);
    formData.set("queryType", queryType);
    formData.set("message", message);
    formData.set("selections", JSON.stringify(items));

    const result = await submitSelection(formData);

    setSubmitting(false);

    if (result.success) {
      setSubmitted(true);
      clearAll();
    } else if (result.errors) {
      const mapped: Record<string, string> = {};
      for (const [key, msgs] of Object.entries(result.errors)) {
        mapped[key] = msgs[0] ?? "";
      }
      setFormErrors(mapped);
    }
  }

  if (submitted) {
    return (
      <Section>
        <Container>
          <div className="max-w-lg mx-auto text-center py-16">
            <CheckCircle className="size-12 text-warden-green mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Solicitud enviada
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Hemos recibido tu solicitud de presupuesto. Nuestro equipo
              revisará tu selección y responderá en un plazo máximo de{" "}
              <strong>2 días hábiles</strong> con una propuesta detallada que
              incluye disponibilidad, precio y plazos de entrega.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/60">
              El envío no implica ningún compromiso de compra.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <WardenButton href="/catalog">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton variant="outline" href="/">
                Volver al inicio
              </WardenButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="max-w-lg mx-auto text-center py-16">
            <Package className="size-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold text-foreground">
              Tu Selección está vacía
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Explora el catálogo y añade productos a tu selección. Vuelve aquí
              para enviar una solicitud de presupuesto cuando estés listo.
            </p>
            <div className="mt-6 inline-block">
              <WardenButton href="/catalog">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section className="pt-10 md:pt-16">
      <Container>
        <div className="max-w-3xl mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Package className="size-5 text-warden-blue" />
            <Eyebrow>Solicitud de presupuesto</Eyebrow>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Mi Selección
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Revisa tus productos seleccionados a continuación y envía una
            solicitud de presupuesto. Responderemos con disponibilidad, precio
            y plazos de entrega en un plazo de 2 días hábiles.
          </p>
        </div>
      </Container>

      <Container className="!py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Eyebrow>Productos seleccionados</Eyebrow>
              <button
                type="button"
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors tracking-wider uppercase"
              >
                Vaciar selección
              </button>
            </div>

            {items.map((item) => (
              <div
                key={item.entityId + item.entityType}
                className="flex items-start gap-4 border border-border bg-warden-surface p-4"
              >
                <ItemThumbnail item={item} />

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.slug ? (
                      <Link
                        href={
                          item.entityType === "product"
                            ? `/products/${item.slug}`
                            : item.entityType === "bundle"
                              ? `/bundles/${item.slug}`
                              : `/drops/${item.slug}`
                        }
                        className="hover:text-warden-blue transition-colors"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      item.name
                    )}
                  </h3>
                  {item.entityType !== "product" && (
                    <p className="text-xs text-warden-ochre/70 mt-0.5 font-medium uppercase tracking-wider">
                      {item.entityType === "bundle" ? "Bundle" : "Drop"}
                    </p>
                  )}
                  <p className="text-data text-foreground/80 mt-1">
                    {item.unitPrice.toFixed(2).replace('.', ',')} €{" "}
                    <span className="text-spec-label text-muted-foreground">
                      / unidad
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border border-border">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.entityId, item.entityType, item.quantity - 1)
                      }
                      className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors"
                      aria-label="Reducir cantidad"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.entityId, item.entityType, item.quantity + 1)
                      }
                      className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <span className="text-data text-muted-foreground w-16 text-right tabular-nums">
                    {(item.unitPrice * item.quantity).toFixed(2).replace('.', ',')} €
                  </span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.entityId, item.entityType)}
                    className="size-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Eliminar ${item.name}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            <SectionDivider />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)} productos
                seleccionados
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Subtotal orientativo:{" "}
                </span>
                <span className="text-data text-foreground tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="bg-warden-blue/5 border border-warden-blue/20 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Importante:</strong> Los
                precios mostrados son orientativos y no constituyen una oferta
                final. El precio definitivo, disponibilidad y plazos de entrega
                se confirmarán en nuestra respuesta. Enviar esta solicitud no
                implica ningún compromiso de compra.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <SelectionSummary />

            <div className="border border-border bg-warden-surface p-6">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Solicitar presupuesto
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Respondemos en un plazo máximo de 2 días hábiles.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-name"
                    className="text-spec-label text-muted-foreground"
                  >
                    Nombre <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="sel-name"
                    name="name"
                    placeholder="Tu nombre completo"
                    className={cn(formErrors.name && "border-destructive")}
                  />
                  {formErrors.name && (
                    <p className="text-xs text-destructive">{formErrors.name}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-email"
                    className="text-spec-label text-muted-foreground"
                  >
                    Email <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="sel-email"
                    name="email"
                    type="email"
                    placeholder="tucorreo@ejemplo.com"
                    className={cn(formErrors.email && "border-destructive")}
                  />
                  {formErrors.email && (
                    <p className="text-xs text-destructive">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-country"
                    className="text-spec-label text-muted-foreground"
                  >
                    País / Provincia{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="sel-country"
                    name="country"
                    placeholder="Ej. España, Madrid"
                    className={cn(formErrors.country && "border-destructive")}
                  />
                  {formErrors.country && (
                    <p className="text-xs text-destructive">
                      {formErrors.country}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-query-type"
                    className="text-spec-label text-muted-foreground"
                  >
                    Tipo de consulta <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="sel-query-type"
                    name="queryType"
                    defaultValue=""
                    className={cn(
                      "flex h-9 w-full rounded-sm border bg-transparent px-3 py-1 text-sm text-foreground transition-colors",
                      "placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50 focus-visible:ring-offset-1 focus-visible:ring-offset-warden-carbon",
                      "disabled:cursor-not-allowed disabled:opacity-50",
                      "appearance-none",
                      formErrors.queryType
                        ? "border-destructive"
                        : "border-input"
                    )}
                  >
                    <option value="" disabled>
                      Selecciona un tipo...
                    </option>
                    {QUERY_TYPES.map((qt) => (
                      <option key={qt.value} value={qt.value}>
                        {qt.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.queryType && (
                    <p className="text-xs text-destructive">
                      {formErrors.queryType}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-message"
                    className="text-spec-label text-muted-foreground"
                  >
                    Mensaje <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="sel-message"
                    name="message"
                    placeholder="Cuéntanos sobre tu proyecto, método de envío preferido o cualquier requisito especial..."
                    rows={4}
                    className={cn(formErrors.message && "border-destructive")}
                  />
                  {formErrors.message && (
                    <p className="text-xs text-destructive">
                      {formErrors.message}
                    </p>
                  )}
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={accepted}
                    onChange={(e) => {
                      setAccepted(e.target.checked);
                      if (e.target.checked)
                        setFormErrors((prev) => {
                          const next = { ...prev };
                          delete next.accepted;
                          return next;
                        });
                    }}
                    className="warden-check mt-0.5 shrink-0"
                  />
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    Entiendo que esta solicitud no implica ningún compromiso de
                    compra y que el presupuesto final será facilitado por el
                    equipo de WARDEN.
                  </span>
                </label>
                {formErrors.accepted && (
                  <p className="text-xs text-destructive -mt-2">
                    {formErrors.accepted}
                  </p>
                )}

                <WardenButton
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? (
                    "Enviando solicitud..."
                  ) : (
                    <>
                      Enviar solicitud
                      <ChevronRight className="size-4" />
                    </>
                  )}
                </WardenButton>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
