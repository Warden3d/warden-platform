import Image from "next/image";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface GalleryImage {
  url: string;
  alt: string;
}

interface CampaignGalleryProps {
  eyebrow?: string;
  title?: string;
  images: GalleryImage[];
  columns?: 2 | 3 | 4;
  className?: string;
  muted?: boolean;
}

/**
 * CampaignGallery — Image grid gallery block.
 *
 * Content drives visibility — if `images` is empty, the block is not rendered.
 */
export function CampaignGallery({
  eyebrow,
  title,
  images,
  columns = 3,
  className,
  muted,
}: CampaignGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section className={cn("py-16 md:py-24", muted && "bg-warden-surface/30", className)}>
      <Container>
        {(eyebrow || title) && (
          <div className="max-w-3xl mb-10">
            {eyebrow && (
              <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
                {eyebrow}
              </p>
            )}
            {title && (
              <h2
                className={cn(
                  "text-2xl font-semibold tracking-tight sm:text-3xl leading-tight",
                  muted ? "text-muted-foreground/80" : "text-foreground"
                )}
              >
                {title}
              </h2>
            )}
          </div>
        )}

        <div
          className={cn(
            "grid gap-4",
            columns === 2 && "grid-cols-2",
            columns === 3 && "grid-cols-2 md:grid-cols-3",
            columns === 4 && "grid-cols-2 md:grid-cols-4"
          )}
        >
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-square overflow-hidden border border-border bg-warden-carbon"
            >
              <Image
                src={img.url}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-300 hover:scale-105"
                sizes={
                  columns === 2
                    ? "(max-width: 640px) 100vw, 50vw"
                    : columns === 3
                      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                }
              />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
