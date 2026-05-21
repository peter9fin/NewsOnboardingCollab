import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  basePath: isProd ? "/NewsOnboarding" : "",
  assetPrefix: isProd ? "/NewsOnboarding" : "",
  images: { unoptimized: true },
};

export default nextConfig;
