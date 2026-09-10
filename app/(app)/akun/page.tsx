import type { Metadata } from "next";
import { Building2, CalendarDays, DoorClosed } from "lucide-react";
import { PENGHUNI } from "@/lib/dummy";
import TombolKeluar from "./tombol-keluar";

export const metadata: Metadata = {
  title: "Akun — kosanjambe",
};

const BARIS = [
  { icon: Building2, label: "Kos", nilai: PENGHUNI.kos },
  { icon: DoorClosed, label: "Kamar", nilai: PENGHUNI.kamar },
  { icon: CalendarDays, label: "Mulai ngekos", nilai: PENGHUNI.masuk },
] as const;

export default function AkunPage() {
  return (
    <main className="px-5 pt-safe-top">
      <h1 className="pt-7 text-xl font-semibold tracking-tight text-ink">
        Akun
      </h1>

      <div className="mt-4 flex items-center gap-3.5 rounded-2xl border border-neutral-200 p-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-accent text-[15px] font-semibold text-ink">
          {PENGHUNI.nama
            .split(" ")
            .map((kata) => kata[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[15px] font-semibold text-ink">
            {PENGHUNI.nama}
          </p>
          <p className="text-[13px] text-neutral-500">Penghuni</p>
        </div>
      </div>

      <ul className="mt-3 divide-y divide-neutral-200 rounded-2xl border border-neutral-200">
        {BARIS.map((baris) => {
          const Icon = baris.icon;
          return (
            <li
              key={baris.label}
              className="flex items-center gap-3 px-4 py-3 text-[13px]"
            >
              <Icon className="size-3.5 shrink-0 text-neutral-400" />
              <span className="text-neutral-500">{baris.label}</span>
              <span className="ml-auto truncate font-medium text-ink">
                {baris.nilai}
              </span>
            </li>
          );
        })}
      </ul>

      <div className="mt-5">
        <TombolKeluar />
      </div>

      <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
        Dummy — datanya karangan. Keluar cuma ngapus cookie sesi lokal.
      </p>
    </main>
  );
}
