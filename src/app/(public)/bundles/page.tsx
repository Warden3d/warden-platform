import type { Metadata } from "next";
import Link from "next/link";

import { Container, Section, Eyebrow } from "@/components/shared/container";
import { bundles, products, compatibilitySystems } from "@/data/warden-catalog";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Bundles",
  description:
    "WARDEN product bundles — curated sets at reduced pricing. Commander Pack, WARDEN Starter Pack, and more.",
};

export default function BundlesPage() {
  const activeBundles = bundles.filter((b) => b.status === "active");

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow className="text-warden-ochre">Soluciones completas</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Bundles
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Agrupaciones de productos diseñados para funcionar como un sistema
            cohesionado. Cada bundle reúne herramientas compatibles que cubren
            una necesidad completa de juego a un precio inferior al de la compra
            individual.
          </p>
        </div>

        {activeBundles.length === 0 ? (
          <div className="text-center py-16 border border-border bg-warden-surface">
            <Package className="size-8 text-muted-foreground/40 mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              No hay bundles disponibles en este momento.
            </p>
            <p className="text-xs text-muted-foreground/60 mt-2">
              Los bundles se publican a medida que se completan las colecciones.
            </p>
            <div className="mt-6">
              <WardenButton href="/catalog" variant="outline">
                Explorar catálogo
                <ChevronRight className="size-4" />
              </WardenButton>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {activeBundles.map((bundle) => {
              const bundleProducts = products.filter((p) =>
                bundle.productIds.includes(p.id)
              );
              const totalIndividual = bundleProducts.reduce(
                (sum, p) => sum + p.price,
                0
              );
              const compatIds = [
                ...new Set(bundleProducts.map((p) => p.compatibilityId)),
              ];
              const compatSystems = compatIds
                .map((id) => compatibilitySystems.find((c) => c.id === id))
                .filter(Boolean);

              return (
                <Link
                  key={bundle.id}
                  href={`/bundles/${bundle.slug}`}
                  className="group flex flex-col border border-border bg-warden-surface p-6 transition-colors hover:border-warden-ochre/30"
                >
                  <div className="flex items-start justify-between mb-4">
                    <Package className="size-5 text-warden-ochre" />
                    {bundle.discountLabel && (
                      <TechnicalBadge variant="green">
                        {bundle.discountLabel}
                      </TechnicalBadge>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-ochre transition-colors">
                    {bundle.name}
                  </h2>

                  {bundle.theme && (
                    <p className="mt-1 text-xs text-muted-foreground/60 font-mono tracking-wider uppercase">
                      {bundle.theme}
                    </p>
                  )}

                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed flex-1 line-clamp-3">
                    {bundle.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
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

                  <div className="mt-5 pt-4 border-t border-border flex items-baseline justify-between">
                    <div>
                      <span className="text-xl font-semibold text-foreground tracking-tight">
                        ${bundle.price.toFixed(2)}
                      </span>
                      <span className="text-spec-label text-muted-foreground ml-2">
                        USD
                      </span>
                      {totalIndividual > bundle.price && (
                        <span className="ml-3 text-[11px] text-muted-foreground/50 line-through">
                          ${totalIndividual.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-warden-ochre inline-flex items-center gap-0.5">
                      Ver bundle <ChevronRight className="size-3" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <WardenButton href="/catalog" variant="outline">
            Explorar productos individuales
            <ChevronRight className="size-4" />
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
