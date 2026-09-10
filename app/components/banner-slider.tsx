"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { BANNER } from "@/lib/dummy";

/** Jeda pindah slide otomatis. */
const AUTO_MS = 5000;

const WARNA_TAG = {
  Pengumuman: "bg-white/95 text-ink",
  Promo: "bg-accent text-ink",
  Tips: "bg-white/95 text-ink",
} as const;

/**
 * Banner geser di beranda. Pakai scroll-snap, bukan library carousel — swipe di
 * HP jadi gerakan native, dan nggak ada dependensi baru buat empat kartu.
 */
export default function BannerSlider() {
  const track = useRef<HTMLDivElement>(null);
  const [aktif, setAktif] = useState(0);
  // Begitu orang geser sendiri, jalan otomatisnya berhenti selamanya — nggak
  // ada yang lebih ngeselin daripada banner yang loncat pas lagi dibaca.
  const [manual, setManual] = useState(false);

  /**
   * Jarak scroll dari satu banner ke banner berikutnya. Diukur dari DOM, bukan
   * dari lebar track — kartunya lebih sempit dari track (biar tetangganya
   * ngintip) dan ada gap di antaranya, jadi lebar track bukan ukuran langkahnya.
   */
  function langkah(el: HTMLDivElement): number {
    const [a, b] = [el.children[0], el.children[1]] as HTMLElement[];
    return b ? b.offsetLeft - a.offsetLeft : el.clientWidth;
  }

  useEffect(() => {
    if (manual) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const timer = setInterval(() => {
      const el = track.current;
      if (!el) return;
      const step = langkah(el);
      const berikut = (Math.round(el.scrollLeft / step) + 1) % BANNER.length;
      el.scrollTo({ left: berikut * step, behavior: "smooth" });
    }, AUTO_MS);

    return () => clearInterval(timer);
  }, [manual]);

  function handleScroll() {
    const el = track.current;
    if (!el) return;
    setAktif(Math.round(el.scrollLeft / langkah(el)));
  }

  function keSlide(i: number) {
    const el = track.current;
    if (!el) return;
    setManual(true);
    el.scrollTo({ left: i * langkah(el), behavior: "smooth" });
  }

  return (
    <section aria-label="Info dan promo">
      {/*
        Track-nya nembus padding halaman (-mx-5) biar kartu tetangganya bisa
        ngintip sampai tepi layar.

        Kartunya w-full — dan "full" di sini berarti selebar track DIKURANGI
        padding, karena persentase lebar anak dihitung dari content box induknya.
        Jadi padding px-9 otomatis jadi sisa yang sama persis di kiri dan kanan,
        di semua posisi. Jangan diganti jadi lebar persen: persen di padding
        dihitung dari lebar penuh track, jadi dua angka itu nggak akan ketemu.
      */}
      <div
        ref={track}
        onScroll={handleScroll}
        onPointerDown={() => setManual(true)}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-9"
      >
        {BANNER.map((banner, i) => (
          <article
            key={banner.id}
            className="relative aspect-[2/1] w-full shrink-0 snap-center overflow-hidden rounded-2xl"
          >
            <Image
              src={banner.gambar}
              alt=""
              fill
              // Cuma yang pertama kelihatan pas halaman kebuka.
              priority={i === 0}
              sizes="(max-width: 448px) 100vw, 408px"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />

            <div className="absolute inset-x-0 bottom-0 p-3.5">
              <span
                className={cn(
                  "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold",
                  WARNA_TAG[banner.tag],
                )}
              >
                {banner.tag}
              </span>
              <h3 className="mt-1.5 text-[15px] font-semibold leading-tight text-white">
                {banner.judul}
              </h3>
              <p className="mt-0.5 line-clamp-2 text-[11px] leading-4 text-white/75">
                {banner.teks}
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-2 flex justify-center gap-1.5">
        {BANNER.map((banner, i) => (
          <button
            key={banner.id}
            type="button"
            onClick={() => keSlide(i)}
            aria-label={`Ke banner ${i + 1}`}
            aria-current={i === aktif ? "true" : undefined}
            className={cn(
              "h-1.5 rounded-full transition-all",
              i === aktif ? "w-4 bg-ink" : "w-1.5 bg-neutral-300",
            )}
          />
        ))}
      </div>
    </section>
  );
}
