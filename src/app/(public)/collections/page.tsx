import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { collections } from "@/data/products";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "WARDEN product collections organized by game system — BattleTech Classic, Alpha Strike, and AeroTech.",
};

export default function CollectionsPage() {
  return (
    <PageSection>
      <Container>
        <div className="max-w-3xl mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Collections
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Each WARDEN collection targets a specific game system or purpose.
            Products within a collection share materials, design language, and
            are tested together to ensure they work as a cohesive set on your
            table.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group"
            >
              <Card className="h-full border-border bg-card transition-colors hover:border-primary/20">
                <CardHeader>
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {collection.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {collection.description}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                    <span>
                      {collection.productIds.length} product
                      {collection.productIds.length !== 1 ? "s" : ""}
                    </span>
                    <ArrowRight className="size-3.5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Button variant="outline" render={<Link href="/bundles" />}>
            View Product Bundles
            <ArrowRight className="ml-2 size-4" />
          </Button>
        </div>
      </Container>
    </PageSection>
  );
}
