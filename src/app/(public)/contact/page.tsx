import type { Metadata } from "next";

import { getTranslations } from "next-intl/server";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { ContactForm } from "@/components/forms/contact-form";
import { DataPanel, DataRow } from "@/components/shared/data-panel";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight, Mail, MapPin, Clock } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("contact");

  return {
    title: t("title"),
    description: t("metaDescription"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations("contact");

  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {t("intro")}
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border border-border bg-warden-surface p-6">
              <h2 className="text-base font-semibold text-foreground mb-6">
                {t("formTitle")}
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <DataPanel
              label={
                <>
                  <Mail className="size-3.5 inline mr-1.5" />
                  {t("emailLabel")}
                </>
              }
            >
              <DataRow label={t("contactRow")} value="wardenminis@gmail.com" />
            </DataPanel>
            <DataPanel
              label={
                <>
                  <MapPin className="size-3.5 inline mr-1.5" />
                  {t("locationLabel")}
                </>
              }
            >
              <DataRow label={t("operationsRow")} value={t("remoteValue")} />
            </DataPanel>
            <DataPanel
              label={
                <>
                  <Clock className="size-3.5 inline mr-1.5" />
                  {t("responseTimeLabel")}
                </>
              }
            >
              <DataRow label={t("standardRow")} value={t("businessDaysValue")} />
            </DataPanel>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <WardenButton href="/community-support">
            Community Support
            <ChevronRight className="size-4" />
          </WardenButton>
          <WardenButton href="/about" variant="outline">
            {t("aboutWarden")}
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
