import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface GalleryPreviewItem {
  url: string;
  alt: string;
}

interface CampaignGalleryPreviewProps {
  eyebrow?: string;
  title?: string;
  description?: string;
  images: GalleryPreviewItem[];
  className?: string;
  placeholder?: boolean;
}

/**
 * CampaignGalleryPreview — Editorial gallery preview block.
 *
 * A lighter visual block that previews key campaign images.
 * Designed to evolve into a full premium gallery viewer in future iterations.
 * Content-driven: if `images` is empty, the block is not rendered.
 */
export function CampaignGalleryPreview({
  eyebrow,
  title,
  description,
  images,
  className,
  placeholder,
}: CampaignGalleryPreviewProps) {
  if (images.length === 0) return null;

  return (
    <section className={cn("py-14 md:py-20 bg-warden-surface/30", className)}>
      <Container>
        {(eyebrow || title) && (
          <div className="max-w-3xl mb-8">
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
            {title && (
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl leading-tight text-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2">
          {/* Hero image — first one larger */}
          {images[0] && (
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] sm:row-span-2 overflow-hidden border border-border bg-warden-carbon">
              <Image
                src={images[0].url}
                alt={images[0].alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
              />
            </div>
          )}

          {/* Remaining images in a compact grid */}
          <div className="grid gap-3 grid-cols-2">
            {images.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="relative w-full aspect-square overflow-hidden border border-border bg-warden-carbon"
              >
                <Image
                  src={img.url}
                  alt={img.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
