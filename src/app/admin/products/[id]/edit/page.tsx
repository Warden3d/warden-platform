import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import {
  getAdminProductById,
  getCollections,
  getCategories,
  getCompatibilitySystems,
  getLicenses,
} from "@/lib/data/admin";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  const [product, collections, categories, compatibilitySystems, licenses] =
    await Promise.all([
      getAdminProductById(id),
      getCollections(),
      getCategories(),
      getCompatibilitySystems(),
      getLicenses(),
    ]);

  if (!product) notFound();

  const defaultValues = {
    name: product.name,
    slug: product.slug,
    shortDescription: product.shortDescription,
    description: product.description,
    collectionId: product.collectionId,
    categoryId: product.categoryId,
    compatibilityId: product.compatibilityId,
    scale: product.scale,
    material: product.material,
    height: product.dimensions.height,
    width: product.dimensions.width,
    depth: product.dimensions.depth,
    price: product.price,
    gameFeatures: product.gameFeatures.join("\n"),
    status: product.status,
    featured: product.featured,
    internalCode: product.internalCode,
    associatedLicenseId: product.associatedLicenseId ?? "",
    weight: product.weight,
    volume: product.volume,
    printTime: product.printTime,
    version: product.version,
    relatedProductIds: product.relatedProductIds.join(", "),
    relatedBundleIds: product.relatedBundleIds.join(", "),
    relatedDropIds: product.relatedDropIds.join(", "),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-wide text-foreground">
          Editar producto
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {product.name} —{" "}
          <span className="font-mono text-xs">{product.internalCode}</span>
        </p>
      </div>

      <ProductForm
        mode="edit"
        productId={product.id}
        referenceData={{ collections, categories, compatibilitySystems, licenses }}
        defaultValues={defaultValues}
        existingImages={product.images}
      />
    </div>
  );
}
