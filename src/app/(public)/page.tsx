import Link from "next/link";
import { Container, Section, Eyebrow, SectionDivider } from "@/components/shared/container";
import { getActiveProducts } from "@/lib/data";

import { ProductCard } from "@/components/catalog/product-card";
import { WardenButton } from "@/components/ui/warden-button";
import { DataPanel, DataRow } from "@/components/shared/data-panel";

import { ChevronRight, ArrowUpRight, Gauge, Box, Shield } from "lucide-react";

export default async function Home() {
  const products = await getActiveProducts();
  const featuredProducts = products.filter((p) => p.featured);


  return (
    <>
      {/* ── HERO ── */}
      <section className="relative overflow-hidden border-b border-border bg-warden-carbon">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,hsl(210,35%,52%,0.06),transparent_70%)]" />
        <Container>
          <div className="py-24 md:py-32 lg:py-36 max-w-4xl relative">
            <Eyebrow className="text-warden-blue">
              Equipamiento de precisión para wargames de mesa
            </Eyebrow>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Herramientas diseñadas
              <br />
              <span className="text-warden-blue">para la mesa.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
              WARDEN desarrolla productos físicos que eliminan fricción en cada
              fase de BattleTech Classic, Alpha Strike y AeroTech. Sin
              decoración. Sin relleno. Solo herramientas de precisión que se
              ganan su lugar sobre la mesa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <WardenButton href="/collections">
                Explorar colecciones
                <ChevronRight className="size-4" />
              </WardenButton>
              <WardenButton href="/about" variant="outline">
                Nuestro enfoque
              </WardenButton>
              <WardenButton href="/selection" variant="ghost">
                Ir a Mi Selección
                <ArrowUpRight className="size-3.5" />
              </WardenButton>
            </div>
          </div>
        </Container>
      </section>

      {/* ── ACCESS BLOCKS ── */}
      <Section>
        <Container>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
            {/* Warden Core */}
            <Link
              href="/collections/warden-core"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Shield className="size-5 text-warden-ochre mb-5" />
              <Eyebrow>Colección</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                WARDEN Core
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Herramientas de latón, aluminio y acrílico para BattleTech
                Classic. Marcadores de hexágono, diales de calor, deslizadores
                de blindaje — construidos para cientos de sesiones.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                Ver colección <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Licensed Universes */}
            <Link
              href="/collections/licenses"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Gauge className="size-5 text-warden-green mb-5" />
              <Eyebrow>Programa</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-green transition-colors">
                Universos licenciados
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Colaboraciones con creadores independientes y estudios.
                Herramientas a medida, estética única, estándares de
                fabricación WARDEN.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-green uppercase tracking-wider">
                Saber más <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Bundles */}
            <Link
              href="/bundles"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <Box className="size-5 text-warden-blue mb-5" />
              <Eyebrow>Ahorro</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-warden-blue transition-colors">
                Bundles
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Conjuntos seleccionados a precio reducido. Commander Pack,
                Aerospace Bundle, Starter Kit — todo en un solo paquete.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-warden-blue uppercase tracking-wider">
                Ver bundles <ChevronRight className="size-3" />
              </span>
            </Link>

            {/* Community Support */}
            <Link
              href="/community-support"
              className="group bg-warden-carbon p-6 transition-colors hover:bg-warden-surface"
            >
              <svg
                className="size-5 text-muted-foreground mb-5 group-hover:text-foreground transition-colors"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <Eyebrow>Recursos</Eyebrow>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground group-hover:text-foreground transition-colors">
                Community Support
              </h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Guías de producto, FAQs y canales de comunidad. Wardens
                ayudando a wardens en los tres sistemas de juego.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider group-hover:text-foreground transition-colors">
                Obtener soporte <ChevronRight className="size-3" />
              </span>
            </Link>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── FEATURED PRODUCTS ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Destacados</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Probados sobre la mesa
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Nuestras herramientas más usadas, testadas en miles de sesiones
              de juego.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} variant="compact" />
            ))}
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── DESIGN PRINCIPLES ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow className="text-warden-blue">Design Principles</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Three rules we never break
            </h2>
          </div>

          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-blue mb-4 block">01</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Diseñar para jugar
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada producto WARDEN parte de un problema de juego. Si una
                herramienta no acelera una fase, clarifica una regla o reduce
                la carga cognitiva, no se fabrica. Sin decoración. Sin relleno.
                Solo función.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-green mb-4 block">02</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Construir para durar
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Latón, aluminio y acrílico mecanizados con tolerancias
                precisas. Cada material se selecciona por sus propiedades
                mecánicas y se valida en cientos de sesiones. Una herramienta
                WARDEN debe sobrevivir a la campaña.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-ochre mb-4 block">03</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Evolucionar sin perder identidad
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Nuevos productos, nuevos sistemas, nuevos materiales — pero el
                mismo compromiso con la claridad, la compatibilidad y la
                coherencia. Cada colección añade capacidad sin fragmentar la
                experiencia.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── SYSTEMS ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Sistemas de juego</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Compatible en todo el espectro
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            <DataPanel label="BattleTech Classic" className="border-warden-ochre/20">
              <DataRow label="Escala" value="1 hexágono = 30 m" />
              <DataRow label="Unidades" value="Lanza / Compañía" />
              <DataRow label="Herramientas" value="4 productos" />
            </DataPanel>
            <DataPanel label="Alpha Strike" className="border-warden-blue/20">
              <DataRow label="Escala" value="Abstracta" />
              <DataRow label="Unidades" value="Compañía / Batallón" />
              <DataRow label="Herramientas" value="1 producto" />
            </DataPanel>
            <DataPanel label="AeroTech" className="border-warden-green/20">
              <DataRow label="Escala" value="Atmosférica / Espacial" />
              <DataRow label="Unidades" value="Caza / Escuadrón" />
              <DataRow label="Herramientas" value="2 productos" />
            </DataPanel>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── HOW IT WORKS ── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Proceso</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Cómo funciona WARDEN
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              No operamos con checkout directo. Así es como conseguir productos
              WARDEN para tu mesa.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              <div>
                <span className="text-data text-warden-blue block mb-2">01</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Explora y selecciona
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Recorre el catálogo y añade productos a tu Selección. No se
                  necesita cuenta.
                </p>
              </div>
              <div>
                <span className="text-data text-warden-green block mb-2">02</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Solicita presupuesto
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Envía tu Selección con tus datos de contacto. Revisamos y
                  respondemos con precio, disponibilidad y plazos de entrega.
                </p>
              </div>
              <div>
                <span className="text-data text-warden-ochre block mb-2">03</span>
                <h4 className="text-sm font-semibold text-foreground">
                  Confirma y recibe
                </h4>
                <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                  Una vez confirmado, tu pedido entra en producción. Fabricación
                  en pequeños lotes para garantizar calidad. Envíos internacionales.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
