import type {
  Product,
  Category,
  Collection,
  CompatibilitySystem,
  License,
  ProductImage,
  ProductSpec,
  Bundle,
  Drop,
  ProductType,
  SpecVisibility,
} from "@/types/warden";

// ─────────────────────────────────────────────────
// Collections
// ─────────────────────────────────────────────────

export const collections: Collection[] = [
  {
    id: "col-warden-core",
    slug: "warden-core",
    name: "WARDEN Core",
    description:
      "Línea principal de herramientas de precisión para BattleTech. Componentes de latón, aluminio y acrílico diseñados para reducir el desorden en la mesa y acelerar cada fase de la partida.",
    thumbnailUrl: "/images/collections/warden-core.svg",
  },
  {
    id: "col-licenses",
    slug: "licenses",
    name: "Licenses",
    description:
      "Colaboraciones con estudios asociados y creadores independientes. Cada colección licenciada aporta estética y herramientas únicas manteniendo los estándares WARDEN de precisión y durabilidad.",
    thumbnailUrl: "/images/collections/licenses.svg",
  },
];

// ─────────────────────────────────────────────────
// Categories
// ─────────────────────────────────────────────────

export const categories: Category[] = [
  {
    id: "cat-escenografia",
    slug: "escenografia",
    name: "Escenografía",
    description: "Piezas decorativas y funcionales para ambientar el tablero de juego.",
  },
  {
    id: "cat-terreno",
    slug: "terreno",
    name: "Terreno",
    description: "Elementos de terreno que afectan el desarrollo táctico de la partida.",
  },
  {
    id: "cat-mapas",
    slug: "mapas",
    name: "Mapas",
    description: "Mapas y tableros modulares listos para usar en diferentes configuraciones.",
  },
  {
    id: "cat-escenarios",
    slug: "escenarios",
    name: "Escenarios",
    description: "Paquetes de escenarios con misiones, objetivos y despliegues predefinidos.",
  },
  {
    id: "cat-accesorios",
    slug: "accesorios",
    name: "Accesorios",
    description: "Accesorios que agilizan la gestión de la partida y reducen consultas al reglamento.",
  },
];

// ─────────────────────────────────────────────────
// Compatibility Systems
// ─────────────────────────────────────────────────

export const compatibilitySystems: CompatibilitySystem[] = [
  {
    id: "comp-battletech-classic",
    slug: "battletech-classic",
    name: "BattleTech Classic",
    description:
      "Sistema de juego de mesa original con énfasis en el detalle táctico por unidad, gestión de calor, blindaje por localización y resolución de impactos por tabla de localización.",
  },
  {
    id: "comp-alpha-strike",
    slug: "alpha-strike",
    name: "Alpha Strike",
    description:
      "Sistema de juego acelerado diseñado para combates multidivisión. Simplifica las estadísticas de cada unidad a una carta y utiliza plantillas de movimiento para agilizar las partidas.",
  },
  {
    id: "comp-aerotech",
    slug: "aerotech",
    name: "AeroTech",
    description:
      "Sistema de combate aeroespacial que cubre maniobras atmosféricas y espaciales con reglas diferenciadas de altitud, velocidad y vectores de empuje.",
  },
];

// ─────────────────────────────────────────────────
// Licenses
// ─────────────────────────────────────────────────

export const licenses: License[] = [
  {
    id: "lic-wasteland-studios",
    name: "Wasteland Studios",
    description:
      "Estudio independiente especializado en escenografía post-apocalíptica y terrenos modulares para wargames de ciencia ficción. Sus diseños se integran con los sistemas de juego de BattleTech manteniendo una estética yerma y desgastada.",
    website: "https://wastelandstudios.example.com",
    logoUrl: "/images/licenses/wasteland-studios.svg",
  },
];

// ─────────────────────────────────────────────────
// Helper to build product images
// ─────────────────────────────────────────────────

