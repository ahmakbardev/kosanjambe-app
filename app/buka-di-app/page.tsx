import type { Metadata } from "next";
import Image from "next/image";
import { Smartphone } from "lucide-react";
import TombolPasang from "./tombol-pasang";

export const metadata: Metadata = {
  title: "Buka di aplikasi — kosanjambe",
};

/**
 * Tujuan pendaratan kalau app dibuka dari browser biasa. Yang ngelempar ke sini
 * app/components/gate-app.tsx; saklarnya GATE_APP_AKTIF di lib/site.ts.
 *
 * Halaman ini sengaja di luar grup (app) dan (auth): nggak ada tab bar, nggak
 * ada urusan sama sesi.
 */
export default function BukaDiAppPage() {
  return (
    <main className="flex flex-1 flex-col bg-ink">
      <div className="relative flex-1 overflow-hidden">
        <Image
          src="/images/hero-bg-1.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 448px) 100vw, 448px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
      </div>

      <div className="px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-1">
        <span className="inline-flex size-11 items-center justify-center rounded-2xl bg-accent">
          <Smartphone className="size-5 text-ink" />
        </span>

        <h1 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-white">
          Bukanya di aplikasi,
          <br />
          ya bukan di browser
        </h1>
        <p className="mt-2 text-[13px] leading-5 text-white/65">
          Tagihan, laporan kerusakan, sama notifikasi dari pemilik kos cuma
          jalan mulus di aplikasi kosanjambe.
        </p>

        <TombolPasang />

        <p className="mt-3 text-center text-[11px] text-white/40">
          Gratis, nggak lewat Play Store, dan cuma makan beberapa detik.
        </p>
      </div>
    </main>
  );
}
