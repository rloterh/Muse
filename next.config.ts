import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
    ],
  },
  experimental: { optimizePackageImports: ["lucide-react", "framer-motion"] },
};
export default nextConfig;
