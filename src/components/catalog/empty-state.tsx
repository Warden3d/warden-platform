import { Package } from "lucide-react";

export function EmptyState({
  title = "No se encontraron productos",
  description = "Prueba a ajustar los filtros o los términos de búsqueda para encontrar lo que necesitas.",
  icon: Icon = Package,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border border-border bg-warden-surface/50">
      <Icon className="size-12 text-muted-foreground/40 mb-5" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center leading-relaxed">
        {description}
      </p>
    </div>
  );
}
