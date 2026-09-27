import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, getLocale } from "next-intl/server";

import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import {
  getDrops,
  getActiveProducts,
  getCompatibilitySystems,
} from "@/lib/data";
import type { Drop, CompatibilitySystem, ProductImage } from "@/types/warden";
import { TechnicalBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight, Timer, Layers } from "lucide-react";
import { resolveDropStatus } from "@/lib/drop-status";
import { formatPriceEUR } from "@/lib/utils";

// ── Campaign blocks ────────────────────────────
import {
  CampaignRenderer,
} from "@/components/campaign";
import type { CampaignConfig } from "@/types/campaign";

export const metadata: Metadata = {
  title: "Drops — Campañas WARDEN",
  description:
    "Lanzamientos temporales y ediciones limitadas de accesorios 3D para BattleTech. Cada campaña presenta una experiencia narrativa única.",
};

function formatDate(iso: string, locale: string) {
  return new Date(iso).toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Compact DropCard for secondary listing ─────
async function CompactDropCard({
  drop,
  variant,
  locale,
}: {
  drop: Drop;
  variant: "live" | "upcoming" | "ended";
  locale: string;
}) {
  const t = await getTranslations("drops");
  const tCommon = await getTranslations("common");
  const isMuted = variant === "ended";

  return (
    <Link
      href={`/drops/${drop.slug}`}
      className={`group flex flex-col border p-5 transition-colors ${
        isMuted
          ? "border-border bg-warden-surface/40 opacity-60 hover:opacity-90"
          : variant === "live"
            ? "border-warden-blue/30 bg-warden-surface hover:border-warden-blue/50"
            : "border-border bg-warden-surface hover:border-warden-blue/20"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-2">
        {variant === "live" && (
          <span className="inline-flex items-center gap-1.5 text-eyebrow text-warden-blue">
            <span className="size-1.5 rounded-full bg-warden-blue animate-pulse" />
            {t("status.live")}
          </span>
        )}
        {variant === "upcoming" && (
          <span className="text-eyebrow text-muted-foreground">{t("status.upcoming")}</span>
        )}
        {variant === "ended" && (
          <span className="text-eyebrow text-muted-foreground">{t("status.ended")}</span>
        )}
        {drop.theme && !isMuted && (
          <TechnicalBadge variant={variant === "live" ? "blue" : "neutral"}>
            {drop.theme}
          </TechnicalBadge>
        )}
      </div>

      <h3
        className={`text-sm font-semibold leading-snug transition-colors ${
          isMuted ? "text-muted-foreground" : "text-foreground group-hover:text-warden-blue"
        }`}
      >
        {drop.name}
      </h3>

      <p className="mt-1 text-xs text-muted-foreground line-clamp-1 leading-relaxed flex-1">
        {drop.description}
      </p>

      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
        <span className="text-spec-label text-muted-foreground">
          {formatDate(drop.startsAt, locale)}
          {drop.endsAt && <> — {formatDate(drop.endsAt, locale)}</>}
        </span>
        {!isMuted && (
          <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
            {tCommon("view")} <ChevronRight className="size-3" />
          </span>
        )}
      </div>
    </Link>
  );
}

// ── Drop data helpers ──────────────────────────
function getAllDropImages(drop: Drop, products: Array<{ id: string; images: ProductImage[] }>): Array<{ url: string; alt: string }> {
  const dropProducts = products.filter((p) => drop.productIds.includes(p.id));
  const images: Array<{ url: string; alt: string }> = [];
  for (const p of dropProducts) {
    for (const img of p.images) {
      images.push({ url: img.url, alt: img.alt });
    }
  }
  return images.slice(0, 6); // Max 6 for the gallery
}

// ── Active campaign landing (declarative) ──────
async function buildCampaignConfig(
  activeDrop: Drop,
  featuredProducts: Array<{ id: string; name: string; slug: string; shortDescription: string; images: ProductImage[]; compatibilityId: string }>,
  compatibilitySystems: CompatibilitySystem[]
): Promise<CampaignConfig> {
  const t = await getTranslations("drops");
  const productCount = featuredProducts.length;
  const allImages = getAllDropImages(activeDrop, featuredProducts);
  const heroImage = activeDrop.thumbnailUrl || undefined;
  const scenarioImage =
    featuredProducts[0]?.images.find((img) => img.isPrimary)?.url || heroImage;
  const effectiveStatus = resolveDropStatus(activeDrop);
  const isEffectivelyLive = effectiveStatus === "live";

  return {
    metadata: {
      id: activeDrop.id,
      slug: activeDrop.slug,
      name: activeDrop.name,
      subtitle: activeDrop.description,
      status: activeDrop.status,
      ctaLabel: t("discover"),
      pdpSlug: activeDrop.slug,
    },
    assets: {
      heroImage,
      trailerVideo: "/videos/battle-of-tukayyid.mp4",
      trailerPoster: heroImage,
      images: allImages,
      renders: featuredProducts.slice(0, 6).map((p) => ({
        url: p.images.find((img) => img.isPrimary)?.url ?? "",
        alt: p.name,
        caption: p.name,
      })),
    },
    blocks: [
      {
        type: "hero",
        props: {
          title: activeDrop.name,
          subtitle: activeDrop.description,
          imageUrl: heroImage,
          ctaLabel: t("explore"),
          ctaHref: `/drops/${activeDrop.slug}`,
          theme: activeDrop.theme ?? undefined,
          trailerSrc: "/videos/battle-of-tukayyid.mp4",
          trailerPoster: heroImage,
        },
      },
      {
        type: "origins",
        props: {
          eyebrow: activeDrop.theme ?? t("limitedEdition"),
          title: activeDrop.name,
          body: t("origins.body", { count: productCount }),
          imageUrl: heroImage,
          imageAlt: activeDrop.name,
        },
      },
      {
        type: "scenario",
        props: {
          eyebrow: t("scenario.eyebrow"),
          title: activeDrop.theme ?? t("scenario.fallbackTitle"),
          body: t("scenario.body"),
          imageUrl: scenarioImage,
          imageAlt: activeDrop.theme ?? activeDrop.name,
          imagePosition: "left",
        },
      },
      {
        type: "design",
        props: {
          eyebrow: "Design by WARDEN",
          title: t("design.title"),
          description: t("design.desc"),
          items: featuredProducts.slice(0, 6).map((p) => ({
            imageUrl: p.images.find((img) => img.isPrimary)?.url ?? "",
            imageAlt: p.name,
            caption: p.name,
          })),
        },
      },
      ...(allImages.length > 0
        ? [
            {
              type: "gallery" as const,
              props: { images: allImages },
            },
          ]
        : []),
      ...(featuredProducts.length > 0
        ? [
            {
              type: "products" as const,
              props: {
                products: featuredProducts.map((p) => ({
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  shortDescription: p.shortDescription,
                  imageUrl: p.images.find((img) => img.isPrimary)?.url,
                  imageAlt: p.images.find((img) => img.isPrimary)?.alt,
                  compatSystem: compatibilitySystems.find(
                    (c) => c.id === p.compatibilityId
                  ) ?? null,
                })),
              },
            },
          ]
        : []),
      {
        type: "cta",
        props: {
          title: activeDrop.name,
          closing: t("cta.closing", { count: productCount }),
          highlights: [
            ...(activeDrop.theme
              ? [{ label: t("field.theme"), value: activeDrop.theme, icon: "◆" }]
              : []),
            {
              label: t("field.status"),
              value:
                isEffectivelyLive
                  ? t("status.available")
                  : effectiveStatus === "upcoming"
                    ? t("status.upcoming")
                    : t("status.ended"),
            },
            ...(isEffectivelyLive && activeDrop.price != null
              ? [{ label: t("field.price"), value: formatPriceEUR(activeDrop.price), icon: "◆" as const }]
              : []),
            { label: t("field.products"), value: `${productCount}` },
            ...(compatibilitySystems.length > 0
              ? [
                  {
                    label: t("field.compatibility"),
                    value: compatibilitySystems
                      .map((cs) => cs.name)
                      .join(", "),
                  },
                ]
              : []),
          ],
          ctaLabel: t("discover"),
          ctaHref: `/drops/${activeDrop.slug}`,
          status: activeDrop.status,
        },
      },
    ],
  };
}

// ── Page ───────────────────────────────────────
export default async function DropsPage() {
  const t = await getTranslations("drops");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();

  const [drops, products, compatibilitySystems] = await Promise.all([
    getDrops(),
    getActiveProducts(),
    getCompatibilitySystems(),
  ]);

  // Estado efectivo de presentación (R053A): deriva de status + fechas + precio,
  // no solo del campo `status` almacenado.
  const now = new Date();
  const effectiveStatusOf = (d: Drop) => resolveDropStatus(d, now);

  const live = drops.filter((d) => effectiveStatusOf(d) === "live");
  const upcoming = drops.filter((d) => effectiveStatusOf(d) === "upcoming");
  const ended = drops.filter((d) => effectiveStatusOf(d) === "ended");
  const hasActive = live.length > 0 || upcoming.length > 0;

  const activeDrop = live[0] ?? upcoming[0] ?? null;

  if (activeDrop) {
    const featuredProducts = products.filter((p) =>
      activeDrop.productIds.includes(p.id)
    );

    return (
      <>
        {/* ── Campaign Landing (declarative) ── */}
        <CampaignRenderer
          config={await buildCampaignConfig(activeDrop, featuredProducts, compatibilitySystems)}
        />

        {/* ── Other drops (compact listing) ── */}
        {(upcoming.length > (upcoming[0] === activeDrop ? 0 : 1) || ended.length > 0) && (
          <Section>
            <Container>
              <SectionDivider className="mb-10" />

              {/* Other upcoming */}
              {upcoming.filter((d) => d.id !== activeDrop.id).length > 0 && (
                <div className="mb-10">
                  <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Timer className="size-4 text-muted-foreground" />
                    {t("upcoming")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming
                      .filter((d) => d.id !== activeDrop.id)
                      .map((drop) => (
                        <CompactDropCard
                          key={drop.id}
                          drop={drop}
                          variant="upcoming"
                          locale={locale}
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Previous drops */}
              {ended.length > 0 && (
                <div>
                  <h2 className="text-lg font-semibold text-foreground/60 mb-4 flex items-center gap-2">
                    <Layers className="size-4 text-muted-foreground" />
                    {t("previous")}
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ended.map((drop) => (
                      <CompactDropCard
                        key={drop.id}
                        drop={drop}
                        variant="ended"
                        locale={locale}
                      />
                    ))}
                  </div>
                </div>
              )}
            </Container>
          </Section>
        )}
      </>
    );
  }

  // ── Fallback: no active drops ────────────────
  return (
    <Section>
      <Container>
        {!hasActive && ended.length === 0 && (
          <div className="text-center py-20 max-w-lg mx-auto">
            <div className="size-16 mx-auto mb-6 rounded-full border border-border bg-warden-surface flex items-center justify-center">
              <Timer className="size-7 text-muted-foreground/40" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {t("campaignsTitle")}
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t("empty.desc")}
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              {t("empty.note")}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WardenButton href="/catalog">
                {tCommon("exploreCatalog")}
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/bundles" variant="outline">
                {tCommon("viewBundles")}
              </WardenButton>
            </div>
          </div>
        )}

        {!hasActive && ended.length > 0 && (
          <>
            <div className="max-w-2xl mb-14">
              <Eyebrow>{t("temporalCampaigns")}</Eyebrow>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                {t("campaignsTitle")}
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {t("noActive.desc")}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              <WardenButton href="/catalog">
                {tCommon("exploreCatalog")}
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/bundles" variant="outline">
                {tCommon("viewBundles")}
              </WardenButton>
            </div>

            {ended.length > 0 && (
              <div>
                <SectionDivider className="mb-8" />
                <h2 className="text-xl font-semibold text-foreground/60 mb-6 flex items-center gap-2">
                  <Layers className="size-5" />
                  {t("previousCampaigns")}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ended.map((drop) => (
                    <CompactDropCard
                      key={drop.id}
                      drop={drop}

                      variant="ended"
                      locale={locale}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </Section>
  );
}
