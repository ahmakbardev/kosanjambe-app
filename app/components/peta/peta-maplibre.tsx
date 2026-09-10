"use client";

import { memo, useEffect, useRef } from "react";
import Map, {
  Marker,
  NavigationControl,
  type MapRef,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { cn } from "@/lib/utils";
import { TEMPAT, type Tempat } from "@/lib/dummy";

/** Basemap CARTO — gratis dan nggak perlu API key. */
const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json";

/** Kos-nya jadi pusat, bukan kota — app ini cuma ngurus satu lingkungan. */
const KOS = TEMPAT[0];
const ZOOM_AWAL = 15.5;
const ZOOM_TERPILIH = 17;

function Pin({ tempat, aktif }: { tempat: Tempat; aktif: boolean }) {
  const kos = tempat.jenis === "Kos kamu";

  return (
    <span
      className={cn(
        "block origin-bottom cursor-pointer transition-transform",
        aktif ? "scale-110" : "hover:scale-105",
      )}
    >
      <svg
        width={kos ? 34 : 28}
        height={kos ? 44 : 36}
        viewBox="0 0 30 40"
        className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]"
        aria-hidden
      >
        <path
          d="M15 0C6.7 0 0 6.7 0 15c0 10.6 15 25 15 25s15-14.4 15-25C30 6.7 23.3 0 15 0z"
          // Kos pakai warna merek, tempat lain gelap — biar sekali lihat ketahuan
          // mana rumah sendiri.
          fill={kos ? "#e4ee64" : aktif ? "#141414" : "#525252"}
        />
        <circle cx="15" cy="15" r="6" fill={kos ? "#141414" : "#ffffff"} />
      </svg>
    </span>
  );
}

export type PetaProps = {
  aktif: string | null;
  onPilih: (nama: string | null) => void;
};

function PetaMaplibre({ aktif, onPilih }: PetaProps) {
  const mapRef = useRef<MapRef | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const tujuan = TEMPAT.find((t) => t.nama === aktif);
    map.flyTo({
      center: tujuan
        ? [tujuan.longitude, tujuan.latitude]
        : [KOS.longitude, KOS.latitude],
      zoom: tujuan ? ZOOM_TERPILIH : ZOOM_AWAL,
      // Digeser ke atas biar pin-nya nggak ketutup drawer di bawah. Angkanya
      // kira-kira setengah tinggi drawer waktu ada tempat kepilih.
      offset: [0, -110],
      duration: 900,
      essential: true,
    });
  }, [aktif]);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: KOS.longitude,
        latitude: KOS.latitude,
        zoom: ZOOM_AWAL,
      }}
      mapStyle={MAP_STYLE}
      style={{ width: "100%", height: "100%" }}
      attributionControl={false}
      // Ketuk peta di luar pin = batal pilih, kayak app peta pada umumnya.
      onClick={() => onPilih(null)}
    >
      <NavigationControl position="top-right" showCompass={false} />

      {TEMPAT.map((tempat) => (
        <Marker
          key={tempat.nama}
          longitude={tempat.longitude}
          latitude={tempat.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onPilih(tempat.nama);
          }}
        >
          <Pin tempat={tempat} aktif={tempat.nama === aktif} />
        </Marker>
      ))}
    </Map>
  );
}

/**
 * Dibungkus memo: drawer di sebelahnya sering render ulang, dan tiap render
 * peta ini ikut kena padahal isinya nggak berubah. Bareng pilih() yang dibikin
 * stabil pakai useCallback, peta jadi cuma render ulang waktu pilihannya ganti.
 */
export default memo(PetaMaplibre);
