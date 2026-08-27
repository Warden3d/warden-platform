/**
 * WARDEN Catalog Seed — Supabase
 *
 * Populates Supabase with the current mock catalog data.
 * Idempotent: uses upsert (ON CONFLICT) so it's safe to run multiple times.
 *
 * Usage:
 *   npx tsx scripts/seed-supabase.ts
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY in .env.local (already present).
 */

import { createClient } from "@supabase/supabase-js";
import {
  collections,
  categories,
  compatibilitySystems,
  licenses,
  productTypes,
  products,
  bundles,
  drops,
} from "../src/data/warden-catalog";

// ── Config ────────────────────────────────────────────────────────

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    "❌ Missing environment variables. Run with:\n" +
      "   npx dotenv -e .env.local -- npx tsx scripts/seed-supabase.ts",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Helpers ───────────────────────────────────────────────────────

async function upsert(table: string, rows: Record<string, unknown>[], conflictColumn: string) {
  if (rows.length === 0) {
    console.log(`  ⏭️  ${table}: 0 rows, skipping`);
    return;
  }
  const { error } = await supabase.from(table).upsert(rows, {
    onConflict: conflictColumn,
    ignoreDuplicates: false,
  });
  if (error) {
    console.error(`  ❌ ${table}:`, error.message);
    throw error;
  }
  console.log(`  ✅ ${table}: ${rows.length} rows`);
}

async function count(table: string): Promise<number> {
  const { count, error } = await supabase
    .from(table)
    .select("*", { count: "exact", head: true });
  if (error) {
    console.error(`  ⚠️  count ${table}: ${error.message}`);
    return 0;
  }
  return count ?? 0;
}

// ── Seed ──────────────────────────────────────────────────────────

