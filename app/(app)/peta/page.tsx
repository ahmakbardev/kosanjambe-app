import type { Metadata } from "next";
import PetaKos from "@/app/components/peta/peta-kos";

export const metadata: Metadata = {
  title: "Peta — kosanjambe",
};

/**
 * Halaman peta full screen. Beda sama halaman lain yang di-scroll: di sini
 * petanya yang ngisi layar, dan daftar tempatnya naik-turun di drawer.
 */
export default function PetaPage() {
  return <PetaKos />;
}
