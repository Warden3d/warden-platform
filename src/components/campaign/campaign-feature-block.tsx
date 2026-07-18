import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface FeatureItem {
  icon: ReactNode;
  title: string;
  description: string;
}

interface CampaignFeatureBlockProps {
  eyebrow?: string;
  title: string;
  features: FeatureItem[];
  columns?: 2 | 3 | 4;
  className?: string;
  muted?: boolean;
}

/**
 * CampaignFeatureBlock — Grid of feature highlights.
 *
 * Each feature has an icon, title, and short description.
 * Content drives visibility — if `features` is empty, the block is not rendered.
 */
export function CampaignFeatureBlock({
  eyebrow,
  title,
  features,
  columns = 3,
  className,
  muted,
}: CampaignFeatureBlockProps) {
  if (features.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", muted && "bg-warden-surface/30", className)}>
      <Container>
        <div className="max-w-3xl mb-12">
          {eyebrow && (
            <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
              {eyebrow}
            </p>
          )}
          <h2
            className={cn(
              "text-2xl font-semibold tracking-tight sm:text-3xl leading-tight",
              muted ? "text-muted-foreground/80" : "text-foreground"
            )}
          >
            {title}
          </h2>
        </div>

        <div
          className={cn(
            "grid gap-6 md:gap-8",
            columns === 2 && "sm:grid-cols-2",
            columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
            columns === 4 && "sm:grid-cols-2 lg:grid-cols-4"
          )}
        >
          {features.map((feature, idx) => (
            <div
              key={idx}
              className={cn(
                "border p-6 transition-colors",
                muted
                  ? "border-border/60 bg-warden-surface/20"
                  : "border-border bg-warden-surface hover:border-warden-blue/30"
              )}
            >
              <div className="size-10 flex items-center justify-center border border-border bg-warden-carbon mb-4 text-warden-blue">
                {feature.icon}
              </div>
              <h3
                className={cn(
                  "text-sm font-semibold leading-snug",
                  muted ? "text-muted-foreground/70" : "text-foreground"
                )}
              >
                {feature.title}
              </h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
