import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface DesignItem {
  imageUrl: string;
  imageAlt: string;
  caption?: string;
}

interface CampaignDesignSectionProps {
  eyebrow?: string;
  title: string;
  description?: string;
  items: DesignItem[];
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignDesignSection — Design showcase block.
 *
 * Displays product renders, photos, and design details in a grid
 * with optional captions. Content-driven: if `items` is empty, the
 * block is not rendered.
 */
export function CampaignDesignSection({
  eyebrow,
  title,
  description,
  items,
  className,
  placeholder,
}: CampaignDesignSectionProps) {
  if (items.length === 0) return null;

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="relative w-full aspect-square overflow-hidden border border-border bg-warden-carbon">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              {item.caption && (
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {item.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
