import type { Metadata } from "next";
import Link from "next/link";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ── Compact DropCard for secondary listing ─────
function CompactDropCard({
  drop,
  variant,
}: {
  drop: Drop;
  variant: "live" | "upcoming" | "ended";
}) {
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
            Activo
          </span>
        )}
        {variant === "upcoming" && (
          <span className="text-eyebrow text-muted-foreground">Próximo</span>
        )}
        {variant === "ended" && (
          <span className="text-eyebrow text-muted-foreground">Finalizado</span>
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
          {formatDate(drop.startsAt)}
          {drop.endsAt && <> — {formatDate(drop.endsAt)}</>}
        </span>
        {!isMuted && (
          <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
            Ver <ChevronRight className="size-3" />
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
function buildCampaignConfig(
  activeDrop: Drop,
  featuredProducts: Array<{ id: string; name: string; slug: string; shortDescription: string; images: ProductImage[]; compatibilityId: string }>,
  compatibilitySystems: CompatibilitySystem[]
): CampaignConfig {
  const productCount = featuredProducts.length;
  const allImages = getAllDropImages(activeDrop, featuredProducts);
  const heroImage = activeDrop.thumbnailUrl || undefined;
  const scenarioImage =
    featuredProducts[0]?.images.find((img) => img.isPrimary)?.url || heroImage;

  return {
    metadata: {
      id: activeDrop.id,
      slug: activeDrop.slug,
      name: activeDrop.name,
      subtitle: activeDrop.description,
      status: activeDrop.status,
      ctaLabel: "Discover the Drop",
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
          ctaLabel: "Explore the Drop",
          ctaHref: `/drops/${activeDrop.slug}`,
          theme: activeDrop.theme ?? undefined,
          trailerSrc: "/videos/battle-of-tukayyid.mp4",
          trailerPoster: heroImage,
        },
      },
      {
        type: "origins",
        props: {
          eyebrow: activeDrop.theme ?? "Edición limitada",
          title: activeDrop.name,
          body: `${productCount} pieza${productCount !== 1 ? "s" : ""} exclusiva${productCount !== 1 ? "s" : ""} diseñada${productCount !== 1 ? "s" : ""} para coleccionistas y entusiastas de BattleTech. Una edición que recupera la esencia del universo clásico con el acabado y la precisión de WARDEN.`,
          imageUrl: heroImage,
          imageAlt: activeDrop.name,
        },
      },
      {
        type: "scenario",
        props: {
          eyebrow: "El escenario",
          title: activeDrop.theme ?? "Una experiencia única",
          body: "Cada pieza transporta al universo de la campaña. Los diseños evocan la atmósfera, la escala y la narrativa del escenario original.",
          imageUrl: scenarioImage,
          imageAlt: activeDrop.theme ?? activeDrop.name,
          imagePosition: "left",
        },
      },
      {
        type: "design",
        props: {
          eyebrow: "Design by WARDEN",
          title: "Trabajo de diseño",
          description: "Renders y detalles del proceso creativo. Cada pieza ha sido revisada para ofrecer la mejor experiencia de impresión y juego.",
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
          closing: `${productCount} pieza${productCount !== 1 ? "s" : ""} exclusiva${productCount !== 1 ? "s" : ""} en una edición limitada. Todo el contenido ha sido seleccionado para ofrecer una experiencia única dentro del universo BattleTech.`,
          highlights: [
            ...(activeDrop.theme
              ? [{ label: "Temática", value: activeDrop.theme, icon: "◆" }]
              : []),
            {
              label: "Estado",
              value:
                activeDrop.status === "live"
                  ? "Disponible"
                  : activeDrop.status === "upcoming"
                    ? "Próximo"
                    : "Finalizado",
            },
            { label: "Productos", value: `${productCount}` },
            ...(compatibilitySystems.length > 0
              ? [
                  {
                    label: "Compatibilidad",
                    value: compatibilitySystems
                      .map((cs) => cs.name)
                      .join(", "),
                  },
                ]
              : []),
          ],
          ctaLabel: "Discover the Drop",
          ctaHref: `/drops/${activeDrop.slug}`,
          status: activeDrop.status,
        },
      },
    ],
  };
}

// ── Page ───────────────────────────────────────
export default async function DropsPage() {
  const [drops, products, compatibilitySystems] = await Promise.all([
    getDrops(),
    getActiveProducts(),
    getCompatibilitySystems(),
  ]);

  const live = drops.filter((d) => d.status === "live");
  const upcoming = drops.filter((d) => d.status === "upcoming");
  const ended = drops.filter((d) => d.status === "ended");
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
          config={buildCampaignConfig(activeDrop, featuredProducts, compatibilitySystems)}
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
                    Próximos lanzamientos
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {upcoming
                      .filter((d) => d.id !== activeDrop.id)
                      .map((drop) => (
                        <CompactDropCard
                          key={drop.id}
                          drop={drop}
                          variant="upcoming"
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
                    Drops anteriores
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {ended.map((drop) => (
                      <CompactDropCard
                        key={drop.id}
                        drop={drop}
                        variant="ended"
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
              Campañas WARDEN
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Las campañas son lanzamientos periódicos de ediciones especiales y
              productos de temporada. Cuando haya una campaña activa, aparecerá aquí.
            </p>
            <p className="mt-2 text-xs text-muted-foreground/60">
              Mientras tanto, puedes explorar el catálogo permanente o nuestros
              bundles.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <WardenButton href="/catalog">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/bundles" variant="outline">
                Ver bundles
              </WardenButton>
            </div>
          </div>
        )}

        {!hasActive && ended.length > 0 && (
          <>
            <div className="max-w-2xl mb-14">
              <Eyebrow>Campañas temporales</Eyebrow>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Campañas WARDEN
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                No hay campañas activas en este momento. Todos los productos de
                campañas anteriores pueden seguir adquiriéndose a través del catálogo
                general.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 mb-12">
              <WardenButton href="/catalog">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/bundles" variant="outline">
                Ver bundles
              </WardenButton>
            </div>

            {ended.length > 0 && (
              <div>
                <SectionDivider className="mb-8" />
                <h2 className="text-xl font-semibold text-foreground/60 mb-6 flex items-center gap-2">
                  <Layers className="size-5" />
                  Campañas anteriores
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {ended.map((drop) => (
                    <CompactDropCard
                      key={drop.id}
                      drop={drop}

                      variant="ended"
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
