import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Product, Bundle } from "@/types/warden";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";
import { ScrollableRow } from "@/components/catalog/scrollable-row";
import { formatPriceEUR } from "@/lib/utils";
import { ChevronRight, Package } from "lucide-react";

async function RelatedProductCard({ product }: { product: Product }) {
  const t = await getTranslations("common");
  return (
    <Link
      href={`/products/${product.slug}`}
      className="group border border-border bg-warden-surface p-4 flex flex-col hover:border-warden-blue/20 transition-colors w-[260px] snap-start shrink-0"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-eyebrow text-muted-foreground">{t("product")}</span>
      </div>
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
          {formatPriceEUR(product.price)}
        </span>
        <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
          {t("view")} <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

async function RelatedBundleCard({ bundle }: { bundle: Bundle }) {
  const t = await getTranslations("common");
  return (
    <Link
      href={`/bundles/${bundle.slug}`}
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
            {formatPriceEUR(bundle.price)}
          </span>
          {bundle.discountLabel && (
            <span className="ml-2 text-[10px] text-warden-green uppercase tracking-wider">
              {t("saving")}
            </span>
          )}
        </div>
        <span className="text-xs text-warden-blue inline-flex items-center gap-0.5">
          {t("viewBundle")} <ChevronRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

export async function RelatedProductsSection({
  products,
  bundles,
}: {
  products: Product[];
  bundles: Bundle[];
}) {
  const t = await getTranslations("product");
  const hasProducts = products.length > 0;
  const hasBundles = bundles.length > 0;

  if (!hasProducts && !hasBundles) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-spec-label text-muted-foreground mb-3 uppercase tracking-wider text-xs">
        {t("relatedTitle")}
      </h3>
      <ScrollableRow>
        {products.map((p) => (
          <RelatedProductCard key={p.id} product={p} />
        ))}
        {bundles.map((b) => (
          <RelatedBundleCard key={b.id} bundle={b} />
        ))}
      </ScrollableRow>
    </div>
  );
}
