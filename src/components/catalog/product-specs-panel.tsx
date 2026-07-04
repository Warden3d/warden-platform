import type { ProductSpec } from "@/types/warden";

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-2.5 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-foreground/80 text-right">{value}</span>
    </div>
  );
}

export function ProductSpecsPanel({
  specs,
  scale,
  material,
  dimensions,
  categoryName,
  typeName,
}: {
  specs: ProductSpec[];
  scale: string;
  material: string;
  dimensions: { height: number; width: number; depth: number };
  categoryName?: string;
  typeName?: string;
}) {
  return (
    <div className="border border-border bg-warden-surface">
      <dl className="divide-y divide-border">
        {categoryName && <SpecRow label="Categoría" value={categoryName} />}
        {typeName && <SpecRow label="Tipología" value={typeName} />}
        <SpecRow label="Sistema de juego" value={scale} />
        <SpecRow label="Material" value={material} />
        <SpecRow
          label="Dimensiones"
          value={`${dimensions.width} × ${dimensions.depth} × ${dimensions.height} mm`}
        />
        {specs.map((spec) => (
          <SpecRow key={spec.id} label={spec.specKey} value={spec.specValue} />
        ))}
      </dl>
    </div>
  );
}
