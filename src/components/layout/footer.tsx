import Link from "next/link";
import { Container } from "@/components/shared/container";

const footerSections = [
  {
    label: "Products",
    links: [
      { label: "Collections", href: "/collections" },
      { label: "Bundles", href: "/bundles" },
      { label: "Drops", href: "/drops" },
      { label: "Selection", href: "/selection" },
    ],
  },
  {
    label: "Support",
    links: [
      { label: "Community", href: "/community-support" },
      { label: "FAQ", href: "/community-support#faq" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    label: "WARDEN",
    links: [
      { label: "About", href: "/about" },
      { label: "Licenses", href: "/collections/licenses" },
    ],
  },
];

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
              Precision equipment designed to enhance the BattleTech Classic,
              Alpha Strike, and AeroTech tabletop experience.
            </p>
          </div>

          {footerSections.map((section) => (
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
            &copy; {new Date().getFullYear()} WARDEN. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Not affiliated with Topps or Catalyst Game Labs.
          </p>
        </div>
      </Container>
    </footer>
  );
}
