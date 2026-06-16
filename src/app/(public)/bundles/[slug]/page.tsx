import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/shared/container";
import {
  getBundleBySlug,
  getActiveProducts,
  getCompatibilitySystems,
} from "@/lib/data";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { AddProductsToSelection } from "@/components/catalog/add-products-to-selection";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowLeft, Package, ArrowUpRight } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bundle = await getBundleBySlug(slug);
  if (!bundle || bundle.status !== "active")
    return { title: "Bundle no encontrado" };

  return {
    title: `${bundle.name} — WARDEN Bundles`,
    description: bundle.description,
    openGraph: {
      title: `${bundle.name} — WARDEN`,
      description: bundle.description,
    },
  };
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [bundle, compatibilitySystems, allProducts] = await Promise.all([
    getBundleBySlug(slug),
    getCompatibilitySystems(),
    getActiveProducts(),
  ]);

  if (!bundle || bundle.status !== "active") notFound();

  const bundleProducts = allProducts.filter((p) =>
    bundle.productIds.includes(p.id)
  );
  const totalIndividual = bundleProducts.reduce((sum, p) => sum + p.price, 0);

  const compatIds = [...new Set(bundleProducts.map((p) => p.compatibilityId))];
  const compatSystems = compatIds
    .map((id) => compatibilitySystems.find((c) => c.id === id))
    .filter(Boolean);

  return (
    <Section>
      <Container>
        <Link
          href="/bundles"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Todos los bundles
        </Link>

        {/* Hero */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12 items-start">
          {/* Visual */}
          <div className="aspect-square border border-border bg-warden-surface overflow-hidden flex items-center justify-center">
            <div className="text-center px-4">
              <Package className="size-12 text-warden-ochre/40 mx-auto mb-4" />
              <p className="text-eyebrow text-muted-foreground/40 max-w-[260px] mx-auto leading-relaxed">
                {bundle.name}
              </p>
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <TechnicalBadge variant="ochre">Bundle</TechnicalBadge>
              {bundle.theme && (
                <TechnicalBadge variant="neutral">{bundle.theme}</TechnicalBadge>
              )}
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl leading-tight">
              {bundle.name}
            </h1>

            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {bundle.description}
            </p>

            {/* Price */}
            <div className="mt-6">
              <span className="text-2xl font-semibold text-foreground tracking-tight">
                ${bundle.price.toFixed(2)}
              </span>
              <span className="text-spec-label text-muted-foreground ml-2">
                USD
              </span>
              {totalIndividual > bundle.price && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground/50 line-through">
                    ${totalIndividual.toFixed(2)}
                  </span>
                  <span className="text-eyebrow text-warden-green">
                    {bundle.discountLabel}
                  </span>
                </div>
              )}
            </div>

            {/* Bundle-wide CTA */}
            <div className="mt-6">
              <AddProductsToSelection
                products={bundleProducts}
                label="Añadir bundle a Mi Selección"
              />
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
                {compatSystems.map(
                  (cs) =>
                    cs && (
                      <p
                        key={cs.id}
                        className="text-xs text-muted-foreground/60 leading-relaxed"
                      >
                        {cs.description}
                      </p>
                    )
                )}
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
            {bundleProducts.length} productos — añade cada uno a tu selección o
            adquiere el bundle completo.
          </p>

          {bundleProducts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {bundleProducts.map((product) => {
                const compatSystem = compatibilitySystems.find(
                  (c) => c.id === product.compatibilityId
                );
                const primaryImage = product.images.find(
                  (img) => img.isPrimary
                );

                return (
                  <div
                    key={product.id}
                    className="border border-border bg-warden-surface p-5 flex flex-col"
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
                      <span className="text-data text-foreground/80 shrink-0">
                        ${product.price.toFixed(2)}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="group inline"
                    >
                      <h3 className="font-semibold text-sm text-foreground group-hover:text-warden-blue transition-colors leading-snug">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
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
                Este bundle no tiene productos asignados actualmente.
              </p>
            </div>
          )}
        </div>

        {/* CTA footer */}
        <div className="border-t border-border pt-8 flex flex-wrap gap-3">
          <WardenButton href="/selection" variant="ochre">
            Ir a Mi Selección
            <ArrowUpRight className="size-4" />
          </WardenButton>
          <WardenButton href="/catalog" variant="outline">
            Explorar catálogo completo
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
