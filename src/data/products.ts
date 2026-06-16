import type { Product, Collection, Bundle, Drop } from "@/types";

export const products: Product[] = [
  {
    id: "p1",
    slug: "hex-markers-brass",
    name: "Hex Position Markers — Brass Edition",
    subtitle: "Status & LOS Indicators",
    description:
      "Precision-machined brass hex markers designed for BattleTech Classic and Alpha Strike. Each marker sits flush within a standard 1.25-inch hex, providing clear visual cues for unit status, line-of-sight blocking, and terrain conditions without obstructing miniatures or slowing gameplay. The natural brass patina develops over time, giving each set a unique character that reflects its use on the tabletop.",
    descriptionShort:
      "Precision brass markers for unit status, LOS, and terrain. Flush-fit on standard hex maps.",
    specs: {
      Material: "Solid brass, uncoated",
      Size: "Fits standard 1.25-inch hex",
      "Set Contents": "12 markers (4 status, 4 LOS, 4 terrain)",
      Weight: "~4g per marker",
      Compatibility: "BattleTech Classic, Alpha Strike",
    },
    system: "battletech-classic",
    status: "active",
    isFeatured: true,
    thumbnailUrl: "/images/products/hex-markers-brass.jpg",
    images: [
      {
        url: "/images/products/hex-markers-brass.jpg",
        alt: "Hex Position Markers Brass Edition on a hex map",
        isPrimary: true,
      },
    ],
    collectionIds: ["c1"],
  },
  {
    id: "p2",
    slug: "heat-dial-acrylic",
    name: "Tactical Heat Dial",
    subtitle: "Acrylic Heat Tracking System",
    description:
      "A dual-layer acrylic dial that tracks heat scale from 0 to 30 with clear, high-contrast numerals. Designed to replace paper sheets or digital trackers, keeping every pilot's heat management physical, visible, and tactile. The outer ring marks shutdown and ammo explosion thresholds in warning red. Compatible with BattleTech Classic and Alpha Strike heat-tracking systems.",
    descriptionShort:
      "Acrylic heat dial from 0-30 with shutdown and ammo explosion warning marks.",
    specs: {
      Material: "Laser-cut acrylic, dual layer",
      Dimensions: "85mm diameter, 4mm thick",
      "Heat Range": "0 to 30",
      Features:
        "Warning indicators at 14 (shutdown roll) and 26 (ammo explosion)",
    },
    system: "battletech-classic",
    status: "active",
    isFeatured: true,
    thumbnailUrl: "/images/products/heat-dial-acrylic.jpg",
    images: [
      {
        url: "/images/products/heat-dial-acrylic.jpg",
        alt: "Tactical Heat Dial on a game table",
        isPrimary: true,
      },
    ],
    collectionIds: ["c1"],
  },
  {
    id: "p3",
    slug: "movement-templates-set",
    name: "Movement Template Set",
    subtitle: "Alpha Strike Precision Measurement",
    description:
      "A set of five laser-cut acrylic movement templates calibrated for Alpha Strike's movement modes: Stand Still, Walk, Run, Jump, and Sprint. Each template is engraved with its movement mode abbreviation and the corresponding TMM (Target Movement Modifier) value, eliminating table lookups during play. The set includes a storage sleeve with reference card.",
    descriptionShort:
      "Five Alpha Strike movement templates with TMM values engraved. Includes storage sleeve.",
    specs: {
      Material: "Smoke-tinted acrylic, laser engraved",
      Pieces: "5 templates + storage sleeve",
      "Movement Modes": "Stand Still, Walk, Run, Jump, Sprint",
      "TMM Values": "Engraved on each template",
    },
    system: "alpha-strike",
    status: "active",
    isFeatured: true,
    thumbnailUrl: "/images/products/movement-templates.jpg",
    images: [
      {
        url: "/images/products/movement-templates.jpg",
        alt: "Alpha Strike Movement Template Set",
        isPrimary: true,
      },
    ],
    collectionIds: ["c2"],
  },
  {
    id: "p4",
    slug: "aerotech-altitude-tracker",
    name: "AeroTech Altitude & Velocity Tracker",
    subtitle: "Atmospheric Flight Management",
    description:
      "A dual-tracker panel designed for AeroTech atmospheric combat. The altitude slider spans 0-10 atmospheric levels with corresponding gravity effects noted at each tier. The velocity tracker uses a rotating wheel with 16 speed increments. Both components lock into a shared baseplate that fits alongside standard record sheets. Precision-etched aluminum with anodized finish.",
    descriptionShort:
      "Dual-tracker panel for AeroTech altitude (0-10) and velocity (16 increments).",
    specs: {
      Material: "Anodized aluminum with etched markings",
      "Altitude Range": "0 to 10 atmospheric levels",
      "Velocity Range": "16 speed increments (rotating wheel)",
      "Base Dimensions": "180mm x 120mm",
    },
    system: "aerotech",
    status: "active",
    isFeatured: false,
    thumbnailUrl: "/images/products/altitude-tracker.jpg",
    images: [
      {
        url: "/images/products/altitude-tracker.jpg",
        alt: "AeroTech Altitude and Velocity Tracker",
        isPrimary: true,
      },
    ],
    collectionIds: ["c3"],
  },
  {
    id: "p5",
    slug: "armor-status-sliders",
    name: "Armor Status Slider Set",
    subtitle: "Per-Location Armor Tracking",
    description:
      "A set of 8 mini sliders that replace paper record sheets for armor tracking on BattleMechs. Each slider covers one armor location (Head, Center Torso, Left/Right Torso, Arms, Legs) with tactile detents at key thresholds. The baseplate aligns with the standard record sheet layout so all eight sliders remain organized during play. CNC-machined from aluminum composite with laser-etched numbering.",
    descriptionShort:
      "Eight mini sliders for per-location armor tracking. Replaces paper record sheets.",
    specs: {
      Material: "Aluminum composite, laser-etched",
      Pieces: "8 sliders + organizer baseplate",
      Coverage: "Head, CT, LT, RT, LA, RA, LL, RL",
      Features: "Tactile detents at armor thresholds",
    },
    system: "battletech-classic",
    status: "active",
    isFeatured: false,
    thumbnailUrl: "/images/products/armor-sliders.jpg",
    images: [
      {
        url: "/images/products/armor-sliders.jpg",
        alt: "Armor Status Slider Set on a record sheet",
        isPrimary: true,
      },
    ],
    collectionIds: ["c1"],
  },
  {
    id: "p6",
    slug: "cluster-hit-wheel",
    name: "Cluster Hit Quick Wheel",
    subtitle: "Rapid Hit Allocation",
    description:
      "A compact rotating wheel that displays the Cluster Hits Table for missile salvos from 2 to 40. Rotate the outer ring to the salvo size and read the hit count for any roll from 2 to 12 — no more flipping through rulebooks or laminated tables. Double-sided: one face for standard cluster, reverse for LRM/SRM special cases. Fits in a standard dice tray corner.",
    descriptionShort:
      "Rotating reference wheel for Cluster Hits Table (2-40 missiles, roll 2-12).",
    specs: {
      Material: "Brass pin joint, acrylic plates",
      Sides: "Double-sided (standard + LRM/SRM specials)",
      "Salvo Range": "2 to 40 missiles",
      Dimensions: "100mm diameter",
    },
    system: "battletech-classic",
    status: "active",
    isFeatured: false,
    thumbnailUrl: "/images/products/cluster-wheel.jpg",
    images: [
      {
        url: "/images/products/cluster-wheel.jpg",
        alt: "Cluster Hit Quick Wheel",
        isPrimary: true,
      },
    ],
    collectionIds: ["c1"],
  },
  {
    id: "p7",
    slug: "aerotech-thrust-template",
    name: "AeroTech Thrust Vector Template",
    subtitle: "Space Combat Maneuver Tool",
    description:
      "A transparent acrylic template with thrust vector arcs calibrated for AeroTech space combat. Align the template with your fighter's current heading and instantly identify legal thrust expenditure hexes for the current velocity. Markings include safe thrust and max thrust arcs, plus turning radius warnings for high-velocity maneuvers. Includes both standard and advanced movement arcs.",
    descriptionShort:
      "Transparent thrust vector template for AeroTech space combat maneuvers.",
    specs: {
      Material: "Clear acrylic, UV-printed arcs",
      "Arc Types": "Safe thrust, max thrust, turning radius warnings",
      "Velocity Support": "Up to 12 hexes per turn",
      Includes: "Standard + advanced movement arcs",
    },
    system: "aerotech",
    status: "active",
    isFeatured: false,
    thumbnailUrl: "/images/products/thrust-template.jpg",
    images: [
      {
        url: "/images/products/thrust-template.jpg",
        alt: "AeroTech Thrust Vector Template",
        isPrimary: true,
      },
    ],
    collectionIds: ["c3"],
  },
];

