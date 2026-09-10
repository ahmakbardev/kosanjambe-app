"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, MapPin, Wallet, Wrench, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/beranda", label: "Beranda", icon: House },
  // Dompet, bukan struk: tanpa label, "bayar" kebaca lebih cepat daripada
  // "dokumen" — struk gampang dikira riwayat.
  { href: "/tagihan", label: "Tagihan", icon: Wallet },
  // Persis di tengah dari lima tab.
  { href: "/peta", label: "Peta", icon: MapPin },
  { href: "/laporan", label: "Laporan", icon: Wrench },
  { href: "/akun", label: "Akun", icon: User },
] as const;

/**
 * Tab bar bawah — konvensi app, bukan navbar atas. Posisinya fixed ke viewport
 * tapi lebarnya dikunci max-w-md biar tetap nempel sama shell HP-nya waktu
 * dibuka di browser desktop.
 *
 * Ikon doang, tanpa label. Labelnya tetap ada di aria-label — kalau nggak,
 * pembaca layar cuma dapat "link" tanpa tahu link ke mana.
 */
export default function BottomNav() {
  const pathname = usePathname();

  /**
   * Di halaman peta tab bar-nya nempel: full width, background solid, nggak
   * ngambang. Petanya makan seluruh layar, dan pill transparan yang ngambang di
   * atas peta bikin ikonnya susah kebaca.
   */
  const diPeta = pathname === "/peta" || pathname.startsWith("/peta/");

  return (
    // Ngambang: nggak nempel ke sisi mana pun. Wrapper-nya yang fixed dan
    // ngasih jarak; pill di dalamnya yang kelihatan.
    <nav
      className={cn(
        "pointer-events-none fixed inset-x-0 bottom-0 z-20 transition-[padding] duration-300 ease-out",
        diPeta ? "pb-0" : "pb-[calc(1rem+env(safe-area-inset-bottom))]",
      )}
    >
      <div
        className={cn(
          "mx-auto max-w-md transition-[padding] duration-300 ease-out",
          diPeta ? "px-0" : "px-4",
        )}
      >
        {/*
          Pindah antar dua bentuk ini dianimasiin, jadi tiap properti yang beda
          HARUS punya nilai panjang di dua-duanya — `w-fit` ke `w-full` nggak
          bisa dianimasiin karena `auto` bukan panjang. Makanya lebarnya diatur
          lewat max-width (288px ↔ 448px) dengan w-full di dua mode.

          Radius juga: 30px = setengah tinggi pill, bentuknya sama persis kayak
          rounded-full tapi bisa nyusut mulus ke 0. Kalau pakai 9999px, radiusnya
          bakal nyangkut gede sampai detik terakhir baru njeplak.
        */}
        <ul
          className={cn(
            // justify-center di DUA mode, bukan justify-around pas nempel:
            // dengan justify-around tiap ikon kebagian jarak yang beda pas
            // lebarnya berubah, jadi kelihatan geser kanan-kiri. Dipusatin
            // begini, ikon tengah (Peta) diam di tempat dan sisanya cuma
            // mengembang-nyusut simetris ke arahnya.
            "pointer-events-auto mx-auto flex w-full justify-center backdrop-blur-md",
            "transition-[max-width,gap,padding,border-radius,background-color,box-shadow,border-color] duration-300 ease-out",
            diPeta
              ? "max-w-md gap-3 rounded-none border border-transparent border-t-neutral-200 bg-background px-2 pb-[calc(0.375rem+env(safe-area-inset-bottom))] pt-1.5 shadow-none"
              : "bg-background/90 max-w-[288px] gap-1 rounded-[30px] border border-neutral-200/80 p-1 shadow-[0_8px_30px_-8px_rgba(0,0,0,0.18)]",
          )}
        >
          {TABS.map((tab, i) => {
            // Cocokin juga halaman di dalamnya, misal /laporan/12 tetap bikin
            // tab Laporan nyala.
            const aktif =
              pathname === tab.href || pathname.startsWith(`${tab.href}/`);
            const Icon = tab.icon;
            const pertama = i === 0;
            const terakhir = i === TABS.length - 1;

            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-label={tab.label}
                  aria-current={aktif ? "page" : undefined}
                  className={cn(
                    // 52px persegi dengan ikon 20px = 16px ruang ngelilingin
                    // ikon di tiap sisi. Kotaknya yang dibesarin, bukan
                    // cangkangnya, biar navbar-nya sendiri tetap ramping.
                    "flex size-[52px] items-center justify-center",
                    // Radius ikut berubah pas modenya ganti, jadi ikut
                    // dianimasiin bareng cangkangnya.
                    "transition-[background-color,color,border-radius] duration-300 ease-out",
                    // 26px = setengah dari 52px, jadi sisi luarnya setengah
                    // lingkaran pas. JANGAN pakai rounded-l/r-full di sini: itu
                    // 9999px, dan begitu satu sisi minta lebih panjang dari
                    // sisinya sendiri, CSS nyusutin SEMUA radius elemen itu
                    // dengan faktor yang sama — sudut di seberangnya ikut
                    // keremuk jadi nol alias siku.
                    // Di mode nempel nggak ada cangkang melengkung yang perlu
                    // diikutin, jadi keempat sudutnya sama.
                    diPeta && "rounded-[16px]",
                    !diPeta && pertama && "rounded-l-[26px] rounded-r-[16px]",
                    !diPeta && terakhir && "rounded-l-[16px] rounded-r-[26px]",
                    !diPeta && !pertama && !terakhir && "rounded-[16px]",
                    aktif
                      ? "bg-ink text-white"
                      : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600",
                  )}
                >
                  <Icon className="size-5" strokeWidth={aktif ? 2.2 : 1.8} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
