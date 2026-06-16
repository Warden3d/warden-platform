import Link from "next/link";
import { Container } from "@/components/shared/container";
import { footerNavLinks } from "@/data/navigation";

export function Footer() {
  return (
    <footer className="border-t border-border bg-warden-surface">
      <Container>
        <div className="py-14 grid grid-cols-2 gap-10 md:grid-cols-4">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="flex items-center gap-1">
                <span className="block h-3 w-0.5 bg-warden-blue" />
                <span className="block h-3 w-0.5 bg-warden-green" />
                <span className="block h-3 w-0.5 bg-warden-ochre" />
              </div>
              <span className="text-xs font-semibold tracking-[0.15em] uppercase text-foreground">
                WARDEN
              </span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
              Equipamiento de precisión diseñado para mejorar la experiencia de
              juego en BattleTech Classic, Alpha Strike y AeroTech.
            </p>
          </div>

          {[
            { label: "Productos", links: footerNavLinks.products },
            { label: "Soporte", links: footerNavLinks.support },
            { label: "WARDEN", links: footerNavLinks.legal },
          ].map((section) => (
            <div key={section.label}>
              <h4 className="text-eyebrow text-muted-foreground mb-4">
                {section.label}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
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
          ))}
        </div>

        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WARDEN. Todos los derechos reservados.
          </p>
          <p className="text-xs text-muted-foreground">
            Sin afiliación a Topps ni Catalyst Game Labs.
          </p>
        </div>
      </Container>
    </footer>
  );
}
