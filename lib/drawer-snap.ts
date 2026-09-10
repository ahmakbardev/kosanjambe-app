/**
 * Aturan gestur drawer peta: ke tinggi mana dia nyangkut setelah dilepas, dan
 * seberapa lama animasinya. Dipisah dari komponennya karena ini logika angka
 * murni — gampang diuji, dan nggak perlu browser buat mastiin bener.
 */

/** Tinggi paling mepet, dalam piksel. */
export const DRAWER_MIN = 196;
/** Persinggahan tengah dan batas atas, dalam porsi tinggi layar. */
export const DRAWER_MID_VH = 0.45;
export const DRAWER_MAX_VH = 0.72;

/**
 * Ambang kecepatan lempar, piksel per milidetik.
 *
 * Di bawah PELAN, lepasan dianggap cuma "naruh" — nyangkut ke titik terdekat.
 * Di atas itu dianggap lemparan: maju satu tingkat ke arah lemparannya, jadi
 * nggak perlu narik jauh-jauh. Di atas KENCANG, langsung mentok ke ujung.
 */
export const LEMPAR_PELAN = 0.45;
export const LEMPAR_KENCANG = 1.4;

/** Sampel gerakan yang lebih tua dari ini dibuang waktu ngitung kecepatan. */
export const JENDELA_MS = 120;

/** Gerakan di bawah ini masih dianggap ketukan, bukan tarikan. */
export const AMBANG_TARIK = 6;

export function jepit(nilai: number, bawah: number, atas: number): number {
  return Math.min(atas, Math.max(bawah, nilai));
}

/** Tiga tinggi yang bisa disinggahi drawer, urut dari paling mepet. */
export function titikSnap(tinggiLayar: number): number[] {
  return [
    DRAWER_MIN,
    Math.max(DRAWER_MIN + 40, Math.round(tinggiLayar * DRAWER_MID_VH)),
    Math.max(DRAWER_MIN + 80, Math.round(tinggiLayar * DRAWER_MAX_VH)),
  ];
}

/**
 * Kecepatan tarikan dalam piksel per milidetik, positif kalau tangannya naik
 * (drawer digedein). Sampel yang dikirim harus urut dari lama ke baru.
 */
export function kecepatanDari(
  jejak: { t: number; y: number }[],
  sekarangMs: number,
): number {
  const dipakai = jejak.filter((j) => sekarangMs - j.t <= JENDELA_MS);
  if (dipakai.length < 2) return 0;

  const awal = dipakai[0];
  const akhir = dipakai[dipakai.length - 1];
  const dt = akhir.t - awal.t;
  if (dt <= 0) return 0;

  return (awal.y - akhir.y) / dt;
}

/** Tinggi tujuan setelah tarikan dilepas. */
export function tujuanSnap(
  tinggiSekarang: number,
  kecepatan: number,
  titik: number[],
): number {
  const naik = kecepatan > 0;
  const laju = Math.abs(kecepatan);

  if (laju >= LEMPAR_KENCANG) {
    return naik ? titik[titik.length - 1] : titik[0];
  }

  if (laju >= LEMPAR_PELAN) {
    // +-4px biar titik yang lagi diduduki nggak kepilih lagi sebagai "tingkat
    // berikutnya" gara-gara beda pembulatan.
    return naik
      ? (titik.find((t) => t > tinggiSekarang + 4) ?? titik[titik.length - 1])
      : ([...titik].reverse().find((t) => t < tinggiSekarang - 4) ?? titik[0]);
  }

  return titik.reduce((a, b) =>
    Math.abs(b - tinggiSekarang) < Math.abs(a - tinggiSekarang) ? b : a,
  );
}

/**
 * Makin kencang lemparannya, makin singkat animasinya — biar kerasa nyambung
 * sama gerakan tangannya, bukan mulai dari nol lagi.
 */
export function durasiSnap(jarak: number, kecepatan: number): number {
  return jepit(jarak / Math.max(Math.abs(kecepatan), 0.6), 160, 380);
}
