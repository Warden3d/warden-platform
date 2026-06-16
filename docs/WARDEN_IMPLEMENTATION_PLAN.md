# WARDEN — Plan de Implementación Técnica v1.0

> **Documento de Arquitectura y Hoja de Ruta**
> Proyecto: WARDEN Platform
> Stack: Next.js 15 · TypeScript · Tailwind CSS · shadcn/ui · Supabase · Zod · React Hook Form · Vercel
> Fecha: 2026-06-16
> Estado: Propuesta inicial

---

## 1. Visión General del Producto

WARDEN es una plataforma de catálogo de productos físicos especializados para la experiencia de juego en BattleTech Classic, Alpha Strike y AeroTech. No es un ecommerce transaccional directo. El usuario explora el catálogo, selecciona productos mediante un sistema llamado **"Mi Selección"** y envía una solicitud de presupuesto/consulta. La marca comunica solidez, precisión técnica y funcionalidad sin adornos innecesarios.

---

## 2. Arquitectura Propuesta

### 2.1 Diagrama de Capas

```
┌─────────────────────────────────────────────┐
│                  CLIENTE                     │
│  Next.js 15 App Router (React Server Comp)  │
│  Tailwind CSS · shadcn/ui · Framer Motion   │
├─────────────────────────────────────────────┤
│                SERVIDOR                      │
│  Next.js API Routes / Route Handlers        │
│  Server Actions · Zod Validation            │
├─────────────────────────────────────────────┤
│              DATOS Y SERVICIOS              │
│  Supabase (PostgreSQL + Auth + Storage)     │
│  Row Level Security · Buckets · Realtime    │
├─────────────────────────────────────────────┤
│              INFRAESTRUCTURA                 │
│  Vercel (Deploy) · GitHub (CI/CD)           │
│  Supabase (Hosted DB) · Resend (Email)      │
└─────────────────────────────────────────────┘
```

### 2.2 Principios de Diseño Técnico

| Principio | Aplicación |
|---|---|
| **Server-first** | Renderizado en servidor por defecto. `'use client'` solo para interactividad. |
| **Tipado estricto** | TypeScript strict mode. Zod para runtime validation en boundaries. |
| **Composición sobre herencia** | Server Components anidan Client Components. Props tipadas. |
| **Seguridad por defecto** | RLS en Supabase. Server Actions con validación Zod. Sin exposición de claves. |
| **Progresive Enhancement** | Funcionalidad core sin JS. Animaciones y realtime como mejora. |
| **Mobile-first** | Diseño responsive desde 320px. Tailwind breakpoints estándar. |

---

## 3. Estructura de Directorios

