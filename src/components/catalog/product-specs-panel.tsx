import type { ProductSpec } from "@/types/warden";

export function ProductSpecsPanel({
  specs,
  scale,
  material,
  dimensions,
}: {
  specs: ProductSpec[];
  scale: string;
  material: string;
  dimensions: { height: number; width: number; depth: number };
}) {
  return (
    <div className="border border-border bg-warden-surface">
      <div className="px-5 py-3 border-b border-border">
        <h3 className="text-spec-label text-muted-foreground">Technical Data</h3>
      </div>
      <dl className="divide-y divide-border">
        <SpecRow label="Scale" value={scale} />
        <SpecRow label="Material" value={material} />
        <SpecRow
          label="Dimensions"
          value={`${dimensions.width} × ${dimensions.depth} × ${dimensions.height} mm`}
        />
        {specs.map((spec) => (
          <SpecRow key={spec.id} label={spec.specKey} value={spec.specValue} />
        ))}
      </dl>
    </div>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-2.5">
      <dt className="text-spec-label text-muted-foreground shrink-0">
        {label}
      </dt>
      <dd className="text-data text-foreground/80 text-right">{value}</dd>
    </div>
  );
}
