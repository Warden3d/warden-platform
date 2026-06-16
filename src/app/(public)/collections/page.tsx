import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { collections } from "@/data/products";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "WARDEN product collections organized by game system — BattleTech Classic, Alpha Strike, and AeroTech.",
};

export default function CollectionsPage() {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>Catalog</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Collections
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Each WARDEN collection targets a specific game system or purpose.
            Products within a collection share materials, design language, and
            are tested together to ensure they work as a cohesive set on your
            table.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {collections.map((collection) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="group block border border-border bg-warden-surface p-6 transition-colors hover:border-warden-blue/20"
            >
              <Eyebrow>
                {collection.productIds.length} product
                {collection.productIds.length !== 1 ? "s" : ""}
              </Eyebrow>
              <h3 className="mt-2 text-xl font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                {collection.name}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {collection.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                View collection <ChevronRight className="size-3" />
              </span>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <WardenButton href="/bundles" variant="outline">
            View Product Bundles
            <ChevronRight className="size-4" />
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
