"use client";

import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { Crosshair, MapPin, Navigation, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEMPAT } from "@/lib/dummy";
import {
  AMBANG_TARIK,
  DRAWER_MAX_VH,
  DRAWER_MIN,
  JENDELA_MS,
  durasiSnap as hitungDurasiSnap,
  jepit,
  kecepatanDari,
  titikSnap,
  tujuanSnap,
} from "@/lib/drawer-snap";
import CariTempat from "./cari-tempat";
import type { PetaProps } from "./peta-maplibre";

// MapLibre nyentuh DOM langsung, jadi jangan dirender di server. Generic-nya
// ditulis eksplisit karena default export-nya dibungkus memo, dan TypeScript
// nggak bisa nebak tipe props-nya dari situ.
const PetaMaplibre = dynamic<PetaProps>(() => import("./peta-maplibre"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse bg-neutral-200" />,
});

/**
 * Drawer selalu mulai dari tinggi terkecil — begitu halaman kebuka, yang mau
 * dilihat orang duluan itu petanya, bukan daftarnya.
 *
 * Aturan snap dan kecepatannya ada di lib/drawer-snap.ts.
 */

/**
 * Setinggi tab bar versi nempel di halaman ini (52px kotak + padding), bukan
 * versi ngambang yang dipakai halaman lain.
 */
const RUANG_NAV = "4.5rem";

