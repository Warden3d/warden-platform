"use client";

import { useCallback, useRef, useEffect } from "react";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  valueMin: number | null;
  valueMax: number | null;
  onChange: (min: number | null, max: number | null) => void;
  formatPrice: (v: number) => string;
}

export function PriceRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onChange,
  formatPrice,
}: PriceRangeSliderProps) {
  const curMin = valueMin ?? min;
  const curMax = valueMax ?? max;
  const range = max - min || 1;
  const trackRef = useRef<HTMLDivElement>(null);

  // Background highlight between the two thumbs
  const leftPct = ((curMin - min) / range) * 100;
  const rightPct = ((max - curMax) / range) * 100;

  const handleMin = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.min(Number(e.target.value), curMax);
      onChange(v, valueMax);
    },
    [curMax, valueMax, onChange]
  );

  const handleMax = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Math.max(Number(e.target.value), curMin);
      onChange(valueMin, v);
    },
    [curMin, valueMin, onChange]
  );

  return (
    <div className="pt-1 pb-2">
      {/* Track + thumbs */}
      <div className="relative h-6" ref={trackRef}>
        {/* Background track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 rounded-full bg-border" />
        {/* Highlighted range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 rounded-full bg-warden-blue/40"
          style={{ left: `${leftPct}%`, right: `${rightPct}%` }}
        />
        {/* Min thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={curMin}
          onChange={handleMin}
          aria-label="Precio mínimo"
          className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warden-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-warden-carbon [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-md [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-warden-blue/50 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warden-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-warden-carbon [&::-moz-range-thumb]:cursor-pointer"
        />
        {/* Max thumb */}
        <input
          type="range"
          min={min}
          max={max}
          step={0.01}
          value={curMax}
          onChange={handleMax}
          aria-label="Precio máximo"
          className="absolute inset-0 w-full h-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-warden-blue [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-warden-carbon [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-md [&::-webkit-slider-thumb]:focus-visible:ring-2 [&::-webkit-slider-thumb]:focus-visible:ring-warden-blue/50 [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-warden-blue [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-warden-carbon [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground/70">
        <span>{formatPrice(curMin)}</span>
        <span className="text-muted-foreground/40">—</span>
        <span>{formatPrice(curMax)}</span>
      </div>
    </div>
  );
}
