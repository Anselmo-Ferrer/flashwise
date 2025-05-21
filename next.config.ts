import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['pdf-parse'],

  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push('pdf-parse');
    }
    return config;
  },
};

export default nextConfig;