import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section } from "@/components/shared/container";
import {
  getProductBySlug,
  getCollections,
  getCategories,
  getProductTypes,
  getLicenses,
  getProductsByIds,
  getBundles,
} from "@/lib/data";
import { ProductSpecsPanel } from "@/components/catalog/product-specs-panel";
import { ExpandableText } from "@/components/catalog/expandable-text";
import { CollapsiblePanel } from "@/components/catalog/collapsible-panel";
import { RelatedProductsSection } from "@/components/catalog/related-products-section";
import { ProductHighlights } from "@/components/shared/product-highlights";
import { FinishSelector } from "@/components/shared/finish-selector";
import { ClientProductActions } from "@/components/product/client-product-actions";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ProductConfigProvider } from "@/contexts/product-config";
import { DynamicPrice } from "@/components/product/dynamic-price";
import { GalleryWithVariant } from "@/components/product/gallery-with-variant";
import { Check, ChevronRight, FileText, Info, Package as PackageIcon, Layers } from "lucide-react";

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
    productTypes,
    licenses,
    relatedBundles,
  ] = await Promise.all([
    getProductBySlug(slug),
    getCollections(),
    getCategories(),
    getProductTypes(),
    getLicenses(),
    getBundles(),
  ]);

  if (!product || product.status !== "active") notFound();

  const collection = collections.find((c) => c.id === product.collectionId);
  const productCategory = categories.find((c) => c.id === product.categoryId);
  const productType = productTypes.find((t) => t.id === product.typeId);
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

  const variants = product.variants ?? [];

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

        {/* ── HEADER: gallery + comercial info ── */}
        <ProductConfigProvider variants={variants}>
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12 mb-8 items-start">
          <GalleryWithVariant images={product.images} productName={product.name} />

          <div className="flex flex-col gap-5">
            {/* ════ CABECERA DEL PRODUCTO (Especificación PDP §5) ════ */}

            {/* 5.1 — Procedencia */}
            {license && !product.designerName ? (
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                Licensed by {license.name}
              </p>
            ) : (
              collection && (
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/70">
                  {collection.name}
                </p>
              )
            )}

            {/* 5.2 — Nombre */}
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl leading-tight">
              {product.name}
            </h1>

            {/* 5.3 — Descripción breve */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.shortDescription}
            </p>

            {/* D15 — Compatibilidad como información secundaria */}
            <div className="flex flex-wrap items-center gap-1.5">
              <CompatibilityBadge system={compatKey} />
            </div>

            {/* 5.4 — Especificaciones rápidas (máx. 4) */}
            {(() => {
              const pdpSpecs = product.specs.filter((s) => s.visibility.includes("pdp"));
              return pdpSpecs.length > 0 ? (
                <ProductHighlights specs={pdpSpecs.slice(0, 4)} />
              ) : null;
            })()}

            {/* Autoría: diseñador (si no hay licencia) */}
            {!license && product.designerName && (
              <p className="text-xs text-muted-foreground/60">
                Designed by {product.designerName}
              </p>
            )}

            {/* ════ BLOQUE COMERCIAL (5.5–5.7) ════ */}
            <div className="flex flex-col gap-5 pt-8">
              {/* Fila 1: configuración + precio */}
              <div className="grid grid-cols-2 gap-6">
                <FinishSelector />
                <DynamicPrice />
              </div>

              {/* Fila 2: cantidad + añadir (misma línea) */}
              <ClientProductActions
                productId={product.id}
                productName={product.name}
                unitPrice={product.price}
                productSlug={product.slug}
                productImage={product.images.find((img) => img.isPrimary)?.url}
              />

              {/* Fila 3: volver al catálogo */}
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
        </ProductConfigProvider>

        {/* ════ BLOQUES INFORMATIVOS (ancho completo) ════ */}
        <div className="space-y-6 mb-12">
          {/* 1. Información del producto */}
          <CollapsiblePanel title="Información del producto" defaultOpen={false} icon={<Info className="size-3.5 shrink-0" />}>
            <ProductSpecsPanel
              specs={product.specs}
              categoryName={productCategory?.name}
              typeName={productType?.name}
            />
          </CollapsiblePanel>

          {/* 2. Información adicional */}
          <CollapsiblePanel title="Información adicional" defaultOpen={false} icon={<FileText className="size-3.5 shrink-0" />}>
            <ExpandableText text={product.description} maxLines={6} expandable={false} />
          </CollapsiblePanel>

          {/* 3. Contenido del set */}
          <CollapsiblePanel title="Contenido del set" defaultOpen={false} icon={<PackageIcon className="size-3.5 shrink-0" />}>
            <ul className="space-y-2">
              {product.gameFeatures.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground/80 leading-relaxed">
                  <Check className="size-4 text-warden-blue shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CollapsiblePanel>

          {/* Colecciones compatibles */}
          <CollapsiblePanel title="Colecciones compatibles" defaultOpen={false} icon={<Layers className="size-3.5 shrink-0" />}>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {[collection].filter(Boolean).map((col) => (
                <div
                  key={col!.id}
                  className="flex flex-col items-center gap-2 rounded-sm border border-border bg-warden-surface p-4 text-center"
                >
                  <div className="size-10 rounded-full bg-warden-elevated flex items-center justify-center text-muted-foreground text-xs font-bold uppercase">
                    {col!.name.slice(0, 2)}
                  </div>
                  <span className="text-xs text-foreground/80 leading-tight">
                    {col!.name}
                  </span>
                </div>
              ))}
            </div>
          </CollapsiblePanel>
        </div>

        {/* ════ PRODUCTOS RELACIONADOS ════ */}
        <div className="mb-8">
          <RelatedProductsSection
            products={resolvedRelatedProducts}
            bundles={resolvedRelatedBundles}
          />
        </div>
      </Container>
    </Section>
  );
}
