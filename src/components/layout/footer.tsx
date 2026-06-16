import Link from "next/link";
import { footerNavLinks } from "@/data/navigation";
import { Container } from "@/components/shared/container";
import { Package } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <Container>
        <div className="py-12 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-foreground mb-3"
            >
              <Package className="size-4 text-primary" />
              <span>WARDEN</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              Precision equipment designed to enhance the BattleTech Classic,
              Alpha Strike, and AeroTech tabletop gaming experience.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Productos
            </h4>
            <ul className="space-y-2">
              {footerNavLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Soporte
            </h4>
            <ul className="space-y-2">
              {footerNavLinks.support.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Legal
            </h4>
            <ul className="space-y-2">
              {footerNavLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="py-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WARDEN. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built for the BattleTech community. Not affiliated with Topps or
            Catalyst Game Labs.
          </p>
        </div>
      </Container>
    </footer>
  );
}
