"use client";

import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { Loader2, PencilLine } from "lucide-react";
import { cn } from "@/lib/utils";
import { ambilNomorPending, masuk } from "@/lib/session";
import { toE164 } from "@/lib/phone";
import {
  getCooldownExpiry,
  getServerCooldownExpiry,
  sisaDetik,
  startCooldown,
  subscribeCooldown,
} from "@/lib/otp-cooldown";
import {
  DUMMY_OTP,
  MAX_OTP_ATTEMPTS,
  RESEND_COOLDOWN_SECONDS,
} from "@/lib/dummy";

const PANJANG = 6;

/** Nomor pending nggak pernah berubah selama layar ini kebuka, jadi nggak ada
 *  yang perlu di-subscribe — cukup baca sekali per render. */
const tanpaSubscribe = () => () => {};

export default function OtpForm() {
  const router = useRouter();
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  const [digits, setDigits] = useState<string[]>(Array(PANJANG).fill(""));
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sisaPercobaan, setSisaPercobaan] = useState(MAX_OTP_ATTEMPTS);

  // Nomornya dibawa dari layar sebelumnya lewat sessionStorage.
  const phone = useSyncExternalStore(
    tanpaSubscribe,
    ambilNomorPending,
    () => null,
  );

  const expiry = useSyncExternalStore(
    subscribeCooldown,
    getCooldownExpiry,
    getServerCooldownExpiry,
  );

  // Cukup nyuruh render ulang tiap detik; angkanya dihitung dari waktu habis,
  // jadi countdown-nya tetap bener walau tab-nya sempat ditinggal.
  const [, tick] = useReducer((n: number) => n + 1, 0);
  useEffect(() => {
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  const cooldown = sisaDetik(expiry);

  // Buka URL ini langsung tanpa lewat layar nomor — nggak ada yang bisa
  // diverifikasi, balikin ke awal.
  useEffect(() => {
    if (phone === null) router.replace("/masuk");
  }, [phone, router]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const verifikasi = useCallback(
    async (kodeMasuk: string) => {
      if (checking) return;
      setChecking(true);
      setError(null);

      // DUMMY: nanti diganti panggilan ke endpoint verifikasi OTP.
      await new Promise((resolve) => setTimeout(resolve, 700));

      if (kodeMasuk === DUMMY_OTP) {
        masuk(phone ?? "");
        router.replace("/beranda");
        return;
      }

      const sisa = sisaPercobaan - 1;
      setSisaPercobaan(sisa);
      setChecking(false);
      setDigits(Array(PANJANG).fill(""));
      inputs.current[0]?.focus();

      setError(
        sisa > 0
          ? `Kodenya salah. Sisa ${sisa} percobaan lagi.`
          : "Percobaan habis. Minta kode baru ya.",
      );
    },
    [checking, phone, router, sisaPercobaan],
  );

  /** Chrome Android bisa ngisi kodenya sendiri dari SMS, tanpa user buka
   *  aplikasi SMS. Kalau browsernya nggak dukung, ya nggak terjadi apa-apa. */
  useEffect(() => {
    if (!("OTPCredential" in window)) return;

    const controller = new AbortController();

    navigator.credentials
      .get({
        // @ts-expect-error — WebOTP belum masuk lib.dom TypeScript.
        otp: { transport: ["sms"] },
        signal: controller.signal,
      })
      .then((cred) => {
        const code = (cred as unknown as { code?: string })?.code;
        if (!code) return;
        setDigits(code.slice(0, PANJANG).split(""));
        void verifikasi(code.slice(0, PANJANG));
      })
      .catch(() => {
        // Dibatalin atau nggak dapat SMS — user ketik manual.
      });

    return () => controller.abort();
  }, [verifikasi]);

  function isiDari(index: number, value: string) {
    const angka = value.replace(/\D/g, "");
    if (!angka) return;

    // Nerima paste 6 digit sekaligus: sebarin dari kotak yang lagi aktif.
    const next = [...digits];
    for (let i = 0; i < angka.length && index + i < PANJANG; i++) {
      next[index + i] = angka[i];
    }
    setDigits(next);
    setError(null);

    const terisiSampai = Math.min(index + angka.length, PANJANG - 1);
    inputs.current[terisiSampai]?.focus();

    // Auto-submit begitu enam-enamnya kepenuhan — nggak usah mencet tombol.
    const gabung = next.join("");
    if (gabung.length === PANJANG && !next.includes("")) {
      void verifikasi(gabung);
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key !== "Backspace") return;

    const next = [...digits];
    if (next[index]) {
      next[index] = "";
      setDigits(next);
      return;
    }
    // Kotaknya udah kosong — mundur satu, hapus di sana.
    if (index > 0) {
      next[index - 1] = "";
      setDigits(next);
      inputs.current[index - 1]?.focus();
    }
  }

  function kirimUlang() {
    if (cooldown > 0) return;
    startCooldown(RESEND_COOLDOWN_SECONDS);
    setSisaPercobaan(MAX_OTP_ATTEMPTS);
    setDigits(Array(PANJANG).fill(""));
    setError(null);
    inputs.current[0]?.focus();
    // DUMMY: nanti panggil endpoint kirim-ulang di sini.
  }

  const habis = sisaPercobaan <= 0;

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[13px] text-neutral-500">
          Kode 6 digit udah dikirim ke
        </p>
        <p className="mt-1 flex items-center gap-2 text-[15px] font-semibold text-ink">
          {phone ? toE164(phone) : "…"}
          <button
            type="button"
            onClick={() => router.replace("/masuk")}
            className="inline-flex items-center gap-1 text-xs font-medium text-neutral-400 underline underline-offset-2 hover:text-neutral-600"
          >
            <PencilLine className="size-3" />
            Ganti nomor
          </button>
        </p>
      </div>

      <div className="flex gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            // Cuma yang pertama, biar iOS nggak nawarin kode di enam kotak sekaligus.
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={PANJANG}
            value={digit}
            disabled={checking || habis}
            onChange={(e) => isiDari(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e.key)}
            onFocus={(e) => e.target.select()}
            className={cn(
              // text-lg (18px) masih di atas 16px, jadi iOS nggak nge-zoom
              // paksa waktu kotaknya difokus.
              "h-12 w-full rounded-xl border text-center text-lg font-semibold tabular-nums outline-none transition-colors",
              error
                ? "border-red-300 bg-red-50 text-red-600"
                : "border-neutral-200 bg-white focus:border-ink",
              (checking || habis) && "opacity-60",
            )}
          />
        ))}
      </div>

      {checking && (
        <p className="flex items-center gap-2 text-[13px] text-neutral-500">
          <Loader2 className="size-3.5 animate-spin" />
          Ngecek kode…
        </p>
      )}

      {error && !checking && (
        <p role="alert" className="text-[13px] text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between text-[13px]">
        <span className="text-neutral-400">Nggak nerima kodenya?</span>
        <button
          type="button"
          onClick={kirimUlang}
          disabled={cooldown > 0}
          className={cn(
            "font-semibold transition-colors",
            cooldown > 0
              ? "cursor-not-allowed text-neutral-300"
              : "text-ink underline underline-offset-4",
          )}
        >
          {cooldown > 0 ? `Kirim ulang (${cooldown}s)` : "Kirim ulang"}
        </button>
      </div>

      <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-700">
        Mode dummy: belum ada SMS yang dikirim. Ketik{" "}
        <span className="font-semibold">{DUMMY_OTP}</span> buat masuk, atau
        angka lain buat lihat state gagalnya.
      </p>
    </div>
  );
}
