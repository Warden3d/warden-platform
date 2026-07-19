import type { CampaignConfig, BlockType } from "@/types/campaign";
import { HeroWithTrailer } from "./hero-with-trailer";
import { CampaignOrigins } from "./campaign-origins";
import { CampaignScenarioSection } from "./campaign-scenario-section";
import { CampaignDesignSection } from "./campaign-design-section";
import { CampaignGallery } from "./campaign-gallery";
import { CampaignProductsSection } from "./campaign-products-section";
import { CampaignCta } from "./campaign-cta";

// ─── Component registry ────────────────────────
// Maps each BlockType to its React component.
// To add a new block type, register it here and add the type to CampaignBlock.

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry accepts components with varied props
const registry: Record<BlockType, React.ComponentType<any>> = {
  hero: HeroWithTrailer,
  origins: CampaignOrigins,
  scenario: CampaignScenarioSection,
  design: CampaignDesignSection,
  gallery: CampaignGallery,
  products: CampaignProductsSection,
  cta: CampaignCta,
};

// ─── Renderer ──────────────────────────────────

interface CampaignRendererProps {
  config: CampaignConfig;
}

/**
 * CampaignRenderer — Iterates over a campaign's block list and renders
 * each block by resolving its type from the component registry.
 *
 * To add a new block type:
 * 1. Create the component
 * 2. Add its type to `BlockType` in `@/types/campaign`
 * 3. Import and register it in `registry` above
 * 4. Add the block entry to the campaign config's `blocks` array
 *
 * No page-level code changes needed.
 */
export function CampaignRenderer({ config }: CampaignRendererProps) {
  if (config.blocks.length === 0) return null;

  return (
    <>
      {config.blocks.map((block, idx) => {
        const Component = registry[block.type];
        if (!Component) {
          console.warn(
            `[CampaignRenderer] Unknown block type: "${block.type}". Skipping.`
          );
          return null;
        }
        return <Component key={`${block.type}-${idx}`} {...block.props} />;
      })}
    </>
  );
}
