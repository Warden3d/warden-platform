# WARDEN — Product Configuration Model v1.0

> Extraído de `Documents/WARDEN/WEB/PRODUCT DETAIL PAGE V1.0.pdf` (18 páginas)

---

## 1. Principio fundamental

**La ficha de producto nunca decide qué opciones mostrar.**  
El producto declara sus capacidades de configuración. La interfaz las interpreta.

**No existen fichas distintas** para WARDEN Core, Alpha Strike, mapas, accesorios, escenografía, etc.  
Existe **una única Product Detail Page** que se adapta automáticamente.

---

## 2. Capacidades de configuración (v1.0)

| Capacidad | Descripción | Puede modificar precio |
|---|---|---|
| **Acabado** | Cómo se entrega el producto (Monocromo, Color, etc.) | Sí |
| **Tamaño** | Dimensiones del producto (Pequeño, Mediano, Grande) | Sí |
| **Escala** | Escala (1:285, 1:265) | No necesariamente |
| **Material** | Material alternativo (PLA, PETG, Resina) | Sí |
| **Variante** | Diferencias funcionales (Izquierda/Derecha, A/B) | No |
| **Contenido** | Productos compuestos (Pack básico/ampliado) | Sí |

---

## 3. Estados de una capacidad

| Estado | Descripción | Resultado en UI |
|---|---|---|
| **A — No disponible** | El producto no declara la capacidad | No se muestra nada |
| **B — Informativo** | Una única opción posible | Se muestra como texto, **sin selector** |
| **C — Seleccionable** | Dos o más opciones | Selector interactivo generado automáticamente |
| **D — Con impacto** | La selección modifica precio/SKU/etc. | Selector + actualización automática |

---

## 4. Principio de mínima interacción

La UI solo muestra controles cuando existe una **decisión real**.  
Nunca mostrar:
- Selectores con una sola opción
- Botones deshabilitados sin motivo
- Controles que no produzcan efecto

Si el usuario no puede decidir, se presenta como **dato**, no como control.

---

## 5. Arquitectura

```
Producto
    ↓  declara capacidades
Product Configuration Model (PCM)
    ↓  contrato entre producto e interfaz
Product Detail Page (única para todo el catálogo)
    ↓  interpreta y renderiza
UI → Selección del usuario → Actualización del producto configurado
```

**La PDP no contiene lógica de negocio.**  
**Nunca implementar lógica basada en** colección, línea de producto, licencia o categoría.

---

## 6. Reglas clave para implementación

- El componente visual nunca conoce el significado de la capacidad. Solo sabe: qué capacidad representa, qué opciones existen, cuál está seleccionada, qué ocurre al cambiar.
- Nueva capacidad en el futuro = nuevo componente visual, **sin nueva PDP**.
- El modelo es independiente de Supabase, Next.js, React, WooCommerce, APIs.
- Los principios aplican a apps móviles, herramientas internas, configuradores.

---

## 7. Implicaciones para lo implementado hasta ahora

- `FinishSelector` debería consumir datos del producto (no hardcoded) y seguir los estados A/B/C/D.
- `QuantitySelector` es independiente del PCM (no es una capacidad de configuración, es cantidad de compra).
- Los selectores deshabilitados violan el principio de mínima interacción.

---

> Fecha de extracción: 2026-06-30  
> Fuente: `Documents/WARDEN/WEB/PRODUCT DETAIL PAGE V1.0.pdf`
