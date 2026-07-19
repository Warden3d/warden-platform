import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { WardenButton } from "@/components/ui/warden-button";

export interface HighlightItem {
  label: string;
  value: string;
  icon?: ReactNode;
}

export interface SecondaryAction {
  label: string;
  href?: string;
  icon?: ReactNode;
}

interface CampaignCtaProps {
  /** Campaign / drop name */
  title: string;
  /** Editorial closing text — summarises the campaign value proposition */
  closing: string;
  /** Key highlights of the drop (scale, compatibility, pieces, etc.) */
  highlights: HighlightItem[];
  /** Primary CTA label */
  ctaLabel: string;
  /** Primary CTA href (links to PDP) */
  ctaHref: string;
  /** Secondary actions (future: downloads, docs, share) */
  secondaryActions?: SecondaryAction[];
  /** Drop status for contextual messaging */
  status?: "upcoming" | "live" | "ended";
  className?: string;
  muted?: boolean;
}

/**
 * CampaignCta — Conversion section at the end of the Campaign Landing.
 *
 * Closes the narrative with:
 * - Editorial closing text
 * - Visual highlights of the drop
 * - Primary CTA → PDP
 * - Secondary actions (prepared for future)
 *
 * Content-driven: if `ctaHref` is empty, the block is not rendered.
 */
export function CampaignCta({
  title,
  closing,
  highlights,
  ctaLabel,
  ctaHref,
  secondaryActions,
  status,
  className,
  muted,
}: CampaignCtaProps) {
  if (!ctaHref) return null;

  const statusLabel =
    status === "upcoming"
      ? "Próximo lanzamiento"
      : status === "ended"
        ? "Campaña finalizada"
        : "Disponible ahora";

  const statusColors =
    status === "live"
      ? "text-warden-blue"
      : status === "ended"
        ? "text-muted-foreground/50"
        : "text-warden-ochre";

  return (
    <section
      className={cn(
        "py-16 md:py-24",
        muted ? "bg-warden-surface/20" : "bg-warden-carbon border-t border-border",
        className
      )}
    >
      <Container>
        <div className="grid gap-10 md:gap-14 md:grid-cols-2 items-start">
          {/* ── Editorial side ── */}
          <div className="max-w-lg">
            {status && (
              <p className={cn("text-[11px] font-medium uppercase tracking-widest mb-4", statusColors)}>
                {statusLabel}
              </p>
            )}

            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl leading-tight text-foreground">
              {title}
            </h2>

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {closing}
            </p>

            {/* Primary CTA */}
            <div className="mt-8">
              <WardenButton href={ctaHref} size="lg">
                {ctaLabel}
                <ChevronRight className="size-4" />
              </WardenButton>
            </div>

            {/* Secondary actions */}
            {secondaryActions && secondaryActions.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {secondaryActions.map((action, idx) => (
                  <WardenButton
                    key={idx}
                    href={action.href ?? "#"}
                    variant="outline"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    {action.icon && <span className="size-3.5">{action.icon}</span>}
                    {action.label}
                  </WardenButton>
                ))}
              </div>
            )}
          </div>

          {/* ── Highlights side ── */}
          {highlights.length > 0 && (
            <div className="border border-border bg-warden-surface divide-y divide-border">
              {highlights.map((h, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-4 px-5 py-3.5"
                >
                  <span className="text-xs text-muted-foreground tracking-wide flex items-center gap-2">
                    {h.icon && <span className="size-3.5 text-warden-ochre/70 shrink-0">{h.icon}</span>}
                    {h.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground text-right shrink-0">
                    {h.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
