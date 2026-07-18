import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";

interface CampaignCtaProps {
  title: string;
  description?: string;
  ctaLabel: string;
  ctaHref: string;
  className?: string;
  muted?: boolean;
}

/**
 * CampaignCta — Call-to-action block linking to the commercial PDP.
 *
 * This is the primary conversion point on the landing page.
 * Content drives visibility — if `ctaHref` is empty, the block is not rendered.
 */
export function CampaignCta({
  title,
  description,
  ctaLabel,
  ctaHref,
  className,
  muted,
}: CampaignCtaProps) {
  if (!ctaHref) return null;

  return (
    <section
      className={cn(
        "py-16 md:py-20 text-center",
        muted ? "bg-warden-surface/20" : "bg-warden-carbon border-t border-border",
        className
      )}
    >
      <Container>
        <div className="max-w-2xl mx-auto">
          <h2
            className={cn(
              "text-2xl font-semibold tracking-tight sm:text-3xl leading-tight",
              muted ? "text-muted-foreground/80" : "text-foreground"
            )}
          >
            {title}
          </h2>

          {description && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          <div className="mt-8">
            <WardenButton href={ctaHref} size="lg">
              {ctaLabel}
              <ChevronRight className="size-4" />
            </WardenButton>
          </div>
        </div>
      </Container>
    </section>
  );
}
