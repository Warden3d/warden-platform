import Link from "next/link";
import { Container, PageSection } from "@/components/shared/container";
import { collections, products } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Box,
  Clock,
  Compass,
  Layers,
  Shield,
} from "lucide-react";

const systemLabels = {
  "battletech-classic": "BattleTech Classic",
  "alpha-strike": "Alpha Strike",
  aerotech: "AeroTech",
};

const values = [
  {
    icon: Layers,
    label: "Funcionalidad",
    description:
      "Every product serves a clear gameplay purpose. No decorative filler.",
  },
  {
    icon: Box,
    label: "Compatibilidad",
    description:
      "Designed to work with official maps, record sheets, and miniatures.",
  },
  {
    icon: Shield,
    label: "Robustez",
    description:
      "Brass, aluminum, and acrylic built for hundreds of tabletop sessions.",
  },
  {
    icon: Compass,
    label: "Claridad",
    description:
      "Information design that reduces cognitive load during play.",
  },
];

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured && p.status === "active");
  const activeCollections = collections.filter((c) => c.productIds.length > 0);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-card">
        <Container>
          <div className="py-24 md:py-32 lg:py-40 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground mb-6">
              <Clock className="size-3" />
              AeroTech Launch Drop — June 20, 2026
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Precision equipment for
              <span className="text-primary"> BattleTech</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
              WARDEN develops physical products that enhance the tabletop
              experience across BattleTech Classic, Alpha Strike, and AeroTech.
              Tools engineered for clarity, built for durability, and designed
              to keep your focus on tactical decisions — not rulebook lookups.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
            <Button render={<Link href="/collections" />}>
              Explore Collections
              <ArrowRight className="ml-2 size-4" />
            </Button>
            <Button variant="outline" render={<Link href="/about" />}>
              About WARDEN
            </Button>
            </div>
          </div>
        </Container>
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,hsl(35,40%,50%,0.08),transparent)]" />
      </section>

      <PageSection>
        <Container>
          <div className="text-center mb-12">
            <h2 className="section-title">Design Principles</h2>
            <p className="section-subtitle">
              Four values that define every WARDEN product
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.label} className="border-border bg-card">
                <CardHeader>
                  <value.icon className="size-8 text-primary mb-2" />
                  <CardTitle className="text-base">{value.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{value.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </PageSection>

      <Separator />

      <PageSection>
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">
                Our most-used tools, proven across thousands of game sessions
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" render={<Link href="/collections" />}>
              View all
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => {
              return (
                <Link
                  key={product.id}
                  href={`/collections/${product.collectionIds[0] ?? "warden-core"}`}
                  className="group"
                >
                  <Card className="h-full border-border bg-card transition-colors hover:border-primary/20">
                    <CardHeader>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="text-[10px] uppercase tracking-widest border-primary/20 text-primary"
                        >
                          {systemLabels[product.system as keyof typeof systemLabels]}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {product.name}
                      </CardTitle>
                      {product.subtitle && (
                        <CardDescription className="text-xs text-muted-foreground">
                          {product.subtitle}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {product.descriptionShort}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" render={<Link href="/collections" />}>
              View all products
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </Container>
      </PageSection>

      <Separator />

      <PageSection>
        <Container>
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="section-title">Collections</h2>
              <p className="section-subtitle">
                Product lines organized by game system and purpose
              </p>
            </div>
            <Button variant="ghost" className="hidden sm:flex" render={<Link href="/collections" />}>
              All collections
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {activeCollections.map((collection) => (
              <Link
                key={collection.id}
                href={`/collections/${collection.slug}`}
                className="group"
              >
                <Card className="h-full border-border bg-card transition-colors hover:border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {collection.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {collection.description}
                    </p>
                    <p className="mt-3 text-xs text-muted-foreground">
                      {collection.productIds.length} product
                      {collection.productIds.length !== 1 ? "s" : ""}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </PageSection>
    </>
  );
}
