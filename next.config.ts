import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/collections",
        destination: "/catalog",
        permanent: true,
      },
      {
        source: "/collections/warden-core",
        destination: "/catalog?collection=col-warden-core",
        permanent: true,
      },
      {
        source: "/collections/licenses",
        destination: "/catalog?collection=col-licenses",
        permanent: true,
      },
      {
        source: "/collections/licenses/:slug",
        destination: "/catalog?collection=col-licenses",
        permanent: true,
      },
      {
        source: "/collections/:slug",
        destination: "/catalog",
        permanent: true,
      },
    ];
  },
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
