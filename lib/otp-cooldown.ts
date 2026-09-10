/**
 * Cooldown tombol "Kirim ulang", disimpan sebagai WAKTU HABIS (epoch ms), bukan
 * sisa detik. Kalau yang disimpan sisa detik, refresh halaman langsung nge-reset
 * hitungannya dan tombolnya bisa dispam — dan tiap kiriman OTP itu ada
 * ongkosnya begitu SMS/WhatsApp beneran nyala.
 *
 * Dibungkus jadi store kecil supaya bisa dibaca lewat useSyncExternalStore:
 * server render dapat 0, client dapat isi sessionStorage, tanpa setState di
 * dalam effect dan tanpa hydration mismatch.
 */

const KEY = "kj_otp_cooldown";

const listeners = new Set<() => void>();

export function subscribeCooldown(onChange: () => void) {
  listeners.add(onChange);
  return () => {
    listeners.delete(onChange);
  };
}

/** Epoch ms kapan cooldown-nya habis. 0 = lagi nggak ada cooldown. */
export function getCooldownExpiry(): number {
  return Number(sessionStorage.getItem(KEY) ?? 0);
}

/** Di server nggak ada sessionStorage, dan itu bukan masalah — React bakal
 *  render ulang pakai nilai client begitu selesai hydrate. */
export function getServerCooldownExpiry(): number {
  return 0;
}

export function startCooldown(seconds: number) {
  sessionStorage.setItem(KEY, String(Date.now() + seconds * 1000));
  listeners.forEach((notify) => notify());
}

/** Sisa detik, dibulatkan ke atas. */
export function sisaDetik(expiry: number): number {
  return Math.max(0, Math.ceil((expiry - Date.now()) / 1000));
}
