"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNavLinks } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Menu, X, Package } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="page-container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-foreground tracking-tight"
          >
            <Package className="size-5 text-primary" />
            <span className="text-lg">WARDEN</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
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
                    "px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/selection"
            className={cn(
              "hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium border border-primary/30 text-primary hover:bg-primary/10 transition-colors",
              pathname === "/selection" && "bg-primary/10"
            )}
          >
            Mi Selección
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background">
          <nav className="page-container py-4 flex flex-col gap-1">
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
                    "px-3 py-2.5 text-sm font-medium rounded-md transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/selection"
              onClick={() => setMobileOpen(false)}
              className="mt-2 px-3 py-2.5 text-sm font-medium rounded-md border border-primary/30 text-primary hover:bg-primary/10 transition-colors inline-flex items-center gap-2"
            >
              <Package className="size-4" />
              Mi Selección
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
