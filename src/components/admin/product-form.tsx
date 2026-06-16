"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ImageUploader } from "@/components/admin/image-uploader";
import {
  productFormSchema,
  type ProductFormValues,
} from "@/lib/schemas/product";
import { PRODUCT_STATUSES, type ProductStatus, type ProductImage } from "@/types/warden";
import {
  createProduct,
  updateProduct,
  type ProductFormResult,
  type UploadableImage,
} from "@/lib/actions/product-form";
import type { Collection, Category, CompatibilitySystem, License } from "@/types/warden";
import { Save, Loader2 } from "lucide-react";

type ReferenceData = {
  collections: Collection[];
  categories: Category[];
  compatibilitySystems: CompatibilitySystem[];
  licenses: License[];
};

interface Props {
  mode: "create" | "edit";
  referenceData: ReferenceData;
  defaultValues?: Partial<ProductFormValues>;
  productId?: string;
  existingImages?: ProductImage[];
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1 text-xs text-destructive">{message}</p>;
}

function FieldLabel({
  htmlFor,
  children,
  required,
}: {
  htmlFor: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-medium text-muted-foreground"
    >
      {children}
      {required && <span className="ml-0.5 text-warden-ochre">*</span>}
    </label>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-4 border-b border-border pb-2 text-sm font-semibold text-foreground">
      {children}
    </h3>
  );
}

