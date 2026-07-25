"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight } from "lucide-react";

export function HeroBrand() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col items-center justify-start pt-[18vh] min-h-[80vh] px-6 text-center">
      <Image
        src="/images/logo/wd-logov4.1.png"
        alt="WARDEN"
        width={1034}
        height={154}
        className="w-[80vw] max-w-[840px] min-w-[220px] h-auto md:w-[60vw] lg:w-[45vw]"
        priority
      />
      <p className="mt-14 text-base font-bold tracking-[0.35em] uppercase text-foreground md:text-lg lg:text-2xl">
        {t("heroSlogan")}
      </p>
      <p className="mt-5 max-w-md text-sm text-white/70 leading-relaxed md:text-base">
        {t("heroDescriptor")}
      </p>
      <div className="mt-14">
        <WardenButton href="/catalog" className="text-base md:text-lg lg:text-xl px-8 py-3 md:px-10 md:py-3.5 lg:px-12 lg:py-4">
          {t("exploreCollections")}
          <ChevronRight className="size-4 md:size-5" />
        </WardenButton>
      </div>
    </div>
  );
}
