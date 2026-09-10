"use client";

import { useState, type SubmitEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Button from "@/app/components/ui/button";
import { webUrl } from "@/lib/site";
import { simpanNomorPending } from "@/lib/session";
import { startCooldown } from "@/lib/otp-cooldown";
import { RESEND_COOLDOWN_SECONDS } from "@/lib/dummy";
import { formatPhone, isValidPhone, MAX_FORMATTED_LENGTH } from "@/lib/phone";

/** Google's mark. Not in lucide — it ships brand logos separately. */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[18px]" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.2-2.2H12v4h6.6c-.1 1.1-.9 2.8-2.5 3.9l3.8 3c2.3-2.1 3.6-5.2 3.6-8.7Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-2.9l-3.8-3c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5l-3.9 3C3.2 21.3 7.3 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.1 14.3c-.3-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-4-3C.4 8.3 0 10.1 0 12s.4 3.7 1.1 5.3l4-3Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c2.3 0 3.8 1 4.7 1.8l3.4-3.3C18 1.2 15.2 0 12 0 7.3 0 3.2 2.7 1.1 6.7l4 3c1-2.9 3.7-5 6.9-5Z"
      />
    </svg>
  );
}

export default function LoginForm() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const valid = isValidPhone(phone);

  function handleChange(value: string) {
    // formatPhone sekalian motong di 12 digit, jadi field-nya nggak bisa diisi
    // lebih panjang dari nomor HP beneran.
    setPhone(formatPhone(value));
    setNotice(null);
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || sending) return;

    setSending(true);

    // DUMMY: nanti diganti endpoint kirim-OTP. Jedanya sengaja dipertahankan
    // supaya state loading-nya kelihatan seperti nanti waktu beneran nunggu server.
    await new Promise((resolve) => setTimeout(resolve, 600));

    simpanNomorPending(phone);
    // Kodenya dianggap terkirim di sini, jadi cooldown-nya mulai dari sini juga
    // — bukan pas layar OTP kebuka, biar bolak-balik nggak nge-reset hitungan.
    startCooldown(RESEND_COOLDOWN_SECONDS);
    router.push("/masuk/kode");
  }

  return (
    <div className="space-y-5">
      <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="phone" className="block text-sm font-medium text-ink">
          Nomor HP
        </label>

        <div
          className={cn(
            "flex items-center rounded-2xl border bg-white transition-colors",
            "focus-within:border-ink",
            phone && !valid ? "border-red-300" : "border-neutral-200",
          )}
        >
          <span className="select-none py-3 pl-3.5 pr-2 text-[15px] text-neutral-500">
            +62
          </span>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="812-3456-7890"
            maxLength={MAX_FORMATTED_LENGTH}
            value={phone}
            onChange={(e) => handleChange(e.target.value)}
            // 15px, bukan 14: di bawah 16px iOS nge-zoom sendiri pas field-nya
            // difokus, dan 15 masih cukup deket buat nggak kerasa gede.
            className="w-full bg-transparent py-3 pr-3.5 text-[15px] tracking-wide outline-none placeholder:text-neutral-300"
          />
        </div>

        <p className="text-xs text-neutral-400">
          Kita kirim kode 6 digit lewat SMS. Nggak ada password buat diinget.
        </p>

        <Button type="submit" disabled={!valid || sending} className="w-full">
          {sending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Ngirim kode…
            </>
          ) : (
            <>
              Lanjut
              <ArrowRight className="size-4" />
            </>
          )}
        </Button>

        {notice && (
          <p
            role="status"
            className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-700"
          >
            {notice}
          </p>
        )}
      </form>

      <div className="flex items-center gap-3">
        <span className="h-px flex-1 bg-neutral-200" />
        <span className="text-xs text-neutral-400">atau</span>
        <span className="h-px flex-1 bg-neutral-200" />
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setNotice("Login Google nyusul bareng server-nya.")}
        className="w-full gap-2.5 font-medium"
      >
        <GoogleIcon />
        Masuk pakai Google
      </Button>

      <p className="text-center text-xs leading-5 text-neutral-400">
        Pertama kali masuk, akun kamu langsung dibuatin. Lanjut berarti kamu
        setuju sama{" "}
        <Link
          href={webUrl("/cara-sewa")}
          className="underline underline-offset-2 hover:text-neutral-600"
        >
          ketentuan kosanjambe
        </Link>
        .
      </p>
    </div>
  );
}