```
warden-platform/
├── .github/
│   └── workflows/
│       └── ci.yml
├── public/
│   ├── images/
│   │   ├── products/        # Imágenes de producto (optimizadas)
│   │   ├── collections/     # Imágenes de colección
│   │   └── og/              # Open Graph images
│   ├── fonts/               # Fuentes locales (Inter, JetBrains Mono)
│   └── favicon/
├── docs/
│   ├── WARDEN_IMPLEMENTATION_PLAN.md
│   └── WARDEN_MAESTRO_V5.md # Documento Maestro (referencia)
├── src/
│   ├── app/
│   │   ├── (public)/        # Route group: layout público
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx             # Home
│   │   │   ├── catalogo/
│   │   │   │   ├── page.tsx         # Catálogo principal
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Detalle de producto
│   │   │   ├── colecciones/
│   │   │   │   ├── page.tsx         # Listado colecciones
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx     # Detalle colección
│   │   │   ├── drops/
│   │   │   │   └── page.tsx
│   │   │   ├── comunidad/
│   │   │   │   └── page.tsx         # Community Support
│   │   │   ├── contacto/
│   │   │   │   └── page.tsx
│   │   │   ├── licencias/
│   │   │   │   └── page.tsx
│   │   │   ├── legal/
│   │   │   │   ├── pagina.tsx
│   │   │   │   └── privacidad/
│   │   │   │       └── page.tsx
│   │   │   └── mi-seleccion/
│   │   │       └── page.tsx         # Sistema "Mi Selección"
│   │   ├── (auth)/           # Route group: autenticación
│   │   │   ├── layout.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   └── registro/
│   │   │       └── page.tsx
│   │   ├── (admin)/          # Route group: panel interno
│   │   │   ├── layout.tsx
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx         # Dashboard
│   │   │   │   ├── productos/
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── nuevo/
│   │   │   │   │   │   └── page.tsx
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── colecciones/
│   │   │   │   ├── drops/
│   │   │   │   ├── presupuestos/   # Solicitudes entrantes
│   │   │   │   └── media/
│   │   │   │       └── page.tsx
│   │   │   └── api/
│   │   │       ├── contact/
│   │   │       │   └── route.ts
│   │   │       └── quote/
│   │   │           └── route.ts
│   │   └── layout.tsx        # Root layout (metadata, fonts)
│   ├── components/
│   │   ├── ui/               # shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── input.tsx
│   │   │   ├── select.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── table.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── header.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── navigation.tsx
│   │   │   └── mobile-menu.tsx
│   │   ├── catalog/
│   │   │   ├── product-card.tsx
│   │   │   ├── product-grid.tsx
│   │   │   ├── product-gallery.tsx
│   │   │   ├── product-specs.tsx
│   │   │   ├── product-filters.tsx
│   │   │   └── license-badge.tsx
│   │   ├── selection/
│   │   │   ├── selection-drawer.tsx
│   │   │   ├── selection-item.tsx
│   │   │   ├── selection-summary.tsx
│   │   │   ├── quote-form.tsx
│   │   │   └── selection-provider.tsx
│   │   ├── collection/
│   │   │   ├── collection-hero.tsx
│   │   │   └── collection-card.tsx
│   │   ├── drops/
│   │   │   ├── drop-countdown.tsx
│   │   │   └── drop-card.tsx
│   │   ├── admin/
│   │   │   ├── admin-shell.tsx
│   │   │   ├── admin-header.tsx
│   │   │   ├── product-form.tsx
│   │   │   ├── media-uploader.tsx
│   │   │   ├── quote-manager.tsx
│   │   │   └── stats-cards.tsx
│   │   └── shared/
│   │       ├── empty-state.tsx
│   │       ├── error-state.tsx
│   │       ├── loading-spinner.tsx
│   │       └── status-badge.tsx
│   ├── hooks/
│   │   ├── use-selection.ts
│   │   ├── use-media-query.ts
│   │   └── use-debounce.ts
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        # Browser client
│   │   │   ├── server.ts        # Server client (cookies)
│   │   │   ├── admin.ts         # Service role client
│   │   │   └── types.ts         # Generated DB types
│   │   ├── validations/
│   │   │   ├── product.ts
│   │   │   ├── quote.ts
│   │   │   ├── contact.ts
│   │   │   └── media.ts
│   │   ├── constants.ts
│   │   ├── utils.ts
│   │   └── metadata.ts
│   ├── types/
│   │   ├── product.ts
│   │   ├── collection.ts
│   │   ├── quote.ts
│   │   ├── drop.ts
│   │   └── index.ts
│   └── styles/
│       └── globals.css          # Tailwind directives + custom utilities
├── supabase/
│   ├── migrations/              # Schema migrations
│   └── seed.sql                 # Datos iniciales de desarrollo
├── .env.local.example
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── next.config.ts
├── components.json              # shadcn/ui config
└── package.json
```

---

## 4. Rutas Públicas

