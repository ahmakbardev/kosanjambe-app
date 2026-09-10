import BottomNav from "@/app/components/bottom-nav";

/**
 * Layout buat halaman di balik login. Layar /masuk sengaja di luar grup ini —
 * orang yang belum masuk nggak punya apa-apa buat dituju di tab bar.
 */
export default function AppLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      {/* Ruang buat tab bar yang ngambang: tinggi pill + jaraknya dari bawah +
          safe-area HP, ditambah sedikit napas biar konten terakhir nggak
          ngepas banget di balik blur-nya. */}
      <div className="flex-1 pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
        {children}
      </div>
      <BottomNav />
    </>
  );
}
