"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { GATE_APP_AKTIF } from "@/lib/site";
import { daftarkanSW, dibukaSebagaiApp, pernahTerpasang } from "@/lib/pwa";

/** Halaman tujuan kalau app dibuka dari browser biasa. */
const HALAMAN_GATE = "/buka-di-app";

function ikutiModeTampilan(onChange: () => void) {
  const mq = window.matchMedia("(display-mode: standalone)");
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Nggak nampilin apa-apa — tugasnya cuma ngelempar ke halaman gate, dan
 * daftarin service worker biar Chrome mau nawarin install.
 *
 * Reminder-nya berhenti muncul kalau salah satu bener:
 * 1. app-nya lagi dibuka DARI layar utama (display-mode: standalone), atau
 * 2. app-nya udah pernah kepasang dari HP ini — browser nggak ngasih tahu ini,
 *    jadi penandanya kita simpan sendiri waktu install-nya berhasil.
 */
export default function GateApp() {
  const router = useRouter();
  const pathname = usePathname();

  // Di server dianggap terpasang: kalau nggak, tiap halaman bakal sempat
  // ngelempar duluan sebelum React tahu ini browser atau bukan.
  const sebagaiApp = useSyncExternalStore(
    ikutiModeTampilan,
    dibukaSebagaiApp,
    () => true,
  );

  useEffect(() => {
    daftarkanSW();
  }, []);

  useEffect(() => {
    if (!GATE_APP_AKTIF) return;
    if (sebagaiApp || pernahTerpasang()) {
      // Nyasar ke halaman gate padahal nggak perlu — balikin ke app.
      if (pathname === HALAMAN_GATE) router.replace("/");
      return;
    }

    // Dibuka dari browser dan belum pernah masang → lempar ke halaman gate.
    // replace, bukan push, biar tombol back nggak balik ke halaman tadi.
    if (pathname !== HALAMAN_GATE) router.replace(HALAMAN_GATE);
  }, [sebagaiApp, pathname, router]);

  return null;
}
