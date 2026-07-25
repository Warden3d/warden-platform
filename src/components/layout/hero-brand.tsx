"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { WardenButton } from "@/components/ui/warden-button";
import { ChevronRight } from "lucide-react";

export function HeroBrand() {
  const t = useTranslations("home");

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <Image
        src="/images/logo/wd-logov4.1.png"
        alt="WARDEN"
        width={1034}
        height={154}
        className="w-[50vw] max-w-[540px] min-w-[200px] h-auto md:w-[45vw] lg:w-[42vw]"
        priority
      />
      <p className="mt-10 text-sm font-semibold tracking-[0.3em] uppercase text-foreground/90 md:text-base lg:text-lg">
        {t("heroSlogan")}
      </p>
      <div className="mt-10">
        <WardenButton href="/catalog" className="text-sm md:text-base px-6 py-2.5 md:px-8 md:py-3">
          {t("exploreCollections")}
          <ChevronRight className="size-4" />
        </WardenButton>
      </div>
    </div>
  );
}
