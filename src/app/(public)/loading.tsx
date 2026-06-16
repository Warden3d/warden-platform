import { Container, Section } from "@/components/shared/container";

export default function PublicLoading() {
  return (
    <Section>
      <Container>
        <div className="flex flex-col items-center justify-center py-24" role="status" aria-live="polite">
          <div className="size-8 border-2 border-warden-blue/30 border-t-warden-blue rounded-full animate-spin" />
          <p className="mt-4 text-sm text-muted-foreground">Cargando...</p>
        </div>
      </Container>
    </Section>
  );
}
