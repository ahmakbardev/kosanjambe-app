/**
 * Urusan pasang-memasang app ke layar utama.
 *
 * Kenapa perlu penanda sendiri di localStorage: waktu app dibuka DARI layar
 * utama, `display-mode: standalone` udah cukup buat tahu. Tapi kalau orangnya
 * buka lagi lewat browser padahal app-nya udah kepasang, browser nggak ngasih
 * tahu apa-apa — jadi penandanya kita simpan sendiri pas install berhasil.
 */

const KUNCI_TERPASANG = "kj_pwa_terpasang";

/** Event Chrome yang nawarin install. Belum masuk lib.dom TypeScript. */
export type EventPasang = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Dibuka dari layar utama / store, bukan dari dalam browser. */
export function dibukaSebagaiApp(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export function tandaiTerpasang() {
  try {
    localStorage.setItem(KUNCI_TERPASANG, "1");
  } catch {
    // Mode private / storage diblokir — nggak apa-apa, paling reminder-nya
    // muncul lagi. Bukan alasan buat bikin app-nya error.
  }
}

export function pernahTerpasang(): boolean {
  try {
    return localStorage.getItem(KUNCI_TERPASANG) === "1";
  } catch {
    return false;
  }
}

/** Daftarin service worker. Tanpa ini Chrome nggak nawarin install sama sekali. */
export function daftarkanSW() {
  if (typeof window === "undefined") return;
  if (!("serviceWorker" in navigator)) return;

  navigator.serviceWorker.register("/sw.js").catch(() => {
    // Gagal daftar (http non-localhost, storage diblokir) cuma bikin tombol
    // install nggak muncul — sisa app-nya tetap jalan normal.
  });
}
