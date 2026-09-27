import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container, Section } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getActiveProducts,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getProductTypes,
  getLicenses,
} from "@/lib/data";

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
  const [products, collections, categories, compatibilitySystems, productTypes, licenses] =
    await Promise.all([
      getActiveProducts(),
      getCollections(),
      getCategories(),
      getCompatibilitySystems(),
      getProductTypes(),
      getLicenses(),
    ]);

  const { collection } = await searchParams;
  const initialCollectionId = collection ?? null;

  return (
    <Section>
      <Container>
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
