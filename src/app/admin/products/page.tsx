import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllProducts } from "@/lib/data/admin";
import { getCollections } from "@/lib/data/admin";
import { ProductStatusSwitcher } from "./status-switcher";

export default async function AdminProductsPage() {
  const products = await getAllProducts();
  const collections = await getCollections();

  const collectionMap = new Map(
    collections.map((c: { id: string; name: string }) => [c.id, c.name])
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-wide text-foreground">
            Productos
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} producto{products.length !== 1 ? "s" : ""} en
            catálogo — activos, ocultos y retirados
          </p>
        </div>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="size-4" />
            Nuevo producto
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-sm border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                  Código
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                  Nombre
                </th>
                <th className="hidden px-4 py-3 text-xs font-medium text-muted-foreground md:table-cell">
                  Colección
                </th>
                <th className="hidden px-4 py-3 text-xs font-medium text-muted-foreground lg:table-cell">
                  Precio
                </th>
                <th className="px-4 py-3 text-xs font-medium text-muted-foreground">
                  Estado
                </th>
                <th className="w-0 px-4 py-3 text-xs font-medium text-muted-foreground">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="transition-colors hover:bg-muted/30"
                >
                  {/* Internal Code */}
                  <td className="px-4 py-3">
                    <span className="text-data text-xs text-muted-foreground">
                      {product.internalCode || "—"}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="font-medium text-foreground hover:text-warden-blue transition-colors"
                    >
                      {product.name}
                    </Link>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      /{product.slug}
                    </div>
                  </td>

                  {/* Collection */}
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                    {collectionMap.get(product.collectionId) ?? "—"}
                  </td>

                  {/* Price */}
                  <td className="hidden px-4 py-3 font-mono tabular-nums lg:table-cell">
                    {product.price.toFixed(2)} €
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <ProductStatusSwitcher
                      productId={product.id}
                      currentStatus={product.status}
                    />
                  </td>

                  {/* Edit link */}
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-xs text-warden-blue hover:underline"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No hay productos.{" "}
                    <Link
                      href="/admin/products/new"
                      className="text-warden-blue hover:underline"
                    >
                      Crear el primero
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
