import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: [
    "antd",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
    "@ant-design/icons",
    "@ant-design/icons-svg",
  ],
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
