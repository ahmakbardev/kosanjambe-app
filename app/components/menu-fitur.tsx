import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  MessageCircle,
  ReceiptText,
  Wallet,
  Wifi,
  Wrench,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Fitur = {
  judul: string;
  teks: string;
  icon: typeof Wallet;
  href?: string;
  segera?: boolean;
};

/**
 * Isi app, ditulis pakai bahasa yang dipakai anak kos, bukan nama menu. Yang
 * belum ada halamannya dikasih tanda "Segera" — bukan di-link ke route yang
 * bakal 404.
 *
 * Peta sengaja nggak ikut daftar ini: dia diangkat jadi kartu sendiri di atas.
 * Kalau semua baris kelihatan sama beratnya, nggak ada yang kebaca duluan.
 */
const FITUR: Fitur[] = [
  {
    judul: "Bayar kos",
    teks: "Tanpa transfer",
    icon: Wallet,
    href: "/tagihan",
  },
  {
    judul: "Lapor rusak",
    teks: "Keran, Wi-Fi, kunci",
    icon: Wrench,
    href: "/laporan",
  },
  {
    judul: "Riwayat bayar",
    teks: "Bulan-bulan lalu",
    icon: ReceiptText,
    href: "/tagihan",
  },
  {
    judul: "Info kos",
    teks: "Wi-Fi & aturannya",
    icon: Wifi,
    href: "/beranda#info-kos",
  },
  {
    judul: "Chat pemilik",
    teks: "Nanya langsung, nggak lewat grup",
    icon: MessageCircle,
    segera: true,
  },
];

/** Isi kartu grid: ikon di atas, judul, keterangan singkat. */
function IsiKotak({ fitur }: { fitur: Fitur }) {
  const Icon = fitur.icon;

  return (
    <>
      {/* Ikonnya sengaja netral semua — biar yang mencolok cuma kartu peta di
          atas. Kalau tiap kotak dikasih warna sendiri, highlight-nya ilang. */}
      <span className="flex size-9 items-center justify-center rounded-xl bg-neutral-100 text-ink">
        <Icon className="size-[18px]" />
      </span>

      <span className="mt-2.5 block w-full">
        <span className="block text-[13px] font-medium text-ink">
          {fitur.judul}
        </span>
        {/* truncate: keterangannya pendek-pendek, tapi kalau nanti ada yang
            kepanjangan biar kepotong rapi, nggak melebarin kolom grid. */}
        <span className="mt-0.5 block truncate text-[11px] text-neutral-400">
          {fitur.teks}
        </span>
      </span>
    </>
  );
}

const KELAS_KOTAK =
  "flex flex-col items-start rounded-2xl border border-neutral-200 p-3.5 text-left";

export default function MenuFitur() {
  return (
    <section>
      <h2 className="text-[15px] font-semibold tracking-tight text-ink">
        Mau ngapain hari ini?
      </h2>
      <p className="mt-0.5 text-[12px] text-neutral-500">
        Semua urusan kos kamu ada di sini.
      </p>

      {/* Kartu utama: peta. Dikasih warna merek biar jadi hal pertama yang
          kena mata begitu section ini kelewat. */}
      <Link
        href="/peta"
        className="mt-3 flex items-center gap-3.5 rounded-2xl bg-accent p-4 transition-colors hover:bg-accent-hover"
      >
        <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-ink">
          <MapPin className="size-5 text-accent" />
        </span>

        <span className="min-w-0 flex-1">
          <span className="block text-[15px] font-semibold tracking-tight text-ink">
            Laper? Butuh laundry?
          </span>
          <span className="mt-0.5 block text-[12px] leading-4 text-ink/70">
            Warung, minimarket, sampai fotokopi — semua yang deket kos ada di
            peta.
          </span>
          <span className="mt-2 inline-flex items-center gap-1 text-[12px] font-semibold text-ink">
            Gas lihat sekitar
            <ArrowRight className="size-3.5" />
          </span>
        </span>
      </Link>

      <div className="mt-2.5 grid grid-cols-2 gap-2.5">
        {FITUR.map((fitur) =>
          fitur.href ? (
            <Link
              key={fitur.judul}
              href={fitur.href}
              className={cn(
                KELAS_KOTAK,
                "transition-colors hover:bg-neutral-50",
              )}
            >
              <IsiKotak fitur={fitur} />
            </Link>
          ) : (
            // Yang belum jadi ditaruh melebar di baris terakhir: jumlah
            // fiturnya ganjil, dan ini yang paling nggak penting buat dipencet.
            <div
              key={fitur.judul}
              className="col-span-2 flex items-center gap-3 rounded-2xl border border-dashed border-neutral-200 px-3.5 py-2.5"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
                <MessageCircle className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-neutral-400">
                  {fitur.judul}
                </span>
                <span className="block truncate text-[11px] text-neutral-400">
                  {fitur.teks}
                </span>
              </span>
              <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500">
                Segera
              </span>
            </div>
          ),
        )}
      </div>
    </section>
  );
}
