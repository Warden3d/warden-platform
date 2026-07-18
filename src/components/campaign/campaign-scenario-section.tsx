import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface CampaignScenarioSectionProps {
  eyebrow?: string;
  title: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Image position: "left" | "right" (default "right") */
  imagePosition?: "left" | "right";
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignScenarioSection — Context block with narrative text and a large side image.
 *
 * Image alternates left/right per campaign to avoid visual monotony.
 * Content-driven: if `title` is empty, the block is not rendered.
 */
export function CampaignScenarioSection({
  eyebrow,
  title,
  body,
  imageUrl,
  imageAlt = "",
  imagePosition = "right",
  className,
  placeholder,
}: CampaignScenarioSectionProps) {
  if (!title) return null;

  return (
    <section className={cn("py-14 md:py-20 bg-warden-surface/30", className)}>
      <Container>
        <div className="grid gap-8 md:gap-12 items-center md:grid-cols-2">
          {/* Text */}
          <div className={cn(imagePosition === "left" && "md:order-2")}>
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

            <p className="mt-4 text-base text-muted-foreground leading-relaxed">
              {body}
            </p>
          </div>

          {/* Image */}
          <div className={cn(imagePosition === "left" && "md:order-1")}>
            {imageUrl ? (
              <div className="relative w-full aspect-video overflow-hidden border border-border">
                <Image
                  src={imageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-video overflow-hidden border border-border bg-warden-carbon flex items-center justify-center">
                <p className="text-[11px] text-muted-foreground/30 uppercase tracking-widest">
                  {placeholder ? "Imagen provisional" : "Visual"}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
