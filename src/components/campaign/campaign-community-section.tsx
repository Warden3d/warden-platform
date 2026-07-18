import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface Testimonial {
  quote: string;
  author: string;
  role?: string;
  avatarUrl?: string;
}

interface CampaignCommunitySectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  testimonials: Testimonial[];
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignCommunitySection — Community showcase block.
 *
 * Displays photos, text, quotes, and testimonials from the community.
 * Content-driven: if `testimonials` is empty, the block is not rendered.
 */
export function CampaignCommunitySection({
  eyebrow,
  title,
  description,
  testimonials,
  className,
  placeholder,
}: CampaignCommunitySectionProps) {
  if (testimonials.length === 0) return null;

  return (
    <section className={cn("py-14 md:py-20 bg-warden-surface/30", className)}>
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

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="border border-border bg-warden-surface p-6 flex flex-col"
            >
              <blockquote className="text-sm text-muted-foreground leading-relaxed flex-1">
                &ldquo;{item.quote}&rdquo;
              </blockquote>

              <div className="mt-4 pt-3 border-t border-border flex items-center gap-3">
                {item.avatarUrl && (
                  <div className="relative size-8 shrink-0 rounded-full overflow-hidden border border-border">
                    <Image
                      src={item.avatarUrl}
                      alt={item.author}
                      fill
                      className="object-cover"
                      sizes="32px"
                    />
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-foreground">
                    {item.author}
                  </p>
                  {item.role && (
                    <p className="text-[10px] text-muted-foreground">
                      {item.role}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
