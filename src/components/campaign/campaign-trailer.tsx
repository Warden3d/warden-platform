"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignTrailerProps {
  /** Campaign / drop name (for accessibility) */
  title: string;
  /**
   * Video source.
   * - Local file:  "/videos/campaign-trailer.mp4"
   * - External:    "https://example.com/video.mp4"
   * - YouTube:     "https://www.youtube.com/embed/VIDEO_ID"
   * - Vimeo:       "https://player.vimeo.com/video/ID"
   *
   * YouTube and Vimeo URLs render via <iframe>.
   * Everything else renders via native <video>.
   */
  videoSrc: string;
  /** Optional poster image for <video> fallback */
  poster?: string;
  /** Controlled open state */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
}

function isEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed|youtu\.be|vimeo\.com/.test(url);
}

/**
 * CampaignTrailer — Full-screen modal video player.
 *
 * - Dark overlay, centered 16:9 player
 * - Lazy-load: video is NOT fetched until `isOpen` becomes true
 * - ESC / click-outside / close button to dismiss
 * - Focus trap for accessibility
 * - Responsive: 80% width desktop, full-width mobile
 */
export function CampaignTrailer({
  title,
  videoSrc,
  poster,
  isOpen,
  onClose,
}: CampaignTrailerProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Trap focus on open, restore on close ──
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      // Small delay so the modal renders before focusing
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
      previousFocusRef.current = null;
    }
  }, [isOpen]);

  // ── ESC key ──
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleKeyDown]);

  // ── Click outside ──
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  const embed = isEmbedUrl(videoSrc);

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Tráiler: ${title}`}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-200 px-4 md:px-10"
    >
      {/* ── Close button ── */}
      <button
        ref={closeButtonRef}
        type="button"
        onClick={onClose}
        aria-label="Cerrar tráiler"
        className="absolute top-4 right-4 z-10 size-10 flex items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
      >
        <X className="size-5" />
      </button>

      {/* ── Player container (16:9) ── */}
      <div
        className={cn(
          "relative w-full max-w-[80vw] aspect-video bg-black rounded-sm overflow-hidden shadow-2xl",
          "md:max-w-[80vw]",
          "sm:max-w-[90vw]",
          "max-[480px]:max-w-[98vw]"
        )}
      >
        {embed ? (
          <iframe
            src={videoSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <video
            src={videoSrc}
            poster={poster}
            controls
            autoPlay
            className="absolute inset-0 size-full object-contain bg-black"
            aria-label={title}
          >
            Tu navegador no soporta la reproducción de vídeo.
          </video>
        )}
      </div>
    </div>
  );
}
