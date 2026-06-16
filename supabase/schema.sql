-- ============================================================================
-- WARDEN Platform — Supabase Schema
-- ============================================================================
-- Run this script in the Supabase SQL Editor to create the public schema.
-- All tables live in the `public` schema.
-- ============================================================================

-- ============================================================================
-- EXTENSIONS
-- ============================================================================
create extension if not exists "pgcrypto";

-- ============================================================================
-- ENUMS
-- ============================================================================
create type product_status as enum ('active', 'hidden', 'retired');
create type drop_status as enum ('upcoming', 'live', 'ended');
create type support_request_status as enum ('open', 'in-progress', 'resolved', 'closed');

-- ============================================================================
-- COLLECTIONS
-- ============================================================================
create table collections (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  thumbnail_url text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_collections_slug on collections (slug);

-- ============================================================================
-- CATEGORIES
-- ============================================================================
create table categories (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index idx_categories_slug on categories (slug);

-- ============================================================================
-- COMPATIBILITY SYSTEMS
-- ============================================================================
create table compatibility_systems (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index idx_compatibility_systems_slug on compatibility_systems (slug);

-- ============================================================================
-- LICENSES
-- ============================================================================
create table licenses (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text not null default '',
  website     text,
  logo_url    text,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- PRODUCTS
-- ============================================================================
create table products (
  id                  uuid primary key default gen_random_uuid(),
  slug                text not null unique,
  name                text not null,
  short_description   text not null default '',
  description         text not null default '',
  collection_id       uuid references collections(id) on delete set null,
  category_id         uuid references categories(id) on delete set null,
  compatibility_id    uuid references compatibility_systems(id) on delete set null,
  scale               text not null default '',
  material            text not null default '',
  height              real not null default 0,
  width               real not null default 0,
  depth               real not null default 0,
  price               real not null default 0,
  game_features       text[] not null default '{}',
  status              product_status not null default 'active',
  featured            boolean not null default false,
  internal_code       text not null default '',
  associated_license_id uuid references licenses(id) on delete set null,
  weight              real not null default 0,
  volume              real not null default 0,
  print_time          real not null default 0,
  version             text not null default '1.0.0',
  related_product_ids uuid[] not null default '{}',
  related_bundle_ids  uuid[] not null default '{}',
  related_drop_ids    uuid[] not null default '{}',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

create index idx_products_slug on products (slug);
create index idx_products_status on products (status);
create index idx_products_featured on products (featured);
create index idx_products_collection on products (collection_id);
create index idx_products_category on products (category_id);
create index idx_products_compatibility on products (compatibility_id);
create index idx_products_license on products (associated_license_id);

-- ============================================================================
-- PRODUCT IMAGES
-- ============================================================================
create type image_view_type as enum ('main', 'left', 'right', 'top', 'rear', 'contextual', 'other');

create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  is_primary  boolean not null default false,
  sort_order  int not null default 0,
  view_type   image_view_type not null default 'main',
  created_at  timestamptz not null default now()
);

create index idx_product_images_product on product_images (product_id);

-- ============================================================================
-- PRODUCT SPECS
-- ============================================================================
create table product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  spec_key    text not null,
  spec_value  text not null default '',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_product_specs_product on product_specs (product_id);

-- ============================================================================
-- BUNDLES
-- ============================================================================
create table bundles (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  theme         text,
  price         real not null default 0,
  discount_label text,
  status        product_status not null default 'active',
  featured      boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_bundles_slug on bundles (slug);
create index idx_bundles_status on bundles (status);

-- ============================================================================
-- BUNDLE ITEMS
-- ============================================================================
create table bundle_items (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   uuid not null references bundles(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique(bundle_id, product_id)
);

create index idx_bundle_items_bundle on bundle_items (bundle_id);
create index idx_bundle_items_product on bundle_items (product_id);

-- ============================================================================
-- BUNDLE IMAGES
-- ============================================================================
create table bundle_images (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   uuid not null references bundles(id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  is_primary  boolean not null default false,
  sort_order  int not null default 0,
  view_type   image_view_type not null default 'main',
  created_at  timestamptz not null default now()
);

create index idx_bundle_images_bundle on bundle_images (bundle_id);

-- ============================================================================
-- DROPS
-- ============================================================================
create table drops (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  theme         text,
  starts_at     timestamptz,
  ends_at       timestamptz,
  status        drop_status not null default 'upcoming',
  thumbnail_url text not null default '',
  created_at    timestamptz not null default now()
);

create index idx_drops_slug on drops (slug);
create index idx_drops_status on drops (status);

-- ============================================================================
-- DROP ITEMS
-- ============================================================================
create table drop_items (
  id          uuid primary key default gen_random_uuid(),
  drop_id     uuid not null references drops(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique(drop_id, product_id)
);

create index idx_drop_items_drop on drop_items (drop_id);
create index idx_drop_items_product on drop_items (product_id);

-- ============================================================================
-- SELECTION REQUESTS (quote requests)
-- ============================================================================
create table selection_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  country     text not null default '',
  query_type  text not null default 'quote',
  message     text not null default '',
  selections  jsonb not null default '[]',
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- CONTACT REQUESTS
-- ============================================================================
create table contact_requests (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  subject     text not null,
  message     text not null,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- COMMUNITY SUPPORT REQUESTS
-- ============================================================================
create table community_support_requests (
  id              uuid primary key default gen_random_uuid(),
  entity_type     text not null,
  entity_name     text not null,
  contact_name    text not null,
  email           text not null,
  description     text not null,
  support_types   text[] not null default '{}',
  details         text not null,
  accepted_terms  boolean not null default false,
  status          support_request_status not null default 'open',
  created_at      timestamptz not null default now()
);

-- ============================================================================
-- USER ROLES (admin authorization)
-- ============================================================================
create table user_roles (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  role        text not null default 'user',
  created_at  timestamptz not null default now(),
  unique(user_id, role)
);

create index idx_user_roles_user on user_roles (user_id);
create index idx_user_roles_role on user_roles (role);

-- Security definer function to check if current user is admin
create or replace function is_admin()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1 from user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
alter table collections enable row level security;
alter table categories enable row level security;
alter table compatibility_systems enable row level security;
alter table licenses enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_specs enable row level security;
alter table bundles enable row level security;
alter table bundle_items enable row level security;
alter table bundle_images enable row level security;
alter table drops enable row level security;
alter table drop_items enable row level security;
alter table selection_requests enable row level security;
alter table contact_requests enable row level security;
alter table community_support_requests enable row level security;
alter table user_roles enable row level security;

-- Catalog tables: public read access
create policy "Public read access for collections"
  on collections for select using (true);

create policy "Public read access for categories"
  on categories for select using (true);

create policy "Public read access for compatibility_systems"
  on compatibility_systems for select using (true);

create policy "Public read access for licenses"
  on licenses for select using (true);

create policy "Public read access for products"
  on products for select using (true);

create policy "Public read access for product_images"
  on product_images for select using (true);

create policy "Public read access for product_specs"
  on product_specs for select using (true);

create policy "Public read access for bundles"
  on bundles for select using (true);

create policy "Public read access for bundle_items"
  on bundle_items for select using (true);

create policy "Public read access for bundle_images"
  on bundle_images for select using (true);

create policy "Public read access for drops"
  on drops for select using (true);

create policy "Public read access for drop_items"
  on drop_items for select using (true);

-- Request tables: public insert (anyone can submit forms)
create policy "Public insert access for selection_requests"
  on selection_requests for insert with check (true);

create policy "Public insert access for contact_requests"
  on contact_requests for insert with check (true);

create policy "Public insert access for community_support_requests"
  on community_support_requests for insert with check (true);

-- User roles: only admins can read, service_role manages inserts
create policy "Admin read access for user_roles"
  on user_roles for select using (is_admin());

create policy "Admin insert access for user_roles"
  on user_roles for insert with check (is_admin());

create policy "Admin delete access for user_roles"
  on user_roles for delete using (is_admin());

-- Admin-only access: uses is_admin() function that checks user_roles table
create policy "Admin all access for collections"
  on collections for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for products"
  on products for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for product_images"
  on product_images for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for product_specs"
  on product_specs for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for bundles"
  on bundles for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for bundle_items"
  on bundle_items for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for bundle_images"
  on bundle_images for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for drops"
  on drops for all using (is_admin())
  with check (is_admin());

create policy "Admin all access for drop_items"
  on drop_items for all using (is_admin())
  with check (is_admin());

create policy "Admin select access for selection_requests"
  on selection_requests for select using (is_admin());

create policy "Admin select access for contact_requests"
  on contact_requests for select using (is_admin());

create policy "Admin select access for community_support_requests"
  on community_support_requests for select using (is_admin());

-- ============================================================================
-- STORAGE BUCKET: product-images
-- ============================================================================
-- Create the bucket via Supabase Dashboard > Storage, or run the SQL below
-- in Supabase SQL Editor. The bucket name must be 'product-images'.

-- Bucket creation (must be run via Supabase dashboard or SQL):
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Storage RLS policies for product-images bucket
-- Public: anyone can read files
create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Admin insert/update/delete: only admin users
create policy "Admin insert access for product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' AND is_admin());

create policy "Admin update access for product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' AND is_admin());

create policy "Admin delete access for product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' AND is_admin());

-- ============================================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================================
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at_collections
  before update on collections
  for each row execute function update_updated_at_column();

create trigger set_updated_at_products
  before update on products
  for each row execute function update_updated_at_column();

create trigger set_updated_at_bundles
  before update on bundles
  for each row execute function update_updated_at_column();

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Run this script in Supabase SQL Editor before starting the app.
-- 2. Seed data matching src/data/warden-catalog.ts must be inserted to have
--    the app display products when Supabase is configured.
-- 3. Service role key bypasses RLS; anon key is restricted by the policies above.
-- 4. Admin auth uses Supabase Auth (email/password) + user_roles table.
--    After creating an admin user in Supabase Dashboard > Authentication,
--    insert a row: INSERT INTO user_roles (user_id, role) VALUES ('<uuid>', 'admin');
-- 5. Storage bucket 'product-images' must be created manually via Supabase
--    Dashboard > Storage > New Bucket. See STORAGE.md for details.
