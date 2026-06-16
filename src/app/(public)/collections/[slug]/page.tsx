import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import {
  getActiveProducts,
  getCollections,
  getCompatibilitySystems,
} from "@/lib/data";
import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowLeft } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collections = await getCollections();
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return { title: "Colección no encontrada" };
  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collections, products, compatibilitySystems] = await Promise.all([
    getCollections(),
    getActiveProducts(),
    getCompatibilitySystems(),
  ]);

  const collection = collections.find((c) => c.slug === slug);
  if (!collection) notFound();

  const collectionProducts = products.filter(
    (p) => p.collectionId === collection.id
  );

  return (
    <>
      <Section>
        <Container>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            Todas las colecciones
          </Link>
          <div className="max-w-3xl mb-12">
            <Eyebrow>{collectionProducts.length} productos</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {collection.name}
            </h1>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {collection.description}
            </p>
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          {collectionProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {collectionProducts.map((product) => {
                const compatSystem = compatibilitySystems.find(
                  (c) => c.id === product.compatibilityId
                );
                const compatSlug = compatSystem?.slug as
                  | "battletech-classic"
                  | "alpha-strike"
                  | "aerotech"
                  | undefined;

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    variant="default"
                    showImage
                    showPrice
                    actions={
                      compatSlug ? (
                        <span className="text-eyebrow text-muted-foreground">
                          {compatSystem?.name}
                        </span>
                      ) : undefined
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 border border-border bg-warden-surface">
              <p className="text-sm text-muted-foreground">
                Esta colección no tiene productos activos en este momento.
              </p>
              <p className="text-xs text-muted-foreground/60 mt-2">
                Los productos se añaden conforme completan desarrollo y
                pruebas.
              </p>
              <div className="mt-6 inline-block">
                <WardenButton href="/catalog" variant="outline">
                  Explorar catálogo
                </WardenButton>
              </div>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
