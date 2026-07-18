"use client";

import { useState, useEffect, useRef } from "react";

const SCROLL_THRESHOLD = 50;
const DIRECTION_THRESHOLD = 10;

/**
 * useHideOnScrollDown — Returns whether the header should be visible.
 *
 * - Desktop (>= 1024px): always visible.
 * - Mobile: hides on scroll down past `SCROLL_THRESHOLD`, shows on scroll up.
 * - Small scroll movements (< `DIRECTION_THRESHOLD`px) are ignored to prevent flicker.
 */
export function useHideOnScrollDown(): boolean {
  const [visible, setVisible] = useState(true);
  const lastScrollRef = useRef(0);
  const tickingRef = useRef(false);

  useEffect(() => {
    const isDesktop = () => window.innerWidth >= 1024;

    const handleScroll = () => {
      if (isDesktop()) {
        setVisible(true);
        return;
      }

      const currentScroll = window.scrollY;
      const diff = currentScroll - lastScrollRef.current;
      lastScrollRef.current = currentScroll;

      // Ignore tiny movements to avoid flicker
      if (Math.abs(diff) < DIRECTION_THRESHOLD) return;

      if (diff > 0 && currentScroll > SCROLL_THRESHOLD) {
        setVisible(false);
      } else if (diff < 0) {
        setVisible(true);
      }
    };

    const onScroll = () => {
      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          handleScroll();
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible;
}
