import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { bundles, products } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Bundles",
  description:
    "WARDEN product bundles — curated sets at reduced pricing. Commander Pack, Aerospace Command Bundle, and more.",
};

export default function BundlesPage() {
  return (
    <PageSection>
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Bundles
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Curated product sets designed for specific game systems or player
            needs. Each bundle saves you money compared to ordering products
            individually and ships in a single package with dedicated storage.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {bundles.map((bundle) => {
            const bundleProducts = products.filter((p) =>
              bundle.productIds.includes(p.id)
            );
            return (
              <Card
                key={bundle.id}
                className="border-border bg-card flex flex-col"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Layers className="size-5 text-primary" />
                    {bundle.discountLabel && (
                      <Badge
                        variant="outline"
                        className="text-[10px] border-primary/30 text-primary"
                      >
                        {bundle.discountLabel}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{bundle.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {bundle.description}
                  </p>
                  <div className="border-t border-border pt-4">
                    <h4 className="text-xs font-semibold text-foreground mb-2 uppercase tracking-wider">
                      Includes
                    </h4>
                    <ul className="space-y-1.5">
                      {bundleProducts.map((product) => (
                        <li
                          key={product.id}
                          className="text-sm text-muted-foreground flex items-start gap-2"
                        >
                          <span className="text-primary mt-1.5 block size-1 rounded-full bg-primary shrink-0" />
                          {product.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <Button render={<Link href="/selection" />}>
            Add Bundle to Selection
            <ArrowRight className="ml-2 size-4" />
          </Button>
          <Button variant="outline" render={<Link href="/collections" />}>
            Browse Individual Products
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Container>
    </PageSection>
  );
}
