import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts, getDrops } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
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
      <Section className="pt-12 md:pt-16 pb-20 md:pb-28">
        <Container>
          <div className="mb-10">
            <Eyebrow className="text-warden-blue">{t("designPrinciplesEyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("designPrinciplesTitle")}
            </h2>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3">
            {/* 01 — Designed around the game */}
            <div className="bg-warden-carbon p-8">
              <svg className="mb-2 size-8 text-warden-blue" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="14,2 25,8 25,20 14,26 3,20 3,8" />
                <line x1="14" y1="2" x2="14" y2="26" />
                <circle cx="14" cy="14" r="2" />
              </svg>
              <span className="text-data text-warden-blue mb-1 block">{t("principle1.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 mt-0">
                {t("principle1.title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {t("principle1.desc")}
              </p>
            </div>

            {/* 02 — Built for real play */}
            <div className="bg-warden-carbon p-8">
              <svg className="mb-2 size-8 text-warden-green" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="4,6 11,4 11,22 4,24" />
                <polygon points="17,4 24,6 24,24 17,22" />
                <line x1="11" y1="10" x2="17" y2="10" />
                <line x1="11" y1="18" x2="17" y2="18" />
                <circle cx="14" cy="14" r="2.5" />
              </svg>
              <span className="text-data text-warden-green mb-1 block">{t("principle2.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 mt-0">
                {t("principle2.title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {t("principle2.desc")}
              </p>
            </div>

            {/* 03 — Designed to work together */}
            <div className="bg-warden-carbon p-8">
              <svg className="mb-2 size-8 text-warden-ochre" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="3,10 7,8 11,10 11,15 7,17 3,15" />
                <polygon points="11,10 15,8 19,10 19,15 15,17 11,15" />
                <polygon points="19,10 23,8 27,10 27,15 23,17 19,15" />
              </svg>
              <span className="text-data text-warden-ochre mb-1 block">{t("principle3.number")}</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-2 mt-0">
                {t("principle3.title")}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {t("principle3.desc")}
              </p>
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
