import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface CampaignOriginsProps {
  eyebrow?: string;
  title: string;
  body: string;
  body2?: string;
  /** Optional key visual representing the origin */
  imageUrl?: string;
  imageAlt?: string;
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignOrigins — First narrative block explaining the campaign's origin.
 *
 * Covers: birth of a project, revival of a classic scenario, inspiration.
 * Content-driven: if `title` is empty, the block is not rendered.
 */
export async function CampaignOrigins({
  eyebrow,
  title,
  body,
  body2,
  imageUrl,
  imageAlt,
  className,
  placeholder,
}: CampaignOriginsProps) {
  if (!title) return null;

  const t = await getTranslations("drops");

  return (
    <section className={cn("py-14 md:py-20", className)}>
      <Container>
        <div className="grid gap-10 md:gap-14 md:grid-cols-2 items-center">
          {/* Text */}
          <div>
            {eyebrow && (
              <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-4">
                {eyebrow}
                {placeholder && (
                  <span className="ml-2 text-[9px] text-muted-foreground/40 normal-case tracking-normal font-normal">
                    {t("placeholder")}
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

            {body2 && (
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {body2}
              </p>
            )}
          </div>

          {/* Visual */}
          <div>
            {imageUrl ? (
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-border">
                <Image
                  src={imageUrl}
                  alt={imageAlt || title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] overflow-hidden border border-border bg-warden-carbon flex items-center justify-center">
                <p className="text-[11px] text-muted-foreground/30 uppercase tracking-widest">
                  {placeholder ? t("origins.imagePlaceholder") : t("origins.visual")}
                </p>
              </div>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
