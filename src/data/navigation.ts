import type { NavLink } from "@/types/warden";

export const mainNavLinks: NavLink[] = [
  { label: "Catálogo", href: "/catalog", i18nKey: "nav.catalog" },
  { label: "Bundles", href: "/bundles", i18nKey: "nav.bundles" },
  { label: "Drops", href: "/drops", i18nKey: "nav.drops" },
  { label: "Comunidad", href: "/community-support", i18nKey: "nav.community" },
  { label: "Sobre WARDEN", href: "/about", i18nKey: "nav.about" },
  { label: "Contacto", href: "/contact", i18nKey: "nav.contact" },
];

export const footerNavLinks = {
  products: [
    { label: "Colecciones", href: "/catalog", i18nKey: "footer.collections" },
    { label: "Bundles", href: "/bundles", i18nKey: "footer.bundles" },
    { label: "Drops", href: "/drops", i18nKey: "footer.drops" },
    { label: "Mi Selección", href: "/selection", i18nKey: "footer.mySelection" },
  ],
  support: [
    { label: "Comunidad", href: "/community-support", i18nKey: "footer.community" },
    { label: "Contacto", href: "/contact", i18nKey: "footer.contact" },
    { label: "FAQs", href: "/community-support#faq", i18nKey: "footer.faqs" },
  ],
  legal: [
    { label: "Sobre WARDEN", href: "/about", i18nKey: "footer.about" },
    { label: "Licencias", href: "/catalog?collection=col-licenses", i18nKey: "footer.licenses" },
  ],
};
