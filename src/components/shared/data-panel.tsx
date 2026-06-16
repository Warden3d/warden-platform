import { cn } from "@/lib/utils";

export function DataPanel({
  children,
  label,
  className,
}: {
  children: React.ReactNode;
  label?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border border-border bg-warden-carbon/60 p-5",
        className
      )}
    >
      {label && (
        <div className="text-eyebrow text-warden-blue mb-3">{label}</div>
      )}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function DataRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-spec-label text-muted-foreground shrink-0">{label}</dt>
      <dd className="text-data text-foreground/90 text-right">{value}</dd>
    </div>
  );
}
