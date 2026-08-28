/**
 * WARDEN Catalog Seed — Supabase
 *
 * Standalone script that reads mock data and inserts via Supabase Management API.
 * Idempotent: uses INSERT ... ON CONFLICT (id) DO UPDATE.
 *
 * Usage:
 *   SUPABASE_ACCESS_TOKEN=sbp_... node scripts/seed-supabase.mjs
 *   (or pipe the token from env)
 */

const SUPABASE_ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN;

if (!SUPABASE_ACCESS_TOKEN) {
  console.error("❌ Set SUPABASE_ACCESS_TOKEN environment variable");
  process.exit(1);
}

const PROJECT_REF = "lnresukfnylczgyookpf";
const API = `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`;

async function runSql(sql) {
  const res = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${SUPABASE_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SQL error (${res.status}): ${text.slice(0, 500)}`);
  }
  return res.json();
}

// ── Data ──────────────────────────────────────────────────────────

const data = {
  collections: [
    { id: "col-warden-core", slug: "warden-core", name: "WARDEN Core", description: "Línea principal de herramientas de precisión para BattleTech. Componentes de latón, aluminio y acrílico diseñados para reducir el desorden en la mesa y acelerar cada fase de la partida.", thumbnail_url: "/images/collections/warden-core.svg" },
    { id: "col-licenses", slug: "licenses", name: "Licenses", description: "Colaboraciones con estudios asociados y creadores independientes. Cada colección licenciada aporta estética y herramientas únicas manteniendo los estándares WARDEN de precisión y durabilidad.", thumbnail_url: "/images/collections/licenses.svg" },
  ],
  categories: [
    { id: "cat-escenografia", slug: "escenografia", name: "Escenografía", description: "Piezas decorativas y funcionales para ambientar el tablero de juego." },
    { id: "cat-terreno", slug: "terreno", name: "Terreno", description: "Elementos de terreno que afectan el desarrollo táctico de la partida." },
    { id: "cat-mapas", slug: "mapas", name: "Mapas", description: "Mapas y tableros modulares listos para usar en diferentes configuraciones." },
    { id: "cat-escenarios", slug: "escenarios", name: "Escenarios", description: "Paquetes de escenarios con misiones, objetivos y despliegues predefinidos." },
    { id: "cat-accesorios", slug: "accesorios", name: "Accesorios", description: "Accesorios que agilizan la gestión de la partida y reducen consultas al reglamento." },
  ],
  compatibilitySystems: [
    { id: "comp-battletech-classic", slug: "battletech-classic", name: "BattleTech Classic", description: "Sistema de juego de mesa original con énfasis en el detalle táctico por unidad." },
    { id: "comp-alpha-strike", slug: "alpha-strike", name: "Alpha Strike", description: "Sistema de juego acelerado diseñado para combates multidivisión." },
    { id: "comp-aerotech", slug: "aerotech", name: "AeroTech", description: "Sistema de combate aeroespacial que cubre maniobras atmosféricas y espaciales." },
  ],
  licenses: [
    { id: "lic-wasteland-studios", name: "Wasteland Studios", description: "Estudio independiente especializado en escenografía post-apocalíptica.", website: "https://wastelandstudios.example.com", logo_url: "/images/licenses/wasteland-studios.svg" },
  ],
  productTypes: [
    { id: "type-esc-residencial", category_id: "cat-escenografia", name: "Residencial" },
    { id: "type-esc-comercial", category_id: "cat-escenografia", name: "Comercial" },
    { id: "type-esc-administrativo", category_id: "cat-escenografia", name: "Administrativo" },
    { id: "type-esc-industrial", category_id: "cat-escenografia", name: "Industrial" },
    { id: "type-esc-energetico", category_id: "cat-escenografia", name: "Energético" },
    { id: "type-esc-militar", category_id: "cat-escenografia", name: "Militar" },
    { id: "type-esc-comunicaciones", category_id: "cat-escenografia", name: "Comunicaciones" },
    { id: "type-esc-aeroespacial", category_id: "cat-escenografia", name: "Aeroespacial" },
    { id: "type-esc-infraestructura", category_id: "cat-escenografia", name: "Infraestructura" },
    { id: "type-ter-vegetacion", category_id: "cat-terreno", name: "Vegetación" },
    { id: "type-ter-relieve", category_id: "cat-terreno", name: "Relieve" },
    { id: "type-ter-agua", category_id: "cat-terreno", name: "Agua" },
    { id: "type-ter-terreno-dificil", category_id: "cat-terreno", name: "Terreno difícil" },
    { id: "type-ter-ruinas-escombros", category_id: "cat-terreno", name: "Ruinas y escombros" },
    { id: "type-map-urbano", category_id: "cat-mapas", name: "Urbano" },
    { id: "type-map-natural", category_id: "cat-mapas", name: "Natural" },
    { id: "type-map-industrial-militar", category_id: "cat-mapas", name: "Industrial/Militar" },
    { id: "type-map-costero-naval", category_id: "cat-mapas", name: "Costero/Naval" },
  ],
  products: [
    {
      id: "prod-001", slug: "hex-position-markers-brass", name: "Hex Position Markers — Brass Edition",
      short_description: "Marcadores de latón para estado de unidad, línea de visión y terreno. Encajan en hexágonos estándar de 1.25\".", description: "Juego de doce marcadores de latón macizo diseñados para BattleTech Classic y Alpha Strike.",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Latón macizo sin recubrimiento", height: 0.3, width: 3.2, depth: 3.2, price: 24.99,
      game_features: ["Compatibles con mapas de hexágono estándar de 1.25\"", "Cuatro formas diferenciadas para identificación táctil", "No obstruyen las miniaturas colocadas en el hexágono", "Desarrollan pátina natural con el uso"],
      status: "active", featured: true, internal_code: "WDN-CORE-001", associated_license_id: null,
      weight: 48, volume: 3.1, print_time: 0, version: "1.0.0",
      related_product_ids: ["prod-002","prod-004","prod-005"], related_bundle_ids: ["bundle-001","bundle-002"], related_drop_ids: ["drop-001"],
    },
    {
      id: "prod-002", slug: "tactical-heat-dial", name: "Tactical Heat Dial",
      short_description: "Dial acrílico de doble capa para seguimiento de calor de 0 a 30 con marcas de advertencia.", description: "Dial de acrílico de doble capa que registra la escala de calor de 0 a 30.",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Acrílico láser cortado, doble capa con eje de latón", height: 0.6, width: 8.5, depth: 8.5, price: 18.99,
      game_features: ["Rango de calor 0 a 30 con marcas en cada punto", "Umbrales de advertencia: tirada de apagado en 14, explosión de munición en 26", "Eje de latón que mantiene la posición", "Numeración grabada por láser de alto contraste"],
      status: "active", featured: true, internal_code: "WDN-CORE-002", associated_license_id: null,
      weight: 32, volume: 4.5, print_time: 0, version: "1.0.0",
      related_product_ids: ["prod-001","prod-004","prod-005"], related_bundle_ids: ["bundle-001","bundle-002"], related_drop_ids: [],
    },
    {
      id: "prod-003", slug: "alpha-strike-movement-templates", name: "Alpha Strike Movement Template Set",
      short_description: "Cinco plantillas acrílicas para los modos de movimiento de Alpha Strike con valores TMM grabados.", description: "Juego de cinco plantillas de movimiento cortadas por láser en acrílico ahumado.",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-alpha-strike",
      scale: "1:265", material: "Acrílico ahumado con grabado láser", height: 0.3, width: 15, depth: 10, price: 22.99,
      game_features: ["Modos: Stand Still, Walk, Run, Jump, Sprint", "Valor TMM grabado en cada plantilla", "Acrílico transparente para visibilidad del terreno", "Funda de almacenamiento con tarjeta de referencia"],
      status: "active", featured: true, internal_code: "WDN-CORE-003", associated_license_id: null,
      weight: 38, volume: 5.2, print_time: 0, version: "1.0.0",
      related_product_ids: [], related_bundle_ids: [], related_drop_ids: [],
    },
    {
      id: "prod-004", slug: "armor-status-sliders", name: "Armor Status Slider Set",
      short_description: "Ocho deslizadores para seguimiento de blindaje por localización. Reemplaza las hojas de registro de papel.", description: "Juego de ocho minideslizadores que reemplazan las hojas de registro de papel.",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Compuesto de aluminio con grabado láser", height: 1.8, width: 10, depth: 8, price: 34.99,
      game_features: ["Ocho localizaciones: Cabeza, CT, LT, RT, LA, RA, LL, RL", "Topes táctiles en umbrales de blindaje", "Base organizadora alineada con hoja de registro estándar", "Resistencia ajustada para evitar desplazamiento accidental"],
      status: "active", featured: false, internal_code: "WDN-CORE-004", associated_license_id: null,
      weight: 85, volume: 14.4, print_time: 0, version: "1.0.0",
      related_product_ids: ["prod-001","prod-002","prod-005"], related_bundle_ids: ["bundle-001"], related_drop_ids: [],
    },
    {
      id: "prod-005", slug: "cluster-hit-quick-wheel", name: "Cluster Hit Quick Wheel",
      short_description: "Rueda giratoria para la tabla de impactos de ráfaga de 2 a 40 misiles. Sin consultas al reglamento.", description: "Rueda giratoria compacta que muestra la tabla de impactos de ráfaga (Cluster Hits Table).",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Eje de latón con platos de acrílico", height: 0.5, width: 10, depth: 10, price: 16.99,
      game_features: ["Rango de salvas: 2 a 40 misiles", "Resultados de 2 a 12 sin cálculo adicional", "Doble cara: estándar y LRM/SRM especiales", "Tamaño compacto para bandeja de dados"],
      status: "active", featured: false, internal_code: "WDN-CORE-005", associated_license_id: null,
      weight: 28, volume: 5, print_time: 0, version: "1.0.0",
      related_product_ids: ["prod-001","prod-002","prod-004"], related_bundle_ids: ["bundle-001"], related_drop_ids: [],
    },
    {
      id: "prod-006", slug: "aerotech-altitude-tracker", name: "AeroTech Altitude & Velocity Tracker",
      short_description: "Panel de doble seguimiento para altitud atmosférica (0-10) y velocidad (16 incrementos) en AeroTech.", description: "Panel de doble seguimiento diseñado para el combate atmosférico de AeroTech.",
      collection_id: "col-warden-core", category_id: "cat-accesorios", type_id: null, compatibility_id: "comp-aerotech",
      scale: "1:265", material: "Aluminio anodizado con marcas grabadas", height: 0.4, width: 18, depth: 12, price: 29.99,
      game_features: ["Altitud de 0 a 10 niveles atmosféricos", "Velocidad en rueda giratoria de 16 incrementos", "Efectos de gravedad indicados por nivel", "Base compartida que encaja con hojas de registro"],
      status: "active", featured: false, internal_code: "WDN-CORE-006", associated_license_id: null,
      weight: 72, volume: 8.6, print_time: 0, version: "1.0.0",
      related_product_ids: [], related_bundle_ids: [], related_drop_ids: [],
    },
    {
      id: "prod-007", slug: "wasteland-command-post", name: "Wasteland Command Post",
      short_description: "Puesto de mando prefabricado en resina con diseño post-apocalíptico.", description: "Puesto de mando fortificado diseñado por Wasteland Studios.",
      collection_id: "col-licenses", category_id: "cat-escenografia", type_id: "type-esc-militar", compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Resina de poliuretano, suministrada sin pintar", height: 6, width: 15, depth: 10, price: 44.99,
      game_features: ["Interior accesible para miniaturas", "Base compatible con hexágonos estándar", "Diseño original de Wasteland Studios", "Listo para imprimación y pintura acrílica"],
      status: "active", featured: true, internal_code: "WDN-LIC-WS-001", associated_license_id: "lic-wasteland-studios",
      weight: 185, volume: 90, print_time: 7.5, version: "1.0.0",
      related_product_ids: ["prod-008","prod-009"], related_bundle_ids: [], related_drop_ids: ["drop-002"],
    },
    {
      id: "prod-008", slug: "scavenger-terrain-pack", name: "Scavenger's Terrain Pack",
      short_description: "Pack de terreno modular post-apocalíptico. Escombros, vehículos abandonados y barricadas.", description: "Pack de siete piezas de terreno modular diseñado por Wasteland Studios.",
      collection_id: "col-licenses", category_id: "cat-terreno", type_id: "type-ter-ruinas-escombros", compatibility_id: "comp-alpha-strike",
      scale: "1:265", material: "Resina de poliuretano, suministrada sin pintar", height: 4, width: 25, depth: 20, price: 34.99,
      game_features: ["Siete piezas de terreno modular", "Compatibles con hexágonos estándar", "Piezas combinables para cobertura total", "Diseño original de Wasteland Studios"],
      status: "active", featured: false, internal_code: "WDN-LIC-WS-002", associated_license_id: "lic-wasteland-studios",
      weight: 210, volume: 120, print_time: 12, version: "1.0.0",
      related_product_ids: ["prod-007","prod-009"], related_bundle_ids: [], related_drop_ids: ["drop-002"],
    },
    {
      id: "prod-009", slug: "fallen-city-map-pack", name: "Fallen City Map Pack",
      short_description: "Tres mapas modulares de ciudad en ruinas para BattleTech.", description: "Tres mapas modulares de doble cara diseñados en colaboración con Wasteland Studios.",
      collection_id: "col-licenses", category_id: "cat-mapas", type_id: "type-map-urbano", compatibility_id: "comp-battletech-classic",
      scale: "1:265", material: "Papel satinado de 300 g/m², impresión digital", height: 0.2, width: 55.9, depth: 43.2, price: 28.99,
      game_features: ["Tres sectores: industrial, centro, periferia", "Formato 22\" × 17\" estándar BattleTech", "Doble cara con variaciones de escenario", "Incluye marcadores de edificios y notas de escenario"],
      status: "active", featured: false, internal_code: "WDN-LIC-WS-003", associated_license_id: "lic-wasteland-studios",
      weight: 120, volume: 5, print_time: 0, version: "1.0.0",
      related_product_ids: ["prod-007","prod-008"], related_bundle_ids: [], related_drop_ids: ["drop-002"],
    },
  ],
  productImages: [
    // prod-001 — Hex Position Markers
    { id: "img-prod-001-1", product_id: "prod-001", url: "/images/products/hex-markers-brass.svg", alt: "Hex Position Markers sobre un mapa hexagonal", is_primary: true, sort_order: 1, view_type: "main" },
    { id: "img-prod-001-2", product_id: "prod-001", url: "/images/products/hex-markers-brass-angle.svg", alt: "Detalle de los marcadores de latón", is_primary: false, sort_order: 2, view_type: "main" },
    // prod-002 — Tactical Heat Dial
    { id: "img-prod-002-1", product_id: "prod-002", url: "/images/products/heat-dial.svg", alt: "Tactical Heat Dial sobre hoja de registro", is_primary: true, sort_order: 1, view_type: "main" },
    // prod-003 — Alpha Strike Movement Templates
    { id: "img-prod-003-1", product_id: "prod-003", url: "/images/products/movement-templates.svg", alt: "Plantillas de movimiento Alpha Strike", is_primary: true, sort_order: 1, view_type: "main" },
    // prod-004 — Armor Status Sliders
    { id: "img-prod-004-1", product_id: "prod-004", url: "/images/products/armor-sliders.svg", alt: "Deslizadores de blindaje sobre hoja de registro", is_primary: true, sort_order: 1, view_type: "main" },
    // prod-005 — Cluster Hit Quick Wheel
    { id: "img-prod-005-1", product_id: "prod-005", url: "/images/products/cluster-wheel.svg", alt: "Cluster Hit Quick Wheel", is_primary: true, sort_order: 1, view_type: "main" },
    // prod-006 — AeroTech Altitude Tracker
    { id: "img-prod-006-1", product_id: "prod-006", url: "/images/products/altitude-tracker.svg", alt: "AeroTech Altitude and Velocity Tracker", is_primary: true, sort_order: 1, view_type: "main" },
    // prod-007 — Wasteland Command Post
    { id: "img-prod-007-1", product_id: "prod-007", url: "/images/products/wasteland-command-post.svg", alt: "Wasteland Command Post — Monocromo frontal", is_primary: true, sort_order: 1, view_type: "main" },
    { id: "img-prod-007-2", product_id: "prod-007", url: "/images/products/wasteland-command-post-angle.svg", alt: "Wasteland Command Post — Monocromo lateral", is_primary: false, sort_order: 2, view_type: "main" },
    { id: "img-prod-007-3", product_id: "prod-007", url: "/images/products/wasteland-command-post-color.svg", alt: "Wasteland Command Post — Color frontal", is_primary: true, sort_order: 3, view_type: "main" },
    { id: "img-prod-007-4", product_id: "prod-007", url: "/images/products/wasteland-command-post-color-angle.svg", alt: "Wasteland Command Post — Color lateral", is_primary: false, sort_order: 4, view_type: "main" },
    // prod-008 — Scavenger's Terrain Pack
    { id: "img-prod-008-1", product_id: "prod-008", url: "/images/products/scavenger-terrain-pack.svg", alt: "Scavenger's Terrain Pack — Monocromo frontal", is_primary: true, sort_order: 1, view_type: "main" },
    { id: "img-prod-008-2", product_id: "prod-008", url: "/images/products/scavenger-terrain-pack-angle.svg", alt: "Scavenger's Terrain Pack — Monocromo lateral", is_primary: false, sort_order: 2, view_type: "main" },
    { id: "img-prod-008-3", product_id: "prod-008", url: "/images/products/scavenger-terrain-pack-color.svg", alt: "Scavenger's Terrain Pack — Color frontal", is_primary: true, sort_order: 3, view_type: "main" },
    { id: "img-prod-008-4", product_id: "prod-008", url: "/images/products/scavenger-terrain-pack-color-angle.svg", alt: "Scavenger's Terrain Pack — Color lateral", is_primary: false, sort_order: 4, view_type: "main" },
    // prod-009 — Fallen City Map Pack
    { id: "img-prod-009-1", product_id: "prod-009", url: "/images/products/fallen-city-map-pack.svg", alt: "Fallen City Map Pack — mapa del centro urbano", is_primary: true, sort_order: 1, view_type: "main" },
  ],
  productSpecs: [
    { id: "spec-prod-001-1", product_id: "prod-001", spec_key: "content", spec_label: "Contenido", spec_value: "12 marcadores (4 estado, 4 LOS, 4 terreno)", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-001-2", product_id: "prod-001", spec_key: "weight", spec_label: "Peso unitario", spec_value: "~4 g por marcador", visibility: ["api"], sort_order: 2 },
    { id: "spec-prod-001-3", product_id: "prod-001", spec_key: "finish", spec_label: "Acabado", spec_value: "Latón natural, sin lacar", visibility: ["card","pdp"], sort_order: 3 },
    { id: "spec-prod-001-4", product_id: "prod-001", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic, Alpha Strike", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-002-1", product_id: "prod-002", spec_key: "content", spec_label: "Contenido", spec_value: "1 dial acrílico de doble capa", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-002-2", product_id: "prod-002", spec_key: "scale", spec_label: "Rango", spec_value: "0–30 de calor", visibility: ["pdp"], sort_order: 2 },
    { id: "spec-prod-002-3", product_id: "prod-002", spec_key: "material", spec_label: "Material", spec_value: "Acrílico transparente", visibility: ["card","pdp"], sort_order: 3 },
    { id: "spec-prod-002-4", product_id: "prod-002", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-003-1", product_id: "prod-003", spec_key: "content", spec_label: "Contenido", spec_value: "5 plantillas acrílicas", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-003-2", product_id: "prod-003", spec_key: "material", spec_label: "Material", spec_value: "Acrílico transparente", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-003-3", product_id: "prod-003", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "Alpha Strike", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-003-4", product_id: "prod-003", spec_key: "finish", spec_label: "Acabado", spec_value: "Marcas TMM grabadas", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-004-1", product_id: "prod-004", spec_key: "content", spec_label: "Contenido", spec_value: "8 deslizadores de blindaje", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-004-2", product_id: "prod-004", spec_key: "material", spec_label: "Material", spec_value: "Plástico rígido", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-004-3", product_id: "prod-004", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-004-4", product_id: "prod-004", spec_key: "finish", spec_label: "Acabado", spec_value: "Escala impresa", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-005-1", product_id: "prod-005", spec_key: "content", spec_label: "Contenido", spec_value: "1 rueda giratoria", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-005-2", product_id: "prod-005", spec_key: "material", spec_label: "Material", spec_value: "Plástico con eje metálico", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-005-3", product_id: "prod-005", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-005-4", product_id: "prod-005", spec_key: "finish", spec_label: "Acabado", spec_value: "Sistema de clic por incremento", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-006-1", product_id: "prod-006", spec_key: "content", spec_label: "Contenido", spec_value: "1 panel de doble seguimiento", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-006-2", product_id: "prod-006", spec_key: "material", spec_label: "Material", spec_value: "Panel multicapa", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-006-3", product_id: "prod-006", spec_key: "scale", spec_label: "Altitud", spec_value: "0–10 niveles", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-006-4", product_id: "prod-006", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "AeroTech", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-007-1", product_id: "prod-007", spec_key: "content", spec_label: "Contenido", spec_value: "1 puesto de mando prefabricado", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-007-2", product_id: "prod-007", spec_key: "material", spec_label: "Material", spec_value: "Resina", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-007-3", product_id: "prod-007", spec_key: "scale", spec_label: "Huella", spec_value: "4 × 4 hexágonos", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-007-4", product_id: "prod-007", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-008-1", product_id: "prod-008", spec_key: "content", spec_label: "Contenido", spec_value: "Pack de terreno modular", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-008-2", product_id: "prod-008", spec_key: "pieces", spec_label: "Piezas", spec_value: "12 piezas de escombros", visibility: ["card","pdp","contents"], sort_order: 2 },
    { id: "spec-prod-008-3", product_id: "prod-008", spec_key: "material", spec_label: "Material", spec_value: "Resina", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-008-4", product_id: "prod-008", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "Alpha Strike", visibility: ["pdp"], sort_order: 4 },
    { id: "spec-prod-009-1", product_id: "prod-009", spec_key: "content", spec_label: "Contenido", spec_value: "3 mapas modulares", visibility: ["card","pdp","contents"], sort_order: 1 },
    { id: "spec-prod-009-2", product_id: "prod-009", spec_key: "format", spec_label: "Zonas", spec_value: "Industrial, centro y periferia", visibility: ["card","pdp"], sort_order: 2 },
    { id: "spec-prod-009-3", product_id: "prod-009", spec_key: "material", spec_label: "Formato", spec_value: "Mapa plegable", visibility: ["pdp"], sort_order: 3 },
    { id: "spec-prod-009-4", product_id: "prod-009", spec_key: "compatibility", spec_label: "Compatibilidad", spec_value: "BattleTech Classic", visibility: ["pdp"], sort_order: 4 },
  ],
  productVariants: [
    { id: "var-prod-001-1", product_id: "prod-001", name: "Monocromo", price: 24.99, swatch_color: "#9CA3AF", image_indices: [0,1], sort_order: 1 },
    { id: "var-prod-007-1", product_id: "prod-007", name: "Monocromo", price: 44.99, swatch_color: "#9CA3AF", image_indices: [0,1], sort_order: 1 },
    { id: "var-prod-007-2", product_id: "prod-007", name: "Color", price: 54.99, swatch_color: "#3B82F6", image_indices: [2,3], sort_order: 2 },
    { id: "var-prod-008-1", product_id: "prod-008", name: "Monocromo", price: 34.99, swatch_color: "#9CA3AF", image_indices: [0,1], sort_order: 1 },
    { id: "var-prod-008-2", product_id: "prod-008", name: "Color", price: 44.99, swatch_color: "#3B82F6", image_indices: [2,3], sort_order: 2 },
  ],
  bundles: [
    { id: "bundle-001", slug: "commander-pack", name: "Commander Pack", description: "El kit completo de herramientas BattleTech Classic: Hex Position Markers, Tactical Heat Dial, Armor Status Sliders y Cluster Hit Quick Wheel.", theme: "BattleTech Classic", price: 81.99, discount_label: "Ahorra 15 % respecto a la compra individual", status: "active", featured: true },
    { id: "bundle-002", slug: "starter-pack", name: "WARDEN Starter Pack", description: "El punto de entrada esencial: Hex Position Markers y Tactical Heat Dial.", theme: "Inicio", price: 39.99, discount_label: "Ahorra 10 % respecto a la compra individual", status: "active", featured: false },
  ],
  bundleItems: [
    { id: "bi-bundle-001-1", bundle_id: "bundle-001", product_id: "prod-001", sort_order: 1 },
    { id: "bi-bundle-001-2", bundle_id: "bundle-001", product_id: "prod-002", sort_order: 2 },
    { id: "bi-bundle-001-3", bundle_id: "bundle-001", product_id: "prod-004", sort_order: 3 },
    { id: "bi-bundle-001-4", bundle_id: "bundle-001", product_id: "prod-005", sort_order: 4 },
    { id: "bi-bundle-002-1", bundle_id: "bundle-002", product_id: "prod-001", sort_order: 1 },
    { id: "bi-bundle-002-2", bundle_id: "bundle-002", product_id: "prod-002", sort_order: 2 },
  ],
  bundleImages: [
    { id: "img-bundle-001-1", bundle_id: "bundle-001", url: "/images/bundles/commander-pack.svg", alt: "Commander Pack", is_primary: true, sort_order: 1, view_type: "main" },
    { id: "img-bundle-002-1", bundle_id: "bundle-002", url: "/images/bundles/starter-pack.svg", alt: "WARDEN Starter Pack", is_primary: true, sort_order: 1, view_type: "main" },
  ],
  bundleSpecs: [
    { id: "spec-bundle-001-1", bundle_id: "bundle-001", spec_key: "content", spec_label: "Contenido", spec_value: "4 productos básicos de BattleTech Classic", visibility: ["bundle","contents"], sort_order: 1 },
    { id: "spec-bundle-001-2", bundle_id: "bundle-001", spec_key: "savings", spec_label: "Ahorro", spec_value: "15 % respecto a la compra individual", visibility: ["bundle"], sort_order: 2 },
    { id: "spec-bundle-001-3", bundle_id: "bundle-001", spec_key: "theme", spec_label: "Temática", spec_value: "BattleTech Classic — Kit completo", visibility: ["bundle"], sort_order: 3 },
    { id: "spec-bundle-002-1", bundle_id: "bundle-002", spec_key: "content", spec_label: "Contenido", spec_value: "2 herramientas esenciales", visibility: ["bundle","contents"], sort_order: 1 },
    { id: "spec-bundle-002-2", bundle_id: "bundle-002", spec_key: "savings", spec_label: "Ahorro", spec_value: "10 % respecto a la compra individual", visibility: ["bundle"], sort_order: 2 },
    { id: "spec-bundle-002-3", bundle_id: "bundle-002", spec_key: "theme", spec_label: "Temática", spec_value: "Inicio — Punto de entrada", visibility: ["bundle"], sort_order: 3 },
  ],
  drops: [
    { id: "drop-001", slug: "city-sector-command-complex", name: "City Sector — Command Complex", description: "A modular urban sector designed for tactical engagements.", theme: "City Terrain", starts_at: "2026-07-20T17:00:00Z", ends_at: "2026-08-10T23:59:59Z", status: "live", thumbnail_url: "/images/drops/steel-edition.svg", price: null /* sin precio comercial aprobado (R053B) */ },
    { id: "drop-002", slug: "wasteland-studios-launch", name: "Wasteland Studios Launch Drop", description: "Lanzamiento de la colección Wasteland Studios.", theme: "Lanzamientos", starts_at: "2026-08-01T17:00:00Z", ends_at: "2026-08-04T16:59:59Z", status: "upcoming", thumbnail_url: "/images/drops/wasteland-launch.svg", price: null /* sin precio → nunca activo */ },
  ],
  dropItems: [
    { id: "di-drop-001-1", drop_id: "drop-001", product_id: "prod-001", sort_order: 1 },
    { id: "di-drop-002-1", drop_id: "drop-002", product_id: "prod-007", sort_order: 1 },
    { id: "di-drop-002-2", drop_id: "drop-002", product_id: "prod-008", sort_order: 2 },
    { id: "di-drop-002-3", drop_id: "drop-002", product_id: "prod-009", sort_order: 3 },
  ],
};

// ── SQL generators ─────────────────────────────────────────────────

function jsonToSql(obj) {
  const keys = Object.keys(obj);
  const vals = keys.map((k) => {
    const v = obj[k];
    if (v === null) return "NULL";
    if (Array.isArray(v)) {
      if (v.length === 0) return "'{}'::text[]";
      // Check if all elements are numbers → int[]
      const allNumbers = v.every((e) => typeof e === "number");
      if (allNumbers) {
        return `ARRAY[${v.join(", ")}]::int[]`;
      }
      // text[]
      const elems = v.map((e) => `'${String(e).replace(/'/g, "''")}'`);
      return `ARRAY[${elems.join(", ")}]::text[]`;
    }
    if (typeof v === "string") return `'${v.replace(/'/g, "''")}'`;
    if (typeof v === "boolean") return v ? "true" : "false";
    return v; // number
  });
  return `(${vals.join(", ")})`;
}

