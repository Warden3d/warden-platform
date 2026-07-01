"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types/warden";
import { IMAGE_VIEW_LABELS } from "@/types/warden";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

function GalleryFallback({ productName }: { productName: string }) {
  return (
    <div className="w-full aspect-square flex flex-col items-center justify-center bg-warden-carbon border border-border">
      <Package className="size-16 text-muted-foreground/20" strokeWidth={1} />
      <p className="mt-4 text-xs text-muted-foreground/40 max-w-[200px] text-center leading-relaxed">
        {productName}
      </p>
      <p className="mt-1 text-[10px] text-muted-foreground/25 uppercase tracking-widest">
        Sin imagen disponible
      </p>
    </div>
  );
}

export function ProductGallery({
  images,
  productName,
  defaultIndex = 0,
}: {
  images: ProductImage[];
  productName: string;
  defaultIndex?: number;
}) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedIndex, setSelectedIndex] = useState(defaultIndex);

  const handlePrev = useCallback(() => {
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : sorted.length - 1));
  }, [sorted.length]);

  const handleNext = useCallback(() => {
    setSelectedIndex((prev) => (prev < sorted.length - 1 ? prev + 1 : 0));
  }, [sorted.length]);

  if (sorted.length === 0) {
    return <GalleryFallback productName={productName} />;
  }

  const current = sorted[selectedIndex];
  const isSupabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    current.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-[4/3] border border-border bg-warden-carbon overflow-hidden group">
        <Image
          src={current.url}
          alt={current.alt || productName}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          unoptimized={!isSupabaseUrl}
          priority
        />

        {/* View type badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-warden-surface/90 text-muted-foreground border border-border/60 backdrop-blur-sm">
            {IMAGE_VIEW_LABELS[current.viewType] ?? current.viewType}
          </span>
        </div>

        {/* Primary badge */}
        {current.isPrimary && (
          <div className="absolute top-3 right-3 z-10">
            <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider bg-warden-blue/20 text-warden-blue border border-warden-blue/30 backdrop-blur-sm">
              Principal
            </span>
          </div>
        )}

        {/* Nav arrows (for multi-image) */}
        {sorted.length > 1 && (
          <>
            <button
              type="button"
              onClick={handlePrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 size-8 inline-flex items-center justify-center rounded-full bg-warden-surface/90 text-foreground/80 hover:text-foreground hover:bg-warden-surface border border-border/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
              aria-label="Imagen anterior"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 size-8 inline-flex items-center justify-center rounded-full bg-warden-surface/90 text-foreground/80 hover:text-foreground hover:bg-warden-surface border border-border/60 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
              aria-label="Imagen siguiente"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1 scrollbar-none"
          role="tablist"
          aria-label="Vistas del producto"
        >
          {sorted.map((img, idx) => (
            <button
              type="button"
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              role="tab"
              aria-selected={selectedIndex === idx}
              aria-label={`Ver ${IMAGE_VIEW_LABELS[img.viewType] ?? `vista ${idx + 1}`}`}
              className={cn(
                "relative size-[84px] shrink-0 border overflow-hidden transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50",
                selectedIndex === idx
                  ? "border-warden-blue/60 ring-1 ring-warden-blue/30"
                  : "border-border hover:border-warden-blue/20 opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `${productName} — vista ${idx + 1}`}
                width={84}
                height={84}
                className="size-full object-cover"
                unoptimized={!isSupabaseUrl}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-1 py-0.5">
                <span className="block text-[8px] text-white/80 font-medium uppercase tracking-wider leading-none">
                  {IMAGE_VIEW_LABELS[img.viewType] ?? `Vista ${idx + 1}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Alt text caption */}
      {current.alt && (
        <p className="text-[10px] text-muted-foreground/40 text-center italic">
          {current.alt}
        </p>
      )}
    </div>
  );
}
