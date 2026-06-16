import type { Metadata } from "next";
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
  {
    icon: Shield,
    label: "Funcionalidad",
    desc: "Cada producto sirve un propósito claro y definible dentro del juego. No fabricamos objetos decorativos. Una herramienta WARDEN está en tu mesa porque mejora activamente tu experiencia de juego.",
  },
  {
    icon: Compass,
    label: "Compatibilidad",
    desc: "Todos los productos están diseñados para funcionar con mapas, hojas de registro, miniaturas y reglamentos oficiales de BattleTech. Probamos contra las ediciones vigentes de cada sistema compatible.",
  },
  {
    icon: Wrench,
    label: "Robustez",
    desc: "Componentes de latón, aluminio y acrílico maquinados con tolerancias precisas. Las herramientas WARDEN están construidas para soportar cientos de sesiones sin degradación en ajuste o función.",
  },
  {
    icon: Eye,
    label: "Claridad",
    desc: "El diseño de información es una competencia central. Números, marcas e indicadores están diseñados para ser legibles en condiciones variables de iluminación y a distancias de mesa de juego.",
  },
  {
    icon: Box,
    label: "Coherencia",
    desc: "Los productos dentro de una colección WARDEN comparten materiales, lenguaje de diseño e interfaces mecánicas. No hay curva de aprendizaje entre herramientas del mismo ecosistema.",
  },
  {
    icon: ShieldCheck,
    label: "Honestidad",
    desc: "Describimos nuestros productos con precisión, mostramos especificaciones reales y no prometemos más de lo que cumplimos. El latón desarrolla pátina. El acrílico puede rayarse. No son defectos: son características del material.",
  },
];

const timeline = [
  {
    year: "2019",
    title: "Origen en la comunidad",
    desc: "El proyecto nace en comunidades de BattleTech como respuesta a la falta de herramientas físicas especializadas. Primeros prototipos diseñados y probados entre jugadores.",
  },
  {
    year: "2020",
    title: "Etapa artesanal",
    desc: "Fabricación manual en pequeños lotes. Cada pieza cortada, ensamblada y verificada individualmente. La comunidad valida el enfoque: herramientas que resuelven problemas reales de juego.",
  },
  {
    year: "2021",
    title: "Impresión 3D",
    desc: "Incorporación de fabricación aditiva para iterar más rápido. Los prototipos pasan de semanas a días. Se amplía el catálogo y se refinan los diseños con feedback directo de los usuarios.",
  },
  {
    year: "2022",
    title: "Punto Nadir",
    desc: "Primera colección unificada. Los productos dejan de ser piezas aisladas y se organizan en un sistema coherente. Se establece el lenguaje de diseño que define la marca.",
  },
  {
    year: "2023",
    title: "MechWarrior Online",
    desc: "Colaboración con la comunidad de MWO. La exposición a una base de jugadores más amplia impulsa mejoras de diseño y confirma la demanda de herramientas físicas de calidad.",
  },
  {
    year: "2024",
    title: "WARDEN Core",
    desc: "Lanzamiento de la colección insignia. Materiales industriales definitivos: latón, aluminio y acrílico. Tolerancias de fabricación ajustadas. La colección se convierte en el estándar de referencia.",
  },
  {
    year: "2025",
    title: "Consolidación",
    desc: "WARDEN se consolida como plataforma de catálogo con colecciones, bundles, drops y un sistema de selección por presupuesto. El proyecto mira hacia nuevos sistemas y colaboraciones con estudios licenciados.",
  },
];

