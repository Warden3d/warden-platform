import { cn } from "@/lib/utils";

export function SpecTable({
  specs,
  className,
}: {
  specs: Record<string, string>;
  className?: string;
}) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;

  return (
    <dl
      className={cn(
        "grid gap-x-6 gap-y-3",
        entries.length > 4 ? "sm:grid-cols-2" : "sm:grid-cols-1",
        className
      )}
    >
      {entries.map(([label, value]) => (
        <div
          key={label}
          className="flex items-baseline justify-between gap-4 border-b border-border pb-2.5"
        >
          <dt className="text-spec-label text-muted-foreground shrink-0">{label}</dt>
          <dd className="text-data text-foreground/90 text-right">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