function buildUpsert(table, rows, conflictCol = "id") {
  if (rows.length === 0) return null;
  const keys = Object.keys(rows[0]);
  const cols = keys.map((k) => `"${k}"`).join(", ");
  const updates = keys.map((k) => `"${k}" = excluded."${k}"`).join(", ");
  const values = rows.map((r) => jsonToSql(r)).join(",\n  ");

  return `insert into "${table}" (${cols})
values
  ${values}
on conflict ("${conflictCol}") do update set ${updates};`;
}

// ── Execute ────────────────────────────────────────────────────────

async function upsertTable(label, table, rows, conflictCol = "id") {
  process.stdout.write(`  ${label}... `);
  let sql;
  // For tables with UUID PKs, use ON CONFLICT on their unique constraint
  const uuidPkTables = {
    "product_images": "uq_product_images_sort",
    "product_specs": "uq_product_specs_sort",
    "product_variants": "uq_product_variants_sort",
    "bundle_items": "bundle_items_bundle_id_product_id_key",
    "bundle_images": "uq_bundle_images_sort",
    "bundle_specs": "uq_bundle_specs_sort",
    "drop_items": "drop_items_drop_id_product_id_key",
  };
  if (table in uuidPkTables) {
    // Strip id to let PG generate UUIDs
    const cleanRows = rows.map(({ id, ...rest }) => rest);
    if (cleanRows.length === 0) { console.log(`0 rows, skipping`); return; }
    const keys = Object.keys(cleanRows[0]);
    const cols = keys.map((k) => `"${k}"`).join(", ");
    const updates = keys.map((k) => `"${k}" = excluded."${k}"`).join(", ");
    const values = cleanRows.map((r) => jsonToSql(r)).join(",\n  ");
    sql = `insert into "${table}" (${cols})\nvalues\n  ${values}\non conflict on constraint "${uuidPkTables[table]}" do update set ${updates};`;
  } else {
    if (rows.length === 0) { console.log(`0 rows, skipping`); return; }
    const keys = Object.keys(rows[0]);
    const cols = keys.map((k) => `"${k}"`).join(", ");
    const updates = keys.map((k) => `"${k}" = excluded."${k}"`).join(", ");
    const values = rows.map((r) => jsonToSql(r)).join(",\n  ");
    sql = `insert into "${table}" (${cols})\nvalues\n  ${values}\non conflict ("${conflictCol}") do update set ${updates};`;
  }
  try {
    await runSql(sql);
    console.log(`${rows.length} rows ✅`);
  } catch (err) {
    console.log(`    ❌ FAILED`);
    console.error(`    ${err.message}`);
    throw err;
  }
}

