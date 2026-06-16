"use client";

import type { Product } from "@/types/warden";
import { cn } from "@/lib/utils";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { useSelection } from "@/hooks/use-selection";
import { Eye, Plus, Check } from "lucide-react";

export function CatalogProductCard({ product }: { product: Product }) {
  const { addItem, removeItem, isSelected } = useSelection();
  const selected = isSelected(product.id);

  const primaryImage = product.images.find((img) => img.isPrimary);

  return (
    <article className="group relative border border-border bg-warden-surface transition-colors hover:border-warden-blue/20 flex flex-col">
      {/* Image */}
      {primaryImage && (
        <div className="aspect-[4/3] bg-warden-carbon border-b border-border overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
            <div className="text-center">
              <div className="text-4xl mb-1">
                {product.categoryId === "cat-escenografia"
                  ? "⛰"
                  : product.categoryId === "cat-terreno"
                    ? "🌋"
                    : product.categoryId === "cat-mapas"
                      ? "🗺"
                      : product.categoryId === "cat-escenarios"
                        ? "🎯"
                        : product.categoryId === "cat-complementarios"
                          ? "⚙"
                          : "📦"}
              </div>
              <span className="text-eyebrow text-muted-foreground/40">
                {product.name.slice(0, 25)}…
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 p-4">
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <CompatibilityBadge
            system={
              product.compatibilityId === "comp-battletech-classic"
                ? "battletech-classic"
                : product.compatibilityId === "comp-alpha-strike"
                  ? "alpha-strike"
                  : "aerotech"
            }
          />
        </div>

        {/* Name */}
        <h3 className="font-semibold text-foreground text-sm tracking-tight leading-snug transition-colors group-hover:text-warden-blue">
          {product.name}
        </h3>

        {/* Short description */}
        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Price */}
        <div className="mt-3">
          <span className="text-data text-foreground/90">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-spec-label text-muted-foreground ml-1">USD</span>
        </div>

        {/* Actions */}
        <div className="mt-4 pt-3 border-t border-border flex items-center gap-2">
          <WardenButton variant="ghost" size="sm" href={`/products/${product.slug}`}>
            <Eye className="size-3.5" />
            View
          </WardenButton>
          <button
            onClick={() => {
              if (selected) {
                removeItem(product.id);
              } else {
                addItem({
                  productId: product.id,
                  productName: product.name,
                  unitPrice: product.price,
                  quantity: 1,
                  productSlug: product.slug,
                  productImage: primaryImage?.url,
                });
              }
            }}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-sm h-7 px-3 text-xs tracking-wider uppercase font-medium transition-all duration-150 active:translate-y-px",
              selected
                ? "bg-warden-blue/15 text-warden-blue border border-warden-blue/30"
                : "bg-transparent text-muted-foreground hover:bg-warden-elevated hover:text-foreground border border-transparent hover:border-border"
            )}
          >
            {selected ? (
              <>
                <Check className="size-3" />
                Added
              </>
            ) : (
              <>
                <Plus className="size-3" />
                Select
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
