"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

export interface TimelineMilestone {
  /** Required: milestone title */
  title: string;
  /** Optional: description text */
  description?: string;
  /** Optional: date label */
  date?: string;
  /** Optional: image URL */
  imageUrl?: string;
  /** Optional: image alt text */
  imageAlt?: string;
  /** Optional: custom icon (ReactNode, e.g. a lucide icon) */
  icon?: ReactNode;
}

interface CampaignTimelineProps {
  eyebrow?: string;
  title: string;
  description?: string;
  milestones: TimelineMilestone[];
  className?: string;
}

/**
 * CampaignTimeline — Editorial project timeline.
 *
 * Shows the campaign's evolution through connected milestone cards.
 * - Desktop: horizontal zigzag layout with a central progress line
 * - Mobile: vertical stacked cards with a left-side line
 * - Scroll-triggered fade-in animations for each milestone
 * - Fully content-driven via props
 *
 * Prepared for future: images, videos, external links, expandable milestones.
 */
export function CampaignTimeline({
  eyebrow,
  title,
  description,
  milestones,
  className,
}: CampaignTimelineProps) {
  const [visibleIds, setVisibleIds] = useState<Set<number>>(new Set());
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── IntersectionObserver for scroll-triggered animation ──
  useEffect(() => {
    const refs = cardRefs.current;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute("data-idx"));
            if (!isNaN(idx)) {
              setVisibleIds((prev) => new Set(prev).add(idx));
            }
          }
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );

    for (const el of refs) {
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [milestones.length]);

  if (milestones.length === 0) return null;

  return (
    <section className={cn("py-14 md:py-20 overflow-hidden", className)}>
      <Container>
        {/* Header */}
        <div className="max-w-3xl mb-12 md:mb-16">
          {eyebrow && (
            <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
              {eyebrow}
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

        {/* ── Desktop: horizontal zigzag ── */}
        <div className="hidden md:block relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2" />

          <div className="space-y-16 md:space-y-24">
            {milestones.map((m, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div
                  key={idx}
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  data-idx={idx}
                  className={cn(
                    "relative grid grid-cols-2 gap-8 items-center transition-all duration-700 ease-out",
                    visibleIds.has(idx)
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-8"
                  )}
                >
                  {/* Content side */}
                  <div className={cn(isLeft ? "text-right pr-10" : "col-start-2 pl-10")}>
                    <MilestoneCard milestone={m} align={isLeft ? "right" : "left"} />
                  </div>

                  {/* Center dot */}
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1">
                    <div className="size-4 rounded-full border-2 border-warden-blue bg-warden-carbon flex items-center justify-center">
                      <div className="size-1.5 rounded-full bg-warden-blue" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Mobile: vertical timeline ── */}
        <div className="md:hidden relative">
          {/* Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-border" />

          <div className="space-y-8">
            {milestones.map((m, idx) => (
              <div
                key={idx}
                ref={(el) => {
                  cardRefs.current[idx] = el;
                }}
                data-idx={idx}
                className={cn(
                  "relative grid grid-cols-[auto_1fr] gap-4 items-start transition-all duration-500 ease-out",
                  visibleIds.has(idx)
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-6"
                )}
              >
                {/* Dot */}
                <div className="flex flex-col items-center pt-1.5">
                  <div className="size-5 rounded-full border-2 border-warden-blue bg-warden-carbon flex items-center justify-center shrink-0">
                    <div className="size-1.5 rounded-full bg-warden-blue" />
                  </div>
                </div>

                {/* Card */}
                <MilestoneCard milestone={m} align="left" />
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ── Milestone card ─────────────────────────────
function MilestoneCard({
  milestone,
  align,
}: {
  milestone: TimelineMilestone;
  align: "left" | "right";
}) {
  const { title, description, date, imageUrl, imageAlt, icon } = milestone;

  return (
    <div
      className={cn(
        "inline-block max-w-md border border-border bg-warden-surface p-5 md:p-6 transition-shadow duration-300",
        "hover:shadow-lg hover:shadow-black/10"
      )}
    >
      {/* Date */}
      {date && (
        <p className="text-[11px] font-medium uppercase tracking-wider text-warden-blue mb-1.5">
          {date}
        </p>
      )}

      {/* Title row */}
      <div className={cn("flex items-start gap-2", align === "right" && "flex-row-reverse")}>
        {icon && (
          <span className="size-5 shrink-0 text-warden-ochre/70 mt-0.5">
            {icon}
          </span>
        )}
        <h3 className="text-sm font-semibold text-foreground leading-snug">
          {title}
        </h3>
      </div>

      {/* Description */}
      {description && (
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}

      {/* Image */}
      {imageUrl && (
        <div className="mt-3 relative w-full aspect-video overflow-hidden border border-border bg-warden-carbon">
          <Image
            src={imageUrl}
            alt={imageAlt || title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}