async function main() {
  console.log("\n🚀 WARDEN Catalog Seed — Supabase\n");
  console.log("Project: lnresukfnylczgyookpf\n");

  const steps = [
    ["📦 Collections", "collections", data.collections],
    ["📂 Categories", "categories", data.categories],
    ["🎮 Systems", "compatibility_systems", data.compatibilitySystems],
    ["📜 Licenses", "licenses", data.licenses],
    ["🏷️  Types", "product_types", data.productTypes],
    ["🔧 Products", "products", data.products],
    ["🖼️  Product Images", "product_images", data.productImages],
    ["📋 Product Specs", "product_specs", data.productSpecs],
    ["🎨 Variants", "product_variants", data.productVariants],
    ["📦 Bundles", "bundles", data.bundles],
    ["🔗 Bundle Items", "bundle_items", data.bundleItems],
    ["🖼️  Bundle Images", "bundle_images", data.bundleImages],
    ["📋 Bundle Specs", "bundle_specs", data.bundleSpecs],
    ["🚀 Drops", "drops", data.drops],
    ["🔗 Drop Items", "drop_items", data.dropItems],
  ];

  for (const [label, table, rows] of steps) {
    await upsertTable(label, table, rows);
  }

  // Verify counts
  console.log("\n" + "=".repeat(50));
  console.log("📊 POST-SEED COUNTS");
  console.log("=".repeat(50));

  const tables = [
    "collections", "categories", "compatibility_systems", "licenses",
    "product_types", "products", "product_images", "product_specs",
    "product_variants", "bundles", "bundle_items", "bundle_images",
    "bundle_specs", "drops", "drop_items",
  ];
  for (const t of tables) {
    const res = await runSql(`select count(*) as c from "${t}"`);
    console.log(`  ${t.padEnd(25)} ${res[0]?.c ?? "?"}`);
  }

  console.log("\n✅ Seed completed successfully.\n");
}

main().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});