export function ProductForm({
  mode,
  referenceData,
  defaultValues,
  productId,
  existingImages,
}: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [images, setImages] = useState<ProductImage[]>(existingImages ?? []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    // Zod v4 coercion types don't fully match @hookform/resolvers v5 yet
    // @ts-expect-error — known type incompatibility between zod v4 z.coerce and resolvers
    resolver: zodResolver(productFormSchema),
    defaultValues: defaultValues ?? {
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      collectionId: "",
      categoryId: "",
      compatibilityId: "",
      scale: "1:265",
      material: "",
      height: 0,
      width: 0,
      depth: 0,
      price: 0,
      gameFeatures: "",
      status: "hidden" as ProductStatus,
      featured: false,
      internalCode: "",
      associatedLicenseId: "",
      weight: 0,
      volume: 0,
      printTime: 0,
      version: "1.0.0",
      relatedProductIds: "",
      relatedBundleIds: "",
      relatedDropIds: "",
    },
  });

  async function onSubmit(data: ProductFormValues) {
    setSubmitting(true);
    setFormError("");
    setFormSuccess("");

    let result: ProductFormResult;
    if (mode === "create") {
      result = await createProduct(data as ProductFormValues);
    } else {
      const uploadableImages: UploadableImage[] = images
        .filter((img) => !img.url.startsWith("blob:"))
        .map((img) => ({
          url: img.url,
          alt: img.alt,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
          viewType: img.viewType,
        }));
      result = await updateProduct(productId!, data as ProductFormValues, uploadableImages);
    }

    if (!result.success) {
      if (result.errors) {
        // Errors are handled by react-hook-form
      }
      setFormError(result.message ?? "Error al guardar.");
    } else {
      setFormSuccess("Producto guardado correctamente.");
      if (mode === "create") {
        router.push(`/admin/products/${result.productId}/edit`);
      }
    }
    setSubmitting(false);
  }

  return (
    <form
      onSubmit={
        // @ts-expect-error — compatible with zod v4 coercion types
        handleSubmit(onSubmit)
      }
      className="space-y-8"
    >
      {/* Flash messages */}
      {formError && (
        <div className="rounded-sm border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {formError}
        </div>
      )}
      {formSuccess && (
        <div className="rounded-sm border border-warden-green/40 bg-warden-green/10 px-4 py-3 text-sm text-warden-green">
          {formSuccess}
        </div>
      )}

      {/* ── Section: Basic Info ─────────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Información básica</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <FieldLabel htmlFor="name" required>Nombre del producto</FieldLabel>
            <Input id="name" {...register("name")} />
            <FieldError message={errors.name?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="slug" required>Slug (URL)</FieldLabel>
            <Input id="slug" {...register("slug")} placeholder="hex-position-markers-brass" />
            <FieldError message={errors.slug?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="status" required>Estado</FieldLabel>
            <select
              id="status"
              {...register("status")}
              className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              {PRODUCT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "active" ? "Activo" : s === "hidden" ? "Oculto" : "Retirado"}
                </option>
              ))}
            </select>
            <FieldError message={errors.status?.message} />
          </div>

          <div className="flex items-center gap-2 pt-6">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="warden-check"
            />
            <label htmlFor="featured" className="text-sm text-muted-foreground">
              Producto destacado
            </label>
          </div>

          <div>
            <FieldLabel htmlFor="price" required>Precio (€)</FieldLabel>
            <Input id="price" type="number" step="0.01" min="0" {...register("price")} />
            <FieldError message={errors.price?.message} />
          </div>
        </div>
      </div>

      {/* ── Section: Content ────────────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Contenido</SectionHeading>
        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="shortDescription" required>Descripción corta</FieldLabel>
            <Textarea id="shortDescription" rows={2} {...register("shortDescription")} />
            <FieldError message={errors.shortDescription?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="description" required>Descripción completa</FieldLabel>
            <Textarea id="description" rows={5} {...register("description")} />
            <FieldError message={errors.description?.message} />
          </div>
        </div>
      </div>

      {/* ── Section: Classification ─────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Clasificación</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <FieldLabel htmlFor="collectionId" required>Colección</FieldLabel>
            <select
              id="collectionId"
              {...register("collectionId")}
              className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Seleccionar...</option>
              {referenceData.collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.collectionId?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="categoryId" required>Categoría</FieldLabel>
            <select
              id="categoryId"
              {...register("categoryId")}
              className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Seleccionar...</option>
              {referenceData.categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.categoryId?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="compatibilityId" required>Compatibilidad</FieldLabel>
            <select
              id="compatibilityId"
              {...register("compatibilityId")}
              className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Seleccionar...</option>
              {referenceData.compatibilitySystems.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <FieldError message={errors.compatibilityId?.message} />
          </div>
        </div>
      </div>

      {/* ── Section: Technical Specs ────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Especificaciones técnicas</SectionHeading>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="scale" required>Escala</FieldLabel>
            <Input id="scale" {...register("scale")} />
            <FieldError message={errors.scale?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="material" required>Material</FieldLabel>
            <Input id="material" {...register("material")} />
            <FieldError message={errors.material?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="height" required>Alto (cm)</FieldLabel>
            <Input id="height" type="number" step="0.1" {...register("height")} />
            <FieldError message={errors.height?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="width" required>Ancho (cm)</FieldLabel>
            <Input id="width" type="number" step="0.1" {...register("width")} />
            <FieldError message={errors.width?.message} />
          </div>
          <div>
            <FieldLabel htmlFor="depth" required>Fondo (cm)</FieldLabel>
            <Input id="depth" type="number" step="0.1" {...register("depth")} />
            <FieldError message={errors.depth?.message} />
          </div>
        </div>
      </div>

      {/* ── Section: Game Features ──────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Características de juego</SectionHeading>
        <p className="mb-3 text-xs text-muted-foreground">
          Una característica por línea.
        </p>
        <Textarea
          id="gameFeatures"
          rows={5}
          {...register("gameFeatures")}
          placeholder="Compatibles con mapas de hexágono estándar&#10;Cuatro formas diferenciadas para identificación táctil"
        />
        <FieldError message={errors.gameFeatures?.message} />
      </div>

      {/* ── Section: Images ─────────────────────── */}
      <div className="rounded-sm border border-border bg-warden-surface p-6">
        <SectionHeading>Imágenes del producto</SectionHeading>
        <ImageUploader
          productId={productId}
          existingImages={images}
          onChange={setImages}
        />
      </div>

      {/* ── Section: Internal Fields ────────────── */}
      <div className="rounded-sm border border-warden-ochre/30 bg-warden-ochre/5 p-6">
        <SectionHeading>Campos internos (no visibles en catálogo público)</SectionHeading>
        <p className="mb-4 text-xs text-warden-ochre">
          Estos campos nunca se renderizan en las páginas públicas del
          catálogo. Solo son accesibles desde el panel de administración.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel htmlFor="internalCode" required>Código interno</FieldLabel>
            <Input id="internalCode" {...register("internalCode")} placeholder="WDN-CORE-001" />
            <FieldError message={errors.internalCode?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="associatedLicenseId">Licencia asociada</FieldLabel>
            <select
              id="associatedLicenseId"
              {...register("associatedLicenseId")}
              className="h-8 w-full rounded-sm border border-input bg-transparent px-2.5 text-sm text-foreground outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="">Ninguna</option>
              {referenceData.licenses.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <FieldLabel htmlFor="weight" required>Peso (g)</FieldLabel>
            <Input id="weight" type="number" step="0.1" {...register("weight")} />
            <FieldError message={errors.weight?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="volume" required>Volumen (cm³)</FieldLabel>
            <Input id="volume" type="number" step="0.1" {...register("volume")} />
            <FieldError message={errors.volume?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="printTime" required>Tiempo de impresión (h)</FieldLabel>
            <Input id="printTime" type="number" step="0.1" {...register("printTime")} />
            <FieldError message={errors.printTime?.message} />
          </div>

          <div>
            <FieldLabel htmlFor="version" required>Versión</FieldLabel>
            <Input id="version" {...register("version")} placeholder="1.0.0" />
            <FieldError message={errors.version?.message} />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="relatedProductIds">Productos relacionados (IDs separados por coma)</FieldLabel>
            <Input
              id="relatedProductIds"
              {...register("relatedProductIds")}
              placeholder="prod-002, prod-004, prod-005"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="relatedBundleIds">Bundles relacionados (IDs separados por coma)</FieldLabel>
            <Input
              id="relatedBundleIds"
              {...register("relatedBundleIds")}
              placeholder="bundle-001"
            />
          </div>

          <div className="sm:col-span-2">
            <FieldLabel htmlFor="relatedDropIds">Drops relacionados (IDs separados por coma)</FieldLabel>
            <Input
              id="relatedDropIds"
              {...register("relatedDropIds")}
              placeholder="drop-001"
            />
          </div>
        </div>
      </div>

      {/* ── Submit ──────────────────────────────── */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/admin/products")}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Guardando...
            </>
          ) : (
            <>
              <Save className="size-4" />
              {mode === "create" ? "Crear producto" : "Guardar cambios"}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
