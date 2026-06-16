import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getProductsByCollection,
  collections,
  categories,
  compatibilitySystems,
} from "@/data/warden-catalog";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "WARDEN Core",
  description:
    "Línea principal de herramientas de precisión para BattleTech. Componentes de latón, aluminio y acrílico diseñados para reducir el desorden en la mesa y acelerar cada fase de la partida.",
};

export default function WardenCorePage() {
  const products = getProductsByCollection("warden-core");
  const collection = collections.find((c) => c.slug === "warden-core");

  return (
    <Section>
      <Container>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          All Catalog
        </Link>
        <CatalogView
          products={products}
          categories={categories}
          compatibilitySystems={compatibilitySystems}
          collections={collections}
          initialFilters={{ collectionId: collection?.id }}
          title={collection?.name ?? "WARDEN Core"}
          description={collection?.description}
        />
      </Container>
    </Section>
  );
}
