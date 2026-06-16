"use client";

import { useState } from "react";
import type { ProductImage } from "@/types/warden";
import { cn } from "@/lib/utils";

function GalleryPlaceholder({ productName }: { productName: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-warden-carbon">
      <div className="text-center px-4">
        <div className="text-5xl mb-3">▣</div>
        <p className="text-eyebrow text-muted-foreground/40 max-w-[200px] mx-auto leading-relaxed">
          {productName}
        </p>
      </div>
    </div>
  );
}

export function ProductGallery({
  images,
  productName,
}: {
  images: ProductImage[];
  productName: string;
}) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const current = sorted[selectedIndex];

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="aspect-square border border-border bg-warden-surface overflow-hidden">
        {current ? (
          <div className="w-full h-full flex items-center justify-center bg-warden-carbon">
            <div className="text-center px-4">
              <div className="text-5xl mb-3">▣</div>
              <p className="text-eyebrow text-muted-foreground/40 max-w-[260px] mx-auto leading-relaxed">
                {current.alt}
              </p>
              <p className="text-[10px] text-muted-foreground/20 mt-2 uppercase tracking-wider">
                Image placeholder
              </p>
            </div>
          </div>
        ) : (
          <GalleryPlaceholder productName={productName} />
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setSelectedIndex(idx)}
              className={cn(
                "size-16 shrink-0 border bg-warden-carbon overflow-hidden transition-colors",
                selectedIndex === idx
                  ? "border-warden-blue/50"
                  : "border-border hover:border-warden-blue/20"
              )}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-[10px] text-muted-foreground/30 uppercase tracking-wider">
                  {idx === 0 ? "Front" : `View ${idx + 1}`}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
