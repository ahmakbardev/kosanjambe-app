import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/app/components/ui/button";
import { LAPORAN } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Laporan — kosanjambe",
};

const WARNA_STATUS = {
  Dilaporin: "bg-neutral-100 text-neutral-600",
  Dikerjain: "bg-amber-50 text-amber-700",
  Beres: "bg-emerald-50 text-emerald-700",
} as const;

export default function LaporanPage() {
  return (
    <main className="px-5 pt-safe-top">
      <div className="flex items-center justify-between pt-7">
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          Laporan
        </h1>
        <Button size="sm" className="rounded-full">
          <Plus className="size-3.5" />
          Lapor
        </Button>
      </div>

      <ul className="mt-4 space-y-2">
        {LAPORAN.map((laporan) => (
          <li
            key={laporan.judul}
            className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-3.5 py-2.5"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-ink">
                {laporan.judul}
              </p>
              <p className="text-[11px] text-neutral-400">{laporan.tanggal}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium",
                WARNA_STATUS[laporan.status],
              )}
            >
              {laporan.status}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
        Dummy — tombol Lapor belum bikin apa-apa. Form-nya (foto, deskripsi,
        kategori) nyusul.
      </p>
    </main>
  );
}
