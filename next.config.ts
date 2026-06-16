import type { NextConfig } from "next";

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

export default nextConfig;
