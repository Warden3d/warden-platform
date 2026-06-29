import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/shared/container";
import {
  getProductBySlug,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getLicenses,
  getProductsByIds,
  getBundles,
} from "@/lib/data";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductSpecsPanel } from "@/components/catalog/product-specs-panel";
import { ExpandableText } from "@/components/catalog/expandable-text";
import { CollapsiblePanel } from "@/components/catalog/collapsible-panel";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { Check, ExternalLink, ChevronRight } from "lucide-react";

const systemMap: Record<string, "battletech-classic" | "alpha-strike" | "aerotech"> = {
  "comp-battletech-classic": "battletech-classic",
  "comp-alpha-strike": "alpha-strike",
  "comp-aerotech": "aerotech",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.status !== "active") return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: `${product.name} — WARDEN`,
      description: product.shortDescription,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [
    product,
    collections,
    categories,
    compatibilitySystems,
    licenses,
    relatedBundles,
  ] = await Promise.all([
    getProductBySlug(slug),
    getCollections(),
    getCategories(),
    getCompatibilitySystems(),
    getLicenses(),
    getBundles(),
  ]);

  if (!product || product.status !== "active") notFound();

  const collection = collections.find((c) => c.id === product.collectionId);
  const category = categories.find((c) => c.id === product.categoryId);
  const compatSystem = compatibilitySystems.find(
    (c) => c.id === product.compatibilityId
  );
  const license = product.associatedLicenseId
    ? licenses.find((l) => l.id === product.associatedLicenseId)
    : null;

  const compatKey = systemMap[product.compatibilityId] ?? "aerotech";

  const resolvedRelatedProducts = product.relatedProductIds.length > 0
    ? await getProductsByIds(product.relatedProductIds)
    : [];
  const resolvedRelatedBundles = relatedBundles.filter((b) =>
    product.relatedBundleIds.includes(b.id)
  );

  return (
    <Section className="pt-12 md:pt-16">
      <Container>
        {/* ── Breadcrumb ── */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
          <Link href="/catalog" className="hover:text-foreground transition-colors">
            Catálogo
          </Link>
          {collection && (
            <>
              <ChevronRight className="size-3 text-muted-foreground/40" />
              <Link
                href={
                  collection.slug === "warden-core"
                    ? "/catalog?collection=col-warden-core"
                    : collection.slug === "licenses"
                      ? "/catalog?collection=col-licenses"
                      : `/collections/${collection.slug}`
                }
                className="hover:text-foreground transition-colors"
              >
                {collection.name}
              </Link>
            </>
          )}
          <ChevronRight className="size-3 text-muted-foreground/40" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        {/* ── HEADER: gallery + comercial info (50/50) ── */}
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-10 mb-8 items-start">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="flex flex-col gap-4">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-1.5">
              <CompatibilityBadge system={compatKey} />
              {category && (
                <TechnicalBadge variant="neutral">{category.name}</TechnicalBadge>
              )}
              {license && (
                <TechnicalBadge variant="neutral">{license.name}</TechnicalBadge>
              )}
              {license?.website && (
                <a
                  href={license.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] text-muted-foreground hover:text-warden-blue transition-colors ml-1"
                >
                  <ExternalLink className="size-3" />
                  {license.name}
                </a>
              )}
            </div>

            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl leading-tight">
              {product.name}
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Incluye */}
            {product.gameFeatures.length > 0 && (
              <div className="border border-border bg-warden-surface rounded-sm">
                <div className="px-4 py-2 border-b border-border">
                  <span className="text-spec-label text-muted-foreground text-xs uppercase tracking-wider">
                    Incluye
                  </span>
                </div>
                <ul className="px-4 py-3 space-y-1.5">
                  {product.gameFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-foreground/80 leading-relaxed">
                      <Check className="size-3 text-warden-blue shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Price + CTA row */}
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-xl font-semibold text-foreground tracking-tight">
                ${product.price.toFixed(2)}
                <span className="text-spec-label text-muted-foreground text-xs ml-1.5 font-normal">
                  USD
                </span>
              </span>
              <AddToSelectionButton
                productId={product.id}
                productName={product.name}
                unitPrice={product.price}
                productSlug={product.slug}
                productImage={product.images.find((img) => img.isPrimary)?.url}
              />
            </div>
          </div>
        </div>

        {/* ── DESCRIPTION (collapsible) ── */}
        <div className="mb-8">
          <h2 className="text-spec-label text-muted-foreground mb-3 uppercase tracking-wider text-xs">
            Descripción
          </h2>
          <ExpandableText text={product.description} maxLines={4} />
        </div>

        {/* ── RELATED PRODUCTS & BUNDLES (carousels) ── */}
        <div className="mb-8">
          <RelatedProductsSection
            products={resolvedRelatedProducts}
            bundles={resolvedRelatedBundles}
          />
        </div>

        {/* ── EXPANDED INFO (progressive disclosure) ── */}
        <div className="space-y-3 max-w-2xl">
          {/* Características de juego */}
          <CollapsiblePanel title="Características de juego">
            <div className="space-y-2">
              {product.scale && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Escala</span>
                  <span className="text-foreground/80">{product.scale}</span>
                </div>
              )}
              {product.material && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Material</span>
                  <span className="text-foreground/80">{product.material}</span>
                </div>
              )}
              {compatSystem && (
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-muted-foreground">Compatibilidad</span>
                  <span className="text-foreground/80">{compatSystem.name}</span>
                </div>
              )}
            </div>
          </CollapsiblePanel>

          {/* Especificaciones técnicas */}
          <CollapsiblePanel title="Especificaciones técnicas">
            <ProductSpecsPanel
              specs={product.specs}
              scale={product.scale}
              material={product.material}
              dimensions={product.dimensions}
            />
          </CollapsiblePanel>
        </div>
      </Container>
    </Section>
  );
}
