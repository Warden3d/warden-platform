"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import type { Product } from "@/types/warden";
import { CardFrame } from "@/components/catalog/card-frame";
import { AddToSelectionButton } from "@/components/catalog/add-to-selection-button";
import { cn } from "@/lib/utils";

// ─── System badge (color-coded per game system) ────────────────────

const SYSTEM_BADGE: Record<
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
    className: "border-[hsl(0_30%_45%)]/25 text-[hsl(0_30%_45%)]",
  },
};

function SystemBadge({ compatibilityId }: { compatibilityId: string }) {
  const badge =
    SYSTEM_BADGE[compatibilityId] ?? SYSTEM_BADGE["comp-battletech-classic"];
  return (
    <span
      className={cn(
        "inline-block rounded-[2px] border bg-[hsl(220_10%_5%)] px-2 py-0.5",
        "text-[11px] font-semibold uppercase leading-none tracking-[0.15em]",
        badge.className,
      )}
    >
      {badge.label}
    </span>
  );
}

// ─── FinishSelector chip component ─────────────────────────────────
// NOTE (R052A): the configuration infrastructure is generic (variants array)
// but capabilityId is currently fixed to "finish" — acceptable for V1 since
// the only real configurable capabilities are finishes. Revisit when Size,
// Scale, Material, Variant or Content capabilities are introduced.

const CAPABILITY_ID = "finish";

function FinishChip({
  label,
  swatchColor,
  selected,
  onSelect,
}: {
  label: string;
  swatchColor?: string;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onSelect();
      }}
      aria-label={label}
      title={label}
      className={cn(
        "size-5 rounded-full border transition-all duration-150 flex items-center justify-center shrink-0",
        selected
          ? "border-warden-blue ring-1 ring-warden-blue/40"
          : "border-border/60 hover:border-warden-blue/40",
      )}
    >
      <span
        className="size-3.5 rounded-full"
        style={{ backgroundColor: swatchColor ?? "currentColor" }}
      />
    </button>
  );
}

// ─── CatalogProductCard ───────────────────────────────────────────

export function CatalogProductCard({
  product,
  procedence,
}: {
  product: Product;
  procedence?: string;
}) {
  const variants = product.variants ?? [];
  const hasMultipleVariants = variants.length >= 2;

  // PCM State B: 1 variant → show label text; State C/D: 2+ → show chips
  const [selectedIdx, setSelectedIdx] = useState(0);

  const selectedVariant = variants[selectedIdx] ?? null;

  // Resolve price: variant price when available, fallback to product.price
  const displayPrice = selectedVariant?.price ?? product.price;

  // Resolve configuration array for the selected variant
  const configuration = useMemo(() => {
    if (!selectedVariant) return undefined;
    return [
      {
        capabilityId: CAPABILITY_ID,
        optionId: selectedVariant.name.toLowerCase().replace(/\s+/g, "-"),
        label: selectedVariant.name,
      },
    ];
  }, [selectedVariant]);

  // Resolve image: variant-specific via imageIndices, fallback to primary
  const displayImage = useMemo(() => {
    if (selectedVariant?.imageIndices && selectedVariant.imageIndices.length > 0) {
      // Find the first image in product.images that matches variant's first index
      const idx = selectedVariant.imageIndices[0];
      const img = product.images[idx];
      if (img) return img;
    }
    // Fallback: the product's primary image
    return product.images.find((img) => img.isPrimary) ?? null;
  }, [selectedVariant, product.images]);

  const isSupabaseUrl =
    displayImage?.url &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    displayImage.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <article className="group flex flex-col">
      <CardFrame>
        {/* ── Image zone ── */}
        <Link
          href={`/products/${product.slug}`}
          className="relative block aspect-[4/3] overflow-hidden"
          tabIndex={-1}
        >
          {displayImage ? (
            <Image
              src={displayImage.url}
              alt={displayImage.alt || product.name}
              width={400}
              height={300}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized={!isSupabaseUrl}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[hsl(220_10%_6%)] text-muted-foreground/20">
              <Package className="size-10" strokeWidth={1} />
              <span className="mt-1 text-[10px] uppercase tracking-widest">
                Sin imagen
              </span>
            </div>
          )}

          {procedence && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-warden-carbon/80 text-foreground/90 backdrop-blur-sm border border-border/40 leading-none">
                {procedence}
              </span>
            </div>
          )}
        </Link>

        {/* ── Text content ── */}
        <div className="flex flex-col flex-1 px-5 pt-4 pb-7">
          {/* System badge */}
          <div className="mb-2">
            <SystemBadge compatibilityId={product.compatibilityId} />
          </div>

          {/* Product name */}
          <h3 className="min-h-[2.5em] text-sm font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-warden-blue line-clamp-2">
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
          </h3>

          {/* Quick specs (top 3 from card visibility) */}
          {product.specs.filter((s) => s.visibility.includes("card")).length >
            0 && (
            <div className="mt-2 space-y-0.5">
              {product.specs
                .filter((s) => s.visibility.includes("card"))
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .slice(0, 3)
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex items-baseline gap-1.5 text-[11px]"
                  >
                    <span className="text-muted-foreground/60 shrink-0">
                      {s.label}:
                    </span>
                    <span className="text-foreground/70">{s.value}</span>
                  </div>
                ))}
            </div>
          )}

          {/* ── Finish selector (PCM State C/D: 2+ variants) ── */}
          {hasMultipleVariants && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                Acabado
              </span>
              <div className="flex items-center gap-1.5">
                {variants.map((v, idx) => (
                  <FinishChip
                    key={v.name}
                    label={v.name}
                    swatchColor={v.swatchColor}
                    selected={idx === selectedIdx}
                    onSelect={() => setSelectedIdx(idx)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PCM State B: exactly 1 variant → show label text only */}
          {variants.length === 1 && (
            <div className="mt-2">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground/60 font-medium">
                Acabado: {variants[0].name}
              </span>
            </div>
          )}

          {/* Price + CTA */}
          <div className="mt-auto flex items-center justify-between gap-2 border-t border-[hsl(215_10%_17%)] pt-3">
            <span className="shrink-0 pl-4 text-lg font-semibold text-[hsl(35_55%_62%)]">
              {displayPrice.toFixed(2)} €
            </span>
            <AddToSelectionButton
              entityId={product.id}
              entityType="product"
              name={product.name}
              unitPrice={displayPrice}
              slug={product.slug}
              image={displayImage?.url}
              size="sm"
              configuration={configuration}
              className="px-2"
            />
          </div>
        </div>
      </CardFrame>
    </article>
  );
}