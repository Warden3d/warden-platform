import type { Metadata } from "next";
import Link from "next/link";
import { Container, Section, Eyebrow } from "@/components/shared/container";
import { CatalogView } from "@/components/catalog/catalog-view";
import {
  getProducts,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getLicenses,
  getProductTypes,
} from "@/lib/data";
import { WardenButton } from "@/components/ui/warden-button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Wasteland Studios",
  description:
    "Estudio independiente especializado en escenografía post-apocalíptica y terrenos modulares para wargames de ciencia ficción.",
};

export default async function WastelandStudiosPage() {
  const [products, collections, categories, compatibilitySystems, licenses, productTypes] =
    await Promise.all([
      getProducts(),
      getCollections(),
      getCategories(),
      getCompatibilitySystems(),
      getLicenses(),
      getProductTypes(),
    ]);

  const license = licenses.find((l) => l.id === "lic-wasteland-studios");
  const licenseProducts = products.filter(
    (p) => p.associatedLicenseId === "lic-wasteland-studios" && p.status === "active"
  );

  if (!license) {
    return (
      <Section>
        <Container>
          <div className="text-center py-16">
            <h1 className="text-2xl font-semibold text-foreground">
              Licencia no encontrada
            </h1>
            <p className="mt-2 text-muted-foreground">
              La licencia que buscas no existe.
            </p>
            <div className="mt-6 inline-block">
              <WardenButton href="/collections/licenses" variant="outline">
                Volver a licencias
              </WardenButton>
            </div>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <Link
          href="/collections/licenses"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-4" />
          Todas las licencias
        </Link>

        <div className="mb-10 max-w-3xl">
          <Eyebrow>Colaborador licenciado</Eyebrow>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {license.name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
            {license.description}
          </p>
          {license.website && (
            <div className="mt-4">
              <a
                href={license.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-warden-blue hover:underline"
              >
                <ExternalLink className="size-3.5" />
                Visitar web del estudio
              </a>
            </div>
          )}
        </div>

        <CatalogView
          products={licenseProducts}
          categories={categories}
          compatibilitySystems={compatibilitySystems}
          collections={collections}
          productTypes={productTypes}
          licenses={licenses}
          title={`${licenseProducts.length} ${licenseProducts.length === 1 ? "Producto" : "Productos"}`}
          description="Productos desarrollados en colaboración con Wasteland Studios, manteniendo los estándares de precisión WARDEN."
        />
      </Container>
    </Section>
  );
}
