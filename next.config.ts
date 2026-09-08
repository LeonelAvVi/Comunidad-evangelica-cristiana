import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      // Eventos antiguos que aún tengan flyer en Firebase Storage
      { protocol: "https", hostname: "firebasestorage.googleapis.com" },
      { protocol: "https", hostname: "firebasestorage.app" },
    ],
  },
};

export default nextConfig;
