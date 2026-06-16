import type { Metadata } from "next";

import { Container, Section, Eyebrow } from "@/components/shared/container";
import { ContactForm } from "@/components/forms/contact-form";
import { DataPanel, DataRow } from "@/components/shared/data-panel";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight, Mail, MapPin, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with WARDEN for general inquiries, community support, dealer program, licensing, or other matters.",
};

export default function ContactPage() {
  return (
    <Section>
      <Container>
        <div className="max-w-3xl mb-14">
          <Eyebrow>Contacto</Eyebrow>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Contacto
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            Consultas generales, Community Support, programa de distribuidores,
            licencias y colaboraciones, o cualquier otro asunto. Respondemos en
            un plazo máximo de dos días hábiles.
          </p>
        </div>

        <div className="grid gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="border border-border bg-warden-surface p-6">
              <h2 className="text-base font-semibold text-foreground mb-6">
                Enviar mensaje
              </h2>
              <ContactForm />
            </div>
          </div>

          <div className="space-y-4">
            <DataPanel label={<><Mail className="size-3.5 inline mr-1.5" />Email</>}>
              <DataRow label="Contacto" value="contact@warden-platform.com" />
              <DataRow label="Community Support" value="community@warden-platform.com" />
              <DataRow label="Dealer Program" value="dealers@warden-platform.com" />
            </DataPanel>
            <DataPanel label={<><MapPin className="size-3.5 inline mr-1.5" />Ubicación</>}>
              <DataRow label="Operaciones" value="Remoto — envíos internacionales" />
            </DataPanel>
            <DataPanel label={<><Clock className="size-3.5 inline mr-1.5" />Tiempo de respuesta</>}>
              <DataRow label="Estándar" value="2 días hábiles" />
            </DataPanel>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <WardenButton href="/community-support">
            Community Support
            <ChevronRight className="size-4" />
          </WardenButton>
          <WardenButton href="/about" variant="outline">
            Sobre WARDEN
          </WardenButton>
        </div>
      </Container>
    </Section>
  );
}
