"use client";

import { useRef, useEffect, useState } from "react";

const VIDEO_SRC = "/videos/background.mp4";

export function VideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onCanPlay = () => setLoaded(true);
    const onError = () => setLoaded(false);

    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    video.load();

    return () => {
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
    };
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border min-h-[80vh] flex items-center">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
        poster="/images/products/hex-markers-brass.svg"
      >
        <source src={VIDEO_SRC} type="video/mp4" />
      </video>

      {/* Gradient fallback (shows before video loads + when video fails) */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "opacity-0" : "opacity-100"}`}
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(74, 122, 154, 0.08), transparent 70%),
            radial-gradient(ellipse 60% 40% at 30% 100%, rgba(100, 200, 150, 0.04), transparent 60%),
            radial-gradient(ellipse 50% 30% at 70% 80%, rgba(200, 150, 80, 0.04), transparent 50%),
            linear-gradient(180deg, #0a0e14 0%, #0d1117 50%, #0a0e14 100%)
          `,
        }}
      />

      {/* Dark overlay for text readability */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${loaded ? "bg-warden-carbon/60" : "bg-warden-carbon/80"}`}
      />

      {/* Scan line effect */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
