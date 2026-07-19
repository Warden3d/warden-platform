import Image from "next/image";

export function VideoHero({ children }: { children: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-border min-h-[80vh]">
      {/* Background image — shifted right to increase negative space on the left */}
      <Image
        src="/images/hero/fondo-home.png"
        alt=""
        fill
        className="absolute inset-0 size-full object-cover object-[80%_center]"
        sizes="100vw"
        priority
      />

      {/* Dark gradient overlay — heavier on the left for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-warden-carbon/90 via-warden-carbon/50 to-transparent" />

      {/* Content */}
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}
