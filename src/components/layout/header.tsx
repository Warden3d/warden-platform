"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Menu, X, Minus } from "lucide-react";
import { useState } from "react";
import { useSelection } from "@/hooks/use-selection";
import { mainNavLinks } from "@/data/navigation";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useSelection();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-warden-carbon/95 backdrop-blur supports-[backdrop-filter]:bg-warden-carbon/85">
      <div className="page-container flex h-14 items-center justify-between">
        {/* Logo + brand mark */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="block h-4 w-0.5 bg-warden-blue" />
            <span className="block h-4 w-0.5 bg-warden-green" />
            <span className="block h-4 w-0.5 bg-warden-ochre" />
          </div>
          <span className="text-sm font-semibold tracking-[0.15em] uppercase text-foreground">
            WARDEN
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Navegación principal">
          {mainNavLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-colors",
                  isActive
                    ? "text-warden-blue bg-warden-blue/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-warden-elevated"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/selection"
            className={cn(
              "hidden sm:inline-flex items-center gap-2 px-4 py-1.5 rounded-sm text-xs font-medium tracking-wider uppercase border transition-colors relative",
              pathname === "/selection"
                ? "border-warden-blue/40 text-warden-blue bg-warden-blue/5"
                : "border-border text-muted-foreground hover:border-warden-blue/30 hover:text-foreground"
            )}
            aria-label="Mi Selección"
          >
            Mi Selección
            <Minus className="size-2.5 rotate-90" />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 inline-flex items-center justify-center size-4 rounded-full bg-warden-blue text-[10px] font-semibold text-warden-carbon leading-none">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden flex items-center justify-center size-9 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            type="button"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-border bg-warden-carbon">
          <nav className="page-container py-4 flex flex-col gap-1" aria-label="Navegación móvil">
            {mainNavLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "px-3 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm transition-colors",
                    isActive
                      ? "text-warden-blue bg-warden-blue/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-warden-elevated"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/selection"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-3 py-2.5 text-xs font-medium tracking-wider uppercase rounded-sm border border-warden-blue/30 text-warden-blue hover:bg-warden-blue/5 transition-colors inline-flex items-center gap-2 relative"
            >
              Mi Selección
              <Minus className="size-2.5 rotate-90" />
              {itemCount > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center size-4 rounded-full bg-warden-blue text-[10px] font-semibold text-warden-carbon leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
