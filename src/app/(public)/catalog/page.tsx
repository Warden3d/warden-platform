import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getActiveProducts,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getBundles,
  getDrops,
  getProductTypes,
  getLicenses,
} from "@/lib/data";
import { cn } from "@/lib/utils";
import { Shield, Gauge, Box, Rocket } from "lucide-react";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora el catálogo completo de WARDEN. Herramientas de precisión para BattleTech Classic, Alpha Strike y AeroTech.",
};

interface PageProps {
  searchParams: Promise<{ collection?: string }>;
}

export default async function CatalogPage({ searchParams }: PageProps) {
  const [products, collections, categories, compatibilitySystems, bundles, drops, productTypes, licenses] =
    await Promise.all([
      getActiveProducts(),
      getCollections(),
      getCategories(),
      getCompatibilitySystems(),
      getBundles(),
      getDrops(),
      getProductTypes(),
      getLicenses(),
    ]);

  const { collection } = await searchParams;
  const initialCollectionId = collection ?? null;

  // Compute product counts per collection
  const collectionCounts = new Map<string, number>();
  for (const product of products) {
    if (product.collectionId) {
      collectionCounts.set(
        product.collectionId,
        (collectionCounts.get(product.collectionId) ?? 0) + 1
      );
    }
  }

  const wardenCoreCount = collectionCounts.get("col-warden-core") ?? 0;
  const licensesCount = collectionCounts.get("col-licenses") ?? 0;

  return (
    <Section>
      <Container>
        {/* ── QUICK ACCESS CARDS ── */}
        <div className="grid gap-px bg-border rounded-sm overflow-hidden sm:grid-cols-2 lg:grid-cols-4 mb-10">
          {/* WARDEN Core — filtra el catálogo */}
          <Link
            href="/catalog?collection=col-warden-core"
            className={cn(
              "group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface",
              initialCollectionId === "col-warden-core" &&
                "ring-1 ring-inset ring-warden-blue/40 bg-warden-surface"
            )}
          >
            <Shield className="size-5 text-warden-ochre mb-5" />
            <Eyebrow>
              {wardenCoreCount}{" "}
              {wardenCoreCount === 1 ? "product" : "products"}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
              WARDEN Core
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Main collection of precision tools for BattleTech. Terrain,
              structures, accessories and complete battlefield solutions.
            </p>
          </Link>

          {/* Licenses — filtra el catálogo */}
          <Link
            href="/catalog?collection=col-licenses"
            className={cn(
              "group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface",
              initialCollectionId === "col-licenses" &&
                "ring-1 ring-inset ring-warden-blue/40 bg-warden-surface"
            )}
          >
            <Gauge className="size-5 text-warden-green mb-5" />
            <Eyebrow>
              {licensesCount}{" "}
              {licensesCount === 1 ? "product" : "products"}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-green transition-colors">
              Licenses
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Collaborations with independent creators and studios. Bespoke
              tools with WARDEN manufacturing standards.
            </p>
          </Link>

          {/* Bundles — sección independiente */}
          <Link
            href="/bundles"
            className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
          >
            <Box className="size-5 text-warden-blue mb-5" />
            <Eyebrow>
              {bundles.length} {bundles.length === 1 ? "bundle" : "bundles"}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
              Bundles
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Curated sets at a reduced price. Everything in one package.
            </p>
          </Link>

          {/* Drops — sección independiente */}
          <Link
            href="/drops"
            className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
          >
            <Rocket className="size-5 text-muted-foreground mb-5 group-hover:text-foreground transition-colors" />
            <Eyebrow>
              {drops.length} {drops.length === 1 ? "drop" : "drops"}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors">
              Drops
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Limited releases and special editions. Time-bound availability.
            </p>
          </Link>
        </div>

        {/* ── FULL CATALOG VIEW ── */}
        <CatalogView
          key={initialCollectionId ?? "all"}
          products={products}
          categories={categories}
          compatibilitySystems={compatibilitySystems}
          collections={collections}
          licenses={licenses}
          productTypes={productTypes}
          title="Catálogo"
          description="Explora todos los productos WARDEN. Usa los filtros para acotar por categoría, sistema de juego o colección."
        />
      </Container>
    </Section>
  );
}