/** Tinggi layar dibaca lewat store biar render di server nggak nyentuh window. */
function ikutiTinggiLayar(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

const WARNA_JENIS = {
  "Kos kamu": "bg-accent text-ink",
  Belanja: "bg-neutral-100 text-neutral-600",
  Makan: "bg-neutral-100 text-neutral-600",
  Jasa: "bg-neutral-100 text-neutral-600",
} as const;

export default function PetaKos() {
  const [aktif, setAktif] = useState<string | null>(null);
  const [mencari, setMencari] = useState(false);
  // null = belum digeser tangan, jadi tingginya ngikut ada-nggaknya pilihan.
  // Begitu digeser, angka inilah yang menang sampai pilihannya ganti.
  const [tinggiGeser, setTinggiGeser] = useState<number | null>(null);
  const [menggeser, setMenggeser] = useState(false);
  // Durasi animasi nyangkut, dihitung dari seberapa kencang lemparannya.
  const [durasiSnap, setDurasiSnap] = useState(260);
  const mulai = useRef<{ y: number; h: number } | null>(null);
  /** Jejak beberapa gerakan terakhir, buat ngitung kecepatan pas dilepas. */
  const jejak = useRef<{ t: number; y: number }[]>([]);
  /** Area daftar yang bisa di-scroll — dipakai buat mutusin tarikan siapa. */
  const isiRef = useRef<HTMLDivElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);
  /** Tinggi terakhir selama ditarik. Ref, bukan state — lihat tulisPosisi(). */
  const tinggiTarik = useRef(DRAWER_MIN);
  const framePending = useRef<number | null>(null);
  /**
   * Status "lagi ditarik" versi ref. Yang state cuma buat matiin transisi pas
   * render. Logikanya HARUS baca ref: kalau baca state, tarikan cepat bisa
   * bikin pointerup kepanggil sebelum render selesai — nilainya masih false,
   * snap-nya dilewat, dan drawer kelihatan nyangkut nggak mau gerak.
   */
  const sedangTarik = useRef(false);
  /**
   * Satu gestur cuma boleh jadi satu hal: narik drawer, atau nge-scroll daftar.
   * Ditentuin sekali di gerakan pertama, terus dipegang sampai jarinya lepas —
   * kalau dievaluasi ulang tiap gerakan, gestur bisa loncat-loncat sendiri.
   */
  const modeGeser = useRef<"belum" | "drawer" | "scroll">("belum");
  const scrollAwal = useRef(0);

  const terpilih = TEMPAT.find((t) => t.nama === aktif) ?? null;
  const tinggi = tinggiGeser ?? DRAWER_MIN;

  /**
   * Ganti pilihan → drawer balik ke tinggi terkecil biar peta yang kelihatan.
   * useCallback bukan buat gaya-gayaan: identitasnya dipakai peta yang dibungkus
   * memo, jadi kalau fungsinya baru tiap render, memo-nya nggak ada gunanya.
   */
  const pilih = useCallback((nama: string | null) => {
    setAktif(nama);
    setTinggiGeser(null);
  }, []);

  /** Dari layar cari: pilih tempatnya, tutup layarnya, peta terbang ke sana. */
  function pilihDariCari(nama: string) {
    pilih(nama);
    setMencari(false);
  }

  // Di server nilainya 0 — dan waktu itu drawer nggak boleh dianggap kebuka
  // penuh, makanya batasnya jadi tak hingga sampai angka aslinya kebaca.
  const tinggiLayar = useSyncExternalStore(
    ikutiTinggiLayar,
    () => window.innerHeight,
    () => 0,
  );
  const maks =
    tinggiLayar > 0 ? Math.round(tinggiLayar * DRAWER_MAX_VH) : DRAWER_MIN;
  const terbukaPenuh = tinggiLayar > 0 && tinggi >= maks - 2;

  /**
   * Drawer-nya SELALU setinggi maks; yang berubah cuma seberapa jauh dia
   * digeser turun. Ini yang bikin enteng di HP: transform ditangani compositor,
   * sementara nge-animasiin `height` maksa browser ngitung ulang layout tiap
   * frame — di HP itu langsung kerasa patah-patah.
   */
  function geseranPx(tinggiDrawer: number) {
    return Math.round(maks - tinggiDrawer);
  }

  /**
   * Selama jari masih nempel, posisinya ditulis langsung ke DOM lewat ref, dan
   * cuma sekali per frame. Kalau lewat state, tiap gerakan jari nge-render ulang
   * seluruh drawer — daftarnya, tombolnya, semua — puluhan kali per detik.
   */
  function tulisPosisi(tinggiBaru: number) {
    tinggiTarik.current = tinggiBaru;
    if (framePending.current !== null) return;

    framePending.current = requestAnimationFrame(() => {
      framePending.current = null;
      const el = drawerRef.current;
      if (el)
        el.style.transform = `translateY(${geseranPx(tinggiTarik.current)}px)`;
    });
  }

  /** Mulai narik drawer beneran: kunci pointer-nya dan matiin transisi. */
  function mulaiTarikDrawer(e: React.PointerEvent<HTMLDivElement>, y: number) {
    modeGeser.current = "drawer";
    sedangTarik.current = true;
    mulai.current = { y, h: tinggiTarik.current };
    jejak.current = [{ t: performance.now(), y }];
    e.currentTarget.setPointerCapture(e.pointerId);
    setMenggeser(true);
  }

  function geserMulai(e: React.PointerEvent<HTMLDivElement>) {
    mulai.current = { y: e.clientY, h: tinggi };
    tinggiTarik.current = tinggi;
    scrollAwal.current = isiRef.current?.scrollTop ?? 0;
    sedangTarik.current = false;
    modeGeser.current = "belum";
    jejak.current = [{ t: performance.now(), y: e.clientY }];
  }

  function geserJalan(e: React.PointerEvent<HTMLDivElement>) {
    if (!mulai.current) return;

    const sekarang = performance.now();
    jejak.current.push({ t: sekarang, y: e.clientY });
    // Cuma gerakan terakhir yang dipakai — kalau semua jejak dipakai, tarikan
    // pelan di awal bakal ngerem angka kecepatan pas akhir.
    jejak.current = jejak.current.filter((j) => sekarang - j.t <= JENDELA_MS);

    const delta = mulai.current.y - e.clientY;
    const isi = isiRef.current;

    if (modeGeser.current === "belum") {
      // Gerakan sependek ketukan diabaikan, biar ngetuk baris daftar tetap
      // kebaca sebagai ketukan.
      if (Math.abs(delta) < AMBANG_TARIK) return;

      // Daftarnya cuma berhak megang gestur kalau drawer udah kebuka penuh DAN
      // arah gerakannya masih mungkin dia layani. Selain itu, drawer yang jalan
      // — termasuk tarikan turun waktu daftarnya udah mentok di atas.
      const daftarBisaScroll =
        terbukaPenuh && isi && isi.scrollHeight > isi.clientHeight;
      const turun = delta < 0;
      const daftarUdahDiAtas = !isi || isi.scrollTop <= 0;

      if (daftarBisaScroll && !(turun && daftarUdahDiAtas)) {
        modeGeser.current = "scroll";
      } else {
        mulaiTarikDrawer(e, e.clientY);
      }
    }

    if (modeGeser.current === "scroll") {
      if (!isi) return;
      isi.scrollTop = scrollAwal.current + delta;

      // Daftarnya mentok di atas tapi jarinya masih turun → serahin ke drawer,
      // dan titik mulainya dihitung ulang dari sini biar nggak lompat.
      if (isi.scrollTop <= 0 && delta < 0) mulaiTarikDrawer(e, e.clientY);
      return;
    }

    tulisPosisi(jepit(mulai.current.h + delta, DRAWER_MIN, maks));
  }

  function geserSelesai() {
    if (!mulai.current) return;
    mulai.current = null;

    if (framePending.current !== null) {
      cancelAnimationFrame(framePending.current);
      framePending.current = null;
    }

    modeGeser.current = "belum";

    if (!sedangTarik.current) return;
    sedangTarik.current = false;
    setMenggeser(false);

    // Posisi terakhir diambil dari ref, bukan state — selama ditarik state-nya
    // memang sengaja nggak diapa-apain.
    const sekarang = tinggiTarik.current;
    const v = kecepatanDari(jejak.current, performance.now());
    const tujuan = tujuanSnap(sekarang, v, titikSnap(tinggiLayar));

    setDurasiSnap(hitungDurasiSnap(Math.abs(tujuan - sekarang), v));
    setTinggiGeser(tujuan);
  }

  return (
    // Nempel ke shell HP-nya, bukan ke seluruh layar — di browser desktop
    // petanya tetap selebar app, nggak melar ke mana-mana.
    <div className="fixed inset-0 mx-auto max-w-md">
      <div className="absolute inset-0">
        <PetaMaplibre aktif={aktif} onPilih={pilih} />
      </div>

      {/* Tombol balik ke kos sendiri. Di app peta ini gerakan paling sering
          dipakai: udah nyasar geser ke mana-mana, tinggal satu ketukan pulang. */}
      <button
        type="button"
        onClick={() => pilih(null)}
        aria-label="Balik ke kos"
        className="absolute left-4 top-safe-top z-10 mt-4 flex size-10 items-center justify-center rounded-full bg-background shadow-md transition-colors hover:bg-neutral-50"
      >
        <Crosshair className="size-[18px] text-ink" />
      </button>

      {/* Drawer nempel bawah, persis pola di aster: sudut atas dibulatin,
          bayangannya ke atas, dan tingginya ditarik lewat handle. */}
      <div
        ref={drawerRef}
        onPointerDown={geserMulai}
        onPointerMove={geserJalan}
        onPointerUp={geserSelesai}
        onPointerCancel={geserSelesai}
        className="absolute inset-x-0 bottom-0 z-10 flex flex-col overflow-hidden rounded-t-2xl bg-background shadow-[0_-8px_30px_rgba(0,0,0,0.15)]"
        style={{
          height: maks,
          // Yang dirender React cuma posisi hasil snap. Selama jari nempel,
          // nilai ini ditimpa langsung di DOM tiap frame — dan nggak ada render
          // lain yang kejadian di tengah gestur, jadi nggak bakal nyentak.
          transform: `translateY(${geseranPx(tinggi)}px)`,
          // Pas lagi ditarik, posisinya ngikut jari tanpa transisi. Begitu
          // dilepas, baru dianimasiin ke titik snap — durasinya dari kecepatan
          // lemparan, easing-nya yang ngerem di ujung.
          transition: menggeser
            ? "none"
            : `transform ${Math.round(durasiSnap)}ms cubic-bezier(0.22, 1, 0.36, 1)`,
          // Kasih tahu browser dari awal supaya drawer-nya dinaikin ke layer
          // sendiri, bukan pas gerakan pertama (yang bikin frame awal nyendat).
          willChange: "transform",
          // Semua gerakan jari di drawer ini punya kita, browser nggak ikut
          // campur. Scroll daftarnya pun dijalanin sendiri di geserJalan().
          //
          // Dulu area daftarnya dikasih "pan-y" biar browser yang nge-scroll,
          // dan itu justru sumber bug-nya: begitu browser mutusin gestur ini
          // scroll, dia kirim pointercancel dan tarikan drawer batal di tengah
          // jalan — kerasa nyangkut, dan cuma garis handle yang jalan konsisten.
          touchAction: "none",
        }}
      >
        <div className="shrink-0 cursor-ns-resize px-4 pb-1.5 pt-2.5">
          <div className="mx-auto h-1 w-9 rounded-full bg-neutral-300" />
        </div>

        <div
          ref={isiRef}
          // overflow-y-auto tetap perlu — bukan biar browser yang nge-scroll
          // (sentuhannya udah dimatiin di induknya), tapi supaya elemen ini
          // punya scrollTop yang bisa kita geser sendiri, dan supaya roda mouse
          // di desktop tetap jalan seperti biasa.
          className={cn(
            "flex-1 overscroll-contain px-4",
            terbukaPenuh ? "overflow-y-auto" : "overflow-hidden",
          )}
          style={{
            // Tab bar ada di atas drawer ini, jadi isinya disisain ruang segitu
            // — kalau nggak, baris terakhir ketutup navbar.
            paddingBottom: `calc(${RUANG_NAV} + env(safe-area-inset-bottom))`,
          }}
        >
          {terpilih ? (
            <div>
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-ink" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-ink">
                    {terpilih.nama}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-neutral-500">
                    {terpilih.alamat} · {terpilih.jarak}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => pilih(null)}
                  aria-label="Tutup"
                  className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 transition-colors hover:bg-neutral-200"
                >
                  <X className="size-3" />
                </button>
              </div>

              <div className="mt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setMencari(true)}
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-neutral-200 text-[13px] font-semibold text-ink transition-colors hover:bg-neutral-50"
                >
                  <Search className="size-3.5" />
                  Cari lagi
                </button>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${terpilih.latitude},${terpilih.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[13px] font-semibold text-white transition-colors hover:bg-neutral-800"
                >
                  <Navigation className="size-3.5" />
                  Rute
                </a>
              </div>
            </div>
          ) : (
            <div>
              {/* Nempel di atas pas daftarnya di-scroll. -mx-4/px-4 biar
                  background-nya nutup selebar drawer, bukan cuma selebar
                  tombol — kalau nggak, baris yang lewat di baliknya keintip. */}
              <div className="sticky top-0 z-10 -mx-4 bg-background px-4 pb-2">
                <button
                  type="button"
                  onClick={() => setMencari(true)}
                  className="flex w-full items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-4 py-2.5 text-left text-[13px] text-neutral-400 transition-colors hover:bg-neutral-100"
                >
                  <Search className="size-4 shrink-0 text-neutral-400" />
                  Cari warung, laundry, minimarket…
                </button>
              </div>

              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                Sekitar sini
              </p>
              <ul className="mt-2 space-y-1.5">
                {TEMPAT.map((tempat) => (
                  <li key={tempat.nama}>
                    <button
                      type="button"
                      onClick={() => pilih(tempat.nama)}
                      className="flex w-full items-center gap-2.5 rounded-xl border border-neutral-200 px-3 py-2 text-left transition-colors hover:bg-neutral-50"
                    >
                      <MapPin className="size-3.5 shrink-0 text-neutral-400" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium text-ink">
                          {tempat.nama}
                        </span>
                        <span className="block truncate text-[11px] text-neutral-400">
                          {tempat.alamat}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium",
                          WARNA_JENIS[tempat.jenis],
                        )}
                      >
                        {tempat.jarak}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Layar cari nutup semuanya — termasuk tab bar — persis kayak mode
          pencarian di app peta pada umumnya. */}
      {mencari ? (
        <CariTempat onPilih={pilihDariCari} onTutup={() => setMencari(false)} />
      ) : null}
    </div>
  );
}