const dnaPrinciples = [
  {
    number: "01",
    accent: "text-warden-blue",
    title: "Funcionalidad antes que ornamentación",
    desc: "La forma sigue a la función. Cada elemento de diseño tiene una razón de ser operativa. Si no mejora la experiencia de juego, no pertenece al producto.",
  },
  {
    number: "02",
    accent: "text-warden-green",
    title: "Robustez",
    desc: "Materiales seleccionados por sus propiedades mecánicas, no por su apariencia. Latón, aluminio y acrílico. Herramientas que soportan el uso continuo sin comprometer su precisión.",
  },
  {
    number: "03",
    accent: "text-warden-ochre",
    title: "Compatibilidad",
    desc: "Cada producto se verifica contra los sistemas oficiales. Una herramienta WARDEN debe integrarse sin fricción con el resto del equipamiento de juego del usuario.",
  },
  {
    number: "04",
    accent: "text-warden-blue",
    title: "Fabricación viable",
    desc: "Diseñamos para producir. Cada pieza está optimizada para su proceso de fabricación, equilibrando calidad, costo y disponibilidad. Sin piezas imposibles ni tiempos irreales.",
  },
  {
    number: "05",
    accent: "text-warden-green",
    title: "Soluciones multifunción",
    desc: "Una herramienta debe ser útil en tantos contextos como sea posible sin comprometer su función principal. Versatilidad sin complejidad añadida.",
  },
  {
    number: "06",
    accent: "text-warden-ochre",
    title: "Simplicidad operativa",
    desc: "La herramienta más avanzada es la que se usa sin pensar. El diseño debe ser intuitivo, sin instrucciones extensas ni curvas de aprendizaje innecesarias.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── HERO: QUÉ ES WARDEN ── */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-warden-blue">Identidad</Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Sobre WARDEN
            </h1>
            <p className="mt-6 text-base text-muted-foreground leading-relaxed">
              WARDEN desarrolla equipamiento físico de precisión para la
              experiencia de juego en BattleTech Classic, Alpha Strike y
              AeroTech. Cada producto nace de una necesidad real sobre la mesa:
              reducir fricción mecánica, acelerar fases de juego y clarificar el
              estado de la partida.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              No fabricamos decoración. Fabricamos herramientas que se ganan su
              lugar en la mesa. Si un producto no resuelve un problema concreto
              — ya sea de velocidad, claridad o carga cognitiva — no se fabrica.
            </p>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── MISIÓN Y VISIÓN ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Propósito</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Misión y visión
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-warden-surface p-6">
              <Eyebrow className="text-warden-blue mb-3">Misión</Eyebrow>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Eliminar la fricción mecánica y cognitiva del wargame de mesa
                mediante herramientas físicas diseñadas con criterio técnico,
                fabricadas con materiales industriales y validadas en cientos de
                sesiones de juego real.
              </p>
            </div>
            <div className="border border-border bg-warden-surface p-6">
              <Eyebrow className="text-warden-green mb-3">Visión</Eyebrow>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Ser el estándar de referencia en accesorios funcionales para
                wargaming de ciencia ficción, manteniendo el compromiso con la
                calidad de fabricación, la compatibilidad con los sistemas
                oficiales y una ética de diseño donde la función determina la
                forma.
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
            <Eyebrow>Principios</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Valores
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Seis principios que gobiernan cada decisión de diseño, material y
              producción.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.label}
                className="bg-warden-carbon p-6"
              >
                <v.icon className="size-5 text-warden-blue mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {v.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {v.desc}
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
            <Eyebrow>Sistemas</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Sistemas de referencia
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              WARDEN diseña y prueba sus productos para los tres sistemas
              principales del ecosistema BattleTech.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <DataPanel label="BattleTech Classic" className="border-warden-ochre/20">
              <DataRow label="Escala" value="1 hexágono = 30 m" />
              <DataRow label="Unidad tipo" value="Lanza / Compañía" />
              <DataRow label="Cobertura" value="4 productos" />
            </DataPanel>
            <DataPanel label="Alpha Strike" className="border-warden-blue/20">
              <DataRow label="Escala" value="Abstracta" />
              <DataRow label="Unidad tipo" value="Compañía / Batallón" />
              <DataRow label="Cobertura" value="1 producto" />
            </DataPanel>
            <DataPanel label="AeroTech" className="border-warden-green/20">
              <DataRow label="Escala" value="Atmosférica / Espacial" />
              <DataRow label="Unidad tipo" value="Caza / Escuadrón" />
              <DataRow label="Cobertura" value="2 productos" />
            </DataPanel>
          </div>
        </Container>
      </Section>

      <SectionDivider />

      {/* ── FILOSOFÍA ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Filosofía</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Diseñar para jugar. Construir para durar.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Tres principios que definen cómo pensamos, diseñamos y fabricamos.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-3">
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-blue mb-4 block">01</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Diseñar para jugar
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cada producto WARDEN comienza con un problema de juego. Si no
                acelera una fase, clarifica una regla o reduce la carga
                cognitiva, no se fabrica. Sin decoración. Sin relleno. Solo
                función.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-green mb-4 block">02</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Construir para durar
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Latón, aluminio y acrílico maquinados con tolerancias precisas.
                Cada material se selecciona por sus propiedades mecánicas y se
                valida en cientos de sesiones. Una herramienta WARDEN debe
                sobrevivir a la campaña.
              </p>
            </div>
            <div className="bg-warden-carbon p-8">
              <span className="text-data text-warden-ochre mb-4 block">03</span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground mb-3">
                Evolucionar sin perder la identidad
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

      {/* ── HISTORIA ── */}
      <Section>
        <Container>
          <div className="mb-12">
            <Eyebrow>Historia</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Trayectoria
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              De la comunidad al catálogo. Los hitos que han definido el
              proyecto.
            </p>
          </div>
          <div className="relative space-y-10 pl-6 sm:pl-8">
            <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border sm:left-[9px]" />
            {timeline.map((m, i) => (
              <div key={i} className="relative pl-6 sm:pl-8">
                <span className="absolute left-[-5px] top-1.5 size-2.5 rounded-full border border-warden-blue bg-warden-carbon sm:left-[-7px]" />
                <span className="text-data text-warden-blue">{m.year}</span>
                <h3 className="text-base font-semibold text-foreground mt-1">
                  {m.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mt-1 max-w-2xl">
                  {m.desc}
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
            <Eyebrow>ADN de diseño</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Cómo diseñamos
            </h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Seis principios que gobiernan cada decisión de ingeniería y
              fabricación.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
            {dnaPrinciples.map((p) => (
              <div key={p.number} className="bg-warden-carbon p-6">
                <span
                  className={`text-data ${p.accent} mb-3 block`}
                >
                  {p.number}
                </span>
                <h3 className="text-base font-semibold text-foreground mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {p.desc}
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
              <Eyebrow>Explorar</Eyebrow>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                Ver el catálogo
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Todos los productos WARDEN están organizados por colección y
                sistema. Cada ficha incluye especificaciones técnicas,
                compatibilidad y guías de uso.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <WardenButton href="/collections">
                  Ir al catálogo
                  <ChevronRight className="size-4" />
                </WardenButton>
                <WardenButton href="/community-support" variant="outline">
                  Community Support
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
