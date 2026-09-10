import type { Metadata } from "next";
import AuthBackground from "@/app/components/auth-background";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Masuk — kosanjambe",
};

export default function MasukPage() {
  return (
    <main className="relative flex flex-1 flex-col">
      {/* Photo half. The sheet below overlaps it, so this stays taller than it
          looks — the bottom strip sits behind the rounded corners. */}
      <div className="relative h-[46dvh] min-h-[260px] shrink-0 overflow-hidden">
        <AuthBackground />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="relative flex h-full flex-col justify-end px-5 pb-11 pt-safe-top">
          <p className="text-[13px] font-medium text-accent">kosanjambe</p>
          <h1 className="mt-1 text-[26px] font-medium leading-tight tracking-tight text-white">
            Urusan kos kamu,
            <br />
            beres dari HP
          </h1>
          <p className="mt-2 max-w-[18rem] text-[13px] leading-5 text-white/75">
            Masuk dulu buat lihat tagihan, lapor kalau ada yang rusak, dan
            ngobrol sama pemilik kos.
          </p>
        </div>
      </div>

      {/* Form sheet, pulled up over the photo. */}
      <div className="relative -mt-6 flex-1 rounded-t-3xl bg-background px-5 pb-safe-bottom pt-6">
        <LoginForm />
      </div>
    </main>
  );
}
