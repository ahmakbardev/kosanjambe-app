/**
 * DUMMY. Semua isi file ini karangan, cuma buat ngejalanin alurnya sebelum
 * `api/` ada. Begitu backend jalan, file ini dihapus dan diganti services/ —
 * jangan ada komponen yang nyimpen asumsi bentuk data selain dari sini.
 */

/** Kode OTP yang dianggap bener. Yang lain bakal ditolak, biar state gagalnya kelihatan. */
export const DUMMY_OTP = "123456";

/** Berapa kali boleh salah sebelum disuruh minta kode baru. */
export const MAX_OTP_ATTEMPTS = 3;

/** Jeda sebelum tombol "Kirim ulang" nyala lagi. */
export const RESEND_COOLDOWN_SECONDS = 60;

export type Penghuni = {
  nama: string;
  kos: string;
  kamar: string;
  masuk: string;
};

export type Tagihan = {
  periode: string;
  jumlah: number;
  jatuhTempo: string;
  lunas: boolean;
};

export type Laporan = {
  judul: string;
  status: "Dilaporin" | "Dikerjain" | "Beres";
  tanggal: string;
};

export const PENGHUNI: Penghuni = {
  nama: "Rizky Ramadhan",
  kos: "Kos Melati Residence",
  kamar: "Kamar 12",
  masuk: "1 Agustus 2026",
};

export const TAGIHAN: Tagihan = {
  periode: "Oktober 2026",
  jumlah: 850_000,
  jatuhTempo: "5 Oktober 2026",
  lunas: false,
};

/** Bulan-bulan yang udah lewat, buat halaman Tagihan. */
export const RIWAYAT_TAGIHAN: Tagihan[] = [
  {
    periode: "September 2026",
    jumlah: 850_000,
    jatuhTempo: "5 September 2026",
    lunas: true,
  },
  {
    periode: "Agustus 2026",
    jumlah: 850_000,
    jatuhTempo: "5 Agustus 2026",
    lunas: true,
  },
];

export const LAPORAN: Laporan[] = [
  { judul: "Keran kamar mandi bocor", status: "Dikerjain", tanggal: "8 Sep" },
  { judul: "Wi-Fi lantai 2 putus-putus", status: "Beres", tanggal: "2 Sep" },
];

export type Banner = {
  id: string;
  tag: "Pengumuman" | "Promo" | "Tips";
  judul: string;
  teks: string;
  gambar: string;
};

/**
 * Isi banner di beranda. Tiga jenis, dan ketiganya sengaja beda sumber:
 * - Pengumuman → dari pemilik kos, ini yang bikin banner-nya dibuka orang
 * - Promo      → dari warung/laundry sekitar, sekalian jalan duit nanti
 * - Tips       → artikel yang udah ada di web/, tinggal ditarik
 */
export const BANNER: Banner[] = [
  {
    id: "air",
    tag: "Pengumuman",
    judul: "Air mati Sabtu, 09.00–12.00",
    teks: "Ada perbaikan pompa. Tampung air dari malam sebelumnya ya.",
    gambar: "/images/banner-1.jpg",
  },
  {
    id: "laundry",
    tag: "Promo",
    judul: "Laundry Kilat diskon 20%",
    teks: "Khusus penghuni Kos Melati, tinggal tunjukin app ini.",
    gambar: "/images/banner-2.jpg",
  },
  {
    id: "hemat",
    tag: "Tips",
    judul: "5 cara hemat listrik di kamar",
    teks: "Biar tagihan bulanan nggak bengkak gara-gara hal sepele.",
    gambar: "/images/banner-3.jpg",
  },
];

/**
 * Hal-hal yang paling sering ditanyain anak kos baru. Wi-Fi dipisah karena
 * dia bukan cuma info — sandinya buat disalin.
 */
export const INFO_KOS = {
  wifi: { ssid: "Melati-2G", sandi: "melati2026" },
  jamTamu: "sampai 21.00",
  kebersihan: "Selasa & Jumat",
} as const;

export type Tempat = {
  nama: string;
  jenis: "Kos kamu" | "Belanja" | "Makan" | "Jasa";
  alamat: string;
  jarak: string;
  longitude: number;
  latitude: number;
};

/**
 * Titik-titik di peta. Koordinatnya ngarang di sekitar Jalan Jombang, Malang —
 * cukup buat ngeliat peta jalan, tapi jangan dipakai buat navigasi beneran.
 */
export const TEMPAT: Tempat[] = [
  {
    nama: "Kos Melati Residence",
    jenis: "Kos kamu",
    alamat: "Jl. Jombang No. 12",
    jarak: "0 m",
    longitude: 112.6146,
    latitude: -7.9553,
  },
  {
    nama: "Indomaret Jombang",
    jenis: "Belanja",
    alamat: "Jl. Jombang No. 2",
    jarak: "180 m",
    longitude: 112.6163,
    latitude: -7.9548,
  },
  {
    nama: "Warung Bu Sri",
    jenis: "Makan",
    alamat: "Gang 2, Jl. Jombang",
    jarak: "240 m",
    longitude: 112.6132,
    latitude: -7.9569,
  },
  {
    nama: "Laundry Kilat",
    jenis: "Jasa",
    alamat: "Jl. Jombang No. 27",
    jarak: "310 m",
    longitude: 112.6171,
    latitude: -7.9572,
  },
  {
    nama: "Fotokopi Sinar",
    jenis: "Jasa",
    alamat: "Jl. Bendungan Sutami",
    jarak: "450 m",
    longitude: 112.6118,
    latitude: -7.9531,
  },
];

/** 850000 -> "Rp850.000" */
export function rupiah(nominal: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nominal);
}
