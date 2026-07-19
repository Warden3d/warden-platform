"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Container } from "@/components/shared/container";

interface GalleryImage {
  url: string;
  alt: string;
}

interface CampaignGalleryProps {
  eyebrow?: string;
  title?: string;
  images: GalleryImage[];
  className?: string;
  muted?: boolean;
}

/**
 * CampaignGallery — Premium campaign image gallery.
 *
 * Features:
 * - Hero image (first image, full-width prominent)
 * - Supporting images in a responsive grid
 * - Lightbox viewer with keyboard + touch navigation
 * - Thumbnails strip (shown when > 4 images)
 * - Lazy loading + responsive sizes
 * - Fully accessible
 */
export function CampaignGallery({
  eyebrow,
  title,
  images,
  className,
  muted,
}: CampaignGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Open lightbox ──
  const openLightbox = useCallback((index: number) => {
    previousFocusRef.current = document.activeElement as HTMLElement;
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  // ── Close lightbox ──
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  // ── Navigation ──
  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % images.length) + images.length) % images.length);
    },
    [images.length]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [goTo, activeIndex]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [goTo, activeIndex]);

  // ── Focus trap on open / restore on close ──
  useEffect(() => {
    if (lightboxOpen) {
      requestAnimationFrame(() => closeButtonRef.current?.focus());
      document.body.style.overflow = "hidden";
    } else if (previousFocusRef.current) {
      document.body.style.overflow = "";
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [lightboxOpen]);

  // ── Keyboard navigation ──
  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeLightbox();
          break;
        case "ArrowRight":
          goNext();
          break;
        case "ArrowLeft":
          goPrev();
          break;
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox, goNext, goPrev]);

  // ── Touch swipe ──
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const diff = e.changedTouches[0].clientX - touchStart;
      const threshold = 50;
      if (diff > threshold) goPrev();
      else if (diff < -threshold) goNext();
      setTouchStart(null);
    },
    [touchStart, goNext, goPrev]
  );

  // ── Click outside lightbox ──
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === lightboxRef.current) closeLightbox();
    },
    [closeLightbox]
  );

  if (images.length === 0) return null;

  const showThumbnails = images.length > 4;

  const hero = images[0];
  const supporting = images.slice(1);

  return (
    <>
      <section className={cn("py-14 md:py-20", muted && "bg-warden-surface/30", className)}>
        <Container>
          {(eyebrow || title) && (
            <div className="max-w-3xl mb-8">
              {eyebrow && (
                <p className="text-[11px] font-medium uppercase tracking-widest text-warden-ochre/70 mb-3">
                  {eyebrow}
                </p>
              )}
              {title && (
                <h2
                  className={cn(
                    "text-2xl font-semibold tracking-tight sm:text-3xl leading-tight",
                    muted ? "text-muted-foreground/80" : "text-foreground"
                  )}
                >
                  {title}
                </h2>
              )}
            </div>
          )}

          {/* ── Hero image ── */}
          <button
            type="button"
            onClick={() => openLightbox(0)}
            className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden border border-border bg-warden-carbon mb-4 group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
            aria-label={`${hero.alt} — Ampliar imagen`}
          >
            <Image
              src={hero.url}
              alt={hero.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="100vw"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
          </button>

          {/* ── Supporting grid ── */}
          {supporting.length > 0 && (
            <div
              className={cn(
                "grid gap-3",
                supporting.length === 1 && "grid-cols-1",
                supporting.length === 2 && "grid-cols-2",
                supporting.length >= 3 && "grid-cols-2 md:grid-cols-3",
                supporting.length >= 4 && "lg:grid-cols-4"
              )}
            >
              {supporting.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => openLightbox(idx + 1)}
                  className="relative aspect-square overflow-hidden border border-border bg-warden-carbon group cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warden-blue/50"
                  aria-label={`${img.alt} — Ampliar imagen`}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes={
                      supporting.length <= 2
                        ? "50vw"
                        : supporting.length <= 3
                          ? "(max-width: 768px) 50vw, 33vw"
                          : "(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    }
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* ── LIGHTBOX ── */}
      {lightboxOpen && (
        <div
          ref={lightboxRef}
          role="dialog"
          aria-modal="true"
          aria-label={`Galería: ${images[activeIndex]?.alt}`}
          onClick={handleOverlayClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className={cn(
            "fixed inset-0 z-[100] flex flex-col bg-black/95",
            "animate-in fade-in duration-200"
          )}
        >
          {/* ── Close button ── */}
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeLightbox}
            aria-label="Cerrar galería"
            className="absolute top-4 right-4 z-20 size-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
          >
            <X className="size-5" />
          </button>

          {/* ── Counter ── */}
          <div className="absolute top-4 left-4 z-20 text-xs text-white/50 font-mono tabular-nums">
            {activeIndex + 1} / {images.length}
          </div>

          {/* ── Image area ── */}
          <div className="flex-1 relative flex items-center justify-center px-4 md:px-12">
            {/* Previous */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={goPrev}
                aria-label="Imagen anterior"
                className="absolute left-2 md:left-4 z-10 size-10 md:size-12 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronLeft className="size-5 md:size-6" />
              </button>
            )}

            {/* Image */}
            <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center">
              <Image
                src={images[activeIndex].url}
                alt={images[activeIndex].alt}
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            </div>

            {/* Next */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={goNext}
                aria-label="Imagen siguiente"
                className="absolute right-2 md:right-4 z-10 size-10 md:size-12 flex items-center justify-center rounded-full bg-white/5 text-white/60 hover:bg-white/15 hover:text-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <ChevronRight className="size-5 md:size-6" />
              </button>
            )}
          </div>

          {/* ── Thumbnails strip ── */}
          {showThumbnails && (
            <div className="h-20 md:h-24 border-t border-white/10 flex items-center justify-center gap-2 px-4 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Ir a imagen ${idx + 1}: ${img.alt}`}
                  className={cn(
                    "relative shrink-0 size-12 md:size-16 overflow-hidden border-2 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50",
                    idx === activeIndex
                      ? "border-white opacity-100"
                      : "border-transparent opacity-50 hover:opacity-80"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="64px"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
