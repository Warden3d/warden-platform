import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts, getDrops } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import Image from "next/image";
import { VideoHero } from "@/components/layout/video-hero";
import { HeroBrand } from "@/components/layout/hero-brand";
import { ChevronRight } from "lucide-react";

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

      {/* ── 2. ACTIVE DROP (conditional — contained module) ── */}
      {activeDrop && (
        <>
          <Section className="pt-20 md:pt-24 pb-8 md:pb-10">
            <div className="mx-auto max-w-[90rem] px-6 lg:px-10">
              <div className="relative overflow-hidden rounded-sm border border-border w-full h-auto md:h-[460px] min-h-[280px]">
                {/* Panoramic background */}
                <Image
                  src="/images/drops/active-drop-bg.png"
                  alt="WARDEN modular science-fiction command complex arranged on a BattleTech tabletop map."
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                  priority
                />
                {/* Extra dark gradient overlay on left for legibility */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

                {/* Content: left-aligned, in the dark zone */}
                <div className="relative z-10 h-full flex items-center">
                  <div className="w-full px-8 md:px-14">
                    <div className="max-w-[440px] lg:max-w-[500px]">
                      <p className="flex items-center gap-2 text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-warden-ochre mb-3">
                        <span className="inline-block size-1.5 rounded-full bg-warden-ochre animate-pulse opacity-80" />
                        ACTIVE DROP
                      </p>
                      <h2 className="text-[1.65rem] md:text-[2.0625rem] font-semibold tracking-tight text-foreground">
                        {activeDrop.name}
                      </h2>
                      <p className="mt-2 text-sm text-white/70 leading-relaxed line-clamp-2">
                        {activeDrop.description}
                      </p>
                      <p className="mt-2 text-xs text-white/50">
                        Reservations close August 31, 2026
                      </p>
                      <div className="mt-4">
                        <WardenButton href="/drops">
                          Explore the Drop <ChevronRight className="size-4" />
                        </WardenButton>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
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
