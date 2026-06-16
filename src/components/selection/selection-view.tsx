"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";

import { Container, Section, Eyebrow } from "@/components/shared/container";
import { SelectionSummary } from "@/components/shared/selection-summary";
import { products as catalogProducts } from "@/data/warden-catalog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { WardenButton } from "@/components/ui/warden-button";
import { SectionDivider } from "@/components/shared/container";
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

const QUERY_TYPES = [
  { value: "quote", label: "Quote Request" },
  { value: "availability", label: "Availability Inquiry" },
  { value: "custom", label: "Custom Project" },
  { value: "other", label: "Other" },
] as const;

export function SelectionView() {
  const { items, updateQuantity, removeItem, clearAll } = useSelection();

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const enriched = items.map((item) => {
    const prod = catalogProducts.find((p) => p.id === item.productId);
    return { ...item, product: prod };
  });

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const errors: Record<string, string> = {};

    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const country = (data.get("country") as string)?.trim();
    const queryType = (data.get("queryType") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name) errors.name = "Name is required";
    if (!email) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      errors.email = "Enter a valid email";
    if (!country) errors.country = "Country / province is required";
    if (!queryType) errors.queryType = "Select a query type";
    if (!message) errors.message = "Message is required";
    if (!accepted) errors.accepted = "You must accept the notice";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      clearAll();
    }, 1200);
  }

  if (submitted) {
    return (
      <Section>
        <Container>
          <div className="max-w-lg mx-auto text-center py-16">
            <CheckCircle className="size-12 text-warden-green mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Request Sent
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Your quote request has been received. Our team will review your
              selection and respond within <strong>2 business days</strong> with
              a detailed proposal including availability, pricing, and estimated
              delivery times.
            </p>
            <p className="mt-2 text-sm text-muted-foreground/60">
              The request does not imply any obligation to purchase.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <WardenButton href="/catalog">
                Browse Catalog
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton variant="outline" href="/">
                Back to Home
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
              Your Selection is Empty
            </h1>
            <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Browse the catalog and add products to your selection. Return here
              to submit a quote request when you are ready.
            </p>
            <div className="mt-6 inline-block">
              <WardenButton href="/catalog">
                Browse Catalog
                <ChevronRight className="size-4" />
              </WardenButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Package className="size-5 text-warden-blue" />
            <Eyebrow>Quote Request</Eyebrow>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            My Selection
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Review your selected products below, then submit a quote request. We
            will respond with availability, pricing, and estimated delivery
            times within 2 business days.
          </p>
        </div>
      </Container>

      <Container className="!py-12">
        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <Eyebrow>Selected Products</Eyebrow>
              <button
                onClick={clearAll}
                className="text-xs text-muted-foreground hover:text-destructive transition-colors tracking-wider uppercase"
              >
                Clear Selection
              </button>
            </div>

            {enriched.map((item) => (
              <div
                key={item.productId}
                className="flex items-start gap-4 border border-border bg-warden-surface p-4"
              >
                <div className="shrink-0 size-16 bg-warden-carbon border border-border flex items-center justify-center text-muted-foreground/30">
                  <span className="text-2xl">
                    {item.product?.categoryId === "cat-escenografia"
                      ? "⛰"
                      : item.product?.categoryId === "cat-terreno"
                        ? "🌋"
                        : item.product?.categoryId === "cat-mapas"
                          ? "🗺"
                          : item.product?.categoryId === "cat-escenarios"
                            ? "🎯"
                            : item.product?.categoryId === "cat-complementarios"
                              ? "⚙"
                              : "📦"}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-foreground">
                    {item.product ? (
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="hover:text-warden-blue transition-colors"
                      >
                        {item.productName}
                      </Link>
                    ) : (
                      item.productName
                    )}
                  </h3>
                  {item.product?.shortDescription && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {item.product.shortDescription}
                    </p>
                  )}
                  <p className="text-data text-foreground/80 mt-1">
                    ${item.unitPrice.toFixed(2)}{" "}
                    <span className="text-spec-label text-muted-foreground">
                      USD / unit
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center border border-border">
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3" />
                    </button>
                    <span className="w-8 text-center text-sm tabular-nums text-foreground">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3" />
                    </button>
                  </div>

                  <span className="text-data text-muted-foreground w-16 text-right tabular-nums">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeItem(item.productId)}
                    className="size-8 flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors"
                    aria-label={`Remove ${item.productName}`}
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            <SectionDivider />

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {items.reduce((s, i) => s + i.quantity, 0)} items selected
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">
                  Orientative Subtotal:{" "}
                </span>
                <span className="text-data text-foreground tabular-nums">
                  ${subtotal.toFixed(2)}
                </span>
              </p>
            </div>

            <div className="bg-warden-blue/5 border border-warden-blue/20 p-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                <strong className="text-foreground">Important:</strong> The
                prices shown are orientative and do not constitute a final
                quote. Final pricing, availability, and delivery times will be
                confirmed in our response. Submitting this request does not
                imply any obligation to purchase.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <SelectionSummary />

            <div className="border border-border bg-warden-surface p-6">
              <h2 className="text-base font-semibold text-foreground mb-1">
                Request a Quote
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                We respond within 2 business days.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-1.5">
                  <label
                    htmlFor="sel-name"
                    className="text-spec-label text-muted-foreground"
                  >
                    Name <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="sel-name"
                    name="name"
                    placeholder="Your full name"
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
                    placeholder="you@example.com"
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
                    Country / Province{" "}
                    <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="sel-country"
                    name="country"
                    placeholder="e.g. Spain, Madrid"
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
                    Query Type <span className="text-destructive">*</span>
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
                      Select type...
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
                    Message <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="sel-message"
                    name="message"
                    placeholder="Tell us about your project, preferred shipping method, or any special requirements..."
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
                    I understand that this request does not imply any obligation
                    to purchase and that the final quote will be provided by the
                    WARDEN team.
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
                    "Sending Request..."
                  ) : (
                    <>
                      Send Request
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
