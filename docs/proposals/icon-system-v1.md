# Propuesta: Sistema de iconografía reutilizable para WARDEN

**Autor**: Desarrollo WDN-WEB-R001
**Estado**: Propuesta | **Prioridad**: Media
**Depende de**: WDN-WEB-R001 (implementado)

---

## 1. Contexto

Durante la convergencia con la Design Reference (WDN-WEB-R001), se identificó que el bloque de características principales del producto (`gameFeatures`) utiliza actualmente frases completas en una lista vertical con checkmark. La Design Reference muestra un grid de iconos con textos breves, pero los datos actuales no lo permiten y desarrollar un sistema de iconografía propio requería una decisión de diseño independiente.

Se acordó una solución provisional (lista vertical sin tarjeta) y se dejó pendiente una propuesta formal de sistema de iconos reutilizable para toda la plataforma.

---

## 2. Objetivo

Diseñar un sistema de iconografía que:

- Permita representar características de producto con icono + texto breve.
- Sea reutilizable en productos, bundles, colecciones y cualquier otra entidad del catálogo.
- Se integre con el design system existente (Tailwind 4, lucide-react, tokens CSS de WARDEN).
- Requiera cambios mínimos en el modelo de datos y cero en la lógica de negocio existente.

---

## 3. Modelo de datos

### 3.1. Nuevo tipo `ProductFeature`

```ts
// En src/types/warden.ts

export interface ProductFeature {
  id: string;
  productId: string;
  icon: string;       // nombre del icono en lucide-react (ej: "Ruler", "Cube", "Shield")
  label: string;      // texto corto (ej: "Escala 1:265")
  description?: string; // texto opcional más largo (tooltip / hover)
  sortOrder: number;
}
```

### 3.2. Cambio en `Product`

Reemplazar el campo actual:

```ts
// Actual
gameFeatures: string[];

// Propuesto
gameFeatures: string[];     // ← se mantiene para compatibilidad
features: ProductFeature[]; // ← nuevo campo, opcional
```

> `gameFeatures` se conserva como respaldo: si `features` está vacío, el sistema cae en la lista provisional actual. Esto permite migrar productos uno a uno sin romper nada.

### 3.3. Datos semilla (ejemplo para productos existentes)

```ts
features: [
  { id: "feat-prod-001-1", productId: "prod-001", icon: "Ruler",    label: "Escala 1:265",         sortOrder: 1 },
  { id: "feat-prod-001-2", productId: "prod-001", icon: "Layers",   label: "12 marcadores",         sortOrder: 2 },
  { id: "feat-prod-001-3", productId: "prod-001", icon: "Hammer",   label: "Latón macizo",          sortOrder: 3 },
  { id: "feat-prod-001-4", productId: "prod-001", icon: "Sword",    label: "BattleTech Classic",    sortOrder: 4 },
  { id: "feat-prod-001-5", productId: "prod-001", icon: "Package",  label: "4 formas táctiles",     sortOrder: 5 },
]
```

---

## 4. Componente `FeatureGrid`

### 4.1. Propuesta de API

```tsx
// src/components/catalog/feature-grid.tsx

interface FeatureGridProps {
  features: ProductFeature[];
  columns?: 2 | 3 | 4 | 5;   // default: 4
  size?: "sm" | "md";         // default: "md"
  variant?: "grid" | "row";   // default: "grid"
}
```

### 4.2. Comportamiento visual

**`variant="grid"` (default)** — 4 columnas, cada feature es un cuadrado/tarjeta compacta con icono grande arriba y label abajo:

```
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│   📏     │ │   📦     │ │   ⚒️     │ │   ⚔️     │
│  Escala  │ │ 12 uds.  │ │ Latón    │ │ Battle-  │
│  1:265   │ │          │ │ macizo   │ │ Tech     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
```

**`variant="row"`** — Los features en una fila horizontal con scroll (tipo carrusel):

```
[ 📏 Escala 1:265 ] [ 📦 12 uds. ] [ ⚒️ Latón macizo ] [ ⚔️ BattleTech ] ...
```

### 4.3. Responsive

| Pantalla | `variant="grid"` | `variant="row"` |
|---|---|---|
| `>= lg` | 4 columnas | Fila completa |
| `md` | 3 columnas | Scroll horizontal |
| `<= sm` | 2 columnas | Scroll horizontal |

### 4.4. Iconos por defecto (fallback)

Si un feature no tiene icono definido o el nombre del icono no existe en lucide-react, se usa `Check` (el mismo de la solución provisional) para mantener consistencia visual.

---

## 5. Integración con el design system

- Los iconos se renderizan con lucide-react (ya es dependencia del proyecto)
- Tamaños: `size-6` (sm) o `size-8` (md) para iconos
- Color: `text-warden-blue` (accent) o `text-foreground/70` según contexto
- Bordes/backgrounds: reutilizan tokens existentes (`border-border`, `bg-warden-surface`)
- Tipografía: `text-spec-label` para labels, `text-data` para valores

---

## 6. Plan de implementación

| Paso | Descripción | Esfuerzo |
|---|---|---|
| 1 | Añadir tipo `ProductFeature` a `types/warden.ts` | 🟢 15 min |
| 2 | Añadir campo `features` a la interfaz `Product` | 🟢 5 min |
| 3 | Crear componente `FeatureGrid` | 🟡 1-2 h |
| 4 | Añadir datos semilla a los productos mock | 🟢 30 min |
| 5 | Migrar data layer (Supabase) para leer `features` | 🟡 2-3 h |
| 6 | Integrar `FeatureGrid` en Product Detail Page | 🟢 30 min |
| 7 | Probar responsive y variantes | 🟢 30 min |

**Total estimado**: 5-8 horas

---

## 7. Alternativas consideradas

### A. Usar emojis en lugar de lucide-react
- ✅ Sin dependencias nuevas
- ❌ Sin consistencia visual entre plataformas (cada SO renderiza distinto)
- ❌ No escala a diseño técnico/industrial de WARDEN
- **Descartado**

### B. SVG inline definido en el componente
- ✅ Control total del diseño
- ❌ Mucho trabajo de diseño gráfico
- ❌ Difícil de mantener
- **Descartado**

### C. Mantener solo `gameFeatures` con textos más cortos
- ✅ Sin cambios en el modelo
- ❌ No resuelve el requerimiento visual del mockup
- **Descartado**

---

## 8. Notas adicionales

- El componente `FeatureGrid` debe ser puramente visual (sin lógica de negocio) para mantener la separación de responsabilidades.
- Se puede reutilizar en tarjetas de producto del catálogo (`ProductCard`), bundles y colecciones en futuras iteraciones.
- El sistema de mapeo icono → componente lucide puede centralizarse en un archivo `src/lib/icons.ts` para que los nombres en BD se resuelvan a componentes reales sin tener que importar cada icono individualmente en cada fichero.

---

**¿Aprobada?** Si la propuesta te convence, puedo empezar a implementarla en el siguiente ticket (ej: WDN-WEB-R002). Si quieres ajustar algo —número de columnas, variante por defecto, nombres de iconos— dímelo y lo modificamos antes de pasar a código.
