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

      {/* Dark gradient overlay — heavier on the left for text readability */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            "linear-gradient(to right, rgba(10,14,20,0.92) 0%, rgba(10,14,20,0.78) 28%, rgba(10,14,20,0.40) 45%, rgba(10,14,20,0.10) 65%, transparent 80%)",
        }}
      />
      {/* Mobile: heavier overlay */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "linear-gradient(to right, rgba(10,14,20,0.95) 0%, rgba(10,14,20,0.75) 40%, rgba(10,14,20,0.35) 70%, transparent 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
