import Link from "next/link";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/container";
import { footerNavLinks } from "@/data/navigation";

export function Footer() {
  const t = useTranslations();

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
              {t("footer.brandDesc")}
            </p>
          </div>

          {[
            { label: t("footer.products"), links: footerNavLinks.products },
            { label: t("footer.support"), links: footerNavLinks.support },
            { label: t("footer.warden"), links: footerNavLinks.legal },
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
                      {link.i18nKey ? t(link.i18nKey as any) : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="py-5 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WARDEN. {t("footer.allRightsReserved")}
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/login"
              className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors uppercase tracking-wider"
            >
              Admin
            </Link>
            <p className="text-xs text-muted-foreground">
              {t("footer.noAffiliation")}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
