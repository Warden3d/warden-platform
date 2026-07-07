const fs = require('fs');

let content = fs.readFileSync('src/data/warden-catalog.ts', 'utf8');

// Add "contents" to the visibility of specs that describe what's included
// We add it to specs with key "content" (most products) and "pieces" (prod-008)

content = content.replace(
  /key: "content", label: "Contenido", value: "([^"]+)", visibility: \[([^\]]+)\]/g,
  (match, value, vis) => {
    if (vis.includes('contents')) return match; // already has it
    return `key: "content", label: "Contenido", value: "${value}", visibility: [${vis}, "contents"]`;
  }
);

// Also add for "pieces" key (prod-008)
content = content.replace(
  /key: "pieces", label: "Piezas", value: "([^"]+)", visibility: \[([^\]]+)\]/g,
  (match, value, vis) => {
    if (vis.includes('contents')) return match;
    return `key: "pieces", label: "Piezas", value: "${value}", visibility: [${vis}, "contents"]`;
  }
);

fs.writeFileSync('src/data/warden-catalog.ts', content);
console.log('done');