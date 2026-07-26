"use client";

import { useRef, useEffect } from "react";

export function VideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.75;
    }
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-border min-h-[80vh]">
      {/* Video background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 size-full object-cover object-center"
        poster="/images/hero/fondo-home.png"
      >
        <source src="/videos/battletech_bg_final.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — uniform for centered brand composition */}
      <div className="absolute inset-0 bg-warden-carbon/70" />

      {/* Radial blue atmosphere — localized behind central content */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 38%, rgba(15,35,75,0.35) 0%, rgba(12,28,60,0.18) 30%, rgba(8,20,45,0.06) 55%, transparent 75%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
