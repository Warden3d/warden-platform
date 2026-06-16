import type { Metadata } from "next";

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

const applicantTypes = [
  {
    title: "Asociaciones",
    description:
      "Entidades constituidas que organizan actividades regulares de juego y eventos para sus miembros.",
  },
  {
    title: "Clubes de juego",
    description:
      "Grupos estables que se reúnen periódicamente para jugar, con o sin formalización legal.",
  },
  {
    title: "Organizadores de eventos",
    description:
      "Personas o equipos que montan torneos, jornadas o convenciones de wargames.",
  },
  {
    title: "Comunidades de juego",
    description:
      "Comunidades digitales o presenciales que agrupan jugadores en torno a sistemas de juego compatibles.",
  },
  {
    title: "Iniciativas comunitarias",
    description:
      "Proyectos orientados a la divulgación, la accesibilidad o la ampliación de la base de jugadores.",
  },
];

const supportForms = [
  {
    title: "Material promocional",
    description:
      "Folletos, fichas de producto y material gráfico para distribuir en tus eventos o puntos de encuentro.",
  },
  {
    title: "Premios para torneos",
    description:
      "Productos WARDEN para utilizar como premios en torneos, ligas o competiciones organizadas.",
  },
  {
    title: "Escenografía",
    description:
      "Cesión temporal de piezas de escenografía para eventos presenciales o exhibiciones.",
  },
  {
    title: "Elementos de juego",
    description:
      "Productos funcionales para facilitar la organización de partidas demostrativas o torneos.",
  },
  {
    title: "Asesoramiento",
    description:
      "Orientación sobre selección de productos, preparación de mesas de juego o configuración de eventos.",
  },
  {
    title: "Difusión puntual",
    description:
      "Mención o promoción de vuestro evento en los canales de WARDEN, sin compromiso de cobertura continuada.",
  },
];

const clarifyItems = [
  {
    icon: Handshake,
    text: "No existe contraprestación obligatoria. El apoyo se concede sin exigir exclusividad ni compromisos publicitarios.",
  },
  {
    icon: ShieldCheck,
    text: "La concesión es discrecional. Evaluamos cada solicitud según su alineación con los valores de WARDEN y el impacto potencial en la comunidad.",
  },
  {
    icon: Users,
    text: "Depende de recursos disponibles. El alcance del apoyo se ajusta al inventario, capacidad operativa y calendario de producción en cada momento.",
  },
];

export default function CommunitySupportPage() {
  return (
    <>
      {/* Hero */}
      <Section>
        <Container>
          <div className="max-w-3xl">
            <Eyebrow className="text-warden-ochre">
              Colaboración
            </Eyebrow>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Community Support
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl">
              Apoyo a asociaciones, clubes, organizadores y comunidades que
              comparten los valores de WARDEN: juego en mesa, precisión
              artesanal y comunidad sostenible.
            </p>
          </div>
        </Container>
      </Section>

      {/* What is CS */}
      <Section className="!pt-0">
        <Container>
          <div className="max-w-3xl">
            <Eyebrow>Qué es</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              Un programa de colaboración, no un canal publicitario
            </h2>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Community Support no es un programa de marketing ni una
              estrategia de captación. Es una iniciativa para fortalecer el
              ecosistema del wargame apoyando a quienes ya construyen
              comunidad alrededor de la mesa. Colaboramos con entidades e
              iniciativas que promueven el juego organizado, la
              accesibilidad y la difusión de los wargames de mesa con un
              enfoque respetuoso con los jugadores y sus espacios.
            </p>
          </div>
        </Container>
      </Section>

      {/* Who can apply */}
      <Section className="!pt-0">
        <Container>
          <SectionDivider className="mb-10" />
          <Eyebrow>Quién puede solicitar apoyo</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            Entidades e iniciativas
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {applicantTypes.map((item) => (
              <div
                key={item.title}
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
          <Eyebrow>Formas de apoyo</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            Cómo podemos colaborar
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {supportForms.map((item) => (
              <div
                key={item.title}
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
          <Eyebrow>Aclaraciones</Eyebrow>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-8">
            Transparencia sobre el programa
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
            <Eyebrow>Solicitud</Eyebrow>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-foreground mb-2">
              Solicitar apoyo
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-8">
              Rellena el formulario y lo revisaremos. Te respondemos en un
              plazo máximo de cinco días hábiles.
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
              Contacto general
              <ChevronRight className="size-4" />
            </WardenButton>
            <WardenButton href="/about" variant="outline">
              Sobre WARDEN
            </WardenButton>
          </div>
        </Container>
      </Section>
    </>
  );
}
