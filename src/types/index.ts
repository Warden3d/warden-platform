export interface Product {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  descriptionShort?: string;
  specs: Record<string, string>;
  system: "battletech-classic" | "alpha-strike" | "aerotech";
  status: "active" | "draft" | "discontinued";
  isFeatured: boolean;
  thumbnailUrl: string;
  images: ProductImage[];
  collectionIds: string[];
}

export interface ProductImage {
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  thumbnailUrl: string;
  productIds: string[];
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string;
  discountLabel?: string;
  productIds: string[];
}

export interface Drop {
  id: string;
  slug: string;
  name: string;
  description: string;
  startsAt: string;
  endsAt?: string;
  status: "upcoming" | "live" | "ended";
  thumbnailUrl: string;
  productIds: string[];
}

export interface SelectionItem {
  productId: string;
  productName: string;
  quantity: number;
}

export interface QuoteRequest {
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerNotes?: string;
  selections: SelectionItem[];
}

export type NavLink = {
  label: string;
  href: string;
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type SystemLabel = "BattleTech Classic" | "Alpha Strike" | "AeroTech";
