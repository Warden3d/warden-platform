import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Container } from "@/components/shared/container";
import { footerNavLinks } from "@/data/navigation";
import { FacebookIcon, InstagramIcon, TelegramIcon } from "@/components/shared/social-icons";

/* R082 — Redes sociales.
   Enlaces PROVISIONALES: sustituir por las URLs reales de WARDEN cuando existan. */
const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com",
    labelKey: "footer.socialInstagram",
    Icon: InstagramIcon,
  },
  {
    href: "https://www.facebook.com",
    labelKey: "footer.socialFacebook",
    Icon: FacebookIcon,
  },
  {
    href: "https://t.me",
    labelKey: "footer.socialTelegram",
    Icon: TelegramIcon,
  },
];

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-border bg-warden-surface">
      <Container>
        {/* Bloque principal: identidad + navegación */}
        <div className="grid grid-cols-1 gap-9 py-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand block */}
          <div className="max-w-xs">
            <Link href="/" className="inline-flex shrink-0">
              <Image
                src="/images/logo/wd-logov4.1.png"
                alt="WARDEN"
                height={16}
                width={107}
                className="h-4 w-auto"
              />
            </Link>
            <p className="mt-2 text-xs leading-relaxed text-[hsl(220_6%_56%)]">
              {t("footer.brandDesc")}
            </p>
            <div className="mt-3 flex items-center gap-4">
              {SOCIAL_LINKS.map(({ href, labelKey, Icon }) => (
                <Link
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(labelKey)}
                  className="-m-1 p-1 text-[hsl(220_6%_62%)] transition-colors duration-150 hover:text-warden-blue"
                >
                  <Icon className="h-[22px] w-[22px]" />
                </Link>
              ))}
            </div>
          </div>

          {[
            { label: t("footer.products"), links: footerNavLinks.products },
            { label: t("footer.support"), links: footerNavLinks.support },
            { label: t("footer.warden"), links: footerNavLinks.legal },
          ].map((section) => (
            <div key={section.label}>
              <h4 className="text-eyebrow mb-2.5 text-foreground/80">
                {section.label}
              </h4>
              <ul className="space-y-1.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[hsl(220_6%_62%)] transition-colors duration-150 hover:text-warden-blue"
                    >
                      {link.i18nKey ? t(link.i18nKey as Parameters<typeof t>[0]) : link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Franja legal */}
        <div className="flex flex-col gap-2 border-t border-border py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} WARDEN. {t("footer.allRightsReserved")}
          </p>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-[10px] text-muted-foreground/30 uppercase tracking-wider transition-colors duration-150 hover:text-muted-foreground/60"
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
