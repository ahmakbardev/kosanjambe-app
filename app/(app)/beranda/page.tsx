import type { Metadata } from "next";
import Link from "next/link";
import { CalendarClock, MapPin } from "lucide-react";
import Button from "@/app/components/ui/button";
import BannerSlider from "@/app/components/banner-slider";
import MenuFitur from "@/app/components/menu-fitur";
import InfoKos from "@/app/components/info-kos";
import { PENGHUNI, TAGIHAN, rupiah } from "@/lib/dummy";

export const metadata: Metadata = {
  title: "Beranda — kosanjambe",
};

/** Tujuan pendaratan setelah login. Isinya masih dummy. */
export default function BerandaPage() {
  return (
    <main className="px-5 pt-safe-top">
      <header className="pt-7">
        <p className="text-[13px] text-neutral-500">Halo,</p>
        <h1 className="text-xl font-semibold tracking-tight text-ink">
          {PENGHUNI.nama.split(" ")[0]}
        </h1>
        <p className="mt-0.5 text-[13px] text-neutral-500">
          {PENGHUNI.kos} · {PENGHUNI.kamar}
        </p>
      </header>

      {/* Tagihan — alasan utama orang buka app ini tiap bulan. */}
      <section className="mt-5 rounded-2xl bg-ink p-4 text-white">
        <p className="text-[13px] text-white/60">Tagihan {TAGIHAN.periode}</p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight">
          {rupiah(TAGIHAN.jumlah)}
        </p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[13px] text-white/70">
          <CalendarClock className="size-3.5" />
          Jatuh tempo {TAGIHAN.jatuhTempo}
        </p>
        <Button className="mt-3.5 w-full">Bayar sekarang</Button>
      </section>

      {/* Banner duluan, baru menu fitur. Isinya kabar yang basi kalau telat
          kebaca — pengumuman dari pemilik kos. Menu fitur sebaliknya, selalu ada
          dan udah punya jalan pintas sendiri di tab bar bawah. */}
      <div className="mt-5">
        <BannerSlider />
      </div>

      <div className="mt-6">
        <MenuFitur />
      </div>

      <section id="info-kos" className="mt-6 scroll-mt-4 pb-8">
        <div className="flex items-baseline justify-between">
          <h2 className="text-[13px] font-semibold text-ink">Info kos</h2>
          <Link
            href="/peta"
            className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-600"
          >
            <MapPin className="size-3" />
            Lihat sekitar
          </Link>
        </div>

        <div className="mt-2.5">
          <InfoKos />
        </div>

        <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-[11px] leading-5 text-amber-700">
          Semua isi halaman ini dummy — belum ada server, dan tombolnya belum
          ngapa-ngapain.
        </p>
      </section>
    </main>
  );
}
