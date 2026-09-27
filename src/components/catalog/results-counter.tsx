"use client";

import { useTranslations } from "next-intl";

export function ResultsCounter({
  total,
  filtered,
}: {
  total: number;
  filtered: number;
}) {
  const t = useTranslations("catalog");

  if (total === filtered) {
    return (
      <p className="text-sm text-muted-foreground">
        <span className="text-data text-foreground/80">{total}</span>{" "}
        {t("resultsProductCount", { count: total })}
      </p>
    );
  }

  return (
    <p className="text-sm text-muted-foreground">
      <span className="text-data text-foreground/80">{filtered}</span>{" "}
      {t("resultsOf")}{" "}
      <span className="text-data text-foreground/80">{total}</span>{" "}
      {t("resultsProductCount", { count: total })}
    </p>
  );
}
