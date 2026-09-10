/**
 * The landing page lives in a separate project (web/), so anything in the app
 * that links back out to it — terms, help, the public catalogue — goes through
 * here. GANTI bareng SITE_URL di web/lib/site.ts, dua-duanya masih placeholder.
 */
export const WEB_URL =
  process.env.NEXT_PUBLIC_WEB_URL ?? "https://kosanjambe.id";

export const APP_NAME = "kosanjambe";

/** Links out to the landing page, e.g. webUrl("/cara-sewa"). */
export const webUrl = (path = "/") => `${WEB_URL}${path}`;

/**
 * Saklar layar "download aplikasinya" yang nutup app kalau dibuka dari browser
 * biasa (lihat app/components/gate-app.tsx).
 *
 * SEMENTARA dinyalain buat ngerjain tampilannya. Matiin dengan ganti ke false —
 * atau taruh NEXT_PUBLIC_GATE_APP=0 di .env.local kalau mau matiin cuma di
 * mesin sendiri tanpa nyentuh kode.
 */
export const GATE_APP_AKTIF = process.env.NEXT_PUBLIC_GATE_APP !== "0";
