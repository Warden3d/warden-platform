import { Fragment } from "react";
import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts, getDrops } from "@/lib/data";

import { WardenCard } from "@/components/catalog/warden-card";
import { WardenButton } from "@/components/ui/warden-button";
import Image from "next/image";
import { VideoHero } from "@/components/layout/video-hero";
import { HeroBrand } from "@/components/layout/hero-brand";
import { Boxes, ChevronRight, FileText, Hexagon, Package, Search, type LucideIcon } from "lucide-react";

const PROCESS_STEPS: {
  num: string;
  icon: LucideIcon;
  titleKey: string;
  descKey: string;
}[] = [
  { num: "01", icon: Search, titleKey: "step1Title", descKey: "step1Desc" },
  { num: "02", icon: FileText, titleKey: "step2Title", descKey: "step2Desc" },
  { num: "03", icon: Package, titleKey: "step3Title", descKey: "step3Desc" },
];

/* R079 — Icono técnico hexagonal: fondo oscuro recortado, contorno azul
   exterior + segundo contorno interior, pictograma claro centrado. */
function ProcessIcon({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <div className="relative h-[96px] w-[105px] shrink-0" aria-hidden="true">
      <div className="absolute inset-0 bg-[hsl(220_10%_8%)] [clip-path:polygon(50%_0%,95%_25%,95%_75%,50%_100%,5%_75%,5%_25%)]" />
      <Hexagon className="absolute inset-0 h-full w-full text-warden-blue" strokeWidth={1.25} />
      <Hexagon
        className="absolute inset-[10px] h-[calc(100%-20px)] w-[calc(100%-20px)] text-warden-blue/45"
        strokeWidth={1}
      />
      <Icon className="absolute left-1/2 top-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2 text-[hsl(220_8%_86%)]" strokeWidth={1.5} />
    </div>
  );
}

export default async function Home() {
  const t = await getTranslations("home");
  const c = await getTranslations("common");
  const products = await getActiveProducts();
  const featuredProducts = products.filter((p) => p.featured);

  // R077 — Imágenes reales de prueba en ventana interior (4 fichas).
  // El texto del producto no coincide con las imágenes: son pruebas visuales.
  const CARD_WINDOW_IMAGES = [
    {
      src: "/images/products/warden-conjunto-urbano-card.jpg",
      alt: "WARDEN modular urban district scenery on a BattleTech tabletop.",
    },
    {
      src: "/images/products/warden-complejo-industrial-card.jpg",
      alt: "WARDEN industrial complex scenery on a BattleTech tabletop.",
    },
    {
      src: "/images/products/warden-base-fortificada-card.jpg",
      alt: "WARDEN fortified base scenery on a BattleTech tabletop.",
    },
    {
      src: "/images/products/warden-sector-urbano-completo-card.jpg",
      alt: "WARDEN complete urban sector scenery on a BattleTech tabletop.",
    },
  ];
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
      <Section className="pb-14 md:pb-20">
        <Container>
          <div className="mb-8">
            <Eyebrow>{t("featuredEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("featuredTitle")}
              <span className="text-warden-ochre">.</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">
              {t("featuredDesc")}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <WardenCard
                key={product.id}
                product={product}
                windowImage={
                  CARD_WINDOW_IMAGES[index]
                }
              />
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <WardenButton
              href="/catalog"
              variant="outline"
              size="lg"
              className="border-[hsl(210_45%_60%)] bg-[hsl(220_10%_9%)] px-8 text-[hsl(210_50%_74%)] hover:border-[hsl(210_55%_70%)] hover:bg-[hsl(220_10%_11%)] hover:text-white hover:shadow-[0_0_14px_hsl(210_70%_60%_/_0.35)]"
            >
              <Boxes className="size-4" aria-hidden="true" />
              {c("viewFullCatalog")}
              <ChevronRight className="size-4" aria-hidden="true" />
            </WardenButton>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── 5. HOW WARDEN WORKS ── */}
      <Section className="pt-10 pb-14 md:pt-16 md:pb-20">
        <Container>
          <Eyebrow className="text-warden-blue">{t("processEyebrow")}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("processTitle")}
            <span className="text-warden-ochre">.</span>
          </h2>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_auto_1fr_auto_1fr] lg:items-stretch lg:gap-x-6">
            {PROCESS_STEPS.map((step, index) => (
              <Fragment key={step.num}>
                {index > 0 && (
                  <div className="flex items-center justify-center gap-2 py-1 lg:py-0">
                    <div className="h-8 w-px bg-[hsl(220_8%_14%)] lg:h-28" />
                    <ChevronRight className="size-4 rotate-90 text-warden-blue/70 lg:rotate-0" />
                  </div>
                )}
                <div className="grid grid-cols-[auto_1fr] items-stretch gap-5">
                  <div className="flex items-center justify-center">
                    <ProcessIcon icon={step.icon} />
                  </div>
                  <div className="min-w-0">
                    <span className="text-data block text-base font-semibold tracking-widest text-warden-blue">
                      {step.num}
                    </span>
                    <h3 className="mt-1.5 text-base font-semibold tracking-tight text-foreground">
                      {t(step.titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[hsl(220_6%_62%)]">
                      {t(step.descKey)}
                    </p>
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
