"use client";

import { useState } from "react";
import { CampaignHero } from "@/components/campaign/campaign-hero";
import { CampaignTrailer } from "@/components/campaign/campaign-trailer";

interface HeroWithTrailerProps {
  title: string;
  subtitle: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  theme?: string;
  /** Video source for the trailer modal */
  trailerSrc?: string;
  /** Poster image for the trailer video */
  trailerPoster?: string;
}

/**
 * HeroWithTrailer — Combines CampaignHero + CampaignTrailer state.
 *
 * Renders the hero with a "▶ Trailer" button that opens a video modal.
 * The trailer video is lazy-loaded (only fetched when user clicks play).
 * All hero props pass through to CampaignHero.
 */
export function HeroWithTrailer({
  title,
  subtitle,
  imageUrl,
  ctaLabel = "Explore the Drop",
  ctaHref,
  theme,
  trailerSrc,
  trailerPoster,
}: HeroWithTrailerProps) {
  const [trailerOpen, setTrailerOpen] = useState(false);

  return (
    <>
      <CampaignHero
        title={title}
        subtitle={subtitle}
        imageUrl={imageUrl}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        theme={theme}
        onTrailerClick={trailerSrc ? () => setTrailerOpen(true) : undefined}
      />

      {trailerSrc && (
        <CampaignTrailer
          title={title}
          videoSrc={trailerSrc}
          poster={trailerPoster}
          isOpen={trailerOpen}
          onClose={() => setTrailerOpen(false)}
        />
      )}
    </>
  );
}
