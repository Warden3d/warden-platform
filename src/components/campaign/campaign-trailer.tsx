"use client";

import { useEffect, useRef, useCallback } from "react";
import { X, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignTrailerProps {
  title: string;
  videoSrc: string;
  poster?: string;
  isOpen: boolean;
  onClose: () => void;
}

function isEmbedUrl(url: string): boolean {
  return /youtube\.com\/embed|youtu\.be|vimeo\.com/.test(url);
}

/** Cross-browser fullscreen request for a video element */
function requestVideoFullscreen(video: HTMLVideoElement) {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (
    (video as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen
  ) {
    (video as unknown as { webkitRequestFullscreen: () => void }).webkitRequestFullscreen();
  }
}

/**
 * CampaignTrailer — Full-screen, fully opaque video player overlay.
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
  const scrollYRef = useRef(0);
  const wasFullscreenRef = useRef(false);
  const intentionalCloseRef = useRef(false);

  // ── Scroll lock + position preservation ──
  useEffect(() => {
    if (isOpen) {
      scrollYRef.current = window.scrollY;
      const scrollY = scrollYRef.current;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [isOpen]);

  // ── Stop video when closing ──
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

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
      if (e.key === "Escape") {
        // If currently in native fullscreen, exit fullscreen first.
        // The fullscreenchange handler will NOT call onClose — only ESC does.
        if (document.fullscreenElement && videoRef.current) {
          document.exitFullscreen?.();
          wasFullscreenRef.current = true;
          return;
        }
        intentionalCloseRef.current = true;
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  // ── Handle browser fullscreen exit (ESC from fullscreen) ──
  useEffect(() => {
    if (!isOpen) return;

    const handleFSChange = () => {
      if (!document.fullscreenElement && wasFullscreenRef.current) {
        // User exited fullscreen via browser UI or ESC
        wasFullscreenRef.current = false;
        // Don't close the modal — just let them watch in the player
      }
    };

    document.addEventListener("fullscreenchange", handleFSChange);
    return () => document.removeEventListener("fullscreenchange", handleFSChange);
  }, [isOpen]);

  // ── Click outside ──
  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) {
        intentionalCloseRef.current = true;
        onClose();
      }
    },
    [onClose]
  );

  // ── Auto-fullscreen when native video starts playing ──
  const handleVideoPlay = useCallback(() => {
    if (videoRef.current) {
      requestVideoFullscreen(videoRef.current);
    }
  }, []);

  // ── Manual fullscreen ──
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
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black"
    >
      {/* ── Player container — full viewport on mobile, centered on desktop ── */}
      <div
        className={cn(
          "relative w-full h-full",
          "md:max-w-[80vw] md:max-h-[85vh] md:flex md:flex-col md:items-center md:justify-center"
        )}
      >
        {/* ── Close button ── */}
        <button
          ref={closeButtonRef}
          type="button"
          onClick={() => {
            intentionalCloseRef.current = true;
            onClose();
          }}
          aria-label="Cerrar tráiler"
          className="absolute top-3 right-3 z-20 size-10 flex items-center justify-center rounded-full bg-black/40 text-white/70 hover:bg-white/20 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
        >
          <X className="size-5" />
        </button>

        {/* ── Video frame ── */}
        <div className="relative size-full md:rounded-sm md:shadow-2xl md:aspect-video md:h-auto overflow-hidden bg-black group">
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

              {/* Fullscreen toggle */}
              <button
                type="button"
                onClick={handleManualFullscreen}
                aria-label="Pantalla completa"
                className="absolute bottom-3 right-3 z-10 size-9 flex items-center justify-center rounded-sm bg-black/50 text-white/70 hover:bg-black/70 hover:text-white transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
              >
                <Maximize2 className="size-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
