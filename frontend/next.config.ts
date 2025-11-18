import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images-cdn.ubuy.com.sa",
      },
    ],
  },
};

export default nextConfig;
