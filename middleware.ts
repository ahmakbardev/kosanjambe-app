import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

/**
 * Cuma ngarahin lalu lintas, BUKAN pengaman — cookie-nya dummy dan gampang
 * dipalsuin (lihat lib/session.ts). Begitu ada backend, halaman yang berisi
 * data beneran tetap harus mastiin sesinya sendiri di server.
 */
/** Halaman "buka di aplikasi" — nggak ada urusan sama sesi, siapa pun boleh. */
const HALAMAN_GATE = "/buka-di-app";

export function middleware(request: NextRequest) {
  const punyaSesi = request.cookies.has(SESSION_COOKIE);
  const { pathname } = request.nextUrl;
  const diHalamanMasuk = pathname.startsWith("/masuk");

  // Dilewatin duluan: kalau ikut aturan di bawah, orang yang belum punya sesi
  // bakal dilempar ke /masuk dan halaman gate-nya nggak pernah kelihatan.
  if (pathname === HALAMAN_GATE) return NextResponse.next();

  // Udah masuk tapi balik ke layar login — lempar ke beranda.
  if (punyaSesi && diHalamanMasuk) {
    return NextResponse.redirect(new URL("/beranda", request.url));
  }

  // Belum masuk tapi maksa ke halaman dalam.
  if (!punyaSesi && !diHalamanMasuk) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }

  return NextResponse.next();
}

export const config = {
  /**
   * Cuma halaman yang dicegat. Apa pun yang punya ekstensi file dilewatin —
   * manifest.webmanifest, sw.js, icon.svg, gambar, semuanya.
   *
   * Dulu daftarnya ditulis satu-satu dan itu masalah: manifest sama service
   * worker ikut kena, dibalas redirect ke /masuk, dan PWA-nya jadi nggak bisa
   * dipasang sama sekali — Chrome cuma dapat halaman login, bukan manifest.
   */
  matcher: ["/((?!_next|.*\\.).*)"],
};
