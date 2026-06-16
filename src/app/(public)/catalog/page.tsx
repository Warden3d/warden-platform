import type { Metadata } from "next";
import { Container, Section } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getActiveProducts,
  collections,
  categories,
  compatibilitySystems,
} from "@/data/warden-catalog";

export const metadata: Metadata = {
  title: "Catalog",
  description:
    "Browse the complete WARDEN catalog. Precision tools for BattleTech Classic, Alpha Strike, and AeroTech.",
};

export default function CatalogPage() {
  const products = getActiveProducts();

  return (
    <Section>
      <Container>
        <CatalogView
          products={products}
          categories={categories}
          compatibilitySystems={compatibilitySystems}
          collections={collections}
          title="Catalog"
          description="Explore every WARDEN product. Use the filters to narrow by category, game system, or collection."
        />
      </Container>
    </Section>
  );
}
