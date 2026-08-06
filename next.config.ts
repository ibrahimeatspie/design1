import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Dev-only assets are blocked cross-origin by default, which breaks testing
  // on a phone over the LAN address instead of localhost.
  allowedDevOrigins: ["10.0.0.134", "192.168.*.*", "10.0.*.*"],
};

export default nextConfig;
