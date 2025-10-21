import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.pixabay.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.tiktokcdn.com", // ครอบ p16-sign-sg/p19-*/ฯลฯ
        port: "",
        pathname: "/**",
      },
    ],
  },
  output: "standalone",
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;
