import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * CardFrame — visual wrapper that applies the WARDEN tactical card frame.
 *
 * Renders the clip-card-v2 contour, the dark background fill, and the
 * decorative SVG frame overlay on top of the children.
 *
 * Layer order (bottom to top):
 *   0 — Background fill (solid dark, clipped by parent clip-path)
 *   1 — Children (content, z-10)
 *   2 — SVG frame overlay (decorative, pointer-events-none, z-20)
 */
export function CardFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col h-full overflow-hidden clip-card-v2",
        "transition-all duration-200 group-hover:-translate-y-0.5",
        className,
      )}
    >
      {/* Layer 0 — Background fill */}
      <div className="absolute inset-0 z-0 bg-[hsl(220_10%_8.5%)]" />

      {/* Layer 1 — Content */}
      <div className="relative z-10 flex flex-col h-full">{children}</div>

      {/* Layer 2 — SVG frame overlay */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/warden-product-card-frame-v2.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none"
        draggable={false}
      />
    </div>
  );
}