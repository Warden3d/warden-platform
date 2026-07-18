import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface TimelineEntry {
  date: string;
  title: string;
  description: string;
}

interface CampaignDevelopmentSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  entries: TimelineEntry[];
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignDevelopmentSection — Process / timeline block.
 *
 * Shows the creation process in a simple chronological structure,
 * prepared to evolve into a full Timeline component in future campaigns.
 * Content-driven: if `entries` is empty, the block is not rendered.
 */
export function CampaignDevelopmentSection({
  eyebrow,
  title,
  description,
  entries,
  className,
  placeholder,
}: CampaignDevelopmentSectionProps) {
  if (entries.length === 0) return null;

  return (
    <section className={cn("py-14 md:py-20", className)}>
      <Container>
        <div className="max-w-3xl mb-10">
          {eyebrow && (
            <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
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

          {description && (
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}
        </div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border hidden md:block" />

          <div className="space-y-8">
            {entries.map((entry, idx) => (
              <div
                key={idx}
                className="relative grid gap-4 md:grid-cols-[auto_1fr] md:gap-8 items-start"
              >
                {/* Date dot */}
                <div className="hidden md:flex flex-col items-center pt-0.5">
                  <div className="size-6 rounded-full border-2 border-warden-blue bg-warden-carbon flex items-center justify-center">
                    <div className="size-2 rounded-full bg-warden-blue" />
                  </div>
                </div>

                {/* Content */}
                <div className="border border-border bg-warden-surface p-5">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-warden-blue mb-1">
                    {entry.date}
                  </p>
                  <h3 className="text-sm font-semibold text-foreground leading-snug">
                    {entry.title}
                  </h3>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {entry.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {placeholder && (
          <p className="mt-8 text-[10px] text-muted-foreground/30 italic text-center">
            Datos provisionales — serán sustituidos por la cronología real del desarrollo.
          </p>
        )}
      </Container>
    </section>
  );
}
