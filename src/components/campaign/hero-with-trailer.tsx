"use client";

import { useState, useCallback, useRef, useEffect } from "react";
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

const TRAILER_OPEN_DELAY = 200; // ms — matches the CSS transition + gives time for button feedback

/**
 * HeroWithTrailer — Combines CampaignHero + CampaignTrailer state
 * with a micro-interaction on the trailer button.
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
  const [trailerClicked, setTrailerClicked] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleTrailerClick = useCallback(() => {
    if (!trailerSrc) return;

    if (reducedMotion) {
      // No animation — open immediately
      setTrailerOpen(true);
      return;
    }

    // 1. Button feedback (CSS transition handles the scale)
    setTrailerClicked(true);

    // 2. Brief delay for the button animation to play, then open trailer
    timeoutRef.current = setTimeout(() => {
      setTrailerOpen(true);
      // Reset button state after the trailer is open
      requestAnimationFrame(() => setTrailerClicked(false));
    }, TRAILER_OPEN_DELAY);
  }, [trailerSrc, reducedMotion]);

  // ── Cleanup timeout on unmount ──
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <>
      <CampaignHero
        title={title}
        subtitle={subtitle}
        imageUrl={imageUrl}
        ctaLabel={ctaLabel}
        ctaHref={ctaHref}
        theme={theme}
        trailerClicked={trailerClicked}
        onTrailerClick={trailerSrc ? handleTrailerClick : undefined}
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
