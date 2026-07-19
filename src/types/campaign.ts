// ─── Block types ────────────────────────────────

export type BlockType =
  | "hero"
  | "origins"
  | "scenario"
  | "design"
  | "gallery"
  | "products"
  | "cta";

// ─── Block registry entry ───────────────────────

export interface CampaignBlock {
  /** Unique block type identifier, resolved via the component registry */
  type: BlockType;
  /** Props forwarded to the rendered component */
  props: Record<string, unknown>;
}

// ─── Campaign assets ───────────────────────────┐

export interface CampaignAsset {
  url: string;
  alt: string;
  caption?: string;
}

export interface CampaignAssets {
  heroImage?: string;
  heroVideo?: string;
  trailerVideo?: string;
  trailerPoster?: string;
  images: CampaignAsset[];
  renders: CampaignAsset[];
}

// ─── Campaign metadata ─────────────────────────┐

export interface CampaignMetadata {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  status: "upcoming" | "live" | "ended";
  ctaLabel: string;
  pdpSlug: string;
}

// ─── Full campaign configuration ───────────────┐

export interface CampaignConfig {
  metadata: CampaignMetadata;
  assets: CampaignAssets;
  blocks: CampaignBlock[];
}
