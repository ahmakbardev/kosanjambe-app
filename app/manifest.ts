import type { MetadataRoute } from "next";

/**
 * Manifest PWA. Ini yang bikin app-nya bisa dipasang ke layar utama — tanpa
 * ini, Chrome nggak akan pernah nawarin install.
 *
 * `display: standalone` juga yang dibaca app/components/gate-app.tsx buat tahu
 * app-nya dibuka dari layar utama atau dari dalam browser.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "kosanjambe — app penghuni",
    short_name: "kosanjambe",
    description:
      "Tagihan, lapor kerusakan, dan info kos kamu — semuanya di satu app.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#141414",
    orientation: "portrait",
    lang: "id",
    icons: [
      {
        src: "/icon.svg",
        // "any" dipakai buat SVG: ukurannya ngikut, nggak dipatok satu angka.
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        // maskable = ikonnya boleh dipotong bulat/kotak sesuai HP-nya. Aman
        // karena rumahnya ada di tengah, jauh dari tepi.
        purpose: "maskable",
      },
    ],
  };
}
