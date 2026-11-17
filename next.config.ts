import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // Les anciennes adresses en .html (déjà indexées par Google) redirigent
    // définitivement vers les nouvelles adresses sans extension.
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/:page.html", destination: "/:path*/:page", permanent: true },
      { source: "/:page.html", destination: "/:page", permanent: true },
    ];
  },
};

export default nextConfig;
