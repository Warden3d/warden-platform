import Link from "next/link";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { products } from "@/data/products";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { DataPanel, DataRow } from "@/components/shared/data-panel";

import { ChevronRight, ArrowUpRight, Gauge, Box, Shield } from "lucide-react";

export default function Home() {
  const featuredProducts = products.filter((p) => p.isFeatured);


  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border bg-warden-carbon">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,hsl(210,35%,52%,0.06),transparent_70%)]" />
        <Container>
          <div className="py-24 md:py-32 lg:py-36 max-w-4xl relative">
            <Eyebrow className="text-warden-blue">
              Precision Equipment for Tabletop Wargaming
            </Eyebrow>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Tools engineered
              <br />
              <span className="text-warden-blue">for the table.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
              WARDEN develops physical products that remove friction from every
              phase of BattleTech Classic, Alpha Strike, and AeroTech. No
              decoration. No fluff. Just precision tools that earn their place
              on your table.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WardenButton href="/collections">
                Explore Collections
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/about" variant="outline">Our Approach</WardenButton>
              <WardenButton href="/selection" variant="ghost">
                Go to Selection
                <ArrowUpRight className="size-3.5" />
              </WardenButton>
            </div>
          </div>
        </Container>
      </section>

      {/* ── ACCESS BLOCKS ── */}
      <Section>
        <Container>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {/* Warden Core */}
            <Link
              href="/collections/warden-core"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Shield className="size-5 text-warden-ochre mb-5" />
              <Eyebrow>Collection</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                WARDEN Core
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Brass, aluminum, and acrylic tools for BattleTech Classic.
                Hex markers, heat dials, armor sliders — built for hundreds
                of sessions.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                4 products <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Licensed Universes */}
            <Link
              href="/collections/licenses"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Gauge className="size-5 text-warden-green mb-5" />
              <Eyebrow>Program</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-green transition-colors">
                Licensed Universes
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Collaborations with independent creators and studios.
                Custom tooling, unique aesthetics, WARDEN manufacturing
                standards.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-green uppercase tracking-wider">
                Learn more <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Bundles */}
            <Link
              href="/bundles"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Box className="size-5 text-warden-blue mb-5" />
              <Eyebrow>Save</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                Bundles
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Curated sets at reduced pricing. Commander Pack, Aerospace
                Bundle, Starter Kit — everything in one package.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                3 bundles <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Community Support */}
            <Link
              href="/community-support"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <svg
                className="size-5 text-muted-foreground mb-5 group-hover:text-foreground transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <Eyebrow>Resources</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors">
                Community Support
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Product guides, FAQs, and community channels. Wardens helping
                wardens across all three game systems.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                Get support <ChevronRight className="size-3" />
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── FEATURED PRODUCTS ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Featured</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Proven on the table
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Our most-used tools, tested across thousands of game sessions.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <Link key={product.id} href={`/collections/${product.collectionIds[0] ?? "collections"}`}>
                <ProductCard product={product} />
              </Link>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── DESIGN PRINCIPLES ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow className="text-warden-blue">Design Principles</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Three rules we never break
            </h2>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-blue mb-4 block">01</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Design to play
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Every WARDEN product starts with a gameplay problem. If a tool
                does not speed up a phase, clarify a rule, or reduce cognitive
                load, it does not ship. No decoration. No filler. Just
                function.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-green mb-4 block">02</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Build to last
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Brass, aluminum, and acrylic machined to precise tolerances.
                Every material is selected for its mechanical properties and
                proven across hundreds of sessions. A WARDEN tool should
                outlast the campaign.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-ochre mb-4 block">03</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Evolve without losing identity
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                New products, new systems, new materials — but the same
                commitment to clarity, compatibility, and coherence. Each
                collection adds capability without fragmenting the experience.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── SYSTEMS ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Game Systems</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Compatible across the spectrum
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <DataPanel label="BattleTech Classic" className="border-warden-ochre/20">
              <DataRow label="Scale" value="1 hex = 30m" />
              <DataRow label="Units" value="Lance / Company" />
              <DataRow label="Tools" value="4 products" />
            </DataPanel>
            <DataPanel label="Alpha Strike" className="border-warden-blue/20">
              <DataRow label="Scale" value="Abstracted" />
              <DataRow label="Units" value="Company / Battalion" />
              <DataRow label="Tools" value="1 product" />
            </DataPanel>
            <DataPanel label="AeroTech" className="border-warden-green/20">
              <DataRow label="Scale" value="Atmospheric / Space" />
              <DataRow label="Units" value="Fighter / Squadron" />
              <DataRow label="Tools" value="2 products" />
            </DataPanel>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── HOW IT WORKS ── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Process</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              How WARDEN works
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We do not operate a direct checkout. Here is how you get WARDEN
              products on your table.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div>
                <span className="text-data text-warden-blue block mb-2">01</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Browse &amp; Select
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Explore the catalog and add products to your Selection. No
                  account needed.
                </p>
              </div>
              <div>
                <span className="text-data text-warden-green block mb-2">02</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Request a Quote
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Submit your Selection with your contact details. We review
                  and respond with pricing, availability, and delivery estimates.
                </p>
              </div>
              <div>
                <span className="text-data text-warden-ochre block mb-2">03</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Confirm &amp; Receive
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Once you confirm, your order enters production. Small-batch
                  manufacturing ensures quality. Shipping worldwide.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
