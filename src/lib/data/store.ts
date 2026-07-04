/**
 * WARDEN In-Memory Data Store
 *
 * Mutable copies of mock catalog data used when Supabase is not configured.
 * Admin operations mutate this store; public API reads from it.
 *
 * In Next.js dev mode, this state persists across hot reloads
 * but resets on full server restart.
 */

import type {
  Product,
  ProductImage,
  ProductSpec,
  Collection,
  Category,
  CompatibilitySystem,
  License,
  Bundle,
  Drop,
  ProductType,
} from "@/types/warden";

import {
  products as initialProducts,
  collections as initialCollections,
  categories as initialCategories,
  compatibilitySystems as initialCompatibilitySystems,
  licenses as initialLicenses,
  bundles as initialBundles,
  drops as initialDrops,
  productTypes as initialProductTypes,
} from "@/data/warden-catalog";

// ── Catalog (mutable) ────────────────────────────────────────────────

const products: Product[] = JSON.parse(JSON.stringify(initialProducts));
const bundles: Bundle[] = JSON.parse(JSON.stringify(initialBundles));
const drops: Drop[] = JSON.parse(JSON.stringify(initialDrops));

// ── Reference data (read-only after init) ────────────────────────────

const collections: Collection[] = JSON.parse(JSON.stringify(initialCollections));
const categories: Category[] = JSON.parse(JSON.stringify(initialCategories));
let compatibilitySystems: CompatibilitySystem[] = JSON.parse(
  JSON.stringify(initialCompatibilitySystems)
);
let productTypes: ProductType[] = JSON.parse(JSON.stringify(initialProductTypes));
let licenses: License[] = JSON.parse(JSON.stringify(initialLicenses));

// ── Requests store ───────────────────────────────────────────────────

interface StoredSelectionRequest {
  id: string;
  name: string;
  email: string;
  country: string;
  queryType: string;
  message: string;
  selections: Array<{
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
  }>;
  createdAt: string;
  status: "new" | "reviewed" | "replied" | "archived";
}

interface StoredContactRequest {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: "new" | "reviewed" | "replied" | "archived";
}

interface StoredCommunitySupportRequest {
  id: string;
  entityType: string;
  entityName: string;
  contactName: string;
  email: string;
  description: string;
  supportTypes: string[];
  details: string;
  acceptedTerms: boolean;
  createdAt: string;
  status: "new" | "reviewed" | "replied" | "archived";
}

const selectionRequests: StoredSelectionRequest[] = [
  {
    id: "req-sel-001",
    name: "Carlos Méndez",
    email: "carlos@battletech-club.es",
    country: "España",
    queryType: "Pedido de club — torneo",
    message:
      "Preparamos un torneo regional de Alpha Strike para 16 jugadores. Necesito presupuesto para 4 Commander Packs y material adicional.",
    selections: [
      { productId: "prod-001", productName: "Hex Position Markers — Brass Edition", quantity: 4, unitPrice: 24.99 },
      { productId: "prod-003", productName: "Alpha Strike Movement Template Set", quantity: 4, unitPrice: 22.99 },
    ],
    createdAt: "2026-06-10T14:30:00Z",
    status: "new",
  },
  {
    id: "req-sel-002",
    name: "Anna Kowalski",
    email: "anna.k@wargaming.pl",
    country: "Polska",
    queryType: "Compra particular",
    message: "Quiero encargar los Heat Dials y los Armor Sliders. ¿Hacéis envíos a Polonia?",
    selections: [
      { productId: "prod-002", productName: "Tactical Heat Dial", quantity: 2, unitPrice: 18.99 },
      { productId: "prod-004", productName: "Armor Status Slider Set", quantity: 1, unitPrice: 34.99 },
    ],
    createdAt: "2026-06-11T09:15:00Z",
    status: "new",
  },
];

const contactRequests: StoredContactRequest[] = [
  {
    id: "req-con-001",
    name: "Marina López",
    email: "marina@libreriagame.es",
    subject: "Dealer Program",
    message:
      "Tenemos una tienda física en Valencia y nos interesaría incluir productos WARDEN en nuestro catálogo. ¿Podéis enviarme información sobre el programa de distribuidores?",
    createdAt: "2026-06-08T11:00:00Z",
    status: "new",
  },
  {
    id: "req-con-002",
    name: "Thomas Wright",
    email: "thomas@tabletop-haven.co.uk",
    subject: "Licencias y colaboraciones",
    message:
      "Soy diseñador de escenografía y tengo una línea de terreno sci-fi que podría encajar en vuestra sección de Licenses. Me gustaría explorar una colaboración.",
    createdAt: "2026-06-12T16:45:00Z",
    status: "new",
  },
  {
    id: "req-con-003",
    name: "Pedro Ruiz",
    email: "pedro.r@gmail.com",
    subject: "Consulta general",
    message: "¿Los Hex Markers son compatibles con mapas de hexágono de 1.75\"? Tengo mapas antiguos de FASA y quiero asegurarme antes de comprar.",
    createdAt: "2026-06-14T08:20:00Z",
    status: "reviewed",
  },
];

