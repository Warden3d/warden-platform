import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface CampaignStorySectionProps {
  eyebrow?: string;
  title: string;
  body: string;
  body2?: string;
  className?: string;
  /** Set to true when using placeholder content */
  placeholder?: boolean;
}

/**
 * CampaignStorySection — Narrative block introducing the campaign.
 *
 * Props: eyebrow, title, body, body2
 * Content-driven: if `title` is empty, the block is not rendered.
 */
export function CampaignStorySection({
  eyebrow,
  title,
  body,
  body2,
  className,
  placeholder,
}: CampaignStorySectionProps) {
  if (!title) return null;

  return (
    <section className={cn("py-14 md:py-20", className)}>
      <Container>
        <div className="max-w-3xl mx-auto text-center">
          {eyebrow && (
            <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-4">
              {eyebrow}
              {placeholder && (
                <span className="ml-2 text-[9px] text-muted-foreground/40 normal-case tracking-normal font-normal">
                  [placeholder]
                </span>
              )}
            </p>
          )}

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl leading-tight text-foreground">
            {title}
          </h2>

          <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            {body}
          </p>

          {body2 && (
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {body2}
            </p>
          )}

          {placeholder && (
            <p className="mt-4 text-[10px] text-muted-foreground/30 italic">
              Contenido provisional — será sustituido por el texto definitivo de la campaña.
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}
