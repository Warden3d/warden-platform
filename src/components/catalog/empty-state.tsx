"use client";

import { useTranslations } from "next-intl";
import { Package } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Package,
}: {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  const t = useTranslations("common");
  const resolvedTitle = title ?? t("emptyResultsTitle");
  const resolvedDescription = description ?? t("emptyResultsDesc");

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 border border-border bg-warden-surface/50">
      <Icon className="size-12 text-muted-foreground/40 mb-5" />
      <h3 className="text-lg font-semibold text-foreground">{resolvedTitle}</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-sm text-center leading-relaxed">
        {resolvedDescription}
      </p>
    </div>
  );
}
