"use client";

import { useRef } from "react";

export function VideoHero({ children }: { children: React.ReactNode }) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay — uniform for centered brand composition */}
      <div className="absolute inset-0 bg-warden-carbon/60" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
