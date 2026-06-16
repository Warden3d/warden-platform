import { cn } from "@/lib/utils";

type BadgeVariant = "blue" | "green" | "ochre" | "neutral";

const variantClasses: Record<BadgeVariant, string> = {
  blue: "border-warden-blue/30 text-warden-blue",
  green: "border-warden-green/30 text-warden-green",
  ochre: "border-warden-ochre/30 text-warden-ochre",
  neutral: "border-border text-muted-foreground",
};

export function TechnicalBadge({
  children,
  variant = "neutral",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-eyebrow",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function CompatibilityBadge({
  system,
  className,
}: {
  system: "battletech-classic" | "alpha-strike" | "aerotech";
  className?: string;
}) {
  const labels = {
    "battletech-classic": "BattleTech Classic",
    "alpha-strike": "Alpha Strike",
    aerotech: "AeroTech",
  };

  const variants: Record<string, BadgeVariant> = {
    "battletech-classic": "ochre",
    "alpha-strike": "blue",
    aerotech: "green",
  };

  return (
    <TechnicalBadge variant={variants[system]} className={className}>
      {labels[system]}
    </TechnicalBadge>
  );
}
