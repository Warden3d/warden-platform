const fs = require("fs");

let content = fs.readFileSync("src/data/warden-catalog.ts", "utf8");

// Products that need category change to Accesorios (no typology)
// These are tool/accessory products miscategorized as scenery/terrain/maps

const moves = [
  // prod-001: Hex Position Markers — markers, not scenery
  { slug: "hex-position-markers-brass", newCategory: "cat-accesorios", removeType: true },
  // prod-003: Movement Templates — measuring tools, not terrain
  { slug: "alpha-strike-movement-templates", newCategory: "cat-accesorios", removeType: true },
  // prod-006: Altitude Tracker — tracking tool, not maps
  { slug: "aerotech-altitude-tracker", newCategory: "cat-accesorios", removeType: true },
];

for (const m of moves) {
  const slugLine = `    slug: "${m.slug}",`;
  const idx = content.indexOf(slugLine);
  if (idx === -1) { console.log("NOT FOUND:", m.slug); continue; }

  // Find categoryId and typeId lines
  const catStart = content.indexOf("    categoryId:", idx);
  const catEnd = content.indexOf("\n", catStart);
  const oldCat = content.slice(catStart, catEnd);

  // Replace category
  content = content.slice(0, catStart) + `    categoryId: "${m.newCategory}"` + content.slice(catEnd);

  // If removing type, find and remove the typeId line
  if (m.removeType) {
    const typeStart = content.indexOf("    typeId:", idx);
    if (typeStart !== -1 && typeStart < catStart + 200) {
      const typeEnd = content.indexOf("\n", typeStart);
      content = content.slice(0, typeStart) + content.slice(typeEnd + 1);
    }
  }
}

// Products in Terreno that had type-ter-plantilla removed — assign valid type
// prod-003 already moved to Accesorios above

// Products in Escenografía that had type-esc-accesorio removed — assign valid type
// prod-001 already moved to Accesorios above

// Verify no product is in a typed category without a type
const lines = content.split("\n");
let issues = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('categoryId: "cat-escenografia"') || 
      lines[i].includes('categoryId: "cat-terreno"') ||
      lines[i].includes('categoryId: "cat-mapas"')) {
    // Check if next few lines have typeId
    const nextBlock = lines.slice(i, i + 10).join("\n");
    if (!nextBlock.includes("typeId:")) {
      console.log("WARNING: line", i + 1, "has category but no typeId");
    }
  }
}

fs.writeFileSync("src/data/warden-catalog.ts", content);
console.log("Done");