export const collections: Collection[] = [
  {
    id: "c1",
    slug: "warden-core",
    name: "WARDEN Core",
    description:
      "The foundational product line for BattleTech Classic players. Precision tools engineered to reduce table clutter, speed up phase execution, and keep the focus on tactical decisions — not rulebook lookups. Brass, aluminum, and acrylic components built to handle hundreds of sessions.",
    thumbnailUrl: "/images/collections/warden-core.jpg",
    productIds: ["p1", "p2", "p5", "p6"],
  },
  {
    id: "c2",
    slug: "alpha-strike-essentials",
    name: "Alpha Strike Essentials",
    description:
      "Streamlined tools designed around Alpha Strike's fast-paced, multi-lance gameplay. Every product eliminates a table lookup or measurement ambiguity so your company-sized engagements run smoothly from deployment to final damage resolution.",
    thumbnailUrl: "/images/collections/alpha-strike.jpg",
    productIds: ["p3"],
  },
  {
    id: "c3",
    slug: "aerotech-command",
    name: "AeroTech Command",
    description:
      "Aerospace combat demands precision in three dimensions. This line covers atmospheric flight management and space combat maneuvering with tools that bridge the gap between the rulebook diagrams and actual tabletop execution.",
    thumbnailUrl: "/images/collections/aerotech.jpg",
    productIds: ["p4", "p7"],
  },
  {
    id: "c4",
    slug: "licenses",
    name: "Licensed Universes",
    description:
      "Collections developed in collaboration with partner studios and independent BattleTech creators. Each licensed collection brings custom tooling and unique aesthetics while maintaining WARDEN's standards for precision, durability, and gameplay-first design.",
    thumbnailUrl: "/images/collections/licenses.jpg",
    productIds: [],
  },
];

