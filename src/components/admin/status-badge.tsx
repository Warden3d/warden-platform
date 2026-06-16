import { cn } from "@/lib/utils";

export const statusLabels: Record<string, string> = {
  active: "Activo",
  hidden: "Oculto",
  retired: "Retirado",
  live: "En vivo",
  upcoming: "Próximo",
  ended: "Finalizado",
  new: "Nuevo",
  reviewed: "Revisado",
  replied: "Respondido",
  archived: "Archivado",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variantMap: Record<string, string> = {
    active: "border-warden-green/40 text-warden-green bg-warden-green/10",
    live: "border-warden-green/40 text-warden-green bg-warden-green/10",
    hidden: "border-warden-ochre/40 text-warden-ochre bg-warden-ochre/10",
    retired: "border-muted-foreground/30 text-muted-foreground bg-muted",
    upcoming: "border-warden-blue/40 text-warden-blue bg-warden-blue/10",
    ended: "border-muted-foreground/30 text-muted-foreground bg-muted",
    new: "border-warden-blue/40 text-warden-blue bg-warden-blue/10",
    reviewed: "border-warden-ochre/40 text-warden-ochre bg-warden-ochre/10",
    replied: "border-warden-green/40 text-warden-green bg-warden-green/10",
    archived: "border-muted-foreground/30 text-muted-foreground bg-muted",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
        variantMap[status] ?? "border-border text-muted-foreground",
        className
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
