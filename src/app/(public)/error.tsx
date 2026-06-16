"use client";

import { Container, Section } from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function PublicError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Section>
      <Container>
        <div className="max-w-lg mx-auto text-center py-16">
          <AlertTriangle className="size-12 text-warden-ochre mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-foreground">
            Algo salió mal
          </h1>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            No hemos podido cargar esta página. Puedes intentarlo de nuevo o
            volver al inicio.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <WardenButton onClick={reset}>
              <RefreshCw className="size-4" />
              Intentar de nuevo
            </WardenButton>
            <WardenButton href="/" variant="outline">
              Volver al inicio
            </WardenButton>
          </div>
        </div>
      </Container>
    </Section>
  );
}
