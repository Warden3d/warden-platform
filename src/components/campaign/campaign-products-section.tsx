import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";
import { CompatibilityBadge } from "@/components/catalog/technical-badge";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  imageUrl?: string;
  imageAlt?: string;
  compatSystem?: { slug: string; name: string } | null;
}

interface CampaignProductsSectionProps {
  eyebrow?: string;
  title: string;
  products: ProductItem[];
  className?: string;
}

/**
 * CampaignProductsSection — Displays the products included in a drop.
 *
 * Renders a grid of product cards (image, badge, name, description).
 * Content-driven: if `products` is empty, the block is not rendered.
 */
export function CampaignProductsSection({
  eyebrow = "Contenido",
  title = "Productos incluidos",
  products,
  className,
}: CampaignProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("py-10 md:py-14 bg-warden-surface/30", className)}>
      <Container>
        <div className="max-w-3xl mb-8">
          <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
            {eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl leading-tight text-foreground">
            {title}
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.id} className="flex flex-col">
              {product.imageUrl && (
                <div className="relative w-full aspect-video mb-3 overflow-hidden border border-border bg-warden-carbon">
                  <Image
                    src={product.imageUrl}
                    alt={product.imageAlt || product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
              )}

              <div className="flex items-start justify-between gap-2 mb-2">
                {product.compatSystem && (
                  <CompatibilityBadge
                    system={
                      product.compatSystem.slug as
                        | "battletech-classic"
                        | "alpha-strike"
                        | "aerotech"
                    }
                  />
                )}
              </div>

              <Link
                href={`/products/${product.slug}`}
                className="group inline"
              >
                <h3 className="font-semibold text-sm leading-snug text-foreground group-hover:text-warden-blue transition-colors">
                  {product.name}
                </h3>
              </Link>

              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                {product.shortDescription}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
