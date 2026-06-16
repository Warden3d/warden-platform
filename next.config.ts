import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Allow unoptimized local placeholder images in dev/fallback mode
    unoptimized: Boolean(
      !process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
