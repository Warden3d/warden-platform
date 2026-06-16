"use client";

import { WardenButton } from "@/components/ui/warden-button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function AdminError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <AlertTriangle className="size-10 text-warden-ochre mb-4" />
      <h1 className="text-xl font-semibold text-foreground">
        Error al cargar el panel
      </h1>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center">
        No se ha podido cargar esta sección. Intenta recargar o vuelve al
        dashboard.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <WardenButton onClick={reset}>
          <RefreshCw className="size-4" />
          Reintentar
        </WardenButton>
        <WardenButton href="/admin" variant="outline">
          Dashboard
        </WardenButton>
      </div>
    </div>
  );
}
