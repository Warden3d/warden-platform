import { Container, Section } from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="max-w-lg mx-auto text-center py-16">
          <span className="text-data text-warden-blue block mb-4">404</span>
          <h1 className="text-2xl font-semibold text-foreground">
            Página no encontrada
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            El recurso que buscas no existe o ha sido movido.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <WardenButton href="/">Volver al inicio</WardenButton>
            <WardenButton href="/catalog" variant="outline">
              Explorar catálogo
            </WardenButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
