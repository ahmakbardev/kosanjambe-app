"use client";

import { useState } from "react";
import { Check, Copy, Clock, Sparkles, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";
import { INFO_KOS } from "@/lib/dummy";

/**
 * Info kos di beranda. Sengaja bukan daftar label–nilai: Wi-Fi dikasih porsi
 * paling besar karena sandinya yang paling sering dicari, dan satu-satunya yang
 * bisa dipakai langsung (disalin). Sisanya cuma dibaca sekilas, jadi cukup
 * kartu kecil.
 */
export default function InfoKos() {
  const [tersalin, setTersalin] = useState(false);

  async function salin() {
    try {
      await navigator.clipboard.writeText(INFO_KOS.wifi.sandi);
      setTersalin(true);
      setTimeout(() => setTersalin(false), 2000);
    } catch {
      // Clipboard ditolak (biasanya bukan HTTPS) — sandinya toh kelihatan,
      // tinggal diketik manual.
    }
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-3 rounded-2xl bg-neutral-100 p-3.5">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white">
          <Wifi className="size-4 text-ink" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] text-neutral-500">
            Wi-Fi · {INFO_KOS.wifi.ssid}
          </p>
          <p className="truncate text-[15px] font-semibold tracking-wide text-ink">
            {INFO_KOS.wifi.sandi}
          </p>
        </div>

        <button
          type="button"
          onClick={salin}
          aria-label="Salin sandi Wi-Fi"
          className={cn(
            "flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold transition-colors",
            tersalin
              ? "bg-emerald-100 text-emerald-700"
              : "bg-ink text-white hover:bg-neutral-800",
          )}
        >
          {tersalin ? (
            <>
              <Check className="size-3" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="size-3" />
              Salin
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl border border-neutral-200 p-3.5">
          <Clock className="size-4 text-neutral-400" />
          <p className="mt-2 text-[11px] text-neutral-500">Jam tamu</p>
          <p className="text-[13px] font-medium text-ink">{INFO_KOS.jamTamu}</p>
        </div>

        <div className="rounded-2xl border border-neutral-200 p-3.5">
          <Sparkles className="size-4 text-neutral-400" />
          <p className="mt-2 text-[11px] text-neutral-500">Kebersihan</p>
          <p className="text-[13px] font-medium text-ink">
            {INFO_KOS.kebersihan}
          </p>
        </div>
      </div>
    </div>
  );
}
