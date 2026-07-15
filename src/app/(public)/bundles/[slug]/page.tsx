import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container, Section } from "@/components/shared/container";
import {
  getBundleBySlug,
  getActiveProducts,
  getProductsByIds,
  getCompatibilitySystems,
} from "@/lib/data";
import { ProductSpecsPanel } from "@/components/catalog/product-specs-panel";
import { ExpandableText } from "@/components/catalog/expandable-text";
import { CollapsiblePanel } from "@/components/catalog/collapsible-panel";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { ProductHighlights } from "@/components/shared/product-highlights";
import { AddProductsToSelection } from "@/components/catalog/add-products-to-selection";
import { CatalogProductCard } from "@/components/catalog/catalog-product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ChevronRight, FileText, Info, Package as PackageIcon, Layers } from "lucide-react";

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

  // Related products from bundle contents
  const relatedProductIds = bundleProducts
    .flatMap((p) => p.relatedProductIds)
    .filter((id, idx, arr) => arr.indexOf(id) === idx)
    .filter((id) => !bundle.productIds.includes(id));

  const relatedProducts =
    relatedProductIds.length > 0
      ? allProducts.filter(
          (p) => relatedProductIds.includes(p.id) && p.status === "active"
        )
      : [];

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/bundles" className="hover:text-foreground transition-colors">
            Bundles
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-foreground">{bundle.name}</span>
        </nav>

        {/* ── HEADER: gallery + comercial info ── */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12 mb-8 items-start">
          <ProductGallery images={bundle.images} productName={bundle.name} />

          <div className="flex flex-col gap-5">
            {/* ════ CABECERA (CEM: Commercial Entity) ════ */}

            {/* Procedencia */}
            <p className="text-[11px] font-medium uppercase tracking-wider text-warden-ochre/80">
              Bundle
            </p>

            {/* Nombre */}
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl leading-tight">
              {bundle.name}
            </h1>

            {/* Descripción breve */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {bundle.description}
            </p>

            {/* Especificaciones rápidas (máx. 4) */}
            {(() => {
              const bundleSpecs = bundle.specs.filter((s) => s.visibility.includes("bundle"));
              return bundleSpecs.length > 0 ? (
                <ProductHighlights specs={bundleSpecs.slice(0, 4)} />
              ) : null;
            })()}

            {/* ════ BLOQUE COMERCIAL ════ */}
            <div className="flex flex-col gap-5 pt-8">
              {/* Precio + descuento */}
              <div>
                <span className="text-2xl font-semibold text-foreground tracking-tight">
                  {bundle.price.toFixed(2)} €
                </span>
                {totalIndividual > bundle.price && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground/50 line-through">
                      {totalIndividual.toFixed(2)} €
                    </span>
                    <span className="text-eyebrow text-warden-green">
                      {bundle.discountLabel}
                    </span>
                  </div>
                )}
              </div>

              {/* CTA — Añadir bundle completo a Mi Selección */}
              <AddProductsToSelection
                products={bundleProducts}
                label="Añadir bundle a Mi Selección"
              />

              {/* Volver al catálogo */}
              <div className="flex justify-end">
                <div className="w-48">
                  <WardenButton
                    href="/catalog"
                    variant="outline"
                    size="lg"
                    className="h-9 w-full"
                  >
                    Volver al catálogo
                  </WardenButton>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ════ BLOQUES INFORMATIVOS (ancho completo) ════ */}
        <div className="space-y-6 mb-12">
          {/* 1. Información del producto */}
          <CollapsiblePanel title="Información del producto" defaultOpen={false} icon={<Info className="size-3.5 shrink-0" />}>
            <ProductSpecsPanel
              specs={bundle.specs}
            />
          </CollapsiblePanel>

          {/* 2. Información adicional */}
          <CollapsiblePanel title="Información adicional" defaultOpen={false} icon={<FileText className="size-3.5 shrink-0" />}>
            <ExpandableText text={bundle.description} maxLines={6} expandable={false} />
          </CollapsiblePanel>

          {/* 3. Contenido del producto (productos incluidos) */}
          {bundleProducts.length > 0 && (
            <CollapsiblePanel title="Contenido del producto" defaultOpen={false} icon={<PackageIcon className="size-3.5 shrink-0" />}>
              <div className="p-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {bundleProducts.map((product) => (
                    <CatalogProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </CollapsiblePanel>
          )}

          {/* Colecciones compatibles */}
          {compatSystems.length > 0 && (
            <CollapsiblePanel title="Colecciones compatibles" defaultOpen={false} icon={<Layers className="size-3.5 shrink-0" />}>
              <div className="flex flex-wrap gap-2 p-4">
                {compatSystems.map(
                  (cs) =>
                    cs && (
                      <span
                        key={cs.id}
                        className="inline-block px-3 py-1 text-xs font-medium uppercase tracking-wider rounded-sm border border-border/40 text-muted-foreground/80"
                      >
                        {cs.name}
                      </span>
                    )
                )}
              </div>
            </CollapsiblePanel>
          )}
        </div>

        {/* ════ PRODUCTOS RELACIONADOS ════ */}
        {relatedProducts.length > 0 && (
          <div className="mb-8">
            <RelatedProductsSection
              products={relatedProducts}
              bundles={[]}
            />
          </div>
        )}
      </Container>
    </Section>
  );
}