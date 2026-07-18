import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface CampaignStoryBlockProps {
  eyebrow?: string;
  title: string;
  body: string;
  /** Optional secondary body paragraph */
  body2?: string;
  /** Side visual (image or decoration) */
  visual?: React.ReactNode;
  /** Visual position — default "right" */
  visualPosition?: "left" | "right";
  className?: string;
  muted?: boolean;
}

/**
 * CampaignStoryBlock — Narrative block with optional side visual.
 *
 * Reusable across all campaign landings. Content drives visibility —
 * if `title` is empty, the block is not rendered.
 */
export function CampaignStoryBlock({
  eyebrow,
  title,
  body,
  body2,
  visual,
  visualPosition = "right",
  className,
  muted,
}: CampaignStoryBlockProps) {
  if (!title) return null;

  return (
    <section className={cn("py-16 md:py-24", muted && "bg-warden-surface/30", className)}>
      <Container>
        <div
          className={cn(
            "grid gap-8 md:gap-12 items-center",
            visual
              ? "md:grid-cols-2"
              : "max-w-3xl mx-auto text-center"
          )}
        >
          {/* Text */}
          <div
            className={cn(
              visual && visualPosition === "left" && "md:order-2",
              visual && visualPosition === "right" && "md:order-1"
            )}
          >
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

            <p
              className={cn(
                "mt-4 text-base leading-relaxed",
                muted ? "text-muted-foreground/60" : "text-muted-foreground"
              )}
            >
              {body}
            </p>

            {body2 && (
              <p
                className={cn(
                  "mt-4 text-base leading-relaxed",
                  muted ? "text-muted-foreground/60" : "text-muted-foreground"
                )}
              >
                {body2}
              </p>
            )}
          </div>

          {/* Visual */}
          {visual && (
            <div
              className={cn(
                visualPosition === "left" && "md:order-1",
                visualPosition === "right" && "md:order-2"
              )}
            >
              {visual}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