export const bundles: Bundle[] = [
  {
    id: "b1",
    slug: "commander-pack",
    name: "Commander Pack",
    description:
      "The complete BattleTech Classic toolkit: Hex Position Markers, Tactical Heat Dial, Armor Status Sliders, and Cluster Hit Quick Wheel. All four Core collection products in one package with a dedicated storage case.",
    discountLabel: "Save 15% vs individual items",
    productIds: ["p1", "p2", "p5", "p6"],
  },
  {
    id: "b2",
    slug: "aerospace-bundle",
    name: "Aerospace Command Bundle",
    description:
      "Altitude & Velocity Tracker plus Thrust Vector Template. Everything you need to run atmospheric and space combat scenarios in AeroTech with precision.",
    discountLabel: "Save 10% vs individual items",
    productIds: ["p4", "p7"],
  },
  {
    id: "b3",
    slug: "starter-kit",
    name: "WARDEN Starter Kit",
    description:
      "The essential entry point: Hex Position Markers and Tactical Heat Dial. The two most-used tools in any BattleTech Classic session, bundled for new WARDEN users.",
    discountLabel: "Save 10% vs individual items",
    productIds: ["p1", "p2"],
  },
];

export const drops: Drop[] = [
  {
    id: "d1",
    slug: "hex-markers-steel-edition",
    name: "Hex Markers — Steel Edition",
    description:
      "A limited production run of our Hex Position Markers in blackened steel. Same precision fit, different material character. This drop is limited to 200 sets and will not be restocked in this finish.",
    startsAt: "2026-07-15T17:00:00Z",
    endsAt: "2026-07-31T23:59:59Z",
    status: "upcoming",
    thumbnailUrl: "/images/drops/steel-edition.jpg",
    productIds: [],
  },
  {
    id: "d2",
    slug: "aerotech-launch",
    name: "AeroTech Launch Drop",
    description:
      "First production run of the AeroTech Command collection. Altitude & Velocity Tracker and Thrust Vector Template available together with exclusive launch pricing for the first 72 hours.",
    startsAt: "2026-06-20T17:00:00Z",
    endsAt: "2026-06-23T16:59:59Z",
    status: "upcoming",
    thumbnailUrl: "/images/drops/aerotech-launch.jpg",
    productIds: [],
  },
];
