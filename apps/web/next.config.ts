import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@elevateflow/db",
    "@elevateflow/types",
    "@elevateflow/validators",
    "@elevateflow/ui",
  ],
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;
