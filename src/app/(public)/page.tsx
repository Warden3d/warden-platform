import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { DataPanel, DataRow } from "@/components/shared/data-panel";
import { VideoHero } from "@/components/layout/video-hero";

import { ChevronRight, ArrowUpRight, Gauge, Box, Shield } from "lucide-react";

export default async function Home() {
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const products = await getActiveProducts();
  const featuredProducts = products.filter((p) => p.featured);

  return (
    <>
      {/* ── HERO (video background) ── */}
      <VideoHero>
        <Container>
          <div className="py-24 md:py-32 lg:py-36 max-w-4xl">
            <Eyebrow className="text-warden-blue">
              {t("heroEyebrow")}
            </Eyebrow>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {t("heroTitle1")}
              <br />
              <span className="text-warden-blue">{t("heroTitle2")}</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
              {t("heroDesc")}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WardenButton href="/collections">
                {t("exploreCollections")}
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/about" variant="outline">
                {t("ourApproach")}
              </WardenButton>
              <WardenButton href="/selection" variant="ghost">
                {t("goToMySelection")}
                <ArrowUpRight className="size-3.5" />
              </WardenButton>
            </div>
          </div>
        </Container>
      </VideoHero>

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
              <Eyebrow>{t("wardenCore.eyebrow")}</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                {t("wardenCore.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("wardenCore.desc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                {c("viewCollection")} <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Licensed Universes */}
            <Link
              href="/collections/licenses"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Gauge className="size-5 text-warden-green mb-5" />
              <Eyebrow>{t("licensedUniverses.eyebrow")}</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-green transition-colors">
                {t("licensedUniverses.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("licensedUniverses.desc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-green uppercase tracking-wider">
                {c("learnMore")} <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Bundles */}
            <Link
              href="/bundles"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Box className="size-5 text-warden-blue mb-5" />
              <Eyebrow>{t("bundles.eyebrow")}</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                {t("bundles.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("bundles.desc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                {c("viewBundles")} <ChevronRight className="size-3" />
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
              <Eyebrow>{t("communitySupport.eyebrow")}</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors">
                {t("communitySupport.title")}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("communitySupport.desc")}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                {c("getSupport")} <ChevronRight className="size-3" />
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
            <Eyebrow>{t("featuredEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("featuredTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("featuredDesc")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── DESIGN PRINCIPLES ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow className="text-warden-blue">{t("designPrinciplesEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("designPrinciplesTitle")}
            </h2>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-blue mb-4 block">{t("principle1.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("principle1.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("principle1.desc")}
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-green mb-4 block">{t("principle2.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("principle2.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("principle2.desc")}
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-ochre mb-4 block">{t("principle3.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("principle3.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("principle3.desc")}
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
            <Eyebrow>{t("systemsEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("systemsTitle")}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <DataPanel label="BattleTech Classic" className="border-warden-ochre/20">
              <DataRow label="Scale" value="1 hex = 30 m" />
              <DataRow label="Units" value="Lance / Company" />
              <DataRow label="Tools" value="4 products" />
            </DataPanel>
            <DataPanel label="Alpha Strike" className="border-warden-blue/20">
              <DataRow label="Scale" value="Abstract" />
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
            <Eyebrow>{t("processEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("processTitle")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {t("processDesc")}
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div>
                <span className="text-data text-warden-blue block mb-2">01</span>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("step1Title")}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {t("step1Desc")}
                </p>
              </div>
              <div>
                <span className="text-data text-warden-green block mb-2">02</span>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("step2Title")}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {t("step2Desc")}
                </p>
              </div>
              <div>
                <span className="text-data text-warden-ochre block mb-2">03</span>
                <h4 className="text-sm font-semibold text-foreground">
                  {t("step3Title")}
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  {t("step3Desc")}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
