const fs = require('fs');

let content = fs.readFileSync('src/data/warden-catalog.ts', 'utf8');

// Replace old-style buildSpecs calls with new SpecEntry[] format
// Each replacement transforms a Record<string,string> into SpecEntry[]

const specs = [
  // prod-001 — Hex Position Markers
  { id: 'prod-001', entries: [
    { key: 'content', label: 'Contenido', value: '12 marcadores (4 estado, 4 LOS, 4 terreno)', vis: ['card','pdp'] },
    { key: 'weight', label: 'Peso unitario', value: '~4 g por marcador', vis: ['pdp'] },
    { key: 'finish', label: 'Acabado', value: 'Latón natural, sin lacar', vis: ['card','pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic, Alpha Strike', vis: ['pdp'] },
  ]},
  // prod-002 — Tactical Heat Dial
  { id: 'prod-002', entries: [
    { key: 'content', label: 'Contenido', value: '1 dial acrílico de doble capa', vis: ['card','pdp'] },
    { key: 'scale', label: 'Rango', value: '0–30 de calor', vis: ['pdp'] },
    { key: 'material', label: 'Material', value: 'Acrílico transparente', vis: ['card','pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic', vis: ['pdp'] },
  ]},
  // prod-003 — Alpha Strike Movement Templates
  { id: 'prod-003', entries: [
    { key: 'content', label: 'Contenido', value: '5 plantillas acrílicas', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Acrílico transparente', vis: ['card','pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'Alpha Strike', vis: ['pdp'] },
    { key: 'finish', label: 'Acabado', value: 'Marcas TMM grabadas', vis: ['pdp'] },
  ]},
  // prod-004 — Armor Status Sliders
  { id: 'prod-004', entries: [
    { key: 'content', label: 'Contenido', value: '8 deslizadores de blindaje', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Plástico rígido', vis: ['card','pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic', vis: ['pdp'] },
    { key: 'finish', label: 'Acabado', value: 'Escala impresa', vis: ['pdp'] },
  ]},
  // prod-005 — Cluster Hit Quick Wheel
  { id: 'prod-005', entries: [
    { key: 'content', label: 'Contenido', value: '1 rueda giratoria', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Plástico con eje metálico', vis: ['card','pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic', vis: ['pdp'] },
    { key: 'finish', label: 'Acabado', value: 'Sistema de clic por incremento', vis: ['pdp'] },
  ]},
  // prod-006 — AeroTech Altitude Tracker
  { id: 'prod-006', entries: [
    { key: 'content', label: 'Contenido', value: '1 panel de doble seguimiento', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Panel multicapa', vis: ['card','pdp'] },
    { key: 'scale', label: 'Altitud', value: '0–10 niveles', vis: ['pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'AeroTech', vis: ['pdp'] },
  ]},
  // prod-007 — Wasteland Command Post
  { id: 'prod-007', entries: [
    { key: 'content', label: 'Contenido', value: '1 puesto de mando prefabricado', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Resina', vis: ['card','pdp'] },
    { key: 'scale', label: 'Huella', value: '4 × 4 hexágonos', vis: ['pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic', vis: ['pdp'] },
  ]},
  // prod-008 — Scavenger's Terrain Pack
  { id: 'prod-008', entries: [
    { key: 'content', label: 'Contenido', value: 'Pack de terreno modular', vis: ['card','pdp'] },
    { key: 'pieces', label: 'Piezas', value: '12 piezas de escombros', vis: ['card','pdp'] },
    { key: 'material', label: 'Material', value: 'Resina', vis: ['pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'Alpha Strike', vis: ['pdp'] },
  ]},
  // prod-009 — Fallen City Map Pack
  { id: 'prod-009', entries: [
    { key: 'content', label: 'Contenido', value: '3 mapas modulares', vis: ['card','pdp'] },
    { key: 'format', label: 'Zonas', value: 'Industrial, centro y periferia', vis: ['card','pdp'] },
    { key: 'material', label: 'Formato', value: 'Mapa plegable', vis: ['pdp'] },
    { key: 'compatibility', label: 'Compatibilidad', value: 'BattleTech Classic', vis: ['pdp'] },
  ]},
];

for (const spec of specs) {
  const oldCall = new RegExp(
    `specs: buildSpecs\\("${spec.id}", \\{[\\s\\S]*?\\}\\)`,
    'g'
  );
  const entries = spec.entries.map(e => {
    const vis = JSON.stringify(e.vis);
    return `      { key: "${e.key}", label: "${e.label}", value: "${e.value}", visibility: ${vis} }`;
  }).join(',\n');
  const newCall = `specs: buildSpecs("${spec.id}", [\n${entries}\n    ])`;
  content = content.replace(oldCall, newCall);
}

fs.writeFileSync('src/data/warden-catalog.ts', content);
console.log('done');