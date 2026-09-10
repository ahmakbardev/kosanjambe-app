import type { Metadata } from "next";
import AuthBackground from "@/app/components/auth-background";
import OtpForm from "./otp-form";

export const metadata: Metadata = {
  title: "Masukin kode — kosanjambe",
};

export default function KodePage() {
  return (
    <main className="relative flex flex-1 flex-col">
      {/* Foto yang sama tapi lebih pendek — di layar ini yang penting formnya,
          fotonya tinggal jaga suasananya biar nggak putus dari layar sebelumnya. */}
      <div className="relative h-[26dvh] min-h-[170px] shrink-0 overflow-hidden">
        <AuthBackground />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-5 pb-9 pt-safe-top">
          <p className="text-[13px] font-medium text-accent">kosanjambe</p>
          <h1 className="mt-1 text-[22px] font-medium tracking-tight text-white">
            Cek SMS kamu
          </h1>
        </div>
      </div>

      <div className="relative -mt-6 flex-1 rounded-t-3xl bg-background px-5 pb-safe-bottom pt-6">
        <OtpForm />
      </div>
    </main>
  );
}
