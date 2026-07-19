import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts, getDrops } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { VideoHero } from "@/components/layout/video-hero";

import { ChevronRight, CalendarDays, Timer } from "lucide-react";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("es-ES", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function Home() {
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const products = await getActiveProducts();
  const featuredProducts = products.filter((p) => p.featured);
  const [drops] = await Promise.all([getDrops()]);
  const latestDrop = drops.find((d) => d.status === "live") ?? drops.find((d) => d.status === "upcoming") ?? null;

  return (
    <>
      {/* ── 1. HERO ── */}
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
              <WardenButton href="/catalog">
                {t("exploreCollections")}
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/drops" variant="outline">
                {t("ourApproach")}
              </WardenButton>
            </div>
          </div>
        </Container>
      </VideoHero>

      {/* ── 2. THREE RULES WE NEVER BREAK ── */}
      <Section>
        <Container>
          <div className="mb-10">
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

      {/* ── 3. FEATURED PRODUCTS ── */}
      <Section>
        <Container>
          <div className="mb-8">
            <Eyebrow>{t("featuredEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("featuredTitle")}
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
          <div className="mt-6">
            <WardenButton href="/catalog" variant="outline">
              {c("viewCollection")} <ChevronRight className="size-4" />
            </WardenButton>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── 4. LATEST DROP (placeholder) ── */}
      <Section>
        <Container>
          {latestDrop ? (
            <div className="border border-border bg-warden-surface p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-2">
                  {latestDrop.status === "live" ? "Drop activo" : "Próximo drop"}
                </p>
                <h3 className="text-xl font-semibold tracking-tight text-foreground">
                  {latestDrop.name}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
                  {latestDrop.description}
                </p>
                <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {formatDate(latestDrop.startsAt)}
                  </span>
                  {latestDrop.endsAt && (
                    <span className="inline-flex items-center gap-1">
                      <Timer className="size-3.5" />
                      {formatDate(latestDrop.endsAt)}
                    </span>
                  )}
                </div>
              </div>
              <WardenButton href={`/drops/${latestDrop.slug}`} size="lg" className="shrink-0">
                Ver drop <ChevronRight className="size-4" />
              </WardenButton>
            </div>
          ) : (
            <div className="border border-dashed border-border/50 p-8 text-center">
              <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
                Próximo drop
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                El próximo lanzamiento aparecerá aquí.
              </p>
            </div>
          )}
        </Container>
      </Section>

      <SectionDivider />

      {/* ── 5. HOW WARDEN WORKS ── */}
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
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
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
