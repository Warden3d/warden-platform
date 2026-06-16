import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/shared/container";
import {
  getProductBySlug,
  getActiveProducts,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getLicenses,
  getProductsByIds,
  getBundles,
} from "@/lib/data";
import { ProductGallery } from "@/components/catalog/product-gallery";
import { ProductSpecsPanel } from "@/components/catalog/product-specs-panel";
import { GameFeaturesList } from "@/components/catalog/game-features-list";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { CompatibilityBadge, TechnicalBadge } from "@/components/catalog/technical-badge";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

const systemMap: Record<string, "battletech-classic" | "alpha-strike" | "aerotech"> = {
  "comp-battletech-classic": "battletech-classic",
  "comp-alpha-strike": "alpha-strike",
  "comp-aerotech": "aerotech",
};

export async function generateStaticParams() {
  const products = await getActiveProducts();
  return products.map((p) => ({ slug: p.slug }));
}

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
    <Section>
      <Container>
        {/* Back link */}
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Volver al catálogo
        </Link>

        {/* Hero: gallery + info */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12 items-start">
          {/* Gallery */}
          <ProductGallery images={product.images} productName={product.name} />

          {/* Info */}
          <div className="flex flex-col">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-1.5 mb-3">
              <CompatibilityBadge system={compatKey} />
              {category && (
                <TechnicalBadge variant="neutral">{category.name}</TechnicalBadge>
              )}
              {license && (
                <TechnicalBadge variant="neutral">{license.name}</TechnicalBadge>
              )}
            </div>

            {/* Name */}
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl leading-tight">
              {product.name}
            </h1>

            {/* Collection */}
            {collection && (
              <Link
                href={
                  collection.slug === "warden-core"
                    ? "/collections/warden-core"
                    : collection.slug === "licenses"
                      ? "/collections/licenses"
                      : `/collections/${collection.slug}`
                }
                className="mt-1 text-sm text-warden-blue hover:underline inline-flex items-center gap-1"
              >
                {collection.name}
                <ArrowUpRight className="size-3" />
              </Link>
            )}

            {/* Short description */}
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Price */}
            <div className="mt-6">
              <span className="text-2xl font-semibold text-foreground tracking-tight">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-spec-label text-muted-foreground ml-2">
                USD
              </span>
            </div>

            {/* Internal code */}
            <p className="mt-1 text-[10px] text-muted-foreground/40 font-mono tracking-wider">
              {product.internalCode}
            </p>

            {/* CTA */}
            <div className="mt-6">
              <AddToSelectionButton
                productId={product.id}
                productName={product.name}
                unitPrice={product.price}
                productSlug={product.slug}
                productImage={product.images.find((img) => img.isPrimary)?.url}
              />
            </div>

            {/* License website link */}
            {license?.website && (
              <div className="mt-4 pt-4 border-t border-border">
                <a
                  href={license.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-warden-blue transition-colors"
                >
                  <ExternalLink className="size-3" />
                  Visitar web de {license.name}
                </a>
              </div>
            )}

            {/* Compat system description */}
            {compatSystem && (
              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-spec-label text-muted-foreground mb-1">
                  Compatible con
                </p>
                <p className="text-xs text-muted-foreground/70 leading-relaxed">
                  {compatSystem.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Description + Specs */}
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 mb-12">
          <div>
            <h2 className="text-spec-label text-muted-foreground mb-3">
              Descripción
            </h2>
            <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-line">
              {product.description}
            </p>
          </div>
          <div>
            <ProductSpecsPanel
              specs={product.specs}
              scale={product.scale}
              material={product.material}
              dimensions={product.dimensions}
            />
          </div>
        </div>

        {/* Game Features */}
        <div className="mb-12 max-w-lg">
          <GameFeaturesList features={product.gameFeatures} />
        </div>

        {/* Related */}
        <RelatedProductsSection
          products={resolvedRelatedProducts}
          bundles={resolvedRelatedBundles}
        />
      </Container>
    </Section>
  );
}
