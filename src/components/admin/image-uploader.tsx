"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IMAGE_VIEW_TYPES,
  IMAGE_VIEW_LABELS,
  type ImageViewType,
  type ProductImage,
} from "@/types/warden";
import { uploadImageFile } from "@/lib/actions/upload-image";
import {
  Upload,
  X,
  Star,
  GripVertical,
  ImageIcon,
} from "lucide-react";

type PendingImage = {
  id: string;
  file: File;
  preview: string;
  alt: string;
  isPrimary: boolean;
  sortOrder: number;
  viewType: ImageViewType;
};

type ExistingImage = ProductImage & {
  _keep: boolean;
  _changed: boolean;
};

export type ImageUploaderProps = {
  productId?: string;
  existingImages: ProductImage[];
  onChange: (images: ProductImage[]) => void;
};

let idCounter = 0;
function genTempId(): string {
  return `temp-${++idCounter}-${Date.now()}`;
}

export function ImageUploader({
  productId,
  existingImages,
  onChange,
}: ImageUploaderProps) {
  const [existing, setExisting] = useState<ExistingImage[]>(() =>
    existingImages.map((img) => ({ ...img, _keep: true, _changed: false }))
  );
  const [pending, setPending] = useState<PendingImage[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allItems = [
    ...existing
      .filter((e) => e._keep)
      .map((e) => ({ type: "existing" as const, data: e })),
    ...pending.map((p) => ({ type: "pending" as const, data: p })),
  ].sort((a, b) => {
    const aOrder =
      a.type === "existing"
        ? a.data.sortOrder
        : a.data.sortOrder;
    const bOrder =
      b.type === "existing"
        ? b.data.sortOrder
        : b.data.sortOrder;
    return aOrder - bOrder;
  });

  function emit() {
    const kept: ProductImage[] = existing
      .filter((e) => e._keep)
      .map((e) => ({
        id: e.id,
        productId: e.productId,
        url: e.url,
        alt: e.alt,
        isPrimary: e.isPrimary,
        sortOrder: e.sortOrder,
        viewType: e.viewType,
      }));
    const newOnes = pending.map((p) => ({
      id: p.id,
      productId: productId ?? "",
      url: p.preview,
      alt: p.alt,
      isPrimary: p.isPrimary,
      sortOrder: p.sortOrder,
      viewType: p.viewType,
    }));
    onChange([...kept, ...newOnes]);
  }

  function addFiles(files: FileList | File[]) {
    const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const startOrder =
      allItems.length > 0
        ? Math.max(...allItems.map((i) =>
            i.type === "existing" ? i.data.sortOrder : i.data.sortOrder
          )) + 1
        : 1;
    const newPending: PendingImage[] = arr.map((file, i) => ({
      id: genTempId(),
      file,
      preview: URL.createObjectURL(file),
      alt: "",
      isPrimary: allItems.length === 0 && i === 0,
      sortOrder: startOrder + i,
      viewType: i === 0 ? "main" : "other",
    }));
    setPending((prev) => [...prev, ...newPending]);

    // Upload files in background if we have a productId (edit mode)
    if (productId) {
      const uploadPromises = newPending.map(async (p) => {
        const fd = new FormData();
        fd.append("file", p.file);
        fd.append("productId", productId);
        fd.append("index", String(p.sortOrder));
        try {
          const result = await uploadImageFile(fd);
          if (result) {
            setPending((prev) =>
              prev.map((item) =>
                item.id === p.id
                  ? { ...item, preview: result.url }
                  : item
              )
            );
          }
        } catch (err) {
          console.error("Upload failed for", p.file.name, err);
        }
      });

      Promise.allSettled(uploadPromises).then(() => emit());
    } else {
      // Create mode: no productId yet, emit with blob URLs
      // Files will be uploaded by the server action after product creation
      emit();
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  }

  function removeExisting(id: string) {
    setExisting((prev) =>
      prev.map((e) => (e.id === id ? { ...e, _keep: false, _changed: true } : e))
    );
    setTimeout(() => emit(), 0);
  }

  function removePending(id: string) {
    setPending((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((p) => p.id !== id);
    });
    setTimeout(() => emit(), 0);
  }

  function setPrimary(id: string, isExisting: boolean) {
    if (isExisting) {
      setExisting((prev) =>
        prev.map((e) => ({
          ...e,
          isPrimary: e.id === id && e._keep,
          _changed: e.id === id || e.isPrimary,
        }))
      );
    } else {
      setPending((prev) =>
        prev.map((p) => ({
          ...p,
          isPrimary: p.id === id,
        }))
      );
    }
    setTimeout(() => emit(), 0);
  }

  function changeViewType(
    id: string,
    viewType: ImageViewType,
    isExisting: boolean
  ) {
    if (isExisting) {
      setExisting((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, viewType, _changed: true } : e
        )
      );
    } else {
      setPending((prev) =>
        prev.map((p) => (p.id === id ? { ...p, viewType } : p))
      );
    }
    setTimeout(() => emit(), 0);
  }

  function changeAlt(id: string, alt: string, isExisting: boolean) {
    if (isExisting) {
      setExisting((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, alt, _changed: true } : e
        )
      );
    } else {
      setPending((prev) =>
        prev.map((p) => (p.id === id ? { ...p, alt } : p))
      );
    }
    setTimeout(() => emit(), 0);
  }

  function moveItem(id: string, direction: -1 | 1, isExisting: boolean) {
    if (isExisting) {
      setExisting((prev) => {
        const item = prev.find((e) => e.id === id && e._keep);
        if (!item) return prev;
        const sorted = prev
          .filter((e) => e._keep)
          .sort((a, b) => a.sortOrder - b.sortOrder);
        const idx = sorted.findIndex((e) => e.id === id);
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= sorted.length) return prev;
        const updated = [...prev];
        const target = sorted[newIdx];
        const currentOrder = item.sortOrder;
        const targetOrder = target.sortOrder;
        updated.forEach((e) => {
          if (e.id === id) e.sortOrder = targetOrder;
          if (e.id === target.id) e.sortOrder = currentOrder;
        });
        return updated;
      });
    } else {
      setPending((prev) => {
        const sorted = [...prev].sort((a, b) => a.sortOrder - b.sortOrder);
        const idx = sorted.findIndex((p) => p.id === id);
        const newIdx = idx + direction;
        if (newIdx < 0 || newIdx >= sorted.length) return prev;
        const target = sorted[newIdx];
        const currentOrder = sorted[idx].sortOrder;
        const targetOrder = target.sortOrder;
        return prev.map((p) => {
          if (p.id === id) return { ...p, sortOrder: targetOrder };
          if (p.id === target.id) return { ...p, sortOrder: currentOrder };
          return p;
        });
      });
    }
    setTimeout(() => emit(), 0);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Arrastra imágenes o haz clic para subir. Primera imagen = principal.
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="size-3.5" />
          <span className="ml-1.5 text-xs">Subir imagen</span>
        </Button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) addFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed rounded-sm p-6 transition-colors",
          dragOver
            ? "border-warden-blue bg-warden-blue/5"
            : allItems.length === 0
              ? "border-border bg-warden-carbon/30"
              : "border-border bg-transparent"
        )}
      >
        {allItems.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-8">
            <ImageIcon className="size-10 text-muted-foreground/25" />
            <p className="text-xs text-muted-foreground/50 text-center max-w-[240px]">
              Suelta imágenes aquí o haz clic en &quot;Subir imagen&quot; para
              añadir la primera imagen del producto.
            </p>
          </div>
        ) : (
          <div className="grid gap-2">
            {allItems.map((item, idx) => {
              const isFirst = idx === 0;
              const img =
                item.type === "existing" ? item.data : item.data;
              const isPrimary =
                item.type === "existing"
                  ? item.data.isPrimary
                  : item.data.isPrimary;

              return (
                <div
                  key={img.id}
                  className={cn(
                    "flex items-start gap-3 rounded-sm border p-3 transition-colors",
                    isPrimary
                      ? "border-warden-blue/30 bg-warden-blue/[0.04]"
                      : "border-border bg-warden-surface"
                  )}
                >
                  {/* Thumbnail */}
                  <div className="size-20 shrink-0 border border-border rounded overflow-hidden bg-warden-carbon">
                    <Image
                      src={
                        item.type === "existing"
                          ? item.data.url
                          : item.data.preview
                      }
                      alt={img.alt || "Preview"}
                      width={80}
                      height={80}
                      className="size-full object-cover"
                      unoptimized={
                        item.type === "pending" ||
                        !process.env.NEXT_PUBLIC_SUPABASE_URL
                      }
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex-1 min-w-0 space-y-1.5">
                    {/* Alt text */}
                    <input
                      type="text"
                      placeholder="Texto alternativo (alt)"
                      value={img.alt}
                      onChange={(e) =>
                        changeAlt(
                          img.id,
                          e.target.value,
                          item.type === "existing"
                        )
                      }
                      className="w-full h-7 rounded border border-input bg-transparent px-2 text-xs text-foreground outline-none focus-visible:border-ring"
                    />

                    <div className="flex items-center gap-2 flex-wrap">
                      {/* View type */}
                      <select
                        value={img.viewType}
                        onChange={(e) =>
                          changeViewType(
                            img.id,
                            e.target.value as ImageViewType,
                            item.type === "existing"
                          )
                        }
                        className="h-7 rounded border border-input bg-transparent px-1.5 text-xs text-foreground outline-none focus-visible:border-ring"
                      >
                        {IMAGE_VIEW_TYPES.map((vt) => (
                          <option key={vt} value={vt}>
                            {IMAGE_VIEW_LABELS[vt]}
                          </option>
                        ))}
                      </select>

                      {/* Primary toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setPrimary(
                            img.id,
                            item.type === "existing"
                          )
                        }
                        className={cn(
                          "inline-flex items-center gap-1 h-7 px-2 rounded border text-xs transition-colors",
                          isPrimary
                            ? "border-warden-blue/30 bg-warden-blue/10 text-warden-blue"
                            : "border-border text-muted-foreground hover:text-foreground"
                        )}
                        title="Marcar como imagen principal"
                      >
                        <Star
                          className={cn(
                            "size-3",
                            isPrimary && "fill-warden-blue text-warden-blue"
                          )}
                        />
                        {isPrimary ? "Principal" : "Principal"}
                      </button>

                      {/* Reorder */}
                      <div className="flex items-center gap-px">
                        <button
                          type="button"
                          onClick={() =>
                            moveItem(
                              img.id,
                              -1,
                              item.type === "existing"
                            )
                          }
                          disabled={isFirst}
                          className="size-6 inline-flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title="Mover arriba"
                        >
                          <GripVertical className="size-3 rotate-90" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            moveItem(
                              img.id,
                              1,
                              item.type === "existing"
                            )
                          }
                          disabled={idx === allItems.length - 1}
                          className="size-6 inline-flex items-center justify-center rounded border border-border text-muted-foreground hover:text-foreground disabled:opacity-30"
                          title="Mover abajo"
                        >
                          <GripVertical className="size-3 -rotate-90" />
                        </button>
                      </div>
                    </div>

                    {/* File name for pending */}
                    {item.type === "pending" && (
                      <p className="text-[10px] text-muted-foreground/50 truncate">
                        {item.data.file.name} ({(item.data.file.size / 1024).toFixed(0)} KB)
                      </p>
                    )}
                  </div>

                  {/* Delete */}
                  <button
                    type="button"
                    onClick={() =>
                      item.type === "existing"
                        ? removeExisting(img.id)
                        : removePending(img.id)
                    }
                    className="size-6 shrink-0 inline-flex items-center justify-center rounded text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-colors"
                    title="Eliminar imagen"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="text-[10px] text-muted-foreground/50">
        {allItems.length} imagen{allItems.length !== 1 ? "es" : ""} · Las
        imágenes se suben al guardar el producto.
      </p>
    </div>
  );
}