| Ruta | Descripción | Server Component | Metadatos Dinámicos |
|---|---|---|---|
| `/` | Home — Hero, colecciones destacadas, drops activos, productos recientes | Server | `generateMetadata()` |
| `/catalogo` | Catálogo completo con filtros (licencia, tipo, colección, disponibilidad) | Server | `generateMetadata()` |
| `/catalogo/[slug]` | Ficha de producto — galería, specs, info técnica, botón "Añadir a Mi Selección" | Server | `generateMetadata({ params })` |
| `/colecciones` | Listado de colecciones disponibles | Server | `generateMetadata()` |
| `/colecciones/[slug]` | Detalle de colección con productos asociados | Server | `generateMetadata({ params })` |
| `/drops` | Drops activos y próximos | Server | `generateMetadata()` |
| `/comunidad` | Community Support — recursos, guías, enlaces a Discord | Server | `generateMetadata()` |
| `/contacto` | Formulario de contacto | Server + Client island | `generateMetadata()` |
| `/licencias` | Información de licenciamiento (ficticio) | Server | `generateMetadata()` |
| `/legal` / `/legal/privacidad` | Páginas legales estáticas | Server | `generateMetadata()` |
| `/mi-seleccion` | Sistema "Mi Selección" — resumen y formulario de presupuesto | Client (persisted state) | `generateMetadata()` |

### 4.1 Comportamiento de "Mi Selección"

- Persistencia en **localStorage** (no requiere auth).
- El usuario añade productos desde cualquier ficha de producto o desde el grid del catálogo.
- Un drawer/sheet lateral muestra el resumen actual.
- Al enviar, se dispara un Server Action que:
  1. Valida con Zod.
  2. Inserta en Supabase tabla `quote_requests`.
  3. Envía email de confirmación.
  4. Envía notificación interna.

---

## 5. Rutas Internas / Admin

| Ruta | Descripción | Protección |
|---|---|---|
| `/admin` | Dashboard con KPIs (productos, presupuestos pendientes, drops activos) | Auth + RLS |
| `/admin/productos` | CRUD de productos (tabla con sort, filter, search) | Auth + RLS |
| `/admin/productos/nuevo` | Formulario de creación de producto | Auth + RLS |
| `/admin/productos/[id]` | Edición de producto existente | Auth + RLS |
| `/admin/colecciones` | CRUD de colecciones | Auth + RLS |
| `/admin/drops` | Gestión de drops (programar, activar, cerrar) | Auth + RLS |
| `/admin/presupuestos` | Bandeja de solicitudes de presupuesto (estados: pendiente, respondido, archivado) | Auth + RLS |
| `/admin/media` | Biblioteca de medios (subida, organización, optimización) | Auth + RLS |

### 5.1 Autenticación Admin

- Supabase Auth con **email/password**.
- Sin registro público para admin (invitación por email desde panel o seed manual).
- Middleware de Next.js protege el route group `(admin)`.
- RLS en Supabase: solo `role = 'admin'` puede leer/escribir tablas admin.

---

## 6. Modelo de Datos Inicial

### 6.1 Tablas SQL (Supabase)

