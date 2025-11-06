//next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // 👇 Esto evita que Next.js empaquete pdfkit dentro de .next
    serverComponentsExternalPackages: ["pdfkit"],
  },
  webpack: (config) => {
    // 👇 Esto evita conflictos con dependencias opcionales (ej. canvas)
    config.externals.push({ canvas: "commonjs canvas" });
    return config;
  },
};

export default nextConfig;
