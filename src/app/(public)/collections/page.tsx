import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { getActiveProducts, getCollections } from "@/lib/data";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Colecciones",
  description:
    "Colecciones de productos WARDEN organizadas por sistema de juego — BattleTech Classic, Alpha Strike y AeroTech.",
};

export default async function CollectionsPage() {
  const [collections, products] = await Promise.all([
    getCollections(),
    getActiveProducts(),
  ]);

  const collectionCounts = new Map<string, number>();
  for (const product of products) {
    if (product.collectionId) {
      collectionCounts.set(
        product.collectionId,
        (collectionCounts.get(product.collectionId) ?? 0) + 1
      );
    }
  }

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>Catálogo</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Colecciones
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Cada colección WARDEN apunta a un sistema de juego o propósito
            específico. Los productos dentro de una colección comparten
            materiales, lenguaje de diseño y se prueban juntos para funcionar
            como un conjunto cohesionado sobre la mesa.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((collection) => {
            const count = collectionCounts.get(collection.id) ?? 0;
            return (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group block border border-border bg-warden-surface p-6 transition-colors hover:border-warden-blue/20"
              >
                <Eyebrow>
                  {count} producto{count !== 1 ? "s" : ""}
                </Eyebrow>
                <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                  {collection.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {collection.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                  Ver colección <ChevronRight className="size-3" />
                </span>
              </Link>
            );
          })}
        </div>
        <div className="mt-12">
          <WardenButton href="/bundles" variant="outline">
            Ver bundles de productos
            <ChevronRight className="size-4" />
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
