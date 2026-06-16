import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { collections, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const systemLabels = {
  "battletech-classic": "BattleTech Classic",
  "alpha-strike": "Alpha Strike",
  aerotech: "AeroTech",
};

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
  const collection = collections.find((c) => c.slug === slug);

  if (!collection) {
    return (
      <PageSection>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-foreground">
              Collection not found
            </h1>
            <p className="mt-2 text-muted-foreground">
              The collection you are looking for does not exist.
            </p>
            <Button variant="outline" className="mt-6" render={<Link href="/collections" />}>
              Back to Collections
            </Button>
          </div>
        </Container>
      </PageSection>
    );
  }

  const collectionProducts = products.filter((p) =>
    collection.productIds.includes(p.id)
  );

  return (
    <>
      <PageSection>
        <Container>
          <Link
            href="/collections"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="size-4" />
            All Collections
          </Link>
          <div className="max-w-3xl mb-12">
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {collection.name}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
              {collection.description}
            </p>
          </div>
        </Container>
      </PageSection>

      <PageSection className="!pt-0">
        <Container>
          {collectionProducts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2">
              {collectionProducts.map((product) => (
                <Card
                  key={product.id}
                  className="border-border bg-card"
                >
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className="text-[10px] uppercase tracking-widest border-primary/20 text-primary"
                      >
                        {
                          systemLabels[
                            product.system as keyof typeof systemLabels
                          ]
                        }
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {product.descriptionShort}
                    </p>
                    <div className="border-t border-border pt-4">
                      <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                        Specifications
                      </h4>
                      <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(product.specs)
                          .slice(0, 4)
                          .map(([key, value]) => (
                            <div key={key}>
                              <dt className="text-xs text-muted-foreground">
                                {key}
                              </dt>
                              <dd className="text-sm text-foreground">
                                {value}
                              </dd>
                            </div>
                          ))}
                      </dl>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <p className="text-muted-foreground">
                No products have been listed in this collection yet.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                New products are added to collections as they complete
                development and testing.
              </p>
            </div>
          )}
        </Container>
      </PageSection>
    </>
  );
}
