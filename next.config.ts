import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/NewsOnboarding",
  assetPrefix: "/NewsOnboarding",
  images: { unoptimized: true },
};

export default nextConfig;
