import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section, Eyebrow } from "@/components/shared/container";
import {
  drops,
  compatibilitySystems,
  getDropBySlug,
  getProductsByIds,
} from "@/data/warden-catalog";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { WardenButton } from "@/components/ui/warden-button";
import {
  ArrowLeft,
  CalendarDays,
  Timer,
  Info,
  ArrowUpRight,
} from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function formatShortDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function generateStaticParams() {
  return drops.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const drop = getDropBySlug(slug);
  if (!drop) return { title: "Drop Not Found" };

  const statusLabel =
    drop.status === "live"
      ? "Active"
      : drop.status === "upcoming"
        ? "Upcoming"
        : "Ended";

  return {
    title: `${drop.name} — WARDEN Drops`,
    description: `${statusLabel} — ${drop.description.slice(0, 120)}`,
    openGraph: {
      title: `${drop.name} — WARDEN`,
      description: drop.description,
    },
  };
}

export default async function DropDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const drop = getDropBySlug(slug);

  if (!drop) notFound();

  const dropProducts = getProductsByIds(drop.productIds);
  const isLive = drop.status === "live";
  const isUpcoming = drop.status === "upcoming";
  const isEnded = drop.status === "ended";

  const compatIds = [...new Set(dropProducts.map((p) => p.compatibilityId))];
  const compatSystems = compatIds
    .map((id) => compatibilitySystems.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Section>
      <Container>
        <Link
          href="/drops"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Todos los drops
        </Link>

        {/* Hero */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12 items-start">
          {/* Visual */}
          <div
            className={`aspect-square border overflow-hidden flex items-center justify-center ${
              isEnded
                ? "border-border bg-warden-carbon/60"
                : "border-border bg-warden-surface"
            }`}
          >
            <div className="text-center px-4">
              <Timer
                className={`size-12 mx-auto mb-4 ${
                  isLive
                    ? "text-warden-blue/50"
                    : isEnded
                      ? "text-muted-foreground/20"
                      : "text-muted-foreground/30"
                }`}
              />
              <p
                className={`text-eyebrow max-w-[260px] mx-auto leading-relaxed ${
                  isEnded
                    ? "text-muted-foreground/30"
                    : "text-muted-foreground/40"
                }`}
              >
                {drop.name}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {/* Status badge */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {isLive && (
                <TechnicalBadge variant="blue">
                  <span className="size-1.5 rounded-full bg-warden-blue animate-pulse mr-1.5" />
                  Activo
                </TechnicalBadge>
              )}
              {isUpcoming && (
                <TechnicalBadge variant="neutral">Próximo</TechnicalBadge>
              )}
              {isEnded && (
                <TechnicalBadge variant="neutral">Finalizado</TechnicalBadge>
              )}
              {drop.theme && (
                <TechnicalBadge variant="neutral">{drop.theme}</TechnicalBadge>
              )}
            </div>

            <h1
              className={`text-2xl font-semibold tracking-tight sm:text-3xl leading-tight ${
                isEnded ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {drop.name}
            </h1>

            <p
              className={`mt-4 text-sm leading-relaxed ${
                isEnded
                  ? "text-muted-foreground/60"
                  : "text-muted-foreground"
              }`}
            >
              {drop.description}
            </p>

            {/* Dates */}
            <div className="mt-6 space-y-3">
              <div className="flex items-start gap-3">
                <CalendarDays className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-spec-label text-muted-foreground">
                    Inicio
                  </p>
                  <p className="text-data text-foreground/90">
                    {formatDate(drop.startsAt)}
                  </p>
                </div>
              </div>
              {drop.endsAt && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-spec-label text-muted-foreground">
                      Fin
                    </p>
                    <p className="text-data text-foreground/90">
                      {formatDate(drop.endsAt)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Product count */}
            <div className="mt-4 text-spec-label text-muted-foreground">
              {dropProducts.length} producto
              {dropProducts.length !== 1 ? "s" : ""} incluido
              {dropProducts.length !== 1 ? "s" : ""}
            </div>

            {/* CTA for live drops */}
            {isLive && (
              <div className="mt-6">
                <WardenButton href="/selection">
                  Ir a Mi Selección
                  <ArrowUpRight className="size-4" />
                </WardenButton>
              </div>
            )}

            {/* Temporal notice — sobrio */}
            <div className="mt-6 pt-4 border-t border-border flex items-start gap-3">
              <Info className="size-4 text-muted-foreground/50 mt-0.5 shrink-0" />
              <div>
                {isLive && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    Este drop estará disponible hasta el{" "}
                    <span className="text-foreground/70">
                      {drop.endsAt ? formatShortDate(drop.endsAt) : "su finalización"}
                    </span>
                    . Los productos incluidos pueden adquirirse individualmente
                    durante este período. Pasada la fecha, el drop se cerrará y
                    los productos volverán al catálogo general si están
                    disponibles.
                  </p>
                )}
                {isUpcoming && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    Este drop se abrirá el{" "}
                    <span className="text-foreground/70">
                      {formatShortDate(drop.startsAt)}
                    </span>
                    . Los productos se podrán adquirir individualmente durante
                    la ventana de disponibilidad.
                  </p>
                )}
                {isEnded && (
                  <p className="text-xs text-muted-foreground/40 leading-relaxed">
                    Este drop ha finalizado. Los productos pueden estar
                    disponibles en el catálogo general si el stock lo permite.
                  </p>
                )}
              </div>
            </div>

            {/* Compatibility */}
            {compatSystems.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <p className="text-spec-label text-muted-foreground">
                  Sistemas compatibles
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  {compatSystems.map(
                    (cs) =>
                      cs && (
                        <CompatibilityBadge
                          key={cs.id}
                          system={
                            cs.slug as
                              | "battletech-classic"
                              | "alpha-strike"
                              | "aerotech"
                          }
                        />
                      )
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Included Products */}
        <div className="mb-12">
          <h2 className="text-xl font-semibold tracking-tight text-foreground mb-2">
            Productos incluidos
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {dropProducts.length} producto
            {dropProducts.length !== 1 ? "s" : ""} en este drop
            {isLive ? " — disponibles ahora." : isUpcoming ? " — disponibles al inicio del drop." : "."}
          </p>

          {dropProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dropProducts.map((product) => {
                const compatSystem = compatibilitySystems.find(
                  (c) => c.id === product.compatibilityId
                );
                const primaryImage = product.images.find(
                  (img) => img.isPrimary
                );

                return (
                  <div
                    key={product.id}
                    className={`border p-5 flex flex-col ${
                      isEnded
                        ? "border-border bg-warden-surface/50"
                        : "border-border bg-warden-surface"
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {compatSystem && (
                          <CompatibilityBadge
                            system={
                              compatSystem.slug as
                                | "battletech-classic"
                                | "alpha-strike"
                                | "aerotech"
                            }
                          />
                        )}
                      </div>
                      <span
                        className={`text-data shrink-0 ${
                          isEnded
                            ? "text-muted-foreground/50"
                            : "text-foreground/80"
                        }`}
                      >
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="group inline"
                    >
                      <h3
                        className={`font-semibold text-sm leading-snug transition-colors ${
                          isEnded
                            ? "text-muted-foreground"
                            : "text-foreground group-hover:text-warden-blue"
                        }`}
                      >
                        {product.name}
                      </h3>
                    </Link>

                    <p
                      className={`mt-1.5 text-xs leading-relaxed line-clamp-2 flex-1 ${
                        isEnded
                          ? "text-muted-foreground/50"
                          : "text-muted-foreground"
                      }`}
                    >
                      {product.shortDescription}
                    </p>

                    <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
                      <WardenButton
                        variant="ghost"
                        size="sm"
                        href={`/products/${product.slug}`}
                      >
                        Ver producto
                        <ArrowUpRight className="size-3" />
                      </WardenButton>
                      <div className="ml-auto">
                        <AddToSelectionButton
                          productId={product.id}
                          productName={product.name}
                          unitPrice={product.price}
                          productSlug={product.slug}
                          productImage={primaryImage?.url}
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-border bg-warden-surface">
              <p className="text-sm text-muted-foreground">
                Este drop no tiene productos asignados.
              </p>
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div className="border-t border-border pt-8 flex flex-wrap gap-3">
          {isLive && (
            <WardenButton href="/selection">
              Ir a Mi Selección
              <ArrowUpRight className="size-4" />
            </WardenButton>
          )}
          <WardenButton href="/catalog" variant="outline">
            Explorar catálogo
          </WardenButton>
          <WardenButton href="/drops" variant="ghost">
            Ver todos los drops
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
