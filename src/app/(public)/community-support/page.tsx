import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { CommunitySupportForm } from "@/components/forms/community-support-form";
import { WardenButton } from "@/components/ui/warden-button";
import {
  ChevronRight,
  Users,
  Handshake,
  ShieldCheck,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Community Support",
  description:
    "Programa de apoyo a asociaciones, clubes, organizadores y comunidades de juego. WARDEN colabora con iniciativas que fortalecen el ecosistema del wargame.",
};

// Códigos del schema (src/lib/schemas/community-support.ts). Solo se usan como
// claves de traducción; los valores nunca se alteran.
const APPLICANT_KEYS = [
  "asociacion",
  "club",
  "organizador",
  "comunidad",
  "iniciativa",
] as const;

const SUPPORT_KEYS = [
  "materialPromocional",
  "premios",
  "escenografia",
  "elementosJuego",
  "asesoramiento",
  "difusion",
] as const;

export default async function CommunitySupportPage() {
  const t = await getTranslations("communitySupport");
  const tNav = await getTranslations("nav");

  const applicantTypes = APPLICANT_KEYS.map((key) => ({
    key,
    title: t(`applicants.${key}.title`),
    description: t(`applicants.${key}.description`),
  }));

  const supportForms = SUPPORT_KEYS.map((key) => ({
    key,
    title: t(`support.${key}.title`),
    description: t(`support.${key}.description`),
  }));

  const clarifyItems = [
    { icon: Handshake, text: t("clarifications.noCounterpart") },
    { icon: ShieldCheck, text: t("clarifications.discretionary") },
    { icon: Users, text: t("clarifications.resources") },
  ];

  return (
    <>
      {/* Hero */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-warden-ochre">
              {t("eyebrow")}
            </Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {t("title")}
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
              {t("intro")}
            </p>
          </div>
        </Container>
      </Section>

      {/* What is CS */}
      <Section className="!pt-0">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>{t("what.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              {t("what.title")}
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              {t("what.body")}
            </p>
          </div>
        </Container>
      </Section>

      {/* Who can apply */}
      <Section className="!pt-0">
        <Container>
          <SectionDivider className="mb-10" />
          <Eyebrow>{t("applicants.eyebrow")}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            {t("applicants.title")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {applicantTypes.map((item) => (
              <div
                key={item.key}
                className="border border-border bg-warden-surface p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Support forms */}
      <Section className="!pt-0">
        <Container>
          <SectionDivider className="mb-10" />
          <Eyebrow>{t("support.eyebrow")}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            {t("support.title")}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportForms.map((item) => (
              <div
                key={item.key}
                className="border border-border bg-warden-surface p-5"
              >
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Clarification */}
      <Section className="!pt-0">
        <Container>
          <SectionDivider className="mb-10" />
          <Eyebrow>{t("clarifications.eyebrow")}</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            {t("clarifications.title")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {clarifyItems.map((item) => (
              <div
                key={item.text}
                className="border border-border bg-warden-surface p-5"
              >
                <item.icon className="size-5 text-warden-ochre mb-3" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* Form */}
      <Section className="!pt-0">
        <Container>
          <SectionDivider className="mb-10" />
          <div className="max-w-3xl">
            <Eyebrow>{t("request.eyebrow")}</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-2">
              {t("request.title")}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              {t("request.intro")}
            </p>
          </div>
          <div className="border border-border bg-warden-surface p-6 max-w-2xl">
            <CommunitySupportForm />
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section className="!pt-0">
        <Container>
          <div className="flex flex-wrap gap-3">
            <WardenButton href="/contact">
              {t("cta.contact")}
              <ChevronRight className="size-4" />
            </WardenButton>
            <WardenButton href="/about" variant="outline">
              {tNav("about")}
            </WardenButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