async function seed() {
  console.log("\n🚀 WARDEN Catalog Seed — Supabase\n");

  // 1. Collections
  console.log("📦 Collections");
  await upsert(
    "collections",
    collections.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      thumbnail_url: c.thumbnailUrl,
    })),
    "id",
  );

  // 2. Categories
  console.log("\n📂 Categories");
  await upsert(
    "categories",
    categories.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
    })),
    "id",
  );

  // 3. Compatibility Systems
  console.log("\n🎮 Compatibility Systems");
  await upsert(
    "compatibility_systems",
    compatibilitySystems.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
    })),
    "id",
  );

  // 4. Licenses
  console.log("\n📜 Licenses");
  await upsert(
    "licenses",
    licenses.map((l) => ({
      id: l.id,
      name: l.name,
      description: l.description,
      website: l.website ?? null,
      logo_url: l.logoUrl ?? null,
    })),
    "id",
  );

  // 5. Product Types
  console.log("\n🏷️  Product Types");
  await upsert(
    "product_types",
    productTypes.map((t) => ({
      id: t.id,
      category_id: t.categoryId,
      name: t.name,
    })),
    "id",
  );

  // 6. Products
  console.log("\n🔧 Products");
  await upsert(
    "products",
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      short_description: p.shortDescription,
      description: p.description,
      collection_id: p.collectionId,
      category_id: p.categoryId,
      type_id: p.typeId || null,
      compatibility_id: p.compatibilityId,
      scale: p.scale,
      material: p.material,
      height: p.dimensions.height,
      width: p.dimensions.width,
      depth: p.dimensions.depth,
      price: p.price,
      game_features: p.gameFeatures,
      status: p.status,
      featured: p.featured,
      internal_code: p.internalCode,
      associated_license_id: p.associatedLicenseId,
      designer_name: (p as any).designerName ?? null,
      weight: p.weight,
      volume: p.volume,
      print_time: p.printTime,
      version: p.version,
      related_product_ids: p.relatedProductIds,
      related_bundle_ids: p.relatedBundleIds,
      related_drop_ids: p.relatedDropIds,
    })),
    "id",
  );

  // 7. Product Images
  console.log("\n🖼️  Product Images");
  const allImages = products.flatMap((p) => p.images);
  await upsert(
    "product_images",
    allImages.map((img) => ({
      id: img.id,
      product_id: img.productId,
      url: img.url,
      alt: img.alt,
      is_primary: img.isPrimary,
      sort_order: img.sortOrder,
      view_type: img.viewType,
    })),
    "id",
  );

  // 8. Product Specs
  console.log("\n📋 Product Specs");
  const allSpecs = products.flatMap((p) => p.specs);
  await upsert(
    "product_specs",
    allSpecs.map((s) => ({
      id: s.id,
      product_id: s.productId,
      spec_key: s.key,
      spec_label: s.label,
      spec_value: s.value,
      visibility: s.visibility,
      sort_order: s.sortOrder,
    })),
    "id",
  );

  // 9. Product Variants
  console.log("\n🎨 Product Variants");
  const allVariants = products.flatMap(
    (p) =>
      (p.variants ?? []).map((v, idx) => ({
        id: `var-${p.id}-${idx + 1}`,
        product_id: p.id,
        name: v.name,
        price: v.price,
        swatch_color: v.swatchColor ?? null,
        image_indices: v.imageIndices ?? [],
        sort_order: idx + 1,
      })),
  );
  await upsert("product_variants", allVariants, "id");

  // 10. Bundles
  console.log("\n📦 Bundles");
  await upsert(
    "bundles",
    bundles.map((b) => ({
      id: b.id,
      slug: b.slug,
      name: b.name,
      description: b.description,
      theme: b.theme,
      price: b.price,
      discount_label: b.discountLabel,
      status: b.status,
      featured: b.featured,
    })),
    "id",
  );

  // 11. Bundle Items
  console.log("\n🔗 Bundle Items");
  const bundleItems = bundles.flatMap((b) =>
    b.productIds.map((pid, idx) => ({
      id: `bi-${b.id}-${idx + 1}`,
      bundle_id: b.id,
      product_id: pid,
      sort_order: idx + 1,
    })),
  );
  await upsert("bundle_items", bundleItems, "id");

  // 12. Bundle Images
  console.log("\n🖼️  Bundle Images");
  const allBundleImages = bundles.flatMap((b) => b.images);
  await upsert(
    "bundle_images",
    allBundleImages.map((img) => ({
      id: img.id,
      bundle_id: img.productId,
      url: img.url,
      alt: img.alt,
      is_primary: img.isPrimary,
      sort_order: img.sortOrder,
      view_type: img.viewType,
    })),
    "id",
  );

  // 13. Bundle Specs
  console.log("\n📋 Bundle Specs");
  const allBundleSpecs = bundles.flatMap((b) => b.specs);
  await upsert(
    "bundle_specs",
    allBundleSpecs.map((s) => ({
      id: s.id,
      bundle_id: s.productId,
      spec_key: s.key,
      spec_label: s.label,
      spec_value: s.value,
      visibility: s.visibility,
      sort_order: s.sortOrder,
    })),
    "id",
  );

  // 14. Drops
  console.log("\n🚀 Drops");
  await upsert(
    "drops",
    drops.map((d) => ({
      id: d.id,
      slug: d.slug,
      name: d.name,
      description: d.description,
      theme: d.theme,
      starts_at: d.startsAt,
      ends_at: d.endsAt,
      status: d.status,
      thumbnail_url: d.thumbnailUrl,
    })),
    "id",
  );

  // 15. Drop Items
  console.log("\n🔗 Drop Items");
  const dropItems = drops.flatMap((d) =>
    d.productIds.map((pid, idx) => ({
      id: `di-${d.id}-${idx + 1}`,
      drop_id: d.id,
      product_id: pid,
      sort_order: idx + 1,
    })),
  );
  await upsert("drop_items", dropItems, "id");

  // ── Final counts ──
  console.log("\n" + "=".repeat(50));
  console.log("📊 POST-SEED COUNTS");
  console.log("=".repeat(50));

  const tables = [
    "collections",
    "categories",
    "compatibility_systems",
    "licenses",
    "product_types",
    "products",
    "product_images",
    "product_specs",
    "product_variants",
    "bundles",
    "bundle_items",
    "bundle_images",
    "bundle_specs",
    "drops",
    "drop_items",
  ];

  for (const table of tables) {
    const c = await count(table);
    console.log(`  ${table.padEnd(25)} ${c}`);
  }

  console.log("\n✅ Seed completed successfully.\n");
}

seed().catch((err) => {
  console.error("\n❌ Seed failed:", err);
  process.exit(1);
});