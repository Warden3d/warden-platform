# WARDEN Platform

> Plataforma de catálogo y gestión para productos físicos de wargaming — BattleTech, Alpha Strike y AeroTech.

WARDEN desarrolla y comercializa accesorios de precisión para juegos de mesa. La plataforma ofrece catálogo público, selección de productos, solicitud de presupuestos, panel de administración y sistema de drops/colecciones/bundles.

---

## Stack

| Capa | Tecnología |
|------|------------|
| Framework | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| Lenguaje | TypeScript 5 (strict mode) |
| Estilos | Tailwind CSS v4 + `tw-animate-css` |
| UI Components | `@base-ui/react` + shadcn/ui (nueva generación) |
| Formularios | React Hook Form + Zod |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Backend / DB | [Supabase](https://supabase.com/) (PostgreSQL + Storage + Auth) |
| Autenticación | Supabase Auth (email/password + user_roles) |
| Despliegue | [Vercel](https://vercel.com/) |

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url>
cd WARDEN

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus claves de Supabase (ver sección Variables)

# 4. Iniciar en desarrollo
npm run dev
```

La app estará disponible en [http://localhost:3000](http://localhost:3000).

---

## Variables de Entorno

Copiar `.env.example` a `.env.local` y completar:

| Variable | Requerida | Descripción |
|----------|-----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | No* | URL del proyecto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No* | Anon key de Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | No* | Service role key (solo servidor) |
| `NEXT_PUBLIC_SITE_URL` | No | URL del sitio para metadata/OG |

\* Sin Supabase configurado, la app funciona con datos mock locales (`src/data/warden-catalog.ts`). Las imágenes se reemplazan por placeholders.

---

## Desarrollo Local

```bash
# Servidor de desarrollo (Turbopack)
npm run dev

# Build de producción
npm run build

# Iniciar build de producción localmente
npm run start

# Lint
npm run lint
```

### Acceso al Panel de Administración

1. Ir a `/admin/login`
2. Access requires a Supabase Auth account with admin role
3. Admin users are created in Supabase Dashboard > Authentication
4. Grant admin role via SQL: `INSERT INTO user_roles (user_id, role) VALUES ('<uuid>', 'admin');`
5. Login at `/admin/login` with email and password

> **Nota:** La autenticación usa Supabase Auth con RLS y roles de usuario, lista para producción.

---

## Despliegue en Vercel

### Requisitos previos

1. Cuenta en [Vercel](https://vercel.com/)
2. CLI de Vercel instalada (`npm i -g vercel`) o usar Vercel Dashboard
3. Proyecto en GitHub/GitLab conectado a Vercel

### Pasos

1. Conectar repositorio en Vercel Dashboard → **Import Project**
2. Framework detectado automáticamente: **Next.js**
3. Configurar variables de entorno en **Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` (URL de producción en Vercel)
4. Desplegar — cada push a `main` dispara deploy automático
5. Dominio personalizado en **Settings → Domains** (opcional)

El build usa `npm run build` (Next.js detectado automáticamente). No se requiere configuración adicional de `vercel.json`.

---

## Conexión Supabase

### 1. Crear proyecto en Supabase

Ir a [supabase.com](https://supabase.com/) → New Project. Anotar URL y claves.

### 2. Ejecutar schema SQL

En **Supabase Dashboard → SQL Editor**, ejecutar el contenido de `supabase/schema.sql`. Esto crea:
- Tablas: `products`, `collections`, `categories`, `bundles`, `drops`, etc.
- Políticas RLS (lectura pública, inserción pública en formularios)
- Triggers `updated_at`
- Tipos enum (`product_status`, `drop_status`, etc.)

### 2.1 Crear usuario administrador

Después de ejecutar el schema:
1. En **Supabase Dashboard → Authentication → Add User**, crear un usuario con email y contraseña
2. Copiar el UUID del usuario creado
3. Ejecutar en **SQL Editor**: `INSERT INTO user_roles (user_id, role) VALUES ('<uuid>', 'admin');`

### 3. Configurar Storage

Ver [`STORAGE.md`](STORAGE.md) para la guía completa de configuración del bucket `product-images`.

Resumen rápido:
1. **Supabase Dashboard → Storage → New Bucket**
   - Nombre: `product-images`
   - Público: ✅ Sí
   - Límite: 10 MB
   - MIME: `image/*`
2. Ejecutar políticas RLS de storage (incluidas en `supabase/schema.sql` líneas 383–400)

### 4. Seed inicial (opcional)

Para poblar con datos de catálogo, insertar registros correspondientes al contenido de `src/data/warden-catalog.ts` en las tablas de Supabase.

---

## Scripts

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con Turbopack |
| `npm run build` | Build de producción |
| `npm run start` | Iniciar servidor de producción |
| `npm run lint` | Ejecutar ESLint en el proyecto |

---

## Estructura de Carpetas

```
WARDEN/
├── .env.example              # Variables de entorno (template)
├── STORAGE.md                # Guía de configuración de Supabase Storage
├── README.md                 # Este archivo
├── package.json
├── tsconfig.json
├── next.config.ts            # Configuración de Next.js (imágenes remotas)
├── eslint.config.mjs         # ESLint flat config (Next.js core-web-vitals)
├── postcss.config.mjs
├── components.json           # Configuración de shadcn/ui
│
├── supabase/
│   └── schema.sql            # Schema completo de PostgreSQL
│
├── docs/
│   └── DEPLOYMENT_CHECKLIST.md
│
├── public/                   # Archivos estáticos
│
└── src/
    ├── middleware.ts          # Protección de rutas /admin (dev cookie)
    │
    ├── app/                  # App Router (Next.js 16)
    │   ├── layout.tsx        # Root layout (fuentes, metadata, tema oscuro)
    │   ├── globals.css       # Estilos globales + Tailwind
    │   ├── (public)/         # Rutas públicas (catálogo, productos, etc.)
    │   │   ├── catalog/
    │   │   ├── products/[slug]/
    │   │   ├── bundles/
    │   │   ├── drops/
    │   │   ├── collections/
    │   │   ├── selection/
    │   │   ├── community-support/
    │   │   ├── contact/
    │   │   └── about/
    │   └── admin/            # Panel de administración
    │       ├── login/
    │       ├── products/
    │       └── requests/
    │
    ├── components/
    │   ├── admin/            # Componentes del panel admin
    │   ├── catalog/          # Catálogo público
    │   ├── collection/       # Colecciones
    │   ├── drops/            # Drops
    │   ├── forms/            # Formularios (contacto, community support)
    │   ├── layout/           # Header, Footer, Providers
    │   ├── product/          # Detalle de producto
    │   ├── selection/        # Sistema de selección/presupuesto
    │   ├── shared/           # Componentes compartidos
    │   └── ui/               # Primitivas shadcn/ui
    │
    ├── hooks/
    │   ├── use-catalog-filters.ts
    │   └── use-selection.tsx  # Contexto de selección de productos
    │
    ├── data/                  # Datos mock (fallback sin Supabase)
    │   ├── warden-catalog.ts # Catálogo completo de productos
    │   ├── faq.ts
    │   └── navigation.ts
    │
    ├── lib/
    │   ├── auth.ts           # Auth temporal (dev cookie)
    │   ├── utils.ts          # Utilidades (cn, etc.)
    │   ├── actions/          # Server Actions
    │   │   ├── admin-products.ts
    │   │   ├── login.ts
    │   │   ├── logout.ts
    │   │   ├── product-form.ts
    │   │   ├── submit-contact.ts
    │   │   ├── submit-community-support.ts
    │   │   ├── submit-selection.ts
    │   │   └── upload-image.ts
    │   ├── data/             # Data access layer (híbrido Supabase/mock)
    │   │   ├── index.ts      # API pública de datos
    │   │   ├── admin.ts      # Datos para panel admin
    │   │   └── store.ts      # Store mock en memoria
    │   ├── schemas/          # Esquemas Zod
    │   │   ├── product.ts
    │   │   ├── contact.ts
    │   │   └── community-support.ts
    │   └── supabase/         # Clientes de Supabase
    │       ├── client.ts     # Browser client
    │       ├── server.ts     # Server client + service role
    │       └── storage.ts    # Utilidades de Storage
    │
    └── types/
        └── warden.ts         # Tipos TypeScript del dominio
```

---

## Notas

- **Modo fallback:** Sin Supabase configurado, la app usa datos mock. Ideal para desarrollo local sin backend.
- **Imágenes:** Sin Supabase, se usan placeholders. Con Supabase, se sirven desde `product-images` bucket vía CDN.
- **Auth:** Se usa Supabase Auth con email/password y la tabla `user_roles` para autorización basada en roles. Producción-ready.
- **Next.js 16:** Este proyecto usa la versión 16 con App Router y Turbopack. Las APIs y convenciones pueden diferir de versiones anteriores.
