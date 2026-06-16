import { Container, Section } from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";
import { getTranslations } from "next-intl/server";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  return (
    <Section>
      <Container>
        <div className="max-w-lg mx-auto text-center py-16">
          <span className="text-data text-warden-blue block mb-4">404</span>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("title")}
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {t("description")}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <WardenButton href="/">{t("backToHome")}</WardenButton>
            <WardenButton href="/catalog" variant="outline">
              {t("exploreCatalog")}
            </WardenButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
