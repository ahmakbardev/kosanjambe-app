"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, MapPin, Search, X } from "lucide-react";
import { TEMPAT, type Tempat } from "@/lib/dummy";

/**
 * Ketikan dipecah per kata, terus disambung pakai `.*` — jadi "warung sri"
 * tetap ketemu "Warung Bu Sri", dan urutan kata tetap dihargai. Sama seperti
 * pencarian di project aster.
 */
function bikinRegex(q: string): RegExp {
  const bagian = q
    .trim()
    .split(/\s+/)
    .map((p) => p.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

  return new RegExp(bagian.join(".*"), "i");
}

/** Nandain potongan teks yang cocok sama ketikan. */
function Sorot({ teks, regex }: { teks: string; regex: RegExp | null }) {
  if (!regex) return <>{teks}</>;

  const cocok = regex.exec(teks);
  if (!cocok) return <>{teks}</>;

  const mulai = cocok.index;
  const habis = mulai + cocok[0].length;

  return (
    <>
      {teks.slice(0, mulai)}
      <mark className="bg-accent/50 font-semibold text-ink">
        {teks.slice(mulai, habis)}
      </mark>
      {teks.slice(habis)}
    </>
  );
}

export default function CariTempat({
  onPilih,
  onTutup,
}: {
  onPilih: (nama: string) => void;
  onTutup: () => void;
}) {
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);

  // Keyboard-nya langsung kebuka, jadi orang nggak perlu ketuk dua kali.
  useEffect(() => {
    const t = setTimeout(() => input.current?.focus(), 120);
    return () => clearTimeout(t);
  }, []);

  const regex = useMemo(
    () => (query.trim() ? bikinRegex(query) : null),
    [query],
  );

  const hasil: Tempat[] = useMemo(
    () =>
      regex
        ? TEMPAT.filter((t) => regex.test(t.nama) || regex.test(t.alamat))
        : TEMPAT,
    [regex],
  );

  return (
    <div className="animate-sheet-up absolute inset-0 z-30 flex flex-col bg-background">
      {/* Safe-area doang nggak cukup: di HP tanpa notch dan di browser desktop
          nilainya 0, jadi headernya mepet banget ke atas. Dikasih jarak tetap
          14px, ditambah safe-area kalau memang ada. */}
      <div className="flex items-center gap-2 border-b border-neutral-200 px-3 pb-3 pt-[calc(env(safe-area-inset-top)+0.875rem)]">
        <button
          type="button"
          onClick={onTutup}
          aria-label="Kembali"
          className="flex size-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-neutral-100"
        >
          <ChevronLeft className="size-5 text-ink" />
        </button>

        <div className="flex flex-1 items-center gap-2 rounded-full bg-neutral-100 px-3.5">
          <Search className="size-4 shrink-0 text-neutral-400" />
          <input
            ref={input}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari warung, laundry, minimarket…"
            // 15px biar iOS nggak nge-zoom paksa waktu field-nya difokus.
            className="w-full bg-transparent py-2.5 text-[15px] outline-none placeholder:text-neutral-400"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                input.current?.focus();
              }}
              aria-label="Hapus ketikan"
              className="flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-300 text-white"
            >
              <X className="size-3" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-safe-bottom">
        {hasil.length === 0 ? (
          <p className="px-5 py-10 text-center text-[13px] text-neutral-400">
            Nggak ketemu &ldquo;{query}&rdquo;. Coba kata lain?
          </p>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {hasil.map((tempat) => (
              <li key={tempat.nama}>
                <button
                  type="button"
                  onClick={() => onPilih(tempat.nama)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-neutral-50"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    <MapPin className="size-4 text-neutral-500" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-ink">
                      <Sorot teks={tempat.nama} regex={regex} />
                    </span>
                    <span className="block truncate text-[12px] text-neutral-400">
                      <Sorot teks={tempat.alamat} regex={regex} />
                    </span>
                  </span>
                  <span className="shrink-0 text-[11px] text-neutral-400">
                    {tempat.jarak}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