const communitySupportRequests: StoredCommunitySupportRequest[] = [
  {
    id: "req-cs-001",
    entityType: "asociacion",
    contactName: "Javier Torres",
    entityName: "BattleTech Ibérica",
    email: "presidencia@btiberica.org",
    description:
      "Asociación sin ánimo de lucro que organiza torneos trimestrales de BattleTech Classic en Madrid, Barcelona y Valencia. Contamos con unos 80 socios activos.",
    supportTypes: ["premios", "escenografia", "elementos-juego"],
    details:
      "Organizamos el Campeonato Nacional en octubre 2026 (24 jugadores) y necesitaríamos apoyo con material de juego y premios para los finalistas. El evento se celebrará en el Centro Cívico de Tetuán (Madrid) los días 3 y 4 de octubre.",
    acceptedTerms: true,
    createdAt: "2026-06-05T12:00:00Z",
    status: "new",
  },
  {
    id: "req-cs-002",
    entityType: "club",
    contactName: "Léa Moreau",
    entityName: "Alpha Strike France",
    email: "lea@alphastrike-fr.com",
    description:
      "Club de juego centrado en Alpha Strike con reuniones semanales en Lyon. 30 miembros regulares y torneos bimensuales.",
    supportTypes: ["material-promocional", "asesoramiento"],
    details:
      "Estamos montando nuestro primer torneo internacional en noviembre 2026. Buscamos material promocional de WARDEN para los packs de bienvenida y asesoramiento sobre qué productos recomendar a nuestros jugadores.",
    acceptedTerms: true,
    createdAt: "2026-06-13T18:30:00Z",
    status: "new",
  },
];

// ── Getters (public API mirror) ──────────────────────────────────────

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getBundles(): Bundle[] {
  return bundles;
}

export function getDrops(): Drop[] {
  return drops;
}

export function getCollections(): Collection[] {
  return collections;
}

export function getCategories(): Category[] {
  return categories;
}

export function getCompatibilitySystems(): CompatibilitySystem[] {
  return compatibilitySystems;
}

export function getProductTypes(): ProductType[] {
  return productTypes;
}

export function getLicenses(): License[] {
  return licenses;
}

export function getCollectionById(id: string): Collection | undefined {
  return collections.find((c) => c.id === id);
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getCompatibilitySystemById(id: string): CompatibilitySystem | undefined {
  return compatibilitySystems.find((c) => c.id === id);
}

export function getLicenseById(id: string): License | undefined {
  return licenses.find((l) => l.id === id);
}

// ── Setters (admin mutations) ────────────────────────────────────────

let idCounter = 9000;

function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

export function createProduct(data: Omit<Product, "id" | "images" | "specs"> & {
  images?: Omit<ProductImage, "id" | "productId">[];
  specs?: Omit<ProductSpec, "id" | "productId">[];
}): Product {
  const id = generateId("prod");
  const images: ProductImage[] = (data.images ?? []).map((img, i) => ({
    ...img,
    id: `img-${id}-${i + 1}`,
    productId: id,
    isPrimary: img.isPrimary ?? false,
    sortOrder: img.sortOrder ?? i + 1,
    viewType: img.viewType ?? "main",
  }));
  const specs: ProductSpec[] = (data.specs ?? []).map((spec, i) => ({
    ...spec,
    id: `spec-${id}-${i + 1}`,
    productId: id,
    sortOrder: spec.sortOrder ?? i + 1,
  }));

  const product: Product = {
    ...data,
    id,
    images,
    specs,
    featured: data.featured ?? false,
    internalCode: data.internalCode ?? "",
    associatedLicenseId: data.associatedLicenseId ?? null,
    weight: data.weight ?? 0,
    volume: data.volume ?? 0,
    printTime: data.printTime ?? 0,
    version: data.version ?? "1.0.0",
    relatedProductIds: data.relatedProductIds ?? [],
    relatedBundleIds: data.relatedBundleIds ?? [],
    relatedDropIds: data.relatedDropIds ?? [],
  };

  products.push(product);
  return product;
}

export function updateProduct(
  id: string,
  data: Partial<Omit<Product, "id" | "images" | "specs">> & {
    images?: Omit<ProductImage, "id" | "productId">[];
    specs?: Omit<ProductSpec, "id" | "productId">[];
  }
): Product | undefined {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return undefined;

  const existing = products[index];

  // Handle images update: replace if provided
  let images = existing.images;
  if (data.images !== undefined) {
    images = data.images.map((img, i) => ({
      ...img,
      id: `img-${id}-${i + 1}`,
      productId: id,
      isPrimary: img.isPrimary ?? false,
      sortOrder: img.sortOrder ?? i + 1,
      viewType: img.viewType ?? "main",
    }));
  }

  // Handle specs update: replace if provided
  let specs = existing.specs;
  if (data.specs !== undefined) {
    specs = data.specs.map((spec, i) => ({
      ...spec,
      id: `spec-${id}-${i + 1}`,
      productId: id,
      sortOrder: spec.sortOrder ?? i + 1,
    }));
  }

  const updated: Product = {
    ...existing,
    ...data,
    id: existing.id,
    slug: data.slug ?? existing.slug,
    images,
    specs,
  };

  // Remove images/specs from data to avoid duplicate keys in spread
  delete (updated as unknown as Record<string, unknown>).images;
  delete (updated as unknown as Record<string, unknown>).specs;

  // Re-add the processed images/specs
  (updated as Product).images = images;
  (updated as Product).specs = specs;

  products[index] = updated;
  return updated;
}

export function deleteProduct(id: string): boolean {
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return false;
  products.splice(index, 1);
  return true;
}

export function updateProductStatus(
  id: string,
  status: Product["status"]
): Product | undefined {
  return updateProduct(id, { status });
}

// ── Request store accessors ──────────────────────────────────────────

export function getSelectionRequests(): StoredSelectionRequest[] {
  return selectionRequests;
}

export function getContactRequests(): StoredContactRequest[] {
  return contactRequests;
}

export function getCommunitySupportRequests(): StoredCommunitySupportRequest[] {
  return communitySupportRequests;
}
