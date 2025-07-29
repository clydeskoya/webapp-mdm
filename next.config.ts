import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    DCAT_AP_PT_ID: process.env.DCAT_AP_PT_ID,
  },
};

export default nextConfig;
