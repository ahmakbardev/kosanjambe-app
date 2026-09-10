/**
 * DUMMY session. Cuma penanda "udah masuk" di cookie — nggak ada token, nggak
 * ada verifikasi, dan gampang dipalsuin dari devtools. Itu nggak apa-apa
 * sekarang, tapi JANGAN dipakai buat ngunci apa pun yang beneran rahasia.
 *
 * Waktu `api/` jadi: ganti isinya jadi httpOnly cookie dari server, dan
 * middleware.ts tinggal baca nama cookie yang sama.
 */

export const SESSION_COOKIE = "kj_sesi";

/** Nomor yang lagi nunggu OTP. Sengaja di sessionStorage, bukan URL — nomor HP
 *  nggak usah nangkring di address bar dan kebawa waktu link di-share. */
export const PENDING_PHONE_KEY = "kj_hp_pending";

const MAX_AGE_DAYS = 30;

export function masuk(phone: string) {
  const maxAge = MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${SESSION_COOKIE}=${encodeURIComponent(phone)}; path=/; max-age=${maxAge}; samesite=lax`;
  sessionStorage.removeItem(PENDING_PHONE_KEY);
}

export function keluar() {
  document.cookie = `${SESSION_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export function simpanNomorPending(phone: string) {
  sessionStorage.setItem(PENDING_PHONE_KEY, phone);
}

export function ambilNomorPending(): string | null {
  return sessionStorage.getItem(PENDING_PHONE_KEY);
}
