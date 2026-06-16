import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { drops, products, compatibilitySystems } from "@/data/warden-catalog";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight, Timer, Archive } from "lucide-react";

export const metadata: Metadata = {
  title: "Drops",
  description:
    "Limited production runs and launch drops from WARDEN. Time-limited availability on special editions and new product launches.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DropCard({
  drop,
  variant,
}: {
  drop: (typeof drops)[number];
  variant: "live" | "upcoming" | "ended";
}) {
  const dropProducts = products.filter((p) => drop.productIds.includes(p.id));
  const compatIds = [...new Set(dropProducts.map((p) => p.compatibilityId))];
  const compatSystems = compatIds
    .map((id) => compatibilitySystems.find((c) => c.id === id))
    .filter(Boolean);

  const isMuted = variant === "ended";

  return (
    <Link
      href={`/drops/${drop.slug}`}
      className={`group flex flex-col border p-6 transition-colors ${
        isMuted
          ? "border-border bg-warden-surface/50 opacity-55 hover:opacity-80"
          : variant === "live"
            ? "border-warden-blue/30 bg-warden-surface hover:border-warden-blue/50"
            : "border-border bg-warden-surface hover:border-warden-blue/20"
      }`}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        {variant === "live" && (
          <span className="inline-flex items-center gap-1.5 text-eyebrow text-warden-blue">
            <span className="size-1.5 rounded-full bg-warden-blue animate-pulse" />
            Activo ahora
          </span>
        )}
        {variant === "upcoming" && (
          <span className="text-eyebrow text-muted-foreground">Próximo</span>
        )}
        {variant === "ended" && (
          <span className="text-eyebrow text-muted-foreground">Finalizado</span>
        )}

        {drop.theme && (
          <TechnicalBadge variant={variant === "live" ? "blue" : "neutral"}>
            {drop.theme}
          </TechnicalBadge>
        )}
      </div>

      <h2
        className={`text-lg font-semibold tracking-tight leading-snug transition-colors ${
          isMuted
            ? "text-muted-foreground"
            : "text-foreground group-hover:text-warden-blue"
        }`}
      >
        {drop.name}
      </h2>

      <p
        className={`mt-2 text-sm leading-relaxed flex-1 line-clamp-2 ${
          isMuted ? "text-muted-foreground/60" : "text-muted-foreground"
        }`}
      >
        {drop.description}
      </p>

      {/* Compatibility */}
      {compatSystems.length > 0 && !isMuted && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
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
      )}

      {/* Dates */}
      <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-spec-label text-muted-foreground">
          <Timer className="size-3.5" />
          <span>
            {formatDate(drop.startsAt)}
            {drop.endsAt && <> — {formatDate(drop.endsAt)}</>}
          </span>
        </div>
        {!isMuted && (
          <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
            Ver drop <ChevronRight className="size-3" />
          </span>
        )}
      </div>
    </Link>
  );
}

export default function DropsPage() {
  const live = drops.filter((d) => d.status === "live");
  const upcoming = drops.filter((d) => d.status === "upcoming");
  const ended = drops.filter((d) => d.status === "ended");
  const hasActive = live.length > 0 || upcoming.length > 0;

  return (
    <Section>
      <Container>
        {/* ── No drops at all ──────────────────────── */}
        {!hasActive && ended.length === 0 && (
          <div className="text-center py-20 max-w-lg mx-auto">
            <div className="size-16 mx-auto mb-6 rounded-full border border-border bg-warden-surface flex items-center justify-center">
              <Timer className="size-7 text-muted-foreground/40" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Drops
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Los drops son lanzamientos periódicos de ediciones especiales y
              productos de temporada. Cuando haya un drop activo, aparecerá aquí.
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

        {/* ── Only ended drops remain ──────────────── */}
        {!hasActive && ended.length > 0 && (
          <>
            <div className="max-w-2xl mb-14">
              <Eyebrow>Lanzamientos temporales</Eyebrow>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Drops
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                No hay drops activos en este momento. Los drops son lanzamientos
                periódicos de duración limitada. Todos los productos de drops
                anteriores pueden seguir adquiriéndose a través del catálogo
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
                  <Archive className="size-5" />
                  Drops anteriores
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ended.map((drop) => (
                    <DropCard key={drop.id} drop={drop} variant="ended" />
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Has active drops ─────────────────────── */}
        {hasActive && (
          <>
            <div className="max-w-3xl mb-14">
              <Eyebrow className="text-warden-blue">Lanzamientos temporales</Eyebrow>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Drops
              </h1>
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                Lanzamientos por tiempo limitado. Cada drop está disponible
                durante una ventana definida. Los productos pueden adquirirse
                individualmente durante el período activo.
              </p>
            </div>

            {/* Live */}
            {live.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <span className="size-2 rounded-full bg-warden-blue animate-pulse" />
                  Activos
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {live.map((drop) => (
                    <DropCard key={drop.id} drop={drop} variant="live" />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcoming.length > 0 && (
              <div className="mb-10">
                <SectionDivider className="mb-8" />
                <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-2">
                  <Timer className="size-5 text-muted-foreground" />
                  Próximos
                </h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  {upcoming.map((drop) => (
                    <DropCard key={drop.id} drop={drop} variant="upcoming" />
                  ))}
                </div>
              </div>
            )}

            {/* Past */}
            {ended.length > 0 && (
              <div>
                <SectionDivider className="mb-8" />
                <h2 className="text-xl font-semibold text-foreground/60 mb-5 flex items-center gap-2">
                  <Archive className="size-5 text-muted-foreground" />
                  Anteriores
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {ended.map((drop) => (
                    <DropCard key={drop.id} drop={drop} variant="ended" />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-12 flex flex-wrap gap-3">
              <WardenButton href="/catalog" variant="outline">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
            </div>
          </>
        )}
      </Container>
    </Section>
  );
}
