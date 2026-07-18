"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, Maximize2 } from "lucide-react";
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

/** Cross-browser fullscreen request for a video element */
function requestVideoFullscreen(video: HTMLVideoElement) {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if ((video as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen) {
    (video as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
  }
}

/**
 * CampaignTrailer — Full-screen modal video player with auto-fullscreen.
 *
 * - Dark overlay with centered 16:9 player
 * - When the native <video> starts playing, it auto-requests fullscreen
 * - YouTube/Vimeo iframes use allowFullScreen natively
 * - ESC / click-outside / close button to dismiss
 * - On fullscreen exit, the modal stays visible so the user can resume or close
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // ── Trap focus on open, restore on close ──
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
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

  // ── Auto-fullscreen when native video starts playing ──
  const handleVideoPlay = useCallback(() => {
    if (videoRef.current) {
      requestVideoFullscreen(videoRef.current);
    }
  }, []);

  // ── Manual fullscreen button for the player container ──
  const handleManualFullscreen = useCallback(() => {
    if (videoRef.current) {
      requestVideoFullscreen(videoRef.current);
    }
  }, []);

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
          "relative w-full max-w-[80vw] aspect-video bg-black rounded-sm overflow-hidden shadow-2xl group",
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
          <>
            <video
              ref={videoRef}
              src={videoSrc}
              poster={poster}
              controls
              autoPlay
              playsInline
              onPlay={handleVideoPlay}
              className="absolute inset-0 size-full object-contain bg-black"
              aria-label={title}
            >
              Tu navegador no soporta la reproducción de vídeo.
            </video>

            {/* Fullscreen toggle (visible on hover) */}
            <button
              type="button"
              onClick={handleManualFullscreen}
              aria-label="Pantalla completa"
              className="absolute bottom-4 right-4 z-10 size-9 flex items-center justify-center rounded-sm bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <Maximize2 className="size-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
