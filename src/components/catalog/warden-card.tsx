import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/types/warden";
import { cn } from "@/lib/utils";
import { WardenButton } from "@/components/ui/warden-button";

// ─── Props ─────────────────────────────────────

export interface WardenCardProps {
  product: Product;
  className?: string;
}

// ─── Badge colour per system ───────────────────

const systemBadge: Record<
  string,
  { label: string; className: string }
> = {
  "comp-battletech-classic": {
    label: "BT CLASSIC",
    className: "border-warden-blue/25 text-warden-blue/70",
  },
  "comp-alpha-strike": {
    label: "ALPHA STRIKE",
    className: "border-warden-green/25 text-warden-green/70",
  },
  "comp-aerotech": {
    label: "AEROTECH",
    className: "border-warden-ochre/25 text-warden-ochre/70",
  },
};

/**
 * Per-product object-position overrides.
 * Kept for future individual framing — currently all object-center.
 */
const objectPositions: Record<string, string> = {};

// ─── Card component ────────────────────────────

export function WardenCard({ product, className }: WardenCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary);
  const isSupabaseUrl =
    primaryImage?.url &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    primaryImage.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const badge =
    systemBadge[product.compatibilityId] ?? systemBadge["comp-battletech-classic"];

  const objectPosition = objectPositions[product.slug] ?? "object-center";

  return (
    <article className={cn("group flex flex-col", className)}>
      {/* ── Card wrapper — clips all layers to match SVG v2 contour ── */}
      <div
        className="relative flex flex-col h-full overflow-hidden clip-card-v2
                     transition-all duration-200
                     group-hover:-translate-y-0.5"
      >
        {/* Layer 0 — Background fill (clipped by parent clip-path) */}
        <div className="absolute inset-0 z-0 bg-[hsl(220_10%_8.5%)]" />

        {/* Layer 1 — Content (above bg, below SVG frame) */}
        <div className="relative z-10 flex flex-col h-full">
          {/* ── Image zone — full width, no lateral padding ── */}
          <Link
            href={`/products/${product.slug}`}
            className="relative block aspect-[4/3] overflow-hidden"
            tabIndex={-1}
          >
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.alt || product.name}
                width={400}
                height={300}
                className={cn(
                  "h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]",
                  objectPosition,
                )}
                unoptimized={!isSupabaseUrl}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center bg-[hsl(220_10%_6%)] text-muted-foreground/20">
                <Package className="size-10" strokeWidth={1} />
                <span className="mt-1 text-[10px] uppercase tracking-widest">
                  Sin imagen
                </span>
              </div>
            )}
          </Link>

          {/* ── Separator — aligns with content padding below ── */}
          <div className="mx-5 h-px bg-[hsl(215_12%_20%)]" />

          {/* ── Text content block with interior safe zone ── */}
          {/*
              Safe‑zone dimensions (SVG viewBox 360×540):
                • sides:   x=0–25, x=335–360   → ~7 %  → px‑5 (20px)
                • bottom:  y=490–540            → ~9 %  → pb‑7 (28px)
                • top of info block: y=35–42    → ~7 %  → pt‑4 (16px)
          */}
          <div className="flex flex-col flex-1 px-5 pt-4 pb-7">
            {/* Compatibility badge */}
            <div className="mb-2">
              <span
                className={cn(
                  "inline-block rounded-[2px] border bg-[hsl(220_10%_5%)] px-2 py-0.5 text-[10px] font-semibold uppercase leading-none tracking-[0.15em]",
                  badge.className,
                )}
              >
                {badge.label}
              </span>
            </div>

            {/* Product name */}
            <h3 className="min-h-[2.5em] text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-warden-blue line-clamp-2">
              <Link href={`/products/${product.slug}`}>{product.name}</Link>
            </h3>

            {/* Short description */}
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/60">
              {product.shortDescription}
            </p>

            {/* Price + CTA — pushed to bottom by mt-auto */}
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-[hsl(215_10%_17%)] pt-3">
              <span className="shrink-0 pl-4 text-base font-semibold text-white">
                {product.price.toFixed(2)} €
              </span>
              <WardenButton
                href={`/products/${product.slug}`}
                variant="outline"
                size="sm"
                className="border-warden-blue text-warden-blue hover:border-[hsl(210_45%_65%)] hover:text-[hsl(210_45%_65%)]"
              >
                View product
              </WardenButton>
            </div>
          </div>
        </div>

        {/* Layer 2 — SVG frame overlay (decorative, on top of content) */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/brand/warden-product-card-frame-v2.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full pointer-events-none z-20 select-none"
          draggable={false}
        />
      </div>
    </article>
  );
}
