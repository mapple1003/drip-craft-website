import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Allow SVG files to be served via next/image
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "behold.pictures" },
      { protocol: "https", hostname: "cdn2.behold.pictures" },
      { protocol: "https", hostname: "hop.behold.pictures" },
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
    ],
  },
};

export default nextConfig;
