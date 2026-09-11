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
 * Saklar layar "pasang aplikasinya" yang nutup app kalau dibuka dari browser
 * biasa (lihat app/components/gate-app.tsx).
 *
 * Default: MATI waktu `next dev`, NYALA waktu sudah di-build. Alasannya bukan
 * cuma kenyamanan — install PWA cuma jalan di HTTPS atau localhost, jadi di dev
 * (apalagi kalau dibuka dari HP lewat IP jaringan) gate-nya cuma jadi jalan
 * buntu: nggak bisa masang, nggak bisa lanjut.
 *
 * Bisa dipaksa lewat .env.local kalau mau ngetes tampilannya:
 *   NEXT_PUBLIC_GATE_APP=1  → nyala walau lagi dev
 *   NEXT_PUBLIC_GATE_APP=0  → mati walau sudah production
 */
const paksaGate = process.env.NEXT_PUBLIC_GATE_APP;

export const GATE_APP_AKTIF =
  paksaGate === "1" ||
  (paksaGate !== "0" && process.env.NODE_ENV === "production");
