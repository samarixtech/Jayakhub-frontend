import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    }
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "192.168.100.9",
        port: "5000",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "100mb",
    },
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
