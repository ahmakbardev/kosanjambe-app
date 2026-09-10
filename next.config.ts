import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    /**
     * Same reason as in web/: Next spawns one render worker per CPU core, and
     * this machine runs both dev servers at once on tight RAM. Capping the pool
     * trades a little build speed for not getting a worker killed mid-compile.
     */
    cpus: 1,
  },
};

export default nextConfig;
