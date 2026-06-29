"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExpandableTextProps {
  text: string;
  maxLines?: number;
  className?: string;
}

export function ExpandableText({
  text,
  maxLines = 4,
  className,
}: ExpandableTextProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={className}>
      <p
        className={cn(
          "text-sm text-foreground/80 leading-relaxed whitespace-pre-line transition-all duration-200",
          !expanded && `line-clamp-${maxLines}`
        )}
      >
        {text}
      </p>
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="mt-2 inline-flex items-center gap-1 text-xs text-warden-blue hover:text-warden-blue/80 transition-colors uppercase tracking-wider font-medium"
      >
        {expanded ? "Mostrar menos" : "Leer más"}
        <ChevronDown
          className={cn(
            "size-3 transition-transform duration-200",
            expanded && "rotate-180"
          )}
        />
      </button>
    </div>
  );
}
