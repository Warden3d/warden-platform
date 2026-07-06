import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/warden";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  href?: string;
  variant?: "compact" | "default" | "detailed";
  showImage?: boolean;
  showPrice?: boolean;
  showSpecs?: boolean;
  actions?: React.ReactNode;
  className?: string;
  /**
   * Procedence label shown as an overlay on the image (e.g. "WARDEN CORE", "Wasteland Studios").
   * When omitted, no badge is rendered.
   */
  procedence?: string;
}

function CompatibilityLabel({ name }: { name: string }) {
  const short =
    name === "BattleTech Classic" ? "BT Classic"
    : name === "Alpha Strike" ? "Alpha Strike"
    : name === "AeroTech" ? "AeroTech"
    : name;
  return (
    <span className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-sm border border-border/40 text-muted-foreground/80 leading-none">
      {short}
    </span>
  );
}

export function ProductCard({
  product,
  href = `/products/${product.slug}`,
  variant = "default",
  showImage = variant === "default" || variant === "detailed",
  showPrice = variant === "default" || variant === "detailed",
  actions,
  className,
  procedence,
}: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary);
  const isSupabaseUrl =
    primaryImage?.url &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    primaryImage.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const content = (
    <div
      className={cn(
        "relative border border-border bg-warden-surface transition-colors hover:border-warden-blue/20 flex flex-col h-full",
        variant === "compact" && "p-5"
      )}
    >
      {showImage && (
        <div className="relative aspect-[4/3] bg-warden-carbon border-b border-border overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt || product.name}
              width={400}
              height={300}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              unoptimized={!isSupabaseUrl}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/20">
              <Package className="size-10" strokeWidth={1} />
              <span className="mt-1 text-[10px] uppercase tracking-widest">
                Sin imagen
              </span>
            </div>
          )}

          {/* Procedence overlay — top-left */}
          {procedence && (
            <div className="absolute top-3 left-3 z-10">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider bg-warden-carbon/80 text-foreground/90 backdrop-blur-sm border border-border/40 leading-none">
                {procedence}
              </span>
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          "flex flex-col flex-1",
          variant !== "compact" && "p-4"
        )}
      >
        {/* Game-system badges */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <CompatibilityLabel
            name={
              product.compatibilityId === "comp-battletech-classic"
                ? "BattleTech Classic"
                : product.compatibilityId === "comp-alpha-strike"
                  ? "Alpha Strike"
                  : "AeroTech"
            }
          />
        </div>

        {/* Name */}
        <h3
          className={cn(
            "font-semibold text-foreground tracking-tight leading-snug transition-colors group-hover:text-warden-blue",
            variant === "compact" ? "text-base" : "text-sm",
            "line-clamp-2 min-h-[2.5em]"
          )}
        >
          {product.name}
        </h3>

        {/* Quick specs (top 3 from specs with card visibility) */}
        {product.specs.filter((s) => s.visibility.includes("card")).length > 0 && (
          <div className="mt-2 space-y-0.5">
            {product.specs
              .filter((s) => s.visibility.includes("card"))
              .sort((a, b) => a.sortOrder - b.sortOrder)
              .slice(0, 3)
              .map((s) => (
                <div key={s.id} className="flex items-baseline gap-1.5 text-[11px]">
                  <span className="text-muted-foreground/60 shrink-0">{s.label}:</span>
                  <span className="text-foreground/70">{s.value}</span>
                </div>
              ))}
          </div>
        )}

        {/* Price + Actions row */}
        <div className="mt-auto pt-3 flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            {actions}
          </div>
          {showPrice && (
            <span className="text-data text-foreground/90 shrink-0 text-right">
              {product.price.toFixed(2)} €
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className={cn("group block", className)}>
        {content}
      </Link>
    );
  }

  return <article className={cn("group", className)}>{content}</article>;
}