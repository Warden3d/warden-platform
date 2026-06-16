import { Check } from "lucide-react";

export function GameFeaturesList({ features }: { features: string[] }) {
  if (features.length === 0) return null;

  return (
    <div className="border border-border bg-warden-surface">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-spec-label text-muted-foreground">
          Game Features
        </h3>
      </div>
      <ul className="px-5 py-4 space-y-2.5">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-2.5 text-sm text-foreground/80 leading-relaxed">
            <Check className="size-3.5 text-warden-blue shrink-0 mt-0.5" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
