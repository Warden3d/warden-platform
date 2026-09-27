import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, getLocale } from "next-intl/server";

import { Container, Section } from "@/components/shared/container";
import {
  getDropBySlug,
  getActiveProducts,
  getCompatibilitySystems,
} from "@/lib/data";
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
import { resolveDropStatus } from "@/lib/drop-status";
import { formatPriceEUR } from "@/lib/utils";

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function formatShortDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const drop = await getDropBySlug(slug);
  if (!drop) return { title: "Drop no encontrado" };

  const statusLabel =
    drop.status === "live"
      ? "Activo"
      : drop.status === "upcoming"
        ? "Próximo"
        : "Finalizado";

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
  const t = await getTranslations("drops");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  const [drop, compatibilitySystems, allProducts] = await Promise.all([
    getDropBySlug(slug),
    getCompatibilitySystems(),
    getActiveProducts(),
  ]);

  if (!drop) notFound();

  const dropProducts = allProducts.filter((p) =>
    drop.productIds.includes(p.id)
  );
  // Estado efectivo (R053A): status + fechas + precio válido. Un Drop
  // caducado se presenta como ended aunque su campo status siga en "live".
  const effectiveStatus = resolveDropStatus(drop);
  const isLive = effectiveStatus === "live";
  const isUpcoming = effectiveStatus === "upcoming";
  const isEnded = effectiveStatus === "ended";

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
          {t("allDrops")}
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
                  {t("status.live")}
                </TechnicalBadge>
              )}
              {isUpcoming && (
                <TechnicalBadge variant="neutral">{t("status.upcoming")}</TechnicalBadge>
              )}
              {isEnded && (
                <TechnicalBadge variant="neutral">{t("status.ended")}</TechnicalBadge>
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
                    {t("dateStart")}
                  </p>
                  <p className="text-data text-foreground/90">
                    {formatDate(drop.startsAt, locale)}
                  </p>
                </div>
              </div>
              {drop.endsAt && (
                <div className="flex items-start gap-3">
                  <CalendarDays className="size-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-spec-label text-muted-foreground">
                      {t("dateEnd")}
                    </p>
                    <p className="text-data text-foreground/90">
                      {formatDate(drop.endsAt, locale)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Product count */}
            <div className="mt-4 text-spec-label text-muted-foreground">
              {t("productsIncluded", { count: dropProducts.length })}
            </div>

            {/* Precio real del Drop (solo cuando existe y es efectivamente activo) */}
            {isLive && drop.price != null && (
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-spec-label text-muted-foreground">
                  {t("field.price")}
                </span>
                <span className="text-2xl font-semibold text-foreground tracking-tight">
                  {formatPriceEUR(drop.price)}
                </span>
              </div>
            )}

            {/* CTA for live drops (solo si el Drop es efectivamente activo) */}
            {isLive && drop.price != null && (
              <div className="mt-6">
                <AddToSelectionButton
                  entityId={drop.id}
                  entityType="drop"
                  name={drop.name}
                  unitPrice={drop.price}
                  slug={drop.slug}
                  fullWidth
                />
              </div>
            )}

            {/* Temporal notice — sobrio */}
            <div className="mt-6 pt-4 border-t border-border flex items-start gap-3">
              <Info className="size-4 text-muted-foreground/50 mt-0.5 shrink-0" />
              <div>
                {isLive && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    {t("notice.livePrefix")}
                    <span className="text-foreground/70">
                      {drop.endsAt
                        ? formatShortDate(drop.endsAt, locale)
                        : t("notice.untilEnd")}
                    </span>
                    {t("notice.liveSuffix")}
                  </p>
                )}
                {isUpcoming && (
                  <p className="text-xs text-muted-foreground/60 leading-relaxed">
                    {t("notice.upcomingPrefix")}
                    <span className="text-foreground/70">
                      {formatShortDate(drop.startsAt, locale)}
                    </span>
                    {t("notice.upcomingSuffix")}
                  </p>
                )}
                {isEnded && (
                  <p className="text-xs text-muted-foreground/40 leading-relaxed">
                    {t("notice.ended")}
                  </p>
                )}
              </div>
            </div>

            {/* Compatibility */}
            {compatSystems.length > 0 && (
              <div className="mt-6 pt-4 border-t border-border space-y-2">
                <p className="text-spec-label text-muted-foreground">
                  {t("compatibleSystems")}
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
            {t("products.title")}
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            {t("products.count", {
              count: dropProducts.length,
              status: isLive ? "live" : isUpcoming ? "upcoming" : "ended",
            })}
          </p>

          {dropProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {dropProducts.map((product) => {
                const compatSystem = compatibilitySystems.find(
                  (c) => c.id === product.compatibilityId
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

                    <div className="mt-4 pt-3 border-t border-border">
                      <WardenButton
                        variant="ghost"
                        size="sm"
                        href={`/products/${product.slug}`}
                      >
                        {tCommon("viewProduct")}
                        <ArrowUpRight className="size-3" />
                      </WardenButton>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 border border-border bg-warden-surface">
              <p className="text-sm text-muted-foreground">
                {t("products.empty")}
              </p>
            </div>
          )}
        </div>

        {/* Navegación inferior */}
        <div className="border-t border-border pt-8 flex flex-wrap gap-3">
          <WardenButton href="/drops" variant="ghost">
            <ArrowLeft className="size-4" />
            {t("viewAll")}
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
