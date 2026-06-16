"use client";

import { useState, useRef, useEffect } from "react";
import { useLocale } from "next-intl";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";

const localeNames: Record<string, string> = {
  en: "English",
  es: "Español",
  de: "Deutsch",
  nl: "Nederlands",
  it: "Italiano",
  zh: "中文",
  ru: "Русский",
  fr: "Français",
  ar: "العربية",
  hi: "हिन्दी",
};

const locales = Object.keys(localeNames);

function setLocaleCookie(locale: string) {
  document.cookie = `warden-locale=${locale};path=/;max-age=31536000;SameSite=Lax`;
}

export function LanguageSwitcher() {
  const currentLocale = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(locale: string) {
    setLocaleCookie(locale);
    setOpen(false);
    window.location.reload();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded-sm"
        aria-label="Change language"
      >
        <Globe className="size-3.5" />
        <span className="hidden sm:inline">{localeNames[currentLocale] || currentLocale}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-warden-carbon border border-border rounded-sm shadow-lg z-50 py-1">
          {locales.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => switchLocale(loc)}
              className={cn(
                "w-full text-left px-3 py-1.5 text-xs transition-colors",
                loc === currentLocale
                  ? "text-warden-blue bg-warden-blue/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-warden-elevated"
              )}
            >
              {localeNames[loc]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
