# Supabase Storage Configuration

This document covers the manual setup required for WARDEN's image storage system.

## Prerequisites

- A Supabase project with the schema from `supabase/schema.sql` applied.
- `.env.local` configured with valid Supabase keys:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## 1. Create the Storage Bucket

Navigate to **Supabase Dashboard > Storage** and create a new bucket:

| Field    | Value              |
|----------|--------------------|
| Name     | `product-images`   |
| Public   | ✅ Yes             |
| File size limit | 10 MB       |
| Allowed MIME types | `image/*`  |

Or run this SQL in the SQL Editor:

```sql
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,
  array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/svg+xml']
);
```

## 2. Apply Storage RLS Policies

The schema file (`supabase/schema.sql`) already includes storage policies for the `product-images` bucket. After creating the bucket, run those policies in the SQL Editor:

```sql
-- Public read
create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admin insert (admin users only)
create policy "Admin insert access for product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' and is_admin());

-- Admin update
create policy "Admin update access for product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' and is_admin());

-- Admin delete
create policy "Admin delete access for product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' and is_admin());
```

## 3. Directory Structure

Images are organized by product ID within the bucket:

```
product-images/
└── products/
    ├── prod-001/
    │   ├── 1_main.jpg
    │   ├── 2_left.jpg
    │   └── 3_contextual.jpg
    ├── prod-002/
    │   └── 1_main.jpg
    └── ...
```

The naming convention is: `{sortOrder}_{viewType}.{ext}`

## 4. Image View Types

| Type         | Description                        |
|--------------|------------------------------------|
| `main`       | Main/front view of the product     |
| `left`       | Left side view                     |
| `right`      | Right side view                    |
| `top`        | Top/overhead view                  |
| `rear`       | Rear/back view                     |
| `contextual` | Product in context (environment)   |
| `other`      | Other/uncategorized                |

## 5. Fallback Behavior

When Supabase is **not** configured (`NEXT_PUBLIC_SUPABASE_URL` is empty):
- The app uses in-memory mock data (from `src/data/warden-catalog.ts`).
- Mock images reference local paths like `/images/products/hex-markers-brass.jpg`.
- These paths require actual image files in the `public/images/` directory.
- `next/image` runs in **unoptimized** mode for local files.
- Gallery components display an elegant fallback placeholder when no images exist.

When Supabase **is** configured:
- Product images are uploaded via the admin panel's ImageUploader component.
- Uploads go directly to Supabase Storage (`product-images` bucket).
- Database records in `product_images` store the public URLs.
- `next/image` optimizes images through the Supabase Storage CDN.
- The `next.config.ts` remote pattern allows `*.supabase.co/storage/v1/object/public/**`.

## 6. Admin Workflow

1. Navigate to `/admin/products/[id]/edit`
2. In the "Imágenes del producto" section:
   - Drag & drop images or click "Subir imagen"
   - Set alt text for each image
   - Select view type from the dropdown (main, left, right, top, rear, contextual, other)
   - Toggle "Principal" (star) to mark the primary image
   - Reorder with arrow buttons
   - Delete with the X button
3. Click "Guardar cambios" — images are uploaded to Supabase Storage and DB records are created/updated.

## 7. Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes (for storage) | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes (for storage) | Anon key for public reads |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes (for uploads) | Service role key for admin operations |
| `NEXT_PUBLIC_SITE_URL` | No | Site URL for metadata |

## 8. Troubleshooting

- **Images not displaying**: Check that the bucket is public and RLS policies are applied.
- **Upload fails**: Verify `SUPABASE_SERVICE_ROLE_KEY` is set in `.env.local`.
- **next/image errors**: Ensure the Supabase URL is in `next.config.ts` remote patterns.
- **CORS issues**: In Supabase Dashboard > API Settings, add your site URL to CORS origins.
