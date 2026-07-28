import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts, getDrops } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import Image from "next/image";
import { VideoHero } from "@/components/layout/video-hero";
import { HeroBrand } from "@/components/layout/hero-brand";
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
  const activeDrop = drops.find((d) => d.status === "live") ?? null;

  return (
    <>
      {/* ── 1. HERO — full first viewport ── */}
      <VideoHero>
        <HeroBrand />
      </VideoHero>

      {/* ── 2. ACTIVE DROP (conditional) ── */}
      {activeDrop && (
        <>
          <Section>
            <Container>
              <div className="border border-border bg-warden-surface p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-2">
                    {"Drop activo"}
                  </p>
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {activeDrop.name}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground max-w-xl">
                    {activeDrop.description}
                  </p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="size-3.5" />
                      {formatDate(activeDrop.startsAt)}
                    </span>
                    {activeDrop.endsAt && (
                      <span className="inline-flex items-center gap-1">
                        <Timer className="size-3.5" />
                        {formatDate(activeDrop.endsAt)}
                      </span>
                    )}
                  </div>
                </div>
                <WardenButton href={`/drops/${activeDrop.slug}`} size="lg" className="shrink-0">
                  Ver drop <ChevronRight className="size-4" />
                </WardenButton>
              </div>
            </Container>
          </Section>
          <SectionDivider />
        </>
      )}

      {/* ── 3. WHAT DEFINES US ── */}
      <Section className="py-16 md:py-20">
        <Container>
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
            {/* Left: Image */}
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm w-full">
              <Image
                src="/images/what-defines-us/scenery-city.png"
                alt="WARDEN modular science-fiction city scenery arranged as a BattleTech tabletop environment."
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {/* Subtle gradient fade on right edge for integration */}
              <div className="absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-warden-carbon/60 via-warden-carbon/20 to-transparent pointer-events-none hidden md:block" />
            </div>

            {/* Right: Content */}
            <div className="flex flex-col gap-y-6 md:gap-y-8">
              <div>
                <Eyebrow className="text-warden-blue">{t("designPrinciplesEyebrow")}</Eyebrow>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {t("designPrinciplesTitle")}
                </h2>
              </div>

              {/* 01 */}
              <div>
                <span className="text-data text-warden-blue block mb-1">{t("principle1.number")}</span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("principle1.title")}
                </h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
                  {t("principle1.desc")}
                </p>
              </div>

              <hr className="border-t border-border/50" />

              {/* 02 */}
              <div>
                <span className="text-data text-warden-green block mb-1">{t("principle2.number")}</span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("principle2.title")}
                </h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
                  {t("principle2.desc")}
                </p>
              </div>

              <hr className="border-t border-border/50" />

              {/* 03 */}
              <div>
                <span className="text-data text-warden-ochre block mb-1">{t("principle3.number")}</span>
                <h3 className="text-lg font-semibold tracking-tight text-foreground">
                  {t("principle3.title")}
                </h3>
                <p className="mt-1.5 text-sm text-white/60 leading-relaxed">
                  {t("principle3.desc")}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── 4. FEATURED PRODUCTS ── */}
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
