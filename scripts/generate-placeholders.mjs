import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";

const PUBLIC = resolve("public/images");

function hexFromType(type) {
  return { product: "#1a2a3a", bundle: "#2a1a3a", collection: "#1a3a2a", drop: "#3a2a1a", license: "#2a2a3a" }[type] || "#1a2a3a";
}

function accentFromType(type) {
  return { product: "#4a7a9a", bundle: "#7a4a9a", collection: "#4a9a7a", drop: "#9a7a4a", license: "#6a6a9a" }[type] || "#4a7a9a";
}

function adjustColor(hex, amount) {
  const num = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((num >> 16) & 0xff) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amount));
  const b = Math.max(0, Math.min(255, (num & 0xff) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

function escapeXml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function generateSvg(label, type) {
  const bg = hexFromType(type);
  const accent = accentFromType(type);
  const lines = label.split("\n");
  const isProduct = type === "product";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg}"/>
      <stop offset="100%" style="stop-color:${adjustColor(bg, -20)}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)" rx="0"/>
  <rect x="80" y="80" width="640" height="440" fill="none" stroke="${accent}" stroke-width="1" rx="4"/>
  <line x1="80" y1="120" x2="720" y2="120" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <line x1="80" y1="560" x2="720" y2="560" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <line x1="120" y1="80" x2="120" y2="520" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <line x1="680" y1="80" x2="680" y2="520" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <text x="400" y="260" text-anchor="middle" fill="${accent}" font-family="monospace" font-size="14" letter-spacing="4" opacity="0.6">PLACEHOLDER</text>
  ${lines.map((ln, i) => `<text x="400" y="${300 + i * 28}" text-anchor="middle" fill="#ffffff" font-family="sans-serif" font-size="${isProduct ? 20 : 24}" font-weight="600" opacity="0.85">${escapeXml(ln)}</text>`).join("\n  ")}
  <circle cx="400" cy="180" r="30" fill="none" stroke="${accent}" stroke-width="1" opacity="0.4"/>
  <circle cx="400" cy="180" r="15" fill="none" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <line x1="370" y1="180" x2="430" y2="180" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <line x1="400" y1="150" x2="400" y2="210" stroke="${accent}" stroke-width="0.5" opacity="0.3"/>
  <text x="400" y="580" text-anchor="middle" fill="${accent}" font-family="monospace" font-size="10" letter-spacing="2" opacity="0.4">WARDEN — ${type.toUpperCase()}</text>
</svg>`;
}

const placeholders = [
  { path: "products/hex-markers-brass.jpg", label: "Hex Position Markers\nBrass Edition", type: "product" },
  { path: "products/hex-markers-brass-angle.jpg", label: "Hex Markers\nAngle View", type: "product" },
  { path: "products/heat-dial.jpg", label: "Tactical Heat Dial", type: "product" },
  { path: "products/movement-templates.jpg", label: "Movement Templates", type: "product" },
  { path: "products/armor-sliders.jpg", label: "Armor Sliders", type: "product" },
  { path: "products/cluster-wheel.jpg", label: "Cluster Hit Wheel", type: "product" },
  { path: "products/altitude-tracker.jpg", label: "Altitude Tracker", type: "product" },
  { path: "products/wasteland-command-post.jpg", label: "Wasteland\nCommand Post", type: "product" },
  { path: "products/scavenger-terrain-pack.jpg", label: "Scavenger's\nTerrain Pack", type: "product" },
  { path: "products/fallen-city-map-pack.jpg", label: "Fallen City\nMap Pack", type: "product" },
  { path: "bundles/commander-pack.jpg", label: "Commander Pack", type: "bundle" },
  { path: "bundles/starter-pack.jpg", label: "Starter Pack", type: "bundle" },
  { path: "collections/warden-core.jpg", label: "WARDEN Core", type: "collection" },
  { path: "collections/licenses.jpg", label: "Licencias", type: "collection" },
  { path: "drops/steel-edition.jpg", label: "Steel Edition", type: "drop" },
  { path: "drops/wasteland-launch.jpg", label: "Wasteland Launch", type: "drop" },
  { path: "licenses/wasteland-studios.png", label: "Wasteland\nStudios", type: "license" },
];

for (const p of placeholders) {
  const dest = resolve(PUBLIC, p.path);
  const destDir = dest.substring(0, dest.lastIndexOf("/"));
  if (!existsSync(destDir)) mkdirSync(destDir, { recursive: true });
  writeFileSync(dest.replace(/\.(jpg|png)$/, ".svg"), generateSvg(p.label, p.type));
  console.log("Created:", dest.replace(/\.(jpg|png)$/, ".svg"));
}
