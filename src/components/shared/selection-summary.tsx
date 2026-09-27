"use client";

import { cn, formatPriceEUR } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useSelection } from "@/hooks/use-selection";
import { Package } from "lucide-react";

export function SelectionSummary({ className }: { className?: string }) {
  const { items, itemCount } = useSelection();
  const t = useTranslations("selection");

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  return (
    <div
      className={cn(
        "border border-border bg-warden-surface p-4 space-y-3",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <Package className="size-4 text-warden-blue" />
        <span className="text-eyebrow">{t("summaryTitle")}</span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("products")}</span>
        <span className="text-data tabular-nums text-foreground">
          {itemCount}
        </span>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">{t("subtotalEstimate")}</span>
        <span className="text-data tabular-nums text-foreground">
          {formatPriceEUR(subtotal)}
        </span>
      </div>

      <p className="text-[11px] text-muted-foreground/60 leading-relaxed">
        {t("summaryNote")}
      </p>
    </div>
  );
}
