import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Réplica estática de boletapp.co (public/boletapp, export de Next con basePath /boletapp y sin
  // barra final): cada página es un .html. Va después de los archivos de public, así que los
  // assets (_next, afiches, .txt de navegación) se sirven tal cual.
  async rewrites() {
    return [
      { source: "/boletapp", destination: "/boletapp/index.html" },
      // Sin barra final, el router de la réplica pide el payload del home como /boletapp.txt.
      { source: "/boletapp.txt", destination: "/boletapp/index.txt" },
      { source: "/boletapp/:path+", destination: "/boletapp/:path+.html" },
    ];
  },
};

export default nextConfig;
