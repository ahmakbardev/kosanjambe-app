/**
 * Service worker seadanya — SENGAJA nggak nge-cache apa pun.
 *
 * Ada di sini karena Chrome cuma nawarin "install app" kalau situsnya punya
 * service worker yang nangani event fetch. Jadi ini syarat administratif, bukan
 * strategi offline.
 *
 * Nanti kalau app-nya perlu jalan offline (misal tagihan terakhir tetap
 * kebuka pas sinyal ilang), logika cache-nya ditulis di sini.
 */

self.addEventListener("install", () => {
  // Langsung ambil alih, jangan nunggu tab lama ditutup dulu.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", () => {
  // Dibiarkan lewat ke jaringan apa adanya.
});
