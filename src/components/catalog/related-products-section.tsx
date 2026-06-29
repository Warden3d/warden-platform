import Link from "next/link";
import type { Product, Bundle } from "@/types/warden";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { ScrollableRow } from "@/components/catalog/scrollable-row";
import { ChevronRight, Package } from "lucide-react";

function RelatedProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border border-border bg-warden-surface p-4 flex flex-col hover:border-warden-blue/20 transition-colors w-[260px] snap-start shrink-0"
    >
      <div className="mb-2">
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
      <h4 className="text-sm font-semibold text-foreground group-hover:text-warden-blue transition-colors leading-snug">
        {product.name}
      </h4>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
        {product.shortDescription}
      </p>
      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
        <span className="text-data text-foreground/80">
          ${product.price.toFixed(2)}
        </span>
        <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
          Ver <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

function RelatedBundleCard({ bundle }: { bundle: Bundle }) {
  return (
    <Link
      href="/bundles"
      className="group border border-border bg-warden-surface p-4 flex flex-col hover:border-warden-blue/20 transition-colors w-[260px] snap-start shrink-0"
    >
      <div className="flex items-center gap-2 mb-2">
        <Package className="size-4 text-warden-blue" />
        <span className="text-eyebrow text-warden-blue">Bundle</span>
      </div>
      <h4 className="text-sm font-semibold text-foreground group-hover:text-warden-blue transition-colors leading-snug">
        {bundle.name}
      </h4>
      <p className="mt-1 text-xs text-muted-foreground line-clamp-2 leading-relaxed flex-1">
        {bundle.description}
      </p>
      <div className="mt-3 pt-2 border-t border-border flex items-center justify-between">
        <div>
          <span className="text-data text-foreground/80">
            ${bundle.price.toFixed(2)}
          </span>
          {bundle.discountLabel && (
            <span className="ml-2 text-[10px] text-warden-green uppercase tracking-wider">
              Ahorro
            </span>
          )}
        </div>
        <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
          Ver bundle <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export function RelatedProductsSection({
  products,
  bundles,
}: {
  products: Product[];
  bundles: Bundle[];
}) {
  if (products.length === 0 && bundles.length === 0) return null;

  return (
    <div className="space-y-6">
      {products.length > 0 && (
        <div>
          <h3 className="text-spec-label text-muted-foreground mb-3 uppercase tracking-wider text-xs">
            Productos relacionados
          </h3>
          <ScrollableRow>
            {products.map((p) => (
              <RelatedProductCard key={p.id} product={p} />
            ))}
          </ScrollableRow>
        </div>
      )}

      {bundles.length > 0 && (
        <div>
          <h3 className="text-spec-label text-muted-foreground mb-3 uppercase tracking-wider text-xs">
            Disponible en bundles
          </h3>
          <ScrollableRow>
            {bundles.map((b) => (
              <RelatedBundleCard key={b.id} bundle={b} />
            ))}
          </ScrollableRow>
        </div>
      )}
    </div>
  );
}
