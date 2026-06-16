import { ProductForm } from "@/components/admin/product-form";
import { getCollections, getCategories, getCompatibilitySystems, getLicenses } from "@/lib/data/admin";

export default async function NewProductPage() {
  const [collections, categories, compatibilitySystems, licenses] = await Promise.all([
    getCollections(),
    getCategories(),
    getCompatibilitySystems(),
    getLicenses(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-wide text-foreground">
          Nuevo producto
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Completa todos los campos para crear un nuevo producto en el catálogo
        </p>
      </div>

      <ProductForm
        mode="create"
        referenceData={{ collections, categories, compatibilitySystems, licenses }}
      />
    </div>
  );
}
