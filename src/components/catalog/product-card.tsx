import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/warden";
import { cn } from "@/lib/utils";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { WardenButton } from "@/components/ui/warden-button";
import { Package, ChevronRight } from "lucide-react";

export interface ProductCardProps {
  product: Product;
  href?: string;
  variant?: "compact" | "default" | "detailed";
  showImage?: boolean;
  showPrice?: boolean;
  showSpecs?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function ProductCard({
  product,
  href = `/products/${product.slug}`,
  variant = "default",
  showImage = variant === "default" || variant === "detailed",
  showPrice = variant === "default" || variant === "detailed",
  showSpecs = variant === "detailed",
  actions,
  className,
}: ProductCardProps) {
  const primaryImage = product.images.find((img) => img.isPrimary);
  const isSupabaseUrl =
    primaryImage?.url &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    primaryImage.url.includes(process.env.NEXT_PUBLIC_SUPABASE_URL);

  const compatSlug =
    product.compatibilityId === "comp-battletech-classic"
      ? "battletech-classic"
      : product.compatibilityId === "comp-alpha-strike"
        ? "alpha-strike"
        : "aerotech";

  const content = (
    <div
      className={cn(
        "relative border border-border bg-warden-surface transition-colors hover:border-warden-blue/20 flex flex-col h-full",
        variant === "compact" && "p-5"
      )}
    >
      {showImage && (
        <div className="aspect-[4/3] bg-warden-carbon border-b border-border overflow-hidden">
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
        </div>
      )}

      <div
        className={cn(
          "flex flex-col flex-1",
          variant !== "compact" && "p-4"
        )}
      >
        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
          <CompatibilityBadge system={compatSlug} />
        </div>

        {/* Name */}
        <h3
          className={cn(
            "font-semibold text-foreground tracking-tight leading-snug transition-colors group-hover:text-warden-blue",
            variant === "compact" ? "text-base" : "text-sm"
          )}
        >
          {product.name}
        </h3>

        {/* Short description */}
        <p
          className={cn(
            "text-muted-foreground leading-relaxed line-clamp-2",
            variant === "compact" ? "mt-3 text-sm" : "mt-1.5 text-xs"
          )}
        >
          {product.shortDescription}
        </p>

        {/* Specs */}
        {showSpecs && product.specs.length > 0 && (
          <div className="mt-4 pt-3 border-t border-border">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
              {product.specs.slice(0, 4).map((spec) => (
                <div key={spec.id}>
                  <dt className="text-spec-label text-muted-foreground">
                    {spec.specKey}
                  </dt>
                  <dd className="text-data text-foreground/90">
                    {spec.specValue}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {/* Price */}
        {showPrice && (
          <div className="mt-3">
            <span className="text-data text-foreground/90">
              ${product.price.toFixed(2)}
            </span>
            <span className="text-spec-label text-muted-foreground ml-1">
              USD
            </span>
          </div>
        )}

        {/* Actions */}
        {(actions || variant === "compact") && (
          <div className="mt-auto pt-4 flex items-center gap-2">
            {variant === "compact" ? (
              <WardenButton variant="ghost" size="sm" className="group/btn">
                Ver detalles
                <ChevronRight className="size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </WardenButton>
            ) : (
              actions
            )}
          </div>
        )}
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
