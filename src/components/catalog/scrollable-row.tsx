"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollableRowProps {
  children: React.ReactNode;
  className?: string;
}

export function ScrollableRow({ children, className }: ScrollableRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollAmount = container.clientWidth * 0.6;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={cn("relative group", className)}>
      {/* Left button */}
      <button
        type="button"
        onClick={() => scroll("left")}
        className="absolute left-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-r from-warden-carbon/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
        aria-label="Desplazar a la izquierda"
      >
        <ChevronLeft className="size-5 text-muted-foreground" />
      </button>

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2"
      >
        {children}
      </div>

      {/* Right button */}
      <button
        type="button"
        onClick={() => scroll("right")}
        className="absolute right-0 top-0 bottom-0 z-10 w-10 flex items-center justify-center bg-gradient-to-l from-warden-carbon/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
        aria-label="Desplazar a la derecha"
      >
        <ChevronRight className="size-5 text-muted-foreground" />
      </button>
    </div>
  );
}
