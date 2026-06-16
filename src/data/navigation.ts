import type { NavLink } from "@/types";

export const mainNavLinks: NavLink[] = [
  { label: "Catálogo", href: "/collections" },
  { label: "Bundles", href: "/bundles" },
  { label: "Drops", href: "/drops" },
  { label: "Comunidad", href: "/community-support" },
  { label: "Sobre WARDEN", href: "/about" },
  { label: "Contacto", href: "/contact" },
];

export const footerNavLinks = {
  products: [
    { label: "Colecciones", href: "/collections" },
    { label: "Bundles", href: "/bundles" },
    { label: "Drops", href: "/drops" },
    { label: "Mi Selección", href: "/selection" },
  ],
  support: [
    { label: "Comunidad", href: "/community-support" },
    { label: "Contacto", href: "/contact" },
    { label: "FAQs", href: "/community-support#faq" },
  ],
  legal: [
    { label: "Sobre WARDEN", href: "/about" },
    { label: "Licencias", href: "/collections/licenses" },
  ],
};
