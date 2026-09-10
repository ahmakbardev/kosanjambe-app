"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { keluar } from "@/lib/session";

export default function TombolKeluar() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => {
        keluar();
        // refresh() biar middleware jalan lagi dan cache halaman dalam dibuang.
        router.replace("/masuk");
        router.refresh();
      }}
      className="flex items-center gap-2 text-[13px] font-medium text-neutral-400 transition-colors hover:text-neutral-600"
    >
      <LogOut className="size-3.5" />
      Keluar
    </button>
  );
}