function buildImages(productId: string, items: { url: string; alt: string; isPrimary?: boolean; viewType?: ProductImage["viewType"] }[]): ProductImage[] {
  return items.map((item, idx) => ({
    id: `img-${productId}-${idx + 1}`,
    productId,
    url: item.url,
    alt: item.alt,
    isPrimary: item.isPrimary ?? false,
    sortOrder: idx + 1,
    viewType: item.viewType ?? "main",
  }));
}

// ─────────────────────────────────────────────────
// Helper to build product specs
// ─────────────────────────────────────────────────

type SpecEntry = {
  key: string;
  label: string;
  value: string;
  visibility?: SpecVisibility[];
};

function buildSpecs(productId: string, entries: SpecEntry[]): ProductSpec[] {
  return entries.map((entry, idx) => ({
    id: `spec-${productId}-${idx + 1}`,
    productId,
    key: entry.key,
    label: entry.label,
    value: entry.value,
    visibility: entry.visibility ?? ["pdp"],
    sortOrder: idx + 1,
  }));
}

// ─────────────────────────────────────────────────
// Products
// ─────────────────────────────────────────────────

export const products: Product[] = [
  // ── WARDEN Core ──────────────────────────────
  {
    id: "prod-001",
    slug: "hex-position-markers-brass",
    name: "Hex Position Markers — Brass Edition",
    shortDescription:
      "Marcadores de latón para estado de unidad, línea de visión y terreno. Encajan en hexágonos estándar de 1.25\".",
    description:
      "Juego de doce marcadores de latón macizo diseñados para BattleTech Classic y Alpha Strike. Cada marcador se asienta al ras dentro de un hexágono estándar de 1.25 pulgadas, proporcionando indicaciones visuales claras para el estado de la unidad, bloqueo de línea de visión y condiciones del terreno sin obstruir las miniaturas. Cuatro formas diferenciadas táctilmente para identificar cada tipo sin necesidad de mirarlos. El latón natural desarrolla pátina con el uso, dando a cada juego un carácter único que refleja su historia en la mesa de juego.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Latón macizo sin recubrimiento",
    dimensions: { height: 0.3, width: 3.2, depth: 3.2 },
    price: 24.99,
    gameFeatures: [
      "Compatibles con mapas de hexágono estándar de 1.25\"",
      "Cuatro formas diferenciadas para identificación táctil",
      "No obstruyen las miniaturas colocadas en el hexágono",
      "Desarrollan pátina natural con el uso",
    ],
    variants: [
      { name: "Monocromo", price: 24.99, swatchColor: "#9CA3AF", imageIndices: [0, 1] },
    ],
    images: buildImages("prod-001", [
      { url: "/images/products/hex-markers-brass.svg", alt: "Hex Position Markers sobre un mapa hexagonal", isPrimary: true },
      { url: "/images/products/hex-markers-brass-angle.svg", alt: "Detalle de los marcadores de latón" },
    ]),
    status: "active",
    featured: true,
    internalCode: "WDN-CORE-001",
    associatedLicenseId: null,
    weight: 48,
    volume: 3.1,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: ["prod-002", "prod-004", "prod-005"],
    relatedBundleIds: ["bundle-001", "bundle-002"],
    relatedDropIds: ["drop-001"],
    specs: buildSpecs("prod-001", [
      { key: "content", label: "Contenido", value: "12 marcadores (4 estado, 4 LOS, 4 terreno)", visibility: ["card","pdp", "contents"] },
      { key: "weight", label: "Peso unitario", value: "~4 g por marcador", visibility: ["pdp"] },
      { key: "finish", label: "Acabado", value: "Latón natural, sin lacar", visibility: ["card","pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic, Alpha Strike", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-002",
    slug: "tactical-heat-dial",
    name: "Tactical Heat Dial",
    shortDescription:
      "Dial acrílico de doble capa para seguimiento de calor de 0 a 30 con marcas de advertencia.",
    description:
      "Dial de acrílico de doble capa que registra la escala de calor de 0 a 30 con números de alto contraste. Diseñado para reemplazar las hojas de papel o los rastreadores digitales, manteniendo la gestión térmica de cada piloto física, visible y táctil. El anillo exterior marca los umbrales de apagado por calor y explosión de munición en rojo de advertencia. El dial gira suavemente sobre un eje de latón y mantiene la posición incluso si se golpea la mesa.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Acrílico láser cortado, doble capa con eje de latón",
    dimensions: { height: 0.6, width: 8.5, depth: 8.5 },
    price: 18.99,
    gameFeatures: [
      "Rango de calor 0 a 30 con marcas en cada punto",
      "Umbrales de advertencia: tirada de apagado en 14, explosión de munición en 26",
      "Eje de latón que mantiene la posición",
      "Numeración grabada por láser de alto contraste",
    ],
    images: buildImages("prod-002", [
      { url: "/images/products/heat-dial.svg", alt: "Tactical Heat Dial sobre hoja de registro", isPrimary: true },
    ]),
    status: "active",
    featured: true,
    internalCode: "WDN-CORE-002",
    associatedLicenseId: null,
    weight: 32,
    volume: 4.5,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: ["prod-001", "prod-004", "prod-005"],
    relatedBundleIds: ["bundle-001", "bundle-002"],
    relatedDropIds: [],
    specs: buildSpecs("prod-002", [
      { key: "content", label: "Contenido", value: "1 dial acrílico de doble capa", visibility: ["card","pdp", "contents"] },
      { key: "scale", label: "Rango", value: "0–30 de calor", visibility: ["pdp"] },
      { key: "material", label: "Material", value: "Acrílico transparente", visibility: ["card","pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-003",
    slug: "alpha-strike-movement-templates",
    name: "Alpha Strike Movement Template Set",
    shortDescription:
      "Cinco plantillas acrílicas para los modos de movimiento de Alpha Strike con valores TMM grabados.",
    description:
      "Juego de cinco plantillas de movimiento cortadas por láser en acrílico ahumado, calibradas para los modos de movimiento de Alpha Strike: Stand Still, Walk, Run, Jump y Sprint. Cada plantilla lleva grabada la abreviatura del modo de movimiento y el valor TMM (Target Movement Modifier) correspondiente, eliminando las consultas a la tabla durante la partida. El juego incluye una funda de almacenamiento con tarjeta de referencia rápida. Las plantillas son transparentes para permitir ver el terreno debajo durante la colocación.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-alpha-strike",
    scale: "1:265",
    material: "Acrílico ahumado con grabado láser",
    dimensions: { height: 0.3, width: 15, depth: 10 },
    price: 22.99,
    gameFeatures: [
      "Modos: Stand Still, Walk, Run, Jump, Sprint",
      "Valor TMM grabado en cada plantilla",
      "Acrílico transparente para visibilidad del terreno",
      "Funda de almacenamiento con tarjeta de referencia",
    ],
    images: buildImages("prod-003", [
      { url: "/images/products/movement-templates.svg", alt: "Plantillas de movimiento Alpha Strike", isPrimary: true },
    ]),
    status: "active",
    featured: true,
    internalCode: "WDN-CORE-003",
    associatedLicenseId: null,
    weight: 38,
    volume: 5.2,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: [],
    relatedBundleIds: [],
    relatedDropIds: [],
    specs: buildSpecs("prod-003", [
      { key: "content", label: "Contenido", value: "5 plantillas acrílicas", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Acrílico transparente", visibility: ["card","pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "Alpha Strike", visibility: ["pdp"] },
      { key: "finish", label: "Acabado", value: "Marcas TMM grabadas", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-004",
    slug: "armor-status-sliders",
    name: "Armor Status Slider Set",
    shortDescription:
      "Ocho deslizadores para seguimiento de blindaje por localización. Reemplaza las hojas de registro de papel.",
    description:
      "Juego de ocho minideslizadores que reemplazan las hojas de registro de papel para el control de blindaje en BattleMechs. Cada deslizador cubre una localización de blindaje (Cabeza, Tórax Central, Tórax Izquierdo/Derecho, Brazos, Piernas) con topes táctiles en los umbrales clave. La base se alinea con el diseño estándar de la hoja de registro para mantener los ocho deslizadores organizados durante la partida. Fabricado en compuesto de aluminio con numeración grabada por láser. Los deslizadores se mueven con la presión justa: no se desplazan accidentalmente pero se ajustan sin esfuerzo.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Compuesto de aluminio con grabado láser",
    dimensions: { height: 1.8, width: 10, depth: 8 },
    price: 34.99,
    gameFeatures: [
      "Ocho localizaciones: Cabeza, CT, LT, RT, LA, RA, LL, RL",
      "Topes táctiles en umbrales de blindaje",
      "Base organizadora alineada con hoja de registro estándar",
      "Resistencia ajustada para evitar desplazamiento accidental",
    ],
    images: buildImages("prod-004", [
      { url: "/images/products/armor-sliders.svg", alt: "Deslizadores de blindaje sobre hoja de registro", isPrimary: true },
    ]),
    status: "active",
    featured: false,
    internalCode: "WDN-CORE-004",
    associatedLicenseId: null,
    weight: 85,
    volume: 14.4,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: ["prod-001", "prod-002", "prod-005"],
    relatedBundleIds: ["bundle-001"],
    relatedDropIds: [],
    specs: buildSpecs("prod-004", [
      { key: "content", label: "Contenido", value: "8 deslizadores de blindaje", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Plástico rígido", visibility: ["card","pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic", visibility: ["pdp"] },
      { key: "finish", label: "Acabado", value: "Escala impresa", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-005",
    slug: "cluster-hit-quick-wheel",
    name: "Cluster Hit Quick Wheel",
    shortDescription:
      "Rueda giratoria para la tabla de impactos de ráfaga de 2 a 40 misiles. Sin consultas al reglamento.",
    description:
      "Rueda giratoria compacta que muestra la tabla de impactos de ráfaga (Cluster Hits Table) para salvas de misiles de 2 a 40. Gira el anillo exterior hasta el tamaño de la salva y lee el número de impactos para cualquier resultado de 2 a 12. Sin necesidad de hojear reglamentos ni tablas laminadas. Doble cara: una cara para ráfaga estándar, la reversa para casos especiales de LRM/SRM. Cabe en la esquina de cualquier bandeja de dados. El mecanismo de latón garantiza un giro suave y duradero.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Eje de latón con platos de acrílico",
    dimensions: { height: 0.5, width: 10, depth: 10 },
    price: 16.99,
    gameFeatures: [
      "Rango de salvas: 2 a 40 misiles",
      "Resultados de 2 a 12 sin cálculo adicional",
      "Doble cara: estándar y LRM/SRM especiales",
      "Tamaño compacto para bandeja de dados",
    ],
    images: buildImages("prod-005", [
      { url: "/images/products/cluster-wheel.svg", alt: "Cluster Hit Quick Wheel", isPrimary: true },
    ]),
    status: "active",
    featured: false,
    internalCode: "WDN-CORE-005",
    associatedLicenseId: null,
    weight: 28,
    volume: 5,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: ["prod-001", "prod-002", "prod-004"],
    relatedBundleIds: ["bundle-001"],
    relatedDropIds: [],
    specs: buildSpecs("prod-005", [
      { key: "content", label: "Contenido", value: "1 rueda giratoria", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Plástico con eje metálico", visibility: ["card","pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic", visibility: ["pdp"] },
      { key: "finish", label: "Acabado", value: "Sistema de clic por incremento", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-006",
    slug: "aerotech-altitude-tracker",
    name: "AeroTech Altitude & Velocity Tracker",
    shortDescription:
      "Panel de doble seguimiento para altitud atmosférica (0-10) y velocidad (16 incrementos) en AeroTech.",
    description:
      "Panel de doble seguimiento diseñado para el combate atmosférico de AeroTech. El deslizador de altitud abarca 10 niveles atmosféricos con los efectos de gravedad correspondientes indicados en cada escalón. El rastreador de velocidad utiliza una rueda giratoria con 16 incrementos de velocidad. Ambos componentes se acoplan a una base compartida que encaja junto a las hojas de registro estándar. Fabricado en aluminio de precisión con acabado anodizado y marcas grabadas que no se borran con el uso.",
    collectionId: "col-warden-core",
    categoryId: "cat-accesorios",
    typeId: "",
    compatibilityId: "comp-aerotech",
    scale: "1:265",
    material: "Aluminio anodizado con marcas grabadas",
    dimensions: { height: 0.4, width: 18, depth: 12 },
    price: 29.99,
    gameFeatures: [
      "Altitud de 0 a 10 niveles atmosféricos",
      "Velocidad en rueda giratoria de 16 incrementos",
      "Efectos de gravedad indicados por nivel",
      "Base compartida que encaja con hojas de registro",
    ],
    images: buildImages("prod-006", [
      { url: "/images/products/altitude-tracker.svg", alt: "AeroTech Altitude and Velocity Tracker", isPrimary: true },
    ]),
    status: "active",
    featured: false,
    internalCode: "WDN-CORE-006",
    associatedLicenseId: null,
    weight: 72,
    volume: 8.6,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: [],
    relatedBundleIds: [],
    relatedDropIds: [],
    specs: buildSpecs("prod-006", [
      { key: "content", label: "Contenido", value: "1 panel de doble seguimiento", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Panel multicapa", visibility: ["card","pdp"] },
      { key: "scale", label: "Altitud", value: "0–10 niveles", visibility: ["pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "AeroTech", visibility: ["pdp"] }
    ]),
  },

  // ── Wasteland Studios (Licensed) ──────────────
  {
    id: "prod-007",
    slug: "wasteland-command-post",
    name: "Wasteland Command Post",
    shortDescription:
      "Puesto de mando prefabricado en resina con diseño post-apocalíptico. Pieza central para escenografía de mesa.",
    description:
      "Puesto de mando fortificado diseñado por Wasteland Studios para sus líneas de escenografía post-apocalíptica. La estructura mide 150 × 100 mm en base y presenta muros de hormigón agrietado, barricadas de metralla y una antena parabólica inclinada. El interior es accesible para colocar miniaturas de infantería o marcadores de cuartel general. Compatible con mapas de hexágono estándar y sistemas de juego BattleTech Classic. Suministrado sin pintar, listo para imprimación y pintura acrílica.",
    collectionId: "col-licenses",
    categoryId: "cat-escenografia",
    typeId: "type-esc-militar",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Resina de poliuretano, suministrada sin pintar",
    dimensions: { height: 6, width: 15, depth: 10 },
    price: 44.99,
    gameFeatures: [
      "Interior accesible para miniaturas",
      "Base compatible con hexágonos estándar",
      "Diseño original de Wasteland Studios",
      "Listo para imprimación y pintura acrílica",
    ],
    variants: [
      { name: "Monocromo", price: 44.99, swatchColor: "#9CA3AF", imageIndices: [0, 1] },
      { name: "Color", price: 54.99, swatchColor: "#3B82F6", imageIndices: [2, 3] },
    ],
    images: buildImages("prod-007", [
      { url: "/images/products/wasteland-command-post.svg", alt: "Wasteland Command Post — Monocromo frontal", isPrimary: true },
      { url: "/images/products/wasteland-command-post-angle.svg", alt: "Wasteland Command Post — Monocromo lateral" },
      { url: "/images/products/wasteland-command-post-color.svg", alt: "Wasteland Command Post — Color frontal", isPrimary: true },
      { url: "/images/products/wasteland-command-post-color-angle.svg", alt: "Wasteland Command Post — Color lateral" },
    ]),
    status: "active",
    featured: true,
    internalCode: "WDN-LIC-WS-001",
    associatedLicenseId: "lic-wasteland-studios",
    weight: 185,
    volume: 90,
    printTime: 7.5,
    version: "1.0.0",
    relatedProductIds: ["prod-008", "prod-009"],
    relatedBundleIds: [],
    relatedDropIds: ["drop-002"],
    specs: buildSpecs("prod-007", [
      { key: "content", label: "Contenido", value: "1 puesto de mando prefabricado", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Resina", visibility: ["card","pdp"] },
      { key: "scale", label: "Huella", value: "4 × 4 hexágonos", visibility: ["pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-008",
    slug: "scavenger-terrain-pack",
    name: "Scavenger's Terrain Pack",
    shortDescription:
      "Pack de terreno modular post-apocalíptico. Escombros, vehículos abandonados y barricadas.",
    description:
      "Pack de siete piezas de terreno modular diseñado por Wasteland Studios para crear tableros de juego ambientados en zonas devastadas. Incluye dos montones de escombros, un vehículo civil abandonado a escala 1:265, tres barricadas de hormigón armado y una excavadora oxidada que funciona como cobertura total. Todas las piezas encajan en hexágonos estándar de 1.25\" y pueden combinarse entre sí para formar obstáculos más grandes. Suministradas sin pintar en resina gris.",
    collectionId: "col-licenses",
    categoryId: "cat-terreno",
    typeId: "type-ter-ruinas-escombros",
    compatibilityId: "comp-alpha-strike",
    scale: "1:265",
    material: "Resina de poliuretano, suministrada sin pintar",
    dimensions: { height: 4, width: 25, depth: 20 },
    price: 34.99,
    gameFeatures: [
      "Siete piezas de terreno modular",
      "Compatibles con hexágonos estándar",
      "Piezas combinables para cobertura total",
      "Diseño original de Wasteland Studios",
    ],
    variants: [
      { name: "Monocromo", price: 34.99, swatchColor: "#9CA3AF", imageIndices: [0, 1] },
      { name: "Color", price: 44.99, swatchColor: "#3B82F6", imageIndices: [2, 3] },
    ],
    images: buildImages("prod-008", [
      { url: "/images/products/scavenger-terrain-pack.svg", alt: "Scavenger's Terrain Pack — Monocromo frontal", isPrimary: true },
      { url: "/images/products/scavenger-terrain-pack-angle.svg", alt: "Scavenger's Terrain Pack — Monocromo lateral" },
      { url: "/images/products/scavenger-terrain-pack-color.svg", alt: "Scavenger's Terrain Pack — Color frontal", isPrimary: true },
      { url: "/images/products/scavenger-terrain-pack-color-angle.svg", alt: "Scavenger's Terrain Pack — Color lateral" },
    ]),
    status: "active",
    featured: false,
    internalCode: "WDN-LIC-WS-002",
    associatedLicenseId: "lic-wasteland-studios",
    weight: 210,
    volume: 120,
    printTime: 12,
    version: "1.0.0",
    relatedProductIds: ["prod-007", "prod-009"],
    relatedBundleIds: [],
    relatedDropIds: ["drop-002"],
    specs: buildSpecs("prod-008", [
      { key: "content", label: "Contenido", value: "Pack de terreno modular", visibility: ["card","pdp", "contents"] },
      { key: "pieces", label: "Piezas", value: "12 piezas de escombros", visibility: ["card","pdp", "contents"] },
      { key: "material", label: "Material", value: "Resina", visibility: ["pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "Alpha Strike", visibility: ["pdp"] }
    ]),
  },
  {
    id: "prod-009",
    slug: "fallen-city-map-pack",
    name: "Fallen City Map Pack",
    shortDescription:
      "Tres mapas modulares de ciudad en ruinas para BattleTech. Zona industrial, centro y periferia.",
    description:
      "Tres mapas modulares de doble cara diseñados en colaboración con Wasteland Studios. Representan una ciudad caída dividida en tres sectores: zona industrial con almacenes y grúas derrumbadas, centro urbano con edificios gubernamentales semiderruidos, y periferia residencial con calles bloqueadas por escombros. Cada mapa mide 22\" × 17\" (estándar BattleTech) e incluye marcadores de edificios, zonas de entrada y salida, y notas de escenario en los bordes. Impresos en papel satinado de 300 g/m² con plegado resistente.",
    collectionId: "col-licenses",
    categoryId: "cat-mapas",
    typeId: "type-map-urbano",
    compatibilityId: "comp-battletech-classic",
    scale: "1:265",
    material: "Papel satinado de 300 g/m², impresión digital",
    dimensions: { height: 0.2, width: 55.9, depth: 43.2 },
    price: 28.99,
    gameFeatures: [
      "Tres sectores: industrial, centro, periferia",
      "Formato 22\" × 17\" estándar BattleTech",
      "Doble cara con variaciones de escenario",
      "Incluye marcadores de edificios y notas de escenario",
    ],
    images: buildImages("prod-009", [
      { url: "/images/products/fallen-city-map-pack.svg", alt: "Fallen City Map Pack — mapa del centro urbano", isPrimary: true },
    ]),
    status: "active",
    featured: false,
    internalCode: "WDN-LIC-WS-003",
    associatedLicenseId: "lic-wasteland-studios",
    weight: 120,
    volume: 5,
    printTime: 0,
    version: "1.0.0",
    relatedProductIds: ["prod-007", "prod-008"],
    relatedBundleIds: [],
    relatedDropIds: ["drop-002"],
    specs: buildSpecs("prod-009", [
      { key: "content", label: "Contenido", value: "3 mapas modulares", visibility: ["card","pdp", "contents"] },
      { key: "format", label: "Zonas", value: "Industrial, centro y periferia", visibility: ["card","pdp"] },
      { key: "material", label: "Formato", value: "Mapa plegable", visibility: ["pdp"] },
      { key: "compatibility", label: "Compatibilidad", value: "BattleTech Classic", visibility: ["pdp"] }
    ]),
  },
];

// ─────────────────────────────────────────────────
// Bundles
// ─────────────────────────────────────────────────

const bundleImage = buildImages("bundle-001", [
  { url: "/images/bundles/commander-pack.svg", alt: "Commander Pack", isPrimary: true },
]);
const starterImage = buildImages("bundle-002", [
  { url: "/images/bundles/starter-pack.svg", alt: "WARDEN Starter Pack", isPrimary: true },
]);

export const bundles: Bundle[] = [
  {
    id: "bundle-001",
    slug: "commander-pack",
    name: "Commander Pack",
    description:
      "El kit completo de herramientas BattleTech Classic: Hex Position Markers, Tactical Heat Dial, Armor Status Sliders y Cluster Hit Quick Wheel. Los cuatro productos de la colección Core en un solo paquete con estuche de almacenamiento dedicado.",
    theme: "BattleTech Classic",
    price: 81.99,
    discountLabel: "Ahorra 15 % respecto a la compra individual",
    productIds: ["prod-001", "prod-002", "prod-004", "prod-005"],
    images: bundleImage,
    status: "active",
    featured: true,
  },
  {
    id: "bundle-002",
    slug: "starter-pack",
    name: "WARDEN Starter Pack",
    description:
      "El punto de entrada esencial: Hex Position Markers y Tactical Heat Dial. Las dos herramientas más utilizadas en cualquier partida de BattleTech Classic, empaquetadas para nuevos usuarios de WARDEN.",
    theme: "Inicio",
    price: 39.99,
    discountLabel: "Ahorra 10 % respecto a la compra individual",
    productIds: ["prod-001", "prod-002"],
    images: starterImage,
    status: "active",
    featured: false,
  },
];

// ─────────────────────────────────────────────────
// Drops
// ─────────────────────────────────────────────────

export const drops: Drop[] = [
  {
    id: "drop-001",
    slug: "hex-markers-steel-edition",
    name: "Hex Markers — Steel Edition",
    description:
      "Edición limitada de nuestros Hex Position Markers en acero ennegrecido. La misma precisión de ajuste, un carácter material diferente. Esta tirada está limitada a 200 juegos y no se repondrá en este acabado. Cada juego incluye un certificado de autenticación numerado.",
    theme: "Ediciones Especiales",
    startsAt: "2026-07-15T17:00:00Z",
    endsAt: "2026-07-31T23:59:59Z",
    status: "live",
    thumbnailUrl: "/images/drops/steel-edition.svg",
    productIds: ["prod-001"],
  },
  {
    id: "drop-002",
    slug: "wasteland-studios-launch",
    name: "Wasteland Studios Launch Drop",
    description:
      "Lanzamiento de la colección Wasteland Studios. Los tres productos iniciales —Command Post, Terrain Pack y City Map Pack— disponibles con precios de lanzamiento durante las primeras 72 horas. Los pedidos realizados durante el drop incluyen un parche bordado exclusivo de Wasteland Studios.",
    theme: "Lanzamientos",
    startsAt: "2026-08-01T17:00:00Z",
    endsAt: "2026-08-04T16:59:59Z",
    status: "upcoming",
    thumbnailUrl: "/images/drops/wasteland-launch.svg",
    productIds: ["prod-007", "prod-008", "prod-009"],
  },
];

// ─────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────

export function getActiveProducts(): Product[] {
  return products.filter((p) => p.status === "active");
}

// ─────────────────────────────────────────────────
// Product Types
// ─────────────────────────────────────────────────
// ⚠ Provisional — pendiente de revisión de taxonomía para Mapas, Escenarios


export const productTypes: ProductType[] = [
  // ── Escenografía (ACTIVA) ──
  { id: "type-esc-residencial",      categoryId: "cat-escenografia",     name: "Residencial" },
  { id: "type-esc-comercial",        categoryId: "cat-escenografia",     name: "Comercial" },
  { id: "type-esc-administrativo",   categoryId: "cat-escenografia",     name: "Administrativo" },
  { id: "type-esc-industrial",       categoryId: "cat-escenografia",     name: "Industrial" },
  { id: "type-esc-energetico",       categoryId: "cat-escenografia",     name: "Energético" },
  { id: "type-esc-militar",          categoryId: "cat-escenografia",     name: "Militar" },
  { id: "type-esc-comunicaciones",   categoryId: "cat-escenografia",     name: "Comunicaciones" },
  { id: "type-esc-aeroespacial",     categoryId: "cat-escenografia",     name: "Aeroespacial" },
  { id: "type-esc-infraestructura",  categoryId: "cat-escenografia",     name: "Infraestructura" },

  // ── Terreno (ACTIVA) ──
  { id: "type-ter-vegetacion",       categoryId: "cat-terreno",          name: "Vegetación" },
  { id: "type-ter-relieve",          categoryId: "cat-terreno",          name: "Relieve" },
  { id: "type-ter-agua",             categoryId: "cat-terreno",          name: "Agua" },
  { id: "type-ter-terreno-dificil",  categoryId: "cat-terreno",          name: "Terreno difícil" },
  { id: "type-ter-ruinas-escombros", categoryId: "cat-terreno",          name: "Ruinas y escombros" },

  // ── Mapas (ACTIVA) ──
  { id: "type-map-urbano",           categoryId: "cat-mapas",            name: "Urbano" },
  { id: "type-map-natural",          categoryId: "cat-mapas",            name: "Natural" },
  { id: "type-map-industrial-militar", categoryId: "cat-mapas",          name: "Industrial/Militar" },
  { id: "type-map-costero-naval",    categoryId: "cat-mapas",            name: "Costero/Naval" },

  // ── Escenarios (PENDIENTE DE DEFINICIÓN — sin tipologías) ──
  // ── Accesorios (ACTIVA — sin tipologías en V1.0) ──
];


export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCollection(collectionSlug: string): Product[] {
  const col = collections.find((c) => c.slug === collectionSlug);
  if (!col) return [];
  return products.filter((p) => p.collectionId === col.id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const cat = categories.find((c) => c.slug === categorySlug);
  if (!cat) return [];
  return products.filter((p) => p.categoryId === cat.id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured && p.status === "active");
}

export function getActiveDrops(): Drop[] {
  return drops.filter((d) => d.status === "live");
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((b) => b.slug === slug);
}

export function getDropBySlug(slug: string): Drop | undefined {
  return drops.find((d) => d.slug === slug);
}

export function getProductsByIds(ids: string[]): Product[] {
  return products.filter((p) => ids.includes(p.id) && p.status === "active");
}
