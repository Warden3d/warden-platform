import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import {
  Container,
  Section,
  Eyebrow,
  SectionDivider,
} from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";
import { DataPanel, DataRow } from "@/components/shared/data-panel";
import {
  Shield,
  Compass,
  Wrench,
  Eye,
  Box,
  ShieldCheck,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About WARDEN",
  description:
    "WARDEN develops physical precision equipment for BattleTech Classic, Alpha Strike and AeroTech. Learn about our history, values and design philosophy.",
};

const values = [
  { icon: Shield },
  { icon: Compass },
  { icon: Wrench },
  { icon: Eye },
  { icon: Box },
  { icon: ShieldCheck },
];

const timeline = [
  { year: "2019" },
  { year: "2020" },
  { year: "2021" },
  { year: "2022" },
  { year: "2023" },
  { year: "2024" },
  { year: "2025" },
];

const dnaPrinciples = [
  {
    number: "01",
    accent: "text-warden-blue",
  },
  {
    number: "02",
    accent: "text-warden-green",
  },
  {
    number: "03",
    accent: "text-warden-ochre",
  },
  {
    number: "04",
    accent: "text-warden-blue",
  },
  {
    number: "05",
    accent: "text-warden-green",
  },
  {
    number: "06",
    accent: "text-warden-ochre",
  },
];

export default async function AboutPage() {
  const t = await getTranslations("about");

  return (
    <>
      {/* ── HERO: QUÉ ES WARDEN ── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-warden-blue">{t("identity.eyebrow")}</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              {t("hero.description")}
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {t("hero.description2")}
            </p>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── MISIÓN Y VISIÓN ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("purpose.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("purpose.title")}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-warden-surface p-6">
              <Eyebrow className="text-warden-blue mb-3">{t("mission.eyebrow")}</Eyebrow>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("mission.description")}
              </p>
            </div>
            <div className="border border-border bg-warden-surface p-6">
              <Eyebrow className="text-warden-green mb-3">{t("vision.eyebrow")}</Eyebrow>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("vision.description")}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── VALORES ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("principles.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("principles.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("principles.description")}
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <div
                key={i}
                className="bg-warden-carbon p-6"
              >
                <v.icon className="size-5 text-warden-blue mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {t(`principles.items.${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`principles.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── SISTEMAS DE REFERENCIA ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("systems.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("systems.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("systems.description")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <DataPanel label={t("systems.items.0.name")} className="border-warden-ochre/20">
              <DataRow label={t("systems.labels.scale")} value={t("systems.items.0.scale")} />
              <DataRow label={t("systems.labels.unitType")} value={t("systems.items.0.unitType")} />
              <DataRow label={t("systems.labels.coverage")} value={t("systems.items.0.coverage")} />
            </DataPanel>
            <DataPanel label={t("systems.items.1.name")} className="border-warden-blue/20">
              <DataRow label={t("systems.labels.scale")} value={t("systems.items.1.scale")} />
              <DataRow label={t("systems.labels.unitType")} value={t("systems.items.1.unitType")} />
              <DataRow label={t("systems.labels.coverage")} value={t("systems.items.1.coverage")} />
            </DataPanel>
            <DataPanel label={t("systems.items.2.name")} className="border-warden-green/20">
              <DataRow label={t("systems.labels.scale")} value={t("systems.items.2.scale")} />
              <DataRow label={t("systems.labels.unitType")} value={t("systems.items.2.unitType")} />
              <DataRow label={t("systems.labels.coverage")} value={t("systems.items.2.coverage")} />
            </DataPanel>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── FILOSOFÍA ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("philosophy.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("philosophy.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("philosophy.description")}
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-blue mb-4 block">01</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("philosophy.items.0.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("philosophy.items.0.desc")}
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-green mb-4 block">02</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("philosophy.items.1.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("philosophy.items.1.desc")}
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-ochre mb-4 block">03</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                {t("philosophy.items.2.title")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("philosophy.items.2.desc")}
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── HISTORIA ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("history.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("history.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("history.description")}
            </p>
          </div>
          <div className="relative space-y-10 pl-6 sm:pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[9px]" />
            {timeline.map((m, i) => (
              <div key={i} className="relative pl-6 sm:pl-8">
                <span className="absolute left-[-5px] top-1.5 size-2.5 rounded-full border border-warden-blue bg-warden-carbon sm:left-[-7px]" />
                <span className="text-data text-warden-blue">{m.year}</span>
                <h3 className="text-base font-semibold text-foreground mt-1">
                  {t(`history.items.${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">
                  {t(`history.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── ADN DE DISEÑO ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>{t("designDna.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              {t("designDna.title")}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              {t("designDna.description")}
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {dnaPrinciples.map((p, i) => (
              <div key={p.number} className="bg-warden-carbon p-6">
                <span
                  className={`text-data ${p.accent} mb-3 block`}
                >
                  {p.number}
                </span>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {t(`designDna.items.${i}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`designDna.items.${i}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── CTA ── */}
      <Section>
        <Container>
          <div className="border border-border bg-warden-surface p-8 md:p-12">
            <div className="max-w-2xl">
              <Eyebrow>{t("cta.eyebrow")}</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {t("cta.title")}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t("cta.description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <WardenButton href="/catalog">
                  {t("cta.goToCatalog")}
                  <ChevronRight className="size-4" />
                </WardenButton>
                <WardenButton href="/community-support" variant="outline">
                  {t("cta.communitySupport")}
                  <ArrowUpRight className="size-3.5" />
                </WardenButton>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
