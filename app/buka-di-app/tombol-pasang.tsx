"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Share } from "lucide-react";
import { daftarkanSW, tandaiTerpasang, type EventPasang } from "@/lib/pwa";

export default function TombolPasang() {
  // Cuma dua state, dua-duanya diubah dari event handler — bukan disinkronin
  // di dalam effect. Sisanya diturunin waktu render.
  const [terpasang, setTerpasang] = useState(false);
  const [siap, setSiap] = useState(false);
  const [memasang, setMemasang] = useState(false);
  const tawaran = useRef<EventPasang | null>(null);

  useEffect(() => {
    daftarkanSW();

    // Chrome nembak event ini kalau app-nya memenuhi syarat install. Default-nya
    // dia mau nampilin banner sendiri; kita cegat biar tombol di bawah yang
    // nentuin kapan munculnya.
    function tawarkan(e: Event) {
      e.preventDefault();
      tawaran.current = e as EventPasang;
      setSiap(true);
    }

    function selesai() {
      tandaiTerpasang();
      setTerpasang(true);
    }

    window.addEventListener("beforeinstallprompt", tawarkan);
    window.addEventListener("appinstalled", selesai);

    return () => {
      window.removeEventListener("beforeinstallprompt", tawarkan);
      window.removeEventListener("appinstalled", selesai);
    };
  }, []);

  async function pasang() {
    const minta = tawaran.current;
    if (!minta || memasang) return;

    setMemasang(true);
    await minta.prompt();
    const { outcome } = await minta.userChoice;

    // Tawarannya cuma bisa dipakai sekali. Kalau ditolak, Chrome yang nentuin
    // kapan mau nawarin lagi — kita nggak bisa maksa munculin ulang, makanya
    // tampilannya balik ke cara manual.
    tawaran.current = null;
    setSiap(false);
    setMemasang(false);

    if (outcome === "accepted") {
      tandaiTerpasang();
      setTerpasang(true);
    }
  }

  if (terpasang) {
    return (
      <div className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-white/10 text-[14px] font-semibold text-white">
        <Check className="size-4 text-accent" />
        Kepasang! Buka dari layar HP kamu
      </div>
    );
  }

  if (siap) {
    return (
      <button
        type="button"
        onClick={pasang}
        disabled={memasang}
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-accent text-[14px] font-semibold text-ink transition-colors hover:bg-accent-hover disabled:opacity-70"
      >
        {memasang ? "Lagi masang…" : "Pasang aplikasinya"}
        {!memasang && <ArrowRight className="size-4" />}
      </button>
    );
  }

  // Nggak ada tawaran install: iOS (Safari emang nggak punya), atau Chrome belum
  // ngizinin. Kasih cara manualnya — jangan tombol mati yang bikin orang ngira
  // app-nya rusak.
  return (
    <div className="mt-6 rounded-2xl border border-white/15 bg-white/5 p-4">
      <p className="flex items-center gap-2 text-[13px] font-semibold text-white">
        <Share className="size-4 text-accent" />
        Pasang sendiri, gampang kok
      </p>
      <ol className="mt-2 space-y-1 text-[12px] leading-5 text-white/60">
        <li>1. Ketuk tombol Bagikan / menu titik tiga di browser</li>
        <li>
          2. Pilih{" "}
          <span className="text-white/80">Tambahkan ke Layar Utama</span>
        </li>
        <li>3. Buka kosanjambe dari layar HP, bukan dari browser lagi</li>
      </ol>
    </div>
  );
}
