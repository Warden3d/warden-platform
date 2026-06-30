import { cn } from "@/lib/utils";

// ── Types ──

interface FinishOption {
  name: string;
  color: string;
}

interface FinishSelectorProps {
  finishes?: FinishOption[];
  className?: string;
}

// ── Default finishes from Master Design Reference ──

const DEFAULT_FINISHES: FinishOption[] = [
  { name: "Gris", color: "#9CA3AF" },
  { name: "Industrial", color: "#6B7280" },
  { name: "Arena", color: "#D4A574" },
  { name: "Negro", color: "#1F2937" },
];

// ── Component ──

export function FinishSelector({
  finishes = DEFAULT_FINISHES,
  className,
}: FinishSelectorProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-spec-label text-muted-foreground uppercase tracking-wider">
        Acabado
      </span>
      <div className="flex items-center gap-3">
        {finishes.map((f) => (
          <button
            key={f.name}
            type="button"
            disabled
            aria-label={`Acabado ${f.name}`}
            className="flex items-center gap-1.5 group cursor-not-allowed opacity-70"
          >
            <span
              className="size-5 rounded-full border border-border/60 shrink-0"
              style={{ backgroundColor: f.color }}
            />
            <span className="text-xs text-muted-foreground">{f.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
