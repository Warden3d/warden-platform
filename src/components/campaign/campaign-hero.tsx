"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { WardenButton } from "@/components/ui/warden-button";
import { cn } from "@/lib/utils";

interface CampaignHeroProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  videoUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme?: string;
  className?: string;
}

/**
 * CampaignHero — Full-width hero block.
 *
 * Supports:
 * - Video background (future, passed via `videoUrl`)
 * - Fallback image
 * - Title + subtitle
 * - Primary CTA linking to the PDP
 *
 * @param videoUrl - When provided, renders a <video> behind the overlay. Ignored for now (structure-ready).
 * @param imageUrl - Fallback image when no video, or when video isn't loaded yet.
 * @param theme - Optional CSS class modifier for tint/overlay.
 */
export function CampaignHero({
  title,
  subtitle,
  imageUrl,
  videoUrl,
  ctaLabel = "Ver lanzamiento",
  ctaHref,
  theme,
  className,
}: CampaignHeroProps) {
  return (
    <section
      className={cn(
        "relative w-full min-h-[60vh] md:min-h-[70vh] flex items-center justify-center overflow-hidden bg-warden-carbon",
        className
      )}
    >
      {/* ── Video background (placeholder: structure ready) ── */}
      {videoUrl && (
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={imageUrl}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      )}

      {/* ── Image fallback ── */}
      {!videoUrl && imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover object-center"
          sizes="100vw"
          priority
        />
      )}

      {/* ── Overlay gradient ── */}
      <div className="absolute inset-0 bg-gradient-to-t from-warden-carbon/90 via-warden-carbon/50 to-warden-carbon/30" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
        {theme && (
          <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-4">
            {theme}
          </p>
        )}

        <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl leading-tight">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-base text-white/70 sm:text-lg leading-relaxed">
          {subtitle}
        </p>

        {ctaHref && (
          <div className="mt-8">
            <WardenButton href={ctaHref} size="lg">
              {ctaLabel}
              <ChevronRight className="size-4" />
            </WardenButton>
          </div>
        )}
      </div>
    </section>
  );
}
