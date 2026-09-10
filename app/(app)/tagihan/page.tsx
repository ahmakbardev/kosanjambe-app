import type { Metadata } from "next";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import Button from "@/app/components/ui/button";
import { RIWAYAT_TAGIHAN, TAGIHAN, rupiah } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Tagihan — kosanjambe",
};

export default function TagihanPage() {
  return (
    <main className="px-5 pt-safe-top">
      <h1 className="pt-7 text-xl font-semibold tracking-tight text-ink">
        Tagihan
      </h1>

      <section className="mt-4 rounded-2xl bg-ink p-4 text-white">
        <p className="text-[13px] text-white/60">Belum dibayar</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight">
          {rupiah(TAGIHAN.jumlah)}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/70">
          <CalendarClock className="size-3.5" />
          {TAGIHAN.periode} · jatuh tempo {TAGIHAN.jatuhTempo}
        </p>
        <Button className="mt-3.5 w-full">Bayar sekarang</Button>
      </section>

      <section className="mt-6">
        <h2 className="text-[13px] font-semibold text-ink">Riwayat</h2>
        <ul className="mt-2.5 space-y-2">
          {RIWAYAT_TAGIHAN.map((tagihan) => (
            <li
              key={tagihan.periode}
              className="flex items-center justify-between gap-3 rounded-2xl border border-neutral-200 px-3.5 py-2.5"
            >
              <div>
                <p className="text-[13px] font-medium text-ink">
                  {tagihan.periode}
                </p>
                <p className="text-[11px] text-neutral-400">
                  {rupiah(tagihan.jumlah)}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                <CheckCircle2 className="size-3" />
                Lunas
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-5 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
        Dummy — angkanya karangan dan tombol bayar belum nyambung ke payment
        gateway mana pun.
      </p>
    </main>
  );
}
