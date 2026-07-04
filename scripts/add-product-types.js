const fs = require("fs");

let content = fs.readFileSync("src/data/warden-catalog.ts", "utf8");

// Add ProductType import
content = content.replace(
  "  Bundle,\n  Drop,\n} from \"@/types/warden\";",
  "  Bundle,\n  Drop,\n  ProductType,\n} from \"@/types/warden\";"
);

// typeId assignments indexed by product slug
const assignments = [
  { slug: "hex-position-markers-brass",   typeId: "type-esc-accesorio" },
  { slug: "tactical-heat-dial",           typeId: "type-comp-seguimiento" },
  { slug: "alpha-strike-movement-templates", typeId: "type-ter-plantilla" },
  { slug: "armor-status-sliders",         typeId: "type-comp-seguimiento" },
  { slug: "cluster-hit-quick-wheel",      typeId: "type-comp-consulta" },
  { slug: "aerotech-altitude-tracker",    typeId: "type-map-modular" },
  { slug: "wasteland-command-post",       typeId: "type-esc-militar" },
  { slug: "scavenger-terrain-pack",       typeId: "type-ter-ruinas" },
  { slug: "fallen-city-map-pack",         typeId: "type-map-modular" },
];

for (const a of assignments) {
  const slugLine = `    slug: "${a.slug}",`;
  const idx = content.indexOf(slugLine);
  if (idx === -1) {
    console.error("NOT FOUND:", slugLine);
    continue;
  }

  // Find categoryId line after this slug
  const catStart = content.indexOf('    categoryId:', idx);
  const catEnd = content.indexOf('\n', catStart);
  const compatStart = content.indexOf('    compatibilityId:', catEnd);

  // Insert typeId after categoryId line
  const insert = `    typeId: "${a.typeId}",\n`;
  content = content.slice(0, catEnd + 1) + insert + content.slice(catEnd + 1);
}

// Add productTypes before the first export function
const marker = "\nexport function getProductBySlug";
const typesBlock = `
// ─────────────────────────────────────────────────
// Product Types
// ─────────────────────────────────────────────────
// ⚠ Provisional — pendiente de revisión de taxonomía para Mapas, Escenarios y Complementarios

export const productTypes: ProductType[] = [
  // Escenografía
  { id: "type-esc-urbano",           categoryId: "cat-escenografia",     name: "Urbano" },
  { id: "type-esc-comercial",        categoryId: "cat-escenografia",     name: "Comercial" },
  { id: "type-esc-industrial",       categoryId: "cat-escenografia",     name: "Industrial" },
  { id: "type-esc-militar",          categoryId: "cat-escenografia",     name: "Militar" },
  { id: "type-esc-administrativo",   categoryId: "cat-escenografia",     name: "Administrativo" },
  { id: "type-esc-infraestructura",  categoryId: "cat-escenografia",     name: "Infraestructura" },
  { id: "type-esc-accesorio",        categoryId: "cat-escenografia",     name: "Accesorio" },

  // Terreno
  { id: "type-ter-bosque",           categoryId: "cat-terreno",          name: "Bosque" },
  { id: "type-ter-colina",           categoryId: "cat-terreno",          name: "Colina" },
  { id: "type-ter-agua",             categoryId: "cat-terreno",          name: "Agua" },
  { id: "type-ter-carretera",        categoryId: "cat-terreno",          name: "Carretera" },
  { id: "type-ter-puente",           categoryId: "cat-terreno",          name: "Puente" },
  { id: "type-ter-ruinas",           categoryId: "cat-terreno",          name: "Ruinas" },
  { id: "type-ter-obstaculo",        categoryId: "cat-terreno",          name: "Obstáculo" },
  { id: "type-ter-plantilla",        categoryId: "cat-terreno",          name: "Plantilla" },

  // Mapas (provisional)
  { id: "type-map-modular",          categoryId: "cat-mapas",            name: "Modular" },

  // Complementarios (provisional)
  // Complementarios → Accesorios (obsoleto, mantenido como referencia histórica)
  { id: "type-comp-seguimiento",     categoryId: "cat-accesorios",  name: "Seguimiento" },
  { id: "type-comp-consulta",        categoryId: "cat-accesorios",  name: "Consulta Rápida" },
];
`;

content = content.replace(marker, typesBlock + marker);

fs.writeFileSync("src/data/warden-catalog.ts", content);
console.log("OK");
