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
  categoryName,
  typeName,
}: {
  specs: ProductSpec[];
  categoryName?: string;
  typeName?: string;
}) {
  // Filter specs visible in PDP
  const pdpSpecs = specs.filter((s) => s.visibility.includes("pdp"));

  return (
    <div className="border border-border bg-warden-surface">
      <dl className="divide-y divide-border">
        {categoryName && <SpecRow label="Categoría" value={categoryName} />}
        {typeName && <SpecRow label="Tipología" value={typeName} />}
        {pdpSpecs.map((s) => (
          <SpecRow key={s.id} label={s.label} value={s.value} />
        ))}
      </dl>
    </div>
  );
}