import type { Product } from "@/types";
import { cn } from "@/lib/utils";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight } from "lucide-react";

export function ProductCard({
  product,
  compact = false,
}: {
  product: Product;
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "group relative border border-border bg-warden-surface transition-colors hover:border-warden-blue/20",
        compact ? "p-4" : "p-5"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="mb-3">
          <CompatibilityBadge system={product.system} />
        </div>

        <h3
          className={cn(
            "font-semibold text-foreground tracking-tight transition-colors group-hover:text-warden-blue",
            compact ? "text-sm" : "text-base"
          )}
        >
          {product.name}
        </h3>

        {product.subtitle && !compact && (
          <p className="mt-1 text-xs text-muted-foreground tracking-wide uppercase">
            {product.subtitle}
          </p>
        )}

        <p
          className={cn(
            "text-muted-foreground leading-relaxed",
            compact ? "mt-2 text-xs" : "mt-3 text-sm"
          )}
        >
          {product.descriptionShort ?? product.description.slice(0, 120) + "…"}
        </p>

        {!compact && (
          <div className="mt-4 pt-3 border-t border-border flex items-center gap-2 text-xs text-muted-foreground">
            {Object.entries(product.specs).slice(0, 2).map(([key, value]) => (
              <span key={key} className="flex items-center gap-1.5">
                <span className="text-spec-label text-muted-foreground">{key}</span>
                <span className="text-data text-foreground/80">{value}</span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-4">
          <WardenButton variant="ghost" size="sm" className="group/btn">
            View Details
            <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
          </WardenButton>
        </div>
      </div>
    </article>
  );
}
