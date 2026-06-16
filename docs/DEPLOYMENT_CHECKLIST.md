# WARDEN — Deployment Checklist

Lista de verificación para desplegar WARDEN en Vercel con Supabase.

---

## 1. Vercel

### 1.1 Conectar repositorio

- [ ] Repositorio subido a GitHub/GitLab/Bitbucket
- [ ] En [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**
- [ ] Seleccionar repositorio
- [ ] Framework detectado: **Next.js** (automático)
- [ ] Revisar que el build command es `npm run build`
- [ ] Output directory: dejar vacío (Next.js maneja `.next/`)

### 1.2 Variables de Entorno

Configurar en **Settings → Environment Variables** del proyecto:

| Variable | Producción | Preview | Desarrollo |
|----------|-----------|---------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | URL real de Supabase | URL real | URL real o vacío |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key real | Anon key real | Anon key real o vacío |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Service role key | Service role key o vacío |
| `NEXT_PUBLIC_SITE_URL` | `https://tu-dominio.vercel.app` | URL de preview | `http://localhost:3000` |

> ✅ La autenticación usa Supabase Auth (email/password). No se requiere contraseña de desarrollo.

### 1.3 Dominio

- [ ] Configurar dominio en **Settings → Domains** (opcional)
- [ ] Agregar dominio a CORS origins en Supabase Dashboard → API Settings
- [ ] Actualizar `NEXT_PUBLIC_SITE_URL` con el dominio final

### 1.4 Deploy

- [ ] Primer deploy manual o push a `main`
- [ ] Verificar que el build es exitoso (sin errores en logs)
- [ ] Navegar sitio público: homepage, catálogo, productos, bundles, drops
- [ ] Verificar formularios: contacto, community support, selección

---

## 2. Supabase

### 2.1 Proyecto

- [ ] Proyecto creado en [Supabase](https://supabase.com/dashboard)
- [ ] Anotar URL del proyecto (`https://xxxxxxxxxxxx.supabase.co`)
- [ ] Anotar `anon key` (pública)
- [ ] Anotar `service_role key` (secreta, solo backend)

### 2.2 Schema SQL

- [ ] Abrir **Supabase Dashboard → SQL Editor**
- [ ] Ejecutar el contenido completo de `supabase/schema.sql`
- [ ] Verificar que las tablas se crearon correctamente:
  - `collections`, `categories`, `compatibility_systems`, `licenses`
  - `products`, `product_images`, `product_specs`
  - `bundles`, `bundle_items`, `bundle_images`
  - `drops`, `drop_items`
  - `selection_requests`, `contact_requests`, `community_support_requests`
- [ ] Verificar que los tipos enum existen (`product_status`, `drop_status`, `image_view_type`, `support_request_status`)
- [ ] Verificar que RLS está habilitado en todas las tablas
- [ ] Verificar que las políticas RLS se aplicaron correctamente

### 2.3 Storage

- [ ] Ir a **Supabase Dashboard → Storage**
- [ ] Crear bucket `product-images`:
  - **Name:** `product-images`
  - **Public bucket:** ✅ ON
  - **File size limit:** 10 MB
  - **Allowed MIME types:** `image/png, image/jpeg, image/webp, image/avif, image/svg+xml`
- [ ] Ejecutar políticas RLS de storage (ya incluidas en `supabase/schema.sql` líneas 383-400):
  ```sql
  create policy "Public read access for product-images"
    on storage.objects for select
    using (bucket_id = 'product-images');

  create policy "Admin insert access for product-images"
    on storage.objects for insert
    with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

  create policy "Admin update access for product-images"
    on storage.objects for update
    using (bucket_id = 'product-images' AND auth.role() = 'authenticated');

  create policy "Admin delete access for product-images"
    on storage.objects for delete
    using (bucket_id = 'product-images' AND auth.role() = 'authenticated');
  ```
- [ ] Probar subida de imagen desde el panel admin

### 2.4 API Settings

- [ ] **Supabase Dashboard → Settings → API**
- [ ] Agregar dominio de Vercel a CORS origins:
  - `https://tu-dominio.vercel.app`
  - `https://*.vercel.app` (para preview deployments)
  - `http://localhost:3000` (desarrollo local)
- [ ] Revisar rate limiting (default es adecuado para inicio)

---

## 3. Configuración de Auth (Supabase Auth + user_roles)

### 3.1 Estado Actual — DONE ✅

- [x] Auth usa Supabase Auth (email/password) con `@supabase/ssr`
- [x] Middleware (`src/middleware.ts`) verifica la sesión mediante cookies de Supabase (`supabase.auth.getUser()`)
- [x] Login en `/admin/login` usa formulario email + contraseña contra Supabase Auth
- [x] Tabla `user_roles` creada en Supabase con columnas `user_id` (UUID) y `role` (text)
- [x] Función `is_admin()` en PostgreSQL que consulta `user_roles` para autorizar acciones admin
- [x] RLS ajustado para usar `auth.uid()` en lugar de `auth.role() = 'authenticated'`

### 3.2 Crear Usuario Admin

1. Ir a **Supabase Dashboard → Authentication → Add User**
2. Completar email y contraseña, marcar **Auto Confirm**
3. Copiar el UUID del usuario creado
4. Ir a **Supabase Dashboard → SQL Editor** y ejecutar:
   ```sql
   INSERT INTO user_roles (user_id, role) VALUES ('<user-uuid>', 'admin');
   ```
5. El usuario ya puede iniciar sesión en `/admin/login` con su email y contraseña

---

## 4. Seed de Datos

### 4.1 Datos de Catálogo

Para tener contenido visible con Supabase conectado, insertar datos de referencia:

- [ ] Insertar colecciones: `warden-core`, `licenses`
- [ ] Insertar categorías: `markers`, `templates`, `dials`, `accessories`
- [ ] Insertar sistemas de compatibilidad: `battletech-classic`, `alpha-strike`, `aerotech`
- [ ] Insertar licencias: `wasteland-studios`
- [ ] Insertar productos con sus imágenes y specs
- [ ] Insertar bundles y drops

Los datos de referencia están en `src/data/warden-catalog.ts`. Se recomienda crear un script de seed o insertarlos manualmente desde Supabase Dashboard → Table Editor.

### 4.2 Imágenes de Producto

- [ ] Subir imágenes a Supabase Storage (`product-images/products/{product-id}/`)
- [ ] Registrar URLs en tabla `product_images`
- [ ] Verificar que las URLs son accesibles públicamente

---

## 5. Pruebas Mínimas Antes de Publicar

### 5.1 Sitio Público

- [ ] Homepage carga sin errores
- [ ] Catálogo (`/catalog`) muestra productos con filtros funcionales
- [ ] Búsqueda de productos funciona
- [ ] Página de producto (`/products/[slug]`) muestra:
  - Nombre, descripción, precio, specs
  - Galería de imágenes (sin broken images)
  - Productos relacionados
- [ ] Bundles (`/bundles`) muestra bundles activos
- [ ] Bundle detail (`/bundles/[slug]`) muestra productos incluidos
- [ ] Drops (`/drops`) muestra drops por estado
- [ ] Colecciones (`/collections`) carga correctamente
- [ ] Selección (`/selection`):
  - Agregar/quitar productos funciona
  - Resumen y cantidades se actualizan
  - Formulario de solicitud funciona
- [ ] Formulario de contacto (`/contact`) envía correctamente
- [ ] Formulario de community support (`/community-support`) envía correctamente
- [ ] Páginas de error (404) se muestran correctamente

### 5.2 Panel Admin

- [ ] Login en `/admin/login` funciona con email y contraseña de Supabase Auth
- [ ] Dashboard (`/admin`) carga con estadísticas
- [ ] Lista de productos (`/admin/products`) muestra productos
- [ ] Cambio de estado (activo/oculto/retirado) funciona
- [ ] Crear nuevo producto (`/admin/products/new`) guarda correctamente
- [ ] Editar producto (`/admin/products/[id]/edit`) carga datos y guarda cambios
- [ ] Subida de imágenes funciona (si Supabase configurado)
- [ ] Eliminación de imágenes funciona
- [ ] Solicitudes (`/admin/requests`) muestra formularios recibidos

### 5.3 Rendimiento y SEO

- [ ] Lighthouse score > 90 en Performance (desktop)
- [ ] Meta tags presentes (título, descripción, OG)
- [ ] `robots.txt` y `sitemap.xml` accesibles (si aplica)
- [ ] Sin errores 500 en consola del servidor
- [ ] Sin warnings de hidratación en consola del navegador

### 5.4 Seguridad

- [ ] `.env.local` no está en el repositorio (verificado con `git ls-files`)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` solo se usa en server components/actions
- [ ] No hay claves hardcodeadas en el código fuente
- [ ] RLS está activo en todas las tablas de Supabase
- [ ] Storage bucket tiene políticas RLS aplicadas
- [ ] Auth usa cookies de Supabase (`sb-*-auth-token`) — no cookies manuales
- [ ] Panel admin protegido por `is_admin()` vía tabla `user_roles`

---

## 6. Rollback

En caso de problemas:

1. **Vercel:** Ir a Deployments → seleccionar deploy anterior → **Promote to Production**
2. **Supabase:** Los cambios de schema son migraciones; restaurar desde backup si es necesario
3. **Variables de entorno:** Corregir en Vercel Dashboard → redeploy automático

---

## Referencias

- [STORAGE.md](../STORAGE.md) — Configuración detallada de Supabase Storage
- [supabase/schema.sql](../supabase/schema.sql) — Schema completo de la base de datos
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Supabase Docs](https://supabase.com/docs)
