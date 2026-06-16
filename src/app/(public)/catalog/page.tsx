import type { Metadata } from "next";
import { Container, Section } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getActiveProducts,
  getCollections,
  getCategories,
  getCompatibilitySystems,
} from "@/lib/data";

export const metadata: Metadata = {
  title: "Catálogo",
  description:
    "Explora el catálogo completo de WARDEN. Herramientas de precisión para BattleTech Classic, Alpha Strike y AeroTech.",
};

export default async function CatalogPage() {
  const [products, collections, categories, compatibilitySystems] =
    await Promise.all([
      getActiveProducts(),
      getCollections(),
      getCategories(),
      getCompatibilitySystems(),
    ]);

  return (
    <Section>
      <Container>
        <CatalogView
          products={products}
          categories={categories}
          compatibilitySystems={compatibilitySystems}
          collections={collections}
          title="Catálogo"
          description="Explora todos los productos WARDEN. Usa los filtros para acotar por categoría, sistema de juego o colección."
        />
      </Container>
    </Section>
  );
}
