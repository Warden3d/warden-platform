"use client";

import { useState } from "react";
import { StatusBadge } from "@/components/admin/status-badge";
import { PRODUCT_STATUSES, type ProductStatus } from "@/types/warden";
import { setProductStatus } from "@/lib/actions/admin-products";

interface Props {
  productId: string;
  currentStatus: ProductStatus;
}

export function ProductStatusSwitcher({ productId, currentStatus }: Props) {
  const [status, setStatus] = useState<ProductStatus>(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: ProductStatus) {
    if (newStatus === status) return;
    setLoading(true);
    const result = await setProductStatus(productId, newStatus);
    if (result) setStatus(result.status);
    setLoading(false);
  }

  return (
    <div className="flex items-center gap-1.5">
      <StatusBadge status={status} />
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as ProductStatus)}
        disabled={loading}
        className="h-6 rounded border border-border bg-transparent px-1 text-[11px] text-muted-foreground outline-none focus:border-ring disabled:opacity-50"
      >
        {PRODUCT_STATUSES.map((s) => (
          <option key={s} value={s}>
            {s === "active" ? "Activo" : s === "hidden" ? "Oculto" : "Retirado"}
          </option>
        ))}
      </select>
    </div>
  );
}
