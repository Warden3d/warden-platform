-- ============================================================================
-- WARDEN Platform — Supabase Schema V1
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
create type request_status as enum ('received', 'in_review', 'quoted', 'closed');
create type email_status as enum ('pending', 'sent', 'failed');
create type shipping_status as enum ('pending_calculation', 'calculated', 'free', 'not_applicable');
create type support_request_status as enum ('open', 'in-progress', 'resolved', 'closed');
create type image_view_type as enum ('main', 'left', 'right', 'top', 'rear', 'contextual', 'other');

-- ============================================================================
-- COLLECTIONS (text PK — stable semantic IDs)
-- ============================================================================
create table collections (
  id            text primary key,
  slug          text not null unique,
  name          text not null,
  description   text not null default '',
  thumbnail_url text not null default '',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_collections_slug on collections (slug);

-- ============================================================================
-- CATEGORIES (text PK)
-- ============================================================================
create table categories (
  id          text primary key,
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index idx_categories_slug on categories (slug);

-- ============================================================================
-- PRODUCT TYPES (text PK)
-- ============================================================================
create table product_types (
  id          text primary key,
  category_id text not null references categories(id) on delete cascade,
  name        text not null,
  created_at  timestamptz not null default now()
);

create index idx_product_types_category on product_types (category_id);

-- ============================================================================
-- COMPATIBILITY SYSTEMS (text PK)
-- ============================================================================
create table compatibility_systems (
  id          text primary key,
  slug        text not null unique,
  name        text not null,
  description text not null default '',
  created_at  timestamptz not null default now()
);

create index idx_compatibility_systems_slug on compatibility_systems (slug);

-- ============================================================================
-- LICENSES (text PK)
-- ============================================================================
create table licenses (
  id          text primary key,
  name        text not null,
  description text not null default '',
  website     text,
  logo_url    text,
  created_at  timestamptz not null default now()
);

-- ============================================================================
-- PRODUCTS (text PK)
-- ============================================================================
create table products (
  id                    text primary key,
  slug                  text not null unique,
  name                  text not null,
  short_description     text not null default '',
  description           text not null default '',
  collection_id         text references collections(id) on delete set null,
  category_id           text references categories(id) on delete set null,
  type_id               text references product_types(id) on delete set null,
  compatibility_id      text references compatibility_systems(id) on delete set null,
  scale                 text not null default '',
  material              text not null default '',
  height                real not null default 0,
  width                 real not null default 0,
  depth                 real not null default 0,
  price                 real not null default 0,
  game_features         text[] not null default '{}',
  status                product_status not null default 'active',
  featured              boolean not null default false,
  internal_code         text not null default '',
  associated_license_id text references licenses(id) on delete set null,
  designer_name         text,
  weight                real not null default 0,
  volume                real not null default 0,
  print_time            real not null default 0,
  version               text not null default '1.0.0',
  related_product_ids   text[] not null default '{}',
  related_bundle_ids    text[] not null default '{}',
  related_drop_ids      text[] not null default '{}',
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index idx_products_slug on products (slug);
create index idx_products_status on products (status);
create index idx_products_featured on products (featured);
create index idx_products_collection on products (collection_id);
create index idx_products_category on products (category_id);
create index idx_products_type on products (type_id);
create index idx_products_compatibility on products (compatibility_id);
create index idx_products_license on products (associated_license_id);

-- ============================================================================
-- PRODUCT IMAGES (UUID PK, text FK → products)
-- ============================================================================
create table product_images (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references products(id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  is_primary  boolean not null default false,
  sort_order  int not null default 0,
  view_type   image_view_type not null default 'main',
  created_at  timestamptz not null default now()
);

create index idx_product_images_product on product_images (product_id);
alter table product_images add constraint uq_product_images_sort unique (product_id, sort_order);

-- ============================================================================
-- PRODUCT SPECS (UUID PK, text FK → products)
-- ============================================================================
create table product_specs (
  id          uuid primary key default gen_random_uuid(),
  product_id  text not null references products(id) on delete cascade,
  spec_key    text not null,
  spec_label  text not null default '',
  spec_value  text not null default '',
  visibility  text[] not null default '{pdp}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_product_specs_product on product_specs (product_id);
alter table product_specs add constraint uq_product_specs_sort unique (product_id, sort_order);

-- ============================================================================
-- PRODUCT VARIANTS (UUID PK, text FK → products)
-- ============================================================================
create table product_variants (
  id            uuid primary key default gen_random_uuid(),
  product_id    text not null references products(id) on delete cascade,
  name          text not null,
  price         real not null default 0,
  swatch_color  text,
  image_indices int[] not null default '{}',
  sort_order    int not null default 0,
  created_at    timestamptz not null default now()
);

create index idx_product_variants_product on product_variants (product_id);
alter table product_variants add constraint uq_product_variants_sort unique (product_id, sort_order);

-- ============================================================================
-- BUNDLES (text PK)
-- ============================================================================
create table bundles (
  id             text primary key,
  slug           text not null unique,
  name           text not null,
  description    text not null default '',
  theme          text,
  price          real not null default 0,
  discount_label text,
  status         product_status not null default 'active',
  featured       boolean not null default false,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index idx_bundles_slug on bundles (slug);
create index idx_bundles_status on bundles (status);

-- ============================================================================
-- BUNDLE ITEMS (UUID PK, text FK → bundles + products)
-- ============================================================================
create table bundle_items (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   text not null references bundles(id) on delete cascade,
  product_id  text not null references products(id) on delete cascade,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique(bundle_id, product_id)
);

create index idx_bundle_items_bundle on bundle_items (bundle_id);
create index idx_bundle_items_product on bundle_items (product_id);

-- ============================================================================
-- BUNDLE IMAGES (UUID PK, text FK → bundles)
-- ============================================================================
create table bundle_images (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   text not null references bundles(id) on delete cascade,
  url         text not null,
  alt         text not null default '',
  is_primary  boolean not null default false,
  sort_order  int not null default 0,
  view_type   image_view_type not null default 'main',
  created_at  timestamptz not null default now()
);

create index idx_bundle_images_bundle on bundle_images (bundle_id);
alter table bundle_images add constraint uq_bundle_images_sort unique (bundle_id, sort_order);

-- ============================================================================
-- BUNDLE SPECS (UUID PK, text FK → bundles)
-- ============================================================================
create table bundle_specs (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   text not null references bundles(id) on delete cascade,
  spec_key    text not null,
  spec_label  text not null default '',
  spec_value  text not null default '',
  visibility  text[] not null default '{bundle}',
  sort_order  int not null default 0,
  created_at  timestamptz not null default now()
);

create index idx_bundle_specs_bundle on bundle_specs (bundle_id);
alter table bundle_specs add constraint uq_bundle_specs_sort unique (bundle_id, sort_order);

-- ============================================================================
-- DROPS (text PK)
-- ============================================================================
create table drops (
  id            text primary key,
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
-- DROP ITEMS (UUID PK, text FK → drops + products)
-- ============================================================================
create table drop_items (
  id          uuid primary key default gen_random_uuid(),
  drop_id     text not null references drops(id) on delete cascade,
  product_id  text not null references products(id) on delete cascade,
  sort_order  int not null default 0,
  created_at  timestamptz not null default now(),
  unique(drop_id, product_id)
);

create index idx_drop_items_drop on drop_items (drop_id);
create index idx_drop_items_product on drop_items (product_id);

-- ============================================================================
-- REQUESTS (UUID PK — auto-generated)
-- ============================================================================
create table requests (
  id                     uuid primary key default gen_random_uuid(),
  reference              text unique,            -- WDN-YYYY-NNNNNN (set after insert)
  idempotency_key        text unique,            -- prevents duplicate submissions
  locale                 text not null default 'en',
  currency               text not null default 'EUR',
  status                 request_status not null default 'received',

  -- Client data (flat, no separate customers table for V1)
  first_name             text not null,
  last_name              text not null,
  email                  text not null,
  country                text not null,
  postal_code            text not null,
  city                   text not null,
  phone                  text,
  company                text,
  region                 text,
  notes                  text,

  -- Financial snapshot
  product_subtotal       real not null default 0,
  shipping_status        shipping_status not null default 'pending_calculation',
  shipping_cost          real,                    -- null = pending

  -- Email tracking
  customer_email_status  email_status not null default 'pending',
  internal_email_status  email_status not null default 'pending',
  email_send_attempts    int not null default 0,
  customer_email_send_attempts int not null default 0,
  internal_email_send_attempts int not null default 0,

  -- Management
  internal_notes         text,
  quote_reference        text,
  erpnext_reference      text,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

create index idx_requests_status on requests (status);
create index idx_requests_reference on requests (reference);
create index idx_requests_created on requests (created_at);

-- ============================================================================
-- REQUEST LINES (UUID PK, uuid FK → requests, text FK → CEM entities)
-- ============================================================================
create table request_lines (
  id             uuid primary key default gen_random_uuid(),
  request_id     uuid not null references requests(id) on delete cascade,

  -- Entity identification (CEM) — text because entityId is a semantic string
  entity_id      text not null,
  entity_type    text not null,   -- 'product' | 'bundle' | 'drop'

  -- Snapshot (historical — not dependent on catalog joins)
  name           text not null,
  sku            text not null default '',
  quantity       int not null check (quantity >= 1),
  configuration  jsonb,            -- ProductConfigurationItem[] snapshot
  unit_price     real not null check (unit_price >= 0),
  line_subtotal  real not null check (line_subtotal >= 0),
  slug           text,
  image          text,

  created_at     timestamptz not null default now()
);

create index idx_request_lines_request on request_lines (request_id);

-- ============================================================================
-- REQUEST COUNTERS (annual WDN reference sequence)
-- ============================================================================
create table request_counters (
  year         integer primary key,
  last_number  integer not null default 0
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
-- USER ROLES (UUID PK, auth.users.id reference is UUID)
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

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Generate WDN reference: WDN-YYYY-NNNNNN with automatic annual reset.
-- Uses request_counters with FOR UPDATE for atomicity and concurrency safety.
create or replace function generate_request_reference()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_year integer := extract(year from now());
  next_num     integer;
begin
  insert into public.request_counters (year, last_number)
  values (current_year, 0)
  on conflict (year) do nothing;

  select last_number + 1 into next_num
  from public.request_counters
  where year = current_year
  for update;

  update public.request_counters
  set last_number = next_num
  where year = current_year;

  return 'WDN-' || current_year::text || '-' || lpad(next_num::text, 6, '0');
end;
$$;

-- Trigger: auto set reference + timestamp on request insert
create or replace function set_request_meta()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.reference := public.generate_request_reference();
  new.created_at := now();
  new.updated_at := now();
  return new;
end;
$$;

-- Check if current user is admin
create or replace function is_admin()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
begin
  return exists (
    select 1 from public.user_roles
    where user_id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ============================================================================
-- RPC: Atomic request creation (request + lines in one transaction)
-- ============================================================================
create or replace function create_request(
  p_locale               text,
  p_currency             text,
  p_first_name           text,
  p_last_name            text,
  p_email                text,
  p_country              text,
  p_postal_code          text,
  p_city                 text,
  p_idempotency_key      text not null,
  p_phone                text default null,
  p_company              text default null,
  p_region               text default null,
  p_notes                text default null,
  p_product_subtotal     real default 0,
  p_shipping_status      shipping_status default 'pending_calculation',
  p_shipping_cost        real default null,
  p_customer_email_status email_status default 'pending',
  p_internal_email_status email_status default 'pending',
  p_internal_notes       text default null,
  p_lines                jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_request_id uuid;
  v_line       jsonb;
  v_result     jsonb;
  v_duplicate  boolean := false;
begin
  -- Try to insert with the idempotency key.
  -- ON CONFLICT DO NOTHING handles the race condition: if another tx
  -- inserted the same key first, this returns nothing.
  insert into public.requests (
    idempotency_key,
    locale, currency, status,
    first_name, last_name, email, country, postal_code, city,
    phone, company, region, notes,
    product_subtotal, shipping_status, shipping_cost,
    customer_email_status, internal_email_status, internal_notes
  ) values (
    p_idempotency_key,
    p_locale, p_currency, 'received',
    p_first_name, p_last_name, p_email, p_country, p_postal_code, p_city,
    p_phone, p_company, p_region, p_notes,
    p_product_subtotal, p_shipping_status, p_shipping_cost,
    p_customer_email_status, p_internal_email_status, p_internal_notes
  )
  on conflict (idempotency_key) do nothing
  returning id into v_request_id;

  -- If the insert returned nothing, the key already exists (duplicate/retry)
  if v_request_id is null then
    v_duplicate := true;
    select id into v_request_id
    from public.requests
    where idempotency_key = p_idempotency_key;
  else
    -- New request: insert lines
    for v_line in select * from jsonb_array_elements(p_lines)
    loop
      insert into public.request_lines (
        request_id,
        entity_id, entity_type,
        name, sku, quantity, configuration,
        unit_price, line_subtotal, slug, image
      ) values (
        v_request_id,
        v_line ->> 'entityId',
        v_line ->> 'entityType',
        v_line ->> 'name',
        coalesce(v_line ->> 'sku', ''),
        (v_line ->> 'quantity')::int,
        v_line -> 'configuration',
        (v_line ->> 'unitPrice')::real,
        (v_line ->> 'lineSubtotal')::real,
        v_line ->> 'slug',
        v_line ->> 'image'
      );
    end loop;
  end if;

  -- Return the request info
  select jsonb_build_object(
    'id', r.id,
    'reference', r.reference,
    'created_at', r.created_at,
    'duplicate', v_duplicate
  ) into v_result
  from public.requests r
  where r.id = v_request_id;

  return v_result;
end;
$$;

-- ============================================================================
-- RPC: Update email status after send attempt
-- ============================================================================
create or replace function update_request_email_status(
  p_request_id                uuid,
  p_customer_status           email_status default null,
  p_internal_status           email_status default null,
  p_increment_customer       boolean default false,
  p_increment_internal       boolean default false
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.requests
  set
    customer_email_status = coalesce(p_customer_status, customer_email_status),
    internal_email_status = coalesce(p_internal_status, internal_email_status),
    email_send_attempts = case
      when p_increment_customer or p_increment_internal then email_send_attempts + 1
      else email_send_attempts
    end,
    customer_email_send_attempts = case
      when p_increment_customer then customer_email_send_attempts + 1
      else customer_email_send_attempts
    end,
    internal_email_send_attempts = case
      when p_increment_internal then internal_email_send_attempts + 1
      else internal_email_send_attempts
    end
  where id = p_request_id;
end;
$$;

-- Auto-update updated_at for any table
create or replace function update_updated_at_column()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

create trigger set_updated_at_collections
  before update on collections
  for each row execute function update_updated_at_column();

create trigger set_updated_at_products
  before update on products
  for each row execute function update_updated_at_column();

create trigger set_updated_at_bundles
  before update on bundles
  for each row execute function update_updated_at_column();

create trigger set_request_meta_on_insert
  before insert on requests
  for each row execute function set_request_meta();

create trigger set_updated_at_requests
  before update on requests
  for each row execute function update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table collections enable row level security;
alter table categories enable row level security;
alter table product_types enable row level security;
alter table compatibility_systems enable row level security;
alter table licenses enable row level security;
alter table products enable row level security;
alter table product_images enable row level security;
alter table product_specs enable row level security;
alter table product_variants enable row level security;
alter table bundles enable row level security;
alter table bundle_items enable row level security;
alter table bundle_images enable row level security;
alter table bundle_specs enable row level security;
alter table drops enable row level security;
alter table drop_items enable row level security;
alter table requests enable row level security;
alter table request_lines enable row level security;
alter table contact_requests enable row level security;
alter table community_support_requests enable row level security;
alter table user_roles enable row level security;

-- ── Catalog tables: public read ──
create policy "Public read access for collections"
  on collections for select using (true);

create policy "Public read access for categories"
  on categories for select using (true);

create policy "Public read access for product_types"
  on product_types for select using (true);

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

create policy "Public read access for product_variants"
  on product_variants for select using (true);

create policy "Public read access for bundles"
  on bundles for select using (true);

create policy "Public read access for bundle_items"
  on bundle_items for select using (true);

create policy "Public read access for bundle_images"
  on bundle_images for select using (true);

create policy "Public read access for bundle_specs"
  on bundle_specs for select using (true);

create policy "Public read access for drops"
  on drops for select using (true);

create policy "Public read access for drop_items"
  on drop_items for select using (true);

-- ── Request tables: NO public insert ──
create policy "Public insert access for contact_requests"
  on contact_requests for insert with check (true);

create policy "Public insert access for community_support_requests"
  on community_support_requests for insert with check (true);

-- ── Requests: no public read/modify ──

-- ── User roles: only admins ──
create policy "Admin read access for user_roles"
  on user_roles for select using (is_admin());

create policy "Admin insert access for user_roles"
  on user_roles for insert with check (is_admin());

create policy "Admin delete access for user_roles"
  on user_roles for delete using (is_admin());

-- ── Admin full access for catalog tables ──
create policy "Admin all access for collections"
  on collections for all using (is_admin()) with check (is_admin());

create policy "Admin all access for categories"
  on categories for all using (is_admin()) with check (is_admin());

create policy "Admin all access for product_types"
  on product_types for all using (is_admin()) with check (is_admin());

create policy "Admin all access for products"
  on products for all using (is_admin()) with check (is_admin());

create policy "Admin all access for product_images"
  on product_images for all using (is_admin()) with check (is_admin());

create policy "Admin all access for product_specs"
  on product_specs for all using (is_admin()) with check (is_admin());

create policy "Admin all access for product_variants"
  on product_variants for all using (is_admin()) with check (is_admin());

create policy "Admin all access for bundles"
  on bundles for all using (is_admin()) with check (is_admin());

create policy "Admin all access for bundle_items"
  on bundle_items for all using (is_admin()) with check (is_admin());

create policy "Admin all access for bundle_images"
  on bundle_images for all using (is_admin()) with check (is_admin());

create policy "Admin all access for bundle_specs"
  on bundle_specs for all using (is_admin()) with check (is_admin());

create policy "Admin all access for drops"
  on drops for all using (is_admin()) with check (is_admin());

create policy "Admin all access for drop_items"
  on drop_items for all using (is_admin()) with check (is_admin());

create policy "Admin select access for requests"
  on requests for select using (is_admin());

create policy "Admin select access for request_lines"
  on request_lines for select using (is_admin());

create policy "Admin select access for contact_requests"
  on contact_requests for select using (is_admin());

create policy "Admin select access for community_support_requests"
  on community_support_requests for select using (is_admin());

-- ============================================================================
-- STORAGE BUCKET: product-images
-- ============================================================================
-- Create bucket via Supabase Dashboard > Storage, or SQL below:
-- insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true);

-- Grant service_role permission to execute RPCs
grant execute on function create_request to service_role;
grant execute on function update_request_email_status to service_role;

-- Revoke public/anon/authenticated access — only service_role can call
revoke execute on function create_request from public;
revoke execute on function create_request from anon;
revoke execute on function create_request from authenticated;
revoke execute on function update_request_email_status from public;
revoke execute on function update_request_email_status from anon;
revoke execute on function update_request_email_status from authenticated;

drop policy if exists "Public read access for product-images" on storage.objects;
create policy "Public read access for product-images"
  on storage.objects for select
  using (bucket_id = 'product-images');

drop policy if exists "Admin insert access for product-images" on storage.objects;
create policy "Admin insert access for product-images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' AND is_admin());

drop policy if exists "Admin update access for product-images" on storage.objects;
create policy "Admin update access for product-images"
  on storage.objects for update
  using (bucket_id = 'product-images' AND is_admin());

drop policy if exists "Admin delete access for product-images" on storage.objects;
create policy "Admin delete access for product-images"
  on storage.objects for delete
  using (bucket_id = 'product-images' AND is_admin());

-- ============================================================================
-- NOTES
-- ============================================================================
-- 1. Run this script in Supabase SQL Editor before starting the app.
-- 2. Seed data must be inserted for the app to display products.
-- 3. Service role key bypasses RLS; anon key is restricted by the policies above.
-- 4. WDN reference is auto-generated via trigger on requests table.
-- 5. Storage bucket 'product-images' must be created manually.
-- 6. Admin: create user in Supabase Auth, then INSERT INTO user_roles (user_id, role)
--    VALUES ('<uuid>', 'admin');