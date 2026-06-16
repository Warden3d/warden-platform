import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { collections, products } from "@/data/products";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowLeft } from "lucide-react";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) return { title: "Collection Not Found" };
  return { title: collection.name, description: collection.description };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <Section>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold text-foreground">
              Collection not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The collection you are looking for does not exist.
            </p>
            <div className="mt-6 inline-block">
              <WardenButton href="/collections" variant="outline">
                Back to Collections
              </WardenButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  const collectionProducts = products.filter((p) =>
    collection.productIds.includes(p.id)
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
            All Collections
          </Link>
          <div className="max-w-3xl mb-12">
            <Eyebrow>{collection.productIds.length} products</Eyebrow>
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
            <div className="grid gap-6 sm:grid-cols-2">
              {collectionProducts.map((product) => (
                <div
                  key={product.id}
                  className="border border-border bg-warden-surface p-6"
                >
                  <div className="mb-3">
                    <CompatibilityBadge system={product.system} />
                  </div>
                  <h3 className="text-lg font-semibold tracking-tight text-foreground">
                    {product.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {product.descriptionShort}
                  </p>
                  <div className="mt-4 border-t border-border pt-4">
                    <h4 className="text-eyebrow text-muted-foreground mb-3">
                      Specifications
                    </h4>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {Object.entries(product.specs)
                        .slice(0, 4)
                        .map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-spec-label text-muted-foreground">
                              {key}
                            </dt>
                            <dd className="text-data text-foreground/90">
                              {value}
                            </dd>
                          </div>
                        ))}
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-border bg-warden-surface">
              <p className="text-sm text-muted-foreground">
                No products have been listed in this collection yet.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                New products are added as they complete development and testing.
              </p>
            </div>
          )}
        </Container>
      </Section>
    </>
  );
}
