import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
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
  const t = await getTranslations("catalog");
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
              {wardenCoreCount === 1 ? t("product") : t("products")}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
              {t("quickAccessWardenCore")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("quickAccessWardenCoreDesc")}
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
              {licensesCount === 1 ? t("product") : t("products")}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-green transition-colors">
              {t("quickAccessLicenses")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("quickAccessLicensesDesc")}
            </p>
          </Link>

          {/* Bundles — sección independiente */}
          <Link
            href="/bundles"
            className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
          >
            <Box className="size-5 text-warden-blue mb-5" />
            <Eyebrow>
              {bundles.length} {bundles.length === 1 ? t("bundle") : t("bundles")}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
              {t("quickAccessBundles")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("quickAccessBundlesDesc")}
            </p>
          </Link>

          {/* Drops — sección independiente */}
          <Link
            href="/drops"
            className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
          >
            <Rocket className="size-5 text-muted-foreground mb-5 group-hover:text-foreground transition-colors" />
            <Eyebrow>
              {drops.length} {drops.length === 1 ? t("drop") : t("drops")}
            </Eyebrow>
            <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors">
              {t("quickAccessDrops")}
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              {t("quickAccessDropsDesc")}
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
          initialFilters={
            initialCollectionId ? { collectionId: initialCollectionId } : undefined
          }
          title={t("title")}
          description={t("description")}
        />
      </Container>
    </Section>
  );
}
