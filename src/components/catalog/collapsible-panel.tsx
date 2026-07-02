"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsiblePanelProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function CollapsiblePanel({
  title,
  children,
  defaultOpen = false,
  className,
  icon: Icon,
}: CollapsiblePanelProps) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={cn("border border-border rounded-sm", className)}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between px-4 py-3 text-left text-spec-label text-muted-foreground hover:text-foreground hover:bg-warden-elevated transition-colors uppercase tracking-wider text-xs"
        aria-expanded={open}
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="size-3.5 shrink-0" />}
          <span>{title}</span>
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform duration-200",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
}