```sql
-- Enumeraciones
CREATE TYPE product_status AS ENUM ('draft', 'active', 'discontinued', 'archived');
CREATE TYPE drop_status AS ENUM ('upcoming', 'live', 'ended');
CREATE TYPE quote_status AS ENUM ('pending', 'reviewed', 'replied', 'archived');
CREATE TYPE product_license AS ENUM ('battletech_classic', 'alpha_strike', 'aerotech');

-- Productos
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subtitle TEXT,
  description TEXT NOT NULL,
  description_short TEXT,
  specs JSONB DEFAULT '{}',         -- Especificaciones técnicas (clave-valor)
  license product_license NOT NULL,
  status product_status DEFAULT 'draft',
  display_order INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT false,
  thumbnail_url TEXT,
  metadata JSONB DEFAULT '{}',      -- SEO, etiquetas
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Imágenes de Producto
CREATE TABLE product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  display_order INTEGER DEFAULT 0,
  is_primary BOOLEAN DEFAULT false
);

-- Colecciones
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  status product_status DEFAULT 'draft',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Relación Producto-Colección (N:N)
CREATE TABLE collection_products (
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  display_order INTEGER DEFAULT 0,
  PRIMARY KEY (collection_id, product_id)
);

-- Bundles
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  discount_label TEXT,              -- Ej: "15% vs piezas sueltas"
  status product_status DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE bundle_products (
  bundle_id UUID REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  PRIMARY KEY (bundle_id, product_id)
);

-- Drops
CREATE TABLE drops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  status drop_status DEFAULT 'upcoming',
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE drop_products (
  drop_id UUID REFERENCES drops(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (drop_id, product_id)
);

-- Solicitudes de Presupuesto (Mi Selección)
CREATE TABLE quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  customer_notes TEXT,
  selections JSONB NOT NULL,         -- [{ product_id, product_name, quantity }]
  status quote_status DEFAULT 'pending',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Contacto
CREATE TABLE contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Perfiles de Usuario (extiende auth.users de Supabase)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',         -- 'user' | 'admin'
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.2 Políticas RLS Esenciales

- `products`: lectura pública para `status = 'active'`. Escritura solo admin.
- `collections`: lectura pública. Escritura solo admin.
- `quote_requests`: inserción pública (anónima). Lectura/actualización solo admin.
- `contact_messages`: inserción pública. Lectura solo admin.
- `profiles`: lectura/actualización por propietario. Admin lectura global.

### 6.3 Índices Recomendados

```sql
CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_license ON products(license);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_quote_requests_status ON quote_requests(status);
CREATE INDEX idx_drops_status ON drops(status) WHERE status IN ('upcoming', 'live');
```

---

## 7. Componentes Principales

### 7.1 Layout Público

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `layout/header.tsx` | Server + Client islands | Navegación principal, logo WARDEN, enlace "Mi Selección" con badge de count |
| `layout/footer.tsx` | Server | Links legales, licencias, contacto, créditos |
| `layout/navigation.tsx` | Server | Links de navegación principal |
| `layout/mobile-menu.tsx` | Client | Menú off-canvas para mobile |

### 7.2 Catálogo

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `catalog/product-card.tsx` | Client | Card con thumbnail, nombre, licencia badge, "Añadir a selección" |
| `catalog/product-grid.tsx` | Server + Client search | Grid responsivo con filtros y ordenación |
| `catalog/product-gallery.tsx` | Client | Galería de imágenes con zoom/lightbox en ficha de producto |
| `catalog/product-specs.tsx` | Server | Tabla de especificaciones técnicas desde JSONB |
| `catalog/product-filters.tsx` | Client | Filtros por licencia, colección, disponibilidad |
| `catalog/license-badge.tsx` | Server | Badge visual identificando BattleTech Classic / Alpha Strike / AeroTech |

### 7.3 Sistema "Mi Selección"

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `selection/selection-provider.tsx` | Client Context | Estado global de selección (React Context + localStorage) |
| `selection/selection-drawer.tsx` | Client | Sheet/Drawer lateral mostrando selección actual |
| `selection/selection-item.tsx` | Client | Línea de producto en la selección (cantidad, eliminar) |
| `selection/selection-summary.tsx` | Client | Resumen previo al envío del presupuesto |
| `selection/quote-form.tsx` | Client | Formulario React Hook Form + Zod para datos de contacto |

### 7.4 Colecciones y Drops

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `collection/collection-hero.tsx` | Server | Hero section de una colección |
| `collection/collection-card.tsx` | Server | Card de colección en grid |
| `drops/drop-card.tsx` | Client | Card con countdown para drops activos |
| `drops/drop-countdown.tsx` | Client | Countdown regresivo para drop futuro |

### 7.5 Admin

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `admin/admin-shell.tsx` | Server + Client | Layout admin con sidebar y header |
| `admin/admin-header.tsx` | Client | Header admin con perfil, logout, breadcrumbs |
| `admin/product-form.tsx` | Client | Formulario de creación/edición de producto |
| `admin/media-uploader.tsx` | Client | Subida de imágenes a Supabase Storage con preview |
| `admin/quote-manager.tsx` | Client | Tabla de presupuestos con filtros de estado |
| `admin/stats-cards.tsx` | Server | KPIs del dashboard |

### 7.6 Shared

| Componente | Tipo | Responsabilidad |
|---|---|---|
| `shared/empty-state.tsx` | Server | Estado vacío ilustrado (sin resultados, sin selecciones) |
| `shared/error-state.tsx` | Server | Error boundary visual |
| `shared/loading-spinner.tsx` | Server | Skeleton / spinner para carga |
| `shared/status-badge.tsx` | Server | Badge semántico para estados (draft, active, pending...) |

---

## 8. Fases de Implementación

### Fase 0 — Inicialización del Proyecto (1-2 días)
- [ ] `create-next-app` con TypeScript, Tailwind, App Router.
- [ ] Instalar y configurar shadcn/ui con `components.json`.
- [ ] Instalar dependencias: zod, react-hook-form, @supabase/ssr, @supabase/supabase-js, framer-motion, lucide-react.
- [ ] Configurar ESLint, Prettier, path aliases (`@/`).
- [ ] Configurar `next.config.ts` con optimización de imágenes, CSP.
- [ ] Crear `.env.local.example` con todas las variables.
- [ ] Conectar Supabase (crear proyecto, obtener claves, configurar cliente).
- [ ] Crear tipografías (Inter + JetBrains Mono) y configuración de Tailwind (tema WARDEN).
- [ ] Subir primer commit al repo.

### Fase 1 — Layout, Tema y Home (2-3 días)
- [ ] Implementar design tokens en Tailwind (colores WARDEN, tipografía, spacing).
- [ ] Crear `globals.css` con custom utilities.
- [ ] Implementar `layout/header.tsx`, `layout/footer.tsx`, `layout/navigation.tsx`, `layout/mobile-menu.tsx`.
- [ ] Root layout con metadata, favicon, OG images.
- [ ] Página Home con hero, sección colecciones destacadas, drops activos, productos recientes.
- [ ] Páginas estáticas: `/legal`, `/legal/privacidad`, `/licencias`.
- [ ] Página `/comunidad` con contenido estático.

### Fase 2 — Catálogo y Ficha de Producto (3-4 días)
- [ ] Setup base de datos Supabase (migraciones).
- [ ] Seed data con 10-15 productos de ejemplo.
- [ ] Página `/catalogo` con grid de productos y filtros.
- [ ] Página `/catalogo/[slug]` con galería, specs, descripción.
- [ ] Componentes `product-card`, `product-gallery`, `product-specs`, `license-badge`.
- [ ] Server-side data fetching con tipado generado de Supabase.

### Fase 3 — Sistema "Mi Selección" (2-3 días)
- [ ] React Context + localStorage para persistencia.
- [ ] Drawer lateral con resumen de selección.
- [ ] Formulario de envío de presupuesto (React Hook Form + Zod).
- [ ] Server Action para procesar envío (insert en `quote_requests`, email).
- [ ] Página `/mi-seleccion` con estado vacío ilustrado.

### Fase 4 — Colecciones, Bundles y Drops (2-3 días)
- [ ] Página `/colecciones` y `/colecciones/[slug]`.
- [ ] Sistema de bundles con lógica de descuento en ficha de producto.
- [ ] Página `/drops` con countdown para drops próximos/activos.
- [ ] Productos etiquetados como parte de un drop.

### Fase 5 — Admin Panel (4-5 días)
- [ ] Middleware de protección para rutas `/admin/*`.
- [ ] Setup de autenticación Supabase (login, logout).
- [ ] Dashboard admin con KPIs.
- [ ] CRUD completo de productos (formulario con Zod).
- [ ] Gestión de colecciones (asignar/quitar productos).
- [ ] Bandeja de presupuestos (cambiar estados, notas internas).
- [ ] Biblioteca de medios (subida a Supabase Storage).
- [ ] Gestión de drops.

### Fase 6 — Pulido y Lanzamiento (2-3 días)
- [ ] OG images dinámicas para productos y colecciones.
- [ ] ESLint / TypeScript sin errores.
- [ ] Performance audit (Lighthouse > 90).
- [ ] Testeo responsive completo.
- [ ] Configurar dominio y deploy en Vercel.
- [ ] Configurar GitHub Actions CI.
- [ ] README.md del proyecto.

---

## 9. Riesgos Técnicos

| Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|
| **Supabase RLS mal configurado** expone datos admin | Media | Alto | Tests de integración para RLS desde fase 2. Usar service_role solo en server. |
| **Persistencia en localStorage** puede perder selecciones | Baja | Medio | Snackbar informativo al usuario. Opción futura: guardar en DB con cookie anónima. |
| **Imágenes no optimizadas** degradan performance | Media | Medio | Usar `next/image` con remote patterns de Supabase. Optimizar en subida. |
| **Formulario de presupuesto sin rate limiting** | Media | Bajo | Rate limiting con Upstash o reglas en Vercel. CAPTCHA futuro si hay spam. |
| **shadcn/ui breaking changes** en actualizaciones | Baja | Bajo | Fijar versiones en `package.json`. No actualizar sin revisar changelog. |
| **Tipado Supabase generado** desincronizado del schema | Media | Medio | Script `db:types` en `package.json`. Ejecutar tras cada migración. |
| **Fatiga de renderizado** con muchos productos en catálogo | Media | Medio | Paginación server-side desde fase 2. Virtual scroll si >100 items. |

---

## 10. Decisiones Pendientes

| Decisión | Opciones | Recomendación | Responsable |
|---|---|---|---|
| **Formulario de presupuesto: ¿archivos adjuntos?** | Permitir / No permitir | No en V1. Añadir si se solicita. | Cliente |
| **"Mi Selección": ¿requiere email antes de ver catálogo?** | Sí / No | No. Catálogo abierto. Email solo al enviar presupuesto. | Cliente |
| **Sistema de precios: ¿mostrar o no?** | Precio fijo visible / "Desde X" / Sin precio | "Desde X" como rango orientativo. Precio exacto en presupuesto. | Cliente |
| **Blog / Noticias integrado** | CMS headless / Markdown local / No incluir | Markdown local en V1 (simple). Futuro: Contentlayer o MDX. | Técnico |
| **Internacionalización i18n** | next-intl / next-i18next / No en V1 | No en V1. Arquitectura preparada (diccionarios en JSON). | Técnico |
| **Modo oscuro** | Seguir sistema / Siempre oscuro / Toggle | Siempre oscuro (identidad WARDEN). Preparar variables CSS para futuro toggle. | Técnico |
| **Analytics** | Vercel Analytics / Plausible / PostHog / Ninguno | Vercel Analytics (mínimo). Sin tracking invasivo. | Cliente |

---

## 11. Configuración Inicial Recomendada

### 11.1 Variables de Entorno (`.env.local`)

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Solo server

# App
NEXT_PUBLIC_SITE_URL=https://warden-platform.vercel.app
NEXT_PUBLIC_SITE_NAME=WARDEN

# Email (Resend)
RESEND_API_KEY=re_...

# Admin seed
ADMIN_EMAIL=admin@warden-platform.com
ADMIN_PASSWORD=...
```

### 11.2 Dependencias `package.json`

```json
{
  "dependencies": {
    "next": "15.x",
    "react": "19.x",
    "react-dom": "19.x",
    "@supabase/ssr": "latest",
    "@supabase/supabase-js": "latest",
    "zod": "latest",
    "react-hook-form": "latest",
    "@hookform/resolvers": "latest",
    "framer-motion": "latest",
    "lucide-react": "latest",
    "class-variance-authority": "latest",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "resend": "latest",
    "sonner": "latest"
  },
  "devDependencies": {
    "typescript": "latest",
    "@types/node": "latest",
    "@types/react": "latest",
    "@types/react-dom": "latest",
    "tailwindcss": "latest",
    "postcss": "latest",
    "autoprefixer": "latest",
    "eslint": "latest",
    "eslint-config-next": "latest",
    "prettier": "latest",
    "prettier-plugin-tailwindcss": "latest",
    "supabase": "latest"
  }
}
```

---

## 12. Próximos Pasos Inmediatos

1. **Aprobar este plan** — revisar decisiones pendientes (sección 10).
2. **Crear proyecto Supabase** — schema, buckets, RLS.
3. **Inicializar Next.js 15** — `npx create-next-app@latest .` en el repo actual.
4. **Configurar shadcn/ui y tema** — design tokens WARDEN.
5. **Primer commit con estructura base** — antes de empezar feature work.

---

> **Nota:** Este documento debe revisarse y ajustarse tras la Fase 0 (inicialización) y al final de cada fase para reflejar decisiones tomadas durante la implementación.
