import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getProductsByCollection,
  collections,
  categories,
  compatibilitySystems,
  licenses,
} from "@/data/warden-catalog";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowLeft, ChevronRight, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Licenses",
  description:
    "Colaboraciones con estudios asociados y creadores independientes. Cada colección licenciada aporta estética y herramientas únicas manteniendo los estándares WARDEN.",
};

export default function LicensesPage() {
  const products = getProductsByCollection("licenses");
  const collection = collections.find((c) => c.slug === "licenses");

  return (
    <>
      <Section>
        <Container>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="size-4" />
            All Catalog
          </Link>

          <div className="mb-10 max-w-3xl">
            <Eyebrow>{licenses.length} partners</Eyebrow>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Licensed Universes
            </h1>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Collaborations with independent creators and studios within the
              BattleTech community. Each licensed collection brings custom
              tooling and unique aesthetics while maintaining WARDEN standards
              for precision, durability, and gameplay-first design.
            </p>
          </div>

          {/* License cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
            {licenses.map((license) => (
              <div
                key={license.id}
                className="border border-border bg-warden-surface p-5 flex flex-col"
              >
                <h3 className="font-semibold text-foreground text-base">
                  {license.name}
                </h3>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed flex-1">
                  {license.description}
                </p>
                <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
                  <WardenButton
                    variant="ghost"
                    size="sm"
                    href={`/collections/licenses/${license.id === "lic-wasteland-studios" ? "wasteland-studios" : license.id}`}
                  >
                    View Products
                    <ChevronRight className="size-3.5" />
                  </WardenButton>
                  {license.website && (
                    <a
                      href={license.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ExternalLink className="size-3" />
                      Website
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="!pt-0">
        <Container>
          <div className="mb-8">
            <Eyebrow>{products.length} products</Eyebrow>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Licensed Products
            </h2>
          </div>
          <CatalogView
            products={products}
            categories={categories}
            compatibilitySystems={compatibilitySystems}
            collections={collections}
            initialFilters={{ collectionId: collection?.id }}
            title=""
          />
        </Container>
      </Section>
    </>
  );
}
